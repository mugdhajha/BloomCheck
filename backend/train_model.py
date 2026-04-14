"""
BloomCheck — PCOS Model Training
==================================
Generates synthetic data and trains a calibrated Random Forest.
Run:  python train_model.py
Out:  model.pkl  +  pcos_dataset.csv
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.pipeline import Pipeline
import joblib, os

np.random.seed(42)

FEATURE_COLS = [
    "age", "bmi", "cycle_length",
    "weight_gain", "hair_growth", "skin_darkening",
    "hair_loss", "pimples", "mood_swings",
    "fast_food", "reg_exercise",
]


def generate(n=2000):
    rows = []
    for _ in range(n // 2):                         # PCOS = 1
        cl = np.clip(np.random.normal(40, 14), 21, 100)
        rows.append(dict(
            age          = np.clip(np.random.normal(27, 6), 16, 48),
            bmi          = np.clip(np.random.normal(27, 5), 16, 45),
            cycle_length = cl,
            weight_gain  = np.random.binomial(1, 0.70),
            hair_growth  = np.random.binomial(1, 0.65),
            skin_darkening=np.random.binomial(1, 0.52),
            hair_loss    = np.random.binomial(1, 0.44),
            pimples      = np.random.binomial(1, 0.60),
            mood_swings  = np.random.binomial(1, 0.58),
            fast_food    = np.random.binomial(1, 0.62),
            reg_exercise = np.random.binomial(1, 0.28),
            label        = 1,
        ))
    for _ in range(n // 2):                         # PCOS = 0
        cl = np.clip(np.random.normal(28, 4), 21, 38)
        rows.append(dict(
            age          = np.clip(np.random.normal(31, 7), 16, 48),
            bmi          = np.clip(np.random.normal(23, 4), 16, 38),
            cycle_length = cl,
            weight_gain  = np.random.binomial(1, 0.22),
            hair_growth  = np.random.binomial(1, 0.12),
            skin_darkening=np.random.binomial(1, 0.10),
            hair_loss    = np.random.binomial(1, 0.18),
            pimples      = np.random.binomial(1, 0.28),
            mood_swings  = np.random.binomial(1, 0.24),
            fast_food    = np.random.binomial(1, 0.38),
            reg_exercise = np.random.binomial(1, 0.62),
            label        = 0,
        ))
    df = pd.DataFrame(rows).sample(frac=1, random_state=42).reset_index(drop=True)
    return df


def train():
    print("🌸  Generating synthetic PCOS dataset …")
    df = generate(2000)
    print(f"    {len(df)} samples | prevalence: {df.label.mean():.1%}")

    X, y = df[FEATURE_COLS], df["label"]
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2,
                                           stratify=y, random_state=42)

    base = RandomForestClassifier(
        n_estimators=300, max_depth=8, min_samples_leaf=8,
        class_weight="balanced", random_state=42,
    )
    # pipe = Pipeline([
    #     ("scaler", StandardScaler()),
    #     ("clf",    CalibratedClassifierCV(base, cv=5, method="sigmoid")),
    # ])
    pipe = RandomForestClassifier(
    n_estimators=200,
    max_depth=6,
    random_state=42
)

    print("🔬  Training …")
    pipe.fit(Xtr, ytr)

    ypred = pipe.predict(Xte)
    yprob = pipe.predict_proba(Xte)[:, 1]
    auc   = roc_auc_score(yte, yprob)
    cv    = cross_val_score(pipe, Xtr, ytr, cv=5, scoring="roc_auc")

    print("\n📊  Evaluation")
    print(classification_report(yte, ypred, target_names=["No PCOS", "PCOS"]))
    print(f"    ROC-AUC (test): {auc:.3f}")
    print(f"    CV ROC-AUC:     {cv.mean():.3f} ± {cv.std():.3f}")
    print(f"    Prob range:     {yprob.min():.2f} – {yprob.max():.2f}  (mean {yprob.mean():.2f})")

    out = os.path.dirname(os.path.abspath(__file__))
    joblib.dump({"pipeline": pipe, "features": FEATURE_COLS},
                os.path.join(out, "model.pkl"))
    df.to_csv(os.path.join(out, "pcos_dataset.csv"), index=False)
    print("\n✅  model.pkl + pcos_dataset.csv saved")


if __name__ == "__main__":
    train()
