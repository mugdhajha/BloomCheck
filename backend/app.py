"""
BloomCheck — PCOS Detection API
================================
Run:  python app.py
API:  http://localhost:5000
"""

import os, joblib
from xml.parsers.expat import model
import numpy as np
import pandas as pd
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

_store = []   # in-memory result store (demo)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("model.pkl not found — run: python train_model.py")
    art = joblib.load(MODEL_PATH)
    return art["pipeline"], art["features"]

try:
    pipeline, FEATURE_COLS = load_model()
    print(f"✅  Model loaded  |  features: {FEATURE_COLS}")
except FileNotFoundError as e:
    print(f"⚠️   {e}")
    pipeline, FEATURE_COLS = None, []


# ── helpers ──────────────────────────────────────────────────────────────────

def bmi_from(height_cm: float, weight_kg: float) -> float:
    h = height_cm / 100
    return round(weight_kg / (h * h), 1)

def risk_meta(prob: float) -> dict:
    if prob < 0.35:
        return dict(
            label="Low Risk", color="#6ee7b7", emoji="🌿",
            message="Your symptoms suggest a lower likelihood of PCOS. Keep maintaining those healthy habits!",
            suggestions=[
                "Keep up regular exercise (150 min/week)",
                "Maintain a balanced, nutritious diet",
                "Track your cycle each month",
                "Annual gynaecological check-ups are always a good idea",
            ],
        )
    elif prob < 0.65:
        return dict(
            label="Moderate Risk", color="#fbbf24", emoji="🌸",
            message="Some of your symptoms are associated with PCOS. A visit to a gynaecologist would be a great next step.",
            suggestions=[
                "Book a gynaecologist appointment soon",
                "Ask your doctor about a hormonal blood panel",
                "Consider a pelvic ultrasound",
                "Cut back on refined sugars and processed foods",
                "Try gentle movement — yoga or daily walks work great",
            ],
        )
    else:
        return dict(
            label="High Risk", color="#f472b6", emoji="💜",
            message="Several symptoms are commonly linked with PCOS. Please consult a doctor — PCOS is very manageable with support!",
            suggestions=[
                "See a doctor or gynaecologist as soon as possible",
                "Request a full hormonal blood panel",
                "Ask about a pelvic ultrasound",
                "Discuss treatment options — many effective ones exist",
                "Connect with a PCOS support community",
                "Focus on a low-glycemic diet and consistent movement",
            ],
        )

def key_factors(data: dict, bmi: float) -> list:
    out = []
    cl = float(data.get("cycle_length", 28))
    if cl > 35:
        out.append({"feature": "Irregular Cycle",    "impact": "increases", "value": f"{int(cl)} days"})
    if data.get("hair_growth"):
        out.append({"feature": "Excess Hair Growth", "impact": "increases", "value": "Yes"})
    if data.get("weight_gain"):
        out.append({"feature": "Weight Gain",        "impact": "increases", "value": "Yes"})
    if bmi > 25:
        out.append({"feature": "BMI",                "impact": "increases", "value": str(bmi)})
    if data.get("skin_darkening"):
        out.append({"feature": "Skin Darkening",     "impact": "increases", "value": "Yes"})
    if data.get("pimples"):
        out.append({"feature": "Acne",               "impact": "increases", "value": "Yes"})
    if data.get("reg_exercise"):
        out.append({"feature": "Regular Exercise",   "impact": "decreases", "value": "Yes"})
    return out[:6]


# ── endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return jsonify({"status": "ok", "model_loaded": pipeline is not None})


@app.post("/predict")
def predict():
    if pipeline is None:
        return jsonify({"error": "Model not loaded — run train_model.py first"}), 503

    d = request.get_json(force=True, silent=True) or {}

    # Validate & derive BMI
    try:
        h, w = float(d["height_cm"]), float(d["weight_kg"])
        bmi = bmi_from(h, w)
    except (KeyError, ValueError, ZeroDivisionError):
        return jsonify({"error": "height_cm and weight_kg are required numbers"}), 400

    # cl = float(d.get("cycle_length", 28))

    # vec = pd.DataFrame([[
    #     float(d.get("age", 25)),
    #     bmi,
    #     cl,
    #     int(bool(d.get("weight_gain"))),
    #     int(bool(d.get("hair_growth"))),
    #     int(bool(d.get("skin_darkening"))),
    #     int(bool(d.get("hair_loss"))),
    #     int(bool(d.get("pimples"))),
    #     int(bool(d.get("mood_swings"))),
    #     int(bool(d.get("fast_food"))),
    #     int(bool(d.get("reg_exercise"))),
    # ]], columns=FEATURE_COLS) > 35).astype(int)
    cl = float(d.get("cycle_length", 28))  # 🔥 NEW LINE

    row = {
    "age": float(d.get("age", 25)),
    "bmi": bmi,
    "cycle_length": cl, # 🔥 IMPORTANT
    "weight_gain": int(bool(d.get("weight_gain"))),
    "hair_growth": int(bool(d.get("hair_growth"))),
    "skin_darkening": int(bool(d.get("skin_darkening"))),
    "hair_loss": int(bool(d.get("hair_loss"))),
    "pimples": int(bool(d.get("pimples"))),
    "mood_swings": int(bool(d.get("mood_swings"))),
    "fast_food": int(bool(d.get("fast_food"))),
    "reg_exercise": int(bool(d.get("reg_exercise")))
    }

    vec = pd.DataFrame([row], columns=FEATURE_COLS)
    model_data = joblib.load(MODEL_PATH)

# Extract actual trained model
    model = model_data["pipeline"]

# If pipeline exists, extract classifier safely
    if hasattr(model, "named_steps"):
        model = model.named_steps.get("clf", model)

# Convert vec to numpy (avoid column name issues)
    prob = float(pipeline.predict_proba(vec)[0, 1])
    meta   = risk_meta(prob)
    factors = key_factors(d, bmi)

    return jsonify({
        "probability":   round(prob * 100, 1),
        **meta,
        "key_factors":   factors,
        "timestamp":     datetime.utcnow().isoformat(),
    })


@app.get("/insights")
def insights():
    return jsonify({
        "global_prevalence": [
            {"region": "South Asia",    "rate": 22},
            {"region": "Middle East",   "rate": 18},
            {"region": "N. America",    "rate": 15},
            {"region": "Europe",        "rate": 12},
            {"region": "East Asia",     "rate": 8},
            {"region": "Global Avg",    "rate": 10},
        ],
        "lifestyle_risk": [
            {"factor": "Sedentary",     "risk": 78},
            {"factor": "High Sugar",    "risk": 72},
            {"factor": "Poor Sleep",    "risk": 65},
            {"factor": "High Stress",   "risk": 60},
            {"factor": "Active",        "risk": 25},
            {"factor": "Balanced Diet", "risk": 20},
        ],
    })


@app.post("/save-result")
def save_result():
    d = request.get_json(force=True, silent=True) or {}
    _store.append({**d, "saved_at": datetime.utcnow().isoformat()})
    return jsonify({"saved": True, "total": len(_store)})


if __name__ == "__main__":
    app.run(debug=True, port=5000)

print("MODEL PATH:", MODEL_PATH)
print("FEATURES LOADED:", FEATURE_COLS)
