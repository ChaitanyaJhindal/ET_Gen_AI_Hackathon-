import { useState, useEffect, useRef } from 'react';
import { Search, Activity, AlertCircle } from 'lucide-react';
import mermaid from 'mermaid';
import api from '../api';
import './RCA.css';

mermaid.initialize({ startOnLoad: false, theme: 'dark' });

const MermaidChart = ({ chart }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (chart && ref.current) {
      const renderChart = async () => {
        try {
          const id = 'mermaid-svg-' + Math.random().toString(36).substr(2, 9);
          const { svg } = await mermaid.render(id, chart);
          if (ref.current) ref.current.innerHTML = svg;
        } catch (e) {
          console.error("Mermaid render error", e);
          if (ref.current) ref.current.innerHTML = `<div class="error-message" style="color: var(--danger-color)">Failed to render flowchart.</div>`;
        }
      };
      renderChart();
    }
  }, [chart]);

  return <div ref={ref} className="mermaid-chart-container" style={{background: '#0F172A', padding: '1rem', borderRadius: '8px', marginTop: '1rem', display: 'flex', justifyContent: 'center', overflowX: 'auto'}} />;
};

const RCA = () => {
  const [assetId, setAssetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!assetId.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await api.post('/rca', { asset_id: assetId });
      setResult({
        assetId: assetId,
        rootCause: response.data.root_cause,
        severity: response.data.severity || 'High',
        confidence: response.data.confidence || 85,
        recommendation: response.data.recommendation,
        mermaidChart: response.data.mermaid_chart
      });
    } catch (err) {
      console.error('RCA failed:', err);
      setError('Failed to perform Root Cause Analysis. Verify the asset ID exists in the knowledge base.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rca-container">
      <header className="page-header">
        <h1>Root Cause Analysis</h1>
        <p>AI-driven analysis of equipment failures based on historical data.</p>
      </header>

      <div className="card search-card">
        <h2>Analyze Asset</h2>
        <div className="rca-search">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Enter Asset ID (e.g., P-101)" 
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn-primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
        {error && (
          <div className="error-message" style={{ color: 'var(--danger-color)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      {result && (
        <div className="rca-results">
          <div className="card result-card main-result">
            <div className="result-header">
              <h2>Analysis Results for {result.assetId}</h2>
              <span className="badge danger">Severity: {result.severity}</span>
            </div>
            
            <div className="confidence-section">
              <div className="confidence-header">
                <span>AI Confidence Score</span>
                <span className="confidence-value">{result.confidence}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${result.confidence}%` }}></div>
              </div>
            </div>

            <div className="analysis-content">
              {result.mermaidChart && (
                <div className="content-block" style={{ width: '100%' }}>
                  <h3>Failure Chain Flowchart</h3>
                  <MermaidChart chart={result.mermaidChart} />
                </div>
              )}
              <div className="content-block">
                <h3><Activity size={18} /> Root Cause</h3>
                <p>{result.rootCause}</p>
              </div>
              <div className="content-block">
                <h3>Recommendation</h3>
                <p>{result.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RCA;
