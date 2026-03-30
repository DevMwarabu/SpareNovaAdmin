import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Target, 
  MapPin, 
  TrendingUp, 
  Activity, 
  Star, 
  ArrowUpRight,
  PieChart,
  Calendar,
  Search,
  Filter,
  Zap,
  ShieldCheck,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

const CustomerIntelligence = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Principal Data
  const principals = [
    { id: 1, name: 'Brian Omondi', ordersCount: 42, totalValue: 'KES 184,200', loyalty: 'PLATINUM', affinity: 98, risk: 'LOW' },
    { id: 2, name: 'Grace Muriithi', ordersCount: 28, totalValue: 'KES 112,400', loyalty: 'GOLD', affinity: 85, risk: 'MEDIUM' },
    { id: 3, name: 'Hassan Ali', ordersCount: 15, totalValue: 'KES 64,000', loyalty: 'SILVER', affinity: 72, risk: 'LOW' },
    { id: 4, name: 'Kevin Mutua', ordersCount: 8, totalValue: 'KES 32,100', loyalty: 'BRONZE', affinity: 45, risk: 'HIGH' },
  ];

  const hotspots = [
    { region: 'Nairobi West', demand: '84%', color: 'emerald' },
    { region: 'Nairobi CBD', demand: '72%', color: 'blue' },
    { region: 'Karen / Langata', demand: '65%', color: 'purple' },
    { region: 'Thika Road', demand: '48%', color: 'orange' },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic flex items-center gap-3">
             <div className="p-2.5 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 shadow-sm">
                <Target size={28} />
             </div>
             Principal <span className="text-primary-600">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">Advanced Strategic Network Analytics</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border-2 border-slate-100 px-6 py-3.5 rounded-[20px] text-[10px] font-black text-slate-700 shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all uppercase tracking-widest italic">
             Export Ecosystem Graph
           </button>
           <button className="bg-slate-900 text-white px-8 py-3.5 rounded-[20px] text-[10px] font-black shadow-2xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-[0.1em] italic">
             <Zap size={18} /> Launch Loyalty Campaign
           </button>
        </div>
      </div>

      {/* Strategic KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'Network Reach', val: '4,842', change: '+12%', icon: Users, col: 'primary' },
           { label: 'Retention Heuristics', val: '94.2%', change: '+2%', icon: ShieldCheck, col: 'emerald' },
           { label: 'Affinity Index', val: '87/100', change: '+5', icon: Activity, col: 'purple' },
           { label: 'Churn Probability', val: '2.1%', change: '-0.5%', icon: TrendingUp, col: 'rose' }
         ].map((k, i) => (
           <motion.div 
             key={i}
             whileHover={{ y: -5, scale: 1.02 }} 
             className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 group transition-all"
           >
             <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-${k.col}-50 text-${k.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   <k.icon size={28} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${parseFloat(k.change) >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'} px-2.5 py-1.5 rounded-xl uppercase italic tracking-widest`}>
                   {k.change}
                </div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 italic">{k.label}</p>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{k.val}</h3>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Principal Ledger */}
         <div className="lg:col-span-2 bg-white rounded-[60px] border border-slate-100 shadow-sm p-10 shadow-slate-200/50">
            <div className="flex items-center justify-between mb-10 px-4">
               <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">Principal Operational Ledger</h2>
               <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                 <input 
                   placeholder="Search Principals..." 
                   className="bg-slate-50/50 border-none rounded-2xl pl-10 pr-4 py-2.5 text-[10px] font-black uppercase placeholder:text-slate-200 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all italic" 
                 />
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest italic">Identity Node</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest italic">Loyalty Protocol</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest italic text-right">Yield Value</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-400 tracking-widest italic text-center">Status Matrix</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {principals.map(p => (
                        <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-6 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs italic shadow-lg shadow-slate-900/10">
                                 {p.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                 <p className="text-xs font-black text-slate-900 italic uppercase tracking-tight">{p.name}</p>
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Orders: {p.ordersCount}</p>
                              </div>
                           </td>
                           <td className="px-6 py-6">
                              <span className={`px-4 py-1.5 rounded-full ${
                                 p.loyalty === 'PLATINUM' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                                 p.loyalty === 'GOLD' ? 'bg-slate-50 text-slate-600 border border-slate-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                              } text-[9px] font-black uppercase tracking-widest italic shadow-sm`}>
                                 {p.loyalty} STANDING
                              </span>
                           </td>
                           <td className="px-6 py-6 font-black text-xs text-slate-900 italic text-right">{p.totalValue}</td>
                           <td className="px-6 py-6 text-center">
                              <div className="flex flex-col items-center gap-1">
                                 <p className={`text-[10px] font-black italic ${p.risk === 'LOW' ? 'text-emerald-500' : p.risk === 'MEDIUM' ? 'text-orange-500' : 'text-rose-500'}`}>
                                    {p.risk} RISK
                                 </p>
                                 <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${p.risk === 'LOW' ? 'bg-emerald-500' : p.risk === 'MEDIUM' ? 'bg-orange-500' : 'bg-rose-500'}`} style={{ width: `${p.affinity}%` }} />
                                 </div>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Geospatial Intelligence */}
         <div className="space-y-10">
            <div className="bg-slate-900 p-10 rounded-[60px] shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                           <MapPin size={28} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Geospatial Hotspots</h3>
                     </div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-10 opacity-60">Regional Demand Synthesis</p>
                     
                     <div className="space-y-8">
                        {hotspots.map((h, i) => (
                           <div key={i} className="group/hot cursor-pointer">
                              <div className="flex items-center justify-between mb-2">
                                 <p className="text-[11px] font-black text-white uppercase tracking-[0.1em] italic group-hover/hot:text-emerald-400 transition-colors">{h.region}</p>
                                 <p className="text-[10px] font-black text-slate-400 italic">{h.demand} INTENSITY</p>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: h.demand }}
                                    transition={{ delay: i * 0.2, duration: 1 }}
                                    className={`h-full bg-${h.color}-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]`} 
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <button className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between group/bot cursor-pointer hover:bg-white/10 transition-all">
                     <div className="flex items-center gap-4">
                        <PieChart size={20} className="text-primary-400" />
                        <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Generate Demographic Profile</p>
                     </div>
                     <ChevronRight size={16} className="text-white/20 group-hover/bot:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>

            {/* AI Affinity Pulse */}
            <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm shadow-slate-200/50 group hover:border-primary-100 transition-colors cursor-pointer relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <BrainCircuit size={80} />
               </div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform shadow-sm">
                     <Sparkles size={24} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tight leading-none mb-1">Affinity Intelligence</h4>
               </div>
               <p className="text-sm font-medium text-slate-500 italic leading-relaxed mb-8 uppercase tracking-tight">
                  "Neural analysis indicates a <span className="text-purple-600 font-black">15% surge</span> in affinity for Platinum users who received regional fulfillment boosts last cycle."
               </p>
               <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <MessageSquare size={14} className="text-slate-300" />
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">8 Executive Protocols Running</p>
                  </div>
                  <button className="text-[9px] font-black text-primary-600 uppercase tracking-widest italic hover:underline">Execute Optimization</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default CustomerIntelligence;
