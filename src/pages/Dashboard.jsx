import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import ShopDashboard from './ShopDashboard';
import GarageDashboard from './GarageDashboard';
import DeliveryDashboard from './DeliveryDashboard';

const Dashboard = () => {
    // Current role simulation (In a real app, this would come from AuthContext/Sanctum)
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for Google Auth redirect parameters
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const name = params.get('name');
        const roleParam = params.get('role');

        if (token && name && roleParam) {
            const userData = { name, role: roleParam, token };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    // If no user/role, show Admin as fallback or demo selector
    const role = user?.role || 'admin';

    if (role === 'admin' || role === 'platform_admin') return <AdminDashboard />;
    if (role === 'shop' || role === 'store_owner') return <ShopDashboard />;
    if (role === 'garage' || role === 'garage_owner') return <GarageDashboard />;
    if (role === 'delivery') return <DeliveryDashboard />;

    return <AdminDashboard />; // Default
};

export default Dashboard;
