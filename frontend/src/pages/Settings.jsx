import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-container">
      <header className="page-header">
        <h1>Settings</h1>
        <p>Application configuration and system status.</p>
      </header>

      <div className="settings-grid">
        <div className="card settings-card">
          <h2>Appearance</h2>
          <div className="settings-item">
            <div>
              <span className="settings-label">Theme</span>
              <p className="settings-desc">Select the application theme.</p>
            </div>
            <div className="settings-action">
              <select defaultValue="dark" className="settings-select">
                <option value="dark">Dark (Default)</option>
                <option value="light">Light</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card settings-card">
          <h2>System Status</h2>
          <ul className="status-list">
            <li>
              <span>API Gateway</span>
              <span className="badge success">Online</span>
            </li>
            <li>
              <span>Groq Inference Engine</span>
              <span className="badge success">Online</span>
            </li>
            <li>
              <span>ChromaDB Vector Store</span>
              <span className="badge success">Online</span>
            </li>
            <li>
              <span>OCR Processing Queue</span>
              <span className="badge warning">High Load</span>
            </li>
          </ul>
        </div>

        <div className="card settings-card">
          <h2>About</h2>
          <div className="about-info">
            <p><strong>Version:</strong> 1.0.0-rc.4</p>
            <p><strong>Environment:</strong> Production</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
