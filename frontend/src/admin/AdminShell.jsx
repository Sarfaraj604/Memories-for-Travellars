import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from '../context/AuthContext.jsx';
import { lazy, Suspense } from 'react';

const AdminLayout = lazy(() => import('./AdminLayout.jsx'));
const Dashboard = lazy(() => import('./Dashboard.jsx'));
const PackageList = lazy(() => import('./PackageList.jsx'));
const PackageForm = lazy(() => import('./PackageForm.jsx'));
const DestinationList = lazy(() => import('./DestinationList.jsx'));
const DestinationForm = lazy(() => import('./DestinationForm.jsx'));
const RoomList = lazy(() => import('./RoomList.jsx'));
const RoomForm = lazy(() => import('./RoomForm.jsx'));
const GalleryManager = lazy(() => import('./GalleryManager.jsx'));
const ReviewList = lazy(() => import('./ReviewList.jsx'));
const ReviewForm = lazy(() => import('./ReviewForm.jsx'));
const EnquiryList = lazy(() => import('./EnquiryList.jsx'));
const EnquiryDetail = lazy(() => import('./EnquiryDetail.jsx'));
const SiteContentEditor = lazy(() => import('./SiteContentEditor.jsx'));
const SettingsEditor = lazy(() => import('./SettingsEditor.jsx'));
const PasswordEditor = lazy(() => import('./PasswordEditor.jsx'));

export default function AdminShell() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Suspense fallback={<div className="route-loader">Loading admin...</div>}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="packages" element={<PackageList />} />
              <Route path="packages/new" element={<PackageForm />} />
              <Route path="packages/:id/edit" element={<PackageForm />} />
              <Route path="destinations" element={<DestinationList />} />
              <Route path="destinations/new" element={<DestinationForm />} />
              <Route path="destinations/:id/edit" element={<DestinationForm />} />
              <Route path="rooms" element={<RoomList />} />
              <Route path="rooms/new" element={<RoomForm />} />
              <Route path="rooms/:id/edit" element={<RoomForm />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="reviews" element={<ReviewList />} />
              <Route path="reviews/new" element={<ReviewForm />} />
              <Route path="reviews/:id/edit" element={<ReviewForm />} />
              <Route path="enquiries" element={<EnquiryList />} />
              <Route path="enquiries/:id" element={<EnquiryDetail />} />
              <Route path="site-content" element={<SiteContentEditor />} />
              <Route path="settings" element={<><SettingsEditor /><PasswordEditor /></>} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </ProtectedRoute>
    </AuthProvider>
  );
}
