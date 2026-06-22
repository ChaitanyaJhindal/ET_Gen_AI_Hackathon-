import { UploadCloud, Eye, Trash2, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import api from '../api';
import './DocumentIntelligence.css';

const DocumentIntelligence = () => {
  const [documents, setDocuments] = useState([
    { name: 'maintenance_manual_P101.pdf', type: 'PDF', status: 'Completed', entities: 14, time: '10:30 AM' },
    { name: 'vibration_analysis.xlsx', type: 'XLSX', status: 'Completed', entities: 5, time: '09:15 AM' },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newDoc = {
      name: file.name,
      type: file.name.split('.').pop().toUpperCase(),
      status: 'Processing',
      entities: '-',
      time: 'Just now'
    };

    setDocuments([newDoc, ...documents]);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setDocuments(prev => prev.map(doc => 
        doc.name === file.name 
          ? { ...doc, status: 'Completed', entities: response.data.chunks || 'N/A' } 
          : doc
      ));
    } catch (error) {
      console.error('Upload failed:', error);
      setDocuments(prev => prev.map(doc => 
        doc.name === file.name ? { ...doc, status: 'Failed' } : doc
      ));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="doc-intel">
      <header className="page-header">
        <h1>Document Intelligence</h1>
        <p>Upload and analyze unstructured industrial documents.</p>
      </header>

      <div className="upload-zone card" onClick={() => fileInputRef.current.click()}>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileUpload}
        />
        {isUploading ? (
          <>
            <Loader2 size={48} className="upload-icon spinner" />
            <h3>Processing Document...</h3>
            <p>Please wait while the AI extracts information.</p>
          </>
        ) : (
          <>
            <UploadCloud size={48} className="upload-icon" />
            <h3>Click or Drag & Drop Documents Here</h3>
            <p>Supported formats: PDF, DOCX, TXT, CSV, XLSX, PNG, JPG</p>
            <button className="btn-primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>Browse Files</button>
          </>
        )}
      </div>

      <div className="card table-card">
        <h2>Processed Documents</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Entity Count</th>
                <th>Upload Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr key={idx}>
                  <td>{doc.name}</td>
                  <td><span className="badge outline">{doc.type}</span></td>
                  <td>
                    <span className={`badge ${doc.status === 'Completed' ? 'success' : doc.status === 'Failed' ? 'danger' : 'warning'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td>{doc.entities}</td>
                  <td>{doc.time}</td>
                  <td>
                    <div className="actions">
                      <button className="action-btn"><Eye size={16} /></button>
                      <button className="action-btn danger"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentIntelligence;
