import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './layouts/AdminLayout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Shops from './pages/Shops';
import Garages from './pages/Garages';
import Logistics from './pages/Logistics';
import Users from './pages/Users';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Products from './pages/Products';
import './index.css';

const API_BASE = 'http://localhost:8003/api/v1';

function App() {
  useEffect(() => {
    const fetchBrandColor = async () => {
      try {
        const response = await axios.get(`${API_BASE}/settings`);
        const color = response.data.settings.brand_color;
        if (color) {
          document.documentElement.style.setProperty('--dynamic-brand-color', color);
        }
      } catch (error) {
        console.error('Failed to fetch brand color:', error);
      }
    };
    fetchBrandColor();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="shops" element={<Shops />} />
          <Route path="garages" element={<Garages />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="users" element={<Users />} />
          <Route path="payments" element={<Payments />} />
          <Route path="products" element={<Products />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>

  );
}

export default App;

