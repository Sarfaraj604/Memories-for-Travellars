import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { adminListDestinations, adminDeleteDestination } from '../api/destinations';
import AdminTable from './components/AdminTable';
import LoadingState from './components/LoadingState';
import ConfirmDialog from './components/ConfirmDialog';
import { useToast } from './components/Toast';

export default function DestinationList() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const data = await adminListDestinations();
      setDestinations(data);
    } catch (err) {
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteDestination(deleteId);
      toast.success('Destination deleted successfully');
      setDestinations(destinations.filter(d => d._id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete destination');
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { key: 'image', label: 'Image', render: (val) => (
      val ? <img src={val} alt="thumb" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /> : '-'
    )},
    { key: 'name', label: 'Name', render: (val, row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{val}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{row.slug}</div>
      </div>
    )},
    { key: 'active', label: 'Status', render: (val) => (
      <span className={`admin-badge ${val ? 'admin-badge-success' : 'admin-badge-danger'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    )},
    { key: 'order', label: 'Order' }
  ];

  const actions = (row) => (
    <>
      <Link to={`/admin/destinations/${row._id}/edit`} className="admin-btn-icon">
        <Edit size={18} />
      </Link>
      <button className="admin-btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteId(row._id)}>
        <Trash2 size={18} />
      </button>
    </>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Destinations</h2>
        <Link to="/admin/destinations/new" className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Destination
        </Link>
      </div>

      {loading ? (
        <LoadingState type="table" />
      ) : (
        <AdminTable columns={columns} data={destinations} actions={actions} />
      )}

      <ConfirmDialog 
        open={!!deleteId}
        title="Delete Destination"
        message="Are you sure you want to delete this destination?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
