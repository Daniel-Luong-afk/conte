from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

deepseek_client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com"
)

qwen_client = OpenAI(
    api_key=os.getenv("QWEN_API_KEY"),
    base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
)

# CLIENTS = {
#     "JP": {"client": qwen_client, "model": "qwen-mt-plus"},
#     "KR": {"client": qwen_client, "model": "qwen-mt-plus"},
#     "CN": {"client": deepseek_client, "model": "deepseek-chat"},
# }

CLIENTS = {
    "JP": {"client": deepseek_client, "model": "deepseek-chat"},
    "KR": {"client": deepseek_client, "model": "deepseek-chat"},
    "CN": {"client": deepseek_client, "model": "deepseek-chat"},
}


def translate(language: str, system_prompt: str, user_prompt: str) -> dict:
    if language not in ("JP", "KR", "CN"):
        return None

    route = CLIENTS.get(language)
    client = route["client"]
    model = route["model"]

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        stream=False,
    )
    content_translated = response.choices[0].message.content
    cost = response.usage.prompt_tokens + response.usage.completion_tokens
    summary = generate_summary(content_translated=content_translated, language=language)

    return {
        "content_translated": content_translated,
        "cost": cost,
        "summary": summary,
    }


def generate_summary(content_translated: str, language: str) -> str:
    if language not in ("JP", "KR", "CN"):
        return None

    route = CLIENTS.get(language)
    client = route["client"]
    model = route["model"]

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": "You are a summarizer. Summarize the chapter in exactly 150 words.",
            },
            {"role": "user", "content": f"Summarize this: {content_translated}"},
        ],
        stream=False,
    )
    return response.choices[0].message.content
