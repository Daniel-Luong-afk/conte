from scraper.celery_app import celery_app
from scraper.parsers.syosetu import SyosetuParser
from scraper.db import get_connection
import uuid


@celery_app.task
def scrape_chapter(
    url: str, novel_id: str, chapter_number: int, source_id: str
) -> None:
    # TODO: Check for which site are we using
    result = SyosetuParser().fetch_chapter(url)

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
