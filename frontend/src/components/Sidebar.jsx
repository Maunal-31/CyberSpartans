import React from 'react';
import { LayoutDashboard, Ticket, FileText, BarChart3, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tickets', icon: Ticket, label: 'Tickets' },
    { id: 'submit', icon: FileText, label: 'Submit Complaint' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
  ];

  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-logo">
        <div className="logo-icon">AI</div>
        <h2>Resolve<span className="text-violet">AI</span></h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} className="nav-icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} className="nav-icon" />
          <span>Settings</span>
        </button>
        <button className="nav-item text-danger">
          <LogOut size={20} className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
