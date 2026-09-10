"""CE Hub forecast — validates ApiKey vs Bearer, handles 204, provenance per variable."""
import httpx, os
BASE = os.getenv("CEHUB_BASE_URL","https://services.cehub.syngenta-ais.com")
KEY = os.getenv("CEHUB_API_KEY","")
HDR = os.getenv("CEHUB_API_KEY_HEADER","ApiKey")
async def fetch_forecast(lat: float, lon: float, start: str, end: str):
    headers = {HDR: KEY} if HDR=="ApiKey" else {"Authorization": f"Bearer {KEY}"}
    if not KEY:
        return {"provenance":["demo:cehub_unconfigured"],"hourly":[]}
    async with httpx.AsyncClient(timeout=12) as c:
        r = await c.get(f"{BASE}/api/Forecast/ShortRangeForecastHourly", headers=headers, params={"latitude":lat,"longitude":lon,"startDate":start,"endDate":end})
        if r.status_code==204:
            return {"provenance":["unavailable:cehub_204"],"hourly":[]}
        r.raise_for_status()
        return r.json()
