import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))


def get_novel_config(novel_id: str) -> dict:
    with get_connection() as connection:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(
            """SELECT character_bible, translation_style, cultural_setting FROM "Novel" WHERE id=%s""",
            (novel_id,),
        )
        context = cursor.fetchone()
        return {
            "character_bible": context["character_bible"] or {},
            "translation_style": context["translation_style"],
            "cultural_setting": context["cultural_setting"],
            "glossary": get_novel_glossary(novel_id),
        }


def get_novel_glossary(novel_id: str) -> list:
    with get_connection() as connection:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(
            """SELECT novel_id, term_original, term_translated, notes FROM "GlossaryTerm"
            WHERE novel_id=%s""",
            (novel_id,),
        )
        novel_glossary = cursor.fetchall()

        return novel_glossary if novel_glossary else []
