import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))


def get_chapter(chapter_id: str) -> dict:
    with get_connection() as connection:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(
            """SELECT id, novel_id, content_raw FROM "Chapter" WHERE id=%s""",
            (chapter_id,),
        )
        chapter = cursor.fetchone()

        return (
            {
                "id": chapter["id"],
                "novel_id": chapter["novel_id"],
                "content_raw": chapter["content_raw"],
            }
            if chapter
            else None
        )


def save_translation(
    chapter_id: str,
    content_translated: str,
    context_summary: str,
    translation_cost: float,
) -> dict:
    with get_connection() as connection:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(
            """UPDATE "Chapter"
            SET content_translated = %s,
                context_summary = %s,
                translation_cost = %s
            WHERE id=%s""",
            (
                content_translated,
                context_summary,
                translation_cost,
                chapter_id,
            ),
        )
        connection.commit()

        return {
            "chapter_id": chapter_id,
            "status": "ok",
            "message": "Save translation successfully",
        }


def update_chapter_status(chapter_id: str, status: str) -> dict:
    with get_connection() as connection:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(
            """UPDATE "Chapter"
            SET translation_status = %s
            WHERE id=%s""",
            (
                status,
                chapter_id,
            ),
        )
        connection.commit()

        return {
            "chapter_id": chapter_id,
            "status": "ok",
            "message": "Update status successfully",
        }
