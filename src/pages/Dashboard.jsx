import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import ShopDashboard from './ShopDashboard';
import GarageDashboard from './GarageDashboard';
import DeliveryDashboard from './DeliveryDashboard';

const Dashboard = () => {
    // Current role simulation (In a real app, this would come from AuthContext/Sanctum)
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
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
