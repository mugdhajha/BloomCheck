# 🌸 BloomCheck — PCOS Detection & Awareness

A full-stack AI-powered PCOS detection web application with a pastel health-tech aesthetic.

---

## 📁 Project Structure

```
bloomcheck/
├── backend/
│   ├── app.py               ← Flask REST API
│   ├── train_model.py       ← ML training script
│   ├── model.pkl            ← Trained model (generated after training)
│   ├── pcos_dataset.csv     ← Synthetic dataset (generated after training)
│   └── requirements.txt
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env.example         ← Copy to .env and add your API key
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── tokens.js
        ├── components/
        │   ├── Nav.jsx
        │   └── Particles.jsx
        └── pages/
            ├── Landing.jsx
            ├── FormPage.jsx
            ├── Results.jsx
            ├── Awareness.jsx
            └── Chat.jsx
```

---

## 🚀 Setup & Run (Step by Step)

### Prerequisites
- Python 3.9+
- Node.js 18+
- An Anthropic API key (for the AI chat — free tier works)

---

### Step 1 — Backend

```bash
# Navigate into backend
cd bloomcheck/backend

# Create a virtual environment
python -m venv venv

# Activate it
source venv/bin/activate        # Mac / Linux
# venv\Scripts\activate         # Windows

# Install Python dependencies
pip install -r requirements.txt

# Train the ML model (creates model.pkl + pcos_dataset.csv)
python train_model.py

# Start the Flask API server
python app.py
# ✅ Running on http://localhost:5000
```

---

### Step 2 — Frontend

Open a **new terminal window**:

```bash
# Navigate into frontend
cd bloomcheck/frontend

# Install Node dependencies
npm install

# Set up your environment file
cp .env.example .env
# Then open .env and replace "your_anthropic_api_key_here"
# with your actual key from https://console.anthropic.com

# Start the dev server
npm run dev
# ✅ Running on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint        | Description                          |
|--------|----------------|--------------------------------------|
| GET    | `/health`       | Health check + model status          |
| POST   | `/predict`      | PCOS risk prediction                 |
| GET    | `/insights`     | Global stats & awareness data        |
| POST   | `/save-result`  | Save result to in-memory store       |

### POST `/predict` — Request body

```json
{
  "age": 26,
  "height_cm": 163,
  "weight_kg": 68,
  "cycle_length": 42,
  "weight_gain": 1,
  "hair_growth": 1,
  "skin_darkening": 0,
  "hair_loss": 0,
  "pimples": 1,
  "mood_swings": 1,
  "fast_food": 1,
  "reg_exercise": 0
}
```

### POST `/predict` — Response

```json
{
  "probability": 74.2,
  "label": "High Risk",
  "color": "#f472b6",
  "emoji": "💜",
  "message": "Several symptoms are commonly linked with PCOS...",
  "suggestions": ["See a doctor or gynaecologist...", "..."],
  "key_factors": [
    { "feature": "Irregular Cycle", "impact": "increases", "value": "42 days" },
    { "feature": "Regular Exercise", "impact": "decreases", "value": "Yes" }
  ],
  "timestamp": "2025-04-11T10:00:00"
}
```

---

## 🧠 ML Model

| Property       | Value                                      |
|---------------|--------------------------------------------|
| Algorithm      | Random Forest + Platt calibration          |
| Training data  | 2,000 synthetic samples (50/50 balanced)   |
| Features       | 11 (age, BMI, cycle length, 8 symptoms)    |
| Anti-bias      | `class_weight='balanced'` + CalibratedCV   |
| Expected AUC   | ~0.92                                      |

---

## 💬 AI Chat Setup

The chat uses the Claude API directly from the browser (local dev only).

1. Get a free API key at **https://console.anthropic.com**
2. Copy `.env.example` → `.env`
3. Set `VITE_ANTHROPIC_API_KEY=sk-ant-...`
4. Restart `npm run dev`

> **Production note:** Never expose your API key in a deployed frontend. Use a backend proxy endpoint instead.

---

## 🎨 Pages

| Page       | Route (nav) | Description                                      |
|-----------|-------------|--------------------------------------------------|
| Landing   | Home        | Hero, stats, how-it-works                        |
| Form      | Check Risk  | 3-step form: basic info → symptoms → lifestyle   |
| Results   | (auto)      | Risk ring, factor attribution, charts            |
| Awareness | Awareness   | Educational cards on symptoms & management       |
| Chat      | AI Chat     | Claude-powered PCOS Q&A assistant                |

---

## ⚠️ Disclaimer

BloomCheck is an informational tool only. It is **not a medical device** and results are **not a diagnosis**. Always consult a qualified healthcare professional for medical advice.
