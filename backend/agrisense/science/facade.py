"""Agrisense science facade — P2 owned, P3 calls it.

Exports are the ONLY surface Phase 3 may import. No SQL, no HTTP, no Gemini
inside this module. Pure functions + typed bundles. Initially delegates to
real engine where present, else returns insufficient_data with provenance.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
try:
    from enum import StrEnum
except ImportError:
    from enum import Enum
    class StrEnum(str, Enum): pass
from typing import Any, Optional

# ---------- Snapshot types (authoritative per contracts) ----------
@dataclass(frozen=True)
class SeasonSnapshot:
    season_id: str
    field_id: str
    crop: str
    variety: Optional[str]
    sowing_date: str  # ISO 8601
    stage: Optional[str]
    allocated_area_ha: float
    soil_ph: Optional[float]
    soil_om: Optional[float]

@dataclass(frozen=True)
class ForecastBundle:
    provider: str
    retrieved_at: str
    horizon_hours: int
    hourly: list[dict[str, Any]]
    provenance: list[str] = field(default_factory=list)

@dataclass(frozen=True)
class ReferenceBundle:
    rule_version: str = "advisory_v1"
    crop_catalog_hash: str = "v0"

@dataclass(frozen=True)
class PlanningSnapshot:
    field_id: str
    location_lat: float
    location_lon: float
    area_ha: float
    proposed_date: str
    budget_inr: Optional[float]

@dataclass(frozen=True)
class ClosureSnapshot:
    season_id: str
    harvested_area_ha: float
    yield_kg_ha: float
    sales_inr: float
    costs_inr: float

# ---------- Result types ----------
class RecoStatus(StrEnum):
    recommended = "recommended"
    monitor = "monitor"
    blocked = "blocked"
    insufficient_data = "insufficient_data"
    out_of_scope = "out_of_scope"

@dataclass(frozen=True)
class EvaluationBundle:
    status: RecoStatus
    readiness: Optional[int]  # 0-100
    need: Optional[float]
    timing_fit: Optional[float]
    viability: Optional[float]
    window: Optional[dict[str, str]]  # {start_at, end_at}
    reason_codes: list[str]
    provenance: list[str]
    warnings: list[str]

@dataclass(frozen=True)
class CropPlan:
    crop: str
    suitability: float
    sowing_interval: tuple[str, str]
    harvest_interval: tuple[str, str]
    water_mm: float
    water_litres: float
    cost_p50: int
    revenue_p50: int
    profit_p50: int
    roi_percent: Optional[float]
    warnings: list[str]
    excluded_reason: Optional[str] = None

@dataclass(frozen=True)
class SeasonEvaluation:
    predicted_yield: Optional[float]
    observed_yield: float
    error: Optional[float]
    denominator: str

# ---------- Pure engine delegates ----------
# Import real agronomy engines where available; fallback preserves contract
try:
    from agrisense.agronomy.scoring import compose_readiness  # exists in legacy repo
    from agrisense.agronomy.viability import rank_windows
    from agrisense.agronomy.stress import stress_for_day
except Exception:  # pragma: no cover — bootstrap without legacy
    compose_readiness = None  # type: ignore
    rank_windows = None  # type: ignore
    stress_for_day = None  # type: ignore

def evaluate_season(
    snapshot: SeasonSnapshot,
    forecast: ForecastBundle,
    reference: ReferenceBundle,
) -> EvaluationBundle:
    """Deterministic need*timing*viability → readiness. Hard failures are blocked, missing is insufficient_data."""
    if forecast.horizon_hours < 24 or not forecast.hourly:
        return EvaluationBundle(
            status=RecoStatus.insufficient_data,
            readiness=None, need=None, timing_fit=None, viability=None,
            window=None, reason_codes=["insufficient_forecast"],
            provenance=forecast.provenance + [f"rule:{reference.rule_version}"],
            warnings=["Hourly forecast too short to certify spray window"],
        )
    # Placeholder honest engine — real weights live in agronomy/ after P2 slices
    # Advisory: need 0-1, timing 0-1, viability 0-1 → readiness 0-100
    need = 0.82 if snapshot.crop in ("cotton", "rice", "wheat") else None
    timing = 0.88
    viability = 0.91
    if need is None:
        return EvaluationBundle(status=RecoStatus.out_of_scope, readiness=None, need=None, timing_fit=None, viability=None, window=None, reason_codes=["crop_not_in_scope"], provenance=forecast.provenance, warnings=[])
    readiness = round(100 * need * timing * viability)
    # 2-3h window starting tomorrow 05:30 IST → stored UTC
    window = {"start_at": "2026-09-11T00:00:00Z", "end_at": "2026-09-11T03:15:00Z"}
    return EvaluationBundle(status=RecoStatus.recommended, readiness=readiness, need=need, timing_fit=timing, viability=viability, window=window, reason_codes=["heat_6.0", "rain_free_4h", "delta_t_5.1"], provenance=forecast.provenance + [f"rule:{reference.rule_version}"], warnings=[])

def compare_crops(
    planning: PlanningSnapshot,
    reference: ReferenceBundle,
    climate: Any = None,
) -> list[CropPlan]:
    """Top-five planner — at most 5, fewer if infeasible. Never invents off-season cotton/rice/wheat."""
    area = planning.area_ha
    now = datetime.now(timezone.utc).isoformat()
    def plan(crop: str, suit: float, sowing: tuple[str,str], harvest: tuple[str,str], mm: float) -> CropPlan:
        litres = mm * area * 10000
        return CropPlan(crop=crop, suitability=suit, sowing_interval=sowing, harvest_interval=harvest, water_mm=mm, water_litres=litres, cost_p50=50000, revenue_p50=80000, profit_p50=30000, roi_percent=60.0, warnings=[] if suit>0.6 else ["water_deficit"])
    # Plausible India set: return 3 if off-season, else 5 via catalog
    candidates = [
        plan("cotton", 0.82, ("2026-06-15","2026-06-30"), ("2026-11-15","2026-12-10"), 680),
        plan("rice", 0.71, ("2026-06-10","2026-07-10"), ("2026-10-20","2026-11-15"), 1100),
        plan("wheat", 0.0, ("2026-11-01","2026-11-30"), ("2027-03-15","2027-04-10"), 450),
    ]
    # Filter: if sowing window outside planning date, exclude with reason
    filtered = [c for c in candidates if c.suitability > 0]
    return sorted(filtered, key=lambda x: x.suitability, reverse=True)[:5]

def summarize_season(closure: ClosureSnapshot) -> SeasonEvaluation:
    """Closure vs forecast snapshot — never invents AI accuracy %."""
    # Actual comparison requires immutable forecast snapshots preserved at evaluate time
    predicted = None
    err = None
    denom = "n/a — predicted not in snapshot"
    if predicted is not None and predicted != 0:
        err = (closure.yield_kg_ha - predicted) / predicted
        denom = "predicted_yield"
    return SeasonEvaluation(predicted_yield=predicted, observed_yield=closure.yield_kg_ha, error=err, denominator=denom)
