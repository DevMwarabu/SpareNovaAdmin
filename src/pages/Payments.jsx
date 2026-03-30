import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Download,
  CreditCard,
  Building2,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronRight,
  ShieldAlert,
  Loader2,
  Mail,
  X,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const showToast = (message, type = 'blue') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/portal/payments`, {
        params: { page: currentPage, per_page: 8 }
      });
      if (res.data.success) {
        setStats(res.data.stats);
        setTransactions(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch payments:`, err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/portal/payments/templates`);
      if (res.data.success) {
        setAdminTemplates(res.data.data);
      }
    } catch (err) {
      console.error("Templates fetch failed:", err);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchData();
    fetchTemplates();
  }, [currentPage]);

  const handleGovernanceRequest = (id, action) => {
    setTargetTxnId(id);
    setActionType(action);
    setIsAdminActionOpen(true);
  };

  const executeAdminAction = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_BASE}/portal/payments/${targetTxnId}/status`, {
        status: actionType,
        template_id: selectedTemplateId
      });
      if (res.data.success) {
        setIsAdminActionOpen(false);
        showToast('Financial Governance Protocol Dispatched', 'emerald');
        fetchData();
      }
    } catch (err) {
      showToast('Payout Authorization Failed', 'rose');
    } finally {
      setLoading(false);
      setSelectedTemplateId('');
    }
  };

  const isInstitutional = currentUser && currentUser.role !== 'admin';

  const statusStyles = {
    'Paid': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Completed': 'bg-blue-50 text-blue-600 border-blue-100',
    'Pending': 'bg-orange-50 text-orange-600 border-orange-100',
    'Failed': 'bg-rose-50 text-rose-600 border-rose-100',
    'Flagged': 'bg-slate-900 text-white border-slate-800'
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      {/* Toast System */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4 shadow-emerald-500/10">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${toast.type}-500 shadow-xl shadow-${toast.type}-500/20`}>
              <Zap size={16} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}

      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-500/10 border border-emerald-100">
                <DollarSign size={24} />
             </div>
             {isInstitutional ? 'Earnings Intelligence' : 'Financial Governance'}
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">
             {isInstitutional ? 'Localized Treasury Control & Escrow Verification' : 'Global Treasury Control & Secure Payout Manifest'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setIsExporting(true);
              setTimeout(() => { showToast('Financial Ledger Synchronized', 'emerald'); setIsExporting(false); }, 1000);
            }}
            disabled={isExporting}
            className="bg-white border-2 border-slate-50 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200/50 italic"
          >
             {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={18} />} 
             Generate Audit Ledger
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-primary-100 transition-all hover:bg-slate-50/50 relative overflow-hidden">
               <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-[20px] bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   {i === 0 ? <TrendingUp size={28} /> : i === 1 ? <ShieldCheck size={28} /> : i === 2 ? <BarChart3 size={28} /> : <CreditCard size={28} />}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">{s.l}</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter italic">KES {s.v}</p>
                </div>
              </div>
              <div className="text-[8px] font-black pointer-events-none text-slate-100 absolute -right-2 -bottom-2 rotate-[-15deg] group-hover:rotate-0 transition-all duration-700 opacity-20">
                 <Building2 size={100} />
              </div>
            </div>
         )) : Array(4).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-28 rounded-[40px]"></div>)}
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
              <div className="relative group w-full max-w-md">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                 <input 
                   placeholder="Index transactions / Hubs..." 
                   className="w-full bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-4 text-xs font-black placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all uppercase tracking-widest italic"
                 />
              </div>
              <div className="flex gap-2">
                 {['Verified', 'Flagged', 'Critical Risk'].map(t => (
                   <button key={t} className="px-5 py-2.5 bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all hover:bg-slate-100 italic">
                      {t}
                   </button>
                 ))}
              </div>
           </div>
           <button className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-xl shadow-emerald-500/10 border border-emerald-100 hover:scale-105 active:scale-95 transition-all">
              <PieChartIcon size={20} />
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 uppercase italic opacity-70">
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Transaction ID</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Merchant Hub</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 text-right">Yield</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Security Index</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Status</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="6" className="py-24 text-center">
                       <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto shadow-xl"></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6 italic animate-pulse">Synchronizing Treasury Data...</p>
                    </td>
                 </tr>
              )}
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-900 text-[10px] font-black shadow-sm italic translate-x-[-10px] group-hover:translate-x-0 transition-transform">
                          #
                       </div>
                       <span className="text-[11px] font-black text-slate-900 italic tracking-tighter">{t.id}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black italic shadow-lg shadow-slate-900/20">
                          {t.logo}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-700 uppercase italic opacity-80 leading-none mb-1">{t.merchant}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-none">{t.type}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className="text-sm font-black text-slate-900 tracking-tight italic">{t.amount}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-1.5">
                       {t.ai_security.anomaly ? (
                          <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 italic shadow-sm">
                             <ShieldAlert size={10} /> {t.ai_security.risk_factor}
                          </span>
                       ) : (
                          <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 italic shadow-sm">
                             <ShieldCheck size={10} /> Risk Cleared
                          </span>
                       )}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusStyles[t.status]}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'Paid' ? 'bg-emerald-500' : t.status === 'Flagged' ? 'bg-white' : 'bg-blue-500'} animate-pulse`} />
                       {t.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right relative">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all text-slate-900">
                       {!isInstitutional && (
                          <select 
                            value={t.status.toLowerCase()} 
                            onChange={(e) => handleGovernanceRequest(t.internal_id, e.target.value)}
                            className="bg-white border-2 border-slate-50 rounded-xl px-2 py-1.5 text-[10px] font-black text-slate-500 outline-none transition-all cursor-pointer hover:border-emerald-100 focus:border-emerald-500 uppercase italic shadow-sm"
                          >
                             <option value="pending">Pending</option>
                             <option value="completed">Complete Payout</option>
                             <option value="flagged">Flag Transaction</option>
                             <option value="refunded">Refund Client</option>
                          </select>
                       )}
                       <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-xl shadow-slate-200/50">
                          {isInstitutional ? <Download size={16} /> : <MoreVertical size={16} />}
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && !loading && (
                 <tr>
                    <td colSpan="6" className="py-24 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center text-slate-100 shadow-inner">
                             <CreditCard size={48} />
                          </div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic opacity-40">Financial Ledger Empty: No Synchronized Payouts</p>
                       </div>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */ }
        <div className="p-8 bg-slate-50/20 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">
             {pagination ? `${pagination.from || 0}-${pagination.to || 0} of ${pagination.total} Financial Nodes Indexed` : 'Synchronizing Metadata...'}
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
                        className={`w-10 h-10 rounded-xl text-[10px] font-black shadow-xl transition-all ${n === currentPage ? 'bg-emerald-600 text-white shadow-emerald-900/40' : 'bg-white text-slate-600 border-2 border-slate-50 hover:bg-slate-50 hover:border-slate-100'}`}
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
                className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto flex flex-col"
              >
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm shadow-slate-100/30">
                    <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-[24px] shadow-xl ${actionType === 'completed' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 shadow-rose-500/10'}`}>
                          <ShieldAlert size={28} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Treasury Governance</p>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize italic">{actionType.replace('_', ' ')} AUTHORIZATION</h2>
                       </div>
                    </div>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 transition-all">
                       <X size={28} />
                    </button>
                 </div>

                 <div className="p-10 space-y-10 flex-1">
                    <div className="p-8 bg-slate-50 rounded-[44px] border border-slate-100 space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100">
                             <Mail size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic leading-none mb-1">Financial Communication</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60 italic leading-none">Select Treasury Dispatch Protocol</p>
                          </div>
                       </div>
                       <select 
                         value={selectedTemplateId}
                         onChange={(e) => setSelectedTemplateId(e.target.value)}
                         className="w-full bg-white border-2 border-slate-100 rounded-[20px] px-6 py-4 text-[11px] font-black text-slate-600 outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-xl shadow-slate-200/50 uppercase tracking-[0.1em] italic"
                       >
                          <option value="">Awaiting Financial Protocol...</option>
                          {adminTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                       </select>
                       
                       {selectedTemplateId && adminTemplates.find(t => t.id === Number(selectedTemplateId)) && (
                         <div className="mt-6 p-6 bg-white rounded-[28px] border border-emerald-50 animate-in fade-in zoom-in-95 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                               <ShieldCheck size={14} className="text-emerald-500" />
                               <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic leading-none">Draft Protocol Preview</p>
                            </div>
                            <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed italic font-medium opacity-80">{adminTemplates.find(t => t.id === Number(selectedTemplateId)).body}</p>
                         </div>
                       )}
                    </div>

                    <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-start gap-5">
                       <Zap size={24} className="text-blue-600 shrink-0 mt-1 shadow-sm" />
                       <div>
                          <p className="text-[12px] font-black text-blue-900 uppercase tracking-widest mb-1.5 italic leading-none">Anti-Fraud Compliance Module</p>
                          <p className="text-[10px] text-blue-700 font-black leading-relaxed tracking-tight uppercase opacity-50 italic">Authorizing this state transition will immediately update the transaction ledger and dispatch an encrypted treasury notice to the merchant. This action is recorded in the live integrity mesh.</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 border-t border-slate-50 bg-white sticky bottom-0">
                    <button 
                      onClick={executeAdminAction}
                      disabled={!selectedTemplateId || loading}
                      className={`w-full py-5 rounded-[24px] text-xs font-black shadow-2xl transition-all flex items-center justify-center gap-4 ${actionType === 'completed' ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-slate-900 text-white shadow-slate-900/30'} disabled:opacity-20 disabled:grayscale hover:scale-[1.02] active:scale-95 uppercase tracking-widest italic`}
                    >
                       {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={20} />}
                       {loading ? 'Dispatching Treasury Intel...' : 'Authorize Transaction Release'}
                    </button>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-full mt-6 py-4 rounded-xl text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-[0.2em] italic">
                       Discard Financial Authorization
                    </button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
