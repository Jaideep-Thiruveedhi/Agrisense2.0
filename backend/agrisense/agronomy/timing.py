"""GDD + stage — per-crop Tbase, cap, sowing conventions."""
from __future__ import annotations
from .constants import GDD_BASE_TEMPERATURE_C, Crop

def gdd_day(Tmax: float, Tmin: float, crop: Crop, cap: float | None = None) -> float:
    Tbase = GDD_BASE_TEMPERATURE_C[crop]
    if cap is not None:
        Tmax = min(Tmax, cap); Tmin = min(Tmin, cap)
    return max(0, (Tmax+Tmin)/2 - Tbase)

def accumulation(daily: list[tuple[float,float]], crop: Crop) -> float:
    return sum(gdd_day(Tmax,Tmin,crop) for Tmax,Tmin in daily)
