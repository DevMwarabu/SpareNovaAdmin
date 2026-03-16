import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock
} from 'lucide-react';

import CustomModal from '../components/CustomModal';

const API_BASE = 'http://localhost:8003/api/v1';

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const IconComponent = {
    Wallet,
    ShoppingBag,
    Users,
    TrendingUp,
    Package,
    Clock
  }[Icon] || Wallet;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center shadow-lg shadow-${color}-500/10`}>
          <IconComponent size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-black ${change >= 0 ? 'text-emerald-500' : 'text-red-500'} bg-slate-50 px-2 py-1 rounded-lg`}>
          {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</div>
        <div className="text-2xl font-black text-slate-900">{value}</div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [channelDistribution, setChannelDistribution] = useState([]);
  const [growthSignal, setGrowthSignal] = useState({ title: 'System Analytics', message: 'Analyzing data metrics...' });
  const [logisticsHub, setLogisticsHub] = useState({ title: 'Logistics Monitor', message: 'Monitoring delivery routes...' });
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const fetchData = async (currentDays) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/dashboard/stats?days=${currentDays}`);
      if (response.data.success) {
        setStats(response.data.stats);
        setRecentOrders(response.data.recentOrders);
        setChartData(response.data.chartData);
        setChannelDistribution(response.data.channelDistribution || []);
        if (response.data.growthSignal) setGrowthSignal(response.data.growthSignal);
        if (response.data.logisticsHub) setLogisticsHub(response.data.logisticsHub);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(days);
  }, [days]);

  // Line Graph logic
  const maxVal = Math.max(...chartData.map(d => d.value), 1000);
  
  // Bezier Curve calculation
  const getPath = (isClosed = false) => {
    if (chartData.length < 2) return "";
    
    let d = `M 0,${100 - (chartData[0].value / maxVal) * 100}`;
    
    for (let i = 0; i < chartData.length - 1; i++) {
      const x1 = (i / (chartData.length - 1)) * 100;
      const y1 = 100 - (chartData[i].value / maxVal) * 100;
      const x2 = ((i + 1) / (chartData.length - 1)) * 100;
      const y2 = 100 - (chartData[i + 1].value / maxVal) * 100;
      
      const cx = (x1 + x2) / 2;
      d += ` C ${cx},${y1} ${cx},${y2} ${x2},${y2}`;
    }
    
    if (isClosed) {
      d += ` L 100,100 L 0,100 Z`;
    }
    
    return d;
  };

  const curvePath = getPath(false);
  const areaPath = getPath(true);

  if (loading && stats.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleExport = () => {
    setModalConfig({
      isOpen: true,
      title: 'Report Ready',
      message: 'Your system performance report has been generated and is ready for download.',
      type: 'success'
    });
  };

  const handleGenerate = () => {
    setModalConfig({
      isOpen: true,
      title: 'Deep Scan Started',
      message: 'The system has started a deep analytics scan. The results will appear on your dashboard within seconds.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
      <CustomModal 
        {...modalConfig}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back, admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Export Report
          </button>
          <button 
            onClick={handleGenerate}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all active:scale-95"
          >
            Generate Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Line Graph */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 px-1">Revenue Trend</h2>
              <select 
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={365}>Last Year</option>
              </select>
            </div>
            
            <div className="h-64 relative px-2">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded-[2.5rem] backdrop-blur-[1px]">
                  <div className="animate-pulse text-primary-500 font-bold">Refining...</div>
                </div>
              )}
              
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible group">
                <defs>
                  <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-500)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="bar-grad-hover" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-600)" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0.5" />
                  </linearGradient>
                  <filter id="bar-shadow" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                    <feOffset dx="0" dy="2" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.1" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Bars */}
                {chartData.map((d, i) => {
                  const barWidth = (100 / chartData.length) * 0.5;
                  const barX = (i / chartData.length) * 100 + ((100 / chartData.length) * 0.25);
                  const barHeight = (d.value / maxVal) * 100 || 1; // Minimum 1px height
                  const barY = 100 - barHeight;
                  const isHovered = hoveredPoint && hoveredPoint.label === d.label;

                  return (
                    <motion.rect
                      key={`bar-${i}`}
                      initial={{ height: 0, y: 100 }}
                      animate={{ height: barHeight, y: barY }}
                      transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                      x={barX}
                      width={barWidth}
                      rx={2} // Rounded tops
                      fill={isHovered ? "url(#bar-grad-hover)" : "url(#bar-grad)"}
                      filter={isHovered ? "url(#bar-shadow)" : ""}
                      className="cursor-pointer transition-colors duration-300"
                      onMouseEnter={() => setHoveredPoint({ ...d, x: barX + (barWidth / 2), y: barY })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}
              </svg>

              {/* Distort-Free Tooltip */}
              <AnimatePresence mode="wait">
                {hoveredPoint && (
                  <motion.div
                    key="chart-tooltip"
                    initial={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                    exit={{ opacity: 0, scale: 0.9, x: "-50%" }}
                    style={{
                      left: `${hoveredPoint.x}%`,
                      top: `${hoveredPoint.y}%`,
                      marginTop: '-8px'
                    }}
                    className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full"
                  >
                    <div className="bg-[#e0f2f1] text-[#00695c] text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xl shadow-slate-900/10 border border-[#b2dfdb] whitespace-nowrap">
                       {hoveredPoint.label}: {hoveredPoint.value.toLocaleString()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-between mt-6 px-2">
              {chartData.filter((_, idx) => days === 365 ? idx % 3 === 0 : (days === 30 ? idx % 6 === 0 : true)).map((d, i) => (
                <span key={i} className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">{d.label}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50">
              <h2 className="text-xl font-black text-slate-900 mb-6 px-1">Recent Activity</h2>
              <div className="space-y-6">
                {recentOrders.map((o, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${o.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {o.status === 'Completed' ? <Package size={18} /> : <Clock size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[11px] font-black text-slate-900">{o.customer}</span>
                        <span className="text-[10px] font-bold text-slate-400">{o.time}</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 leading-none">{o.item} • {o.amount}</div>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <div className="text-center py-8 text-slate-400 font-medium text-xs">No recent activity</div>
                )}
              </div>
              <button 
                onClick={() => window.location.href = '/admin/payments'}
                className="w-full mt-8 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-100 transition-colors uppercase tracking-widest"
              >
                View All Orders
              </button>
            </div>

            {/* Logistics Hub (Dynamic real-time monitor) */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 shadow-lg shadow-primary-500/10">
                  <TrendingUp size={32} />
               </div>
               <h3 className="font-black text-slate-900 mb-2">{logisticsHub.title}</h3>
               <p className="text-xs text-slate-500 font-medium px-4 leading-relaxed">{logisticsHub.message}</p>
            </div>
          </div>
        </div>

        {/* Channel Distribution Column (Matching screenshot) */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#0a0f1b] p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-2xl font-black italic tracking-tight mb-1">Channel Distribution</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Revenue by business type</p>

              <div className="space-y-10">
                {channelDistribution.map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 tracking-wider">{item.name}</span>
                      <span className="text-[10px] font-black text-white">{item.percentage}% • {item.amount}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                        className="h-full bg-primary-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Growth Signal Card */}
              <div className="mt-16 bg-slate-800/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center border border-primary-500/20 shadow-lg shadow-primary-500/10">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white leading-tight">{growthSignal.title}</h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">{growthSignal.message}</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-primary-400 transition-colors">
                  Read AI Analysis <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
            
            {/* Background Grain/Texture (Subtle UI Polish) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
