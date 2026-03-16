import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  Calendar,
  Filter,
  Download,
  DollarSign,
  PieChart,
  ArrowRight
} from 'lucide-react';

const MetricCard = ({ title, value, change, label, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
    <div className="flex justify-between items-start mb-4">
      <div className={`text-[10px] font-black uppercase tracking-widest text-slate-400`}>{title}</div>
      <div className={`flex items-center gap-1 text-[10px] font-black ${change >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-lg`}>
        {change >= 0 ? '+' : ''}{change}%
      </div>
    </div>
    <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{value}</div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</div>
  </div>
);

const Analytics = () => {
  const API_BASE = 'http://localhost:8003/api/v1';
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/dashboard/analytics?days=${days}`);
        if(res.data.success) {
          setMetrics(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [days]);

  const handleExport = () => {
    if (!metrics) return;
    const headers = ['Metric', 'Value', 'Change'];
    const rows = metrics.primaryMetrics.map(m => [m.title, m.value, `${m.change}%`]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    
    link.href = url;
    link.setAttribute('download', `SpareNova_Analytics_Report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-3xl">
          <div className="animate-pulse text-primary-600 font-black">Syncing Data...</div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <BarChart3 size={20} className="text-primary-600" />
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Hub</h1>
          </div>
          <p className="text-slate-500 font-medium">Deep dive into platform performance and growth metrics.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all outline-none"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={365}>Last 12 Months</option>
          </select>
          <button 
            onClick={handleExport}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary-500/30 hover:bg-primary-700 flex items-center gap-2 transition-all active:scale-95"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics?.primaryMetrics?.map((m, i) => (
          <MetricCard key={i} title={m.title} value={m.value} change={m.change} label={m.label} />
        )) || Array(4).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-32 rounded-3xl"></div>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Monthly Growth</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue vs Retention</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-primary-600"><span className="w-2 h-2 rounded-full bg-primary-600"></span> Revenue</span>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-300"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Target</span>
            </div>
          </div>
          
          <div className="h-72 flex items-end justify-between gap-3 px-2">
            {metrics?.chartData?.heights.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 1 }}
                  className="w-full bg-slate-50 hover:bg-primary-600 transition-colors rounded-[12px] cursor-pointer group relative"
                >
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                     {metrics.chartData.rawValues[i]}
                   </div>
                </motion.div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{metrics.chartData.labels[i]}</span>
              </div>
            )) || <div className="animate-pulse w-full h-full bg-slate-50 rounded-2xl"></div>}
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="bg-slate-900 p-8 rounded-[40px] text-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black mb-1 italic">Channel Distribution</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Revenue by business type</p>
            
            <div className="space-y-6">
              {metrics?.channelDistribution?.map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                    <span className="text-slate-400">{s.label}</span>
                    <span className="text-slate-100">{s.p}% • {s.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${s.p}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className={`h-full bg-${s.color.split('-')[0]}-${s.color.split('-')[1]}`} />
                  </div>
                </div>
              )) || <div className="space-y-4">{Array(3).fill(0).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse"></div>)}</div>}
            </div>
          </div>
          
          {metrics?.growthSignal && (
            <div className="mt-12 bg-white/5 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-xs font-black">{metrics.growthSignal.title}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{metrics.growthSignal.message}</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors">
                Read AI Analysis <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Users</p>
            <p className="text-xl font-black text-slate-900">{metrics?.engagementMetrics?.activeUsers || '...'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">New Units</p>
            <p className="text-xl font-black text-slate-900">{metrics?.engagementMetrics?.newUnits || '...'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">AOV Target</p>
            <p className="text-xl font-black text-slate-900">{metrics?.engagementMetrics?.aovTarget || '...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
