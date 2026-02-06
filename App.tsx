import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginScreen from './pages/LoginScreen';
import UpdatePassword from './pages/UpdatePassword';
import Dashboard from './pages/Dashboard';
import FamilyScreen from './pages/FamilyScreen';
import MemberProfile from './pages/MemberProfile';
import Appointments from './pages/Appointments';
import DocumentRepo from './pages/DocumentRepo';
import ClinicalHistory from './pages/ClinicalHistory';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          {/* Ruta independiente para impresión limpia */}
          <Route path="/history/:id" element={<ClinicalHistory />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/family" element={<FamilyScreen />} />
            <Route path="/profile/:id" element={<MemberProfile />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/documents" element={<DocumentRepo />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;