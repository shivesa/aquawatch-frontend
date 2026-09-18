"""
Simulation endpoints:
POST /simulation/step   — advance one tick, return new state
POST /simulation/pause  — pause background auto-tick loop
POST /simulation/resume — resume background auto-tick loop
POST /simulation/reset  — reset simulation to initial state
GET  /simulation/leaks  — list active leaks
POST /simulation/leak   — inject physical leak at node
POST /simulation/leak/clear — clear active leak(s)
"""

from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.dependencies import engine, store
from app.leak_extension_point import clear_leak, get_active_leaks, inject_leak

router = APIRouter(prefix="/simulation", tags=["simulation"])


class PresetRequest(BaseModel):
    preset: str


class LeakRequest(BaseModel):
    node_id: str
    rate_lpm: float


class LeakClearRequest(BaseModel):
    node_id: Optional[str] = None


@router.post("/step")
def simulation_step():
    """Advance exactly one tick and return the resulting state."""
    snapshot = engine.tick()
    return snapshot


@router.post("/pause")
def simulation_pause():
    """Pause the background auto-tick loop."""
    engine.pause()
    return {"status": "paused"}


@router.post("/resume")
def simulation_resume():
    """Resume the background auto-tick loop."""
    engine.resume()
    return {"status": "resumed"}


@router.post("/reset")
def simulation_reset():
    """Reset the simulation to initial state (all OFF, clock reset, leaks cleared)."""
    clear_leak()
    engine.reset()
    return {"status": "reset", "detail": "All machines OFF, taps CLOSED, clock reset, leaks cleared."}


@router.get("/leaks")
def get_leaks():
    """Return all currently active leaks."""
    return {"active_leaks": get_active_leaks()}


@router.post("/leak")
def inject_simulation_leak(req: LeakRequest):
    """Inject a leak at a junction (e.g., J2, J3, J5). Immediately ticks simulation."""
    inject_leak(req.node_id, req.rate_lpm)
    snapshot = engine.tick()
    return {
        "status": "injected",
        "node_id": req.node_id,
        "rate_lpm": req.rate_lpm,
        "active_leaks": get_active_leaks(),
        "snapshot": snapshot,
    }


@router.post("/leak/clear")
def clear_simulation_leak(req: Optional[LeakClearRequest] = None):
    """Clear an active leak or all leaks. Immediately ticks simulation."""
    node_id = req.node_id if req else None
    clear_leak(node_id)
    snapshot = engine.tick()
    return {
        "status": "cleared",
        "cleared_node": node_id,
        "active_leaks": get_active_leaks(),
        "snapshot": snapshot,
    }


@router.post("/preset")
def apply_preset(req: PresetRequest):
    """Apply an industrial operations preset scenario."""
    preset = req.preset.lower()

    if preset == "dyeing_leak":
        for mid in ["M1", "M2", "M3", "M4", "M5"]:
            store.update_machine(mid, production_pct=100.0, state="RUNNING")
        store.update_machine("M6", production_pct=80.0, state="RUNNING")
        store.update_machine("M7", production_pct=85.0, state="RUNNING")
        store.update_machine("M8", production_pct=50.0, state="RUNNING")
        store.update_tap("T1", state="CLOSED")
        store.update_tap("T2", state="CLOSED")
        store.update_tap("T3", state="CLOSED")
        clear_leak()
        inject_leak("J2", 240.0)

    elif preset == "normal":
        for mid in ["M1", "M2", "M3", "M4", "M5"]:
            store.update_machine(mid, production_pct=100.0, state="RUNNING")
        store.update_machine("M6", production_pct=80.0, state="RUNNING")
        store.update_machine("M7", production_pct=85.0, state="RUNNING")
        store.update_machine("M8", production_pct=50.0, state="RUNNING")
        clear_leak()

    elif preset == "high_production":
        for mid in ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"]:
            store.update_machine(mid, production_pct=180.0, state="RUNNING")
        clear_leak()

    elif preset == "idle":
        engine.reset()
        clear_leak()

    snapshot = engine.tick()
    return {
        "status": "applied",
        "preset": preset,
        "active_leaks": get_active_leaks(),
        "snapshot": snapshot,
    }

