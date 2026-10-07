import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import App from './App.jsx';
import { BusinessProvider } from './context/BusinessContext.jsx';
import './styles.css';

const PackagePage = lazy(() => import('./pages/PackagePage.jsx'));
const SimplePage = lazy(() => import('./pages/SimplePage.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Admin (lazy loaded)
const AdminLogin = lazy(() => import('./admin/AdminLogin.jsx'));
const AdminShell = lazy(() => import('./admin/AdminShell.jsx'));

function HomeScrollReset() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      window.scrollTo(0, 0);
    }
  }, [location.key, location.pathname]);

  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BusinessProvider>
        <HomeScrollReset />
        <Suspense fallback={<div className="route-loader">Loading Memories for Travellers...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<App />} />
            <Route path="/tours/:slug" element={<PackagePage />} />
            <Route path="/homestay" element={<SimplePage view="homestay" />} />
            <Route path="/rooms" element={<SimplePage view="rooms" />} />
            <Route path="/tours" element={<SimplePage view="tours" />} />
            <Route path="/destinations" element={<SimplePage view="destinations" />} />
            <Route path="/gallery" element={<SimplePage view="gallery" />} />
            <Route path="/reviews" element={<SimplePage view="reviews" />} />
            <Route path="/about" element={<SimplePage view="about" />} />
            <Route path="/contact" element={<SimplePage view="contact" />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminShell />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BusinessProvider>
    </BrowserRouter>
  </StrictMode>,
);
