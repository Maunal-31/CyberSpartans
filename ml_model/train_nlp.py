import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib
import os

def train_models(data_path, output_dir):
    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)
    
    # We want to predict 'category' and 'priority' from 'text'
    # Drop any nulls just in case
    df = df.dropna(subset=['text', 'category', 'priority'])
    
    X = df['text']
    y_category = df['category']
    y_priority = df['priority']
    
    # --- Category Model ---
    print("\nTraining Category Classification Model...")
    X_train_cat, X_test_cat, y_train_cat, y_test_cat = train_test_split(X, y_category, test_size=0.2, random_state=42)
    
    cat_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1))
    ])
    
    cat_pipeline.fit(X_train_cat, y_train_cat)
    cat_preds = cat_pipeline.predict(X_test_cat)
    print("Category Model Performance:")
    print(classification_report(y_test_cat, cat_preds))
    
    # --- Priority Model ---
    print("\nTraining Priority Classification Model...")
    X_train_pri, X_test_pri, y_train_pri, y_test_pri = train_test_split(X, y_priority, test_size=0.2, random_state=42)
    
    pri_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1))
    ])
    
    pri_pipeline.fit(X_train_pri, y_train_pri)
    pri_preds = pri_pipeline.predict(X_test_pri)
    print("Priority Model Performance:")
    print(classification_report(y_test_pri, pri_preds))
    
    # --- Save Models ---
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    cat_model_path = os.path.join(output_dir, 'category_model.pkl')
    pri_model_path = os.path.join(output_dir, 'priority_model.pkl')
    
    joblib.dump(cat_pipeline, cat_model_path)
    joblib.dump(pri_pipeline, pri_model_path)
    
    print(f"\nModels successfully saved to {output_dir}")

if __name__ == "__main__":
    # Assuming script is run from ml_model folder and CSV is in the parent dir
    csv_file = r"..\TS-PS14.csv"
    output_directory = "models"
    
    train_models(csv_file, output_directory)
