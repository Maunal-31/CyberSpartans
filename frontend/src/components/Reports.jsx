import React, { useState } from 'react';
import { Download, Printer, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { mockTickets } from '../data/mockData';
import './Reports.css';

const Reports = () => {
  // Mock data for the report based on existing tickets and some simulated stats
  const [reportData] = useState({
    slaBreaches: 4,
    totalResolutionsToday: 24,
    avgResolutionTime: "2.5 hrs",
    priorityStats: {
      High: 12,
      Medium: 45,
      Low: 30
    },
    resolutionsList: mockTickets.map(t => ({
      id: t.id,
      category: t.category,
      priority: t.priority,
      resolutionAction: t.aiRecommendation.action,
      timeTaken: Math.floor(Math.random() * 5) + 1 + " hrs"
    }))
  });

  const downloadCSV = () => {
    const headers = ["Ticket ID", "Category", "Priority", "Resolution Action", "Time Taken"];
    const rows = reportData.resolutionsList.map(item => 
      [item.id, item.category, item.priority, item.resolutionAction, item.timeTaken].join(",")
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daily_resolution_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-container">
      <div className="reports-header no-print">
        <div className="header-text">
          <h2>Daily Operations Report</h2>
          <p>Overview of complaint resolutions, SLA breaches, and priorities.</p>
        </div>
        <div className="action-buttons">
          <button className="btn-secondary" onClick={downloadCSV}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* The following area is what gets printed nicely */}
      <div className="printable-report">
        <div className="stats-grid">
          <div className="stat-card glass-card border-danger">
            <AlertTriangle className="text-danger mb-2" size={28} />
            <div className="stat-value text-danger">{reportData.slaBreaches}</div>
            <div className="stat-label">SLA Breaches Today</div>
          </div>
          
          <div className="stat-card glass-card">
            <CheckCircle className="text-success mb-2" size={28} />
            <div className="stat-value">{reportData.totalResolutionsToday}</div>
            <div className="stat-label">Total Resolutions</div>
          </div>

          <div className="stat-card glass-card">
            <Clock className="text-violet mb-2" size={28} />
            <div className="stat-value">{reportData.avgResolutionTime}</div>
            <div className="stat-label">Avg. Resolution Time</div>
          </div>
        </div>

        <div className="priority-distribution glass-panel">
          <h3>Priority Distribution</h3>
          <div className="dist-bars">
            <div className="dist-row">
              <span className="dist-label">High Priority</span>
              <div className="bar-bg"><div className="bar-fill bg-danger" style={{width: '25%'}}></div></div>
              <span className="dist-count">{reportData.priorityStats.High}</span>
            </div>
            <div className="dist-row">
              <span className="dist-label">Medium Priority</span>
              <div className="bar-bg"><div className="bar-fill bg-warning" style={{width: '50%'}}></div></div>
              <span className="dist-count">{reportData.priorityStats.Medium}</span>
            </div>
            <div className="dist-row">
              <span className="dist-label">Low Priority</span>
              <div className="bar-bg"><div className="bar-fill bg-success" style={{width: '35%'}}></div></div>
              <span className="dist-count">{reportData.priorityStats.Low}</span>
            </div>
          </div>
        </div>

        <div className="resolution-table-container glass-panel">
          <h3>Daily Resolutions Log</h3>
          <table className="resolution-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Resolution Action</th>
                <th>Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {reportData.resolutionsList.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.id}</td>
                  <td>{item.category}</td>
                  <td>
                    <span className={`badge ${item.priority === 'High' ? 'badge-danger' : item.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>{item.resolutionAction}</td>
                  <td>{item.timeTaken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
