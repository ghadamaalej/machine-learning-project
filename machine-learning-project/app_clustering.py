from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "src", "app", "ml_clustering_model")

clf_risk = joblib.load(os.path.join(MODEL_DIR, "profil_risque_model.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
pca_80 = joblib.load(os.path.join(MODEL_DIR, "pca_80.pkl"))
feature_names = joblib.load(os.path.join(MODEL_DIR, "feature_names.pkl"))
student_mean = joblib.load(os.path.join(MODEL_DIR, "student_mean.pkl"))



KNOWN_CITIES = [
    'Visakhapatnam', 'Nashik', 'Meerut', 'Nagpur', 'Kalyan', 'Chennai',
    'Srinagar', 'Vasai-Virar', 'Vadodara', 'Thane', 'Hyderabad',
    'Ludhiana', 'Ghaziabad', 'Pune', 'Varanasi', 'Rajkot', 'Surat',
    'Agra', 'Jaipur', 'Lucknow', 'Kolkata', 'Faridabad', 'Ahmedabad',
    'Indore', 'Patna', 'Delhi', 'Kanpur', 'Bangalore', 'Mumbai',
    'Bhopal', 'Other'
]

SLEEP_MAP = {
    "Less than 5 hours": 4.5,
    "5-6 hours": 5.5,
    "7-8 hours": 7.5,
    "More than 8 hours": 9.0,
    "Others": 6.0,
    "": 6.0
}

LABEL_MAP = {
    "RISQUE FAIBLE": "LOW RISK",
    "RISQUE ÉLEVÉ": "HIGH RISK"
}


def preprocess_one_student(raw: pd.DataFrame) -> pd.DataFrame:
    df_tmp = raw.copy()

    # Encodages
    df_tmp["Gender"] = df_tmp["Gender"].map({"Male": 1, "Female": 0}).fillna(0)
    df_tmp["Family History of Mental Illness"] = df_tmp[
        "Family History of Mental Illness"
    ].map({"Yes": 1, "No": 0}).fillna(0)

    df_tmp["Have you ever had suicidal thoughts ?"] = df_tmp[
        "Have you ever had suicidal thoughts ?"
    ].map({1: 1, 0: 0, "Yes": 1, "No": 0}).fillna(0)

    df_tmp["Sleep Duration"] = df_tmp["Sleep Duration"].map(SLEEP_MAP).fillna(6.0)

   
    df_tmp["City"] = df_tmp["City"].apply(
        lambda c: c if c in KNOWN_CITIES else "Other"
    )

    num_cols = [
        "Age",
        "Academic Pressure",
        "CGPA",
        "Study Satisfaction",
        "Sleep Duration",
        "Work/Study Hours",
        "Financial Stress",
    ]
    for col in num_cols:
        df_tmp[col] = pd.to_numeric(df_tmp[col], errors="coerce")

    
    df_tmp[num_cols] = df_tmp[num_cols].fillna(0)

 
    df_tmp = pd.get_dummies(df_tmp, columns=["City", "Dietary Habits", "Degree"])

   
    df_tmp = df_tmp.reindex(columns=feature_names, fill_value=0)

    return df_tmp
def build_personality_interpretation(risk, comparison):
    text = []

    if risk == "HIGH RISK":
        text.append(
            "Your responses indicate a higher-than-average level of psychological vulnerability."
        )
    else:
        text.append(
            "Your responses suggest a relatively balanced psychological profile."
        )

    if comparison.get("Academic Pressure") == "above average":
        text.append(
            "You experience stronger academic pressure than most students, which may increase mental load."
        )

    if comparison.get("Financial Stress") == "above average":
        text.append(
            "Financial stress appears elevated and may contribute to emotional strain."
        )

    if comparison.get("Sleep Duration") == "below average":
        text.append(
            "Your sleep duration is below average, which can affect mood, focus, and stress resilience."
        )

    if comparison.get("Work/Study Hours") == "above average":
        text.append(
            "Extended work or study hours reflect dedication, but may also lead to fatigue over time."
        )

    if risk == "HIGH RISK":
        text.append(
            "Overall, improving balance between rest, workload, and personal support could significantly enhance well-being."
        )
    else:
        text.append(
            "Maintaining healthy habits and sufficient rest should help preserve this balance."
        )

    return text


@app.route("/predict", methods=["POST"])
def predict():
    try:
        payload = request.get_json()

        raw = pd.DataFrame([{
            "Gender": payload["gender"],
            "Age": payload["age"],
            "City": payload["city"],
            "Academic Pressure": payload["academicPressure"],
            "CGPA": payload["cgpa"],
            "Study Satisfaction": payload["studySatisfaction"],
            "Sleep Duration": payload["sleepDuration"],
            "Dietary Habits": payload["dietaryHabits"],
            "Degree": payload["degree"],
            "Have you ever had suicidal thoughts ?": payload["suicidalThoughts"],
            "Work/Study Hours": payload["workStudyHours"],
            "Financial Stress": payload["financialStress"],
            "Family History of Mental Illness": payload["familyHistoryMentalIllness"],
        }])

        # Comparaison avec la moyenne
        comparison = {}
        for feature, avg in student_mean.items():
            try:
                val = float(raw[feature].values[0])
            except:
                val = avg

            comparison[feature] = (
                "above average" if val > avg else
                "below average" if val < avg else
                "average"
            )

        # ML
        X = preprocess_one_student(raw)
        X_scaled = scaler.transform(X)
        X_pca = pca_80.transform(X_scaled)

        proba = clf_risk.predict_proba(X_pca)[0]
        label_fr = clf_risk.predict(X_pca)[0]
        label_en = LABEL_MAP[label_fr]

        probabilities = {
            LABEL_MAP[c]: float(p)
            for c, p in zip(clf_risk.classes_, proba)
        }

        interpretation = build_personality_interpretation(label_en, comparison)

        return jsonify({
            "riskLabel": label_en,
            "probabilities": probabilities,
            "comparison": comparison,
            "interpretation": interpretation  
        })

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def health():
    return "API OK"

if __name__ == "__main__":
    print("🚀 Flask running on http://localhost:5000")
    app.run(debug=True)