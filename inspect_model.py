import pickle
import pandas as pd
import os

model_path = r'd:\Study Stuff\Hackathon\3d wali\public\models\test20rf.pkl'

try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print(f"Model type: {type(model)}")
    if hasattr(model, 'feature_names_in_'):
        print(f"Features: {model.feature_names_in_}")
    elif hasattr(model, 'feature_importances_'):
        print(f"Number of features: {len(model.feature_importances_)}")
except Exception as e:
    print(f"Error: {e}")
