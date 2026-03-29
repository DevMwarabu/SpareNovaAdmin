import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronUp,
  X,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Mail,
  Zap,
  Briefcase,
  History,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Disputes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Disputes');
  const [disputes, setDisputes] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const navigate = useNavigate();

  // Governance States
  const [isAdminActionOpen, setIsAdminActionOpen] = useState(false);
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [resolutionType, setResolutionType] = useState(null); // 'resolved', 'rejected', 'under_review'
  const [targetId, setTargetId] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const API_BASE = 'http://localhost:8003/api/v1';

  const showToast = (message, type = 'blue') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/disputes/templates`);
      if (res.data.success) {
        setAdminTemplates(res.data.data);
      }
    } catch (err) {
      console.error("Templates fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTemplates();
  }, [searchTerm, filterStatus, currentPage]);

  const handleGovernanceRequest = (id, resolution) => {
    setTargetId(id);
    setResolutionType(resolution);
    setIsAdminActionOpen(true);
  };

  const executeResolution = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_BASE}/admin/disputes/${targetId}/resolve`, { 
        status: resolutionType, 
        admin_notes: adminNotes,
        template_id: selectedTemplateId
      });
      if (res.data.success) {
        setIsAdminActionOpen(false);
        showToast('Mediation resolution authoritative protocol dispatched', 'emerald');
        fetchData();
        setExpandedId(null);
      }
    } catch (err) {
      showToast('Mediation protocol failed', 'rose');
    } finally {
      setLoading(false);
      setSelectedTemplateId('');
      setAdminNotes('');
    }
  };

  const statusStyles = {
    'Pending': 'bg-orange-50 text-orange-600 border-orange-100',
    'Under_review': 'bg-blue-50 text-blue-600 border-blue-100',
    'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Rejected': 'bg-red-50 text-red-600 border-red-100',
    'Closed': 'bg-slate-100 text-slate-500 border-slate-200'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      {/* Toast System */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${toast.type}-500 shadow-xl shadow-${toast.type}-500/20`}>
              <Zap size={16} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 shadow-xl shadow-rose-500/10 border border-rose-100">
                <Gavel size={24} />
             </div>
             Conflict Mitigation Hub
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60 italic">Marketplace Dispute Resolution & Evidence Analytics</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-xl shadow-emerald-500/10">
              <Scale size={16} className="animate-pulse" /> Live Mediation Mode ACTIVE
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-primary-100 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   {i === 0 ? <Scale size={28} /> : i === 1 ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">{s.l}</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tight italic">{s.v}</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-xl uppercase italic">
                {s.c}
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-3xl"></div>)}
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="relative group flex-1 max-w-md">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={18} />
             <input 
               placeholder="Index Case ID, Reason or Hub..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-4 text-xs font-black placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-rose-500/5 transition-all uppercase tracking-widest italic"
             />
           </div>
           <div className="flex gap-2 relative">
             <button 
               onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
               className={`p-3 rounded-xl transition-all border-2 flex items-center gap-2 ${showAdvancedFilter || filterStatus !== 'All Disputes' ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-xl shadow-rose-500/20' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
             >
               <Filter size={18} />
               {(filterStatus !== 'All Disputes') && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
               )}
             </button>
             <AnimatePresence>
               {showAdvancedFilter && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-80 bg-white rounded-[32px] shadow-2xl shadow-slate-900/10 border border-slate-100 p-6 z-50 origin-top-right text-left"
                  >
                     <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                        <div>
                           <p className="text-[12px] font-black text-slate-900 uppercase italic tracking-tight">Mitigation Matrix</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Granular Telemetry Filter</p>
                        </div>
                        <button onClick={() => setShowAdvancedFilter(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                           <XCircle size={14} />
                        </button>
                     </div>
                     
                     <div className="space-y-5">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3 pl-1">Protocol State</label>
                          <div className="grid grid-cols-2 gap-2">
                             {[
                               { l: 'All Protocols', v: 'All Disputes' }, 
                               { l: 'Pending', v: 'pending' }, 
                               { l: 'Active Analysis', v: 'under_review' }, 
                               { l: 'Resolved', v: 'resolved' }, 
                               { l: 'Rejected', v: 'rejected' }
                             ].map(state => (
                                <button 
                                  key={state.v}
                                  onClick={() => setFilterStatus(state.v)}
                                  className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === state.v ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                  {state.l}
                                </button>
                             ))}
                          </div>
                       </div>
                     </div>
                     
                     <div className="mt-8 flex gap-3">
                        <button onClick={() => { setFilterStatus('All Disputes'); setShowAdvancedFilter(false); }} className="flex-1 py-3.5 rounded-2xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Reset</button>
                        <button onClick={() => setShowAdvancedFilter(false)} className="flex-[2] py-3.5 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Apply Matrix</button>
                     </div>
                  </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 uppercase italic opacity-70">
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 w-20 text-center italic">Hub</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic">Dispute Manifest & Date</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic">Hub Entities</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic">Mitigation Status</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 text-right italic uppercase tracking-[0.2em]">Protocol ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto shadow-xl"></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6 italic animate-pulse">Synchronizing Mediation Database...</p>
                    </td>
                 </tr>
              )}
              {disputes.map((d) => (
                <React.Fragment key={d.id}>
                  <tr 
                    className={`hover:bg-slate-50/80 transition-all group cursor-pointer ${expandedId === d.id ? 'bg-slate-50/50' : ''}`} 
                    onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                  >
                    <td className="px-10 py-6 text-center">
                       <div className={`p-2 rounded-lg transition-transform ${expandedId === d.id ? 'bg-rose-600 text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:scale-110'}`}>
                          <ChevronDown size={14} />
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex flex-col items-start">
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders?id=${d.order_id}`); }} className="text-[11px] font-black text-slate-900 italic tracking-tighter leading-none mb-1 uppercase hover:text-rose-600 transition-colors decoration-rose-500/30 hover:underline underline-offset-4 cursor-pointer text-left">
                             ORDER #{d.order_number}
                          </button>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-none">{d.date}</span>
                          <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-2 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100/50 w-fit">{d.reason}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex flex-col gap-1.5 items-start">
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/users?id=${d.customer_id}`); }} className="flex items-center gap-1.5 text-[11px] font-black text-slate-700 italic hover:text-primary-600 transition-colors decoration-primary-500/30 hover:underline underline-offset-4 cursor-pointer">
                             <User size={12} className="text-primary-400" /> {d.customer}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/shops/${d.store_id}`); }} className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-secondary-600 transition-all cursor-pointer">
                             <Store size={12} className="text-secondary-400" /> {d.store}
                          </button>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusStyles[d.status] || 'bg-slate-50 text-slate-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${d.status === 'Resolved' ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse`} />
                          {d.status}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-right font-black text-slate-300 text-[10px] italic tracking-widest uppercase">
                       DS-{d.id.toString().padStart(4, '0')}
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expandedId === d.id && (
                      <tr>
                         <td colSpan="5" className="px-10 py-10 bg-slate-50/50 shadow-inner overflow-hidden uppercase italic">
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                            >
                               <div className="lg:col-span-4 space-y-8">
                                  <div className="p-8 bg-white rounded-[44px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <MessageSquare size={80} />
                                     </div>
                                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                        <Briefcase size={14} className="text-orange-500" /> Client Intelligence
                                     </h4>
                                     <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 text-[11px] text-slate-600 font-black leading-relaxed italic relative z-10">
                                        "{d.customer_notes || 'No verbalization provided by dispatch'}"
                                     </div>
                                  </div>
                                  
                                  <div className="p-8 bg-white rounded-[44px] border border-slate-100 shadow-xl shadow-slate-200/40">
                                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                        <ImageIcon size={14} className="text-rose-500" /> Evidence Vault
                                     </h4>
                                     <div className="grid grid-cols-2 gap-4">
                                        {d.evidence && d.evidence.length > 0 ? d.evidence.map((path, i) => (
                                          <div key={i} className="group relative aspect-square bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner hover:border-rose-200 transition-all">
                                             <img 
                                               src={`http://localhost:8003/storage/${path}`} 
                                               alt={`Evidence ${i}`} 
                                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                             />
                                             <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                                                <a href={`http://localhost:8003/storage/${path}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-xl text-slate-900 shadow-2xl hover:scale-110 active:scale-95 transition-all">
                                                   <ExternalLink size={16} />
                                                </a>
                                             </div>
                                          </div>
                                        )) : (
                                          <div className="col-span-2 py-10 rounded-[28px] bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-3 opacity-60">
                                             <ShieldAlert size={24} className="text-slate-300" />
                                             <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 text-center uppercase font-black">No Evidence Provided</p>
                                          </div>
                                        )}
                                     </div>
                                  </div>
                               </div>

                               <div className="lg:col-span-8 bg-white/50 p-10 rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col gap-10">
                                  <div className="flex items-center justify-between">
                                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                                        <History size={16} className="text-primary-500" /> Mediation Accountability Ledger
                                     </h4>
                                     <div className="flex gap-2">
                                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50 shadow-sm">Verified Node</span>
                                        <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50 shadow-sm">Case Sync 100%</span>
                                     </div>
                                  </div>

                                  <div className="space-y-6 flex-1">
                                     <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Admin Investigative Synthesis</p>
                                        <div className="flex flex-col gap-4">
                                           <div className="flex items-start gap-4">
                                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                 <User size={14} />
                                              </div>
                                              <div className="flex-1 p-5 rounded-[24px] bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 lowercase leading-relaxed">
                                                 "{d.admin_notes || 'Indexing system analysis...'}"
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>

                                  <div className="mt-auto pt-10 border-t border-slate-100 grid grid-cols-2 gap-5 text-center">
                                     <button 
                                       onClick={() => handleGovernanceRequest(d.id, 'resolved')}
                                       className="bg-emerald-600 text-white py-5 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                     >
                                        <CheckCircle2 size={20} /> Authorize Resolve
                                     </button>
                                     <button 
                                       onClick={() => handleGovernanceRequest(d.id, 'rejected')}
                                       className="bg-white border-2 border-slate-100 text-slate-500 py-5 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3"
                                     >
                                        <ShieldAlert size={20} /> Reject Protocol
                                     </button>
                                  </div>
                               </div>
                            </motion.div>
                         </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */ }
        <div className="p-8 bg-slate-50/20 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">
             {pagination ? `${pagination.from || 0}-${pagination.to || 0} of ${pagination.total} Case Files Indexed` : 'Synchronizing Metadata...'}
           </p>
           {pagination && pagination.last_page > 1 && (
             <div className="flex gap-2">
               {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const n = startPage + i;
                  if (n > pagination.last_page) return null;
                  return (
                    <button 
                        key={n} 
                        onClick={() => setCurrentPage(n)}
                        className={`w-10 h-10 rounded-xl text-[10px] font-black shadow-xl transition-all ${n === currentPage ? 'bg-rose-600 text-white shadow-rose-900/40' : 'bg-white text-slate-600 border-2 border-slate-50 hover:bg-slate-50 hover:border-slate-100'}`}
                      >
                        {n}
                      </button>
                  );
               })}
             </div>
           )}
        </div>
      </div>

      {/* Governance Drawer / Admin Action Sidebar */}
      <AnimatePresence>
        {isAdminActionOpen && (
           <div className="fixed inset-0 z-[200] flex justify-end bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto flex flex-col uppercase italic"
              >
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm shadow-slate-100/30">
                    <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-[24px] shadow-xl ${resolutionType === 'resolved' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 shadow-rose-500/10'}`}>
                          <Scale size={28} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conflict Mediation</p>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize">{resolutionType} AUTHORIZATION</h2>
                       </div>
                    </div>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 transition-all">
                       <X size={28} />
                    </button>
                 </div>

                 <div className="p-10 space-y-10 flex-1">
                    <div className="p-8 bg-slate-50 rounded-[44px] border border-slate-100 space-y-8">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-rose-500 shadow-sm border border-slate-100">
                             <Mail size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Client Dispatch</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60 leading-none italic">Select Resolution Protocol</p>
                          </div>
                       </div>
                       <select 
                         value={selectedTemplateId}
                         onChange={(e) => setSelectedTemplateId(e.target.value)}
                         className="w-full bg-white border-2 border-slate-100 rounded-[20px] px-6 py-4 text-[11px] font-black text-slate-600 outline-none focus:ring-4 focus:ring-rose-500/5 transition-all shadow-xl shadow-slate-200/50 uppercase tracking-[0.1em] italic"
                       >
                          <option value="">Awaiting Mediation Protocol...</option>
                          {adminTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                       </select>
                       
                       {selectedTemplateId && adminTemplates.find(t => t.id === Number(selectedTemplateId)) && (
                         <div className="mt-6 p-6 bg-white rounded-[28px] border border-rose-50 animate-in fade-in zoom-in-95 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                               <ShieldCheck size={14} className="text-rose-500" />
                               <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest italic leading-none">Draft Mediation Preview</p>
                            </div>
                            <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed italic font-medium opacity-80">{adminTemplates.find(t => t.id === Number(selectedTemplateId)).body}</p>
                         </div>
                       )}

                       <div className="pt-4 border-t border-slate-100">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Internal Disposition Notes</label>
                          <textarea 
                             value={adminNotes}
                             onChange={(e) => setAdminNotes(e.target.value)}
                             placeholder="Document technical reasoning for this authorized resolution..."
                             className="w-full bg-white border-2 border-slate-100 rounded-[24px] p-6 text-[11px] font-black text-slate-700 outline-none focus:ring-4 focus:ring-rose-500/5 transition-all min-h-[140px] italic shadow-inner"
                          />
                       </div>
                    </div>

                    <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-start gap-5">
                       <Zap size={24} className="text-blue-600 shrink-0 mt-1 shadow-sm" />
                       <div>
                          <p className="text-[12px] font-black text-blue-900 uppercase tracking-widest mb-1.5 leading-none">Mitigation Accountability Module</p>
                          <p className="text-[10px] text-blue-700 font-black leading-relaxed tracking-tight uppercase opacity-50 italic">Authorizing this resolution protocol will finalize the case file and dispatch technical notices to all verified hubs involved. This action is permanently recorded in the moderation mesh.</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 border-t border-slate-50 bg-white sticky bottom-0">
                    <button 
                      onClick={executeResolution}
                      disabled={!selectedTemplateId || loading}
                      className={`w-full py-5 rounded-[24px] text-xs font-black shadow-2xl transition-all flex items-center justify-center gap-4 ${resolutionType === 'resolved' ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-slate-900 text-white shadow-slate-900/30'} disabled:opacity-20 disabled:grayscale hover:scale-[1.02] active:scale-95 uppercase tracking-widest italic`}
                    >
                       {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={20} />}
                       {loading ? 'Dispatching Mediation Intel...' : 'Authorize Resolution Decision'}
                    </button>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-full mt-6 py-4 rounded-xl text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-[0.2em] italic">
                       Discard Mediation Request
                    </button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Disputes;
