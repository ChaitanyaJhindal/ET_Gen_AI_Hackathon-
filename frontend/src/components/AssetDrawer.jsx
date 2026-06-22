import { X, Phone, User, MapPin, Activity, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
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
            <h3>AI Extracted Failures</h3>
            {asset.failures && asset.failures.length > 0 ? (
              <div className="timeline">
                {asset.failures.map((f, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot danger"></div>
                    <div className="timeline-content">
                      <span className="timeline-date">Detected Issue</span>
                      <p>{f}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No failures detected by AI in the knowledge base.</p>
            )}
          </div>

          <div className="card drawer-section">
            <h3>AI Extracted Maintenance</h3>
            {asset.maintenance_events && asset.maintenance_events.length > 0 ? (
              <div className="timeline">
                {asset.maintenance_events.map((m, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot info"></div>
                    <div className="timeline-content">
                      <span className="timeline-date">Maintenance Log</span>
                      <p>{m}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No maintenance events found.</p>
            )}
          </div>

          <div className="card drawer-section">
            <h3>Source Documents</h3>
            {asset.documents && asset.documents.length > 0 ? (
              <ul className="document-list" style={{ listStyle: 'none', padding: 0 }}>
                {asset.documents.map((doc, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <FileText size={16} color="var(--primary-color)" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No source documents attached.</p>
            )}
            
            <div style={{marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid var(--primary-color)'}}>
              <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                <strong>Tip:</strong> Run an analysis on <strong>{asset.id}</strong> in the RCA tab for a deep-dive correlation of these records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetDrawer;
