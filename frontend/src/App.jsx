import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import DocumentIntelligence from './pages/DocumentIntelligence';
import AssetIntelligence from './pages/AssetIntelligence';
import KnowledgeGraph from './pages/KnowledgeGraph';
import Copilot from './pages/Copilot';
import RCA from './pages/RCA';
import Settings from './pages/Settings';

import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documents" element={<DocumentIntelligence />} />
              <Route path="/assets" element={<AssetIntelligence />} />
              <Route path="/graph" element={<KnowledgeGraph />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/rca" element={<RCA />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
