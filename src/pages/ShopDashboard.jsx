import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  DollarSign,
  ArrowUpRight,
  Plus
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center`}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
        <ArrowUpRight size={14} /> {change}%
      </div>
    </div>
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</div>
    <div className="text-2xl font-black text-slate-900">{value}</div>
  </motion.div>
);

const ShopDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop Console</h1>
          <p className="text-slate-500 font-medium">Manage your inventory and track sales performance.</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Monthly Sales" value="KES 450k" change={18} icon={DollarSign} color="emerald" />
        <StatCard title="Orders" value="128" change={5.4} icon={ShoppingCart} color="blue" />
        <StatCard title="Total Products" value="1,240" change={2.1} icon={Package} color="purple" />
        <StatCard title="Low Stock" value="12 Items" change={-12} icon={AlertTriangle} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-slate-900 mb-6">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Order ID</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Product</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Price</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3, 4].map(i => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-xs text-slate-900">#ORD-100{i}</td>
                    <td className="py-4 font-medium text-xs text-slate-600">Premium Brake Pad X{i}</td>
                    <td className="py-4 font-bold text-xs text-slate-900">KES 4,500</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tight">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h2 className="text-xl font-black mb-6 relative z-10">Stock Insights</h2>
          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Fast Moving Items</span>
                <span className="text-emerald-400">72%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full">
                <div className="h-full bg-emerald-500 w-[72%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Returns Rate</span>
                <span className="text-red-400">2.1%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full">
                <div className="h-full bg-red-500 w-[2.1%] rounded-full"></div>
              </div>
            </div>
            <button className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black transition-all uppercase tracking-widest">Generate Stock Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
