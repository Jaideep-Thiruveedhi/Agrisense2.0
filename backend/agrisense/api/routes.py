from fastapi import APIRouter, Header, HTTPException
from agrisense.science.facade import SeasonSnapshot, ForecastBundle, ReferenceBundle, PlanningSnapshot, evaluate_season, compare_crops
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/v1")

def _auth(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="unauthenticated")
    # Firebase verify would happen here — emulator allows any Bearer for now
    return {"uid":"test_uid","tenant":"t_1"}

@router.post("/seasons/{id}/evaluate")
async def evaluate(id: str, authorization: str | None = Header(None)):
    _auth(authorization)
    # Build deterministic snapshot from season id
    snap = SeasonSnapshot(season_id=id, field_id="fld_1", crop="cotton", variety=None, sowing_date="2026-06-15", stage="square formation", allocated_area_ha=0.404, soil_ph=6.4, soil_om=1.2)
    forecast = ForecastBundle(provider="cehub", retrieved_at=datetime.now(timezone.utc).isoformat(), horizon_hours=336, hourly=[{"Tmax":32,"Tmin":22}]*336, provenance=["demo:cehub","rule:advisory_v1"])
    bundle = evaluate_season(snap, forecast, ReferenceBundle())
    return {"data": {"id": str(uuid.uuid4()), "season_id": id, "status": bundle.status, "readiness": bundle.readiness, "window": bundle.window, "reason_codes": bundle.reason_codes}, "meta": {"request_id": str(uuid.uuid4()), "schema_version":"1.0","data_mode":"demo","provenance": bundle.provenance, "warnings": bundle.warnings}}

@router.get("/seasons/{id}/water")
async def water(id: str, authorization: str | None = Header(None)):
    _auth(authorization)
    return {"data": {"et0":5.2,"etc":5.46,"taw":140,"raw":70,"dr":85,"ks":0.82,"net_mm":12.5,"gross_mm":16.6}, "meta": {"schema_version":"1.0","data_mode":"demo","provenance":["demo:FAO-56"]}}

@router.get("/seasons/{id}/economics")
async def economics(id: str, authorization: str | None = Header(None)):
    _auth(authorization)
    return {"data": {"p10":18000,"p50":30000,"p90":42000,"net":30000,"roi":60,"break_even":12.5}, "meta": {"schema_version":"1.0","data_mode":"scenario"}}

@router.post("/planning/compare")
async def planning_compare(body: dict, authorization: str | None = Header(None)):
    _auth(authorization)
    snap = PlanningSnapshot(field_id=body.get("field_id","fld_1"), location_lat=20.70, location_lon=77.00, area_ha=body.get("area_ha",0.404), proposed_date=body.get("date","2026-09-10"), budget_inr=body.get("budget",50000))
    plans = compare_crops(snap, ReferenceBundle())
    return {"data": {"items": [p.__dict__ for p in plans]}, "meta": {"schema_version":"1.0","data_mode":"scenario"}}

@router.get("/seasons/{id}/forecast")
async def forecast(id: str, authorization: str | None = Header(None)):
    _auth(authorization)
    return {"data": {"provider":"cehub","hourly":[ {"time":"2026-09-11T05:30:00+05:30","delta_t":5.1,"wind_kmh":8,"rain_mm":0,"viable":True} ]}, "meta": {"schema_version":"1.0","data_mode":"demo"}}

@router.get("/seasons/{id}/journal")
async def journal_list(id: str, authorization: str | None = Header(None)):
    _auth(authorization)
    return {"data": {"items": []}, "meta": {"schema_version":"1.0"}}

@router.post("/seasons/{id}/journal")
async def journal_create(id: str, body: dict, authorization: str | None = Header(None)):
    _auth(authorization)
    return {"data": {"id": str(uuid.uuid4()), "season_id": id, **body}, "meta": {"schema_version":"1.0"}}

@router.get("/agronomist/summary")
async def agro_summary(authorization: str | None = Header(None)):
    _auth(authorization)
    return {"data": {"fields_monitored":34,"open_windows":12,"adherence":82}, "meta": {"schema_version":"1.0"}}
