import { X, Phone, User, MapPin, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import './AssetDrawer.css';

const AssetDrawer = ({ asset, isOpen, onClose }) => {
  if (!isOpen || !asset) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div>
            <h2>{asset.name}</h2>
            <span className="drawer-subtitle">{asset.type}</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="drawer-content">
          <div className="card drawer-section">
            <h3>General Information</h3>
            <ul className="info-list">
              <li>
                <div className="info-label"><Activity size={16} /> Status</div>
                <div className={`badge ${asset.status === 'Working' ? 'success' : asset.status === 'Under Maintenance' ? 'warning' : 'danger'}`}>
                  {asset.status}
                </div>
              </li>
              <li>
                <div className="info-label"><User size={16} /> Operator</div>
                <div className="info-value">{asset.operator || 'Unassigned'}</div>
              </li>
              <li>
                <div className="info-label"><Phone size={16} /> Contact</div>
                <div className="info-value">{asset.phone || 'N/A'}</div>
              </li>
              <li>
                <div className="info-label"><MapPin size={16} /> Location</div>
                <div className="info-value">{asset.location || 'Unit 4'}</div>
              </li>
            </ul>
          </div>

          <div className="card drawer-section">
            <h3>Maintenance Timeline</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot success"></div>
                <div className="timeline-content">
                  <span className="timeline-date">Jan 16</span>
                  <p>Repair completed</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot info"></div>
                <div className="timeline-content">
                  <span className="timeline-date">Jan 14</span>
                  <p>Technician assigned</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot danger"></div>
                <div className="timeline-content">
                  <span className="timeline-date">Jan 12</span>
                  <p>Bearing wear detected</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card drawer-section">
            <h3>RCA Summary</h3>
            <div className="rca-box">
              <h4>Root Cause:</h4>
              <p>Continuous vibration caused micro-fractures in the primary bearing housing leading to seal failure.</p>
              <h4 className="mt-4">Recommended Action:</h4>
              <p>Replace bearing housing and install continuous vibration monitoring sensors.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetDrawer;
