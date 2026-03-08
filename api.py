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
                    "subject": "Welcome to LLMLite — Your API Key Inside 🚀",
                    "htmlContent": html_content
                }
            )
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
        password = (data.get("password") or "")[:72]
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
                pwd_context = CryptContext(schemes=["bcrypt"], bcrypt__rounds=12, truncate_error=False)
                sb.table("users").update({"password_hash": pwd_context.hash(password)}).eq("email", email).execute()
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
        sb.table("users").insert({
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

@app.post("/login")
async def login(data: dict):
    try:
        email = data.get("email", "")
        password = (data.get("password") or "")[:72]
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
async def route_prompt(data: dict):
    subscription_key = data.get("subscription_key", "")
    prompt = data.get("prompt", "")
    model_override = data.get("model_override", None)
    print(f"Route called - key: {subscription_key[:20]}, model_override: {model_override}")

    if not prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    user_data = supabase.table("users").select("*").eq("subscription_key", subscription_key).execute()
    
    if not user_data.data:
        raise HTTPException(status_code=401, detail="Invalid subscription key")
    
    user = user_data.data[0]
    user_plan = user.get('plan', 'free')
    requested_model = data.get('model_override')
    
    # Block manual override for free users
    if user_plan == 'free' and requested_model:
        return {"error": "Manual model override is a Pro feature. Upgrade at llmlite.vercel.app/pricing"}
    
    tokens_used = user.get("tokens_used", 0)
    token_limit = user.get("token_limit", 100000)
    plan = user.get("plan", "free")

    if tokens_used >= token_limit:
        return JSONResponse(
            status_code=429,
            content={
                "error": "token_limit_exceeded",
                "message": f"You have used all {token_limit:,} tokens on your {plan.upper()} plan. Upgrade to continue.",
                "tokens_used": tokens_used,
                "token_limit": token_limit,
                "upgrade_url": "https://llmlite-woad.vercel.app/dashboard/billing"
            }
        )

    # Check custom rules first
    custom_model = None
    try:
        rules_result = supabase.table("routing_rules")\
            .select("*")\
            .eq("subscription_key", subscription_key)\
            .eq("is_active", True)\
            .order("priority", desc=True)\
            .execute()
        
        if rules_result.data:
            prompt_lower = prompt.lower()
            word_count = len(prompt.split())
            
            for rule in rules_result.data:
                rule_type = rule.get("rule_type")
                condition = rule.get("condition_value", "")
                
                if rule_type == "keyword":
                    if condition.lower() in prompt_lower:
                        custom_model = rule.get("target_model")
                        break
                        
                elif rule_type == "token_length":
                    try:
                        if word_count > int(condition):
                            custom_model = rule.get("target_model")
                            break
                    except:
                        pass
                        
                elif rule_type == "cost_cap":
                    custom_model = rule.get("target_model")
                    break
                    
                elif rule_type == "topic":
                    if condition.lower() in prompt_lower:
                        custom_model = rule.get("target_model")
                        break
                        
                elif rule_type == "time_based":
                    from datetime import datetime
                    current_hour = datetime.now().hour
                    try:
                        from_hour, to_hour = condition.split("-")
                        if int(from_hour) <= current_hour <= int(to_hour):
                            custom_model = rule.get("target_model")
                            break
                    except:
                        pass
    except Exception as e:
        print(f"Error checking custom rules: {e}")

    # If model_override provided skip classification
    if custom_model:
        model = custom_model
        prompt_type = "CUSTOM_RULE"
    elif model_override:
        model = model_override
        prompt_type = "MANUAL"
    else:
        # existing classification logic stays here
        if is_simple(prompt):
            model = "google/gemma-3-4b-it:free"
            print("[CLASSIFY] Prompt classified as: SIMPLE -> using google/gemma-3-4b-it:free")
            prompt_type = "SIMPLE"
        else:
            model = "stepfun/step-3.5-flash:free"
            print("[CLASSIFY] Prompt classified as: COMPLEX -> using stepfun/step-3.5-flash:free")
            prompt_type = "COMPLEX"

    response_text, prompt_tokens, completion_tokens, total_tokens = call_openrouter(
        prompt, model
    )

    new_tokens_used = tokens_used + total_tokens
    try:
        user_result = supabase.table("users").select("tokens_used").eq("subscription_key", subscription_key).execute()
        current_tokens = user_result.data[0].get("tokens_used", 0) if user_result.data else 0
        supabase.table("users").update({
            "tokens_used": current_tokens + total_tokens
        }).eq("subscription_key", subscription_key).execute()
        
        # Get updated user data for budget alerts
        user_result = supabase.table("users").select("*").eq("subscription_key", subscription_key).execute()
        if user_result.data:
            user = user_result.data[0]
            tokens_used = user.get("tokens_used", 0)
            token_limit = user.get("token_limit", 100000)
            email = user.get("email", "")
            plan = user.get("plan", "free")
            percentage = (tokens_used / token_limit) * 100 if token_limit > 0 else 0

            # Send alert at 80% — only once
            alert_sent_80 = user.get("alert_sent_80", False)
            if percentage >= 80 and not alert_sent_80:
                await send_budget_alert_email(email, tokens_used, token_limit, plan)
                supabase.table("users").update({"alert_sent_80": True}).eq("subscription_key", subscription_key).execute()

            # Send alert at 95% — only once
            alert_sent_95 = user.get("alert_sent_95", False)
            if percentage >= 95 and not alert_sent_95:
                await send_budget_alert_email(email, tokens_used, token_limit, plan)
                supabase.table("users").update({"alert_sent_95": True}).eq("subscription_key", subscription_key).execute()
    except Exception as update_err:
        print(f"Failed to update tokens_used: {update_err}")
    
    cost = calculate_cost(model, prompt_tokens, completion_tokens)
    tokens_remaining = token_limit - new_tokens_used

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
        "prompt_type": prompt_type,
        "tokens_used": total_tokens,
        "cost_usd": cost,
        "requests_remaining": tokens_remaining
    }

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
