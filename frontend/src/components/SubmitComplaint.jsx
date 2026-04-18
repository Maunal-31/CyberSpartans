import React, { useState } from 'react';
import { Mic, Image as ImageIcon, MessageSquare, PhoneCall, FileText, Send, Loader } from 'lucide-react';
import './SubmitComplaint.css';

const SubmitComplaint = () => {
  const [inputType, setInputType] = useState('text'); // text, audio, image, call, conversation
  const [complaintText, setComplaintText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleProcess = async () => {
    setIsProcessing(true);
    setResult(null);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: complaintText }),
      });
      
      const data = await response.json();
      setResult({
        category: data.category || "Unknown",
        priority: data.priority || "Medium",
        sentiment: data.sentiment || "Neutral",
        keywords: data.keywords || []
      });
    } catch (error) {
      console.error("Error calling API:", error);
      setResult({
        category: "Error connecting to AI",
        priority: "High",
        sentiment: "Angry",
        keywords: ["connection", "failed"]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="submit-container">
      <div className="submit-header">
        <h2>Submit New Complaint</h2>
        <p>Choose an input method and our AI will automatically classify the issue.</p>
      </div>

      <div className="input-methods glass-card">
        <button 
          className={`method-btn ${inputType === 'text' ? 'active' : ''}`}
          onClick={() => setInputType('text')}
        >
          <FileText size={20} /> Text Summary
        </button>
        <button 
          className={`method-btn ${inputType === 'audio' ? 'active' : ''}`}
          onClick={() => setInputType('audio')}
        >
          <Mic size={20} /> Audio File
        </button>
        <button 
          className={`method-btn ${inputType === 'image' ? 'active' : ''}`}
          onClick={() => setInputType('image')}
        >
          <ImageIcon size={20} /> Image/Photo
        </button>
        <button 
          className={`method-btn ${inputType === 'call' ? 'active' : ''}`}
          onClick={() => setInputType('call')}
        >
          <PhoneCall size={20} /> Call Transcript
        </button>
        <button 
          className={`method-btn ${inputType === 'conversation' ? 'active' : ''}`}
          onClick={() => setInputType('conversation')}
        >
          <MessageSquare size={20} /> Chat Log
        </button>
      </div>

      <div className="input-area glass-panel">
        {inputType === 'text' && (
          <textarea 
            placeholder="Type the complaint details here..."
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
          ></textarea>
        )}
        
        {inputType === 'audio' && (
          <div className="upload-box">
            <Mic size={32} className="text-secondary mb-2" />
            <p>Drag and drop an audio file (.mp3, .wav) or click to upload</p>
            <input type="file" accept="audio/*" className="hidden-input" />
            <button className="btn-secondary">Choose File</button>
          </div>
        )}

        {inputType === 'image' && (
          <div className="upload-box">
            <ImageIcon size={32} className="text-secondary mb-2" />
            <p>Drag and drop an image or click to upload</p>
            <input type="file" accept="image/*" className="hidden-input" />
            <button className="btn-secondary">Choose Image</button>
          </div>
        )}

        {(inputType === 'call' || inputType === 'conversation') && (
          <textarea 
            placeholder={`Paste the ${inputType === 'call' ? 'call transcript' : 'chat log'} here...`}
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
          ></textarea>
        )}

        <div className="action-row">
          <button 
            className="btn-action submit-action-btn" 
            onClick={handleProcess}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <><Loader className="spin" size={18} /> Processing NLP...</>
            ) : (
              <><Send size={18} /> Process Complaint</>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="results-panel glass-panel">
          <h3><MessageSquare size={20} className="text-violet inline-icon" /> AI Classification Results</h3>
          <div className="result-grid">
            <div className="result-item">
              <span className="label">Predicted Category</span>
              <span className="value text-success">{result.category}</span>
            </div>
            <div className="result-item">
              <span className="label">Suggested Priority</span>
              <span className="value badge-danger badge">{result.priority}</span>
            </div>
            <div className="result-item">
              <span className="label">Customer Sentiment</span>
              <span className="value text-danger">{result.sentiment}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitComplaint;
