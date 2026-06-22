import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Server, Share2, MessageSquare, Search, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Document Intelligence', path: '/documents', icon: FileText },
    { name: 'Asset Intelligence', path: '/assets', icon: Server },
    { name: 'Knowledge Graph', path: '/graph', icon: Share2 },
    { name: 'Industrial Copilot', path: '/copilot', icon: MessageSquare },
    { name: 'Root Cause Analysis', path: '/rca', icon: Search },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">IKI</div>
        <div className="logo-text">
          <h1>Industrial Knowledge Intelligence</h1>
          <span>AI Asset Intelligence</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <item.icon className="nav-icon" size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
