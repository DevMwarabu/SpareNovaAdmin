import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Layers, 
  Search, 
  Filter, 
  CreditCard, 
  Users, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  RefreshCw,
  Globe,
  Settings
} from 'lucide-react';

const SaaSManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All Subscriptions');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/saas`, {
        params: { status: filterStatus, page: currentPage, per_page: 8 }
      });
      if (res.data.success) {
        setSubscriptions(res.data.data);
        setStats(res.data.stats);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch SaaS data:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus, currentPage]);

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s === 'active') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (s === 'expired') return 'text-red-600 bg-red-50 border-red-100';
    return 'text-orange-600 bg-orange-50 border-orange-100';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Layers size={24} />
             </div>
             SaaS Platform Control
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage vendor subscription tiers, platform revenue, and tenant access.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
             <Settings size={14} /> Subscription Plans
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center mb-4`}>
                 {i === 0 ? <TrendingUp size={24} /> : i === 1 ? <Users size={24} /> : <Zap size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">{s.v}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{s.c}</p>
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-32 rounded-3xl"></div>)}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative group flex-1 max-w-sm">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
             <input 
               placeholder="Search Tenant / Store Name..." 
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
             />
           </div>
           <div className="flex gap-2">
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none"
             >
                <option value="All Subscriptions">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
             </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Vendor Node</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Active Tier</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue Flow</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Renewal Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5" className="py-20 text-center">
                       <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </td>
                 </tr>
              )}
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Globe size={16} />
                       </div>
                       <span className="text-xs font-black text-slate-900">{sub.store}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-black text-slate-700 italic">{sub.plan}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-slate-900 font-mono italic">{sub.price}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-tight ${getStatusColor(sub.status)}`}>
                        <div className={`w-1 h-1 rounded-full ${sub.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {sub.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-slate-400 text-[10px]">
                    {sub.renews_at}
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-sm font-bold text-slate-400 italic">
                        No active SaaS subscriptions found.
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
                        className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
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

export default SaaSManagement;
