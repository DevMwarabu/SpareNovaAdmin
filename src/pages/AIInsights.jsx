import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Star, 
  Activity, 
  ArrowRight,
  RefreshCw,
  Lightbulb,
  BrainCircuit,
  BarChart3,
  ShieldCheck,
  Cpu,
  Fingerprint,
  Radio,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIInsights = () => {
  const [insights, setInsights] = useState([]);
  const [stats, setStats] = useState({
    velocity: '12.4%',
    active_predictions: '842',
    confidence: '98.4%',
    latency: '14ms',
    event_rate: '4.2k',
    node_count: '18'
  });
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/portal/ai-insights`);
      if (res.data.success) {
        setInsights(res.data.insights);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch AI insights:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExecuteOptimization = async (id) => {
    setExecutingId(id);
    // Simulation of tactical response
    setTimeout(() => {
      setExecutingId(null);
      fetchData();
    }, 1500);
  };

  const getImpactColor = (impact) => {
    const i = impact.toLowerCase();
    if (i === 'high') return 'text-rose-600 bg-rose-50 border-rose-100';
    if (i === 'medium') return 'text-orange-600 bg-orange-50 border-orange-100';
    if (i === 'growth') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    return 'text-blue-600 bg-blue-50 border-blue-100';
  };

  const getIcon = (name) => {
    switch (name) {
      case 'TrendingUp': return <TrendingUp size={20} />;
      case 'AlertTriangle': return <AlertTriangle size={20} />;
      case 'Zap': return <Zap size={20} />;
      case 'Star': return <Star size={20} />;
      case 'Activity': return <Activity size={20} />;
      default: return <Sparkles size={20} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 shadow-xl shadow-purple-500/10 border border-purple-100">
                <BrainCircuit size={24} />
             </div>
             Neural Operational Hub
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">AI-Driven Marketplace Heuristics & Ecosystem Synthesis</p>
        </div>
        <div className="flex gap-3">
           <button 
              onClick={fetchData}
              className="bg-white border-2 border-slate-100 text-slate-700 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200/20 hover:scale-105 transition-all flex items-center gap-3 italic"
           >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Regenerate Intel
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-slate-900 rounded-[48px] p-8 text-white relative overflow-hidden group col-span-1 md:col-span-2 shadow-2xl shadow-purple-900/10 border border-white/5">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
               <Cpu size={140} />
            </div>
            
            {/* Neural Pulse SVG Animation */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
               <svg className="w-full h-full" viewBox="0 0 400 200">
                  <motion.path 
                    d="M 50 100 Q 100 20 150 100 T 250 100 T 350 100" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <defs>
                     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#c084fc" />
                     </linearGradient>
                  </defs>
               </svg>
            </div>

            <div className="relative z-10 space-y-6 uppercase italic">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black tracking-widest text-purple-300 border border-white/5">
                  <Radio size={12} className="animate-pulse" /> Neural Network: Synchronized
               </div>
               <h2 className="text-3xl font-black tracking-tight leading-none">System Pulse: <span className="text-purple-400">OPTIMAL</span></h2>
               <p className="text-slate-400 text-xs font-black tracking-tighter leading-relaxed max-w-sm opacity-60">Regional compute clusters are processing {stats.event_rate} marketplace events per second with {stats.confidence} prediction confidence.</p>
               
               <div className="flex items-center gap-10 pt-6 border-t border-white/5">
                   <div>
                     <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">Inference Latency</p>
                     <p className="text-xl font-black text-blue-400 tracking-tighter italic leading-none">{stats.latency}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">Active Mesh Nodes</p>
                     <p className="text-xl font-black text-purple-400 tracking-tighter italic leading-none">{stats.node_count}</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-[40px] p-8 border border-slate-100 flex flex-col justify-between shadow-2xl shadow-slate-200/40 relative overflow-hidden group uppercase italic">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
              <TrendingUp size={80} />
           </div>
           <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit shadow-inner">
              <BarChart3 size={24} />
           </div>
           <div className="mt-8">
             <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">
               {stats.velocity} 
               <span className={`text-sm ml-2 ${parseFloat(stats.velocity) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {parseFloat(stats.velocity) >= 0 ? '↑' : '↓'}
               </span>
             </p>
             <p className="text-[9px] font-black text-slate-400 mt-2 tracking-widest opacity-60">Growth Velocity</p>
           </div>
         </div>

         <div className="bg-white rounded-[40px] p-8 border border-slate-100 flex flex-col justify-between shadow-2xl shadow-slate-200/40 relative overflow-hidden group uppercase italic">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
              <Lightbulb size={80} />
           </div>
           <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl w-fit shadow-inner">
              <Activity size={24} />
           </div>
           <div className="mt-8">
             <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">{stats.active_predictions}</p>
             <p className="text-[9px] font-black text-slate-400 mt-2 tracking-widest opacity-60">Tactical Predictions</p>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-50 h-56 rounded-[48px] border-2 border-dashed border-slate-100"></div>
            ))
         ) : (
          <AnimatePresence>
            {insights.map((insight, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={insight.id} 
                className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden uppercase italic"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 translate-x-12 -translate-y-12 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-1000 ${getImpactColor(insight.impact).split(' ')[1]}`} />
                
                <div className="flex flex-col h-full relative z-10">
                    <div className="flex items-center justify-between mb-8">
                       <span className={`px-5 py-2 rounded-xl text-[9px] font-black tracking-widest border shadow-sm ${getImpactColor(insight.impact)}`}>
                          <div className="w-1 h-1 rounded-full bg-current animate-pulse inline-block mr-2" />
                          {insight.impact} IMPACT SYNTHESIS
                       </span>
                       <span className="text-[10px] font-black text-slate-300 tracking-widest opacity-60">{insight.type}</span>
                    </div>

                    <div className="flex items-start gap-6 flex-1">
                       <div className="w-16 h-16 bg-slate-50 text-slate-900 flex items-center justify-center rounded-3xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-700 shadow-inner border border-slate-100">
                          {getIcon(insight.icon)}
                       </div>
                       <div className="flex-1">
                          <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-purple-600 transition-colors tracking-tight italic">{insight.title}</h3>
                          <p className="text-xs font-black text-slate-500 leading-relaxed opacity-60 tracking-tighter">{insight.description}</p>
                       </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                       <button 
                         onClick={() => handleExecuteOptimization(insight.id)}
                         disabled={executingId === insight.id}
                         className="text-[10px] font-black tracking-widest text-slate-900 flex items-center gap-3 hover:gap-5 transition-all group/btn disabled:opacity-50"
                       >
                          {executingId === insight.id ? <Loader2 size={16} className="animate-spin text-purple-600" /> : <Zap size={16} className="text-purple-500 group-hover/btn:animate-bounce" />}
                          {executingId === insight.id ? 'SYNCHRONIZING HUB...' : 'DISPATCH TACTICAL OPTIMIZATION'} 
                          <ArrowRight size={14} className="opacity-40" />
                       </button>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
         )}
      </div>
    </div>
  );
};

export default AIInsights;
