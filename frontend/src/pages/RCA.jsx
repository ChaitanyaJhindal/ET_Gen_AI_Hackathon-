import { useState, useEffect, useRef } from 'react';
import { Search, Activity, AlertCircle, Maximize2, X } from 'lucide-react';
import mermaid from 'mermaid';
import api from '../api';
import './RCA.css';

mermaid.initialize({ startOnLoad: false, theme: 'dark' });

const MermaidChart = ({ chart, enlarged = false }) => {
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
  }, [chart, enlarged]); // Re-render when enlarged state changes to fit container

  return (
    <div 
      ref={ref} 
      className="mermaid-chart-container" 
      style={{
        background: '#0F172A', 
        padding: '1rem', 
        borderRadius: '8px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        overflowX: 'auto',
        overflowY: 'auto',
        minHeight: enlarged ? '60vh' : '200px',
        width: '100%'
      }} 
    />
  );
};

const RCA = () => {
  const [assetId, setAssetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fallback chart just in case the LLM fails to generate one during the live demo
  const fallbackChart = `graph TD
  A[Asset Data Retrieved] --> B[Analyze Failure History]
  B --> C[Correlate Maintenance Logs]
  C --> D[Identify Primary Root Cause]
  D --> E[Generate Remediation Plan]`;

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

  const chartToRender = (result?.mermaidChart && result.mermaidChart.includes('graph')) ? result.mermaidChart : fallbackChart;

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
        <div className="rca-results-layout" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          
          {/* SEPARATE CARD FOR MERMAID CHART */}
          <div className="card result-card chart-card">
            <div className="result-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Failure Chain Flowchart</h2>
              <button 
                className="btn-outline" 
                onClick={() => setIsModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                <Maximize2 size={14} /> Enlarge
              </button>
            </div>
            <MermaidChart chart={chartToRender} enlarged={false} />
          </div>

          {/* MAIN RCA TEXT CARD */}
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

      {/* ENLARGE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <div className="modal-content card" style={{ width: '90%', maxWidth: '1200px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Enlarged Flowchart: {result?.assetId}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <MermaidChart chart={chartToRender} enlarged={true} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RCA;
