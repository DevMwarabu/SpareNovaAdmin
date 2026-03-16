import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  User, 
  Database, 
  Clock, 
  Activity, 
  Shield, 
  Terminal,
  Eye,
  ChevronDown,
  ChevronUp,
  Monitor,
  Globe
} from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All Types');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/audit-logs`, {
        params: { model_type: filterType, page: currentPage, per_page: 15 }
      });
      if (res.data.success) {
        setLogs(res.data.data);
        setStats(res.data.stats);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch audit logs:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType, currentPage]);

  const getActionColor = (action) => {
    const a = action.toLowerCase();
    if (a.includes('delete') || a.includes('reject') || a.includes('suspend')) return 'text-red-600 bg-red-50';
    if (a.includes('create') || a.includes('approve')) return 'text-emerald-600 bg-emerald-50';
    if (a.includes('update')) return 'text-blue-600 bg-blue-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                <ClipboardList size={24} />
             </div>
             System Audit Logs
          </h1>
          <p className="text-slate-500 font-medium mt-1">Full transparency into administrative actions and infrastructure events.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <Activity size={14} className="animate-pulse" /> Live Integrity Mesh ACTIVE
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center`}>
                   {i === 0 ? <Terminal size={24} /> : i === 1 ? <Shield size={24} /> : <Database size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{s.v}</p>
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
           <div className="flex gap-2">
             <select 
               value={filterType}
               onChange={(e) => setFilterType(e.target.value)}
               className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none"
             >
                <option value="All Types">All Model Types</option>
                <option value="Product">Product</option>
                <option value="User">User</option>
                <option value="Shop">Shop</option>
                <option value="Order">Order</option>
                <option value="Payment">Payment</option>
             </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-16 text-center"></th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Agent</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action / Type</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource Target</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Infrastructure</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="6" className="py-20 text-center">
                       <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </td>
                 </tr>
              )}
              {logs.map((l) => (
                <React.Fragment key={l.id}>
                  <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}>
                    <td className="px-8 py-5 text-center">
                       {expandedId === l.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[10px] font-black uppercase">
                             {l.user.substring(0,2)}
                          </div>
                          <span className="text-xs font-black text-slate-900">{l.user}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest w-fit ${getActionColor(l.action)}`}>
                             {l.action}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l.model}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-xs font-mono font-black text-slate-700 italic bg-slate-50 px-2 py-0.5 rounded-md">ID-{l.model_id}</span>
                    </td>
                    <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <Globe size={12} /> {l.ip}
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 truncate max-w-[150px]">
                              <Monitor size={12} /> {l.details.ua?.substring(0,20)}...
                           </div>
                        </div>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-400 text-[10px]">
                       {l.date}
                    </td>
                  </tr>
                  {expandedId === l.id && (
                    <tr className="bg-slate-50/30">
                       <td colSpan="6" className="px-8 py-8 border-t border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pre-Action State</h4>
                                <pre className="p-4 bg-white rounded-3xl border border-slate-100 text-[10px] font-mono text-slate-500 overflow-x-auto shadow-sm">
                                   {JSON.stringify(l.details.old, null, 2) || "// No previous state recorded"}
                                </pre>
                             </div>
                             <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Post-Action State</h4>
                                <pre className="p-4 bg-white rounded-3xl border border-slate-100 text-[10px] font-mono text-blue-600 overflow-x-auto shadow-sm shadow-blue-500/5">
                                   {JSON.stringify(l.details.new, null, 2) || "// No state change recorded"}
                                </pre>
                             </div>
                          </div>
                       </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {logs.length === 0 && !loading && (
                 <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-sm font-bold text-slate-400 italic">
                        Empty activity ledger. No system events recorded.
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
                        className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-slate-900 text-white shadow-slate-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
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

export default AuditLogs;
