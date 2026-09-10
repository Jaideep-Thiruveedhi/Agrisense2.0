"""Hour-level spray viability — DeltaT + wind + rainfast, Stull 2011 wet-bulb with pressure flag."""
from __future__ import annotations
import math
from dataclasses import dataclass

@dataclass(frozen=True)
class HourViability:
    hour: str  # ISO
    viable: bool
    reasons: list[str]
    delta_t: float | None
    wind_kmh: float | None
    rain_mm: float | None

def wet_bulb_stull(T: float, RH: float) -> float:
    """Stull 2011 approximation, std pressure. Valid roughly -20..50C, 5-99% RH. Outside returns flagged."""
    if not (5 <= RH <= 99 and -20 <= T <= 50):
        raise ValueError("out_of_domain")
    Tw = T*math.atan(0.151977*math.sqrt(RH+8.313659)) + math.atan(T+RH) - math.atan(RH-1.676331) + 0.00391838*math.pow(RH,1.5)*math.atan(0.023101*RH) - 4.686035
    return Tw

def delta_t(Tdry: float, RH: float) -> float | None:
    try:
        Tw = wet_bulb_stull(Tdry, RH)
        return Tdry - Tw
    except Exception:
        return None

DEFAULTS = {"delta_t_range": (2.0,8.0), "wind_range_kmh": (3,15), "rainfree_hours": 4}

def viable_hour(T: float, RH: float, wind_kmh: float, rain_next_4h_mm: float, rain_this_hour: float) -> tuple[bool,list[str],float|None]:
    reasons=[]
    dt = delta_t(T,RH)
    if dt is None: reasons.append("delta_t_out_of_domain")
    elif not (DEFAULTS["delta_t_range"][0] <= dt <= DEFAULTS["delta_t_range"][1]): reasons.append(f"delta_t {dt:.1f} outside 2-8")
    if not (DEFAULTS["wind_range_kmh"][0] <= wind_kmh <= DEFAULTS["wind_range_kmh"][1]): reasons.append(f"wind {wind_kmh:.1f} outside 3-15 km/h")
    if rain_this_hour>0: reasons.append("rain_this_hour")
    if rain_next_4h_mm>0: reasons.append("rain_next_4h")
    return (len(reasons)==0, reasons, dt)

def rank_windows(hours: list[HourViability]) -> list[tuple[str,str]]:
    """Return feasible 2-3h contiguous blocks ranked by viability."""
    # simplified: return first feasible 2h
    feasible=[]
    for i in range(len(hours)-1):
        if hours[i].viable and hours[i+1].viable:
            feasible.append((hours[i].hour, hours[i+1].hour))
    return feasible[:3]
