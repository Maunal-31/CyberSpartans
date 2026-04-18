import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import SubmitComplaint from './components/SubmitComplaint';
import Reports from './components/Reports';
import Dashboard from './components/Dashboard';
import { mockTickets } from './data/mockData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState(mockTickets[0]);

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
          <SubmitComplaint />
        )}

        {activeTab === 'reports' && (
          <Reports />
        )}
      </main>
    </div>
  );
}

export default App;
