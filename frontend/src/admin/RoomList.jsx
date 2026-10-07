import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { adminListRooms, adminDeleteRoom } from '../api/rooms';
import AdminTable from './components/AdminTable';
import LoadingState from './components/LoadingState';
import ConfirmDialog from './components/ConfirmDialog';
import { useToast } from './components/Toast';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await adminListRooms();
      setRooms(data);
    } catch (err) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteRoom(deleteId);
      toast.success('Room deleted successfully');
      setRooms(rooms.filter(r => r._id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete room');
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
    { key: 'price', label: 'Price' },
    { key: 'maxGuests', label: 'Max Guests' },
    { key: 'active', label: 'Status', render: (val) => (
      <span className={`admin-badge ${val ? 'admin-badge-success' : 'admin-badge-danger'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    )}
  ];

  const actions = (row) => (
    <>
      <Link to={`/admin/rooms/${row._id}/edit`} className="admin-btn-icon">
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
        <h2>Rooms</h2>
        <Link to="/admin/rooms/new" className="admin-btn admin-btn-primary">
          <Plus size={16} /> Add Room
        </Link>
      </div>

      {loading ? (
        <LoadingState type="table" />
      ) : (
        <AdminTable columns={columns} data={rooms} actions={actions} />
      )}

      <ConfirmDialog 
        open={!!deleteId}
        title="Delete Room"
        message="Are you sure you want to delete this room?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
