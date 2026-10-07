import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { adminListReviews, adminDeleteReview } from '../api/reviews';
import AdminTable from './components/AdminTable';
import LoadingState from './components/LoadingState';
import ConfirmDialog from './components/ConfirmDialog';
import { useToast } from './components/Toast';

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await adminListReviews();
      setReviews(data);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteReview(deleteId);
      toast.success('Review deleted');
      setReviews(reviews.filter(r => r._id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete review');
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { key: 'name', label: 'Reviewer' },
    { key: 'rating', label: 'Rating', render: (val) => `${val}/5` },
    { key: 'date', label: 'Date' },
    { key: 'published', label: 'Status', render: (val) => (
      <span className={`admin-badge ${val ? 'admin-badge-success' : 'admin-badge-danger'}`}>
        {val ? 'Published' : 'Draft'}
      </span>
    )}
  ];

  const actions = (row) => (
    <>
      <Link to={`/admin/reviews/${row._id}/edit`} className="admin-btn-icon">
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
        <h2>Reviews</h2>
        <Link to="/admin/reviews/new" className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Review
        </Link>
      </div>

      {loading ? (
        <LoadingState type="table" />
      ) : (
        <AdminTable columns={columns} data={reviews} actions={actions} />
      )}

      <ConfirmDialog 
        open={!!deleteId}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
