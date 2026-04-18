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
  
  const [resolvedTickets, setResolvedTickets] = useState(() => {
    const saved = localStorage.getItem('ai_desk_resolved_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);

  useEffect(() => {
    localStorage.setItem('ai_desk_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('ai_desk_resolved_tickets', JSON.stringify(resolvedTickets));
  }, [resolvedTickets]);

  const handleAddTicket = (newTicket) => {
    setTickets(prev => {
      const updated = sortTickets([newTicket, ...prev]);
      if (!selectedTicket) {
        setSelectedTicket(newTicket);
      }
      return updated;
    });
  };

  const handleResolveTicket = (ticket, responseText) => {
    // Add to resolved list with the employee's response
    const resolvedData = {
      ...ticket,
      employeeResponse: responseText,
      resolvedAt: new Date().toISOString(),
      resolutionAction: responseText ? "Custom Response" : ticket.aiRecommendation.action
    };
    
    setResolvedTickets(prev => [resolvedData, ...prev]);
    
    // Remove from active tickets
    const updatedTickets = tickets.filter(t => t.id !== ticket.id);
    setTickets(updatedTickets);
    
    // Select next ticket if available
    if (updatedTickets.length > 0) {
      // If we resolved the currently selected ticket, pick the next one
      if (selectedTicket?.id === ticket.id) {
        const currentIndex = tickets.findIndex(t => t.id === ticket.id);
        const nextTicket = updatedTickets[currentIndex] || updatedTickets[currentIndex - 1] || updatedTickets[0];
        setSelectedTicket(nextTicket);
      }
    } else {
      setSelectedTicket(null);
    }
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
              <TicketDetail 
                ticket={selectedTicket} 
                onResolve={handleResolveTicket} 
              />
            </div>
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard tickets={tickets} resolvedTickets={resolvedTickets} />
        )}

        {activeTab === 'submit' && (
          <SubmitComplaint onAddTicket={handleAddTicket} />
        )}

        {activeTab === 'reports' && (
          <Reports tickets={resolvedTickets} />
        )}
      </main>
    </div>
  );
}

export default App;
