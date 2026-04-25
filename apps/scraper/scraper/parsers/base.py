class BaseParser:
    def fetch(self, url: str) -> str:
        raise NotImplementedError

    def parse(self, html: str) -> dict:
        raise NotImplementedError

    def fetch_chapter(self, url: str) -> dict:
        html = self.fetch(url)
        return self.parse(html)

    def parse_toc(self, html: str) -> list[dict]:
        raise NotImplementedError
