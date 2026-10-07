import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, Trash2, Search } from 'lucide-react';
import { adminListEnquiries, adminDeleteEnquiry } from '../api/enquiries';
import AdminTable from './components/AdminTable';
import LoadingState from './components/LoadingState';
import Pagination from './components/Pagination';
import ConfirmDialog from './components/ConfirmDialog';
import { useToast } from './components/Toast';

export default function EnquiryList() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  
  // Filters and Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const toast = useToast();

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await adminListEnquiries({ page, limit: 10, search, status });
      setEnquiries(data.enquiries || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchEnquiries();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteEnquiry(deleteId);
      toast.success('Enquiry deleted');
      fetchEnquiries();
    } catch (err) {
      toast.error('Failed to delete enquiry');
    } finally {
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    window.open('/api/admin/enquiries/export', '_blank');
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'destination', label: 'Destination', render: val => val || '-' },
    { key: 'status', label: 'Status', render: (val) => (
      <span className={`admin-badge ${val === 'new' ? 'admin-badge-warning' : val === 'converted' ? 'admin-badge-success' : val === 'closed' ? 'admin-badge-danger' : 'admin-badge-info'}`}>
        {val}
      </span>
    )},
    { key: 'createdAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
  ];

  const actions = (row) => (
    <>
      <Link to={`/admin/enquiries/${row._id}`} className="admin-btn-icon">
        <Eye size={18} />
      </Link>
      <button className="admin-btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteId(row._id)}>
        <Trash2 size={18} />
      </button>
    </>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Enquiries</h2>
        <button className="admin-btn admin-btn-outline" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-body" style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Search by name, email or phone..." 
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="admin-select" style={{ width: '200px' }} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState type="table" />
      ) : (
        <>
          <AdminTable columns={columns} data={enquiries} actions={actions} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog 
        open={!!deleteId}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
