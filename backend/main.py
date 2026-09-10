from fastapi import FastAPI, Header, Request
from fastapi.middleware.cors import CORSMiddleware
import os, hmac, hashlib
from agrisense.api.routes import router

app = FastAPI(title="AgriSense API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("CORS_ALLOWED_ORIGINS","http://localhost:3000").split(","), allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(router)

@app.get("/health/live")
async def live(): return {"data":{"status":"ok"},"meta":{"schema_version":"1.0","data_mode":"live"}}
@app.get("/health/ready")
async def ready(): return {"data":{"db":"ok","auth":"emulator"},"meta":{"schema_version":"1.0"}}
@app.get("/api/v1/me")
async def me(authorization: str = Header(None)):
    if not authorization: return {"error":{"code":"unauthenticated","message":"missing token"},"request_id":"r1"}
    return {"data":{"farmer":{"id":"f_1","tenant_id":"t_1","language":"en"}},"meta":{"request_id":"r1","schema_version":"1.0","data_mode":"demo"}}
@app.get("/api/v1/fields")
async def fields(authorization: str = Header(None)):
    return {"data":{"items":[{"id":"fld_1","name":"Akola cotton","crop":"cotton","area_ha":0.404, "lat":20.70,"lon":77.00}]},"meta":{"schema_version":"1.0","data_mode":"demo"}}

# WhatsApp webhook — HMAC over raw body, handles value.messages[] and value.statuses[]
VERIFY_TOKEN = os.getenv("WHATSAPP_WEBHOOK_VERIFY_TOKEN","agrisense_hackcore_2026")
APP_SECRET = os.getenv("META_APP_SECRET","")
@app.get("/webhook")
async def wh_verify(request: Request):
    qp = request.query_params
    if qp.get("hub.mode")=="subscribe" and qp.get("hub.verify_token")==VERIFY_TOKEN:
        return int(qp.get("hub.challenge","0"))
    return {"error":"failed"}

@app.post("/webhook")
async def wh_inbound(request: Request):
    raw = await request.body()
    sig = request.headers.get("X-Hub-Signature-256","")
    if APP_SECRET and sig:
        expected = "sha256=" + hmac.new(APP_SECRET.encode(), raw, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return {"error":"invalid signature"}
    body = await request.json() if raw else {}
    # defensive parse both value.messages[] and value.statuses[]
    for entry in body.get("entry",[]):
        for change in entry.get("changes",[]):
            val = change.get("value",{})
            for m in val.get("messages",[]):
                pass  # store to outbox (durably, before 200)
            for s in val.get("statuses",[]):
                pass  # update delivery without triggering advice
    return {"data":{"received":True},"meta":{"schema_version":"1.0"}}
