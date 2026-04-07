import { API_BASE } from '../api/config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Brain, 
  Star, 
  Trophy, 
  Zap, 
  Target, 
  ArrowRight, 
  ShoppingBag, 
  Gift,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LoyaltyHub = () => {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE}/dashboard/vendor`, { headers });
      if (res.data.success) {
        setLoyaltyData(res.data.data.loyalty);
      }
    } catch (err) {
      console.error("Failed to fetch loyalty data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Crown = loyaltyData?.tier === 'PLATINUM' ? Trophy : Star;

  const tiers = [
    { name: 'BRONZE', min: 0, color: 'orange', icon: Star },
    { name: 'SILVER', min: 10000, color: 'slate', icon: Sparkles },
    { name: 'GOLD', min: 50000, color: 'yellow', icon: Trophy },
    { name: 'PLATINUM', min: 100000, color: 'indigo', icon: Crown },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 shadow-xl shadow-indigo-500/10 border border-indigo-100">
                <Brain size={24} />
             </div>
             Institutional Loyalty Hub
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60 italic">Strategic Engagement & Rewards Intelligence Hub</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-xl shadow-indigo-500/10">
              <ShieldCheck size={16} className="animate-pulse" /> Authentication Status: Verified
           </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="animate-pulse bg-slate-100 h-80 rounded-[56px]"></div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="animate-pulse bg-slate-100 h-40 rounded-[40px]"></div>
                 <div className="animate-pulse bg-slate-100 h-40 rounded-[40px]"></div>
              </div>
           </div>
           <div className="animate-pulse bg-slate-100 h-[600px] rounded-[56px]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Progress & Stats */}
           <div className="lg:col-span-2 space-y-8">
              {/* Primary Progress Card */}
              <div className="bg-slate-900 p-12 rounded-[56px] shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-5 text-white group-hover:scale-110 transition-transform duration-1000">
                    <Star size={180} />
                 </div>
                 
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-12">
                       <div>
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 italic">Institutional Standing</p>
                          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">{loyaltyData?.tier} Node</h2>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 italic">Current Points</p>
                          <p className="text-4xl font-black text-white italic tracking-tighter">{loyaltyData?.points.toLocaleString()}</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between text-[10px] font-black text-indigo-300 uppercase tracking-widest italic">
                          <span>Next Tier Allocation: {loyaltyData?.next_tier}</span>
                          <span>{loyaltyData?.progress}% Velocity</span>
                       </div>
                       <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${loyaltyData?.progress}%` }}
                             transition={{ duration: 1.5, ease: 'easeOut' }}
                             className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 shadow-xl shadow-indigo-500/40 relative"
                          >
                             <div className="absolute top-0 right-0 h-full w-2 bg-white/20 blur-sm animate-pulse" />
                          </motion.div>
                       </div>
                    </div>

                    <div className="mt-12 flex items-center gap-8">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                             <Target size={20} />
                          </div>
                          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none">Strategic Goal<br/><span className="text-white text-xs mt-1 block">5.0k Points Remaining</span></p>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                             <TrendingUp size={20} />
                          </div>
                          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none">Growth Pulse<br/><span className="text-white text-xs mt-1 block">+12% vs Prev Cycle</span></p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Reward Tiers Horizontal Scroll */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {tiers.map((t) => (
                    <div key={t.name} className={`p-6 rounded-[32px] border transition-all ${loyaltyData?.tier === t.name ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-500/5 scale-105 z-10' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                       <div className={`w-10 h-10 rounded-xl bg-${t.color}-50 text-${t.color}-600 flex items-center justify-center mb-4`}>
                          <t.icon size={20} />
                       </div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{t.min.toLocaleString()}+ Pts</p>
                       <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{t.name}</p>
                    </div>
                 ))}
              </div>

              {/* Utility Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm shadow-slate-200/50">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3 italic">
                       <Sparkles size={18} className="text-amber-500" /> Exclusive Privileges
                    </h3>
                    <div className="space-y-4">
                       {[
                          'Commencement of Discounted Logistics',
                          'Strategic Homepage Prime Placement',
                          'Institutional Support Line (VIP)',
                          'Priority Review Governance'
                       ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl group hover:bg-indigo-50 transition-colors">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                             <p className="text-[10px] font-bold text-slate-600 uppercase italic">{item}</p>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-indigo-600 p-8 rounded-[48px] text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
                    <div className="relative z-10">
                       <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-3 italic">
                          <Gift size={18} /> Redeemable Assets
                       </h3>
                       <div className="space-y-4 mb-8 opacity-90">
                          <p className="text-[10px] font-black uppercase leading-relaxed italic">Convert your institutional standing into tangible growth accelerators.</p>
                       </div>
                       <button className="w-full bg-white text-indigo-600 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 italic">
                          Open Rewards Vault <ArrowRight size={16} />
                       </button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
                       <Cpu size={120} />
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Ledger / Timeline */}
           <div className="bg-white rounded-[56px] border border-slate-100 shadow-sm shadow-slate-200/50 p-10 flex flex-col">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 italic">
                    <Star size={20} className="text-indigo-600" /> Points Ledger
                 </h3>
                 <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm">
                    <TrendingUp size={16} />
                 </button>
              </div>

                 {(loyaltyData?.ledger || []).map((log, i) => (
                    <div key={i} className="flex items-center justify-between group relative pl-6">
                       <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-100 group-last:bg-transparent" />
                       <div className="absolute left-[-3px] top-1.5 w-2 h-2 rounded-full border-2 border-white bg-slate-200 group-hover:bg-indigo-500 group-hover:scale-150 transition-all" />
                       
                       <div className="flex-1 pr-4">
                          <p className="text-[10px] font-black text-slate-900 uppercase italic opacity-80 leading-tight mb-1 group-hover:text-indigo-600 transition-colors truncate">{log.l}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60 italic">{log.t}</p>
                       </div>
                       <div className={`px-2.5 py-1.5 rounded-xl bg-${log.c}-50 text-${log.c}-600 text-[10px] font-black italic whitespace-nowrap`}>
                          {log.v}
                       </div>
                    </div>
                 ))}

              <div className="mt-12 p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
                       <ShieldCheck size={16} />
                    </div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic opacity-80">Security Audit</p>
                 </div>
                 <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase opacity-60 italic">Loyalty telemetry is synchronized across the integrity mesh every 4 hours. Manual adjustment is restricted to platform governance nodes only.</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyHub;
