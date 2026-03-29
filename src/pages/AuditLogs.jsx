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
  Globe,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Zap,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All Types');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/audit-logs`, {
        params: { model_type: filterType, page: currentPage, per_page: 15, q: searchQuery }
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
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [filterType, currentPage, searchQuery]);

  const downloadCSV = () => {
    if (logs.length === 0) return;
    const headers = "Audit_ID,Action_Type,Infrastructure_Target,Network_IP,Admin_Agent,Timestamp\n";
    const mappedRows = logs.map(l => `${l.id},${l.action},${l.model}-${l.model_id},${l.ip},"${l.user}","${l.date}"`).join("\n");
    const blob = new Blob([headers + mappedRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Governance_Ledger_Snapshot_${new Date().getTime()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionColor = (action) => {
    const a = action.toLowerCase();
    if (a.includes('delete') || a.includes('reject') || a.includes('suspend') || a.includes('flag')) return 'text-red-600 bg-red-50 border-red-100';
    if (a.includes('create') || a.includes('approve') || a.includes('verify')) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (a.includes('update') || a.includes('modify')) return 'text-blue-600 bg-blue-50 border-blue-100';
    return 'text-slate-600 bg-slate-50 border-slate-100';
  };

  const parseUA = (ua) => {
    if (!ua) return { browser: 'Unknown', os: 'Cloud' };
    const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : ua.includes('Firefox') ? 'Firefox' : 'Generic Browser';
    const os = ua.includes('Macintosh') ? 'macOS' : ua.includes('Windows') ? 'Windows' : ua.includes('Linux') ? 'Linux' : 'Server';
    return { browser, os };
  };

  const DiffViewer = ({ oldValues, newValues }) => {
    const allKeys = Array.from(new Set([...Object.keys(oldValues || {}), ...Object.keys(newValues || {})]));
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 px-6 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
          <span>Property Node</span>
          <span>Baseline State</span>
          <span>Authorized Transition</span>
        </div>
        <div className="space-y-1.5">
          {allKeys.length > 0 ? allKeys.map(key => {
            const isChanged = JSON.stringify(oldValues?.[key]) !== JSON.stringify(newValues?.[key]);
            if (!isChanged && !newValues?.[key]) return null;
            
            return (
              <div key={key} className={`grid grid-cols-3 items-center px-6 py-3 rounded-2xl border transition-all ${isChanged ? 'bg-blue-50/30 border-blue-100 shadow-sm' : 'bg-slate-50/30 border-slate-50 opacity-40'}`}>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter italic">{key}</span>
                <span className="text-[11px] font-bold text-slate-400 truncate pr-4">
                   {oldValues?.[key] ? String(oldValues[key]) : <span className="text-[9px] italic opacity-30">null</span>}
                </span>
                <div className="flex items-center gap-2">
                   {isChanged && <ArrowRight size={14} className="text-blue-400" />}
                   <span className={`text-[11px] font-black ${isChanged ? 'text-blue-600' : 'text-slate-500'}`}>
                      {newValues?.[key] ? String(newValues[key]) : <span className="text-[9px] italic opacity-30">null</span>}
                   </span>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No state telemetry captured for this event</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2.5 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20">
                <ClipboardList size={24} />
             </div>
             System Governance Ledger
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">High-Fidelity Administrative Transparency & Infrastructure Logs</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-xl shadow-emerald-500/10">
              <Activity size={16} className="animate-pulse" /> Live Integrity Mesh ACTIVE
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-primary-100 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   {i === 0 ? <Terminal size={28} /> : i === 1 ? <Shield size={28} /> : <Database size={28} />}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tight">{s.v}</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-xl uppercase italic">
                {s.c}
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-3xl"></div>)}
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search size={16} className="text-slate-400 absolute ml-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input 
                       type="text" 
                       placeholder="Scan Audit Memory by Admin, Action, or IP..."
                       value={searchQuery}
                       onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                       className="w-full md:w-[360px] bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-4 text-xs font-black placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-slate-900/5 transition-all uppercase tracking-widest italic"
                    />
                 </div>
                 <button onClick={downloadCSV} className="p-4 bg-emerald-50 text-emerald-600 rounded-[20px] shadow-sm hover:scale-105 hover:bg-emerald-100 active:scale-95 transition-all flex items-center justify-center border border-emerald-100/50 group" title="Export Ledger to CSV">
                    <Database size={18} className="group-hover:animate-pulse" />
                 </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All Types', 'Product', 'Promotion', 'Shop', 'Garage', 'Payment', 'Order', 'Policy', 'User'].map(t => (
                  <button 
                    key={t}
                    onClick={() => { setFilterType(t); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === t ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 self-start xl:self-center">
               <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm">
                  <ShieldCheck size={18} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Compliant Hub</p>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 w-20 text-center italic">Hub</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Administrative Agent</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Action Protocol</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Infrastructure Node</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right italic">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto shadow-2xl"></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 italic animate-pulse">Synchronizing Activity Ledger...</p>
                    </td>
                 </tr>
              )}
              {logs.map((l) => {
                const ua = parseUA(l.details.ua);
                return (
                  <React.Fragment key={l.id}>
                    <tr 
                      className={`hover:bg-slate-50/80 transition-all group cursor-pointer ${expandedId === l.id ? 'bg-slate-50/50' : ''}`} 
                      onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}
                    >
                      <td className="px-10 py-6 text-center">
                         <div className={`p-2 rounded-lg transition-transform ${expandedId === l.id ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:scale-110'}`}>
                            <ChevronDown size={14} />
                         </div>
                      </td>
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-900 text-[11px] font-black uppercase shadow-sm group-hover:border-primary-100 transition-colors italic">
                               {l.user.substring(0,2)}
                            </div>
                            <div>
                               <p className="text-[11px] font-black text-slate-900 uppercase italic leading-none truncate max-w-[120px]">{l.user}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60 italic">Auth Level 10</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                         <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest w-fit border shadow-sm ${getActionColor(l.action)}`}>
                               {l.action}
                            </span>
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter opacity-60">{l.model}</span>
                               <span className="text-[9px] font-mono font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded italic shadow-inner">ID-{l.model_id}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                          <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 italic">
                                <Globe size={14} className="text-primary-400" /> {l.ip}
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase italic border border-slate-100/50 shadow-sm">
                                   <Monitor size={12} className="text-blue-400" /> {ua.browser}
                                </span>
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase italic border border-slate-100/50 shadow-sm">
                                   <Cpu size={12} className="text-emerald-400" /> {ua.os}
                                </span>
                             </div>
                          </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <p className="text-[10px] font-black text-slate-900 leading-none italic">{l.date.split(' ')[0]}</p>
                         <p className="text-[9px] font-black text-slate-400 mt-1 opacity-60 uppercase tracking-widest">{l.date.split(' ')[1]}</p>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedId === l.id && (
                        <tr>
                           <td colSpan="5" className="px-10 py-10 bg-slate-50/50 shadow-inner">
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                              >
                                 <div className="lg:col-span-3 space-y-6">
                                    <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                          <ShieldCheck size={14} className="text-emerald-500" /> Event Metadata
                                       </h4>
                                       <div className="space-y-4">
                                          <div>
                                             <p className="text-[9px] font-black text-slate-300 uppercase italic mb-1">Infrastructure Node</p>
                                             <p className="text-[10px] font-black text-slate-600 truncate border-b border-slate-50 pb-2">{l.details.ua}</p>
                                          </div>
                                          <div>
                                             <p className="text-[9px] font-black text-slate-300 uppercase italic mb-1">Authorized IP</p>
                                             <p className="text-[10px] font-black text-slate-600">{l.ip}</p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100">
                                       <p className="text-[9px] font-black text-blue-900 uppercase tracking-widest italic mb-2">Governance Protocol</p>
                                       <p className="text-[9px] text-blue-700 font-bold leading-relaxed uppercase opacity-60">This transition was authorized by {l.user} via localized session token. Infrastructure telemetry confirms legitimate administrative origin.</p>
                                    </div>
                                 </div>
                                 <div className="lg:col-span-9 bg-white p-8 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                       <Database size={120} />
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
                                       <Zap size={16} className="text-blue-500" /> High-Fidelity Reactive Diff Engine
                                    </h4>
                                    <DiffViewer oldValues={l.details.old} newValues={l.details.new} />
                                 </div>
                              </motion.div>
                           </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
              {logs.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-10 py-32 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center text-slate-100 shadow-inner">
                             <Shield size={48} />
                          </div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">Station Ledger Blank: No Events Synchronized</p>
                       </div>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */ }
        <div className="p-8 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">
             {pagination ? `${pagination.from || 0}-${pagination.to || 0} of ${pagination.total} Governance Cycles Indexed` : 'Transmitting Metadata...'}
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
                        className={`w-10 h-10 rounded-xl text-[10px] font-black shadow-xl transition-all ${n === currentPage ? 'bg-slate-900 text-white shadow-slate-900/40' : 'bg-white text-slate-600 border-2 border-slate-50 hover:bg-slate-50 hover:border-slate-100'}`}
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
