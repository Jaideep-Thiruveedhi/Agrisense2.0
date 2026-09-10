"""Readiness = 100*need*timing*viability ; hard blocked vs insufficient_data."""
from __future__ import annotations
from typing import Optional

def compose_readiness(need: Optional[float], timing_fit: Optional[float], viability: Optional[float]) -> tuple[str,Optional[int]]:
    """Returns (status, readiness)."""
    if need is None or timing_fit is None or viability is None:
        return ("insufficient_data", None)
    if need==0:
        return ("monitor", None)
    # hard failure encoded as viability == 0 with blocked upstream
    readiness = round(100 * need * timing_fit * viability)
    return ("recommended", readiness)
