# CGPA Predictor Service

This folder contains a minimal FastAPI service to serve a scikit-learn pipeline saved with `joblib`.

How to use

1. Place your `model.joblib` (the saved pipeline) and `metadata.json` (optional, with `feature_order`) inside this folder.
2. Create a virtual environment and install requirements:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

3. Run the service:

```powershell
uvicorn main:app --reload --port 8001
```

4. Health check:

GET http://127.0.0.1:8001/health

5. Predict endpoint (POST):

POST http://127.0.0.1:8001/predict
Content-Type: application/json

Body example:

```json
{
  "study_hours": 4,
  "extracurricular_hours": 2,
  "sleep_hours": 7,
  "social_hours": 2,
  "physical_activity_hours": 1,
  "stress_level": 5
}
```

Notes
- If your pipeline includes preprocessing (recommended), you can pass raw inputs directly and the pipeline will handle transformation.
- Use `metadata.json` with a `feature_order` array if your pipeline expects a particular column order.
