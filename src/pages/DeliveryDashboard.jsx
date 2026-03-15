import React from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Clock
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

const DeliveryDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Logistics Command</h1>
          <p className="text-slate-500 font-medium">Coordinate your fleet and track deliveries live.</p>
        </div>
        <button className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
          <Navigation size={20} /> Live Map
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Trips" value="24" change={15} icon={Navigation} color="orange" />
        <StatCard title="Fleet Status" value="98%" change={1.2} icon={Truck} color="blue" />
        <StatCard title="Avg. Time" value="45m" change={-5} icon={Clock} color="purple" />
        <StatCard title="Total Volume" value="KES 890k" change={8.4} icon={TrendingUp} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900">Active Deliveries</h2>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-6 items-center p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center text-orange-600 shadow-sm">
                  <Truck size={24} />
                  <span className="text-[8px] font-black mt-1">V-{100+i}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-900">Westlands Route - #DLV-404{i}</span>
                    <span className="text-[10px] font-black text-orange-500 uppercase">In Transit</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin size={12} /> CBD Hub 
                      <span className="mx-2 text-slate-300">→</span>
                      Westlands Square
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">12 min</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Estimated Arrv.</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white">
          <h2 className="text-xl font-black mb-6">Fleet Utilization</h2>
          <div className="space-y-8 mt-12">
            <div className="relative flex justify-center">
              <div className="w-40 h-40 rounded-full border-[12px] border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-black text-orange-500">92%</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Capacity</div>
                </div>
              </div>
              <svg className="absolute top-0 left-1/2 -ml-20 w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="74" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="465" strokeDashoffset="37" className="text-orange-500 transition-all duration-1000" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Available</div>
                    <div className="text-xl font-black text-white">12</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Service</div>
                    <div className="text-xl font-black text-red-500">2</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
