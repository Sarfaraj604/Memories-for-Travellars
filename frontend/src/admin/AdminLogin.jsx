import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import FormField from './components/FormField';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginApi(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      if (err.status === 401) {
        setError('Email or password is incorrect. If this is your first login, create the admin account using the setup steps in the project README.');
      } else if (err.status === 429) {
        setError('Too many login attempts. Wait 15 minutes before trying again.');
      } else if (err.status === 400) {
        setError(err.message || 'Enter a valid email address and password.');
      } else {
        setError(err.message || 'Login failed. Check that the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-mode admin-login-page">
      <div className="admin-login-card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--green)' }}>
          Memories for Travellers
        </h2>
        
        {error && (
          <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField label="Email Address">
            <input
              type="email" 
              className="admin-input" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </FormField>
          
          <FormField label="Password">
            <input
              type="password" 
              className="admin-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </FormField>
          
          <button 
            type="submit" 
            className="admin-btn admin-btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
