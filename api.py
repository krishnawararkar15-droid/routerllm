from supabase import create_client
import os
import secrets
import string
import bcrypt
import httpx

supabase = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY")
)

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import requests
import re
import uvicorn
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

async def send_budget_alert_email(email: str, tokens_used: int, token_limit: int, plan: str):
    percentage = round((tokens_used / token_limit) * 100, 1)
    tokens_remaining = token_limit - tokens_used

    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0d14; color: #ffffff; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">⚠️ LLMLite Budget Alert</h1>
        </div>

        <div style="background: #1a1f2e; border: 1px solid #374151; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 14px;">TOKEN USAGE</p>
            <p style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0;">{percentage}% used</p>
            <div style="background: #374151; border-radius: 4px; height: 8px; margin-top: 12px;">
                <div style="background: {'#ef4444' if percentage >= 90 else '#f59e0b'}; width: {percentage}%; height: 8px; border-radius: 4px;"></div>
            </div>
        </div>

        <div style="display: flex; gap: 16px; margin-bottom: 24px;">
            <div style="flex: 1; background: #1a1f2e; border: 1px solid #374151; border-radius: 8px; padding: 16px;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0 0 4px 0;">TOKENS USED</p>
                <p style="color: #ffffff; font-size: 20px; font-weight: bold; margin: 0;">{tokens_used:,}</p>
            </div>
            <div style="flex: 1; background: #1a1f2e; border: 1px solid #374151; border-radius: 8px; padding: 16px;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0 0 4px 0;">TOKENS REMAINING</p>
                <p style="color: #ef4444; font-size: 20px; font-weight: bold; margin: 0;">{tokens_remaining:,}</p>
            </div>
        </div>

        <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
            You have used <strong style="color: #ffffff;">{percentage}%</strong> of your {plan.upper()} plan token limit.
            {'You are very close to your limit. Upgrade now to avoid interruption.' if percentage >= 90 else 'Consider upgrading your plan to ensure uninterrupted service.'}
        </p>

        <div style="text-align: center; margin-top: 32px;">
            <a href="https://llmlite.vercel.app/dashboard/billing"
               style="background: #3b82f6; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Upgrade My Plan →
            </a>
        </div>

        <p style="color: #4b5563; font-size: 12px; text-align: center; margin-top: 32px;">
            LLMLite · You are receiving this because you enabled budget alerts
        </p>
    </div>
    """

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "api-key": os.getenv("BREVO_API_KEY"),
                    "Content-Type": "application/json"
                },
                json={
                    "sender": {"name": "LLMLite", "email": "krishnawararkar15@gmail.com"},
                    "to": [{"email": email}],
                    "subject": f"⚠️ LLMLite: You have used {percentage}% of your token limit",
                    "htmlContent": html_content
                }
            )
            print(f"Alert email sent to {email}: {response.status_code}")
    except Exception as e:
        print(f"Failed to send alert email: {e}")


async def send_welcome_email(email: str, subscription_key: str):
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0d14; color: #ffffff; padding: 40px; border-radius: 12px;">

        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Welcome to LLMLite 🚀</h1>
            <p style="color: #9ca3af; margin-top: 8px;">Your AI API router is ready to use</p>
        </div>

        <div style="background: #1a1f2e; border: 1px solid #374151; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase;">YOUR API KEY</p>
            <p style="color: #3b82f6; font-size: 16px; font-family: monospace; font-weight: bold; margin: 0; word-break: break-all;">{subscription_key}</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 8px;">Keep this key secret. Do not share it with anyone.</p>
        </div>

        <div style="background: #1a1f2e; border: 1px solid #374151; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #ffffff; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">Your Free Plan includes:</p>
            <p style="color: #9ca3af; font-size: 13px; margin: 4px 0;">✅ 100,000 tokens per month</p>
            <p style="color: #9ca3af; font-size: 13px; margin: 4px 0;">✅ Auto routing to free models</p>
            <p style="color: #9ca3af; font-size: 13px; margin: 4px 0;">✅ Full usage dashboard</p>
            <p style="color: #9ca3af; font-size: 13px; margin: 4px 0;">✅ 1 API key</p>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://llmlite-woad.vercel.app/dashboard"
               style="background: #3b82f6; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                Go to Dashboard →
            </a>
        </div>

        <p style="color: #4b5563; font-size: 12px; text-align: center;">Questions? Contact llmlite.support@gmail.com</p>
    </div>
    """

    try:
        brevo_key = os.getenv("BREVO_API_KEY")
        print(f"Brevo key found: {brevo_key is not None}, length: {len(brevo_key) if brevo_key else 0}, starts with: {brevo_key[:10] if brevo_key else 'NONE'}")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "api-key": brevo_key,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                json={
                    "sender": {"name": "LLMLite", "email": "krishnawararkar15@gmail.com"},
                    "to": [{"email": email}],
                    "subject": "Welcome to LLMLite — Your API Key Inside 🚀",
                    "htmlContent": html_content
                }
            )
            print(f"Brevo response: {response.status_code} - {response.text}")
            print(f"Welcome email sent to {email}: {response.status_code}")
    except Exception as e:
        print(f"Failed to send welcome email: {e}")

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

