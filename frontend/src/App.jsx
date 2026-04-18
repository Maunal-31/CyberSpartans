import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import SubmitComplaint from './components/SubmitComplaint';
import Reports from './components/Reports';
import Dashboard from './components/Dashboard';
import { mockTickets } from './data/mockData';
import './App.css';

const parseTimeAgo = (timeAgo) => {
  if (!timeAgo) return 0;
  const match = timeAgo.match(/(\d+)([mh])/);
  if (match) {
    const val = parseInt(match[1], 10);
    const unit = match[2];
    if (unit === 'h') return val * 60;
    if (unit === 'm') return val;
  }
  return 0;
};

const sortTickets = (ticketsToSort) => {
  const priorityMap = { 'High': 1, 'Medium': 2, 'Low': 3 };
  return [...ticketsToSort].sort((a, b) => {
    const pA = priorityMap[a.priority] || 4;
    const pB = priorityMap[b.priority] || 4;
    if (pA !== pB) return pA - pB;
    
    const timeA = parseTimeAgo(a.timeAgo);
    const timeB = parseTimeAgo(b.timeAgo);
    return timeB - timeA; 
  });
};

function App() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('ai_desk_tickets');
    if (savedTickets) {
      try {
        return sortTickets(JSON.parse(savedTickets));
      } catch (e) {
        console.error("Failed to parse tickets from localStorage", e);
      }
    }
    return sortTickets(mockTickets);
  });
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);

  useEffect(() => {
    localStorage.setItem('ai_desk_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleAddTicket = (newTicket) => {
    setTickets(prev => sortTickets([newTicket, ...prev]));
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'tickets' && (
          <div className="executive-view">
            <div className="ticket-list-wrapper">
              <TicketList 
                tickets={tickets} 
                selectedTicket={selectedTicket} 
                setSelectedTicket={setSelectedTicket} 
              />
            </div>
            <div className="ticket-detail-wrapper">
              <TicketDetail ticket={selectedTicket} />
            </div>
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard tickets={tickets} />
        )}

        {activeTab === 'submit' && (
          <SubmitComplaint onAddTicket={handleAddTicket} />
        )}

        {activeTab === 'reports' && (
          <Reports tickets={tickets} />
        )}
      </main>
    </div>
  );
}

export default App;
