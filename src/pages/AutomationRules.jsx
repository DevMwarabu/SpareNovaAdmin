import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Plus, 
  Settings2, 
  Play, 
  Pause, 
  Trash2, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Target,
  Box,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  BrainCircuit
} from 'lucide-react';

const AutomationRules = () => {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState([
    { id: 1, name: 'Platinum Priority Protocol', trigger: 'Customer Tier: PLATINUM', action: 'Set Order Priority: HIGH', status: 'active', lastRan: '2m ago' },
    { id: 2, name: 'Inventory Protection Sync', trigger: 'Stock < 5 Units', action: 'Broadcast Out-of-Stock Alert', status: 'active', lastRan: '1h ago' },
    { id: 3, name: 'Tactical Pricing Wedge', trigger: 'Competitor Price Change > 5%', action: 'Notify Institutional Owner', status: 'paused', lastRan: '2d ago' },
    { id: 4, name: 'Auto-Fulfillment Engine', trigger: 'Order Value < KES 5,000', action: 'Auto-Accept & Confirm', status: 'active', lastRan: '14m ago' },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const toggleStatus = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic flex items-center gap-3">
             <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 shadow-sm">
                <Zap size={28} />
             </div>
             Automation <span className="text-purple-600">Engine</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">Heuristic Workflow & Logistic Synthesizer</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-[20px] text-[10px] font-black shadow-2xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-[0.1em] italic">
           <Plus size={18} /> Initialize New Heuristic
        </button>
      </div>

      {/* Strategic Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tight px-4">Active Decision Matrix</h2>
            <div className="grid grid-cols-1 gap-6">
               {rules.map((rule, idx) => (
                  <motion.div 
                    layout
                    key={rule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm group hover:shadow-2xl hover:shadow-slate-200/40 transition-all relative overflow-hidden italic ${
                       rule.status === 'paused' ? 'opacity-60 grayscale' : ''
                    }`}
                  >
                     <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                        <BrainCircuit size={120} />
                     </div>
                     
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                        <div className="flex items-start gap-8 flex-1">
                           <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner border-2 ${
                              rule.status === 'active' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                           }`}>
                              {idx === 0 ? <Star size={24} /> : idx === 1 ? <Box size={24} /> : idx === 2 ? <DollarSign size={24} /> : <ShoppingCart size={24} />}
                           </div>
                           <div className="space-y-4">
                              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none italic">{rule.name}</h3>
                              <div className="flex flex-col gap-2">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trigger:</span>
                                    <span className="text-[10px] font-black text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 uppercase">{rule.trigger}</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Action:</span>
                                    <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-lg border border-primary-100 uppercase italic underline decoration-primary-200 decoration-2">{rule.action}</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-4">
                           <div className="text-right hidden md:block">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Execution Velocity</p>
                              <div className="flex items-center gap-2 text-emerald-500">
                                 <Clock size={10} />
                                 <span className="text-[10px] font-black italic">{rule.lastRan}</span>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => toggleStatus(rule.id)}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                                 rule.status === 'active' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                 {rule.status === 'active' ? <Pause size={20} /> : <Play size={20} />}
                              </button>
                              <button className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center">
                                 <Trash2 size={20} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Intelligence Sidebar */}
         <div className="space-y-10">
            {/* Automation Power Grid */}
            <div className="bg-slate-900 p-10 rounded-[60px] shadow-2xl relative overflow-hidden group flex flex-col">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="w-12 h-12 rounded-2xl bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/40">
                        <Activity size={28} />
                     </div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Engine Telemetry</h3>
                  </div>

                  <div className="space-y-8">
                     {[
                        { label: 'Active Heuristics', val: '14', col: 'emerald' },
                        { label: 'Auto-Fulfill Rate', val: '92.4%', col: 'primary' },
                        { label: 'Neural Accuracy', val: '99.9%', col: 'purple' },
                        { label: 'Manual Overrides', val: '0', col: 'slate' }
                     ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between group/t cursor-default">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic group-hover/t:text-white transition-colors">{t.label}</p>
                           <p className={`text-xl font-black text-${t.col === 'primary' ? 'primary-400' : (t.col === 'slate' ? 'slate-400' : t.col + '-400')} italic`}>{t.val}</p>
                        </div>
                     ))}
                  </div>

                  <button className="mt-12 w-full p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between group/bot cursor-pointer hover:bg-white/10 transition-all">
                     <div className="flex items-center gap-4">
                        <Settings2 size={20} className="text-primary-400" />
                        <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Master Reset Protocal</p>
                     </div>
                     <ShieldCheck size={16} className="text-white/20" />
                  </button>
               </div>
            </div>

            {/* Quick Suggestions Hub */}
            <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm shadow-slate-200/50 group hover:border-primary-100 transition-colors">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform shadow-sm">
                     <AlertTriangle size={24} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tight leading-none mb-1">Tactical Hacks</h4>
               </div>
               <div className="space-y-4">
                  {[
                     'Auto-blacklist fraudulent IDs',
                     'Smart Payout Thresholds',
                     'Geo-fenced Delivery Rules'
                  ].map((h, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl hover:bg-white border border-transparent hover:border-slate-100 transition-all group/h cursor-pointer">
                        <p className="text-[10px] font-black text-slate-500 uppercase italic tracking-tight group-hover/h:text-slate-900 truncate">{h}</p>
                        <ChevronRight size={14} className="text-slate-300 group-hover/h:text-primary-600 transition-transform group-hover/h:translate-x-1" />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AutomationRules;
