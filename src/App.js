import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import Dashboard from './components/dashboard/Dashboard';
import Gallery from './components/gallery/Gallery';
import ArtistProfile from './components/ArtistProfile';
import ArtworkDetail from './components/ArtworkDetail';
import BadgeSystem from './components/BadgeSystem';
import ExportComplianceChecklist from './components/ExportComplianceChecklist';
import ComplianceForm from './components/ComplianceForm';
import PurchaseHistory from './components/PurchaseHistory';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route 
              path="/user-login" 
              element={
                <PublicRoute>
                  <UserLogin />
                </PublicRoute>
              } 
            />
            <Route 
              path="/user-register" 
              element={
                <PublicRoute>
                  <UserRegister />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/purchase-history" 
              element={
                <ProtectedRoute>
                  <PurchaseHistory />
                </ProtectedRoute>
              } 
            />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/artist/:artistId" element={<ArtistProfile />} />
            <Route path="/artwork/:artworkId" element={<ArtworkDetail />} />
            <Route path="/badge-system" element={<BadgeSystem />} />
            <Route path="/export-compliance" element={<ExportComplianceChecklist />} />
            <Route 
              path="/compliance" 
              element={
                <ProtectedRoute>
                  <ComplianceForm />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
