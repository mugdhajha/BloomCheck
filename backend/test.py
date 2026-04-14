import requests
import json

url = "http://127.0.0.1:5000/predict"

# Sample input (IMPORTANT: must match backend fields)
data = {
    "age": 22,
    "height_cm": 160,
    "weight_kg": 55,
    "cycle_length": 30,
    "weight_gain": False,
    "hair_growth": False,
    "skin_darkening": False,
    "hair_loss": False,
    "pimples": True,
    "mood_swings": True,
    "fast_food": True,
    "reg_exercise": True
}

response = requests.post(url, json=data)

print("STATUS:", response.status_code)
print("RESPONSE:")
print(json.dumps(response.json(), indent=2))