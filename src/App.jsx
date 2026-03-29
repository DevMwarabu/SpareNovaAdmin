import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './layouts/AdminLayout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import BusinessUnits from './pages/BusinessUnits';
import { Store, Wrench, Truck } from 'lucide-react';
import Users from './pages/Users';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Offers from './pages/Offers';
import Inventory from './pages/Inventory';
import Reviews from './pages/Reviews';
import LogisticsIntelligence from './pages/LogisticsIntelligence';
import Disputes from './pages/Disputes';
import Security from './pages/Security';
import AuditLogs from './pages/AuditLogs';
import SaaSManagement from './pages/SaaSManagement';
import AIInsights from './pages/AIInsights';
import Communications from './pages/Communications';
import SystemLogs from './pages/SystemLogs';
import RegisterPartner from './pages/RegisterPartner';
import CMS from './pages/CMS';
import Reports from './pages/Reports';
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
          <Route path="shops/:unitId?" element={<BusinessUnits type="shops" title="Shop Network" icon={Store} color="blue" />} />
          <Route path="garages/:unitId?" element={<BusinessUnits type="garages" title="Service Garages" icon={Wrench} color="emerald" />} />
          <Route path="logistics" element={<LogisticsIntelligence />} />
          <Route path="users" element={<Users />} />
          <Route path="payments" element={<Payments />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="offers" element={<Offers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="disputes" element={<Disputes />} />
          <Route path="security" element={<Security />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="saas" element={<SaaSManagement />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="communications" element={<Communications />} />
          <Route path="system-logs" element={<SystemLogs />} />
          <Route path="cms" element={<CMS />} />
          <Route path="reports" element={<Reports />} />
          <Route path="register-partner" element={<RegisterPartner />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>

  );
}

export default App;

