import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Map, Home, Image as ImageIcon, Star, MessageSquare, Plus } from 'lucide-react';
import { api } from '../api/client';
import LoadingState from './components/LoadingState';
import AdminTable from './components/AdminTable';
import { useToast } from './components/Toast';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.get('/api/admin/dashboard');
        setStats(data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [toast]);

  if (loading) return <LoadingState type="cards" />;

  const statCards = [
    { title: 'Total Packages', value: stats?.counts?.packages || 0, icon: Package, link: '/admin/packages' },
    { title: 'Destinations', value: stats?.counts?.destinations ?? stats?.destinations ?? 0, icon: Map, link: '/admin/destinations' },
    { title: 'Rooms', value: stats?.counts?.rooms ?? stats?.rooms ?? 0, icon: Home, link: '/admin/rooms' },
    { title: 'New Enquiries', value: stats?.counts?.newEnquiries ?? stats?.enquiries?.byStatus?.new ?? 0, icon: MessageSquare, link: '/admin/enquiries' },
  ];

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'destination', label: 'Destination', render: (val) => val || '-' },
    { key: 'status', label: 'Status', render: (val) => (
      <span className={`admin-badge ${val === 'new' ? 'admin-badge-warning' : val === 'converted' ? 'admin-badge-success' : 'admin-badge-info'}`}>
        {val}
      </span>
    )},
    { key: 'createdAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin/packages/new" className="admin-btn admin-btn-primary">
            <Plus size={16} /> Add Package
          </Link>
          <Link to="/admin/destinations/new" className="admin-btn admin-btn-secondary">
            <Plus size={16} /> Add Destination
          </Link>
        </div>
      </div>

      <div className="admin-stat-grid">
        {statCards.map((card, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon">
              <card.icon size={24} />
            </div>
            <div className="admin-stat-info">
              <h3>{card.title}</h3>
              <p>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Recent Enquiries</h3>
          <Link to="/admin/enquiries" className="admin-btn admin-btn-outline">View All</Link>
        </div>
        
        {(stats?.recentEnquiries ?? stats?.enquiries?.recent ?? []).length > 0 ? (
          <AdminTable 
            columns={columns} 
            data={stats?.recentEnquiries ?? stats?.enquiries?.recent ?? []} 
            actions={(row) => (
              <Link to={`/admin/enquiries/${row._id}`} className="admin-btn admin-btn-outline">View</Link>
            )}
          />
        ) : (
          <div className="admin-card">
            <div className="admin-card-body" style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
              No recent enquiries.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
