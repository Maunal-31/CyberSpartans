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
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    cat_model, pri_model = None, None

@app.route('/api/classify', methods=['POST'])
def classify_complaint():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
        
    if not cat_model or not pri_model:
        return jsonify({"error": "Models not loaded"}), 500

    # Predict
    category = cat_model.predict([text])[0]
    priority = pri_model.predict([text])[0]
    
    # Simple sentiment extraction based on keywords (since we didn't train a sentiment model)
    angry_keywords = ['broken', 'unacceptable', 'terrible', 'worst', 'angry', 'shattered']
    frustrated_keywords = ['missing', 'late', 'delay', 'where', 'annoying']
    
    text_lower = text.lower()
    sentiment = "Neutral"
    if any(kw in text_lower for kw in angry_keywords):
        sentiment = "Angry"
    elif any(kw in text_lower for kw in frustrated_keywords):
        sentiment = "Frustrated"

    return jsonify({
        "category": str(category),
        "priority": str(priority),
        "sentiment": sentiment,
        "keywords": [word for word in text.split() if len(word) > 4][:5] # simple keyword extraction
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
