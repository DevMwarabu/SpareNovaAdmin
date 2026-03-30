import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Store, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  MapPin,
  TrendingUp,
  Download,
  Loader2,
  FileText,
  ChevronDown,
  X,
  Layers,
  BarChart3,
  Mail,
  Zap,
  ShieldAlert,
  Users,
  Clock,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MessageSquare
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

const BusinessUnitList = ({ title, type, icon: Icon, color }) => {
  const navigate = useNavigate();
  const { unitId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [docsStatus, setDocsStatus] = useState('any');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [units, setUnits] = useState([]);
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null);
  const [detailTab, setDetailTab] = useState('profile');

  // Governance States
  const [isAdminActionOpen, setIsAdminActionOpen] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [actionType, setActionType] = useState(null); // 'verify', 'suspend', 'reject'
  const [targetId, setTargetId] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const showToast = (message, type = 'blue') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/portal/${type}`, {
        params: { 
          search: searchTerm, 
          status: filterStatus, 
          docs_status: docsStatus,
          date_range: dateRange,
          page: currentPage, 
          per_page: 8 
        }
      });
      if (res.data.success) {
        setUnits(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.chartData) setChartData(res.data.chartData);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setTemplateLoading(true);
      const res = await axios.get(`${API_BASE}/portal/${type}/templates`);
      if (res.data.success) {
        setAdminTemplates(res.data.data);
      }
    } catch (err) {
      console.error("Templates fetch failed:", err);
    } finally {
      setTemplateLoading(false);
    }
  };

  const openDetails = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/portal/${type}/${id}`);
      if (res.data.success) {
        setSelectedUnit(res.data.data);
        setDetailTab('profile');
        setIsModalOpen(true);
      }
    } catch (err) {
      showToast(`Merchant lookup failure`, 'rose');
    }
  };

  useEffect(() => {
    fetchData();
    fetchTemplates();
  }, [searchTerm, filterStatus, docsStatus, dateRange, type, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, docsStatus, dateRange, type]);
  useEffect(() => {
    if (unitId) {
      openDetails(unitId);
    }
  }, [unitId, type]);

  const handleGovernanceRequest = (id, action) => {
    setTargetId(id);
    setActionType(action);
    setIsAdminActionOpen(true);
  };

  const executeAdminAction = async () => {
    try {
      setLoading(true);
      const statusMap = { 'verify': 'verified', 'suspend': 'suspended', 'reject': 'rejected' };
      const res = await axios.put(`${API_BASE}/portal/${type}/${targetId}/status`, { 
        status: statusMap[actionType],
        template_id: selectedTemplateId
      });
      if (res.data.success) {
        setIsAdminActionOpen(false);
        showToast('Governance protocol dispatched successfully', 'emerald');
        fetchData();
        if (selectedUnit && selectedUnit.id === targetId) {
           setIsModalOpen(false);
        }
      }
    } catch (err) {
      showToast('Governance failure', 'rose');
    } finally {
      setLoading(false);
      setSelectedTemplateId('');
    }
  };

  const handleExport = () => {
    if (!units.length) return;
    setIsExporting(true);
    setTimeout(() => {
       showToast('Merchant manifest exported successfully', 'emerald');
       setIsExporting(false);
    }, 1200);
  };

  const handleRegisterNew = () => {
    const mappedRole = type === 'shops' ? 'store_owner' : type === 'garages' ? 'garage_owner' : 'delivery';
    navigate(`/portal/register-partner?role=${mappedRole}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      {/* Toast System */}
      {toast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4`}>
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${toast.type}-500 shadow-lg shadow-${toast.type}-500/20`}>
              <Zap size={16} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest leading-none">{toast.message}</p>
        </div>
      )}

      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className={`p-2.5 rounded-2xl bg-${color}-50 text-${color}-600 border border-${color}-100 shadow-sm`}>
                <Icon size={24} />
             </div>
             {title}
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">Governance & Merchant Lifecycle Management</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            disabled={isExporting || units.length === 0}
            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all disabled:opacity-50"
          >
             {isExporting ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />} 
             Manifest
          </button>
          <button 
            onClick={handleRegisterNew}
            className={`bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 flex items-center gap-2 transition-all active:scale-95`}
          >
             <Plus size={16} /> Partner Registration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-primary-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   {i === 0 ? <Icon size={24} /> : i === 1 ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.l}</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tight">{s.v}</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase italic">
                {s.c}
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-3xl"></div>)}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Industrial Scale</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Network Onboarding Growth (30D)</p>
            </div>
            <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 shadow-sm shadow-${color}-500/10`}>
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
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8', textTransform: 'uppercase' }}
                  dy={10}
                />
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
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--primary-500)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Transactional Inflow</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Platform-Derived Revenue Flow</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-500/10">
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
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8', textTransform: 'uppercase' }}
                  dy={10}
                />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
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
                <Bar dataKey="revenue" fill="var(--primary-500)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50 flex flex-col gap-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <form 
                onSubmit={(e) => { e.preventDefault(); fetchData(); }}
                className="relative group flex-1 max-w-md"
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                <input 
                  placeholder={`DISCOVER ${type.toUpperCase()}...`} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-4 text-xs font-black placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all uppercase tracking-widest italic"
                />
              </form>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3.5 rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${showFilters ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                >
                  <Filter size={18} />
                  {showFilters ? 'Hide Protocols' : 'Filter Framework'}
                </button>
              </div>
           </div>

           {/* Filter Bar Expansion */}
           <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50"
              >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Merchant Status</label>
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                    >
                      <option value="All Status">Any Status</option>
                      <option value="verified">Verified Hubs</option>
                      <option value="pending">Awaiting Governance</option>
                      <option value="suspended">Suspended Protocols</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Documentation</label>
                    <select 
                      value={docsStatus}
                      onChange={(e) => setDocsStatus(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                    >
                      <option value="any">Document Coverage</option>
                      <option value="verified">Verified Compliance</option>
                      <option value="missing">Data Gaps</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Lifespan Range</label>
                    <select 
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                    >
                      <option value="all">Full Lifecycle</option>
                      <option value="7d">Last 7 Cycles</option>
                      <option value="30d">Last 30 Cycles</option>
                      <option value="ytd">Year to Date</option>
                    </select>
                  </div>
              </motion.div>
            )}
           </AnimatePresence>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Merchant Identity</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Communication Hub</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Deployment</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Status</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-right">Yield (MTD)</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="6">
                       <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex items-center justify-center">
                          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                       </div>
                    </td>
                 </tr>
              )}
              {units.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => openDetails(u.id)}>
                      <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-50 flex items-center justify-center text-slate-900 font-black shadow-xl shadow-slate-200/50 group-hover:scale-110 group-hover:border-primary-100 transition-all italic text-lg">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1.5 group-hover:text-primary-600 transition-colors uppercase tracking-tight italic">{u.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1.5 opacity-60">
                           <Clock size={10} /> {u.joinDate}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-1.5">
                       <span className="text-[11px] font-black text-slate-700 uppercase italic leading-none">{u.owner}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter opacity-70 leading-none">{u.email}</span>
                       <div className="mt-1">
                          {u.has_docs ? (
                             <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50 shadow-sm"><ShieldCheck size={10} /> Compliance Valid</span>
                          ) : (
                             <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100/50 shadow-sm"><AlertCircle size={10} /> Data Gap</span>
                          )}
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase italic">
                       <MapPin size={14} className="text-primary-400" />
                       {u.location}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                       u.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                       u.status === 'pending' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'verified' ? 'bg-emerald-500' : u.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'} animate-pulse`} />
                       {u.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                     <p className="text-sm font-black text-slate-900 tracking-tight italic">{type === 'logistics' ? '' : 'KES '} {u.revenue}</p>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-50 mt-0.5">Performance</p>
                  </td>
                  <td className="px-10 py-6 text-right relative">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <select 
                        value={u.status.toLowerCase()} 
                        onChange={(e) => handleGovernanceRequest(u.id, e.target.value === 'verified' ? 'verify' : e.target.value)}
                        className="bg-white border-2 border-slate-50 rounded-xl px-3 py-1.5 text-[10px] font-black text-slate-500 outline-none transition-all cursor-pointer hover:border-primary-100 focus:border-primary-300 uppercase shadow-sm"
                      >
                         <option value="pending">Pending</option>
                         <option value="verified">Approve</option>
                         <option value="suspended">Suspend</option>
                         <option value="rejected">Terminate</option>
                      </select>
                      <button 
                        onClick={() => openDetails(u.id)}
                        className="p-2.5 bg-white shadow-xl shadow-slate-200/50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 border border-slate-100 rounded-xl transition-all hover:scale-110 active:scale-90"
                      >
                         <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {units.length === 0 && !loading && (
                 <tr>
                    <td colSpan="6" className="px-10 py-24 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className={`w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-200 shadow-inner`}>
                             <Icon size={40} />
                          </div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic leading-none">System Catalog Empty</p>
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
             {pagination ? `${pagination.from || 0}-${pagination.to || 0} of ${pagination.total} Verified Hubs Indexed` : 'Teletransmission...'}
           </p>
           {pagination && pagination.last_page > 1 && (
             <div className="flex gap-2">
               {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(n => (
                 <button 
                    key={n} 
                    onClick={() => setCurrentPage(n)}
                    className={`w-10 h-10 rounded-xl text-[10px] font-black shadow-xl transition-all ${n === currentPage ? 'bg-primary-600 text-white shadow-primary-500/20' : 'bg-white text-slate-600 border-2 border-slate-50 hover:bg-slate-50 hover:border-slate-100'}`}
                  >
                    {n}
                  </button>
               ))}
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
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm shadow-slate-100/50">
                    <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-[24px] shadow-xl ${actionType === 'verify' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 shadow-rose-500/10'}`}>
                          <ShieldAlert size={28} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Governance Protocol</p>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize">{actionType} Partner Hub</h2>
                       </div>
                    </div>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 transition-all">
                       <X size={28} />
                    </button>
                 </div>

                 <div className="p-10 space-y-10 flex-1">
                    <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-500 shadow-sm border border-slate-100">
                             <Mail size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Communication Hub</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Select Dispatch Protocol</p>
                          </div>
                       </div>
                       <select 
                         value={selectedTemplateId}
                         onChange={(e) => setSelectedTemplateId(e.target.value)}
                         className="w-full bg-white border-2 border-slate-100 rounded-[20px] px-6 py-4 text-xs font-black text-slate-600 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all shadow-xl shadow-slate-200/50 uppercase tracking-widest"
                       >
                          <option value="">System: Awaiting Template...</option>
                          {adminTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                       </select>
                       
                       {selectedTemplateId && adminTemplates.find(t => t.id === Number(selectedTemplateId)) && (
                         <div className="mt-6 p-6 bg-white rounded-[24px] border border-blue-50 animate-in fade-in zoom-in-95 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                               <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                                  <FileText size={16} />
                               </div>
                               <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Protocol Sandbox Preview</p>
                            </div>
                            <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed italic font-medium opacity-80">{adminTemplates.find(t => t.id === Number(selectedTemplateId)).body}</p>
                         </div>
                       )}
                    </div>

                    <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-start gap-5">
                       <Zap size={24} className="text-blue-600 shrink-0 mt-1" />
                       <div>
                          <p className="text-[12px] font-black text-blue-900 uppercase tracking-widest mb-1.5 italic">Industrial Transparency Requirement</p>
                          <p className="text-[10px] text-blue-700 font-black leading-relaxed tracking-tight uppercase opacity-60">Authorize system state machine transition. This action triggers multi-endpoint telemetry and dispatch of encrypted notification protocols to the identified partner.</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 border-t border-slate-50 bg-white sticky bottom-0 shadow-2xl">
                    <button 
                      onClick={executeAdminAction}
                      disabled={!selectedTemplateId || loading}
                      className={`w-full py-5 rounded-[24px] text-xs font-black shadow-2xl transition-all flex items-center justify-center gap-4 ${actionType === 'verify' ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-slate-900 text-white shadow-slate-900/30'} disabled:opacity-20 disabled:grayscale hover:scale-[1.02] active:scale-95 uppercase tracking-widest`}
                    >
                       {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={20} />}
                       {loading ? 'Dispatching Intelligence...' : 'Authorize HUB State Transition'}
                    </button>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-full mt-6 py-4 rounded-xl text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-[0.2em] italic">
                       Discard Governance Request
                    </button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Merchant Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedUnit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500 px-8">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="bg-white rounded-[60px] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col border border-white"
             >
                {/* Modal Header */}
                <div className="p-10 pb-6 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className={`w-20 h-20 rounded-[32px] bg-${color}-50 text-${color}-600 flex items-center justify-center border-2 border-white shadow-xl shadow-${color}-500/10`}>
                         <Icon size={40} />
                      </div>
                      <div>
                         <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2 italic uppercase">{selectedUnit.name}</h2>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">{type.slice(0, -1)} Protocol</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm ${
                              selectedUnit.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                            }`}>{selectedUnit.status}</span>
                         </div>
                      </div>
                   </div>
                   <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-14 h-14 bg-slate-50 hover:bg-slate-100 rounded-[24px] text-slate-400 flex items-center justify-center transition-all shadow-inner active:scale-95"
                  >
                    <X size={32} />
                  </button>
                </div>

                {/* Tab Switcher */}
                <div className="px-10 mb-8">
                   <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-[32px] w-full max-w-md shadow-inner">
                      <button 
                        onClick={() => setDetailTab('profile')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[24px] transition-all flex items-center justify-center gap-2 ${detailTab === 'profile' ? 'bg-white text-slate-900 shadow-2xl shadow-slate-200 border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                         <Users size={16} /> Identity Profile
                      </button>
                      <button 
                        onClick={() => setDetailTab('docs')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[24px] transition-all flex items-center justify-center gap-2 ${detailTab === 'docs' ? 'bg-white text-slate-900 shadow-2xl shadow-slate-200 border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                         <ShieldCheck size={16} /> Compliance Docs
                      </button>
                   </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
                   {detailTab === 'profile' ? (
                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                     >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col justify-between">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Partner Control</p>
                              <div className="space-y-4">
                                 <div>
                                    <p className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{selectedUnit.owner}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Authorized Representative</p>
                                 </div>
                                 <div className="space-y-2">
                                    <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                       <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-inner">
                                          <Mail size={14} />
                                       </div>
                                       <p className="text-[11px] font-black text-slate-600 truncate">{selectedUnit.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                       <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                                          <Phone size={14} />
                                       </div>
                                       <p className="text-[11px] font-black text-slate-600 truncate">{selectedUnit.phone || 'N/A'}</p>
                                    </div>
                                    {selectedUnit.whatsapp && (
                                       <div className="flex items-center gap-3 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                                             <MessageSquare size={14} />
                                          </div>
                                          <p className="text-[11px] font-black uppercase italic tracking-widest">WhatsApp Protocol Active</p>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <div className="p-8 bg-emerald-50/30 rounded-[40px] border border-emerald-100 flex flex-col justify-between group hover:bg-emerald-50 transition-all">
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6 italic">Performance Yield</p>
                              <div>
                                 <p className="text-3xl font-black text-emerald-600 tracking-tighter italic">{selectedUnit.revenue}</p>
                                 <p className="text-[10px] font-black text-emerald-600/50 uppercase italic mt-1 tracking-widest">Revenue (30-Day Cycle)</p>
                              </div>
                           </div>
                           <div className="p-8 bg-white rounded-[40px] border border-slate-100 flex flex-col justify-between shadow-xl shadow-slate-200/50">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Strategic Deployment</p>
                              <div className="space-y-4">
                                 <div className="flex items-start gap-4">
                                    <MapPin size={18} className="text-primary-500 shrink-0 mt-0.5" />
                                    <div>
                                       <p className="text-sm font-black text-slate-900 italic leading-none">{selectedUnit.location}</p>
                                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Industrial Node</p>
                                    </div>
                                 </div>
                                 <div className="flex items-start gap-4">
                                    <TrendingUp size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                       <p className="text-sm font-black text-slate-900 italic leading-none">{selectedUnit.joinDate}</p>
                                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Lifecycle Start</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* AI Intelligence / Sub-meta */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                           <div className="space-y-6">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                                 <Zap size={14} className="text-primary-500" /> Advanced Telemetry Index
                              </p>
                              <div className="grid grid-cols-2 gap-4">
                                 {[
                                    { label: 'Platform ID', val: `#UNIT-${selectedUnit.id}` },
                                    { label: 'Reliability Index', val: 'GOLD 98.4%' },
                                    { label: 'Service Velocity', val: 'High-Response' },
                                    { label: 'Market Tier', val: 'Enterprise' }
                                 ].map((m, i) => (
                                    <div key={i} className="p-5 bg-white border border-slate-100 rounded-3xl group hover:border-primary-100 transition-all shadow-sm">
                                       <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">{m.label}</p>
                                       <p className="text-xs font-black text-slate-700 uppercase italic tracking-tighter">{m.val}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           
                           <div className="space-y-6">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                                 <Globe size={14} className="text-primary-500" /> Social Connectivity Hub
                              </p>
                              <div className="bg-slate-50/50 rounded-[44px] p-10 border border-slate-100 flex flex-wrap gap-5 shadow-inner">
                                 {[
                                    { icon: Globe, val: selectedUnit.website, label: 'Website', c: 'blue' },
                                    { icon: Facebook, val: selectedUnit.socials?.facebook, label: 'Facebook', c: 'indigo' },
                                    { icon: Instagram, val: selectedUnit.socials?.instagram, label: 'Instagram', c: 'rose' },
                                    { icon: Twitter, val: selectedUnit.socials?.twitter, label: 'Twitter', c: 'sky' },
                                    { icon: Linkedin, val: selectedUnit.socials?.linkedin, label: 'LinkedIn', c: 'blue' }
                                 ].map((social, i) => (
                                    <a 
                                      key={i}
                                      href={social.val ? (social.val.startsWith('http') ? social.val : `https://${social.val}`) : '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all shadow-sm ${social.val ? `bg-white text-${social.c}-600 hover:scale-110 hover:shadow-2xl hover:shadow-${social.c}-500/10 border border-slate-50` : 'bg-slate-200/40 text-slate-300 grayscale pointer-events-none opacity-50'}`}
                                      title={social.label}
                                    >
                                       <social.icon size={26} />
                                    </a>
                                 ))}
                                 {!Object.values(selectedUnit.socials || {}).some(v => v) && (
                                   <div className="w-full py-4 text-center">
                                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic leading-none">Social Protocols Offline</p>
                                   </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </motion.div>
                   ) : (
                     <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                     >
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                           <ShieldCheck size={14} className="text-emerald-500" /> Compliance Protocols & Identity Data
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                           {Object.entries(selectedUnit.documents).map(([key, url]) => {
                              const isPdf = url?.toLowerCase().endsWith('.pdf');
                              return (
                                 <div key={key} className="group relative aspect-video bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-100 overflow-hidden flex flex-col items-center justify-center gap-2 hover:border-primary-200 transition-all shadow-sm">
                                    {url ? (
                                       <>
                                          {isPdf ? (
                                             <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50/20 text-rose-500 group-hover:scale-110 transition-transform duration-700">
                                                <FileText size={48} />
                                                <span className="text-[10px] font-black uppercase tracking-widest mt-3">Industrial PDF Protocol</span>
                                             </div>
                                          ) : (
                                             <img 
                                                src={url} 
                                                alt={key} 
                                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                                             />
                                          )}
                                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                             <a href={url} target="_blank" rel="noopener noreferrer" className="p-5 bg-white rounded-full text-slate-900 shadow-2xl hover:scale-110 active:scale-90 transition-all">
                                                <ExternalLink size={24} />
                                             </a>
                                          </div>
                                       </>
                                    ) : (
                                       <>
                                          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-200 shadow-inner">
                                             <AlertCircle size={32} />
                                          </div>
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60 mt-2">{key.replace('_', ' ')}: ACCESS DENIED</span>
                                       </>
                                    )}
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-50 shadow-sm shadow-slate-900/5">
                                       {key.replace('_', ' ')}
                                    </div>
                                    {url && (
                                       <div className="absolute top-4 right-4 animate-pulse">
                                          <ShieldCheck size={14} className="text-emerald-500" />
                                       </div>
                                    )}
                                 </div>
                              );
                           })}
                        </div>
                        <div className="p-8 bg-orange-50/30 rounded-[40px] border border-orange-100 flex items-start gap-4">
                           <AlertCircle size={24} className="text-orange-600 shrink-0 mt-1" />
                           <div>
                              <p className="text-[12px] font-black text-orange-900 uppercase tracking-widest mb-1.5 italic">Compliance Validation Required</p>
                              <p className="text-[10px] text-orange-700 font-black leading-relaxed tracking-tight uppercase opacity-60 italic">Please verify the authenticity of all uploaded administrative paperwork. Digital forgery detection protocol is recommended for all support-tier documents.</p>
                           </div>
                        </div>
                     </motion.div>
                   )}
                </div>

                {/* Modal Footer (Governance Actions) */}
                <div className="p-10 bg-slate-50/50 border-t border-slate-50 flex gap-4">
                    <button 
                        onClick={() => handleGovernanceRequest(selectedUnit.id, 'verify')}
                        disabled={selectedUnit.status === 'verified'}
                        className="flex-[2] bg-emerald-600 text-white py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-20 disabled:grayscale italic"
                    >
                        <ShieldCheck size={20} /> Authorize Hub Verification
                    </button>
                    <button 
                        onClick={() => handleGovernanceRequest(selectedUnit.id, 'suspend')}
                        disabled={selectedUnit.status === 'suspended'}
                        className="flex-1 bg-white border-2 border-slate-100 text-slate-700 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 shadow-xl shadow-slate-200/50 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-20 italic"
                    >
                        <ShieldAlert size={20} /> Suspend Hub
                    </button>
                    <button 
                        onClick={() => handleGovernanceRequest(selectedUnit.id, 'reject')}
                        className="flex-1 bg-rose-600/10 text-rose-600 border border-rose-100 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-rose-100 shadow-xl shadow-rose-200/50 active:scale-95 transition-all flex items-center justify-center gap-2.5 italic"
                    >
                        <X size={20} /> Terminate
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessUnitList;
