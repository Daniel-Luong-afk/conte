from scraper.parsers.syosetu import SyosetuParser

parser = SyosetuParser()
res = parser.fetch_chapter("https://ncode.syosetu.com/n0473gc/1/")
print("TITLE:", res["title"])
print("CONTENT PREVIEW:", res["content"][:200])
