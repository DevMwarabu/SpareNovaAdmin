import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import VendorAIAssistant from '../components/VendorAIAssistant';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-6">
          <Outlet />
        </main>
      </div>
      {/* Global Neural Assistant Layer */}
      <VendorAIAssistant />
    </div>
  );
};

export default AdminLayout;
