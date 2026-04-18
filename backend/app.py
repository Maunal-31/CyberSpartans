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
    if tfidf_vector.sum() == 0.0 or len(text.split()) < 3:
        return jsonify({
            "category": "Invalid Input",
            "priority": "Invalid Input",
            "sentiment": "Invalid Input",
            "keywords": ["Please", "provide", "proper", "details"]
        })

    # Predict using the trained models
    category = cat_model.predict([text])[0]
    priority = pri_model.predict([text])[0]
    sentiment = sent_model.predict([text])[0]
    
    return jsonify({
        "category": str(category),
        "priority": str(priority),
        "sentiment": str(sentiment),
        "keywords": [word for word in text.split() if len(word) > 4][:5] # simple keyword extraction
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
