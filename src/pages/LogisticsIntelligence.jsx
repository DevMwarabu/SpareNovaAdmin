import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Truck, 
  Search, 
  Filter, 
  MapPin, 
  Navigation, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Activity,
  Package
} from 'lucide-react';

const LogisticsIntelligence = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Deliveries');
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/logistics`, {
        params: { search: searchTerm, status: filterStatus, page: currentPage, per_page: 8 }
      });
      if (res.data.success) {
        setDeliveries(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch logistics data:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterStatus, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) return 'border-emerald-500/20 bg-emerald-50/50 text-emerald-600';
    if (s.includes('transit')) return 'border-blue-500/20 bg-blue-50/50 text-blue-600';
    if (s.includes('dispatched')) return 'border-purple-500/20 bg-purple-50/50 text-purple-600';
    return 'border-orange-500/20 bg-orange-50/50 text-orange-600';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Navigation size={24} />
             </div>
             Logistics Mastery
          </h1>
          <p className="text-slate-500 font-medium mt-1">Real-time delivery monitoring, route tracking and delay intelligence.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
             <Activity size={14} /> Tracking Logs
           </button>
           <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95">
             <Zap size={14} /> Optimization
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center`}>
                   {i === 0 ? <Truck size={24} /> : i === 1 ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{s.v}</p>
                </div>
              </div>
              <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.col === 'red' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                {s.c}
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-3xl"></div>)}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex gap-2">
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none"
             >
                <option value="All Deliveries">All Deliveries</option>
                <option value="dispatched">Dispatched</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
             </select>
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
              <Activity size={12} className="text-emerald-500" />
              SYSTEM OPERATIONAL: LIVE UPDATES
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Order & Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Partner</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Transit Path</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tracking Info</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Last Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5">
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                 </tr>
              )}
              {deliveries.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1.5">
                       <span className="text-sm font-black text-slate-900">{d.id}</span>
                       <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-tight ${getStatusColor(d.status)}`}>
                         <div className={`w-1 h-1 rounded-full ${d.status.includes('Delivered') ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                         {d.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-white text-[10px] font-black uppercase shadow-sm">
                          {d.partner.substring(0,2)}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-800">{d.partner}</span>
                          <span className="text-[10px] font-bold text-slate-400">Express Delivery</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-start gap-4">
                       <div className="flex flex-col items-center gap-1 mt-1">
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                          <div className="w-[1px] h-4 bg-slate-100" />
                          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px]">{d.origin}</span>
                          <span className="text-[10px] font-black text-slate-800 truncate max-w-[120px]">{d.destination}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-mono font-black text-slate-400 italic bg-slate-50 px-2 py-0.5 rounded-md inline-block w-fit">#{d.tracking}</span>
                       <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500">
                          <ShieldCheck size={10} /> Verified Path
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <div className="flex flex-col items-end">
                       <span className="text-xs font-black text-slate-900">{d.last_update}</span>
                       {d.is_delayed && (
                          <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1 mt-0.5">
                             <Clock size={10} /> Potential Delay
                          </span>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {deliveries.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-3 opacity-30">
                          <Truck size={40} />
                          <p className="text-sm font-bold text-slate-400">No active logistics operations found.</p>
                       </div>
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
                        className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
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

export default LogisticsIntelligence;