# Try models in order until one works
FREE_MODELS = [
    "meta-llama/llama-3.1-8b-instruct:free",
    "google/gemma-2-9b-it:free", 
    "qwen/qwen-2-7b-instruct:free",
    "microsoft/phi-3-mini-128k-instruct:free",
    "mistralai/mistral-7b-instruct:free",
]

async def call_openrouter(model: str, prompt: str, openrouter_key: str):
    url = "https://openrouter.ai/api/v1/chat/completions"

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {openrouter_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://llmlite-woad.vercel.app",
                "X-Title": "LLMLite"
            },
            json={
                "model": model,
                "messages": [{"role": "user", "content": prompt}]
            }
        )
    return response

def calculate_cost(model, prompt_tokens, completion_tokens):
    prices_per_million = {
        "google/gemma-2-9b-it:free": {"prompt": 0.0, "completion": 0.0},
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
        password = (data.get("password") or "")[:72]
        if not email:
            return {"error": "Email required"}
        existing = supabase.table("users").select("*").eq("email", email).execute()
        if existing.data:
            user = existing.data[0]
            # Update password if provided
            if password:
                from passlib.context import CryptContext
                pwd_context = CryptContext(schemes=["bcrypt"], bcrypt__rounds=12, truncate_error=False)
                supabase.table("users").update({"password_hash": pwd_context.hash(password)}).eq("email", email).execute()
            return {
                "subscription_key": user["subscription_key"],
                "plan": user.get("plan", "free"),
                "token_limit": user.get("token_limit", 100000),
                "email": email
            }
        # New user — create fresh key
        import secrets
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], bcrypt__rounds=12, truncate_error=False)
        new_key = "sk-rl-" + secrets.token_hex(16)
        password_hash = pwd_context.hash(password) if password else None
        supabase.table("users").insert({
            "email": email,
            "subscription_key": new_key,
            "plan": "free",
            "tokens_used": 0,
            "token_limit": 100000,
            "password_hash": password_hash
        }).execute()
        
        # Send welcome email to new users only
        await send_welcome_email(email, new_key)
        
        return {
            "subscription_key": new_key,
            "plan": "free",
            "token_limit": 100000,
            "email": email
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/regenerate-key")
async def regenerate_key(request: Request):
    try:
        data = await request.json()
        email = data.get("email", "").strip().lower()
        old_key = data.get("subscription_key", "").strip()

        print(f"Regenerate key request - email: {email}, old_key: {old_key[:20]}...")

        if not email or not old_key:
            return JSONResponse(status_code=400, content={"error": "Email and key required"})

        # Find user by email only first
        user_result = supabase.table("users").select("*").eq("email", email).execute()

        if not user_result.data:
            print(f"User not found for email: {email}")
            return JSONResponse(status_code=404, content={"error": "User not found"})

        user = user_result.data[0]
        print(f"User found: {user.get('email')}, plan: {user.get('plan')}")

        # Generate new key
        new_key = "sk-rl-" + secrets.token_hex(16)

        # Update subscription key in users table
        update_result = supabase.table("users").update(
            {"subscription_key": new_key}
        ).eq("email", email).execute()

        print(f"Key updated successfully. New key: {new_key[:20]}...")

        # Update requests table too
        supabase.table("requests").update(
            {"subscription_key": new_key}
        ).eq("subscription_key", old_key).execute()

        return {"success": True, "new_key": new_key}

    except Exception as e:
        print(f"Regenerate key error: {str(e)}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/keys/{email}")
async def get_keys(email: str):
    try:
        result = supabase.table("api_keys").select("*").eq("user_email", email).order("created_at").execute()
        return {"keys": result.data or []}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/keys/create")
async def create_key(request: Request):
    try:
        data = await request.json()
        email = data.get("email", "").strip()
        key_name = data.get("key_name", "New Key").strip()
        environment = data.get("environment", "development")
        plan = data.get("plan", "free")

        # Check key limit based on plan
        existing = supabase.table("api_keys").select("id").eq("user_email", email).execute()
        key_count = len(existing.data or [])
        limits = {"free": 1, "pro": 3, "max": 999}
        limit = limits.get(plan, 1)
        if key_count >= limit:
            return JSONResponse(status_code=403, content={"error": f"Your plan allows {limit} key(s). Upgrade for more."})

        new_key = "sk-rl-" + secrets.token_hex(16)
        token_limit = {"free": 100000, "pro": 10000000, "max": 100000000}.get(plan, 100000)

        supabase.table("api_keys").insert({
            "user_email": email,
            "key_name": key_name,
            "subscription_key": new_key,
            "environment": environment,
            "is_active": True,
            "tokens_used": 0,
            "token_limit": token_limit,
            "created_at": "now()",
            "last_used_at": None
        }).execute()

        return {"success": True, "key": new_key, "key_name": key_name}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/keys/toggle")
async def toggle_key(request: Request):
    try:
        data = await request.json()
        key_id = data.get("key_id")
        is_active = data.get("is_active")
        supabase.table("api_keys").update({"is_active": is_active}).eq("id", key_id).execute()
        return {"success": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.delete("/keys/{key_id}")
async def delete_key(key_id: str):
    try:
        supabase.table("api_keys").delete().eq("id", key_id).execute()
        return {"success": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.put("/keys/rename")
async def rename_key(request: Request):
    try:
        data = await request.json()
        key_id = data.get("key_id")
        new_name = data.get("key_name", "").strip()
        if not new_name:
            return JSONResponse(status_code=400, content={"error": "Name required"})
        supabase.table("api_keys").update({"key_name": new_name}).eq("id", key_id).execute()
        return {"success": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/login")
async def login(data: dict):
    try:
        email = data.get("email", "")
        password = (data.get("password") or "")[:72]
        if not email:
            return {"error": "Email required"}
        result = supabase.table("users").select("*").eq("email", email).execute()
        if not result.data:
            return {"error": "No account found with this email"}
        user = result.data[0]
        if user.get("password_hash") and password:
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"], bcrypt__rounds=12, truncate_error=False)
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
async def route_request(request: Request):
    try:
        data = await request.json()
        prompt = data.get("prompt", "")
        subscription_key = data.get("subscription_key", "")
        model_override = data.get("model", None)

        if not prompt or not subscription_key:
            return JSONResponse(status_code=400, content={"error": "prompt and subscription_key required"})

        print(f"Route called - key: {subscription_key[:20]}, model_override: {model_override}")

        # Get user from database
        user_result = supabase.table("users").select("*").eq("subscription_key", subscription_key).execute()
        if not user_result.data:
            return JSONResponse(status_code=401, content={"error": "Invalid subscription key"})

        user = user_result.data[0]

        # Check token limit
        if user.get("tokens_used", 0) >= user.get("token_limit", 100000):
            return JSONResponse(status_code=429, content={"error": "Token limit reached. Please upgrade your plan."})

        # Determine which model to use
        selected_model = None
        prompt_type = None

        # 1. Manual override from request
        if model_override:
            selected_model = model_override
            prompt_type = "MANUAL"
            print(f"Using manual override: {selected_model}")

        # 2. Check custom rules
        if not selected_model:
            rules_result = supabase.table("routing_rules").select("*").eq("subscription_key", subscription_key).eq("is_active", True).order("priority", desc=True).execute()
            rules = rules_result.data or []
            print(f"Checking {len(rules)} custom rules")

            for rule in rules:
                rule_type = rule.get("rule_type", "")
                condition = rule.get("condition_value", "")
                target = rule.get("target_model", "")

                if rule_type == "keyword" and condition.lower() in prompt.lower():
                    selected_model = target
                    prompt_type = "CUSTOM_RULE"
                    print(f"Custom rule matched: {rule.get('rule_name')} → {selected_model}")
                    break
                elif rule_type == "token_length":
                    try:
                        if len(prompt.split()) > int(condition):
                            selected_model = target
                            prompt_type = "CUSTOM_RULE"
                            print(f"Token length rule matched → {selected_model}")
                            break
                    except:
                        pass

        # 3. Auto routing (classify prompt)
        if not selected_model:
            word_count = len(prompt.split())
            complex_keywords = ["explain", "analyze", "compare", "write", "create", "debug", "code", "implement", "design", "evaluate", "summarize", "research"]
            is_complex = word_count > 50 or any(kw in prompt.lower() for kw in complex_keywords)

            if is_complex:
                selected_model = "meta-llama/llama-3.2-3b-instruct:free"
                prompt_type = "COMPLEX"
            else:
                selected_model = "meta-llama/llama-3.2-3b-instruct:free"
                prompt_type = "SIMPLE"
            print(f"Auto routing → {selected_model} ({prompt_type})")

        # Call OpenRouter
        print(f"Calling OpenRouter with model: {selected_model}")
        openrouter_key = os.getenv("OPENROUTER_API_KEY", "")
        or_data = None
        actual_model = selected_model

        # If selected model is a free model or custom rule, try it first then fallback
        models_to_try = [selected_model] + [m for m in FREE_MODELS if m != selected_model]

        for model_attempt in models_to_try:
            try:
                print(f"Trying model: {model_attempt}")
                or_response = await call_openrouter(model_attempt, prompt, openrouter_key)
                print(f"Response status: {or_response.status_code}")
                or_data = or_response.json()
                
                if or_response.status_code == 200 and "choices" in or_data:
                    actual_model = model_attempt
                    print(f"Success with model: {actual_model}")
                    break
                else:
                    print(f"Model {model_attempt} failed: {or_data.get('error', 'unknown')}")
                    or_data = None
                    continue
            except Exception as e:
                print(f"Model {model_attempt} exception: {str(e)}")
                or_data = None
                continue

        if not or_data or "choices" not in or_data:
            return JSONResponse(status_code=500, content={"error": "All models unavailable. Please try again in a moment."})

        selected_model = actual_model
        response_text = or_data["choices"][0]["message"]["content"]
        usage = or_data.get("usage", {})
        tokens_used = usage.get("total_tokens", len(prompt.split()) * 2)

        # Calculate cost
        model_costs = {
            "meta-llama/llama-3.2-3b-instruct:free": 0.0,
            "meta-llama/llama-3.1-8b-instruct:free": 0.0,
            "google/gemma-2-9b-it:free": 0.0,
            "microsoft/phi-3-mini-128k-instruct:free": 0.0,
            "openai/gpt-4o-mini": 0.00015,
            "openai/gpt-4o": 0.005,
            "anthropic/claude-3-haiku": 0.00025,
            "anthropic/claude-3-5-sonnet": 0.003,
            "google/gemini-flash-1.5": 0.000075,
            "meta-llama/llama-3.1-70b-instruct": 0.00059,
        }
        cost_per_token = model_costs.get(selected_model, 0.0)
        cost_usd = (tokens_used / 1000000) * cost_per_token

        # GPT-4o equivalent cost for savings calculation
        gpt4o_cost = (tokens_used / 1000000) * 5.0
        savings = gpt4o_cost - cost_usd

        # Update user tokens
        new_tokens = user.get("tokens_used", 0) + tokens_used
        supabase.table("users").update({"tokens_used": new_tokens}).eq("subscription_key", subscription_key).execute()

        # Save request to database
        supabase.table("requests").insert({
            "subscription_key": subscription_key,
            "model_used": selected_model,
            "prompt_type": prompt_type,
            "tokens_used": tokens_used,
            "cost_usd": cost_usd,
        }).execute()

        # Calculate remaining tokens
        token_limit = user.get("token_limit", 100000)
        remaining = max(0, token_limit - new_tokens)

        print(f"Success - model: {selected_model}, tokens: {tokens_used}, cost: {cost_usd}")

        return {
            "response": response_text,
            "model_used": selected_model,
            "prompt_type": prompt_type,
            "tokens_used": tokens_used,
            "cost_usd": float(cost_usd),
            "savings_usd": float(savings),
            "requests_remaining": remaining
        }

    except Exception as e:
        print(f"Route error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/rules")
async def create_rule(request: Request):
    data = await request.json()
    subscription_key = data.get("subscription_key")

    # Check plan
    user = supabase.table("users").select("*").eq("subscription_key", subscription_key).execute()
    if not user.data:
        return JSONResponse(status_code=404, content={"error": "User not found"})

    if user.data[0].get("plan") == "free":
        return JSONResponse(status_code=403, content={"error": "Custom rules are a Pro feature"})

    result = supabase.table("routing_rules").insert({
        "subscription_key": subscription_key,
        "rule_name": data.get("rule_name"),
        "rule_type": data.get("rule_type"),
        "condition_value": data.get("condition_value"),
        "target_model": data.get("target_model"),
        "priority": data.get("priority", 1),
        "is_active": True
    }).execute()

    return {"success": True, "rule": result.data[0]}

@app.get("/rules/{subscription_key}")
async def get_rules(subscription_key: str):
    result = supabase.table("routing_rules")\
        .select("*")\
        .eq("subscription_key", subscription_key)\
        .eq("is_active", True)\
        .order("priority", desc=True)\
        .execute()
    return {"rules": result.data}

@app.delete("/rules/{rule_id}")
async def delete_rule(rule_id: str):
    supabase.table("routing_rules").delete().eq("id", rule_id).execute()
    return {"success": True}

@app.get("/subscription/{subscription_key}")
async def get_subscription_info(subscription_key: str):
    user_data = supabase.table("users").select("*").eq("subscription_key", subscription_key).execute()
    
    if not user_data.data:
        raise HTTPException(status_code=404, detail="Subscription key not found")
    
    user = user_data.data[0]
    tokens_used = user.get("tokens_used", 0)
    token_limit = user.get("token_limit", 100000)
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
        requests_data = supabase.table("requests").select("*").eq("subscription_key", subscription_key).execute()
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
