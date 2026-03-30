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
import ProductForm from './pages/ProductForm';
import Reports from './pages/Reports';
import LoyaltyHub from './pages/LoyaltyHub';
import './index.css';

const API_BASE = 'http://localhost:8003/api/v1';

function App() {
  useEffect(() => {
    // ── Global Security Interceptor ──────────────────────────────────────────
    const authInterceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => Promise.reject(error));

    // Handle 401 Session Expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Clear credentials and redirect to gateway
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );

    const fetchBranding = async () => {
      try {
        const response = await axios.get(`${API_BASE}/settings`);
        const { brand_color, custom_logo, site_name } = response.data.settings;
        
        if (brand_color) {
          document.documentElement.style.setProperty('--dynamic-brand-color', brand_color);
        }
        
        if (custom_logo) {
          localStorage.setItem('platform_logo', custom_logo);
          // Dispatch custom event to notify Sidebar/Navbar
          window.dispatchEvent(new Event('branding_update'));
        } else {
          localStorage.removeItem('platform_logo');
        }

        if (site_name) {
          document.title = `${site_name} | Admin Control Hub`;
        }
      } catch (error) {
        console.error('Failed to fetch branding settings:', error);
      }
    };
    fetchBranding();
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />
        <Route path="/:role" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="shops/:unitId?" element={<BusinessUnits type="shops" title="Shop Network" icon={Store} color="blue" />} />
          <Route path="garages/:unitId?" element={<BusinessUnits type="garages" title="Service Garages" icon={Wrench} color="emerald" />} />
          <Route path="logistics" element={<LogisticsIntelligence />} />
          <Route path="users" element={<Users />} />
          <Route path="payments" element={<Payments />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="products/:id?" element={<Products />} />
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
          <Route path="loyalty" element={<LoyaltyHub />} />
          <Route path="register-partner" element={<RegisterPartner />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/:role/*" element={<Navigate to={`/${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role || 'admin' : 'admin'}`} replace />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
