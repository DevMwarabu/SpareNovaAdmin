import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  AlertOctagon, 
  UserX, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Lock, 
  Eye, 
  Search, 
  Filter,
  RefreshCw,
  MoreVertical,
  Zap,
  ChevronRight,
  X,
  History,
  Info,
  ExternalLink,
  ShieldQuestion,
  Loader2,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Security = () => {
  const [stats, setStats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/portal/security`);
      if (res.data.success) {
        setStats(res.data.stats);
        setAlerts(res.data.alerts);
      }
    } catch (err) {
      console.error(`Failed to fetch security data:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvestigate = (alert) => {
    setSelectedAlert(alert);
    setAdminNotes(alert.reason || '');
    setIsDrawerOpen(true);
  };

  const handleSecurityAction = async (isFlagged) => {
    try {
      setActionLoading(true);
      const type = selectedAlert.type.includes('User') ? 'user' : 'order';
      const id = selectedAlert.id.replace('USR-', '');
      
      const res = await axios.post(`${API_BASE}/portal/security/flag`, {
        type,
        id,
        is_flagged: isFlagged,
        notes: adminNotes,
        score: isFlagged ? 85 : 0
      });

      if (res.data.success) {
        setIsDrawerOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Security resolution failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-rose-600 bg-rose-50 border-rose-100';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 shadow-xl shadow-rose-500/10 border border-rose-100">
                <Shield size={24} />
             </div>
             Security Command Hub
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">Neural Fraud Mitigation & Institutional Trust Mesh</p>
        </div>
        <div className="flex gap-3">
           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-xl shadow-emerald-500/10">
              <ShieldCheck size={16} className="animate-pulse" /> Sentinel Mode ACTIVE
           </div>
           <button 
              onClick={fetchData}
              className="bg-white border-2 border-slate-100 text-slate-700 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all active:scale-95"
           >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* Top Ledger Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-rose-100 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-${s.col === 'rose' ? 'rose' : s.col}-50 text-${s.col === 'rose' ? 'rose' : s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   {i === 0 ? <UserX size={28} /> : i === 1 ? <AlertOctagon size={28} /> : <Activity size={28} />}
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
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-28 rounded-3xl"></div>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                       <AlertTriangle size={18} className="text-rose-500" /> Neural Risk Deflections
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60 italic">High-Confidence Threat Detection Log</p>
                  </div>
                  <div className="flex gap-2">
                     <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100/50 shadow-sm uppercase tracking-widest">Real-time Analysis</span>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50/50 uppercase italic opacity-70">
                           <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic">Threat Node</th>
                           <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic">Indicator Type</th>
                           <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic">Risk Score</th>
                           <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic text-right uppercase tracking-[0.2em]">Context</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 relative font-black uppercase italic">
                        {loading && (
                           <tr>
                              <td colSpan="4" className="py-24 text-center">
                                 <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto shadow-xl"></div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6 italic animate-pulse">Synchronizing Security database...</p>
                              </td>
                           </tr>
                        )}
                        {alerts.map((a, i) => (
                           <tr 
                             key={i} 
                             onClick={() => handleInvestigate(a)}
                             className="hover:bg-slate-50 transition-all group cursor-pointer"
                           >
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all">
                                       {a.type.includes('User') ? <UserX size={18} /> : <AlertOctagon size={18} />}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-[11px] font-black text-slate-900 tracking-tighter leading-none mb-1">{a.target}</span>
                                       <span className="text-[8px] font-black text-slate-300 tracking-widest italic">{a.id}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Fingerprint size={12} className="opacity-40" /> {a.type}
                                 </span>
                              </td>
                              <td className="px-10 py-6">
                                 <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${getRiskColor(a.score)}`}>
                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                    {a.score}%
                                 </span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                 <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 group-hover:text-rose-600 group-hover:bg-rose-50 group-hover:border-rose-100 transition-all shadow-xl shadow-slate-200/50">
                                    <ChevronRight size={18} />
                                 </button>
                              </td>
                           </tr>
                        ))}
                        {!loading && alerts.length === 0 && (
                           <tr>
                              <td colSpan="4" className="py-24 text-center">
                                 <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xl shadow-emerald-500/20">
                                    <ShieldCheck size={32} />
                                 </div>
                                 <p className="text-[12px] font-black text-slate-900 tracking-tight uppercase italic mb-1">No Anomalies Detected</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">The intelligence mesh is clear.</p>
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[56px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-rose-900/10 border border-white/5">
               <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <Lock size={160} />
               </div>
               <div className="relative z-10 space-y-8 uppercase italic">
                  <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner">
                     <ShieldCheck size={32} className="text-rose-400" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black tracking-tight leading-none mb-3">AI Deflection Core</h3>
                     <p className="text-slate-400 text-xs font-black tracking-tighter leading-relaxed opacity-60">Neural monitoring is analyzing 42,000+ data nodes per cycle. Identity heuristics and geographic spoofing detection are fully active.</p>
                  </div>
                  <div className="pt-6 border-t border-white/10 space-y-5">
                     <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.1em] text-slate-300">Biometric Integrity: VERIFIED</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.1em] text-slate-300">Escrow Security Mesh: LOCKED</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[44px] border border-slate-100 p-8 space-y-8 shadow-2xl shadow-slate-200/40 relative overflow-hidden uppercase italic">
               <div className="absolute top-0 right-0 p-6 opacity-5 -rotate-12 translate-x-4 -translate-y-4">
                  <Activity size={100} />
               </div>
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Activity size={16} className="text-blue-500" /> Operational Integrity
               </h3>
               <div className="space-y-4 relative z-10">
                  {[
                    { l: 'Auth Confidence', v: '99.98%', col: 'emerald' },
                    { l: 'Flagged Traffic', v: '0.42%', col: 'rose' },
                    { l: 'Blocked Hubs', v: '18', col: 'slate' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[28px] border border-slate-100/50 shadow-inner hover:bg-slate-50 transition-colors">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.l}</span>
                       <span className={`text-[12px] font-black text-${item.col === 'rose' ? 'rose' : item.col === 'emerald' ? 'emerald' : 'slate'}-600 leading-none italic`}>{item.v}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Risk Investigation Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedAlert && (
          <div className="fixed inset-0 z-[200] flex justify-end bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto flex flex-col uppercase italic"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm shadow-slate-100/30">
                 <div className="flex items-center gap-5">
                    <div className="p-4 rounded-[24px] bg-rose-50 text-rose-600 shadow-xl shadow-rose-500/10 border border-rose-100">
                       <ShieldAlert size={28} />
                    </div>
                    <div className="flex flex-col items-start">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Investigation</p>
                       <button 
                          onClick={() => {
                             setIsDrawerOpen(false);
                             if (selectedAlert.type.includes('User')) navigate(`/portal/users?id=${selectedAlert.id.replace('USR-', '')}`);
                             else navigate(`/portal/orders?id=${selectedAlert.id}`);
                          }}
                          className="text-2xl font-black text-slate-900 tracking-tight leading-none text-left max-w-[240px] hover:text-rose-600 hover:underline decoration-rose-500/30 underline-offset-4 transition-all truncate"
                       >
                          {selectedAlert.target}
                       </button>
                    </div>
                 </div>
                 <button onClick={() => setIsDrawerOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 transition-all">
                    <X size={28} />
                 </button>
              </div>

              <div className="p-10 space-y-10 flex-1">
                 <div className="p-8 bg-slate-50 rounded-[44px] border border-slate-100 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <Fingerprint size={120} />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm border border-slate-100">
                          <AlertTriangle size={24} />
                       </div>
                       <div>
                          <p className="text-[11px] font-black text-slate-900 leading-none mb-1">Threat Context</p>
                          <p className="text-[9px] text-slate-400 font-bold tracking-widest opacity-60 italic">{selectedAlert.type}</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <div className="p-6 bg-white rounded-[28px] border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 mb-2 uppercase tracking-widest">Neural Confidence</p>
                          <p className="text-2xl font-black text-rose-600 italic tracking-tighter leading-none">{selectedAlert.score}%</p>
                       </div>
                       <div className="p-6 bg-white rounded-[28px] border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 mb-2 uppercase tracking-widest">Incident Timestamp</p>
                          <p className="text-[11px] font-black text-slate-900 italic tracking-tighter leading-none">{selectedAlert.date}</p>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Institutional Investigation Synthesis</label>
                       <textarea 
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Document the technical reasoning for this risk determination..."
                          className="w-full bg-white border-2 border-slate-100 rounded-[28px] p-6 text-[11px] font-black text-slate-700 outline-none focus:ring-4 focus:ring-rose-500/5 transition-all min-h-[160px] italic shadow-inner"
                       />
                    </div>
                 </div>

                 <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-start gap-5">
                    <Info size={24} className="text-blue-600 shrink-0 mt-1 shadow-sm" />
                    <div>
                       <p className="text-[12px] font-black text-blue-900 uppercase tracking-widest mb-1.5 leading-none">Mitigation Accountability Policy</p>
                       <p className="text-[10px] text-blue-700 font-black leading-relaxed tracking-tight uppercase opacity-50 italic">Executing a security flag will permanently restrict this node's transactional capabilities across the SpareNova mesh. All actions are logged and verified by the governance ledger.</p>
                    </div>
                 </div>
              </div>

              <div className="p-10 border-t border-slate-50 bg-white sticky bottom-0 grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => handleSecurityAction(true)}
                   disabled={actionLoading}
                   className="py-5 bg-rose-600 text-white rounded-[24px] text-xs font-black shadow-2xl shadow-rose-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <ShieldAlert size={20} />}
                    Flag Node
                 </button>
                 <button 
                   onClick={() => handleSecurityAction(false)}
                   disabled={actionLoading}
                   className="py-5 bg-white border-2 border-slate-100 text-slate-500 rounded-[24px] text-xs font-black hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    <ShieldCheck size={20} /> Clear Asset
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Security;
