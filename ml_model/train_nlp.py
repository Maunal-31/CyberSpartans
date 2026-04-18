import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib
import os

def train_models(data_path, output_dir):
    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)
    
    # We want to predict 'category', 'priority', and 'sentiment' from 'text'
    # Drop any nulls just in case
    df = df.dropna(subset=['text', 'category', 'priority', 'sentiment'])
    
    X = df['text']
    y_category = df['category']
    y_priority = df['priority']
    
    # The sentiment in the CSV is now categorical (Angry, Sad, Frustrated, Neutral, Happy).
    y_sentiment = df['sentiment']
    
    # Common pipeline steps for all models
    def create_pipeline():
        return Pipeline([
            ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
            ('clf', LogisticRegression(random_state=42, max_iter=1000, n_jobs=-1))
        ])
    
    # --- Category Model ---
    print("\nTraining Category Classification Model...")
    X_train_cat, X_test_cat, y_train_cat, y_test_cat = train_test_split(X, y_category, test_size=0.2, random_state=42)
    cat_pipeline = create_pipeline()
    cat_pipeline.fit(X_train_cat, y_train_cat)
    cat_preds = cat_pipeline.predict(X_test_cat)
    print("Category Model Performance:")
    print(classification_report(y_test_cat, cat_preds))
    
    # --- Priority Model ---
    print("\nTraining Priority Classification Model...")
    X_train_pri, X_test_pri, y_train_pri, y_test_pri = train_test_split(X, y_priority, test_size=0.2, random_state=42)
    pri_pipeline = create_pipeline()
    pri_pipeline.fit(X_train_pri, y_train_pri)
    pri_preds = pri_pipeline.predict(X_test_pri)
    print("Priority Model Performance:")
    print(classification_report(y_test_pri, pri_preds))
    
    # --- Sentiment Model ---
    print("\nTraining Sentiment Classification Model...")
    X_train_sent, X_test_sent, y_train_sent, y_test_sent = train_test_split(X, y_sentiment, test_size=0.2, random_state=42)
    sent_pipeline = create_pipeline()
    sent_pipeline.fit(X_train_sent, y_train_sent)
    sent_preds = sent_pipeline.predict(X_test_sent)
    print("Sentiment Model Performance:")
    print(classification_report(y_test_sent, sent_preds))
    
    # --- Save Models ---
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    cat_model_path = os.path.join(output_dir, 'category_model.pkl')
    pri_model_path = os.path.join(output_dir, 'priority_model.pkl')
    sent_model_path = os.path.join(output_dir, 'sentiment_model.pkl')
    
    joblib.dump(cat_pipeline, cat_model_path)
    joblib.dump(pri_pipeline, pri_model_path)
    joblib.dump(sent_pipeline, sent_model_path)
    
    print(f"\nModels successfully saved to {output_dir}")

if __name__ == "__main__":
    # Assuming script is run from ml_model folder and CSV is in the parent dir
    csv_file = r"..\TS-PS14.csv"
    output_directory = "models"
    
    train_models(csv_file, output_directory)
