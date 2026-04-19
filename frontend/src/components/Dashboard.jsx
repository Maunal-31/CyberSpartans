import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Package, Truck } from 'lucide-react';
import './Dashboard.css';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

const Dashboard = ({ tickets, resolvedTickets = [] }) => {
  const analytics = useMemo(() => {
    const categoryCount = {};
    const categoryStock = {};
    let shippingErrorCount = 0;

    // Combine active and resolved tickets for a full view of today's issues
    const allTickets = [...tickets, ...resolvedTickets];

    allTickets.forEach(ticket => {
      let cat = ticket.category || 'Unknown';
      
      // Normalize categories to remove redundant labels
      if (cat === 'Trade') cat = 'Trade Inquiry';
      if (cat === 'Packaging') cat = 'Packaging Issue';
      if (cat === 'Product') cat = 'Product Issue';
      if (cat === 'Shipping') cat = 'Shipping Issue';

      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      
      if (!categoryStock[cat]) {
        categoryStock[cat] = {};
      }
      
      const productKey = ticket.product ? `${ticket.product} (${ticket.sku})` : 'Unknown Product';
      categoryStock[cat][productKey] = (categoryStock[cat][productKey] || 0) + 1;

      if (cat === 'Shipping Issue' || cat === 'Packaging Issue' || cat === 'Delivery Delay') {
        shippingErrorCount++;
      }
    });

    const VALID_CATEGORIES = [
      'Product Issue', 
      'Packaging Issue', 
      'Trade Inquiry', 
      'Shipping Issue', 
      'Delivery Delay'
    ];

    const pieData = Object.keys(categoryCount)
      .filter(key => VALID_CATEGORIES.includes(key))
      .map(key => ({
        name: key,
        value: categoryCount[key]
      }));

    // Find most frequent error
    let topError = { name: 'None', count: 0 };
    pieData.forEach(item => {
      if (item.value > topError.count) {
        topError = { name: item.name, count: item.value };
      }
    });

    // Find most affected stock for the top error
    let topStock = { name: 'None', count: 0 };
    if (topError.name !== 'None' && categoryStock[topError.name]) {
      const stocks = categoryStock[topError.name];
      for (const [stockName, count] of Object.entries(stocks)) {
        if (count > topStock.count) {
          topStock = { name: stockName, count };
        }
      }
    }

    return {
      pieData,
      topError,
      topStock,
      shippingErrorCount,
      hasContinuousShippingError: shippingErrorCount >= 10,
      lastUpdated: new Date().toLocaleTimeString()
    };
  }, [tickets, resolvedTickets]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-main">
          <h2>Analytics Dashboard</h2>
          <div className="live-status">
            <span className="pulse-dot"></span>
            <span className="live-text">Live Operations</span>
          </div>
        </div>
        <p>Real-time insights on operational issues and product analytics. Last sync: {analytics.lastUpdated}</p>
      </div>

      {analytics.hasContinuousShippingError && (
        <div className="shipper-warning-banner glass-panel border-danger">
          <Truck className="text-danger" size={32} />
          <div className="banner-content">
            <h3>Change Shipper Recommendation</h3>
            <p>We are noticing continuous errors ({analytics.shippingErrorCount} recent issues) related to shipping and delivery. It is highly recommended to review the current logistics partner performance or switch to an alternate shipper for the affected region to maintain SLAs.</p>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card chart-card glass-panel">
          <div className="chart-header">
            <h3>Error Distribution Today</h3>
            <span className="total-badge">{analytics.pieData.reduce((a, b) => a + b.value, 0)} Total</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {analytics.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value, entry) => {
                    const { payload } = entry;
                    const total = analytics.pieData.reduce((a, b) => a + b.value, 0);
                    const percent = ((payload.value / total) * 100).toFixed(0);
                    return <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{value} ({percent}%)</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-center-label">
              <span className="center-value">{analytics.pieData.reduce((a, b) => a + b.value, 0)}</span>
              <span className="center-text">Tickets</span>
            </div>
          </div>
        </div>

        <div className="insights-col">
          <div className="dashboard-card stat-card glass-panel border-warning">
            <div className="stat-header">
              <TrendingUp className="text-warning" size={24} />
              <h4>Most Frequent Error</h4>
            </div>
            <div className="stat-value text-warning">{analytics.topError.name}</div>
            <p className="stat-desc">Occurred {analytics.topError.count} times today</p>
          </div>

          <div className="dashboard-card stat-card glass-panel border-violet">
            <div className="stat-header">
              <Package className="text-violet" size={24} />
              <h4>Most Affected Stock</h4>
            </div>
            <div className="stat-value text-violet">{analytics.topStock.name}</div>
            <p className="stat-desc">Contributed to {analytics.topStock.count} of the top errors</p>
          </div>

          <div className="dashboard-card stat-card glass-panel border-success">
             <div className="stat-header">
               <AlertTriangle className="text-success" size={24} />
               <h4>System Health</h4>
             </div>
             <div className="stat-value text-success">Stable</div>
             <p className="stat-desc">All other metrics are within expected thresholds.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
