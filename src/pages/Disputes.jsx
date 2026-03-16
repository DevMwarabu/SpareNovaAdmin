import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Gavel, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  User, 
  Store, 
  FileText,
  Scale,
  XCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Disputes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Disputes');
  const [disputes, setDisputes] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/disputes`, {
        params: { search: searchTerm, status: filterStatus, page: currentPage, per_page: 8 }
      });
      if (res.data.success) {
        setDisputes(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch disputes:`, err);
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

  const handleResolve = async (id, status, notes) => {
    try {
      const res = await axios.put(`${API_BASE}/admin/disputes/${id}/resolve`, { 
        status, 
        admin_notes: notes,
        resolution: `Dispute ${status} by Admin`
      });
      if (res.data.success) {
        fetchData();
        setExpandedId(null);
      }
    } catch (err) {
      console.error(`Failed to resolve dispute ${id}:`, err);
    }
  };

  const statusStyles = {
    'Pending': 'bg-orange-50 text-orange-600',
    'Under_review': 'bg-blue-50 text-blue-600',
    'Resolved': 'bg-emerald-50 text-emerald-600',
    'Rejected': 'bg-red-50 text-red-600',
    'Closed': 'bg-slate-100 text-slate-500'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-red-50 text-red-600">
                <Gavel size={24} />
             </div>
             Dispute Resolution Center
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage marketplace conflicts, review evidence and issue resolutions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center`}>
                   {i === 0 ? <Scale size={24} /> : i === 1 ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
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
           <div className="relative group flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" size={18} />
             <input 
               placeholder="Search by Order ID, Reason or User..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
             />
           </div>
           <div className="flex gap-2">
             <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"><Filter size={18} /></button>
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none"
             >
                <option value="All Disputes">All Case Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
             </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-16 text-center"></th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Order & Date</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Common Parties</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Dispute Reason</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Case ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="6">
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                 </tr>
              )}
              {disputes.map((d) => (
                <React.Fragment key={d.id}>
                  <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}>
                    <td className="px-8 py-5 text-center">
                       {expandedId === d.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">{d.order_number}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.date}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                             <User size={10} className="text-slate-400" /> {d.customer}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                             <Store size={10} /> {d.store}
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-xs font-black text-red-600 line-clamp-1 italic">{d.reason}</span>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusStyles[d.status] || 'bg-slate-50 text-slate-600'}`}>
                         {d.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right font-mono text-[10px] font-black text-slate-300">
                       DS-{d.id.toString().padStart(4, '0')}
                    </td>
                  </tr>
                  {expandedId === d.id && (
                    <tr className="bg-slate-50/30">
                       <td colSpan="6" className="px-8 py-8 border-t border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                   <MessageSquare size={12} /> Case Details & Evidence
                                </h4>
                                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm italic text-sm text-slate-700 font-medium leading-relaxed">
                                   "{d.customer_notes}"
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                   {/* Evidence Placeholders */}
                                   <div className="aspect-square rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300"><FileText size={20} /></div>
                                   <div className="aspect-square rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300"><FileText size={20} /></div>
                                </div>
                             </div>
                             <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                   <Scale size={12} /> Admin Intervention
                                </h4>
                                <textarea 
                                   placeholder="Add internal notes or resolution summary..."
                                   defaultValue={d.admin_notes}
                                   className="w-full bg-white border border-slate-200 rounded-3xl p-6 text-sm font-medium outline-none focus:ring-4 focus:ring-red-500/5 min-h-[120px] transition-all"
                                />
                                <div className="flex gap-3">
                                   <button 
                                      onClick={() => handleResolve(d.id, 'resolved', 'Refund processed')}
                                      className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                   >
                                      <CheckCircle2 size={16} /> Resolve Dispute
                                   </button>
                                   <button 
                                      onClick={() => handleResolve(d.id, 'rejected', 'Evidence insufficient')}
                                      className="flex-1 bg-red-600 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                   >
                                      <XCircle size={16} /> Reject Case
                                   </button>
                                </div>
                             </div>
                          </div>
                       </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {disputes.length === 0 && !loading && (
                 <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-sm font-bold text-slate-400 italic">
                        No active disputes found in this category.
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
                        className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-red-600 text-white shadow-red-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
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

export default Disputes;
