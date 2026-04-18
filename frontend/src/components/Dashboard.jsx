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
      const cat = ticket.category || 'Unknown';
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

    const pieData = Object.keys(categoryCount).map(key => ({
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
      hasContinuousShippingError: shippingErrorCount >= 2
    };
  }, [tickets, resolvedTickets]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <p>Real-time insights on operational issues and product analytics.</p>
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
          <h3>Error Distribution Today</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
