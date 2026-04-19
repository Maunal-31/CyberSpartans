import React, { useMemo } from 'react';
import { Download, Printer, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import './Reports.css';

const Reports = ({ tickets }) => {
  const reportData = useMemo(() => {
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;

    const resolutionsList = tickets.map(t => {
      if (t.priority === 'High') highCount++;
      else if (t.priority === 'Medium') mediumCount++;
      else lowCount++;

      return {
        id: t.id,
        category: t.category || "Unknown",
        priority: t.priority || "Low",
        resolutionAction: t.resolutionAction || t.aiRecommendation?.action || "Resolved",
        employeeResponse: t.employeeResponse || "N/A",
        timeTaken: t.timeAgo || "Just now",
        isSlaBreach: t.isSlaBreach
      };
    });

    const totalResolutionsToday = tickets.length;
    const slaBreaches = tickets.filter(t => t.isSlaBreach).length; 
    
    return {
      slaBreaches,
      totalResolutionsToday,
      avgResolutionTime: "1.2 hrs",
      priorityStats: {
        High: highCount,
        Medium: mediumCount,
        Low: lowCount
      },
      resolutionsList
    };
  }, [tickets]);

  const downloadCSV = () => {
    const headers = ["Ticket ID", "Category", "Priority", "Resolution Action", "Employee Response", "Time Taken"];
    const rows = reportData.resolutionsList.map(item => 
      [item.id, item.category, item.priority, item.resolutionAction, item.employeeResponse.replace(/,/g, ";"), item.timeTaken].join(",")
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
        {tickets.length === 0 ? (
          <div className="empty-report-state glass-panel">
            <CheckCircle size={48} className="text-success mb-3" />
            <h3>No Resolved Tickets Yet</h3>
            <p>Start resolving tickets from the queue to generate a report.</p>
          </div>
        ) : (
          <>
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
                  <div className="bar-bg"><div className="bar-fill bg-danger" style={{width: `${(reportData.priorityStats.High / Math.max(1, reportData.totalResolutionsToday)) * 100}%`}}></div></div>
                  <span className="dist-count">{reportData.priorityStats.High}</span>
                </div>
                <div className="dist-row">
                  <span className="dist-label">Medium Priority</span>
                  <div className="bar-bg"><div className="bar-fill bg-warning" style={{width: `${(reportData.priorityStats.Medium / Math.max(1, reportData.totalResolutionsToday)) * 100}%`}}></div></div>
                  <span className="dist-count">{reportData.priorityStats.Medium}</span>
                </div>
                <div className="dist-row">
                  <span className="dist-label">Low Priority</span>
                  <div className="bar-bg"><div className="bar-fill bg-success" style={{width: `${(reportData.priorityStats.Low / Math.max(1, reportData.totalResolutionsToday)) * 100}%`}}></div></div>
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
                    <th>Employee Response</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.resolutionsList.map((item, idx) => (
                    <tr key={idx} className={item.isSlaBreach ? 'row-breach' : ''}>
                      <td>{item.id}</td>
                      <td>{item.category}</td>
                      <td>
                        <span className={`badge ${item.priority === 'High' ? 'badge-danger' : item.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td>
                        {item.resolutionAction}
                        {item.isSlaBreach && <span className="breach-tag">SLA BREACHED</span>}
                      </td>
                      <td className="employee-resp-cell">{item.employeeResponse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
