import { useState, useEffect } from 'react';
import { Activity, Server, AlertTriangle, AlertCircle } from 'lucide-react';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: '...',
    healthy: '...',
    maintenance: '...',
    critical: '...'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/assets');
        const assets = response.data;
        
        // Filter out numeric IDs from Excel row indexes to get actual unique assets
        const actualAssets = Object.keys(assets).filter(id => !/^\d+$/.test(id));
        
        let criticalCount = 0;
        let maintenanceCount = 0;

        actualAssets.forEach(id => {
          const asset = assets[id];
          const hasFailures = asset.failures && asset.failures.length > 0;
          const hasMaintenance = asset.maintenance_events && asset.maintenance_events.length > 0;
          
          if (hasFailures) {
            criticalCount++;
          } else if (hasMaintenance) {
            maintenanceCount++;
          }
        });

        const totalCount = actualAssets.length;
        const healthyCount = totalCount - criticalCount - maintenanceCount;

        setStats({
          total: totalCount.toString(),
          healthy: healthyCount.toString(),
          maintenance: maintenanceCount.toString(),
          critical: criticalCount.toString()
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    
    fetchStats();
  }, []);

  const kpis = [
    { title: 'Total Assets', value: stats.total, icon: Server, color: 'blue' },
    { title: 'Healthy Assets', value: stats.healthy, icon: Activity, color: 'green' },
    { title: 'Under Maintenance', value: stats.maintenance, icon: AlertTriangle, color: 'yellow' },
    { title: 'Critical Assets', value: stats.critical, icon: AlertCircle, color: 'red' },
  ];

  const recentUploads = [
    { name: 'Shift_Log_5.txt', type: 'TXT', time: 'Just now', status: 'Completed' },
    { name: 'WO_10.pdf', type: 'PDF', time: '1 min ago', status: 'Completed' },
    { name: 'Failure_History.xlsx', type: 'XLSX', time: '2 mins ago', status: 'Completed' },
    { name: 'Vendor_Master.xlsx', type: 'XLSX', time: '2 mins ago', status: 'Completed' },
  ];

  const recentIncidents = [
    { date: 'Recent', title: 'Work Order 10 created for P-110', type: 'info' },
    { date: 'Recent', title: 'Delayed repair of V-102 identified', type: 'warning' },
    { date: 'Recent', title: 'Bearing failure propagation on P-101', type: 'danger' },
  ];

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Executive overview of plant assets and knowledge base dynamically generated from AI embeddings.</p>
      </header>

      <div className="kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card kpi-card">
            <div className={`kpi-icon-wrapper ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
            <div className="kpi-info">
              <h3>{kpi.value}</h3>
              <span>{kpi.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="main-col">
          <div className="card table-card">
            <h2>Recent Data Ingestions</h2>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Type</th>
                    <th>Upload Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUploads.map((doc, idx) => (
                    <tr key={idx}>
                      <td>{doc.name}</td>
                      <td><span className="badge outline">{doc.type}</span></td>
                      <td>{doc.time}</td>
                      <td>
                        <span className={`badge ${doc.status === 'Completed' ? 'success' : 'warning'}`}>
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card timeline-card">
            <h2>AI Detected Incidents</h2>
            <div className="timeline">
              {recentIncidents.map((inc, idx) => (
                <div key={idx} className="timeline-item">
                  <div className={`timeline-dot ${inc.type}`}></div>
                  <div className="timeline-content">
                    <span className="timeline-date">{inc.date}</span>
                    <p>{inc.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="side-col">
          <div className="card health-card">
            <h2>System Health</h2>
            <ul className="health-list">
              <li>
                <span>Knowledge Base</span>
                <span className="badge success">Online</span>
              </li>
              <li>
                <span>ChromaDB Cloud</span>
                <span className="badge success">Online</span>
              </li>
              <li>
                <span>GPT-OSS 120B (Groq)</span>
                <span className="badge success">Online</span>
              </li>
              <li>
                <span>OCR Pipeline</span>
                <span className="badge warning">Fallback Mode</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
