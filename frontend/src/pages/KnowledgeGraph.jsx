import { useRef, useEffect, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import api from '../api';
import './KnowledgeGraph.css';

const KnowledgeGraph = () => {
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await api.get('/assets');
        const assets = response.data;
        
        const nodesMap = new Map();
        const links = [];

        const addNode = (id, group, color) => {
          // Skip empty or generic numeric IDs from raw tables to keep graph clean
          if (!id || /^\d+$/.test(id)) return false;
          
          if (!nodesMap.has(id)) {
            nodesMap.set(id, { id, group, color });
          }
          return true;
        };

        // Colors
        const COLOR_EQ = '#3B82F6';
        const COLOR_FAIL = '#EF4444';
        const COLOR_MAINT = '#22C55E';
        const COLOR_DOC = '#EAB308';

        Object.keys(assets).forEach(assetId => {
          const asset = assets[assetId];
          const isEqAdded = addNode(assetId, 'Equipment', COLOR_EQ);
          
          if (isEqAdded) {
            // Add Failures
            asset.failures?.forEach(failure => {
              if (addNode(failure, 'Failures', COLOR_FAIL)) {
                links.push({ source: assetId, target: failure, label: 'FAILED_WITH' });
              }
            });
            
            // Add Maintenance Events
            asset.maintenance_events?.forEach(event => {
              if (addNode(event, 'Maintenance', COLOR_MAINT)) {
                links.push({ source: assetId, target: event, label: 'UNDERWENT' });
              }
            });
            
            // Add Documents
            asset.documents?.forEach(doc => {
              if (addNode(doc, 'Documents', COLOR_DOC)) {
                links.push({ source: assetId, target: doc, label: 'MENTIONED_IN' });
              }
            });
          }
        });

        setGraphData({
          nodes: Array.from(nodesMap.values()),
          links: links
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch graph data", err);
        setLoading(false);
      }
    };
    
    fetchGraphData();
  }, []);

  const drawNode = useCallback((node, ctx, globalScale) => {
    const label = node.id;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Inter`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = node.color;
    ctx.fillText(label, node.x, node.y);

    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
  }, []);

  return (
    <div className="graph-container">
      <header className="page-header">
        <h1>Knowledge Graph</h1>
        <p>Visual relationship map of assets, technicians, failures, and documentation directly from the ingested data.</p>
      </header>

      <div className="card graph-card" ref={containerRef}>
        {loading ? (
          <div style={{ padding: '2rem', color: '#94A3B8' }}>Loading network topology from intelligence engine...</div>
        ) : (
          <ForceGraph2D
            ref={fgRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeCanvasObject={drawNode}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color;
              const bckgDimensions = node.__bckgDimensions;
              bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
            }}
            linkColor={() => 'rgba(255, 255, 255, 0.2)'}
            linkWidth={1}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={2}
            backgroundColor="#0F172A"
            d3Force="charge"
          />
        )}
      </div>
      
      <div className="graph-legend">
        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#3B82F6'}}></span> Equipment</div>
        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#EF4444'}}></span> Failures</div>
        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#22C55E'}}></span> Maintenance</div>
        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#EAB308'}}></span> Documents</div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
