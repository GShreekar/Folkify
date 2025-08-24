import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ArtistRoute from './components/ArtistRoute';
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
import MyPurchases from './components/MyPurchases';
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
                <ArtistRoute>
                  <Dashboard />
                </ArtistRoute>
              } 
            />
            <Route 
              path="/my-purchases" 
              element={
                <ProtectedRoute>
                  <MyPurchases />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/purchase-history" 
              element={
                <ArtistRoute>
                  <PurchaseHistory />
                </ArtistRoute>
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
                <ArtistRoute>
                  <ComplianceForm />
                </ArtistRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
