import { Activity, Server, AlertTriangle, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const kpis = [
    { title: 'Total Assets', value: '1,248', icon: Server, color: 'blue' },
    { title: 'Healthy Assets', value: '1,102', icon: Activity, color: 'green' },
    { title: 'Under Maintenance', value: '86', icon: AlertTriangle, color: 'yellow' },
    { title: 'Critical Assets', value: '60', icon: AlertCircle, color: 'red' },
  ];

  const recentUploads = [
    { name: 'pump_maintenance_log.pdf', type: 'PDF', time: '10 mins ago', status: 'Completed' },
    { name: 'vibration_data_q3.xlsx', type: 'XLSX', time: '1 hour ago', status: 'Completed' },
    { name: 'valve_specs.docx', type: 'DOCX', time: '2 hours ago', status: 'Processing' },
    { name: 'operator_notes.txt', type: 'TXT', time: '5 hours ago', status: 'Completed' },
  ];

  const recentIncidents = [
    { date: 'Jan 16', title: 'Inspection completed on M-201', type: 'info' },
    { date: 'Jan 14', title: 'Maintenance completed for P-101', type: 'success' },
    { date: 'Jan 12', title: 'Pump P-101 failure detected', type: 'danger' },
  ];

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Executive overview of plant assets and knowledge base.</p>
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
            <h2>Recent Uploads</h2>
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
            <h2>Recent Incidents</h2>
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
                <span>ChromaDB</span>
                <span className="badge success">Online</span>
              </li>
              <li>
                <span>LLM (Groq)</span>
                <span className="badge success">Online</span>
              </li>
              <li>
                <span>OCR Pipeline</span>
                <span className="badge warning">Degraded</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
