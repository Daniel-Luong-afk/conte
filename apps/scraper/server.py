from flask import Flask, request, jsonify, Response
from scraper.tasks.scrape import discover_chapters

app = Flask(__name__)


@app.route("/scrape", methods=["POST"])
def trigger_scrape() -> Response:
    data = request.json

    response = discover_chapters.delay(
        data["source_id"],
        data["source_url"],
        data["novel_id"],
        data["site_name"],
    )

    return jsonify({"task_id": response.id})


if __name__ == "__main__":
    app.run(port=5001)
