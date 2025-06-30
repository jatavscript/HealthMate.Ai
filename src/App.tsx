import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { DoctorProvider, useDoctor } from './contexts/DoctorContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MobileNav from './components/Layout/MobileNav';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MedicationsPage from './pages/MedicationsPage';
import MealsPage from './pages/MealsPage';
import ExercisesPage from './pages/ExercisesPage';
import HealthGuidelinesPage from './pages/HealthGuidelinesPage';
import DailyCheckInPage from './pages/DailyCheckInPage';
import ProgressPage from './pages/ProgressPage';
import SchedulePage from './pages/SchedulePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

const PatientApp: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <MobileNav />
      <main className="lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medications" element={<MedicationsPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/guidelines" element={<HealthGuidelinesPage />} />
            <Route path="/checkin" element={<DailyCheckInPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const AdminApp: React.FC = () => {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <AdminDashboard />;
};

const DoctorApp: React.FC = () => {
  const { isAuthenticated } = useDoctor();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <DoctorDashboard />;
};

// Main App Component with Context Detection
const AppContent: React.FC = () => {
  const { isAuthenticated: isPatientAuth } = useApp();
  const { isAuthenticated: isAdminAuth } = useAdmin();
  const { isAuthenticated: isDoctorAuth } = useDoctor();

  // Determine which app to show based on authentication state
  if (isAdminAuth) {
    return <AdminDashboard />;
  }
  
  if (isDoctorAuth) {
    return <DoctorDashboard />;
  }
  
  if (isPatientAuth) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Sidebar />
        <MobileNav />
        <main className="lg:pl-64 pt-16">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/medications" element={<MedicationsPage />} />
              <Route path="/meals" element={<MealsPage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/guidelines" element={<HealthGuidelinesPage />} />
              <Route path="/checkin" element={<DailyCheckInPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    );
  }

  // Show landing page if no one is authenticated
  return <LandingPage />;
};

function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <DoctorProvider>
          <Router>
            <AppContent />
          </Router>
        </DoctorProvider>
      </AdminProvider>
    </AppProvider>
  );
}

export default App;