"""Stress models — cardinal temp based, reference_v1 vs advisory_v1."""
from __future__ import annotations
from .constants import CARDINALS, Crop, clip

def day_heat(Tmax: float, crop: Crop) -> float | None:
    c = CARDINALS[crop]
    if Tmax is None: return None
    return 9 * clip((Tmax - c.tmax_optimum) / (c.tmax_limit - c.tmax_optimum), 0, 1)

def night_heat(Tmin: float, crop: Crop) -> float | None:
    c = CARDINALS[crop]
    if Tmin is None: return None
    return 9 * clip((Tmin - c.tmin_optimum) / (c.tmin_limit - c.tmin_optimum), 0, 1)

def frost(Tmin: float, crop: Crop) -> float | None:
    c = CARDINALS[crop]
    if c.tmin_no_frost is None:
        return None  # not_parameterized
    return 9 * clip((c.tmin_no_frost - Tmin) / (c.tmin_no_frost - c.tmin_frost), 0, 1)

def stress_for_day(Tmax: float, Tmin: float, crop: Crop) -> dict[str, float | None]:
    return {"day_heat": day_heat(Tmax,crop), "night_heat": night_heat(Tmin,crop), "frost": frost(Tmin,crop)}

# Golden checks: cotton day 32->0, 35->4.5, 38->9 ; wheat night 15->0 17.5->4.5 20->9 ; cotton frost 4->0 0.5->4.5 -3->9 ; rice frost->None
