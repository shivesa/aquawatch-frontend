"""
GET /predict/current — runs the classifier on the latest simulation state.
POST /predict/ml — runs the ML model on provided features.
GET /predict/ml/current — runs the ML model on the latest simulation state.

Returns leak detection results or a graceful "models not loaded" status.
"""

from fastapi import APIRouter
from pydantic import BaseModel

from app.api.datasink import _flatten_snapshot
from app.classifier_adapter import predict_from_state
from app.core.config import MACHINE_BASE_FLOWS
from app.dependencies import store
from app.ml.predictor import get_predictor

router = APIRouter(prefix="/predict", tags=["predict"])


class MLPredictRequest(BaseModel):
    """Request body for ML prediction."""
    measured_flow: float
    expected_flow: float
    flow_deviation: float
    pressure: float
    water_balance: float
    production_condition: float


def _extract_ml_features(snapshot: dict) -> dict:
    """
    Extract ML features from a simulation snapshot.
    
    Uses the same logic as the simulation to compute expected flow and other features.
    """
    flows = snapshot.get("flows", {})
    pressures = snapshot.get("pressures", {})
    machines = snapshot.get("machines", {})
    
    # Get measured flow from root junction (J1)
    measured_flow = flows.get("J1", 0.0)
    
    # Compute expected flow based on machine production
    expected_flow = 0.0
    total_production = 0.0
    active_machines = 0
    
    for mid, m_info in machines.items():
        base_flow = MACHINE_BASE_FLOWS.get(mid, 125.0)
        production_pct = m_info.get("production_pct", 0.0)
        state = m_info.get("state", "OFF")
        
        if state in ("RUNNING", "STARTING", "STOPPING"):
            expected_flow += base_flow * (production_pct / 100.0)
            total_production += base_flow * (production_pct / 100.0)
            active_machines += 1
    
    # Flow deviation
    flow_deviation = (measured_flow - expected_flow) / expected_flow if expected_flow > 0 else 0.0
    
    # Average pressure
    avg_pressure = sum(pressures.values()) / len(pressures) if pressures else 0.0
    
    # Water balance (simplified - measured vs expected)
    water_balance = expected_flow / measured_flow if measured_flow > 0 else 1.0
    
    # Production condition (average flow per active machine)
    production_condition = total_production / active_machines if active_machines > 0 else 0.0
    
    return {
        "measured_flow": measured_flow,
        "expected_flow": expected_flow,
        "flow_deviation": flow_deviation,
        "pressure": avg_pressure,
        "water_balance": water_balance,
        "production_condition": production_condition
    }


@router.get("/current")
def predict_current():
    """Run the classifier pipeline on the most recent tick."""
    if store.latest is None:
        return {"detail": "No simulation data yet. Call POST /simulation/step first."}
    flat = _flatten_snapshot(store.latest)
    return predict_from_state(flat)


@router.get("/ml/current")
def predict_ml_current():
    """
    Run the ML model on the latest simulation state.
    
    Automatically extracts features from the current snapshot.
    """
    if store.latest is None:
        return {"detail": "No simulation data yet. Call POST /simulation/step first."}
    
    features = _extract_ml_features(store.latest)
    predictor = get_predictor()
    return predictor.predict(features)


@router.post("/ml")
def predict_ml(req: MLPredictRequest):
    """
    Run the ML model on provided features.
    
    Returns prediction (NORMAL/ANOMALY) and confidence score.
    """
    predictor = get_predictor()
    
    features = {
        "measured_flow": req.measured_flow,
        "expected_flow": req.expected_flow,
        "flow_deviation": req.flow_deviation,
        "pressure": req.pressure,
        "water_balance": req.water_balance,
        "production_condition": req.production_condition
    }
    
    return predictor.predict(features)
