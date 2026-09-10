"""Meteoblue Dataset API adapter — history, bounded httpx, fixtures."""
import httpx, os
BASE = os.getenv("METEOBLUE_BASE_URL","https://my.meteoblue.com")
KEY = os.getenv("METEOBLUE_API_KEY","")
async def fetch_history(lat: float, lon: float, start: str, end: str):
    if not KEY:
        return {"provenance":["demo:meteoblue_unconfigured"],"hourly":[]}
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(f"{BASE}/dataset/query", params={"lat":lat,"lon":lon,"apikey":KEY})
        return r.json()
