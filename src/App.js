import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/dashboard/Dashboard';
import Gallery from './components/gallery/Gallery';
import BadgeSystem from './components/BadgeSystem';
import ExportComplianceChecklist from './components/ExportComplianceChecklist';
import ExportComplianceDemo from './components/ExportComplianceDemo';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
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
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/badge-system" element={<BadgeSystem />} />
            <Route path="/export-compliance" element={<ExportComplianceChecklist />} />
            <Route path="/export-demo" element={<ExportComplianceDemo />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
