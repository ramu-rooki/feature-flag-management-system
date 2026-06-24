import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Super Admin Pages
import { SuperAdminDashboard } from './pages/super-admin/Dashboard';
import { OrganizationsPage } from './pages/super-admin/OrganizationsPage';
import { CreateOrganizationPage } from './pages/super-admin/CreateOrganizationPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { FeatureFlagsPage } from './pages/admin/FeatureFlagsPage';

// User Pages
import { FeatureCheckPage } from './pages/user/FeatureCheckPage';

import { Role } from './types';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes inside Dashboard Layout */}
          <Route element={<DashboardLayout />}>
            
            {/* Super Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]} />}>
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
              <Route path="/super-admin/organizations" element={<OrganizationsPage />} />
              <Route path="/super-admin/organizations/create" element={<CreateOrganizationPage />} />
            </Route>

            {/* Org Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={[Role.ORG_ADMIN]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/flags" element={<FeatureFlagsPage />} />
              <Route path="/admin/check" element={<FeatureCheckPage />} />
            </Route>

            {/* End User Routes */}
            <Route element={<ProtectedRoute allowedRoles={[Role.END_USER]} />}>
              <Route path="/user" element={<FeatureCheckPage />} />
            </Route>

          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
