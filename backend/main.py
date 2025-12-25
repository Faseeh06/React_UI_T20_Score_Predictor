from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
import os
import sys
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# CatBoost Pickling Fix
# We define a stub class so pickle can find 'utils.models.CatBoostModel'
class CatBoostModel:
    def __init__(self, model):
        self.model = model
    def predict(self, data):
        return self.model.predict(data)

# Create the module structure in sys.modules so pickle finds it
import types
utils_mod = types.ModuleType('utils')
sys.modules['utils'] = utils_mod
models_mod = types.ModuleType('utils.models')
sys.modules['utils.models'] = models_mod
models_mod.CatBoostModel = CatBoostModel

MODELS_DIR = r"d:\Study Stuff\Hackathon\3d wali\public\models"

loaded_models = {}

def load_all_models():
    model_files = {
        "Random Forest": "test20rf.pkl",
        "CatBoost": "test20cb.pkl",
        "XG Boost": "test20xgnoscale.pkl",
        "LightGBM": "test20lgbm.pkl",
        "Lasso": "test20lasso.pkl"
    }
    
    for name, filename in model_files.items():
        path = os.path.join(MODELS_DIR, filename)
        if os.path.exists(path):
            try:
                with open(path, "rb") as f:
                    loaded_models[name] = pickle.load(f)
                print(f"✅ Loaded {name} from {filename}")
            except Exception as e:
                print(f"❌ Error loading {name} ({filename}): {e}")
        else:
            print(f"⚠️ Model file not found: {path}")

# Load models on startup
load_all_models()

class MatchData(BaseModel):
    batting_team: str
    bowling_team: str
    city: str
    current_score: int
    overs: float
    wickets: int
    batsmen_left: int
    last_five: int

@app.post("/predict")
async def predict(data: MatchData):
    try:
        # 1. Feature Engineering (must match training features)
        balls_left = 120 - (data.overs * 6)
        wickets_left = 10 - data.wickets
        crr = data.current_score / data.overs if data.overs > 0 else 0
        
        # Construct DataFrame
        input_df = pd.DataFrame({
            'batting_team': [data.batting_team],
            'bowling_team': [data.bowling_team],
            'city': [data.city],
            'current_score': [data.current_score],
            'balls_left': [balls_left],
            'wickets_left': [wickets_left],
            'crr': [crr],
            'last_five': [data.last_five],
            'batsman_left': [data.batsmen_left]
        })
        
        predictions = {}
        for name, model in loaded_models.items():
            try:
                # Handle our wrapper or direct model
                if hasattr(model, 'predict'):
                    # Some models (like Sklearn Pipelines) expect DataFrames
                    # CatBoost stub might wrap the real model
                    if isinstance(model, CatBoostModel):
                        # Some versions of CatBoost expect specific feature types
                        pred = model.model.predict(input_df)[0]
                    else:
                        pred = model.predict(input_df)[0]
                else:
                    pred = "Model object has no predict method"
                
                predictions[name] = float(pred)
            except Exception as e:
                predictions[name] = f"Error: {str(e)}"
        
        return {
            "status": "success",
            "predictions": predictions,
            "metadata": {
                "crr": round(crr, 2),
                "balls_remaining": int(balls_left)
            }
        }
        
    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
