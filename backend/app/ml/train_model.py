"""
Train a lightweight RandomForest classifier for AquaWatch anomaly detection.

Generates synthetic training data using the same simulation logic as the AquaWatch backend.
Trains a RandomForestClassifier and saves it using joblib.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import random
import os

# Use the same configuration as the simulation
MACHINE_BASE_FLOWS = {f"M{i}": 125.0 for i in range(1, 9)}
TAP_BASE_FLOWS = {f"T{i}": 20.0 for i in range(1, 4)}
BASE_PRESSURE = 6.0
PRESSURE_K = 0.002
NOISE_SIGMA_FRACTION = 0.01


def add_noise(value):
    """Add Gaussian measurement noise."""
    if value == 0.0:
        return 0.0
    sigma = abs(value) * NOISE_SIGMA_FRACTION
    return value + random.gauss(0, sigma)


def compute_machine_flow(machine_id, production_pct, state):
    """Compute machine flow using simulation logic."""
    if state in ("OFF", "MAINTENANCE"):
        return 0.0
    
    base = MACHINE_BASE_FLOWS.get(machine_id, 125.0)
    running_flow = base * (production_pct / 100.0)
    
    if state in ("STARTING", "STOPPING"):
        running_flow *= 0.5
    
    return add_noise(running_flow)


def compute_tap_flow(tap_id, state):
    """Compute tap flow using simulation logic."""
    if state == "CLOSED":
        return 0.0
    
    base = TAP_BASE_FLOWS.get(tap_id, 20.0)
    random_factor = random.uniform(0.6, 1.4)
    return add_noise(base * random_factor)


def compute_pressure(flow):
    """Compute pressure using simulation logic."""
    return BASE_PRESSURE - (PRESSURE_K * flow) + random.gauss(0, 0.01)


def generate_normal_samples(n_samples=200):
    """Generate normal operation samples."""
    samples = []
    
    for _ in range(n_samples):
        # Normal production: machines at 50-100%, random states
        machine_flows = []
        total_flow = 0
        
        for mid in MACHINE_BASE_FLOWS.keys():
            production_pct = random.uniform(50, 100)
            state = random.choice(["RUNNING", "RUNNING", "RUNNING", "STARTING", "OFF"])
            flow = compute_machine_flow(mid, production_pct, state)
            machine_flows.append(flow)
            total_flow += flow
        
        # Taps mostly closed
        tap_flows = []
        for tid in TAP_BASE_FLOWS.keys():
            state = random.choice(["CLOSED", "CLOSED", "CLOSED", "OPEN"])
            flow = compute_tap_flow(tid, state)
            tap_flows.append(flow)
            total_flow += flow
        
        # Expected flow (approximate based on production)
        expected_flow = sum([MACHINE_BASE_FLOWS[mid] * 0.8 for mid in MACHINE_BASE_FLOWS.keys()])
        
        # Features
        flow_deviation = (total_flow - expected_flow) / expected_flow if expected_flow > 0 else 0
        pressure = compute_pressure(total_flow)
        
        # Water balance (should be close to 1.0 for normal)
        water_balance = 1.0 + random.gauss(0, 0.02)
        
        sample = {
            'measured_flow': total_flow,
            'expected_flow': expected_flow,
            'flow_deviation': flow_deviation,
            'pressure': pressure,
            'water_balance': water_balance,
            'production_condition': sum(machine_flows) / len(machine_flows),
            'target': 0  # NORMAL
        }
        samples.append(sample)
    
    return samples


def generate_high_production_samples(n_samples=100):
    """Generate high production but normal operation samples."""
    samples = []
    
    for _ in range(n_samples):
        # High production: machines at 100-180%
        machine_flows = []
        total_flow = 0
        
        for mid in MACHINE_BASE_FLOWS.keys():
            production_pct = random.uniform(100, 180)
            state = "RUNNING"
            flow = compute_machine_flow(mid, production_pct, state)
            machine_flows.append(flow)
            total_flow += flow
        
        # Taps mostly closed
        tap_flows = []
        for tid in TAP_BASE_FLOWS.keys():
            state = random.choice(["CLOSED", "CLOSED", "CLOSED", "OPEN"])
            flow = compute_tap_flow(tid, state)
            tap_flows.append(flow)
            total_flow += flow
        
        # Expected flow (higher for high production)
        expected_flow = sum([MACHINE_BASE_FLOWS[mid] * 1.4 for mid in MACHINE_BASE_FLOWS.keys()])
        
        # Features
        flow_deviation = (total_flow - expected_flow) / expected_flow if expected_flow > 0 else 0
        pressure = compute_pressure(total_flow)
        
        # Water balance (should be close to 1.0 even for high production)
        water_balance = 1.0 + random.gauss(0, 0.02)
        
        sample = {
            'measured_flow': total_flow,
            'expected_flow': expected_flow,
            'flow_deviation': flow_deviation,
            'pressure': pressure,
            'water_balance': water_balance,
            'production_condition': sum(machine_flows) / len(machine_flows),
            'target': 0  # NORMAL (high production is normal)
        }
        samples.append(sample)
    
    return samples


def generate_leak_samples(n_samples=150):
    """Generate leak/anomaly samples."""
    samples = []
    
    for _ in range(n_samples):
        # Normal production
        machine_flows = []
        total_flow = 0
        
        for mid in MACHINE_BASE_FLOWS.keys():
            production_pct = random.uniform(50, 100)
            state = random.choice(["RUNNING", "RUNNING", "RUNNING", "STARTING", "OFF"])
            flow = compute_machine_flow(mid, production_pct, state)
            machine_flows.append(flow)
            total_flow += flow
        
        # Taps mostly closed
        tap_flows = []
        for tid in TAP_BASE_FLOWS.keys():
            state = random.choice(["CLOSED", "CLOSED", "CLOSED", "OPEN"])
            flow = compute_tap_flow(tid, state)
            tap_flows.append(flow)
            total_flow += flow
        
        # Add leak (simulated as extra flow loss)
        leak_rate = random.uniform(100, 300)
        total_flow += leak_rate  # This represents the measured flow including leak
        
        # Expected flow (based on production only, not including leak)
        expected_flow = sum([MACHINE_BASE_FLOWS[mid] * 0.8 for mid in MACHINE_BASE_FLOWS.keys()])
        
        # Features
        flow_deviation = (total_flow - expected_flow) / expected_flow if expected_flow > 0 else 0
        pressure = compute_pressure(total_flow) - random.uniform(0.5, 1.5)  # Pressure drop due to leak
        
        # Water balance (should be < 1.0 for leak)
        water_balance = 0.85 + random.gauss(0, 0.03)
        
        sample = {
            'measured_flow': total_flow,
            'expected_flow': expected_flow,
            'flow_deviation': flow_deviation,
            'pressure': pressure,
            'water_balance': water_balance,
            'production_condition': sum(machine_flows) / len(machine_flows),
            'target': 1  # ANOMALY/LEAK
        }
        samples.append(sample)
    
    return samples


def generate_pressure_drop_samples(n_samples=50):
    """Generate pressure drop anomaly samples."""
    samples = []
    
    for _ in range(n_samples):
        # Normal production
        machine_flows = []
        total_flow = 0
        
        for mid in MACHINE_BASE_FLOWS.keys():
            production_pct = random.uniform(50, 100)
            state = "RUNNING"
            flow = compute_machine_flow(mid, production_pct, state)
            machine_flows.append(flow)
            total_flow += flow
        
        # Taps closed
        for tid in TAP_BASE_FLOWS.keys():
            flow = compute_tap_flow(tid, "CLOSED")
            total_flow += flow
        
        # Expected flow
        expected_flow = sum([MACHINE_BASE_FLOWS[mid] * 0.8 for mid in MACHINE_BASE_FLOWS.keys()])
        
        # Features - significant pressure drop without flow change
        flow_deviation = (total_flow - expected_flow) / expected_flow if expected_flow > 0 else 0
        pressure = compute_pressure(total_flow) - random.uniform(1.0, 2.0)  # Significant pressure drop
        
        # Water balance (normal)
        water_balance = 1.0 + random.gauss(0, 0.02)
        
        sample = {
            'measured_flow': total_flow,
            'expected_flow': expected_flow,
            'flow_deviation': flow_deviation,
            'pressure': pressure,
            'water_balance': water_balance,
            'production_condition': sum(machine_flows) / len(machine_flows),
            'target': 1  # ANOMALY (pressure drop)
        }
        samples.append(sample)
    
    return samples


def main():
    """Main training function."""
    print("Generating synthetic training dataset...")
    
    # Generate samples
    normal_samples = generate_normal_samples(200)
    high_production_samples = generate_high_production_samples(100)
    leak_samples = generate_leak_samples(150)
    pressure_drop_samples = generate_pressure_drop_samples(50)
    
    # Combine all samples
    all_samples = normal_samples + high_production_samples + leak_samples + pressure_drop_samples
    df = pd.DataFrame(all_samples)
    
    print(f"Generated {len(df)} training samples")
    print(f"Class distribution:\n{df['target'].value_counts()}")
    
    # Split features and target
    feature_columns = ['measured_flow', 'expected_flow', 'flow_deviation', 'pressure', 
                      'water_balance', 'production_condition']
    X = df[feature_columns]
    y = df['target']
    
    # Split train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"\nTraining set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # Train RandomForest
    print("\nTraining RandomForestClassifier...")
    model = RandomForestClassifier(
        n_estimators=50,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nTest Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['NORMAL', 'ANOMALY']))
    
    # Feature importance
    print("\nFeature Importance:")
    for feature, importance in zip(feature_columns, model.feature_importances_):
        print(f"  {feature}: {importance:.4f}")
    
    # Save model
    model_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(model_dir, "model.joblib")
    
    print(f"\nSaving model to {model_path}")
    joblib.dump(model, model_path)
    
    print("Training complete!")
    print(f"\nIMPORTANT: This model was trained on synthetic/simulation data, not real industrial data.")
    print("This is a proof-of-concept for hackathon demonstration purposes.")


if __name__ == "__main__":
    main()
