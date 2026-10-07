import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Map, Home, Image as ImageIcon, 
  Star, MessageSquare, FileText, Settings, LogOut, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { ToastProvider } from './components/Toast';
import '../admin.css';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/packages', label: 'Packages', icon: Package },
  { path: '/admin/destinations', label: 'Destinations', icon: Map },
  { path: '/admin/rooms', label: 'Rooms', icon: Home },
  { path: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { path: '/admin/reviews', label: 'Reviews', icon: Star },
  { path: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { path: '/admin/site-content', label: 'Site Content', icon: FileText },
  { path: '/admin/settings', label: 'Settings', icon: Settings }
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => {
      document.body.classList.remove('admin-mode');
    };
  }, []);

  useEffect(() => {
    if (!loading && !admin) {
      navigate('/admin/login', { replace: true });
    }
  }, [admin, loading, navigate]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  if (loading || !admin) {
    return <div className="admin-mode" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <ToastProvider>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-header">
            <h2>Admin Panel</h2>
          </div>
          <nav className="admin-nav">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                end={item.exact}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <header className="admin-header">
            <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div style={{ flex: 1 }}></div>
            <div className="admin-header-actions">
              <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                Hello, {admin.name || admin.email}
              </span>
              <button className="admin-btn admin-btn-outline" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </header>

          <div className="admin-content">
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
