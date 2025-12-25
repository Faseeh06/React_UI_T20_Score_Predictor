import pickle
import pandas as pd

model_path = r'd:\Study Stuff\Hackathon\3d wali\public\models\test20rf.pkl'

try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print(f"Steps: {model.steps}")
except Exception as e:
    print(f"Error: {e}")
