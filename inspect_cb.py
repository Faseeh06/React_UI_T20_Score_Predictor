import pickle
import os

model_path = r'd:\Study Stuff\Hackathon\3d wali\public\models\test20cb.pkl'

try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print(f"Model type: {type(model)}")
    if hasattr(model, 'feature_names_'):
        print(f"Features: {model.feature_names_}")
except Exception as e:
    print(f"Error: {e}")
