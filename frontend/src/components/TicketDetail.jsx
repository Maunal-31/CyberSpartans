import React from 'react';
import { Bot, CheckCircle, AlertTriangle, ShieldAlert, Sparkles, Send, Paperclip } from 'lucide-react';
import './TicketDetail.css';

const TicketDetail = ({ ticket }) => {
  if (!ticket) {
    return (
      <div className="ticket-detail-empty glass-panel">
        <Bot size={48} className="empty-icon" />
        <h3>Select a ticket to view details</h3>
        <p>AI assistance will analyze the complaint automatically.</p>
      </div>
    );
  }

  return (
    <div className="ticket-detail-container">
      {/* Left Column: Complaint Details */}
      <div className="detail-main glass-panel">
        <div className="detail-header">
          <div className="header-info">
            <h2>{ticket.id}: {ticket.category}</h2>
            <div className="tags">
              <span className="badge badge-warning">{ticket.channel}</span>
              <span className="time">{ticket.timeAgo}</span>
            </div>
          </div>
          <button className="btn-primary">Reply</button>
        </div>

        <div className="customer-profile glass-card">
          <img src={ticket.avatar} alt={ticket.customerName} className="profile-avatar" />
          <div className="profile-info">
            <h3>{ticket.customerName}</h3>
            <p>Customer since 2024 • 3 previous tickets</p>
          </div>
          <div className="sentiment-badge">
            Sentiment: <span className={ticket.sentiment === 'Angry' ? 'text-danger' : 'text-warning'}>{ticket.sentiment}</span>
          </div>
        </div>

        <div className="complaint-content">
          <h4>Complaint Summary</h4>
          <p className="summary-text">{ticket.summary}</p>
          
          <h4>Detailed Description</h4>
          <p className="description-text">{ticket.details}</p>

          {ticket.image && (
            <div className="attachment-section">
              <h4>Attachments (1)</h4>
              <img src={ticket.image} alt="Damaged product" className="attached-image" />
            </div>
          )}
        </div>

        <div className="reply-box">
          <textarea placeholder="Type your response..."></textarea>
          <div className="reply-actions">
            <button className="icon-btn"><Paperclip size={18} /></button>
            <button className="btn-action send-btn">
              <Send size={16} /> Send Reply
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Smart AI Resolution Panel */}
      <div className="ai-panel glass-panel">
        <div className="ai-header">
          <Sparkles className="ai-icon" size={24} />
          <h3>Smart AI Resolution</h3>
          <div className="pulse-indicator"></div>
        </div>

        <div className="ai-section">
          <h4>Auto-Classification</h4>
          <div className="classification-card glass-card">
            <div className="class-row">
              <span className="label">Category</span>
              <span className="value">{ticket.aiAnalysis.suggestedCategory}</span>
            </div>
            <div className="class-row">
              <span className="label">Confidence</span>
              <span className="value text-success">{ticket.aiAnalysis.confidence}%</span>
            </div>
            <div className="class-row">
              <span className="label">Key Phrases</span>
              <div className="phrase-tags">
                {ticket.aiAnalysis.keyPhrases.map((phrase, i) => (
                  <span key={i} className="phrase-tag">{phrase}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ai-section">
          <h4>Recommended Action</h4>
          <div className="recommendation-card glass-card border-glow">
            <div className="action-title">
              <CheckCircle size={18} className="text-success" />
              <span>{ticket.aiRecommendation.action}</span>
            </div>
            <p className="reasoning">{ticket.aiRecommendation.reasoning}</p>
            
            <div className="auto-response">
              <h5>Drafted Response</h5>
              <p>"{ticket.aiRecommendation.autoResponse}"</p>
            </div>

            <button className="btn-action approve-btn">
              <CheckCircle size={18} />
              One-Click Approve
            </button>
          </div>
        </div>

        {ticket.priority === 'High' && (
          <div className="alert-box">
            <AlertTriangle size={20} className="text-danger" />
            <span>SLA Breach Risk: Resolve within 30 mins</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
