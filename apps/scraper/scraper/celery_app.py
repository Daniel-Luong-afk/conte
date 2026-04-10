from celery import Celery
import os
from dotenv import load_dotenv
from celery.schedules import crontab

load_dotenv()

celery_app = Celery(
    "scraper",
    broker=os.getenv("REDIS_URL"),
    backend=os.getenv("REDIS_URL"),
    include=["scraper.tasks.scrape"],
)

celery_app.conf.update(
    beat_schedule={
        "scrape-all-active-sources": {
            "task": "scraper.tasks.scrape.scrape_chapter",
            "schedule": crontab(minute=0, hour="*/6"),
            "args": [],
        },
        "translate-chapter": {
            "task": "scraper.tasks.scrape.translate_chapter",
            "schedule": crontab(minute="*/10", hour="*"),
            "args": [],
        },
    },
    timezone="UTC",
)
