import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
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
  const [filterRole, setFilterRole] = useState('All Roles');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/users`, {
        params: { search: searchTerm, role: filterRole, page: currentPage, per_page: 8 }
      });
      if (res.data.success) {
        setUsers(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch users:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterRole, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/admin/users/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchData();
      } else {
        alert(res.data.message || 'Failed to update user.');
      }
    } catch (err) {
      alert(err.response?.data?.message || `Failed to update status for user ${id}`);
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center`}>
                   {i === 0 ? <UsersIcon size={24} /> : i === 1 ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
                  <p className="text-xl font-black text-slate-900">{s.v}</p>
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                {s.c}
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-3xl"></div>)}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative group flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
             <input 
               placeholder="Search by name or email..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
             />
           </div>
           <div className="flex gap-2">
             <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"><Filter size={18} /></button>
             <select 
               value={filterRole}
               onChange={(e) => setFilterRole(e.target.value)}
               className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none"
             >
                <option>All Roles</option>
                <option>Admins</option>
                <option>Store Owners</option>
                <option>Garage Owners</option>
                <option>Delivery Partners</option>
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
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5">
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                 </tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 font-black shadow-sm border border-slate-200">
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
                      u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {u.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500 tracking-tight font-serif">
                    {u.joined}
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                      <select 
                        value={u.status.toLowerCase()} 
                        onChange={(e) => handleStatusUpdate(u.id, e.target.value)}
                        className="opacity-0 group-hover:opacity-100 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 outline-none transition-all cursor-pointer hover:border-primary-300 focus:border-primary-500"
                      >
                         <option value="active">Active</option>
                         <option value="suspended">Suspend User</option>
                      </select>
                      <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Mail size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-sm font-bold text-slate-400">
                       No users found matching criteria.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */ }
        <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             {pagination ? `Showing ${pagination.from || 0}-${pagination.to || 0} of ${pagination.total} Results` : 'Loading...'}
           </p>
           {pagination && pagination.last_page > 1 && (
             <div className="flex gap-1">
               {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const n = startPage + i;
                  if (n > pagination.last_page) return null;
                  return (
                    <button 
                        key={n} 
                        onClick={() => setCurrentPage(n)}
                        className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-primary-600 text-white shadow-primary-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                      >
                        {n}
                      </button>
                  );
               })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Users;

