from flask import Flask, request, jsonify, Response
from scraper.tasks.scrape import scrape_chapter

app = Flask(__name__)


@app.route("/scrape", methods=["POST"])
def trigger_scrape() -> Response:
    data = request.json

    response = scrape_chapter.delay(
        data["url"],
        data["novel_id"],
        data["chapter_number"],
        data["source_id"],
        data["site_name"],
    )

    return jsonify({"task_id": response.id})


if __name__ == "__main__":
    app.run(port=5001)
