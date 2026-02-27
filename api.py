from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import re
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

SUBSCRIPTION_KEYS = {
    "sub-basic-001": {"plan": "basic", "request_limit": 100, "requests_used": 0},
    "sub-basic-002": {"plan": "basic", "request_limit": 100, "requests_used": 0},
    "sub-pro-001": {"plan": "pro", "request_limit": 1000, "requests_used": 0},
    "sub-pro-002": {"plan": "pro", "request_limit": 1000, "requests_used": 0},
    "sub-enterprise-001": {"plan": "enterprise", "request_limit": 10000, "requests_used": 0},
}

app = FastAPI(
    title="RouteLLM API",
    description="Route prompts to different AI models based on complexity",
    version="1.0.0"
)

class RouteRequest(BaseModel):
    prompt: str
    subscription_key: str

class RouteResponse(BaseModel):
    response: str
    model_used: str
    tokens_used: int
    cost_usd: float
    requests_remaining: int

class SubscriptionInfo(BaseModel):
    subscription_key: str
    plan: str
    request_limit: int
    requests_used: int
    requests_remaining: int

def count_words(text):
    words = text.split()
    return len(words)

def has_code(prompt):
    code_patterns = [
        r'```',
        r'def\s+\w+\s*\(',
        r'function\s+\w+',
        r'import\s+\w+',
        r'from\s+\w+\s+import',
        r'class\s+\w+',
        r'for\s+\w+\s+in',
        r'while\s*\(',
        r'if\s*\(',
        r'print\s*\(',
        r'return\s+',
        r'\{\s*\}',
        r';\s*$',
        r'==|!=|<=|>=',
        r'->',
        r'::',
    ]
    for pattern in code_patterns:
        if re.search(pattern, prompt):
            return True
    return False

def has_complex_keywords(prompt):
    complex_keywords = [
        'explain', 'how does', 'why does', 'write',
        'create', 'analyze', 'compare', 'difference between',
        'debug', 'implement'
    ]
    prompt_lower = prompt.lower()
    for keyword in complex_keywords:
        if keyword in prompt_lower:
            return True
    return False

def is_simple(prompt):
    word_count = count_words(prompt)

    if word_count >= 50:
        print(f"[CLASSIFY] Prompt has {word_count} words (>= 50) -> COMPLEX")
        return False

    if has_code(prompt):
        print("[CLASSIFY] Prompt contains code -> COMPLEX")
        return False

    if has_complex_keywords(prompt):
        print("[CLASSIFY] Prompt contains complex keywords -> COMPLEX")
        return False

    print(f"[CLASSIFY] Prompt classified as: SIMPLE ({word_count} words)")
    return True

def call_openrouter(prompt, model):
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}]
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"OpenRouter API error: {response.text}"
        )

    result = response.json()
    response_text = result["choices"][0]["message"]["content"]
    usage = result.get("usage", {})
    prompt_tokens = usage.get("prompt_tokens", 0)
    completion_tokens = usage.get("completion_tokens", 0)
    total_tokens = usage.get("total_tokens", 0)

    return response_text, prompt_tokens, completion_tokens, total_tokens

def calculate_cost(model, prompt_tokens, completion_tokens):
    prices_per_million = {
        "google/gemma-3-4b-it:free": {"prompt": 0.0, "completion": 0.0},
        "stepfun/step-3.5-flash:free": {"prompt": 0.0, "completion": 0.0},
    }

    if model not in prices_per_million:
        return 0.0

    price = prices_per_million[model]
    prompt_cost = (prompt_tokens / 1_000_000) * price["prompt"]
    completion_cost = (completion_tokens / 1_000_000) * price["completion"]
    return prompt_cost + completion_cost

@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "RouteLLM API is running",
        "endpoints": {
            "POST /route": "Send a prompt to AI",
            "GET /subscription/{key}": "Check subscription usage",
            "GET /docs": "API documentation"
        }
    }

@app.post("/route", response_model=RouteResponse)
async def route_prompt(request: RouteRequest):
    sub_key = request.subscription_key

    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    if sub_key not in SUBSCRIPTION_KEYS:
        raise HTTPException(status_code=401, detail="Invalid subscription key")

    subscription = SUBSCRIPTION_KEYS[sub_key]

    if subscription["requests_used"] >= subscription["request_limit"]:
        raise HTTPException(
            status_code=429,
            detail=f"Request limit reached. Used {subscription['requests_used']}/{subscription['request_limit']} requests."
        )

    if is_simple(request.prompt):
        model = "google/gemma-3-4b-it:free"
        print("[CLASSIFY] Prompt classified as: SIMPLE -> using google/gemma-3-4b-it:free")
    else:
        model = "stepfun/step-3.5-flash:free"
        print("[CLASSIFY] Prompt classified as: COMPLEX -> using stepfun/step-3.5-flash:free")

    response_text, prompt_tokens, completion_tokens, total_tokens = call_openrouter(
        request.prompt, model
    )

    subscription["requests_used"] += 1
    cost = calculate_cost(model, prompt_tokens, completion_tokens)
    requests_remaining = subscription["request_limit"] - subscription["requests_used"]

    return RouteResponse(
        response=response_text,
        model_used=model,
        tokens_used=total_tokens,
        cost_usd=cost,
        requests_remaining=requests_remaining
    )

@app.get("/subscription/{subscription_key}", response_model=SubscriptionInfo)
async def get_subscription_info(subscription_key: str):
    if subscription_key not in SUBSCRIPTION_KEYS:
        raise HTTPException(status_code=404, detail="Subscription key not found")

    subscription = SUBSCRIPTION_KEYS[subscription_key]
    requests_remaining = subscription["request_limit"] - subscription["requests_used"]

    return SubscriptionInfo(
        subscription_key=subscription_key,
        plan=subscription["plan"],
        request_limit=subscription["request_limit"],
        requests_used=subscription["requests_used"],
        requests_remaining=requests_remaining
    )

@app.get("/subscriptions")
async def list_subscriptions():
    return {
        "subscriptions": [
            {
                "key": key,
                "plan": data["plan"],
                "limit": data["request_limit"],
                "used": data["requests_used"],
                "remaining": data["request_limit"] - data["requests_used"]
            }
            for key, data in SUBSCRIPTION_KEYS.items()
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
