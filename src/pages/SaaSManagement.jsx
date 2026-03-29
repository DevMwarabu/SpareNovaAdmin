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
  Settings,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  PieChart as PieChartIcon,
  Crown,
  Database,
  Cpu,
  Mail,
  X,
  ChevronDown,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SaaSManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState([]);
  const [mrrGrowth, setMrrGrowth] = useState([]);
  const [tierDistribution, setTierDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All Subscriptions');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Creation States
  const [availableStores, setAvailableStores] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [newSub, setNewSub] = useState({ store_id: '', plan_id: '', duration_months: 1 });
  const [createLoading, setCreateLoading] = useState(false);

  // Governance States
  const [isAdminActionOpen, setIsAdminActionOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'active', 'expired', 'cancelled'
  const [targetSubId, setTargetSubId] = useState(null);
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const API_BASE = 'http://localhost:8003/api/v1';

  const showToast = (message, type = 'blue') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/saas`, {
        params: { status: filterStatus, page: currentPage, per_page: 8 }
      });
      if (res.data.success) {
        setSubscriptions(res.data.data);
        setStats(res.data.stats);
        setMrrGrowth(res.data.mrrGrowth);
        setTierDistribution(res.data.tierDistribution);
        setAvailableStores(res.data.available_stores || []);
        setAvailablePlans(res.data.available_plans || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch SaaS data:`, err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/email-templates`);
      if (res.data.success) {
        setAdminTemplates(res.data.data);
      }
    } catch (err) {
      console.error("Template fetch failure:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTemplates();
  }, [filterStatus, currentPage]);

  const handleGovernanceRequest = (id, type) => {
    setTargetSubId(id);
    setActionType(type);
    setIsAdminActionOpen(true);
  };

  const executeAdminAction = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_BASE}/admin/saas/${targetSubId}/status`, {
        status: actionType,
        template_id: selectedTemplateId
      });
      
      if (res.data.success) {
        setIsAdminActionOpen(false);
        showToast(`Subscription lifecycle updated and tenant notified.`, 'emerald');
        fetchData();
      }
    } catch (err) {
      showToast('Monetization Governance Dispatch failed', 'rose');
    } finally {
      setLoading(false);
      setSelectedTemplateId('');
    }
  };

  const executeCreateAction = async () => {
    try {
      setCreateLoading(true);
      const res = await axios.post(`${API_BASE}/admin/saas`, newSub);
      if (res.data.success) {
        setIsCreateDrawerOpen(false);
        showToast('Monetization Node instantiated successfully.', 'emerald');
        setNewSub({ store_id: '', plan_id: '', duration_months: 1 });
        fetchData();
      }
    } catch (err) {
      showToast('Node instantiation failed', 'rose');
    } finally {
      setCreateLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    const s = status.toLowerCase();
    if (s === 'active') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s === 'expired') return 'bg-rose-50 text-rose-600 border-rose-100';
    return 'bg-orange-50 text-orange-600 border-orange-100';
  };

  const COLORS = ['#4f46e5', '#818cf8', '#6366f1', '#4338ca'];

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
             <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 shadow-xl shadow-indigo-500/10 border border-indigo-100">
                <Layers size={24} />
             </div>
             Monetization Hub
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60 italic">Platform SaaS Revenue & Multi-Tenant Lifecycle Infrastructure</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setIsCreateDrawerOpen(true)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-3 italic">
              <Plus size={18} /> New Monetization Node
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-primary-100 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   {i === 0 ? <TrendingUp size={28} /> : i === 1 ? <Users size={28} /> : <Zap size={28} />}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">{s.l}</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter italic">{s.v}</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-xl uppercase italic">
                {s.c}
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-28 rounded-3xl"></div>)}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <TrendingUp size={18} className="text-indigo-600" /> MRR Lifecycle Growth
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60 italic">Monthly Recurring Revenue Projections</p>
               </div>
            </div>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height={256}>
                  <AreaChart data={mrrGrowth}>
                     <defs>
                        <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                     <YAxis hide />
                     <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: '900', backgroundColor: 'white', color: '#1e293b' }} />
                     <Area type="monotone" dataKey="mrr" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorMRR)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-slate-900 p-10 rounded-[56px] shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-white">
               <PieChartIcon size={140} />
            </div>
            <div className="relative z-10 flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <Globe size={18} className="text-indigo-400" /> Plan Distribution Matrix
                  </h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 italic">Enterprise vs Basic Tier Density</p>
               </div>
            </div>
            <div className="h-64 w-full relative z-10">
               <ResponsiveContainer width="100%" height={256}>
                  <PieChart>
                     <Pie
                        data={tierDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={10}
                        dataKey="value"
                     >
                        {tierDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.1)" strokeWidth={2} />
                        ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ 
                           borderRadius: '24px', 
                           border: 'none', 
                           boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.2)', 
                           fontSize: '11px', 
                           fontWeight: '900',
                           backgroundColor: 'white',
                           color: '#1e293b'
                        }} 
                     />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="relative group flex-1 max-w-md">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
             <input 
               placeholder="Index Tenant or Tier Hub..." 
               className="w-full bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-4 text-xs font-black placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all uppercase tracking-widest italic"
             />
           </div>
           <div className="flex gap-2">
             <button 
                onClick={() => setIsFilterMenuOpen(true)}
                className="bg-white border-2 border-slate-50 rounded-[20px] px-6 py-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-100 hover:text-indigo-600 transition-all italic shadow-sm"
             >
                <Filter size={16} /> 
                {filterStatus === 'All Subscriptions' ? 'All SaaS Pulsars' : filterStatus + ' Hubs'}
             </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 uppercase italic opacity-70">
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic">Tenant Node</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic text-center">Active Lifecycle</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic">Revenue Velocity</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 italic">Integrity State</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 text-right italic uppercase tracking-[0.2em]">Renewal Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto shadow-xl shadow-indigo-500/20"></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6 italic animate-pulse">Synchronizing Subscription Mesh...</p>
                    </td>
                 </tr>
              )}
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 text-indigo-600 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                          <Globe size={24} />
                       </div>
                       <div>
                          <button 
                             onClick={() => navigate(`/admin/shops?id=${sub.store_id}`)}
                             className="text-[11px] font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2 text-left hover:text-indigo-600 hover:underline decoration-indigo-500/30 underline-offset-4 transition-all block"
                          >
                             {sub.store}
                          </button>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Verified Tenant Hub</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                       <span className="text-[11px] font-black text-slate-700 uppercase italic leading-none">{sub.plan}</span>
                       <span className="text-[8px] font-black text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/50">Authoritative Tier</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-1.5">
                       <span className="text-xs font-black text-slate-900 font-mono italic">{sub.price}</span>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic leading-none opacity-60">Contracted Yield</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyles(sub.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Active' ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse`} />
                        {sub.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right relative">
                    <div className="flex flex-col gap-1 opacity-100 group-hover:opacity-0 transition-all">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">{sub.renews_at}</span>
                       <span className="text-[8px] font-black text-slate-300 uppercase italic opacity-60">{sub.days_remaining} Days to Pulse</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-end px-10 opacity-0 group-hover:opacity-100 transition-all">
                       <div className="flex items-center gap-2">
                          <select 
                             value={sub.status.toLowerCase()} 
                             onChange={(e) => handleGovernanceRequest(sub.id, e.target.value)}
                             className="bg-white border-2 border-slate-50 rounded-xl px-2 py-1.5 text-[10px] font-black text-slate-500 outline-none transition-all cursor-pointer hover:border-indigo-100 italic shadow-sm"
                          >
                             <option value="active">Authorize Pulse</option>
                             <option value="expired">Mark Expired</option>
                             <option value="cancelled">Rescind Access</option>
                          </select>
                          <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-xl shadow-slate-200/50">
                             <CreditCard size={18} />
                          </button>
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50/20 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60 italic">
             {pagination ? `${pagination.from || 0}-${pagination.to || 0} of ${pagination.total} Monetization Cycles Indexed` : 'Synchronizing Metadata...'}
           </p>
           {pagination && pagination.last_page > 1 && (
             <div className="flex gap-2">
               {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const n = startPage + i;
                  if (n > pagination.last_page) return null;
                  return (
                    <button key={n} onClick={() => setCurrentPage(n)} className={`w-10 h-10 rounded-xl text-[10px] font-black shadow-xl transition-all ${n === currentPage ? 'bg-indigo-600 text-white shadow-indigo-900/40' : 'bg-white text-slate-600 border-2 border-slate-50 hover:bg-slate-50 hover:border-slate-100'}`}>{n}</button>
                  );
               })}
             </div>
           )}
        </div>
      </div>

      {/* Monetization Governance Sidebar */}
      <AnimatePresence>
        {isAdminActionOpen && (
           <div className="fixed inset-0 z-[200] flex justify-end bg-slate-900/40 backdrop-blur-sm">
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto flex flex-col uppercase italic">
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm shadow-slate-100/30">
                    <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-[24px] shadow-xl ${actionType === 'active' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 shadow-rose-500/10'}`}>
                          <ShieldCheck size={28} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Billing Governance</p>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize italic">{actionType} AUTHORIZATION</h2>
                       </div>
                    </div>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 transition-all"><X size={28} /></button>
                 </div>

                 <div className="p-10 space-y-10 flex-1">
                    <div className="p-8 bg-slate-50 rounded-[44px] border border-slate-100 space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100">
                             <Mail size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic leading-none mb-1">Billing Dispatch</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60 italic leading-none">Select Engagement Protocol</p>
                          </div>
                       </div>
                       <select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-[20px] px-6 py-4 text-[11px] font-black text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-xl shadow-slate-200/50 uppercase tracking-[0.1em] italic">
                          <option value="">Awaiting Monetization Protocol...</option>
                          {adminTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                       </select>
                       
                       {selectedTemplateId && adminTemplates.find(t => t.id === String(selectedTemplateId)) && (
                         <div className="mt-6 p-6 bg-white rounded-[28px] border border-indigo-50 animate-in fade-in zoom-in-95 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                               <ShieldCheck size={14} className="text-indigo-500" />
                               <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest italic leading-none">Draft Dispatch Preview</p>
                            </div>
                            <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed italic font-medium opacity-80">{adminTemplates.find(t => t.id === String(selectedTemplateId)).body}</p>
                         </div>
                       )}
                    </div>

                    <div className="p-8 bg-indigo-50 rounded-[32px] border border-indigo-100 flex items-start gap-5">
                       <Zap size={24} className="text-indigo-600 shrink-0 mt-1 shadow-sm" />
                       <div>
                          <p className="text-[12px] font-black text-indigo-900 uppercase tracking-widest mb-1.5 leading-none">Monetization Policy Pulse</p>
                          <p className="text-[10px] text-indigo-700 font-black leading-relaxed tracking-tight uppercase opacity-50 italic">Authorizing this lifecycle transition will immediately synchronize the tenant's access state and dispatch a professional billing notice to the Hub owner's primary endpoint. This action is recorded in the integrity mesh.</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 border-t border-slate-50 bg-white sticky bottom-0">
                    <button onClick={executeAdminAction} disabled={!selectedTemplateId || loading} className={`w-full py-5 rounded-[24px] text-xs font-black shadow-2xl transition-all flex items-center justify-center gap-4 ${actionType === 'active' ? 'bg-indigo-600 text-white shadow-indigo-500/30' : 'bg-slate-900 text-white shadow-slate-900/30'} disabled:opacity-20 disabled:grayscale hover:scale-[1.02] active:scale-95 uppercase tracking-widest italic`}>
                       {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={20} />}
                       {loading ? 'Dispatching Protocol...' : 'Authorize Lifecycle Decision'}
                    </button>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-full mt-6 py-4 rounded-xl text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-[0.2em] italic">Discard Authorization</button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Advanced Telemetry Filter Matrix */}
      <AnimatePresence>
        {isFilterMenuOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col pt-safe">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm border border-indigo-100/50">
                        <Filter size={20} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Matrix Command</p>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none italic uppercase">SaaS Filters</h2>
                     </div>
                  </div>
                  <button onClick={() => setIsFilterMenuOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full text-slate-400 transition-all"><X size={20} /></button>
               </div>
               <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SaaS Lifecycle Phase</p>
                     <div className="grid grid-cols-1 gap-2">
                       {['All Subscriptions', 'active', 'expired', 'cancelled'].map(status => (
                         <button 
                           key={status}
                           onClick={() => { setFilterStatus(status); setCurrentPage(1); setIsFilterMenuOpen(false); }}
                           className={`p-4 rounded-2xl flex items-center justify-between text-[11px] font-black uppercase tracking-widest transition-all italic border ${filterStatus === status ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-xl shadow-indigo-500/10' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600'}`}
                         >
                           {status === 'All Subscriptions' ? 'All SaaS Pulsars' : `${status} Lifecycle`}
                           {filterStatus === status && <CheckCircle2 size={16} className="text-indigo-500" />}
                         </button>
                       ))}
                     </div>
                  </div>
               </div>
               <div className="p-8 border-t border-slate-50 bg-slate-50/50 sticky bottom-0">
                  <button onClick={() => { setFilterStatus('All Subscriptions'); setIsFilterMenuOpen(false); }} className="w-full py-4 rounded-xl text-[10px] font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-[0.2em]">Reset Matrix Parameters</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Creation Node Sidebar */}
      <AnimatePresence>
        {isCreateDrawerOpen && (
           <div className="fixed inset-0 z-[200] flex justify-end bg-slate-900/40 backdrop-blur-sm">
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto flex flex-col uppercase italic">
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm shadow-slate-100/30">
                    <div className="flex items-center gap-5">
                       <div className="p-4 rounded-[24px] shadow-xl bg-indigo-50 text-indigo-600 shadow-indigo-500/10">
                          <Crown size={28} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Node Architecture</p>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize italic">INSTANTIATE HUB</h2>
                       </div>
                    </div>
                    <button onClick={() => setIsCreateDrawerOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 transition-all"><X size={28} /></button>
                 </div>

                 <div className="p-10 space-y-10 flex-1">
                    <div className="space-y-6">
                       <div>
                           <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2 mb-3">
                              <Globe size={14} className="text-indigo-500" /> Target Tenant Hub
                           </label>
                           <select 
                              value={newSub.store_id} 
                              onChange={e => setNewSub({...newSub, store_id: e.target.value})}
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[20px] px-6 py-4 text-[11px] font-black text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all uppercase italic shadow-sm"
                           >
                              <option value="">Select Isolated Tenant...</option>
                              {availableStores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                           </select>
                       </div>

                       <div>
                           <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2 mb-3">
                              <Layers size={14} className="text-indigo-500" /> Authoritative Tier
                           </label>
                           <select 
                              value={newSub.plan_id} 
                              onChange={e => setNewSub({...newSub, plan_id: e.target.value})}
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[20px] px-6 py-4 text-[11px] font-black text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all uppercase italic shadow-sm"
                           >
                              <option value="">Select Subscription Framework...</option>
                              {availablePlans.map(p => <option key={p.id} value={p.id}>{p.name} - KES {p.price}</option>)}
                           </select>
                       </div>

                       <div>
                           <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2 mb-3">
                              <Clock size={14} className="text-indigo-500" /> Lifecycle Duration (Months)
                           </label>
                           <input 
                              type="number"
                              min="1"
                              value={newSub.duration_months} 
                              onChange={e => setNewSub({...newSub, duration_months: parseInt(e.target.value) || 1})}
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[20px] px-6 py-4 text-[11px] font-black text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all uppercase italic shadow-sm"
                           />
                       </div>
                    </div>

                    <div className="p-8 bg-indigo-50 rounded-[32px] border border-indigo-100 flex items-start gap-5">
                       <Zap size={24} className="text-indigo-600 shrink-0 mt-1 shadow-sm" />
                       <div>
                          <p className="text-[12px] font-black text-indigo-900 uppercase tracking-widest mb-1.5 leading-none">Instant Authority Transfer</p>
                          <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase opacity-50 italic">Executing this command immediately overrides the target tenant's base capabilities, unlocking all tools associated with the selected Authoritative Tier.</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 border-t border-slate-50 bg-white sticky bottom-0">
                    <button 
                       onClick={executeCreateAction} 
                       disabled={!newSub.store_id || !newSub.plan_id || createLoading} 
                       className="w-full py-5 rounded-[24px] text-xs font-black shadow-2xl transition-all flex items-center justify-center gap-4 bg-indigo-600 text-white shadow-indigo-500/30 disabled:opacity-20 disabled:grayscale hover:scale-[1.02] active:scale-95 uppercase tracking-widest italic"
                    >
                       {createLoading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={20} />}
                       {createLoading ? 'Instantiating Node...' : 'Authorize Node Instantiation'}
                    </button>
                    <button onClick={() => setIsCreateDrawerOpen(false)} className="w-full mt-6 py-4 rounded-xl text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-[0.2em] italic">Abort Instantiation</button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SaaSManagement;
