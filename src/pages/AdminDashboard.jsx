import React from 'react';
import { motion } from 'framer-motion';
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

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col justify-between"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center shadow-lg shadow-${color}-500/10`}>
        <Icon size={24} />
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

const Dashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: 'KES 1.2M', change: 12.5, icon: Wallet, color: 'blue' },
    { title: 'Active Shops', value: '142', change: 8.2, icon: ShoppingBag, color: 'emerald' },
    { title: 'Total Users', value: '2.4k', change: -2.4, icon: Users, color: 'purple' },
    { title: 'Growth Rate', value: '24.8%', change: 4.1, icon: TrendingUp, color: 'orange' },
  ];

  const recentOrders = [
    { id: '#ORD-7281', customer: 'Alex M.', item: 'Brake Pads', amount: 'KES 4,500', status: 'Pending', time: '2m ago' },
    { id: '#ORD-7280', customer: 'Sarah K.', item: 'Oil Filter', amount: 'KES 1,200', status: 'Completed', time: '15m ago' },
    { id: '#ORD-7279', customer: 'Mike P.', item: 'Spark Plugs', amount: 'KES 3,800', status: 'Completed', time: '1h ago' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back, admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">Export Report</button>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">Generate Analytics</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 px-1">Revenue Trend</h2>
            <select className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 70, 50, 90, 60, 80, 100].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1, duration: 1 }}
                className="w-full bg-gradient-to-t from-blue-500/20 to-blue-500 rounded-t-xl group relative cursor-pointer"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h + i*1.5}k
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</span>)}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
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
          </div>
          <button className="w-full mt-8 py-3 border-2 border-slate-50 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-widest">View All Orders</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
