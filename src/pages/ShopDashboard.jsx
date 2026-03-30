import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  DollarSign,
  ArrowUpRight,
  Plus,
  Zap,
  TrendingUp,
  Star,
  Activity,
  ChevronRight,
  Box,
  Truck,
  CheckCircle2,
  BrainCircuit,
  Target
} from 'lucide-react';

const StatCard = ({ title, value, change, icon, color, type }) => {
  const IconComponent = {
    Wallet: DollarSign,
    ShoppingBag: ShoppingCart,
    Package: Package,
    AlertTriangle: AlertTriangle,
    TrendingUp: TrendingUp
  }[icon] || DollarSign;

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }} 
      className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 group transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
          <IconComponent size={28} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black ${change >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'} px-2.5 py-1.5 rounded-xl uppercase italic tracking-widest`}>
          {change >= 0 ? '+' : ''}{Math.abs(change)}%
        </div>
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 italic">{title}</div>
      <div className="text-3xl font-black text-slate-900 tracking-tighter italic">{value}</div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
         <Activity size={12} className={`text-${color}-500`} />
         <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 italic">Real-time Telemetry Active</p>
      </div>
    </motion.div>
  );
};

const ShopDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [businessUnit, setBusinessUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = 'http://localhost:8003/api/v1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/dashboard/stats`);
        if (response.data.success) {
          setStats(response.data.stats || []);
          setRecentSales(response.data.recentOrders || []);
          setAiInsights(response.data.ai_insights || []);
          setBusinessUnit(response.data.business_unit);
        }
      } catch (error) {
        console.error('Failed to fetch shop stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading && stats.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-32 gap-6">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Initializing Institutional Command...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic flex items-center gap-3">
             <div className="p-2.5 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 shadow-sm">
                <Zap size={28} />
             </div>
             Store <span className="text-primary-600">Commander</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">Fulfillment Lifecycle & Inventory Intelligence</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => window.location.href = '/portal/inventory'}
             className="bg-white border-2 border-slate-100 px-6 py-3.5 rounded-[20px] text-[10px] font-black text-slate-700 shadow-xl shadow-slate-200/50 hover:bg-slate-50 active:scale-95 transition-all uppercase tracking-widest italic"
           >
             Inventory Audit
           </button>
           <button 
             onClick={() => window.location.href = '/portal/products/add'}
             className="bg-slate-900 text-white px-8 py-3.5 rounded-[20px] text-[10px] font-black shadow-2xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-[0.1em] italic"
           >
             <Plus size={18} /> New Consignment
           </button>
        </div>
      </div>

      {/* Institutional Status & Loyalty Header */}
      {businessUnit && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className={`p-8 rounded-[48px] border-2 flex items-center justify-between col-span-1 lg:col-span-2 ${
              businessUnit.status === 'verified' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-orange-50 border-orange-100'
           }`}>
              <div className="flex items-center gap-6">
                 <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg ${
                    businessUnit.status === 'verified' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-orange-500 text-white shadow-orange-500/20'
                 }`}>
                    {businessUnit.status === 'verified' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 italic tracking-tight uppercase leading-none mb-1.5">
                       {businessUnit.name} <span className="text-[10px] text-slate-400 font-bold ml-2">[{businessUnit.status.toUpperCase()}]</span>
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-80">
                       {businessUnit.status === 'verified' 
                         ? 'Strategic marketplace node verified. Deep-learning algorithms fully optimized.'
                         : 'Pending compliance verification. Search indexing priority lowered.'}
                    </p>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-8 rounded-[48px] shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => window.location.href = '/portal/loyalty-hub'}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex items-center justify-between h-full">
                 <div>
                    <p className="text-[10px] font-black text-white/80 uppercase tracking-widest italic mb-1">Loyalty Standing</p>
                    <h4 className="text-4xl font-black text-white italic tracking-tighter leading-none">{businessUnit.loyalty?.tier || 'BRONZE'}</h4>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest italic mt-2">Performance Score: {businessUnit.loyalty?.score || 0}</p>
                 </div>
                 <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                    <Star size={24} />
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Traffic/Sales */}
        <div className="lg:col-span-2 bg-white rounded-[60px] border border-slate-100 shadow-sm p-10 shadow-slate-200/50">
           <div className="flex items-center justify-between mb-10 px-4">
              <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">Fulfillment Ledger</h2>
              <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline italic">Deep Dive Reports</button>
           </div>
           <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest italic">Consignment</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest italic">Principal</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest italic text-right">Yield</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest italic text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentSales.map((sale, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-6 font-black text-xs text-slate-900 italic uppercase tracking-tighter group-hover:text-primary-600">{sale.id}</td>
                    <td className="px-6 py-6 font-black text-[10px] text-slate-400 uppercase italic opacity-80">{sale.customer}</td>
                    <td className="px-6 py-6 font-black text-xs text-slate-900 italic text-right">{sale.amount}</td>
                    <td className="px-6 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full ${sale.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'} text-[9px] font-black uppercase tracking-widest italic inline-block w-24`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentSales.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-20 text-center flex flex-col items-center gap-4">
                       <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-200">
                          <Box size={40} />
                       </div>
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Awaiting synchronized demand signals...</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Intelligence Hub */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-10 rounded-[60px] shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-12 h-12 rounded-2xl bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/40">
                          <BrainCircuit size={28} />
                       </div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Strategic Advisor</h3>
                    </div>
                    
                    <div className="space-y-10">
                       {aiInsights.map((insight, i) => (
                         <motion.div 
                           key={i}
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.3 }}
                           className="relative pl-6 border-l-2 border-primary-500/30 group/ins hover:border-primary-500 transition-colors"
                         >
                            <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-primary-500 group-hover/ins:scale-150 transition-transform" />
                            <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mb-2 italic">{insight.title}</p>
                            <p className="text-sm font-medium text-slate-300 leading-relaxed italic uppercase tracking-tight opacity-80 group-hover/ins:opacity-100 transition-opacity">
                               "{insight.message}"
                            </p>
                            <button className="mt-3 flex items-center gap-2 text-[9px] font-black text-white uppercase tracking-widest hover:text-primary-400 transition-colors italic">
                               Execute Optimization <ChevronRight size={12} />
                            </button>
                         </motion.div>
                       ))}
                       {aiInsights.length === 0 && (
                         <div className="py-20 text-center opacity-30 italic font-black uppercase text-[10px] tracking-widest">Scanning market heuristics...</div>
                       )}
                    </div>
                 </div>
                 
                 <div className="mt-auto p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between group/bot cursor-pointer hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                       <Target size={20} className="text-emerald-400" />
                       <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Growth Engine Active</p>
                    </div>
                    <Activity size={16} className="text-emerald-500 animate-[pulse_2s_infinite]" />
                 </div>
              </div>
           </div>

           {/* Quick Stats Overlay (Stock Hygiene) */}
           <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm shadow-slate-200/50 group hover:border-primary-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100 group-hover:scale-110 transition-transform">
                    <Activity size={24} />
                 </div>
                 <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tight leading-none mb-1">Catalog Hygiene</h4>
              </div>
              <div className="space-y-4">
                 {[
                    { label: 'Active Listings', val: '84%', col: 'emerald' },
                    { label: 'Sync Accuracy', val: '99.8%', col: 'primary' },
                    { label: 'Stock Health', val: 'Low', col: 'orange' }
                 ].map((h, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl group/h hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                      <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">{h.label}</p>
                      <p className={`text-[11px] font-black text-${h.col === 'primary' ? 'primary-600' : h.col + '-600'} italic`}>{h.val}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
