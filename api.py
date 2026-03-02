from supabase import create_client
import os
import secrets
import string
import bcrypt

supabase = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY")
)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import re
import uvicorn
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

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

class SignupRequest(BaseModel):
    email: str

class SignupResponse(BaseModel):
    subscription_key: str
    email: str
    plan: str
    token_limit: int

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
            "POST /signup": "Register a new user and get subscription key",
            "POST /route": "Send a prompt to AI",
            "GET /subscription/{key}": "Check subscription usage",
            "GET /docs": "API documentation"
        }
    }

@app.post("/signup")
async def signup(data: dict):
    try:
        email = data.get("email", "")
        password = data.get("password", "")[:72]
        if not email:
            return {"error": "Email required"}
        from supabase import create_client
        sb = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
        # Always check existing first
        existing = sb.table("users").select("*").eq("email", email).execute()
        if existing.data:
            user = existing.data[0]
            # Update password if provided
            if password:
                from passlib.context import CryptContext
                pwd_context = CryptContext(schemes=["bcrypt"])
                sb.table("users").update({"password_hash": pwd_context.hash(password)}).eq("email", email).execute()
            return {
                "subscription_key": user["subscription_key"],
                "plan": user.get("plan", "free"),
                "token_limit": user.get("token_limit", 500000),
                "email": email
            }
        # New user — create fresh key
        import secrets
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"])
        new_key = "sk-rl-" + secrets.token_hex(16)
        password_hash = pwd_context.hash(password) if password else None
        sb.table("users").insert({
            "email": email,
            "subscription_key": new_key,
            "plan": "free",
            "tokens_used": 0,
            "token_limit": 500000,
            "password_hash": password_hash
        }).execute()
        return {
            "subscription_key": new_key,
            "plan": "free",
            "token_limit": 500000,
            "email": email
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/login")
async def login(data: dict):
    try:
        email = data.get("email", "")
        password = data.get("password", "")[:72]
        if not email:
            return {"error": "Email required"}
        from supabase import create_client
        sb = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
        result = sb.table("users").select("*").eq("email", email).execute()
        if not result.data:
            return {"error": "No account found with this email"}
        user = result.data[0]
        if user.get("password_hash") and password:
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"])
            if not pwd_context.verify(password, user["password_hash"]):
                return {"error": "Invalid password"}
        return {
            "subscription_key": user["subscription_key"],
            "plan": user.get("plan", "free"),
            "email": email
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/route")
async def route_prompt(data: dict):
    subscription_key = data.get("subscription_key", "")
    prompt = data.get("prompt", "")
    print(f"Route called with key: '{subscription_key}' and prompt: '{prompt[:50]}'")

    if not prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    user_data = supabase.table("users").select("*").eq("subscription_key", subscription_key).execute()
    
    if not user_data.data:
        raise HTTPException(status_code=401, detail="Invalid subscription key")
    
    user = user_data.data[0]
    tokens_used = user.get("tokens_used", 0)
    token_limit = user.get("token_limit", 500000)
    
    if tokens_used >= token_limit:
        raise HTTPException(
            status_code=429,
            detail=f"Token limit reached. Used {tokens_used}/{token_limit} tokens."
        )

    if is_simple(prompt):
        model = "google/gemma-3-4b-it:free"
        print("[CLASSIFY] Prompt classified as: SIMPLE -> using google/gemma-3-4b-it:free")
    else:
        model = "stepfun/step-3.5-flash:free"
        print("[CLASSIFY] Prompt classified as: COMPLEX -> using stepfun/step-3.5-flash:free")

    response_text, prompt_tokens, completion_tokens, total_tokens = call_openrouter(
        prompt, model
    )

    new_tokens_used = tokens_used + total_tokens
    supabase.table("users").update({"tokens_used": new_tokens_used}).eq("subscription_key", subscription_key).execute()
    
    cost = calculate_cost(model, prompt_tokens, completion_tokens)
    tokens_remaining = token_limit - new_tokens_used

    prompt_type = "simple" if is_simple(prompt) else "complex"
    model_used = model
    cost_usd = cost

    supabase.table("requests").insert({
        "subscription_key": subscription_key,
        "prompt_type": prompt_type,
        "model_used": model_used,
        "tokens_used": total_tokens,
        "cost_usd": cost_usd
    }).execute()
    print(f"Saved to Supabase with key: '{subscription_key}'")

    return {
        "response": response_text,
        "model_used": model,
        "tokens_used": total_tokens,
        "cost_usd": cost,
        "requests_remaining": tokens_remaining
    }

@app.get("/subscription/{subscription_key}")
async def get_subscription_info(subscription_key: str):
    user_data = supabase.table("users").select("*").eq("subscription_key", subscription_key).execute()
    
    if not user_data.data:
        raise HTTPException(status_code=404, detail="Subscription key not found")
    
    user = user_data.data[0]
    tokens_used = user.get("tokens_used", 0)
    token_limit = user.get("token_limit", 500000)
    tokens_remaining = token_limit - tokens_used
    
    requests_data = supabase.table("requests").select("id").eq("subscription_key", subscription_key).execute()
    requests_used = len(requests_data.data)
    
    return {
        "subscription_key": subscription_key,
        "plan": user.get("plan", "free"),
        "token_limit": token_limit,
        "tokens_used": tokens_used,
        "tokens_remaining": tokens_remaining,
        "requests_used": requests_used,
    }

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

@app.get("/stats/{subscription_key}")
async def get_stats(subscription_key: str):
    try:
        from supabase import create_client
        sb = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
        requests_data = sb.table("requests").select("*").eq("subscription_key", subscription_key).execute()
        rows = requests_data.data or []
        total_requests = len(rows)
        total_tokens = sum(r.get("tokens_used", 0) for r in rows)
        total_cost = sum(r.get("cost_usd", 0.0) for r in rows)
        total_savings = total_tokens * 0.000005
        recent = sorted(rows, key=lambda x: x.get("created_at",""), reverse=True)[:10]
        return {
            "total_requests": total_requests,
            "total_tokens": total_tokens,
            "total_cost": round(total_cost, 6),
            "total_savings": round(total_savings, 4),
            "recent_requests": recent
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
