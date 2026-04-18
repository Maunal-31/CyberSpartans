import React from 'react';
import { Search, Filter, MoreHorizontal, Clock } from 'lucide-react';
import './TicketList.css';

const TicketList = ({ tickets, selectedTicket, setSelectedTicket }) => {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High': return 'badge-danger';
      case 'Medium': return 'badge-warning';
      default: return 'badge-success';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Angry': return 'text-danger';
      case 'Frustrated': return 'text-warning';
      case 'Sad': return 'text-warning';
      case 'Neutral': return 'text-secondary';
      case 'Happy': return 'text-success';
      default: return 'text-secondary';
    }
  };

  return (
    <div className="ticket-list-container glass-panel">
      <div className="ticket-list-header">
        <div className="header-top">
          <h3>Active Tickets</h3>
          <span className="badge badge-warning">{tickets.length}</span>
        </div>
        
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search complaints..." />
          <button className="filter-btn"><Filter size={16} /></button>
        </div>
      </div>

      <div className="tickets-scroll-area">
        {tickets.map(ticket => (
          <div 
            key={ticket.id} 
            className={`ticket-item glass-card ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
            onClick={() => setSelectedTicket(ticket)}
          >
            <div className="ticket-item-header">
              <span className="ticket-id">{ticket.id}</span>
              <span className={`badge ${getPriorityBadge(ticket.priority)}`}>{ticket.priority}</span>
            </div>
            
            <div className="ticket-user">
              <img src={ticket.avatar} alt={ticket.customerName} className="avatar" />
              <div className="user-info">
                <span className="name">{ticket.customerName}</span>
                <div className="meta">
                  <Clock size={12} />
                  <span>{ticket.timeAgo} via {ticket.channel}</span>
                </div>
              </div>
            </div>

            <p className="ticket-summary">{ticket.summary}</p>
            
            <div className="ticket-footer">
              <div className="sentiment">
                <span className={`sentiment-dot ${getSentimentColor(ticket.sentiment)}`}>●</span>
                {ticket.sentiment}
              </div>
              <button className="more-btn"><MoreHorizontal size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;
