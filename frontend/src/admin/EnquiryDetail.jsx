import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetEnquiry, adminUpdateEnquiry, adminDeleteEnquiry } from '../api/enquiries';
import FormField from './components/FormField';
import ConfirmDialog from './components/ConfirmDialog';
import { useToast } from './components/Toast';

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        const data = await adminGetEnquiry(id);
        setEnquiry(data);
      } catch (err) {
        toast.error('Failed to load enquiry');
        navigate('/admin/enquiries');
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiry();
  }, [id, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnquiry(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminUpdateEnquiry(id, { status: enquiry.status, notes: enquiry.notes });
      toast.success('Enquiry updated');
    } catch (err) {
      toast.error('Failed to update enquiry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminDeleteEnquiry(id);
      toast.success('Enquiry deleted');
      navigate('/admin/enquiries');
    } catch (err) {
      toast.error('Failed to delete enquiry');
      setDeleteOpen(false);
    }
  };

  if (loading || !enquiry) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Enquiry Details</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="admin-btn admin-btn-outline" onClick={() => navigate('/admin/enquiries')}>Back</button>
          <button className="admin-btn admin-btn-danger" onClick={() => setDeleteOpen(true)}>Delete</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '2fr 1fr' }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Customer Information</h3>
          </div>
          <div className="admin-card-body" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label className="admin-label">Name</label>
              <div>{enquiry.name}</div>
            </div>
            <div>
              <label className="admin-label">Email</label>
              <div>{enquiry.email || '-'}</div>
            </div>
            <div>
              <label className="admin-label">Phone</label>
              <div>{enquiry.phone}</div>
            </div>
            <div>
              <label className="admin-label">Date Submitted</label>
              <div>{new Date(enquiry.createdAt).toLocaleString()}</div>
            </div>
            
            <div className="col-span-2" style={{ gridColumn: 'span 2' }}>
              <label className="admin-label">Destination / Package Interest</label>
              <div>{enquiry.destination || enquiry.tourPackage || '-'}</div>
            </div>

            <div className="col-span-2" style={{ gridColumn: 'span 2' }}>
              <label className="admin-label">Message</label>
              <div style={{ padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius)', whiteSpace: 'pre-wrap' }}>
                {enquiry.message || 'No message provided.'}
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Management</h3>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FormField label="Status">
              <select className="admin-select" name="status" value={enquiry.status} onChange={handleChange}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </FormField>

            <FormField label="Admin Notes">
              <textarea 
                className="admin-textarea" 
                name="notes" 
                value={enquiry.notes || ''} 
                onChange={handleChange}
                placeholder="Internal notes (not visible to customer)..."
                style={{ minHeight: '150px' }}
              />
            </FormField>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        open={deleteOpen}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
