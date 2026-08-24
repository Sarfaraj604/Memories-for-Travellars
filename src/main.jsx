import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

const PackagePage = lazy(() => import('./pages/PackagePage.jsx'));
const SimplePage = lazy(() => import('./pages/SimplePage.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="route-loader">Loading Memories for Travellers...</div>}>
        <Routes>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
