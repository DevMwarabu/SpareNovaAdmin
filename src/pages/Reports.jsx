import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  Plus, 
  RefreshCw,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  Loader2,
  PieChart as PieChartIcon,
  Crown,
  Database,
  Cpu
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

const Reports = () => {
  const [stats, setStats] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [hubPerformance, setHubPerformance] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const showToast = (message, type = 'blue') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/reports`);
      if (res.data.success) {
        setStats(res.data.stats);
        setRevenueTrend(res.data.revenueTrend);
        setHubPerformance(res.data.hubPerformance);
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error(`Failed to fetch reports:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (report) => {
    try {
      setIsExporting(report.id);
      const res = await axios.get(`${API_BASE}/admin/reports/export`, { params: { id: report.id } });
      if (res.data.success) {
         showToast(`Branded Executive Asset Generated: ${report.name}`, 'emerald');
      }
    } catch (err) {
      showToast('Export Protocol Failed', 'rose');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      {/* Toast System */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${toast.type}-500 shadow-xl shadow-${toast.type}-500/20`}>
              <Zap size={16} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 shadow-xl shadow-indigo-500/10 border border-indigo-100">
                <BarChart3 size={24} />
             </div>
             Executive Intelligence
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60 italic">Strategic Performance & Hub Governance Analytics</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-xl shadow-emerald-500/10">
              <ShieldCheck size={16} className="animate-pulse" /> Asset Integrity Verified
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-primary-100 transition-colors relative overflow-hidden">
               <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   {i === 0 ? <Crown size={28} /> : i === 1 ? <Database size={28} /> : i === 2 ? <Cpu size={28} /> : <Zap size={28} />}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">{s.l}</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter italic">{s.v}</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-xl uppercase italic">
                {s.c}
              </div>
            </div>
         )) : Array(4).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-28 rounded-3xl"></div>)}
      </div>

      {/* Analytics Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Revenue Pulse */}
         <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <TrendingUp size={18} className="text-indigo-600" /> Revenue Integrity Pulse
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60 italic">Strategic Daily Cash Yield Aggregate</p>
               </div>
               <div className="flex gap-2 text-[9px] font-black uppercase text-slate-400">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">7D Interval</span>
               </div>
            </div>
            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height={288}>
                  <AreaChart data={revenueTrend}>
                     <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8', textTransform: 'uppercase' }}
                        dy={15}
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ 
                           borderRadius: '24px', 
                           border: 'none', 
                           boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                           padding: '16px',
                           fontSize: '12px',
                           fontWeight: '900',
                           textTransform: 'uppercase'
                        }} 
                        itemStyle={{ color: '#4f46e5' }}
                     />
                     <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#4f46e5" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Hub Efficiency */}
         <div className="bg-slate-900 p-10 rounded-[56px] shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-white">
               <BarChart3 size={180} />
            </div>
            <div className="relative z-10 flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <PieChartIcon size={18} className="text-indigo-400" /> Hub Efficiency Matrix
                  </h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 italic">Cross-Node Operational Velocity SLA</p>
               </div>
            </div>
            <div className="h-72 w-full relative z-10">
               <ResponsiveContainer width="100%" height={288}>
                  <BarChart data={hubPerformance} layout="vertical">
                     <XAxis hide type="number" />
                     <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        width={120}
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#818cf8', textTransform: 'uppercase' }}
                     />
                     <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ 
                           borderRadius: '24px', 
                           border: 'none', 
                           boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                           fontSize: '12px',
                           fontWeight: '900',
                           textTransform: 'uppercase',
                           backgroundColor: '#0f172a',
                           color: 'white'
                        }} 
                     />
                     <Bar dataKey="efficiency" radius={[0, 10, 10, 0]}>
                        {hubPerformance.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 0 ? '#818cf8' : '#6366f1'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-4 italic leading-none">
               <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20">
                  <FileText size={18} />
               </div>
               Executive Branded Asset Inventory
            </h3>
            <div className="flex gap-3">
               <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm">
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
               </button>
               <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center gap-3 italic">
                  <Plus size={18} /> New Analysis Task
               </button>
            </div>
        </div>
        
        <div className="divide-y divide-slate-50">
           {reports.map((r) => (
             <div key={r.id} className="p-10 hover:bg-slate-50/50 transition-all group flex items-center justify-between">
                <div className="flex items-center gap-10">
                   <div className="relative">
                      <div className="w-16 h-16 bg-slate-100 rounded-[28px] flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner group-hover:shadow-indigo-500/30 group-hover:scale-110">
                         <FileText size={28} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-xl shadow-lg border border-slate-50 flex items-center justify-center text-emerald-500">
                         <ShieldCheck size={14} />
                      </div>
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors leading-none mb-2">{r.name}</h4>
                      <div className="flex items-center gap-6">
                         <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 uppercase tracking-widest italic">{r.type} ARCHIVE</span>
                         <span className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest italic opacity-60"><Clock size={12} className="text-indigo-400" /> SECURE {r.last_generated}</span>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => handleExport(r)}
                  disabled={isExporting === r.id}
                  className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200/40 relative overflow-hidden"
                >
                   {isExporting === r.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                   {isExporting === r.id ? 'Securing Asset...' : 'Branded PDF Protocol'}
                </button>
             </div>
           ))}
           {reports.length === 0 && !loading && (
             <div className="py-32 text-center text-slate-400 italic">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest italic">Inventory Protocol Null: No Branded Assets Synchronized</p>
             </div>
           )}
        </div>

        <div className="p-10 bg-indigo-50/50 border-t border-indigo-100 flex items-center gap-6">
           <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20">
              <ShieldCheck size={24} />
           </div>
           <div>
              <p className="text-[12px] font-black text-indigo-900 uppercase tracking-widest mb-1 italic">Executive Intelligence Policy</p>
              <p className="text-[10px] text-indigo-700 font-black leading-relaxed uppercase opacity-60 italic">All generated assets include metadata watermarks: "SPARENOVA ADMINISTRATIVE PROPERTY". Authorized audit trails are recorded in the integrity mesh for each asset generation event.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
