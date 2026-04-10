def build_prompts(
    config: dict,
    context: dict,
    content_raw: str,
    source_lang: str = "Japanese",
    target_lang: str = "English",
) -> dict:
    return {
        "user": f"Translate from {source_lang} to {target_lang}: {content_raw}",
        "system": f"""Here is the context of the novel you are about to translate, follow it carefully:
        Character Bible: {config.get("character_bible")},
        Translation Style: {config.get("translation_style")},
        Cultural Setting: {config.get("cultural_setting")},
        Glossary: {config.get("glossary")},
        Summaries from the last 3 chapters: {context.get("summaries")},
        Seam from the last chapter: {context.get("seam")}""",
    }
