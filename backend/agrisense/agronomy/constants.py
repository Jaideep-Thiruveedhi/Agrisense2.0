"""Cardinal temps + YIELD_OPTIMA from algorithm doc. advisory_v1 is defensible, reference_v1 reproduces source verbatim (with flags)."""
from __future__ import annotations
from dataclasses import dataclass
from enum import StrEnum

class Crop(StrEnum):
    RICE = "rice"
    WHEAT = "wheat"
    COTTON = "cotton"
    SOYBEAN = "soybean"
    CORN = "corn"

INDIA_CROPS = frozenset({Crop.RICE, Crop.WHEAT, Crop.COTTON})

@dataclass(frozen=True)
class CardinalTemperatures:
    tmax_optimum: float
    tmax_limit: float
    tmin_optimum: float
    tmin_limit: float
    tmin_no_frost: float | None
    tmin_frost: float | None

CARDINALS: dict[Crop, CardinalTemperatures] = {
    Crop.SOYBEAN: CardinalTemperatures(32.0, 45.0, 22.0, 28.0, 4.0, -3.0),
    Crop.CORN: CardinalTemperatures(33.0, 44.0, 22.0, 28.0, 4.0, -3.0),
    Crop.COTTON: CardinalTemperatures(32.0, 38.0, 20.0, 25.0, 4.0, -3.0),
    Crop.RICE: CardinalTemperatures(32.0, 38.0, 22.0, 28.0, None, None),
    Crop.WHEAT: CardinalTemperatures(25.0, 32.0, 15.0, 20.0, None, None),
}

@dataclass(frozen=True)
class Range:
    low: float; high: float
    @property
    def mid(self): return (self.low+self.high)/2
    def contains(self, v): return self.low <= v <= self.high

@dataclass(frozen=True)
class YieldRiskOptima:
    gdd: Range; precipitation_mm: Range; ph: Range; nitrogen_g_per_kg: Range

YIELD_OPTIMA: dict[Crop, YieldRiskOptima] = {
    Crop.SOYBEAN: YieldRiskOptima(Range(2400,3000), Range(450,700), Range(6.0,6.8), Range(0.0,0.026)),
    Crop.CORN: YieldRiskOptima(Range(2700,3100), Range(500,800), Range(6.0,6.8), Range(0.077,0.154)),
    Crop.COTTON: YieldRiskOptima(Range(2200,2600), Range(700,1300), Range(6.0,6.5), Range(0.051,0.092)),
    Crop.RICE: YieldRiskOptima(Range(2000,2500), Range(1000,1500), Range(5.5,6.5), Range(0.051,0.103)),
    Crop.WHEAT: YieldRiskOptima(Range(2000,2500), Range(1000,1500), Range(5.5,6.5), Range(0.051,0.103)),
}
YIELD_RISK_WEIGHTS = {"gdd":0.3,"precipitation":0.3,"ph":0.2,"nitrogen":0.2}
GDD_BASE_TEMPERATURE_C: dict[Crop,float] = {Crop.WHEAT:0.0, Crop.RICE:10.0, Crop.COTTON:15.6, Crop.CORN:10.0, Crop.SOYBEAN:10.0}

def clip(x,a,b): return min(max(x,a),b) if x is not None else None
def day_heat(Tmax,crop): 
    c=CARDINALS[crop]; return 9*clip((Tmax-c.tmax_optimum)/(c.tmax_limit-c.tmax_optimum),0,1)
def night_heat(Tmin,crop):
    c=CARDINALS[crop]; return 9*clip((Tmin-c.tmin_optimum)/(c.tmin_limit-c.tmin_optimum),0,1)
def frost(Tmin,crop):
    c=CARDINALS[crop]
    if c.tmin_no_frost is None: return None
    return 9*clip((c.tmin_no_frost-Tmin)/(c.tmin_no_frost-c.tmin_frost),0,1)
# golden: cotton day 32→0 35→4.5 38→9 ; wheat night 15→0 17.5→4.5 20→9 ; cotton frost 4→0 0.5→4.5 -3→9
