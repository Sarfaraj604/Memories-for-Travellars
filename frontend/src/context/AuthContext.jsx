import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as loginApi, logout as logoutApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check session on mount
  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const data = await getMe();
        if (!cancelled) setAdmin(data);
      } catch {
        if (!cancelled) setAdmin(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    check();
    return () => { cancelled = true; };
  }, []);

  const login = async (email, password) => {
    const result = await loginApi(email, password);
    setAdmin(result.admin);
    return result;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setAdmin(null);
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

/** Route guard that redirects to login if not authenticated. */
export function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !admin) navigate('/admin/login', { replace: true });
  }, [admin, loading, navigate]);

  if (loading) return <div className="route-loader">Loading...</div>;
  if (!admin) return null;
  return children;
}
