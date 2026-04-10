import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))


def get_context(novel_id: str, chapter_number: int) -> dict:
    with get_connection() as connection:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(
            """SELECT context_summary FROM "Chapter"
            WHERE novel_id = %s
            AND chapter_number < %s
            AND translation_status = 'DONE'
            ORDER BY chapter_number DESC
            LIMIT 3""",
            (
                novel_id,
                chapter_number,
            ),
        )
        summaries = cursor.fetchall()
        summaries = [
            row["context_summary"] for row in summaries if row["context_summary"]
        ]
        summaries.reverse()

        seam = None
        if chapter_number > 1:
            cursor.execute(
                """SELECT content_translated FROM "Chapter" WHERE novel_id=%s AND chapter_number=%s""",
                (
                    novel_id,
                    chapter_number - 1,
                ),
            )
            prev_chapter = cursor.fetchone()

            seam = (
                prev_chapter["content_translated"][-500:]
                if prev_chapter["content_translated"]
                else None
            )

        return {"summaries": summaries, "seam": seam}
