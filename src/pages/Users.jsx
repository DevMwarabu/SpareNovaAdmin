import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users as UsersIcon, 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  Mail, 
  CheckCircle2, 
  XCircle,
  Clock,
  Filter
} from 'lucide-react';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 1, name: 'Alex Mwarabu', email: 'alex@sparenova.com', role: 'Platform Admin', status: 'Active', joined: '2025-12-10' },
    { id: 2, name: 'John Doe', email: 'john@shop.com', role: 'Store Owner', status: 'Active', joined: '2026-01-05' },
    { id: 3, name: 'Sarah Wilson', email: 'sarah@garage.com', role: 'Garage Owner', status: 'Pending', joined: '2026-03-12' },
    { id: 4, name: 'Mike Johnson', email: 'mike@delivery.com', role: 'Delivery Partner', status: 'Active', joined: '2026-02-20' },
    { id: 5, name: 'Jane Smith', email: 'jane@cust.com', role: 'Customer', status: 'Suspended', joined: '2026-01-15' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <UsersIcon size={24} />
             </div>
             User Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Configure user roles, permissions and account access.</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-slate-900/20 hover:bg-slate-800 flex items-center gap-2 transition-all active:scale-95">
           <UserPlus size={16} /> Create New User
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative group flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
             <input 
               placeholder="Search by name, email or role..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
             />
           </div>
           <div className="flex gap-2">
             <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"><Filter size={18} /></button>
             <select className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none">
                <option>All Roles</option>
                <option>Admins</option>
                <option>Store Owners</option>
                <option>Garage Owners</option>
                <option>Customers</option>
             </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Security Role</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Account status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Join Date</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-black shadow-lg shadow-primary-500/20">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1">{u.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 italic lowercase tracking-tight">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                      <Shield size={14} className="text-primary-500" />
                      {u.role}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                      u.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {u.status === 'Active' ? <CheckCircle2 size={12} /> : u.status === 'Pending' ? <Clock size={12} /> : <XCircle size={12} />}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500 tracking-tight font-serif">
                    {u.joined}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Mail size={18} /></button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg transition-all"><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
