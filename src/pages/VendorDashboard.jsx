import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { 
  TrendingUp, ShoppingCart, Clock, AlertTriangle, BrainCircuit, 
  ChevronRight, Plus, Package, Truck, CheckCircle2, Star, 
  Target, Activity, Zap, DollarSign, Users, MapPin, 
  ShieldCheck, MessageSquare, ArrowUpRight, BarChart3,
  Search, Bell, Filter, MoreVertical, LayoutGrid, List,
  Calendar, CheckCircle, Store, Gauge, Wrench
} from 'lucide-react';

const API_BASE = 'http://localhost:8003/api/v1';

// --- Sub-Components ---

const KpiCard = ({ label, value, change, icon: iconName, color, index }) => {
  // Ultra-Defensive Icon Resolution (Prevents ReferenceErrors)
  const getSafeIcon = () => {
    try {
      const type = iconName?.toLowerCase();
      if (type === 'shoppingcart') return ShoppingCart;
      if (type === 'dollarsign') return DollarSign;
      if (type === 'clock') return Clock;
      if (type === 'alerttriangle') return AlertTriangle;
      if (type === 'wrench') return Wrench;
      if (type === 'calendar') return Calendar;
      if (type === 'truck') return Truck;
      if (type === 'users') return Users;
      if (type === 'checkcircle') return CheckCircle;
      if (type === 'target') return Target;
      if (type === 'package') return Package;
      return Activity;
    } catch (e) {
      return Activity;
    }
  };

  const Icon = getSafeIcon();

  const colorMap = {
    primary: 'from-blue-600 to-indigo-700 shadow-blue-500/20',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
    orange: 'from-orange-400 to-amber-600 shadow-orange-500/20',
    rose: 'from-rose-500 to-pink-600 shadow-rose-500/20',
    indigo: 'from-indigo-500 to-purple-600 shadow-indigo-500/20',
    purple: 'from-purple-500 to-fuchsia-600 shadow-purple-500/20',
    blue: 'from-blue-400 to-cyan-600 shadow-blue-400/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 opacity-50" />
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[color] || colorMap.primary} text-white flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black ${change >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-2 py-1 rounded-lg uppercase italic`}>
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 italic opacity-60">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">{value}</h3>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Activity size={12} className="text-slate-300 animate-pulse" />
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300 italic">Live Telemetry Synchronized</span>
      </div>
    </motion.div>
  );
};

const PipelineStep = ({ label, count, status, isActive }) => (
  <div className="flex-1 text-center relative group">
    <div className={`h-2 rounded-full mb-3 transition-all duration-500 ${isActive ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20' : 'bg-slate-100 group-hover:bg-slate-200'}`} />
    <div className="flex flex-col items-center">
      <span className={`text-[10px] font-black uppercase tracking-tighter italic mb-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black italic shadow-inner ${isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-300'}`}>
        {count}
      </div>
    </div>
  </div>
);

const ActionItem = ({ label, route, index }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    onClick={() => window.location.href = route}
    className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 transition-all cursor-pointer group"
  >
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight italic">{label}</span>
    </div>
    <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
  </motion.div>
);

const VendorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeInterval, setActiveInterval] = useState('7d');
  
  // Advanced Filter States
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetchDashboardData();
  }, [activeInterval]);

  // High-Performance Filtering Node
  const filteredOrders = React.useMemo(() => {
    if (!data?.recent_orders) return [];
    
    return data.recent_orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      
      const amount = parseFloat(order.amount.replace(/[^0-9.]/g, ''));
      const matchesMin = !amountRange.min || amount >= parseFloat(amountRange.min);
      const matchesMax = !amountRange.max || amount <= parseFloat(amountRange.max);
      
      return matchesSearch && matchesStatus && matchesMin && matchesMax;
    });
  }, [data?.recent_orders, searchQuery, statusFilter, amountRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const days = activeInterval === '7d' ? 7 : 30;
      const response = await axios.get(`${API_BASE}/dashboard/vendor?days=${days}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Dashboard telemetry failure:', err);
      setError('Operational sync lost. Check connection nodes.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse italic">Synchronizing Intelligence Hub...</p>
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="h-screen flex items-center justify-center bg-white px-8">
      <div className="max-w-md text-center">
        <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-900/10">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">Node Failure Detected</h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">{error || 'Unable to establish secure telemetry connection.'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-slate-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest italic hover:bg-slate-800 transition-all shadow-2xl"
        >
          Re-initialize Tactical Scan
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 space-y-12 font-sans overflow-x-hidden pt-20">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-slate-200/60">
         <div>
            <h1 className="text-5xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
               Vendor <span className="text-indigo-600">Commander</span>
            </h1>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.2em] mt-2 italic opacity-60">Real-time Operational Autonomy & Intelligence Hub</p>
         </div>
         <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
            <button 
              onClick={() => setActiveInterval('7d')}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all ${activeInterval === '7d' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50'}`}
            >7 Days</button>
            <button 
              onClick={() => setActiveInterval('30d')}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all ${activeInterval === '30d' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50'}`}
            >30 Days</button>
         </div>
      </div>

      {/* 2. Top KPI Strip (Real-Time Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.kpis.map((kpi, i) => <KpiCard key={i} {...kpi} index={i} />)}
      </div>

      <div className="grid grid-cols-1 grid-xl:grid-cols-12 xl:grid-cols-12 gap-8">
         {/* 3. AI Insights Panel */}
         <div className="xl:col-span-4 space-y-8">
            <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40 shadow-lg shadow-indigo-500/20">
                                <BrainCircuit size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Strategic Advisor</h3>
                                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest italic animate-pulse">Analyzing market heuristics...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        {data.ai_insights.map((insight, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative pl-6 border-l-2 border-indigo-500/20 hover:border-indigo-500 transition-colors py-1 group/insight"
                          >
                             <div className={`absolute top-1/2 -translate-y-1/2 -left-[5px] w-2 h-2 rounded-full transform group-hover/insight:scale-150 transition-transform ${insight.type === 'risk' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                             <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 italic ${insight.type === 'risk' ? 'text-rose-400' : 'text-emerald-400'}`}>{insight.title}</p>
                             <p className="text-sm font-medium text-slate-300 leading-tight italic uppercase tracking-tight opacity-70 group-hover/insight:opacity-100 transition-opacity">
                                "{insight.message}"
                             </p>
                          </motion.div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-auto pt-10 relative z-10">
                    <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-indigo-600 hover:border-indigo-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] italic transition-all flex items-center justify-center gap-3 shadow-xl group/btn">
                        Force Intelligence Sync <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2 justify-center mt-4 opacity-30">
                        <CheckCircle2 size={10} className="text-indigo-400" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Algorithmic Precision: 99.4%</span>
                    </div>
                </div>
            </div>

            {/* 4. Performance Score Widget */}
            <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 transform group-hover:rotate-12 transition-transform opacity-5">
                    <Target size={120} />
                </div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Velocity Score</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Aggregated Operational Efficiency</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow-xl">
                        <span className="text-xl font-black italic">{data.performance_score.score}</span>
                        <span className="text-[7px] font-black uppercase">Alpha</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    {data.performance_score.breakdown.map((item, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-3xl hover:bg-slate-900 hover:text-white transition-all group/p">
                            <p className="text-[8px] font-black uppercase text-slate-400 mb-1 group-hover/p:text-slate-500">{item.label}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-black italic">{item.value}%</span>
                                <TrendingUp size={12} className={item.value > 90 ? 'text-emerald-500' : 'text-indigo-500'} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>

         {/* Right Section: Graph & Pipeline */}
         <div className="xl:col-span-8 space-y-8">
            {/* 5. Revenue & Orders Graph */}
            <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Financial Pulse</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Revenue & Yield Vector (KES)</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-indigo-500" />
                           <span className="text-[10px] font-black uppercase text-slate-500 italic">Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-emerald-400" />
                           <span className="text-[10px] font-black uppercase text-slate-500 italic">Orders</span>
                        </div>
                    </div>
                </div>
                
                <div className="h-80 w-full min-h-[320px] relative">
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={data.revenue_graph}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                            />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                                itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={4} fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 6. Orders Pipeline (Visual Workflow) */}
            <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-10 flex items-center gap-3">
                   <Zap size={20} className="text-amber-500" /> Operational Pipe
                </h3>
                <div className="flex items-start justify-between gap-4">
                    {data.orders_pipeline.map((step, i) => (
                        <PipelineStep 
                            key={i} 
                            {...step} 
                            isActive={i <= 1} // Simulation
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 7. Action Center / Rewards */}
                <div className="bg-[#0f172a] p-10 rounded-[56px] text-white relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 p-10 opacity-10 transform scale-150">
                        <Star size={160} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black uppercase italic tracking-tight">Loyalty Status</h3>
                            <div className="px-4 py-1.5 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black italic shadow-lg shadow-amber-400/20">
                                {data.loyalty.tier} TIER
                            </div>
                        </div>
                        
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <span className="text-4xl font-black italic tracking-tighter">{data.loyalty.points.toLocaleString()}</span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase ml-2 italic">Points</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase italic">{data.loyalty.progress}% to {data.loyalty.next_tier}</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${data.loyalty.progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                />
                            </div>
                        </div>
                        
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.1em] italic leading-relaxed">
                            Generating 12,500 more points will unlock the <span className="text-white">Platinum Intelligence Pack</span> and Priority Fulfillment.
                        </p>
                    </div>
                </div>

                {/* 8. Earnings Snapshot */}
                <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <DollarSign size={20} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Earnings</h3>
                        </div>
                        <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline italic">Request Payout</button>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Cleared Balance</p>
                            <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">{data.earnings.total_earnings}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-[8px] font-black text-slate-400 uppercase italic mb-1">Escrow</p>
                                <p className="text-xs font-black text-slate-700 italic">{data.earnings.pending_payouts}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-[8px] font-black text-slate-400 uppercase italic mb-1">Last Payout</p>
                                <p className="text-xs font-black text-slate-700 italic">{data.earnings.last_payout_date}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* 9. Operational Ledger (Recent Orders) */}
      <div className="bg-white rounded-[60px] border border-slate-100 shadow-sm p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
              <div>
                  <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-4">
                     <List size={28} className="text-indigo-600" /> Operational Ledger
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60 mt-1">Cross-platform fulfillment synchronization</p>
              </div>
              <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                      <div className="relative group flex-1">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors" size={16} />
                          <input 
                            type="text" 
                            placeholder="SEARCH TRANSACTION ID OR CUSTOMER..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-50 pl-12 pr-6 py-4 rounded-2xl text-[10px] font-black tracking-widest border border-transparent focus:bg-white focus:border-indigo-100 transition-all outline-none w-full uppercase"
                          />
                      </div>
                      <button 
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className={`p-4 rounded-2xl transition-all border ${isFilterVisible ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20' : 'bg-slate-50 text-slate-400 border-transparent hover:border-indigo-100'}`}
                      >
                          <Filter size={18} />
                      </button>
                  </div>
                  
                  <AnimatePresence>
                      {isFilterVisible && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                              <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-wrap gap-6 mt-2">
                                  <div className="space-y-2">
                                      <p className="text-[10px] font-black uppercase text-slate-400 italic">Protocol Status</p>
                                      <div className="flex gap-2">
                                          {['All', 'Delivered', 'Pending', 'Processing', 'Cancelled'].map(status => (
                                              <button 
                                                key={status}
                                                onClick={() => setStatusFilter(status)}
                                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase italic transition-all ${statusFilter === status ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
                                              >
                                                  {status}
                                              </button>
                                          ))}
                                      </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                      <p className="text-[10px] font-black uppercase text-slate-400 italic">Financial Yield (KES)</p>
                                      <div className="flex items-center gap-2">
                                          <input 
                                            type="number" 
                                            placeholder="MIN" 
                                            value={amountRange.min}
                                            onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                                            className="w-24 bg-white px-4 py-2 rounded-xl text-[10px] font-black border border-slate-100 focus:border-indigo-500 outline-none"
                                          />
                                          <div className="w-2 h-0.5 bg-slate-200" />
                                          <input 
                                            type="number" 
                                            placeholder="MAX" 
                                            value={amountRange.max}
                                            onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                                            className="w-24 bg-white px-4 py-2 rounded-xl text-[10px] font-black border border-slate-100 focus:border-indigo-500 outline-none"
                                          />
                                      </div>
                                  </div>
                                  
                                  <button 
                                    onClick={() => {
                                      setSearchQuery('');
                                      setStatusFilter('All');
                                      setAmountRange({ min: '', max: '' });
                                    }}
                                    className="self-end px-4 py-2 text-[9px] font-black uppercase text-rose-500 hover:bg-rose-50 rounded-xl transition-all italic"
                                  >
                                      Reset Parameters
                                  </button>
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-6 py-6 text-[10px] uppercase font-black text-slate-400 tracking-widest italic">Consignment</th>
                  <th className="px-6 py-6 text-[10px] uppercase font-black text-slate-400 tracking-widest italic text-center">Principal</th>
                  <th className="px-6 py-6 text-[10px] uppercase font-black text-slate-400 tracking-widest italic text-center">Yield</th>
                  <th className="px-6 py-6 text-[10px] uppercase font-black text-slate-400 tracking-widest italic text-center">Protocol Status</th>
                  <th className="px-6 py-6 text-[10px] uppercase font-black text-slate-400 tracking-widest italic text-center">Telemetry</th>
                  <th className="px-6 py-6 text-[10px] uppercase font-black text-slate-400 tracking-widest italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.length > 0 ? filteredOrders.map((order, i) => (
                  <tr key={i} className="group hover:bg-slate-50/70 transition-all">
                    <td className="px-6 py-8">
                       <span className="text-xs font-black text-slate-900 italic tracking-tighter group-hover:text-indigo-600 transition-colors uppercase">{order.id}</span>
                       <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase italic">{order.method}</p>
                    </td>
                    <td className="px-6 py-8 text-center text-[10px] font-black text-slate-500 uppercase italic opacity-70">{order.customer}</td>
                    <td className="px-6 py-8 text-center text-xs font-black text-slate-900 italic">{order.amount}</td>
                    <td className="px-6 py-8 text-center">
                       <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest italic border ${
                         order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                         order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                         'bg-indigo-50 text-indigo-600 border-indigo-100 animate-pulse'
                       }`}>
                          {order.status}
                       </span>
                    </td>
                    <td className="px-6 py-8 text-center text-[9px] font-black text-slate-400 uppercase italic">{order.time}</td>
                    <td className="px-6 py-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                           <button className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest italic shadow-lg shadow-slate-900/10 active:scale-95 transition-all">Audit</button>
                           <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                               <MoreVertical size={16} />
                           </button>
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <Activity size={48} className="text-slate-400" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No transaction nodes match selected parameters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 10. Action Center / Task Hub */}
          <div className="lg:col-span-1 bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8 px-2">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                     <Target size={20} className="text-indigo-600" /> Action Center
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-black italic text-slate-400 border border-slate-100">
                    {data.tasks.length}
                  </div>
              </div>
              <div className="flex-1 space-y-4">
                  {data.tasks.map((task, i) => <ActionItem key={i} {...task} index={i} />)}
              </div>
              <p className="mt-8 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center italic">Institutional compliance node synchronized</p>
          </div>

          {/* 11. Alerts Center */}
          <div className="lg:col-span-1 bg-gradient-to-br from-rose-600 to-rose-800 p-10 rounded-[56px] text-white shadow-2xl shadow-rose-900/20">
              <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                     <Bell size={20} className="animate-bounce" /> Critical Alerts
                  </h3>
                  <AlertTriangle size={24} className="opacity-40" />
              </div>
              <div className="space-y-6">
                  {data.alerts.map((alert, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/20 transition-all cursor-pointer">
                          <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center ${alert.type === 'delay' ? 'bg-amber-400 text-slate-900' : 'bg-white text-rose-600'}`}>
                             {alert.type === 'delay' ? <Clock size={20} /> : <AlertTriangle size={20} />}
                          </div>
                          <div>
                              <p className="text-xs font-black italic uppercase leading-tight group-hover:text-white transition-colors">{alert.message}</p>
                              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1 inline-block">Real-time Priority</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* 12. Customer Matrix */}
          <div className="lg:col-span-1 bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Users size={120} />
             </div>
             <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-10">Market Density</h3>
                <div className="space-y-8 flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Direct Acquisitions</p>
                            <h4 className="text-3xl font-black italic tracking-tighter text-slate-900">{data.customer_activity.new_acquisitions} 
                              <span className={`text-[10px] font-bold ml-1 ${data.customer_activity.growth_rate >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {data.customer_activity.growth_rate >= 0 ? '+' : ''}{data.customer_activity.growth_rate}%
                              </span>
                            </h4>
                        </div>
                        <Users size={32} className="text-slate-100" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Returning Nodes</p>
                            <h4 className="text-3xl font-black italic tracking-tighter text-slate-900">{data.customer_activity.returning_percent}%</h4>
                        </div>
                        <CheckCircle2 size={32} className="text-slate-100" />
                    </div>
                </div>
                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
                    </div>
                    <span className="text-[8px] font-black uppercase text-slate-400 italic">Network Expanding Rapidly</span>
                </div>
             </div>
          </div>
      </div>

      {/* The Unified Command Hub has been moved to the global AI Assistant layer to prevent UI overlap. */}

    </div>
  );
};

export default VendorDashboard;
