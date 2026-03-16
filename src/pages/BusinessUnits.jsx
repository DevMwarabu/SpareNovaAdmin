import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Store, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  MapPin,
  TrendingUp,
  Download
} from 'lucide-react';

const BusinessUnitList = ({ title, type, icon: Icon, color }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [units, setUnits] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/${type}`, {
        params: { search: searchTerm, status: filterStatus }
      });
      if (res.data.success) {
        setUnits(res.data.data);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterStatus, type]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/admin/${type}/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchData(); // Refresh list after update
      }
    } catch (err) {
      console.error(`Failed to update status for ${type} ${id}:`, err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600`}>
                <Icon size={24} />
             </div>
             {title}
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage and monitor all registered {type} on the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
             <Download size={14} /> Export
          </button>
          <button className={`bg-primary-600 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary-500/30 hover:bg-primary-700 flex items-center gap-2 transition-all active:scale-95`}>
             <Plus size={16} /> Register New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center`}>
                   {i === 0 ? <Icon size={24} /> : i === 1 ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
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

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative group flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
             <input 
               placeholder={`Search ${type}...`} 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
             />
           </div>
           <div className="flex gap-2">
             <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"><Filter size={18} /></button>
             <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none"
             >
                <option value="All Status">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
             </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Info</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue (MTD)</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {units.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1">{u.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Owner: {u.owner}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <MapPin size={14} className="text-slate-300" />
                      {u.location}, KE
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      u.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 
                      u.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${u.status === 'verified' ? 'bg-emerald-600' : u.status === 'pending' ? 'bg-orange-600' : 'bg-red-600'}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900 tracking-tight">
                    KES {u.revenue}
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                      <select 
                        value={u.status} 
                        onChange={(e) => handleStatusUpdate(u.id, e.target.value)}
                        className="opacity-0 group-hover:opacity-100 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 outline-none transition-all cursor-pointer hover:border-primary-300 focus:border-primary-500"
                      >
                         <option value="pending">Set Pending</option>
                         <option value="verified">Approve</option>
                         <option value="suspended">Suspend</option>
                         <option value="rejected">Reject</option>
                      </select>
                      <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><ExternalLink size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {units.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-sm font-bold text-slate-400">
                       No {type} found.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Showing 1-4 of 142 Results</p>
           <div className="flex gap-1">
             {[1,2,3].map(n => (
               <button key={n} className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === 1 ? 'bg-primary-600 text-white shadow-primary-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{n}</button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessUnitList;
