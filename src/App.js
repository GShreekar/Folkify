import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/dashboard/Dashboard';
import Gallery from './components/gallery/Gallery';
import BadgeSystemDemo from './components/BadgeSystemDemo';
import ExportComplianceChecklist from './components/ExportComplianceChecklist';
import ExportComplianceDemo from './components/ExportComplianceDemo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/badge-demo" element={<BadgeSystemDemo />} />
          <Route path="/export-compliance" element={<ExportComplianceChecklist />} />
          <Route path="/export-demo" element={<ExportComplianceDemo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
