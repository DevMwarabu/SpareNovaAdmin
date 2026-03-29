import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Percent, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye,
  Calendar,
  Tag,
  Layout,
  TrendingUp,
  BarChart3,
  Loader2,
  ChevronDown,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Store,
  Zap,
  Mail,
  ShieldAlert,
  ArrowRight,
  Target,
  Activity,
  Award
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
  LineChart,
  Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Offers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [offerType, setOfferType] = useState('any');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Governance States
  const [isAdminActionOpen, setIsAdminActionOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve', 'reject', 'expire'
  const [targetPromoId, setTargetPromoId] = useState(null);
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'percentage',
    discount_value: '',
    discount_type: 'percentage',
    placement: 'General',
    starts_at: '',
    ends_at: '',
    image: null
  });

  const API_BASE = 'http://localhost:8003/api/v1';

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/promotions`, {
        params: { 
          search: searchTerm, 
          status: filterStatus, 
          type: offerType,
          date_range: dateRange,
          page: currentPage, 
          per_page: 8 
        }
      });
      if (res.data.success) {
        setPromotions(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.chartData) setChartData(res.data.chartData);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch promotions:`, err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/promotions/templates`);
      if (res.data.success) {
        setAdminTemplates(res.data.data);
      }
    } catch (err) {
      console.error("Template fetch failure:", err);
    }
  };

  const openDetails = async (id) => {
    try {
      setIsDetailLoading(id);
      const res = await axios.get(`${API_BASE}/admin/promotions/${id}`);
      if (res.data.success) {
        setSelectedPromo(res.data.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(`Failed to fetch promotion details:`, err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTemplates();
  }, [searchTerm, filterStatus, offerType, dateRange, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, offerType, dateRange]);

  const handleGovernanceRequest = (id, type) => {
    setTargetPromoId(id);
    setActionType(type);
    setIsAdminActionOpen(true);
  };

  const executeAdminAction = async () => {
    try {
      setLoading(true);
      const statusMap = { 'approve': 'active', 'reject': 'rejected', 'expire': 'expired' };
      const res = await axios.put(`${API_BASE}/admin/promotions/${targetPromoId}/status`, {
        status: statusMap[actionType],
        template_id: selectedTemplateId
      });
      
      if (res.data.success) {
        setIsAdminActionOpen(false);
        showToast(`Promotion status updated and vendor notified.`, 'success');
        fetchData();
        if (selectedPromo && selectedPromo.id === targetPromoId) {
           setIsModalOpen(false);
        }
      }
    } catch (err) {
      showToast('Governance dispatch failed', 'danger');
    } finally {
      setLoading(false);
      setSelectedTemplateId('');
    }
  };

  const statusStyles = {
    'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Pending': 'bg-orange-50 text-orange-600 border-orange-100',
    'Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
    'Expired': 'bg-slate-100 text-slate-500 border-slate-200'
  };

  // Performance Sparkline (Simulated for visualization)
  const PerformanceSparkline = ({ color = '#4f46e5' }) => (
    <div className="w-16 h-8 opacity-60">
       <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[4, 5, 8, 6, 9, 11, 10, 14].map(v => ({ v }))}>
             <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
       </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      {/* Toast System */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${toast.type === 'danger' ? 'bg-rose-500 shadow-rose-500/30' : 'bg-primary-500 shadow-primary-500/30'} shadow-xl`}>
              <Zap size={16} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-primary-50 text-primary-600 shadow-xl shadow-primary-500/10 border border-primary-100">
                <Percent size={24} />
             </div>
             Yield Generation
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60 italic">Strategic Marketing Governance & Performance Hub</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 hover:scale-[1.05] transition-all flex items-center gap-3 italic border-t border-white/10 active:scale-95 z-10"
        >
           <Plus size={18} /> New Performance Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-primary-100 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   {i === 0 ? <Target size={28} /> : i === 1 ? <ShieldCheck size={28} /> : <Activity size={28} />}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                     <TrendingUp size={18} className="text-primary-600" /> Promotion Velocity
                  </h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60 italic">Strategic Yield Creation Aggregator</p>
               </div>
            </div>
            <div className="h-64 w-full text-indigo-600">
               <ResponsiveContainer width="100%" height={256}>
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                     <YAxis hide />
                     <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                             return (
                                <div className="bg-white/95 backdrop-blur-xl border border-white shadow-2xl p-5 rounded-[24px] shadow-primary-500/10 animate-in fade-in zoom-in-95 duration-300 italic uppercase">
                                   <p className="text-[10px] font-black text-slate-400 mb-2 tracking-widest leading-none border-b border-slate-50 pb-2 italic">{label}</p>
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                                      <p className="text-sm font-black text-slate-900 tracking-tighter italic">
                                         {payload[0].value} <span className="text-[10px] text-slate-400 ml-1">DEPLOYMENTS</span>
                                      </p>
                                   </div>
                                </div>
                             );
                          }
                          return null;
                        }}
                     />
                     <Area type="monotone" dataKey="count" stroke="var(--primary-500)" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-slate-900 p-10 rounded-[56px] shadow-2xl shadow-indigo-900/10">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                     <BarChart3 size={18} className="text-emerald-400" /> Performance Yield AI
                  </h3>
               <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 opacity-60 italic">Simulated Incremental Conversion Pulse</p>
               </div>
            </div>
            <div className="h-64 w-full relative z-10">
               <ResponsiveContainer width="100%" height={256}>
                  <BarChart data={chartData}>
                     <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} dy={10} />
                     <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                             return (
                                <div className="bg-white/95 backdrop-blur-xl border border-white shadow-2xl p-5 rounded-[24px] shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-300 italic uppercase">
                                   <p className="text-[10px] font-black text-slate-400 mb-2 tracking-widest leading-none border-b border-slate-50 pb-2 italic">{label}</p>
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                      <p className="text-sm font-black text-slate-900 tracking-tighter italic">
                                         <span className="text-[10px] text-emerald-600 mr-1">KES</span>
                                         {payload[0].value.toLocaleString()}
                                      </p>
                                   </div>
                                </div>
                             );
                          }
                          return null;
                        }}
                     />
                     <Bar dataKey="revenue_impact" radius={[12, 12, 0, 0]}>
                        {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#34d399'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-10 border-b border-slate-50 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                <input 
                  placeholder="Index promotion protocol..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-4 text-xs font-black placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all uppercase tracking-widest italic"
                />
              </div>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setShowFilters(!showFilters)}
                   className={`px-8 py-3.5 rounded-[20px] transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest italic ${showFilters ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30' : 'bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-100 shadow-sm'}`}
                 >
                   <Filter size={18} />
                   {showFilters ? 'CONSOLIDATE Protocol' : 'Expansion Protocol'}
                 </button>
              </div>
            </div>

            <AnimatePresence>
               {showFilters && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-50"
                 >
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic ml-1">Lifecycle State</label>
                       <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-[20px] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic shadow-sm outline-none focus:border-primary-100 transition-all">
                          <option value="All Status">Any Pulse</option>
                          <option value="active">Active Stream</option>
                          <option value="pending">Awaiting Review</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic ml-1">Channel Logic</label>
                       <select value={offerType} onChange={(e) => setOfferType(e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-[20px] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic shadow-sm outline-none focus:border-primary-100 transition-all">
                          <option value="any">General Yield</option>
                          <option value="percentage">Conversion %</option>
                          <option value="flash_sale">Flash Pulse</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic ml-1">Time Node</label>
                       <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-[20px] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic shadow-sm outline-none focus:border-primary-100 transition-all">
                          <option value="all">Unlimited Cycle</option>
                          <option value="7d">7D Pulse</option>
                          <option value="30d">30D Pulse</option>
                       </select>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 uppercase italic opacity-70">
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Offer Manifest</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 w-32 text-center uppercase">Performance</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Merchant Hub</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Protocol State</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 text-right uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto shadow-xl"></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6 italic animate-pulse">Synchronizing Marketing Mesh...</p>
                    </td>
                 </tr>
              )}
              {promotions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-[28px] bg-slate-50 overflow-hidden border border-slate-100 shadow-inner group-hover:scale-110 transition-transform flex-shrink-0">
                          {p.image ? (
                             <img src={p.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-200">
                                <Layout size={24} />
                             </div>
                          )}
                       </div>
                       <div>
                          <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">{p.title}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic line-clamp-1">{p.subtitle}</p>
                          <div className="flex gap-2 mt-2">
                             <span className="text-[8px] font-black text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100/50">{p.discount} OFF</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{p.placement}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                     <div className="flex flex-col items-center gap-1">
                        <PerformanceSparkline color={p.status === 'active' ? '#10b981' : '#f59e0b'} />
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Forecast Pulse</span>
                     </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-1.5">
                       <span className="text-[11px] font-black text-slate-700 uppercase italic leading-none">{p.store}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic opacity-60 italic">{p.product !== 'N/A' ? p.product : 'General Hub Offer'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusStyles[p.status.charAt(0).toUpperCase() + p.status.slice(1)] || 'bg-slate-50 text-slate-400'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse`} />
                       {p.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right relative">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                       <select 
                         value={p.status.toLowerCase()} 
                         onChange={(e) => handleGovernanceRequest(p.id, e.target.value === 'active' ? 'approve' : e.target.value)}
                         className="bg-white border-2 border-slate-50 rounded-xl px-2 py-1.5 text-[10px] font-black text-slate-500 outline-none transition-all cursor-pointer hover:border-primary-100 focus:border-primary-100 uppercase italic shadow-sm"
                       >
                          <option value="pending">Pending</option>
                          <option value="active">Approve</option>
                          <option value="rejected">Reject</option>
                          <option value="expired">Expire</option>
                       </select>
                       <button onClick={() => openDetails(p.id)} disabled={isDetailLoading === p.id} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all shadow-xl shadow-slate-200/50">
                          {isDetailLoading === p.id ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} />}
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 bg-slate-50/20 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60 italic">
             {pagination ? `${pagination.from || 0}-${pagination.to || 0} of ${pagination.total} Marketing Protocols Indexed` : 'Synchronizing Metadata...'}
           </p>
           {pagination && pagination.last_page > 1 && (
             <div className="flex gap-2">
               {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const n = startPage + i;
                  if (n > pagination.last_page) return null;
                  return (
                    <button key={n} onClick={() => setCurrentPage(n)} className={`w-10 h-10 rounded-xl text-[10px] font-black shadow-xl transition-all ${n === currentPage ? 'bg-primary-600 text-white shadow-primary-900/40' : 'bg-white text-slate-600 border-2 border-slate-50 hover:bg-slate-50 hover:border-slate-100'}`}>{n}</button>
                  );
               })}
             </div>
           )}
        </div>
      </div>

      {/* Detail Modal with Pulse Visualization */}
      <AnimatePresence>
        {isModalOpen && selectedPromo && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md px-10">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="bg-white rounded-[60px] w-full max-w-5xl overflow-hidden shadow-2xl relative flex flex-col border border-white">
                 <div className="p-10 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 rounded-[32px] bg-primary-50 text-primary-600 flex items-center justify-center border-2 border-white shadow-xl shadow-primary-500/10">
                          <Tag size={40} />
                       </div>
                       <div>
                          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2 italic uppercase">{selectedPromo.title}</h2>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 italic">Market Index: {selectedPromo.date}</span>
                             <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm ${statusStyles[selectedPromo.status.charAt(0).toUpperCase() + selectedPromo.status.slice(1)] || 'bg-slate-50'}`}>{selectedPromo.status}</span>
                          </div>
                       </div>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 bg-slate-50 hover:bg-slate-100 rounded-[24px] text-slate-400 flex items-center justify-center transition-all shadow-inner active:scale-95"><X size={32} /></button>
                 </div>

                 <div className="flex-1 overflow-y-auto px-10 pb-10 max-h-[70vh] custom-scrollbar uppercase italic">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col justify-between">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Configuration Hub</p>
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                                <span className="text-[11px] font-black text-slate-700">MODIFIER: {selectedPromo.discount_config.value}{selectedPromo.discount_config.type === 'percentage' ? '%' : ' KES'}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[11px] font-black text-slate-700">STRATEGY: {selectedPromo.type.replace('_', ' ')}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                <span className="text-[11px] font-black text-slate-700">PLACEMENT: {selectedPromo.placement}</span>
                             </div>
                          </div>
                       </div>

                       <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 flex flex-col justify-between relative overflow-hidden group">
                          <div className="absolute -right-4 -bottom-4 opacity-5 text-emerald-900 rotate-[-15deg] group-hover:rotate-0 transition-all duration-700">
                             <Award size={120} />
                          </div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6 italic">Performance Yield Forecast</p>
                          <div>
                             <div className="flex items-end gap-2 mb-1">
                                <p className="text-4xl font-black italic tracking-tighter text-emerald-600">{selectedPromo.ai_engine.conversion_lift}</p>
                                <p className="text-[10px] font-black uppercase text-emerald-400 mb-1.5">Potential Hub Lift</p>
                             </div>
                             <div className="flex items-center gap-2 mt-2">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <p className="text-[8px] font-black uppercase italic tracking-widest text-emerald-500/60">{selectedPromo.ai_engine.confidence} CONFIDENCE PROTOCOL</p>
                             </div>
                          </div>
                       </div>

                       <div className="p-8 bg-slate-900 rounded-[40px] shadow-2xl shadow-indigo-900/20 flex flex-col justify-between">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6 italic">Mediation Reasoning</p>
                          <p className="text-[10px] font-black text-indigo-300 lowercase leading-relaxed italic opacity-80">"{selectedPromo.ai_engine.reasoning}"</p>
                       </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                       <div className="lg:col-span-8 space-y-6">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 italic">
                             <Activity size={16} className="text-primary-500" /> Strategic Intelligence Canvas
                          </p>
                          <div className="bg-white border border-slate-100 rounded-[44px] shadow-xl shadow-slate-200/50 p-10 h-72 w-full">
                             <ResponsiveContainer width="100%" height={288}>
                                <LineChart data={[2, 6, 8, 12, 10, 18, 14, 22].map(v => ({ v }))}>
                                   <Line type="monotone" dataKey="v" stroke="#4f46e5" strokeWidth={5} dot={false} />
                                   <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '900', backgroundColor: 'white', color: '#1e293b' }} />
                                </LineChart>
                             </ResponsiveContainer>
                          </div>
                       </div>
                       <div className="lg:col-span-4 space-y-6">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 italic">
                             <Store size={16} className="text-orange-500" /> Anchor Node
                          </p>
                          <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[44px] h-full flex flex-col justify-center gap-4">
                             <div className="flex flex-col gap-2">
                                <p className="text-2xl font-black text-indigo-900 tracking-tighter italic uppercase underline underline-offset-8 decoration-4 decoration-indigo-200">{selectedPromo.store}</p>
                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic mt-2">Verified Enterprise Hub</p>
                             </div>
                             <div className="pt-4 border-t border-indigo-100/50 flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-[10px] font-black text-indigo-700 italic">
                                   <Zap size={14} className="text-indigo-400" /> CATEGORY LEADER
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black text-indigo-700 italic">
                                   <Award size={14} className="text-indigo-400" /> PREMIUM AUTHORIZATION
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 bg-slate-50/50 border-t border-slate-50 flex gap-4 uppercase italic">
                    {selectedPromo.status.toLowerCase() === 'pending' && (
                       <button onClick={() => handleGovernanceRequest(selectedPromo.id, 'approve')} className="flex-[2] bg-emerald-600 text-white py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 italic">
                          <ShieldCheck size={20} /> Authorize Promotion Pipeline
                       </button>
                    )}
                    <button onClick={() => handleGovernanceRequest(selectedPromo.id, selectedPromo.status === 'active' ? 'expire' : 'reject')} className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 italic">
                       {selectedPromo.status === 'active' ? <ShieldAlert size={20} /> : <XCircle size={20} />}
                       {selectedPromo.status === 'active' ? 'Terminate Pulse' : 'Rescind Claim'}
                    </button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Admin Action Drawer / Sidebar remains similar but with industrial classes */}
      <AnimatePresence>
        {isAdminActionOpen && (
           <div className="fixed inset-0 z-[200] flex justify-end bg-slate-900/40 backdrop-blur-sm">
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto flex flex-col uppercase italic">
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm shadow-slate-100/30">
                    <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-[24px] shadow-xl ${actionType === 'approve' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 shadow-rose-500/10'}`}>
                          <ShieldCheck size={28} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Yield Governance</p>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize italic">{actionType} AUTHORIZATION</h2>
                       </div>
                    </div>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 transition-all"><X size={28} /></button>
                 </div>

                 <div className="p-10 space-y-10 flex-1">
                    <div className="p-8 bg-slate-50 rounded-[44px] border border-slate-100 space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-500 shadow-sm border border-slate-100">
                             <Mail size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic leading-none mb-1">Partner Communication</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60 italic leading-none">Select Engagement Protocol</p>
                          </div>
                       </div>
                       <select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-[20px] px-6 py-4 text-[11px] font-black text-slate-600 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all shadow-xl shadow-slate-200/50 uppercase tracking-[0.1em] italic">
                          <option value="">Awaiting Yield Protocol...</option>
                          {adminTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                       </select>
                       
                       {selectedTemplateId && adminTemplates.find(t => t.id === Number(selectedTemplateId)) && (
                         <div className="mt-6 p-6 bg-white rounded-[28px] border border-primary-50 animate-in fade-in zoom-in-95 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                               <ShieldCheck size={14} className="text-primary-500" />
                               <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest italic leading-none">Draft Dispatch Preview</p>
                            </div>
                            <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed italic font-medium opacity-80">{adminTemplates.find(t => t.id === Number(selectedTemplateId)).body}</p>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="p-10 border-t border-slate-50 bg-white sticky bottom-0">
                    <button onClick={executeAdminAction} disabled={!selectedTemplateId || loading} className={`w-full py-5 rounded-[24px] text-xs font-black shadow-2xl transition-all flex items-center justify-center gap-4 ${actionType === 'approve' ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-slate-900 text-white shadow-slate-900/30'} disabled:opacity-20 disabled:grayscale hover:scale-[1.02] active:scale-95 uppercase tracking-widest italic`}>
                       {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={20} />}
                       {loading ? 'Dispatching Intelligence...' : 'Authorize Marketing Pulse'}
                    </button>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-full mt-6 py-4 rounded-xl text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-[0.2em] italic">Discard Authorization</button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
      {/* New Performance Protocol Drawer */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="bg-white w-full max-w-xl h-full shadow-2xl overflow-y-auto flex flex-col"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-[28px] bg-primary-50 text-primary-600 shadow-xl shadow-primary-500/10 border border-primary-100">
                    <Zap size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Tactical Deployment</p>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase leading-none">New Performance Protocol</h2>
                  </div>
                </div>
                <button onClick={() => setIsCreateOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 transition-all active:scale-95">
                  <X size={28} />
                </button>
              </div>

              <div className="p-10 space-y-12 flex-1 pb-32">
                {/* Protocol Identity */}
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 italic">
                    <Layout size={14} className="text-primary-500" /> Identity Assignment
                  </p>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block italic">Protocol Designation (Title)</label>
                      <input 
                        type="text"
                        placeholder="e.g. Easter Maintenance Sunder"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-6 py-4 text-xs font-black text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all shadow-inner italic"
                      />
                    </div>
                    <div className="group">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block italic">Strategic Narrative (Subtitle)</label>
                      <textarea 
                        rows="3"
                        placeholder="Communication brief for merchants and users..."
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] px-6 py-4 text-xs font-black text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all shadow-inner italic resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Configuration Matrix */}
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 italic">
                    <Target size={14} className="text-primary-500" /> Yield Matrix configuration
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Discount Vector</label>
                       <div className="flex gap-2">
                          <button className="flex-1 py-3 bg-white rounded-xl text-[10px] font-black text-primary-600 border border-primary-100 shadow-sm shadow-primary-500/5">PERCENT %</button>
                          <button className="flex-1 py-3 bg-slate-100/50 rounded-xl text-[10px] font-black text-slate-400">FIXED KES</button>
                       </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Yield Magnitude</label>
                       <div className="relative">
                          <input 
                            type="number"
                            placeholder="0"
                            className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-black text-slate-900 outline-none shadow-sm"
                          />
                          <Tag size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Deployment Parameters */}
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 italic">
                    <Calendar size={14} className="text-primary-500" /> Temporal Deployment
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block italic">Mission Start (Date)</label>
                      <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 outline-none shadow-inner" />
                    </div>
                    <div className="group">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block italic">Mission End (Date)</label>
                      <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 outline-none shadow-inner" />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-emerald-50/50 rounded-[44px] border border-emerald-100 flex items-start gap-4 shadow-inner">
                   <ShieldCheck size={24} className="text-emerald-600 shrink-0 mt-1" />
                   <div>
                      <p className="text-[11px] font-black text-emerald-900 uppercase tracking-widest mb-1 italic">Protocol Integrity Verified</p>
                      <p className="text-[9px] text-emerald-700 font-black leading-tight uppercase opacity-60 italic">Standard yield governance applies. All merchants under this protocol will be notified via the primary communication tunnel.</p>
                   </div>
                </div>
              </div>

              <div className="p-10 border-t border-slate-50 bg-white/80 backdrop-blur-md sticky bottom-0">
                <button 
                  onClick={() => setIsCreateOpen(false)}
                  className="w-full py-5 bg-primary-600 text-white rounded-[28px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 italic"
                >
                  <Zap size={20} /> Deploy Performance Protocol
                </button>
                <button 
                  onClick={() => setIsCreateOpen(false)}
                  className="w-full mt-6 py-4 text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-[0.2em] italic"
                >
                  Discard Initiation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Offers;
