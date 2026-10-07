import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { adminListPackages, adminDeletePackage } from '../api/packages';
import AdminTable from './components/AdminTable';
import LoadingState from './components/LoadingState';
import ConfirmDialog from './components/ConfirmDialog';
import { useToast } from './components/Toast';

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await adminListPackages();
      setPackages(data);
    } catch (err) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeletePackage(deleteId);
      toast.success('Package deleted successfully');
      setPackages(packages.filter(p => p._id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete package');
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (val, row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{val}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{row.slug}</div>
      </div>
    )},
    { key: 'destination', label: 'Destination' },
    { key: 'price', label: 'Price' },
    { key: 'active', label: 'Status', render: (val) => (
      <span className={`admin-badge ${val ? 'admin-badge-success' : 'admin-badge-danger'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    )},
    { key: 'featured', label: 'Featured', render: (val) => (
      val ? <span className="admin-badge admin-badge-warning">Featured</span> : '-'
    )}
  ];

  const actions = (row) => (
    <>
      <Link to={`/admin/packages/${row._id}/edit`} className="admin-btn-icon">
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
        <h2>Packages</h2>
        <Link to="/admin/packages/new" className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Package
        </Link>
      </div>

      {loading ? (
        <LoadingState type="table" />
      ) : (
        <AdminTable columns={columns} data={packages} actions={actions} />
      )}

      <ConfirmDialog 
        open={!!deleteId}
        title="Delete Package"
        message="Are you sure you want to delete this package? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
