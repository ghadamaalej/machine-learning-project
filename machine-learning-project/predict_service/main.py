from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import joblib
import json
import numpy as np
import logging
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
import os

# Request schema - update names to match your frontend keys if needed
class PredictRequest(BaseModel):
    study_hours: float
    extracurricular_hours: float
    sleep_hours: float
    social_hours: float
    physical_activity_hours: float
    stress_level: float

class PredictResponse(BaseModel):
    prediction: float
    model: Optional[str] = None
    metadata: Optional[dict] = None

app = FastAPI(title="CGPA Predictor Service")

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("predict_service")

# Allow requests from local dev frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths (place your model.joblib and metadata.json in this folder or update these names)
MODEL_PATH = os.environ.get("MODEL_PATH", "model.joblib")
METADATA_PATH = os.environ.get("METADATA_PATH", "metadata.json")

pipeline = None
metadata = {}

# Try to load model and metadata at startup
try:
    if os.path.exists(MODEL_PATH):
        pipeline = joblib.load(MODEL_PATH)
        print(f"Loaded model from {MODEL_PATH}")
    else:
        print(f"Model file not found at {MODEL_PATH}. Place your joblib pipeline there.")
except Exception as e:
    pipeline = None
    print("Failed to load model:", e)

try:
    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            metadata = json.load(f)
            print(f"Loaded metadata from {METADATA_PATH}")
    else:
        print(f"Metadata file not found at {METADATA_PATH}.")
except Exception as e:
    metadata = {}
    print("Failed to load metadata:", e)


@app.get("/health")
async def health():
    return {"ok": True, "model_loaded": pipeline is not None}


@app.get("/debug")
async def debug_info():
    # lightweight debug endpoint to inspect model state
    info = {
        "model_loaded": pipeline is not None,
        "model_path": MODEL_PATH,
        "metadata_keys": list(metadata.keys()) if isinstance(metadata, dict) else None,
    }
    return info


@app.post("/predict", response_model=PredictResponse)
async def predict(payload: PredictRequest):
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # If metadata contains a feature order, respect it
    feature_order = metadata.get("feature_order") if isinstance(metadata, dict) else None
    if feature_order:
        try:
            values = [getattr(payload, feat) for feat in feature_order]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Bad feature input: {e}")
    else:
        # fallback order - must match training
        values = [
            payload.study_hours,
            payload.extracurricular_hours,
            payload.sleep_hours,
            payload.social_hours,
            payload.physical_activity_hours,
            payload.stress_level,
        ]

    X = np.array(values).reshape(1, -1)

    logger.info("/predict called with values=%s", values)

    try:
        # run blocking predict in threadpool to avoid blocking the event loop
        y_pred = await run_in_threadpool(pipeline.predict, X)
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    return {"prediction": float(y_pred[0]), "model": MODEL_PATH, "metadata": metadata}
