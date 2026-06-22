import { Search, Bell, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Topbar.css';

const Topbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="topbar">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search assets, technicians, failures..." />
      </div>
      
      <div className="topbar-right">
        <div className="status-indicator">
          <span className="dot green"></span>
          Plant Status: Operational
        </div>
        
        <div className="time-display">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        
        <button className="icon-btn avatar-btn">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
