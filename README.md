# 🌸 BloomCheck

A pastel, health-tech themed **PCOS awareness + early risk screening** web app.

BloomCheck lets a user answer a short set of questions (basic info + visible symptoms + lifestyle) and then returns a **risk score** with clear, actionable next steps — plus educational content and a built-in PCOS chatbot.

> **Disclaimer:** BloomCheck is for informational purposes only. It is **not** a medical device and does **not** diagnose PCOS. Always consult a qualified healthcare professional.

---

## What it can do

### ✅ PCOS risk check (under ~2 minutes)
- 3-step guided form: **About you → Symptoms → Lifestyle**
- Calculates BMI and shows a quick BMI category badge
- Submits your answers to the backend `/predict` endpoint
- Displays:
  - **Probability (%)**
  - Category label: **Low / Moderate / High**
  - Key factors that increased/decreased risk
  - Recommendations tailored to the risk band

### ✅ Works even if the backend is down (demo-friendly)
If `/predict` fails, the frontend uses an **offline heuristic fallback** to generate a reasonable risk score + factors so the UI still works.

### ✅ Results dashboard UI
- Animated risk ring + label
- Key factor chips (↑ increases / ↓ decreases)
- Recommendation cards
- Simple chart-style sections for:
  - Global prevalence (static demo data)
  - Lifestyle vs risk (static demo data)

### ✅ Awareness / education page
A dedicated “Understanding PCOS” page with:
- Core explanation of PCOS (Rotterdam criteria context)
- Symptom cards
- Management & prevention tips

### ✅ Built-in PCOS chatbot (offline)
The “AI Chat” page is currently a **fully offline, keyword-based** chatbot (“Bloom”) with topic coverage like symptoms, diagnosis, diet, exercise, treatment, fertility, mental health, supplements, etc.

---

## Tech stack

- **Frontend:** React 18 + Vite
- **Backend:** Flask (REST API) + scikit-learn model served from `model.pkl`
- **Dev proxy:** Vite proxies API routes to Flask during development

---

## Project structure

```text
.
├── backend
│   ├── app.py              # Flask API (health, predict, insights, save-result)
│   ├── train_model.py      # Generates synthetic data + trains model.pkl
│   ├── requirements.txt
│   └── model.pkl           # generated after training
└── frontend
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src
        ├── components
        ├── pages
        └── App.jsx
```

---

## Quickstart (local dev)

### 1) Backend (Flask + model)

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python train_model.py
python app.py
```

Backend runs at: `http://localhost:5000`

### 2) Frontend (Vite + React)

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Pages (in-app navigation)

| Page | What you see |
|---|---|
| Home | hero + “how it works” + quick stats |
| Check Risk | 3-step questionnaire |
| Results | risk ring + factors + recommendations + charts |
| Awareness | educational cards + management tips |
| AI Chat | offline “Bloom” PCOS Q&A assistant |

---

## API

Base URL (local): `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | health check + whether the model loaded |
| POST | `/predict` | returns risk probability + label + suggestions |
| GET | `/insights` | returns demo global/lifestyle stats |
| POST | `/save-result` | saves results to an **in-memory** list (demo) |

### `POST /predict` request

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

### `POST /predict` response (example)

```json
{
  "probability": 74.2,
  "label": "High Risk",
  "color": "#f472b6",
  "emoji": "💜",
  "message": "Several symptoms are commonly linked with PCOS...",
  "suggestions": ["..."],
  "key_factors": [
    { "feature": "Irregular Cycle", "impact": "increases", "value": "42 days" }
  ],
  "timestamp": "2026-04-29T14:16:00.000000"
}
```

---

## ML model (how it works)

Training script: `backend/train_model.py`

- Generates a **synthetic dataset** (`pcos_dataset.csv`)
- Trains a **RandomForestClassifier** on 11 features:
  - age, BMI, cycle length
  - weight gain, hair growth, skin darkening
  - hair loss, acne/pimples, mood swings
  - fast food, regular exercise
- Saves `model.pkl` as:
  - `pipeline`: the trained model
  - `features`: feature column order expected by the API

---

## Privacy & data

- The frontend does **not** require sign-in.
- The backend’s `/save-result` uses an **in-memory** list for demo purposes only (restarts clear it).
- No database is configured in this repo.

---

## Troubleshooting

- **503 Model not loaded**: run `python backend\train_model.py` to generate `backend\model.pkl`.
- **Frontend can’t reach backend**: ensure Flask is running on port **5000**. The UI still works via offline fallback.
- **Port already in use**: stop the process using the port or change ports in `backend\app.py` / `vite.config.js`.
