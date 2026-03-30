import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  TrendingUp, 
  Zap, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Target,
  ArrowUpRight,
  Gift,
  Crown
} from 'lucide-react';
import axios from 'axios';

const LoyaltyHub = () => {
  const [loading, setLoading] = useState(true);
  const [loyaltyData, setLoyaltyData] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate fetching scoped loyalty intelligence
      setTimeout(() => {
        setLoyaltyData({
          tier: 'GOLD',
          points: 12450,
          rank: 'Top 8%',
          performance_score: 87,
          next_tier: 'PLATINUM',
          points_to_next: 2550,
          commission_benefit: '6%',
          next_commission: '4%',
          activities: [
            { id: 1, action: 'Fast Dispatch (< 2hrs)', points: '+500', date: '2 hours ago', type: 'positive' },
            { id: 2, action: 'High Rating Order #8812', points: '+200', date: '5 hours ago', type: 'positive' },
            { id: 3, action: 'Order Cancellation Penalty', points: '-150', date: '1 day ago', type: 'negative' },
            { id: 4, action: 'Bulk Inventory Audit Bonus', points: '+1000', date: '2 days ago', type: 'positive' },
          ]
        });
        setLoading(false);
      }, 900);
    } catch (err) {
      console.error("Fetch failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTierColor = (tier) => {
    const t = tier?.toUpperCase();
    if (t === 'PLATINUM') return 'from-indigo-500 to-purple-600';
    if (t === 'GOLD') return 'from-amber-400 to-orange-500';
    if (t === 'SILVER') return 'from-slate-300 to-slate-400';
    return 'from-orange-700 to-orange-900'; // BRONZE
  };

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
           <div className="w-16 h-16 relative">
              <div className="absolute inset-0 border-4 border-primary-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              <Star className="absolute inset-0 m-auto text-primary-600 animate-pulse" size={24} />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic animate-pulse">Synchronizing Intelligence Tiers...</p>
        </div>
     );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* ── Top Section: Elite Tier Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tier Card */}
        <div className={`col-span-1 lg:col-span-2 bg-gradient-to-br ${getTierColor(loyaltyData.tier)} p-12 rounded-[60px] shadow-2xl relative overflow-hidden group`}>
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-6 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                    <Crown size={14} className="text-white" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Current Standing</span>
                 </div>
                 <h1 className="text-8xl font-black text-white tracking-tighter italic leading-none drop-shadow-2xl">
                    {loyaltyData.tier}<span className="text-white/40 italic">STATION</span>
                 </h1>
                 <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">Total Points</p>
                       <p className="text-3xl font-black text-white italic">{loyaltyData.points.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-10 bg-white/20" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">Ecosystem Rank</p>
                       <p className="text-3xl font-black text-white italic">{loyaltyData.rank}</p>
                    </div>
                 </div>
              </div>

              <div className="w-48 h-48 rounded-full border-[12px] border-white/10 flex items-center justify-center relative bg-white/5 backdrop-blur-sm shadow-inner group-hover:scale-105 transition-transform duration-700">
                 <div className="text-center">
                    <p className="text-5xl font-black text-white italic">{loyaltyData.performance_score}</p>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">Perf Score</p>
                 </div>
                 <div className="absolute inset-0 border-[12px] border-t-white border-l-white/0 border-r-white/0 border-b-white/0 rounded-full animate-[spin_3s_linear_infinite]" />
              </div>
           </div>
           
           <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 w-full max-w-md">
                 <div className="flex justify-between mb-2">
                    <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Progress to {loyaltyData.next_tier}</p>
                    <p className="text-[10px] font-black text-white uppercase italic tracking-widest">{loyaltyData.points_to_next.toLocaleString()} pts remain</p>
                 </div>
                 <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '75%' }}
                       className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                       transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                 </div>
              </div>
              <button className="bg-white text-slate-900 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-100 transition-all flex items-center gap-2 group-hover:translate-x-2">
                 Simulate Payout <ArrowUpRight size={14} />
              </button>
           </div>
        </div>

        {/* Financial Benefit Card */}
        <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-amber-400 transition-all">
           <div className="space-y-8">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 shadow-sm">
                    <Zap size={24} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Treasury Benefit</h3>
              </div>
              <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Your Commission Rate</p>
                 <p className="text-5xl font-black text-slate-900 italic tracking-tighter">{loyaltyData.commission_benefit}</p>
                 <div className="flex items-center gap-2 mt-4">
                    <ArrowUpRight size={14} className="text-emerald-500" />
                    <p className="text-[10px] font-black text-emerald-600 uppercase italic tracking-widest">
                       Upgrade to {loyaltyData.next_tier} for {loyaltyData.next_commission}
                    </p>
                 </div>
              </div>
           </div>
           <button className="w-full mt-8 py-5 border-2 border-slate-100 rounded-3xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-amber-500 hover:border-amber-100 transition-all italic tracking-[0.2em]">
              Review Marketplace Fee Policy
           </button>
        </div>
      </div>

      {/* ── Bottom Section: Insights & Activities ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Activity Ledger */}
        <div className="bg-white rounded-[50px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
           <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Intelligence Ledger</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Real-time Telemetry Transactions</p>
              </div>
              <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline italic">Full History</button>
           </div>
           <div className="divide-y divide-slate-50">
              {loyaltyData.activities.map(act => (
                <div key={act.id} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                   <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                         act.type === 'positive' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 shadow-rose-500/10'
                      }`}>
                         {act.type === 'positive' ? <Star size={24} /> : <AlertCircle size={24} />}
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase leading-none mb-1.5">{act.action}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase italic opacity-60">{act.date}</p>
                      </div>
                   </div>
                   <div className={`text-xl font-black italic ${act.type === 'positive' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {act.points}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-12 rounded-[60px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/40">
                       <Target size={24} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Growth Engine Insights</h3>
                 </div>
                 
                 <div className="space-y-6">
                    {[
                       { title: 'Fulfillment Velocity', desc: 'Dispatch within 1 hour to gain +500 Gold pts per order.', icon: Briefcase },
                       { title: 'Inventory Hygiene', desc: 'Fix 4 low-stock items today to avoid tier penalties.', icon: Box },
                       { title: 'Customer Sentiment', desc: 'Respond to 3 reviews to boost your Performance Score by +4.', icon: Award }
                    ].map((rec, i) => (
                      <div key={i} className="flex gap-6 p-6 rounded-[32px] hover:bg-white/5 transition-all group/rec cursor-pointer border border-transparent hover:border-white/10">
                         <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/40 group-hover/rec:text-primary-400 transition-colors">
                            <rec.icon size={20} />
                         </div>
                         <div>
                            <p className="text-xs font-black text-white uppercase italic tracking-widest leading-none mb-1.5">{rec.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">{rec.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-emerald-400 transition-colors">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                    <Gift size={28} />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-slate-900 uppercase italic leading-none mb-1">Redeem Rewards</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase italic opacity-60">Unlock elite marketplace features</p>
                 </div>
              </div>
              <ChevronRight className="text-slate-200 group-hover:text-emerald-500 transition-colors" size={32} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyHub;
