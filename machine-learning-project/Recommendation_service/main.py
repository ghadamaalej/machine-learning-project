import json
import os
import pickle
import logging
from pathlib import Path
from typing import Dict, Any, Optional

import numpy as np
import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field

# ======================================================
# APP
# ======================================================
app = FastAPI(title="ML Services API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ml_service")

# ======================================================
# PATHS
# ======================================================
APP_DIR = Path(__file__).resolve().parent

# Recommendation (clustering) assets
RECOMMEND_MODEL_PATH = APP_DIR / "model.pkl"
SCALER_PATH = APP_DIR / "scaler.pkl"
RECOMMEND_META_PATH = APP_DIR / "metadata.json"

# Prediction (CGPA) assets
PREDICT_MODEL_PATH = os.environ.get("MODEL_PATH", "model.joblib")
PREDICT_META_PATH = os.environ.get("METADATA_PATH", "metadata.json")

# ======================================================
# GLOBALS
# ======================================================
recommend_model = None
scaler = None
recommend_meta: Dict[str, Any] = {}

predict_pipeline = None
predict_metadata: Dict[str, Any] = {}

# ======================================================
# REQUEST / RESPONSE SCHEMAS
# ======================================================
class RecommendRequest(BaseModel):
    depression: float
    financial_stress: float
    academic_pressure: float
    suicidal_thoughts: float
    study_satisfaction: float
    sleep_duration: float
    dietary_habits: float


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

# ======================================================
# LOAD ASSETS
# ======================================================
@app.on_event("startup")
def load_assets():
    global recommend_model, scaler, recommend_meta
    global predict_pipeline, predict_metadata

    # ---- Recommendation assets ----
    if RECOMMEND_MODEL_PATH.exists():
        with open(RECOMMEND_MODEL_PATH, "rb") as f:
            recommend_model = pickle.load(f)
        logger.info("Recommendation model loaded")

    if SCALER_PATH.exists():
        with open(SCALER_PATH, "rb") as f:
            scaler = pickle.load(f)
        logger.info("Scaler loaded")

    if RECOMMEND_META_PATH.exists():
        with open(RECOMMEND_META_PATH, "r", encoding="utf-8") as f:
            recommend_meta = json.load(f)
        logger.info("Recommendation metadata loaded")

    # ---- Prediction assets ----
    if os.path.exists(PREDICT_MODEL_PATH):
        predict_pipeline = joblib.load(PREDICT_MODEL_PATH)
        logger.info("Prediction model loaded")

    if os.path.exists(PREDICT_META_PATH):
        with open(PREDICT_META_PATH, "r", encoding="utf-8") as f:
            predict_metadata = json.load(f)
        logger.info("Prediction metadata loaded")

# ======================================================
# UTILITIES (RECOMMEND)
# ======================================================
def build_dataframe(req: RecommendRequest) -> pd.DataFrame:
    aliases = recommend_meta["input_aliases"]
    features = recommend_meta["features"]

    row = {aliases[k]: v for k, v in req.model_dump().items()}
    return pd.DataFrame([row], columns=features)


def cluster_to_group(cluster: int) -> str:
    return recommend_meta["cluster_to_group"].get(str(cluster), "Unknown")


def get_recommendations(group: str):
    return recommend_meta["recommendations"].get(
        group, ["No recommendations available."]
    )

# ======================================================
# ROUTES
# ======================================================
@app.get("/health")
def health():
    return {
        "recommend_model_loaded": recommend_model is not None,
        "predict_model_loaded": predict_pipeline is not None,
    }

# ---------------- RECOMMEND ----------------
@app.post("/recommend")
def recommend(req: RecommendRequest):
    if recommend_model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Recommendation model not loaded")

    try:
        df = build_dataframe(req)
        X_scaled = scaler.transform(df.to_numpy())
        cluster = int(recommend_model.predict(X_scaled)[0])
        group = cluster_to_group(cluster)
        recommendations = get_recommendations(group)

        return {
            "cluster": cluster,
            "group": group,
            "recommendations": recommendations,
        }

    except Exception as e:
        logger.exception("Recommendation failed")
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- PREDICT ----------------
@app.post("/predict", response_model=PredictResponse)
async def predict(payload: PredictRequest):
    if predict_pipeline is None:
        raise HTTPException(status_code=500, detail="Prediction model not loaded")

    feature_order = predict_metadata.get("feature_order")
    if feature_order:
        try:
            values = [getattr(payload, f) for f in feature_order]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Bad input: {e}")
    else:
        values = list(payload.model_dump().values())

    X = np.array(values).reshape(1, -1)

    try:
        y_pred = await run_in_threadpool(predict_pipeline.predict, X)
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "prediction": float(y_pred[0]),
        "model": PREDICT_MODEL_PATH,
        "metadata": predict_metadata,
    }
