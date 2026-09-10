from fastapi import FastAPI, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import os
app = FastAPI(title="AgriSense API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("CORS_ALLOWED_ORIGINS","http://localhost:3000").split(","), allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

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
