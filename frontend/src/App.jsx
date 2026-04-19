import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import SubmitComplaint from './components/SubmitComplaint';
import Reports from './components/Reports';
import Dashboard from './components/Dashboard';
import { mockTickets } from './data/mockData';
import { AlertTriangle } from 'lucide-react';
import './App.css';

const SLA_CONFIG = {
  'High': 2 * 3600 * 1000,   // 2 hours
  'Medium': 12 * 3600 * 1000, // 12 hours
  'Low': 48 * 3600 * 1000    // 48 hours
};

const sortTickets = (ticketsToSort) => {
  return [...ticketsToSort].sort((a, b) => {
    const deadlineA = new Date(a.createdAt).getTime() + (SLA_CONFIG[a.priority] || 0);
    const deadlineB = new Date(b.createdAt).getTime() + (SLA_CONFIG[b.priority] || 0);
    
    // First by priority rank
    const priorityMap = { 'High': 1, 'Medium': 2, 'Low': 3 };
    const pA = priorityMap[a.priority] || 4;
    const pB = priorityMap[b.priority] || 4;
    
    if (pA !== pB) return pA - pB;
    
    // Then by deadline (closer first)
    return deadlineA - deadlineB;
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
  const [alerts, setAlerts] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Force re-render every second for live timers
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live SLA Tracking & Automated Timeout
  useEffect(() => {
    const interval = setInterval(() => {
      setTickets(prevTickets => {
        const now = Date.now();
        const timedOutTickets = [];
        const activeTickets = [];
        let alertTriggered = false;
        
        prevTickets.forEach(ticket => {
          const deadline = new Date(ticket.createdAt).getTime() + (SLA_CONFIG[ticket.priority] || 0);
          const remaining = deadline - now;
          
          if (remaining <= 0) {
            // TICKET TIMED OUT: Move to breaches/resolved
            timedOutTickets.push({
              ...ticket,
              resolvedAt: new Date().toISOString(),
              isSlaBreach: true,
              resolutionAction: "System Timeout",
              employeeResponse: "SLA Deadline Breached - Auto-Closed"
            });
          } else {
            // Check for near-deadline alerts
            if (remaining < 15 * 60 * 1000 && !ticket.alertTriggered) {
              setAlerts(prev => [...prev, { id: ticket.id, message: `Deadline approaching for ${ticket.id}!` }]);
              alertTriggered = true;
              activeTickets.push({ ...ticket, alertTriggered: true });
            } else {
              activeTickets.push(ticket);
            }
          }
        });

        if (timedOutTickets.length > 0) {
          setResolvedTickets(prev => [...timedOutTickets, ...prev]);
          
          // If the selected ticket just timed out, pick the next one
          const currentSelectedTimedOut = timedOutTickets.some(t => t.id === selectedTicket?.id);
          if (currentSelectedTimedOut) {
            const nextIdx = prevTickets.findIndex(t => t.id === selectedTicket.id);
            const remainingTickets = activeTickets;
            setSelectedTicket(remainingTickets[nextIdx] || remainingTickets[nextIdx - 1] || remainingTickets[0] || null);
          }
        }

        return (timedOutTickets.length > 0 || alertTriggered) ? sortTickets(activeTickets) : prevTickets;
      });
    }, 5000); // Check every 5 seconds for timeouts

    return () => clearInterval(interval);
  }, [selectedTicket]);

  useEffect(() => {
    localStorage.setItem('ai_desk_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('ai_desk_resolved_tickets', JSON.stringify(resolvedTickets));
  }, [resolvedTickets]);

  const calculateChurnRisk = (id) => {
    if (!id || id === "CUST-UNKNOWN") return { score: 0, level: 'Low', suggestions: [] };
    
    // Count complaints for this customer in both active and resolved
    const allHistorical = [...tickets, ...resolvedTickets];
    const userTickets = allHistorical.filter(t => t.customerId === id);
    const count = userTickets.length;
    
    if (count >= 2) {
      return { 
        score: 85, 
        level: 'High', 
        suggestions: ["30% Retention Discount", "Priority Callback from Manager", "Free Shipping (1 Year)"] 
      };
    } else if (count === 1) {
      return { 
        score: 45, 
        level: 'Medium', 
        suggestions: ["10% Loyalty Voucher", "$10 Store Credit"] 
      };
    }
    return { 
      score: 10, 
      level: 'Low', 
      suggestions: ["Personalized Thank You Note"] 
    };
  };

  const handleAddTicket = (newTicket) => {
    const churn = calculateChurnRisk(newTicket.customerId);
    
    // Elevate priority if churn risk is high
    const finalPriority = churn.level === 'High' ? 'High' : newTicket.priority;
    
    const ticketWithTime = { 
      ...newTicket, 
      createdAt: new Date().toISOString(),
      priority: finalPriority,
      churnRisk: churn,
      aiRecommendation: {
        ...newTicket.aiRecommendation,
        retentionPerks: churn.suggestions,
        reasoning: churn.level === 'High' 
          ? `CRITICAL: High Churn Risk detected (${newTicket.customerId} has multiple recent complaints). Priority escalated to ensure retention.`
          : newTicket.aiRecommendation.reasoning
      }
    };

    setTickets(prev => {
      const updated = sortTickets([ticketWithTime, ...prev]);
      if (!selectedTicket) {
        setSelectedTicket(ticketWithTime);
      }
      return updated;
    });
  };

  const handleResolveTicket = (ticket, responseText) => {
    const now = new Date();
    const deadline = new Date(ticket.createdAt).getTime() + (SLA_CONFIG[ticket.priority] || 0);
    const isBreach = now.getTime() > deadline;

    const resolvedData = {
      ...ticket,
      employeeResponse: responseText,
      resolvedAt: now.toISOString(),
      isSlaBreach: isBreach,
      resolutionAction: responseText ? "Custom Response" : ticket.aiRecommendation.action
    };
// ... (rest of function unchanged)
    
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
                currentTime={currentTime}
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

      {/* Alerts Overlay */}
      <div className="alerts-container">
        {alerts.map((alert, idx) => (
          <div key={`${alert.id}-${idx}`} className="alert-toast">
            <AlertTriangle size={20} />
            <div className="alert-content">
              <strong>SLA Alert</strong>
              <p>{alert.message}</p>
            </div>
            <button 
              className="alert-close" 
              onClick={() => setAlerts(prev => prev.filter((_, i) => i !== idx))}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
