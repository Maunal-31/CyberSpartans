from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load Models
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ml_model', 'models'))
try:
    cat_model = joblib.load(os.path.join(MODEL_DIR, 'category_model.pkl'))
    pri_model = joblib.load(os.path.join(MODEL_DIR, 'priority_model.pkl'))
    sent_model = joblib.load(os.path.join(MODEL_DIR, 'sentiment_model.pkl'))
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    cat_model, pri_model, sent_model = None, None, None

@app.route('/api/classify', methods=['POST'])
def classify_complaint():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
        
    if not cat_model or not pri_model or not sent_model:
        return jsonify({"error": "Models not loaded"}), 500

    # Check for vague or garbage input
    tfidf_vector = cat_model.named_steps['tfidf'].transform([text])
    is_recognizable = tfidf_vector.sum() > 0
    
    # Only reject if it's both very short AND unrecognized by our model
    if not is_recognizable and len(text.split()) < 2:
        return jsonify({
            "category": "Invalid Input",
            "priority": "Invalid Input",
            "sentiment": "Invalid Input",
            "keywords": ["Please", "provide", "more", "context"]
        })

    # Predict using the trained models
    category = cat_model.predict([text])[0]
    priority = pri_model.predict([text])[0]
    sentiment = sent_model.predict([text])[0]
    
    # REINFORCEMENT LAYER: Force correct category for high-confidence keywords
    text_lower = text.lower()
    
    # Sarcasm Detection
    sarcastic_positive = ["great", "wonderful", "amazing", "brilliant", "thanks", "perfect", "so happy", "love"]
    negative_context = ["broken", "lost", "delayed", "late", "defective", "nothing", "waiting", "shattered", "failed"]
    
    is_sarcastic = any(p in text_lower for p in sarcastic_positive) and any(n in text_lower for n in negative_context)
    
    if is_sarcastic:
        sentiment = "Frustrated"
        priority = "High"

    if any(k in text_lower for k in ["defective", "broken", "faulty", "malfunction", "not working"]):
        category = "Product"
        priority = "High"
    elif any(k in text_lower for k in ["late", "delayed", "overdue", "deadline"]):
        category = "Shipping"
        priority = "Medium"
    elif any(k in text_lower for k in ["bulk", "wholesale", "pricing", "discount"]):
        category = "Trade"

    # NORMALIZE categories for Frontend
    category_map = {
        "Product": "Product Issue",
        "Shipping": "Shipping Issue",
        "Packaging": "Packaging Issue",
        "Trade": "Trade Inquiry"
    }
    category = category_map.get(category, category)

    return jsonify({
        "category": category,
        "priority": priority,
        "sentiment": sentiment,
        "keywords": [word for word in text.split() if len(word) > 4][:5] # simple keyword extraction
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
