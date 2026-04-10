from scraper.celery_app import celery_app
from scraper.parsers.syosetu import SyosetuParser
from services.character_bible import get_novel_config
from services.context_manager import get_context
from services.prompt_builder import build_prompts
from services.llm_client import translate
from services.db import save_translation, update_chapter_status
import uuid
import httpx
import psycopg2.extras
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))


PARSERS: dict = {"syosetu": SyosetuParser}


@celery_app.task(
    autoretry_for=(httpx.HTTPError,), max_retries=3, default_retry_delay=60
)
def scrape_chapter(
    url: str, novel_id: str, chapter_number: int, source_id: str, site_name: str
) -> dict:

    parser_class = PARSERS.get(site_name)
    if not parser_class:
        raise ValueError(f"Site: {site_name} isn't supported")
    result = parser_class().fetch_chapter(url)

    with get_connection() as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO "Chapter"
                    (id, novel_id, source_id, chapter_number, title_original, content_raw)
                    VALUES (%s, %s, %s, %s, %s, %s)""",
            (
                str(uuid.uuid4()),
                novel_id,
                source_id,
                chapter_number,
                result["title"],
                result["content"],
            ),
        )
        connection.commit()

        return {"status": "ok", "title": result["title"]}


@celery_app.task(
    autoretry_for=(httpx.HTTPError,), max_retries=3, default_retry_delay=60
)
def translate_chapter() -> dict:

    with get_connection() as connection:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cursor.execute("""SELECT c.id, c.novel_id, c.chapter_number, c.content_raw, n.language
                       FROM "Chapter" c
                       JOIN "Novel" n ON n.id = c.novel_id
                       WHERE c.translation_status = 'PENDING'
                       LIMIT 1
                       FOR UPDATE SKIP LOCKED""")
        chapter = cursor.fetchone()

        if not chapter:
            return {"status": "ok", "chapter_id": None}

        cursor.execute(
            """UPDATE "Chapter"
            SET translation_status = 'PROCESSING'
            WHERE id = %s""",
            (chapter["id"],),
        )
        connection.commit()

        config = get_novel_config(chapter["novel_id"])
        context = get_context(
            novel_id=chapter["novel_id"], chapter_number=chapter["chapter_number"]
        )
        prompts = build_prompts(
            config=config,
            context=context,
            content_raw=chapter["content_raw"],
            source_lang=chapter["language"],
        )
        content = translate(
            language=chapter["language"],
            system_prompt=prompts["system"],
            user_prompt=prompts["user"],
        )
        save_translation(
            chapter_id=chapter["id"],
            content_translated=content["content_translated"],
            translation_cost=content["cost"],
            context_summary=content["summary"],
        )
        update_chapter_status(chapter_id=chapter["id"], status="DONE")

        return {"status": "ok", "chapter_id": chapter["id"]}
