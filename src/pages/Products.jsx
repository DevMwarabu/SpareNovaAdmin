import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ShoppingBag, Search, Filter, Plus, Download, 
  ExternalLink, ShieldCheck, AlertCircle, Tag,
  TrendingUp, BarChart3, PieChart as PieIcon, LineChart as LineIcon,
  Layers, Package, AlertTriangle, CheckCircle2,
  MoreVertical, Box, Cpu, Zap, Eye, Trash2, 
  ChevronRight, RefreshCcw, FileInput, Laptop, Loader2,
  Users, X, ChevronDown, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const API_BASE = 'http://localhost:8003/api/v1';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: {}, charts: {} });
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  
  // Advanced Search State
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    categoryId: 'all',
    minPrice: '',
    maxPrice: '',
    stockStatus: 'all'
  });

  // 1. Fetch Overview Analytics
  const fetchOverview = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/products/overview`);
      if (res.data.success) {
        setData({ stats: res.data.stats, charts: res.data.charts });
      }
    } catch (err) {
      console.error('Failed to fetch overview:', err);
      setError('Intelligence systems connectivity failure.');
    }
  };

  // 2. Fetch Categories for Filter
  const fetchFilterData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/commissions`); // Reusing categories from commissions if available or a generic category endpoint
      // Assuming a categories endpoint exists or we can get them from charts
      if (data.charts.category_distribution) {
        setCategories(data.charts.category_distribution.map(c => ({ id: c.id || c.name, name: c.name })));
      }
    } catch (err) {
      console.error('Failed to fetch filter metadata:', err);
    }
  };

  // 3. Fetch Product List (Table)
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/products`, {
        params: { 
          search: searchTerm, 
          status: filterStatus, 
          page: currentPage, 
          per_page: 8,
          category_id: advancedFilters.categoryId,
          min_price: advancedFilters.minPrice,
          max_price: advancedFilters.maxPrice,
          stock_status: advancedFilters.stockStatus
        }
      });
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination || null);
        setError(null);
      } else {
        setError(res.data.message || 'Catalog synchronization error.');
        setProducts([]);
        setPagination(null);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Marketplace server timeout or unreachable.');
      setProducts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, currentPage, advancedFilters]);

  useEffect(() => {
    fetchOverview();
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/admin/products/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchProducts();
        fetchOverview();
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const setStockStatusFromChart = (status) => {
    setAdvancedFilters(prev => ({ ...prev, stockStatus: status }));
    setFilterStatus('All Status');
    scrollToTable();
  };

  const setCategoryFromChart = (categoryName) => {
    // Attempt to find category ID if possible, otherwise use name
    setAdvancedFilters(prev => ({ ...prev, categoryId: categoryName }));
    scrollToTable();
  };

  const scrollToTable = () => {
    document.getElementById('product-table-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setAdvancedFilters({
      categoryId: 'all',
      minPrice: '',
      maxPrice: '',
      stockStatus: 'all'
    });
    setSearchTerm('');
    setFilterStatus('All Status');
  };

  // ── Charts & Visuals ──────────────────────────────────────────────────────

  const KPIBlock = ({ label, value, sub, icon: Icon, color, onClick }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-xl hover:border-primary-100' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-${color}-100/50`}>
          <Icon size={28} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{value || 0}</p>
          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic tracking-tighter">{sub}</p>
        </div>
      </div>
      <div className="h-full flex items-end">
        <TrendingUp size={16} className={`text-${color}-500/30`} />
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* ── Header & Action Bar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Package size={28} />
            </div>
            Product Intelligence Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-1 ml-1">Advanced visual marketplace monitoring & operational control center.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { fetchOverview(); fetchProducts(); }}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary-600 hover:border-primary-100 transition-all flex items-center gap-2 group shadow-sm"
          >
            <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <div className="h-10 w-px bg-slate-200 mx-1" />
          <button className="bg-white border border-slate-200 px-5 py-3 rounded-2xl text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
            <Download size={16} /> Export
          </button>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-xl shadow-primary-500/20 hover:bg-primary-700 flex items-center gap-2 transition-all active:scale-95">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPIBlock label="Total Inventory" value={data.stats.total} sub="Products Listed" icon={Box} color="blue" onClick={clearFilters} />
        <KPIBlock label="Active" value={data.stats.active} sub="Live on Platform" icon={CheckCircle2} color="emerald" onClick={() => { setFilterStatus('approved'); scrollToTable(); }} />
        <KPIBlock label="Needs Review" value={data.stats.pending} sub="Pending Action" icon={RefreshCcw} color="orange" onClick={() => { setFilterStatus('pending'); scrollToTable(); }} />
        <KPIBlock label="Out of Stock" value={data.stats.out_of_stock} sub="Zero Inventory" icon={AlertTriangle} color="red" onClick={() => setStockStatusFromChart('out_of_stock')} />
        <KPIBlock label="Low Supply" value={data.stats.low_stock} sub="Under 10 Units" icon={Package} color="amber" onClick={() => setStockStatusFromChart('low_stock')} />
        <KPIBlock label="Alerts" value={data.stats.flagged} sub="Risk Detected" icon={Zap} color="rose" onClick={() => { setFilterStatus('flagged'); scrollToTable(); }} />
      </div>

      {/* ── Analytics Layer ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Dist (Pie) */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Category Distribution</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Stock Volatility</p>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <PieIcon size={18} />
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
              <PieChart>
                <Pie
                  data={data.charts.category_distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  onClick={(entry) => setCategoryFromChart(entry.name)}
                >
                  {(data.charts.category_distribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} className="cursor-pointer outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {(data.charts.category_distribution || []).slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center gap-2 cursor-pointer group" onClick={() => setCategoryFromChart(c.name)}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase truncate group-hover:text-primary-600">{c.name}</span>
                <span className="text-[10px] font-black text-slate-900 ml-auto">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Trend (Area) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Product Upload Velocity</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Onboarding surges</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <LineIcon size={18} />
              </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
              <AreaChart data={data.charts.upload_trend || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                 />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Operational Intelligence Layer ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Selling (Horizontal Bar) */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Market Demand Patterns</h3>
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
          <div className="space-y-6">
            {(data.charts.top_selling || []).map((p, i) => (
              <div key={i} className="space-y-2 cursor-pointer group" onClick={() => { setSearchTerm(p.name); scrollToTable(); }}>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 group-hover:text-primary-600">
                  <span className="truncate pr-4 uppercase italic font-black">{p.name}</span>
                  <span className="text-slate-900 group-hover:text-primary-600">{p.orders} Orders</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.orders / 600) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-primary-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Distribution (Bar) */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Top Marketplace Vendors</h3>
            <Users size={18} className="text-blue-500" />
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={data.charts.vendor_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar 
                  dataKey="products" 
                  fill="#3b82f6" 
                  radius={[10, 10, 0, 0]} 
                  className="cursor-pointer"
                  onClick={(entry) => { setSearchTerm(entry.name); scrollToTable(); }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {(data.charts.vendor_distribution || []).map((v, i) => (
              <div key={i} className="flex items-center justify-between cursor-pointer group" onClick={() => { setSearchTerm(v.name); scrollToTable(); }}>
                <span className="text-[10px] font-black text-slate-500 uppercase group-hover:text-primary-600">{v.name}</span>
                <span className="text-[10px] font-black text-primary-600">{v.products} SKUs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Health (Stacked Bar) */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Inventory Health Map</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Stock Availability</p>
            </div>
            <Box size={18} className="text-emerald-500" />
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={data.charts.inventory_health || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold' }} width={80} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                <Bar dataKey="in" name="In Stock" stackId="a" fill="#10b981" onClick={() => setStockStatusFromChart('in_stock')} className="cursor-pointer" />
                <Bar dataKey="low" name="Low Stock" stackId="a" fill="#f59e0b" onClick={() => setStockStatusFromChart('low_stock')} className="cursor-pointer" />
                <Bar dataKey="out" name="Out of Stock" stackId="a" fill="#ef4444" radius={[0, 10, 10, 0]} onClick={() => setStockStatusFromChart('out_of_stock')} className="cursor-pointer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Intelligence Center */}
      <div className="lg:col-span-12 bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl group-hover:bg-primary-500/20 transition-all duration-700" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center animate-pulse">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">AI Intelligence Center</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Real-time Insights</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
            {[
              { type: 'alert', text: 'Brake Pads demand surged by 28% in Nairobi', color: 'orange', action: () => { setSearchTerm('Brake Pads'); scrollToTable(); } },
              { type: 'risk', text: '43 products identified as potential duplicates', color: 'rose', action: () => { setFilterStatus('flagged'); scrollToTable(); } },
              { type: 'price', text: 'Price anomaly detected in "Toyota Filter" (300% deviation)', color: 'blue', action: () => { setSearchTerm('Toyota Filter'); scrollToTable(); } },
            ].map((insight, i) => (
              <div 
                key={i} 
                className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-3 group hover:bg-white/10 transition-colors h-full items-center cursor-pointer"
                onClick={insight.action}
              >
                <div className={`w-10 h-10 rounded-lg bg-${insight.color}-500/20 text-${insight.color}-400 flex items-center justify-center shrink-0`}>
                  <AlertTriangle size={20} />
                </div>
                <p className="text-[12px] font-bold text-slate-300 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Recommendations</p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setSearchTerm('Toyota Filters'); scrollToTable(); }}
                className="flex-1 bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 flex items-center justify-center gap-2 text-[10px] font-black text-primary-400 hover:bg-primary-500 hover:text-white transition-all"
              >
                <Zap size={14} /> Promote: Toyota Filters
              </button>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Approval Queue & Smart Table ── */}
      <div id="product-table-section" className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden scroll-mt-6">
        
        {/* Table Toolbar */}
        <div className="p-8 border-b border-slate-50 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative group flex-1 max-w-xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input 
                placeholder="Search by Part Name, OEM, Model, or Vendor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border-slate-100 rounded-3xl pl-16 pr-6 py-5 text-sm font-bold placeholder:text-slate-300 outline-none focus:bg-white focus:border-primary-600 focus:shadow-2xl focus:shadow-primary-600/5 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                className={`p-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isAdvancedSearchOpen ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <SlidersHorizontal size={18} />
                {isAdvancedSearchOpen ? 'Hide Advanced' : 'Show Advanced'}
              </button>
              
              <div className="relative group">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 border-none rounded-2xl pl-10 pr-10 py-4 text-xs font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-2 focus:ring-primary-500/10"
                >
                  <option value="All Status">Catalog Status</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Active Listings</option>
                  <option value="rejected">Rejected Items</option>
                  <option value="flagged">Flagged Risks</option>
                </select>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isAdvancedSearchOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <select 
                      value={advancedFilters.categoryId}
                      onChange={(e) => setAdvancedFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-primary-500"
                    >
                      <option value="all">All Categories</option>
                      {data.charts.category_distribution?.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Range (KES)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={advancedFilters.minPrice}
                        onChange={(e) => setAdvancedFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-primary-500"
                      />
                      <span className="text-slate-300">-</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        value={advancedFilters.maxPrice}
                        onChange={(e) => setAdvancedFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Health</label>
                    <select 
                      value={advancedFilters.stockStatus}
                      onChange={(e) => setAdvancedFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:border-primary-500"
                    >
                      <option value="all">All Stock Status</option>
                      <option value="in_stock">In Stock (&gt;10)</option>
                      <option value="low_stock">Low Stock (1-10)</option>
                      <option value="out_of_stock">Out of Stock (0)</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <button 
                      onClick={fetchProducts}
                      className="flex-1 bg-primary-600 text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all"
                    >
                      Apply Filters
                    </button>
                    <button 
                      onClick={clearFilters}
                      className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                    >
                      <RefreshCcw size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 mb-6"
              >
                <AlertCircle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{error}</span>
                <button onClick={() => { fetchOverview(); fetchProducts(); }} className="ml-auto text-[10px] font-black underline uppercase hover:text-rose-700 whitespace-nowrap">Reboot Sensors</button>
              </motion.div>
            )}

            {selectedProducts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 bg-primary-600 p-4 rounded-2xl text-white shadow-xl"
              >
                <span className="text-xs font-black uppercase tracking-widest">{selectedProducts.length} Products Selected</span>
                <div className="h-6 w-px bg-white/20" />
                <div className="flex items-center gap-2">
                  <button onClick={() => selectedProducts.forEach(id => handleStatusUpdate(id, 'approved'))} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                    <CheckCircle2 size={14} /> Bulk Approve
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
                <button onClick={() => setSelectedProducts([])} className="ml-auto p-2 hover:bg-white/10 rounded-lg">
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Improved Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 w-10">
                  <div 
                    className={`w-5 h-5 rounded border-2 cursor-pointer transition-all ${products.length > 0 && selectedProducts.length === products.length ? 'bg-primary-600 border-primary-600' : 'border-slate-200'}`} 
                    onClick={() => {
                      if (selectedProducts.length === products.length) setSelectedProducts([]);
                      else setSelectedProducts(products.map(p => p.id));
                    }}
                  />
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Engineering</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Info</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Commercials</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">AI Risk</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="6">
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary-600" size={32} />
                      </div>
                    </td>
                 </tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className={`hover:bg-slate-50/50 transition-all group ${selectedProducts.includes(p.id) ? 'bg-primary-50/30' : ''}`}>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleSelect(p.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        selectedProducts.includes(p.id) 
                        ? 'bg-primary-600 border-primary-600 text-white' 
                        : 'border-slate-200 hover:border-primary-300'
                      }`}
                    >
                      {selectedProducts.includes(p.id) && <CheckCircle2 size={14} />}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        {p.image ? (
                          <img 
                            src={p.image.startsWith('http') ? p.image : `http://localhost:8003/storage/${p.image}`} 
                            alt={p.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://placehold.co/100?text=Part'; }}
                          />
                        ) : (
                          <div className="bg-slate-50 w-full h-full flex items-center justify-center text-slate-300"><Tag size={24} /></div>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1 italic">{p.category}</p>
                        <p className="text-sm font-black text-slate-900 leading-none group-hover:text-primary-600 transition-colors uppercase">{p.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">OEM: {p.oem}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-700 italic uppercase leading-none">{p.store_name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.vendor}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-black text-slate-900 tracking-tighter italic">KES {numberWithCommas(p.price)}</p>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${p.stock > 10 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {p.stock} units
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex flex-col items-center">
                       {p.ai_verification?.verified ? (
                         <div className="flex flex-col items-center gap-1">
                            <ShieldCheck size={20} className="text-emerald-500" />
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Verified OEM</span>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center gap-1">
                            <AlertCircle size={20} className="text-orange-400" />
                            <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Flagged Risk</span>
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={() => handleStatusUpdate(p.id, p.status === 'approved' ? 'pending' : 'approved')}
                         className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          p.status === 'approved' 
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                         {p.status === 'approved' ? 'Flag' : 'Verify'}
                      </button>
                      <div className="h-4 w-px bg-slate-200" />
                      <div className="relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === p.id ? null : p.id); }}
                          className={`p-2.5 rounded-xl transition-all ${activeMenu === p.id ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'}`}
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        <AnimatePresence>
                          {activeMenu === p.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 p-2 overflow-hidden"
                            >
                              <div className="flex flex-col">
                                <button className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-2xl transition-all">
                                  <Eye size={14} /> View Details
                                </button>
                                <button className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-2xl transition-all">
                                  <SlidersHorizontal size={14} /> Edit Product
                                </button>
                                <button className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-2xl transition-all">
                                  <Layers size={14} /> Specs & Files
                                </button>
                                <div className="h-px bg-slate-50 my-1 mx-2" />
                                <button className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                                  <Trash2 size={14} /> Delete Part
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && !loading && (
                 <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-4 opacity-30">
                          <ShoppingBag size={48} />
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching artifacts found in sector.</p>
                          <button onClick={clearFilters} className="text-primary-600 text-xs font-black uppercase underline">Clear all sensors</button>
                       </div>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Advanced Pagination */}
        <div className="p-8 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
          <div className="flex flex-col gap-1">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Analytics Resolution
             </p>
             <p className="text-xs font-bold text-slate-900">
               {pagination ? `INDEX ${pagination.from || 0} → ${pagination.to || 0} OF ${pagination.total}` : 'SYSTEM CALIBRATING...'}
             </p>
          </div>
          {pagination && pagination.last_page > 1 && (
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-600 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={18} className="rotate-180" />
              </button>
              {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                const startPage = Math.max(1, currentPage - 2);
                let n = startPage + i;
                if (n > pagination.last_page) return null;
                return (
                  <button 
                    key={n} 
                    onClick={() => setCurrentPage(n)}
                    className={`w-12 h-12 rounded-2xl text-xs font-black shadow-lg transition-all ${n === currentPage ? 'bg-primary-600 text-white shadow-primary-500/30' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-600/5'}`}
                  >
                    {n < 10 ? `0${n}` : n}
                  </button>
                );
              })}
               <button 
                disabled={currentPage === pagination.last_page}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-600 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Formatting Helper
function numberWithCommas(x) {
  if (!x) return '0';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default Products;
