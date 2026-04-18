# <img src="favicon.svg" width="35" height="35" /> CyberSpartans

![CyberSpartans Banner](media/banner.png)

## 🛡️ Defending Customer Satisfaction with AI
**CyberSpartans** is a high-performance, AI-driven complaint resolution platform designed to transform customer feedback into actionable intelligence. By leveraging advanced NLP (Natural Language Processing) and a premium **Glassmorphism 2.0** interface, CyberSpartans provides a seamless, real-time command center for managing and resolving customer issues with surgical precision.

---

## 🚀 Key Features

### 🧠 Intelligent AI Operations
- **Multi-Modal Classification**: Automatically categorizes complaints into domains such as Billing, Product Quality, Technical Support, and more using sophisticated TF-IDF and Logistic Regression pipelines.
- **Dynamic Priority Engine**: Instantly assesses the urgency of incoming tickets (Low, Medium, High) based on semantic weight and sentiment.
- **Sentiment Intelligence**: Understands the emotional tone of the customer (Angry, Sad, Neutral, Happy) to help agents prioritize by emotional urgency.
- **Garbage Input Filtering**: Robust defensive logic that identifies and filters out vague or nonsensical inputs, ensuring your data remains clean and actionable.

### 💎 Premium User Experience
- **Glassmorphism 2.0 Design**: A stunning, neon-accented UI with translucent panels, vibrant gradients, and smooth micro-animations for an elite "Operations Center" feel.
- **Live Intelligence Dashboard**: Real-time visualization of complaint metrics, sentiment health, and resolution trends powered by **Recharts**.
- **Interactive Intake Hub**: A multi-step complaint submission system with instant AI feedback and classification previews.

---

## 🛠️ Technical Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/)
- **Backend**: [Python](https://www.python.org/), [Flask](https://flask.palletsprojects.com/), [Joblib](https://joblib.readthedocs.io/)
- **Machine Learning**: [Scikit-learn](https://scikit-learn.org/) (TF-IDF Vectorization, Logistic Regression)
- **Styling**: Vanilla CSS with custom design tokens for Glassmorphism.

---

## 📂 Project Structure

```text
CyberSpartans/
├── backend/            # Flask API for ML inference
│   └── app.py          # Main entry point for AI services
├── frontend/           # React + Vite application
│   ├── src/            # Dashboard & UI components
│   └── package.json    # Frontend dependencies
├── ml_model/           # Machine Learning pipeline
│   ├── train_nlp.py    # Model training script
│   └── models/         # Serialized .pkl model files
├── media/              # Visual assets & banners
├── TS-PS14.csv         # Core training dataset
└── clean_dataset.py    # Data preprocessing script
```

---

## ⚡ Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Backend Setup (AI Inference Server)
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install flask flask-cors joblib scikit-learn pandas

# Start the server
python app.py
```
*The backend will run on `http://localhost:5000`*

### 2. Frontend Setup (Intelligence Dashboard)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Launch the development server
npm run dev
```
*The dashboard will be available at `http://localhost:5173`*

---

## 🤖 Training the Models
If you wish to retrain the AI models with fresh data:
1. Ensure `TS-PS14.csv` is in the project root.
2. Run the preprocessing script: `python clean_dataset.py`
3. Navigate to `ml_model` and run: `python train_nlp.py`

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by the <b>CyberSpartans Team</b>
</p>
