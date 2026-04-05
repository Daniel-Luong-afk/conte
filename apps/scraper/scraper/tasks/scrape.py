from scraper.celery_app import celery_app
from scraper.parsers.syosetu import SyosetuParser
from scraper.db import get_connection
import uuid
import httpx

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

    connection = get_connection()
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
    connection.close()

    return {"status": "ok", "title": result["title"]}
