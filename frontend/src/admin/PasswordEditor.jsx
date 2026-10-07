import { useState } from 'react';
import { api } from '../api/client';
import FormField from './components/FormField';
import { useToast } from './components/Toast';

export default function PasswordEditor() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const submit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('New passwords do not match.');
    setSaving(true);
    try {
      await api.post('/api/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed. Sign in again with the new password.');
      window.location.assign('/admin/login');
    } catch (error) {
      toast.error(error.message || 'Could not change password.');
    } finally {
      setSaving(false);
    }
  };

  return <form className="admin-card" onSubmit={submit} style={{ marginTop: '2rem' }}>
    <div className="admin-card-header"><h3 className="admin-card-title">Change Admin Password</h3></div>
    <div className="admin-card-body" style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
      <FormField label="Current password"><input className="admin-input" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></FormField>
      <FormField label="New password (12+ characters with upper, lower, number and symbol)"><input className="admin-input" type="password" autoComplete="new-password" minLength={12} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></FormField>
      <FormField label="Confirm new password"><input className="admin-input" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></FormField>
      <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Changing...' : 'Change Password'}</button>
    </div>
  </form>;
}
