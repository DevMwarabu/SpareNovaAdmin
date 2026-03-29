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
  Store
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
  Cell
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
  }, [searchTerm, filterStatus, offerType, dateRange, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, offerType, dateRange]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/admin/promotions/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchData();
        if (selectedPromo && selectedPromo.id === id) {
          openDetails(id);
        }
      }
    } catch (err) {
      console.error(`Failed to update status for promotion ${id}:`, err);
    }
  };

  const statusStyles = {
    'Active': 'bg-emerald-50 text-emerald-600',
    'Pending': 'bg-orange-50 text-orange-600',
    'Rejected': 'bg-red-50 text-red-600',
    'Expired': 'bg-slate-100 text-slate-500'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
                <Percent size={24} />
             </div>
             Offers & Promotions
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage marketplace flash sales, featured banners, and vendor discounts.</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-slate-900/20 hover:bg-slate-800 flex items-center gap-2 transition-all active:scale-95"
        >
           <Plus size={16} /> Create System Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-primary-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                   {i === 0 ? <Tag size={24} /> : i === 1 ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.l}</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{s.v}</p>
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                {s.c}
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-3xl"></div>)}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Offer Velocity</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Creation Trend (30D)</p>
            </div>
            <div className={`p-2 rounded-lg bg-primary-50 text-primary-600`}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: '900',
                    textTransform: 'uppercase'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--primary-500)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Market Impact</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Simulated Conversion Lift</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: '900'
                  }} 
                />
                <Bar dataKey="revenue_impact" fill="var(--primary-500)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col gap-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                <input 
                  placeholder="Search promotion title or store..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest ${showFilters ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                >
                  <Filter size={18} />
                  {showFilters ? 'Hide Filters' : 'Advanced Filters'}
                </button>
              </div>
           </div>

           {/* Filter Bar Expansion */}
           {showFilters && (
             <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-50"
             >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
                  >
                    <option value="All Status">Any Status</option>
                    <option value="active">Active Only</option>
                    <option value="pending">Pending Approval</option>
                    <option value="rejected">Rejected</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Offer Type</label>
                  <select 
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
                  >
                    <option value="any">Any Type</option>
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="flash_sale">Flash Sale</option>
                    <option value="featured">Featured Banner</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Time Range</label>
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
                  >
                    <option value="all">All Time</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="ytd">Year to Date</option>
                  </select>
                </div>
             </motion.div>
           )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Promotion Details</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Placement & Category</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Store / Product</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5">
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                 </tr>
              )}
              {promotions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                          {p.image ? (
                             <img src={p.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Layout size={20} />
                             </div>
                          )}
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 leading-none mb-1">{p.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 italic tracking-tight line-clamp-1">{p.subtitle}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-bold text-slate-700">{p.placement}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-700">{p.store}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.product !== 'N/A' ? p.product : 'General Promo'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusStyles[p.status] || 'bg-slate-50 text-slate-600'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <select 
                        value={p.status.toLowerCase()} 
                        onChange={(e) => handleStatusUpdate(p.id, e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 outline-none transition-all cursor-pointer hover:border-primary-300 focus:border-primary-500"
                      >
                         <option value="pending">Pending</option>
                         <option value="active">Approve</option>
                         <option value="rejected">Reject</option>
                         <option value="expired">Mark Expired</option>
                      </select>
                      <button 
                        onClick={() => openDetails(p.id)}
                        disabled={isDetailLoading === p.id}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      >
                         {isDetailLoading === p.id ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {promotions.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                             <Percent size={32} />
                          </div>
                          <p className="text-sm font-bold text-slate-400">No promotions or offers found.</p>
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
                        className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-primary-600 text-white shadow-primary-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                      >
                        {n}
                      </button>
                  );
               })}
             </div>
           )}
        </div>
      </div>

      {/* Promotion Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPromo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
             >
                <div className="relative h-48 bg-slate-100">
                   {selectedPromo.image ? (
                      <img src={selectedPromo.image} className="w-full h-full object-cover" alt="" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                         <Layout size={48} />
                      </div>
                   )}
                   <button 
                     onClick={() => setIsModalOpen(false)}
                     className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-lg hover:bg-white transition-all"
                   >
                      <X size={20} />
                   </button>
                   <div className="absolute bottom-6 left-8">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${statusStyles[selectedPromo.status.charAt(0).toUpperCase() + selectedPromo.status.slice(1)] || 'bg-white text-slate-900'}`}>
                         {selectedPromo.status}
                      </div>
                   </div>
                </div>

                <div className="p-10 space-y-8">
                   <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedPromo.title}</h2>
                        <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest">{selectedPromo.subtitle}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount Engine</p>
                         <p className="text-2xl font-black text-primary-600 tracking-tighter">
                            {selectedPromo.discount_config.value}{selectedPromo.discount_config.type === 'percentage' ? '%' : ' KES'}
                         </p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                              <Store size={20} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participating Store</p>
                              <p className="text-sm font-bold text-slate-700">{selectedPromo.store}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                              <Layout size={20} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Promotion Placement</p>
                              <p className="text-sm font-bold text-slate-700 capitalize">{selectedPromo.placement}</p>
                           </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                              <Calendar size={20} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validity Period</p>
                              <p className="text-sm font-bold text-slate-700">{selectedPromo.starts_at} — {selectedPromo.ends_at}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <TrendingUp size={20} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest">AI Forecast</p>
                              <p className="text-sm font-bold text-emerald-700">+12% Conv. Lift</p>
                           </div>
                        </div>
                      </div>
                   </div>

                   <div className="p-6 bg-slate-50 rounded-3xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Description</p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                         {selectedPromo.description || "No additional internal notes provided for this promotion."}
                      </p>
                   </div>

                   <div className="flex gap-4 pt-4">
                      {selectedPromo.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(selectedPromo.id, 'active')}
                            className="flex-1 bg-primary-600 text-white py-4 rounded-2xl text-xs font-black shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                          >
                            Approve Promotion
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(selectedPromo.id, 'rejected')}
                            className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl text-xs font-black hover:bg-slate-50 active:scale-95 transition-all"
                          >
                            Reject Offer
                          </button>
                        </>
                      )}
                      {selectedPromo.status === 'active' && (
                        <button 
                          onClick={() => handleStatusUpdate(selectedPromo.id, 'expired')}
                          className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-xs font-black shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          Deactivate Early
                        </button>
                      )}
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-all"
                      >
                         <ChevronDown size={24} />
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Promotion Drawer */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto"
             >
                <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                   <div>
                     <h2 className="text-xl font-black text-slate-900">Create System Offer</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure global platform promotion</p>
                   </div>
                   <button 
                     onClick={() => setIsCreateOpen(false)}
                     className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                   >
                      <X size={20} />
                   </button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setIsSubmitting(true);
                    const data = new FormData();
                    Object.keys(formData).forEach(key => {
                      if (formData[key] !== null) data.append(key, formData[key]);
                    });
                    
                    const res = await axios.post(`${API_BASE}/admin/promotions`, data, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    
                    if (res.data.success) {
                      setIsCreateOpen(false);
                      fetchData();
                      setFormData({
                        title: '', subtitle: '', type: 'percentage', discount_value: '',
                        discount_type: 'percentage', placement: 'General', starts_at: '', ends_at: '', image: null
                      });
                    }
                  } catch (err) {
                    console.error("Failed to create offer:", err);
                  } finally {
                    setIsSubmitting(false);
                  }
                }} className="p-8 space-y-6">
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Promotion Image</label>
                        <div className="relative h-40 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-2 group hover:border-primary-200 transition-all overflow-hidden text-center p-4">
                           {formData.image ? (
                              <>
                                <img src={URL.createObjectURL(formData.image)} className="w-full h-full object-cover" alt="" />
                                <button 
                                  type="button"
                                  onClick={() => setFormData({...formData, image: null})}
                                  className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-full text-red-500 shadow-sm"
                                >
                                   <X size={14} />
                                </button>
                              </>
                           ) : (
                              <>
                                <Layout className="text-slate-300 mx-auto" size={32} />
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Click to upload banner</p>
                              </>
                           )}
                           <input 
                             type="file" 
                             className="absolute inset-0 opacity-0 cursor-pointer" 
                             onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                           />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Offer Title</label>
                        <input 
                           required
                           value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                           placeholder="e.g. Eid Mubarak Flash Sale"
                           className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subtitle / Slogan</label>
                        <input 
                           value={formData.subtitle}
                           onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                           placeholder="e.g. Up to 50% off on all items"
                           className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Offer Type</label>
                          <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value, discount_type: e.target.value === 'fixed' ? 'fixed' : 'percentage'})}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none"
                          >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                            <option value="flash_sale">Flash Sale</option>
                            <option value="featured">Featured Banner</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Value</label>
                          <input 
                             type="number"
                             required
                             value={formData.discount_value}
                             onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                             placeholder={formData.discount_type === 'percentage' ? '%' : 'KES'}
                             className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                          <input 
                             type="date"
                             value={formData.starts_at}
                             onChange={(e) => setFormData({...formData, starts_at: e.target.value})}
                             className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black text-slate-500 outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">End Date</label>
                          <input 
                             type="date"
                             value={formData.ends_at}
                             onChange={(e) => setFormData({...formData, ends_at: e.target.value})}
                             className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black text-slate-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Placement</label>
                        <select 
                          value={formData.placement}
                          onChange={(e) => setFormData({...formData, placement: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none"
                        >
                          <option value="General">General / All</option>
                          <option value="Homepage Banner">Homepage Banner</option>
                          <option value="Sidebar Smart">Sidebar Smart</option>
                          <option value="Flash Sale Section">Flash Sale Section</option>
                        </select>
                      </div>
                   </div>

                   <button 
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full bg-primary-600 text-white py-5 rounded-2xl text-xs font-black shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                      Create System Promotion
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Offers;
