import React from 'react';
import { Search, Filter, MoreHorizontal, Clock } from 'lucide-react';
import './TicketList.css';

const SLA_CONFIG = {
  'High': 2 * 3600 * 1000,
  'Medium': 12 * 3600 * 1000,
  'Low': 48 * 3600 * 1000
};

const TicketList = ({ tickets, selectedTicket, setSelectedTicket, currentTime }) => {
  const getSlaStatus = (ticket) => {
    const deadline = new Date(ticket.createdAt).getTime() + (SLA_CONFIG[ticket.priority] || 0);
    const remaining = deadline - currentTime;
    
    if (remaining < 0) return { label: 'BREACHED', class: 'sla-breach' };
    if (remaining < 15 * 60 * 1000) return { label: 'CRITICAL', class: 'sla-critical' };
    if (remaining < 60 * 60 * 1000) return { label: 'URGENT', class: 'sla-urgent' };
    return { label: 'ON TRACK', class: 'sla-ok' };
  };

  const formatRemaining = (ticket) => {
    const deadline = new Date(ticket.createdAt).getTime() + (SLA_CONFIG[ticket.priority] || 0);
    const remaining = deadline - currentTime;
    if (remaining < 0) return "Overdue";
    
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    return `${h}h ${m}m ${s}s left`;
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
        {tickets.map(ticket => {
          const sla = getSlaStatus(ticket);
          return (
            <div 
              key={ticket.id} 
              className={`ticket-item glass-card ${selectedTicket?.id === ticket.id ? 'selected' : ''} ${sla.class}`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="ticket-item-header">
                <span className="ticket-id">{ticket.id}</span>
                <div className="header-badges">
                  <span className={`badge ${sla.class}-badge`}>{sla.label}</span>
                  <span className={`badge ${ticket.priority === 'High' ? 'badge-danger' : ticket.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
              
              <div className="ticket-user">
                <img src={ticket.avatar} alt={ticket.customerName} className="avatar" />
                <div className="user-info">
                  <span className="name">{ticket.customerName}</span>
                  <div className="meta">
                    <Clock size={12} />
                    <span className="sla-timer">{formatRemaining(ticket)}</span>
                  </div>
                </div>
              </div>

              <p className="ticket-summary">{ticket.summary}</p>
              
              <div className="ticket-footer">
                <div className="sentiment">
                  <span className={`sentiment-dot ${ticket.sentiment === 'Angry' ? 'text-danger' : ticket.sentiment === 'Frustrated' ? 'text-warning' : 'text-success'}`}>●</span>
                  {ticket.sentiment}
                </div>
                <button className="more-btn"><MoreHorizontal size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketList;
