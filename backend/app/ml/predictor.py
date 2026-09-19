"""
ML predictor for AquaWatch anomaly detection.

Loads the trained RandomForest model and provides prediction functionality.
"""

import os
import joblib
from typing import Dict, Any, Optional

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model.joblib")


class MLPredictor:
    """Lightweight ML predictor for anomaly detection."""
    
    def __init__(self):
        self.model = None
        self._load_error = None
        self._load_model()
    
    def _load_model(self):
        """Load the trained model from disk."""
        try:
            if os.path.exists(MODEL_PATH):
                self.model = joblib.load(MODEL_PATH)
                print(f"ML model loaded successfully from {MODEL_PATH}")
            else:
                self._load_error = f"Model file not found at {MODEL_PATH}"
                print(f"Warning: {self._load_error}")
        except Exception as e:
            self._load_error = str(e)
            print(f"Warning: Failed to load ML model: {self._load_error}")
    
    def is_loaded(self) -> bool:
        """Check if the model is loaded successfully."""
        return self.model is not None
    
    def predict(self, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Make a prediction using the loaded model.
        
        Args:
            features: Dictionary containing the required features:
                - measured_flow: Current measured flow rate
                - expected_flow: Expected flow rate based on production
                - flow_deviation: Deviation from expected flow
                - pressure: Current pressure
                - water_balance: Water balance ratio
                - production_condition: Average production condition
        
        Returns:
            Dictionary with prediction results:
                - prediction: "NORMAL" or "ANOMALY"
                - confidence: Confidence score (0-1)
                - status: "ok" or error status
        """
        if not self.is_loaded():
            return {
                "status": "model_not_loaded",
                "detail": self._load_error,
                "prediction": None,
                "confidence": None
            }
        
        try:
            # Extract features in the correct order
            feature_order = ['measured_flow', 'expected_flow', 'flow_deviation', 
                           'pressure', 'water_balance', 'production_condition']
            
            X = [[features.get(f, 0.0) for f in feature_order]]
            
            # Get prediction and probability
            prediction = self.model.predict(X)[0]
            probabilities = self.model.predict_proba(X)[0]
            confidence = probabilities[1] if prediction == 1 else probabilities[0]
            
            return {
                "status": "ok",
                "prediction": "ANOMALY" if prediction == 1 else "NORMAL",
                "confidence": round(confidence, 4)
            }
        except Exception as e:
            return {
                "status": "prediction_error",
                "detail": str(e),
                "prediction": None,
                "confidence": None
            }


# Global predictor instance
_predictor: Optional[MLPredictor] = None


def get_predictor() -> MLPredictor:
    """Get or create the global predictor instance."""
    global _predictor
    if _predictor is None:
        _predictor = MLPredictor()
    return _predictor
