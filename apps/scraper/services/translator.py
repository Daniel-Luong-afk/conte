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

CLIENTS = {
    "JP": {"client": qwen_client, "model": "qwen-mt-plus"},
    "KR": {"client": qwen_client, "model": "qwen-mt-plus"},
    "CN": {"client": deepseek_client, "model": "deepseek-chat"},
}


def translate(
    content_raw: str, language: str, system_prompt: str, user_prompt: str
) -> dict:
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

    return {
        "content_translated": response.choices[0].message.content,
        "cost": response.usage.prompt_tokens + response.usage.completion_tokens,
    }
