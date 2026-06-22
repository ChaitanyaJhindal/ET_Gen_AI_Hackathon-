import { useState } from 'react';
import { Send, FileText, Loader2 } from 'lucide-react';
import api from '../api';
import './Copilot.css';

const Copilot = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Welcome to Industrial Copilot. How can I assist you with the plant assets today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const helperChips = ['@P-101', '@V-102', '@Motor-M201', '@maintenance_log', '@failures'];

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);
    
    try {
      const response = await api.post('/chat', { question: userMessage });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources || []
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error connecting to the intelligence engine."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="copilot-container">
      <header className="page-header">
        <h1>Industrial Copilot</h1>
        <p>Ask questions about your assets, maintenance history, and documents.</p>
      </header>

      <div className="chat-interface card">
        <div className="helper-chips">
          {helperChips.map((chip, idx) => (
            <button 
              key={idx} 
              className="chip"
              onClick={() => setInput(prev => prev + (prev.endsWith(' ') ? '' : ' ') + chip + ' ')}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="chat-history">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-row ${msg.role}`}>
              <div className={`message-bubble ${msg.role}`}>
                <div className="message-content">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i}>{line || '\u00A0'}</p>
                  ))}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="message-sources">
                    <span className="source-label">Sources:</span>
                    {msg.sources.map((src, i) => (
                      <span key={i} className="source-chip"><FileText size={12} /> {src.title || src}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="message-row assistant">
               <div className="message-bubble assistant typing-indicator">
                 <Loader2 size={18} className="spinner" /> Analyzing data...
               </div>
             </div>
          )}
        </div>

        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder="Ask about failures, maintenance history, or assets..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <button className="send-btn" onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Copilot;
