import { useRef, useEffect, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './KnowledgeGraph.css';

const KnowledgeGraph = () => {
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef();

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

  const graphData = {
    nodes: [
      { id: 'Pump P-101', group: 'Equipment', color: '#3B82F6' },
      { id: 'Valve V-102', group: 'Equipment', color: '#3B82F6' },
      { id: 'Motor M-201', group: 'Equipment', color: '#3B82F6' },
      { id: 'Rajesh Kumar', group: 'People', color: '#22C55E' },
      { id: 'Amit Singh', group: 'People', color: '#22C55E' },
      { id: 'Bearing Failure', group: 'Failures', color: '#EF4444' },
      { id: 'Seal Leak', group: 'Failures', color: '#EF4444' },
      { id: 'Maintenance Report', group: 'Documents', color: '#EAB308' },
      { id: 'Inspection Log', group: 'Documents', color: '#EAB308' }
    ],
    links: [
      { source: 'Pump P-101', target: 'Rajesh Kumar', label: 'OPERATED_BY' },
      { source: 'Pump P-101', target: 'Bearing Failure', label: 'FAILED_DUE_TO' },
      { source: 'Bearing Failure', target: 'Maintenance Report', label: 'MENTIONED_IN' },
      { source: 'Rajesh Kumar', target: 'Maintenance Report', label: 'WROTE' },
      { source: 'Valve V-102', target: 'Amit Singh', label: 'OPERATED_BY' },
      { source: 'Valve V-102', target: 'Seal Leak', label: 'FAILED_DUE_TO' },
      { source: 'Seal Leak', target: 'Inspection Log', label: 'MENTIONED_IN' },
      { source: 'Motor M-201', target: 'Pump P-101', label: 'CONNECTED_TO' }
    ]
  };

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
        <p>Visual relationship map of assets, technicians, failures, and documentation.</p>
      </header>

      <div className="card graph-card" ref={containerRef}>
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
      </div>
      
      <div className="graph-legend">
        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#3B82F6'}}></span> Equipment</div>
        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#22C55E'}}></span> People</div>
        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#EF4444'}}></span> Failures</div>
        <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#EAB308'}}></span> Documents</div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
