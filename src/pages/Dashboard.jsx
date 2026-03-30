import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import VendorDashboard from './VendorDashboard';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const name = params.get('name');
        const roleParam = params.get('role');

        if (token && name && roleParam) {
            const userData = { name, role: roleParam, token };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const role = user?.role || 'admin';

    if (role === 'admin' || role === 'platform_admin') return <AdminDashboard />;
    
    // All Institutional Roles use the new high-fidelity command center
    return <VendorDashboard />;
};

export default Dashboard;
