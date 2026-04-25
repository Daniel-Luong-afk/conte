import re
from bs4 import BeautifulSoup
from scraper.parsers.base import BaseParser
import httpx


class SyosetuParser(BaseParser):
    def fetch(self, url: str) -> str:
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        res = httpx.get(url, headers=headers)
        return res.text if res else ""

    def parse(self, html: str) -> dict:
        soup = BeautifulSoup(html, "html.parser")
        title_tag = soup.find("h1", class_="p-novel__title--rensai")
        title = title_tag.get_text() if title_tag else ""
        content_div = soup.find("div", class_="js-novel-text")
        if content_div:
            paragraphs = content_div.find_all("p")
            content = "\n".join([p.get_text() for p in paragraphs])
        else:
            content = ""
        return {"title": title, "content": content}

    def parse_toc(self, html: str) -> list[dict]:
        soup = BeautifulSoup(html, "html.parser")
        links = soup.find_all("a", class_="p-eplist__subtitle")
        chapters = []
        for link in links:
            href = link.get("href", "")
            match = re.search(r"/(\d+)/?$", href)
            if match:
                chapters.append(
                    {
                        "url": "https://ncode.syosetu.com" + href,
                        "chapter_number": int(match.group(1)),
                    }
                )
        return chapters
