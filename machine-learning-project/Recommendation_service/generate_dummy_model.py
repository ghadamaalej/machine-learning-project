"""
Small script to generate a dummy KNN regression pipeline and save it as model.joblib
Run inside the predict_service virtualenv:

python generate_dummy_model.py

This will create `model.joblib` and `metadata.json` in this folder.
"""
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsRegressor
from joblib import dump
import numpy as np
import json

# Generate random training data matching the six features
rng = np.random.default_rng(12345)
X = rng.uniform(low=0.0, high=10.0, size=(200, 6))
# Create a synthetic target roughly correlated with study_hours and sleep_hours,
# with some noise and clamped to 0..4 range
y = 1.5 + (X[:, 0] / 12.0) * 1.5 + (X[:, 2] / 12.0) * 1.0 - (X[:, 5] / 10.0) * 0.8
y = np.clip(y + rng.normal(0, 0.2, size=y.shape), 0.0, 4.0)

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("knn", KNeighborsRegressor(n_neighbors=5))
])

pipeline.fit(X, y)

# Save model
dump(pipeline, "model.joblib")
print("Saved dummy model to model.joblib")

# Save metadata with feature order
metadata = {
    "feature_order": [
        "study_hours",
        "extracurricular_hours",
        "sleep_hours",
        "social_hours",
        "physical_activity_hours",
        "stress_level"
    ],
    "description": "Dummy KNN regressor for local testing"
}
with open("metadata.json", "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=2)
print("Saved metadata.json")
