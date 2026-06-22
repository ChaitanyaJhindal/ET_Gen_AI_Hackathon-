import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, AlertCircle } from 'lucide-react';
import api from '../api';
import AssetDrawer from '../components/AssetDrawer';
import './AssetIntelligence.css';

const AssetIntelligence = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get('/assets');
        const data = response.data;
        
        // Filter out numeric IDs from Excel row indexes to get actual unique assets
        const actualAssets = Object.keys(data).filter(id => !/^\d+$/.test(id)).map(id => {
          const a = data[id];
          
          let status = 'Working';
          if (a.failures && a.failures.length > 0) {
            status = 'Critical';
          } else if (a.maintenance_events && a.maintenance_events.length > 0) {
            status = 'Under Maintenance';
          }

          return {
            id: id,
            name: `Asset ${id}`,
            type: 'Industrial Equipment',
            status: status,
            location: 'Plant Floor',
            lastInspection: 'See AI Logs',
            operator: a.operator || 'Unassigned',
            phone: a.phone || 'N/A',
            failures: a.failures || [],
            maintenance_events: a.maintenance_events || [],
            documents: a.documents || []
          };
        });
        
        setAssets(actualAssets);
      } catch (err) {
        console.error("Failed to fetch assets", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssets();
  }, []);

  return (
    <div className="asset-intel">
      <header className="page-header">
        <h1>Asset Intelligence</h1>
        <p>Monitor and analyze all industrial assets across the plant, powered by AI.</p>
      </header>

      <div className="filters card">
        <div className="search-container full-width">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search by Asset ID, Name, or Type..." />
        </div>
      </div>

      {loading ? (
        <div className="loading-state" style={{ padding: '2rem', textAlign: 'center' }}>
          Loading asset intelligence from knowledge base...
        </div>
      ) : (
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
                {asset.failures.length > 0 && (
                  <p className="error-message" style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {asset.failures.length} active failure(s)
                  </p>
                )}
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
      )}

      <AssetDrawer 
        asset={selectedAsset} 
        isOpen={!!selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
      />
    </div>
  );
};

export default AssetIntelligence;
