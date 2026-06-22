import { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import AssetDrawer from '../components/AssetDrawer';
import './AssetIntelligence.css';

const AssetIntelligence = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const assets = [
    { id: 'P-101', name: 'Pump P-101', type: 'Centrifugal Pump', status: 'Not Working', location: 'Unit 4', lastInspection: 'Jan 10, 2026', operator: 'Rajesh Kumar', phone: '9876543210' },
    { id: 'V-102', name: 'Valve V-102', type: 'Control Valve', status: 'Working', location: 'Unit 2', lastInspection: 'Jan 15, 2026', operator: 'Amit Singh', phone: '9876543211' },
    { id: 'M-201', name: 'Motor M-201', type: 'Induction Motor', status: 'Under Maintenance', location: 'Unit 4', lastInspection: 'Jan 16, 2026', operator: 'Suresh Patel', phone: '9876543212' },
    { id: 'C-305', name: 'Compressor C-305', type: 'Gas Compressor', status: 'Working', location: 'Unit 1', lastInspection: 'Jan 05, 2026', operator: 'Rajesh Kumar', phone: '9876543210' },
    { id: 'HX-401', name: 'Heat Exch. HX-401', type: 'Shell & Tube', status: 'Working', location: 'Unit 3', lastInspection: 'Dec 20, 2025', operator: 'Vijay Mehta', phone: '9876543213' },
    { id: 'P-102', name: 'Pump P-102', type: 'Centrifugal Pump', status: 'Working', location: 'Unit 4', lastInspection: 'Jan 10, 2026', operator: 'Suresh Patel', phone: '9876543212' },
  ];

  return (
    <div className="asset-intel">
      <header className="page-header">
        <h1>Asset Intelligence</h1>
        <p>Monitor and analyze all industrial assets across the plant.</p>
      </header>

      <div className="filters card">
        <div className="search-container full-width">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search by Asset ID, Name, or Type..." />
        </div>
      </div>

      <div className="asset-grid">
        {assets.map((asset) => (
          <div key={asset.id} className="card asset-card" onClick={() => setSelectedAsset(asset)}>
            <div className="asset-header">
              <h3>{asset.id}</h3>
              <span className={`badge ${asset.status === 'Working' ? 'success' : asset.status === 'Under Maintenance' ? 'warning' : 'danger'}`}>
                {asset.status}
              </span>
            </div>
            <div className="asset-body">
              <p className="asset-name">{asset.name}</p>
              <p className="asset-type">{asset.type}</p>
            </div>
            <div className="asset-footer">
              <div className="footer-item">
                <MapPin size={14} /> {asset.location}
              </div>
              <div className="footer-item">
                <Calendar size={14} /> {asset.lastInspection}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AssetDrawer 
        asset={selectedAsset} 
        isOpen={!!selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
      />
    </div>
  );
};

export default AssetIntelligence;
