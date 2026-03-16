import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Wrench, 
  Users, 
  CheckCircle,
  ArrowUpRight,
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

const GarageDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Garage Hub</h1>
          <p className="text-slate-500 font-medium">Manage service bookings and mechanic assignments.</p>
        </div>
        <button className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
          <Calendar size={20} /> View Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Monthly Bookings" value="84" change={12} icon={Calendar} color="purple" />
        <StatCard title="Active Services" value="12" change={3.4} icon={Clock} color="primary" />
        <StatCard title="Mechanics" value="8" change={0} icon={Users} color="emerald" />
        <StatCard title="Completed" value="342" change={24} icon={CheckCircle} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-slate-900 mb-6 font-display">Active Bookings</h2>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="group p-4 rounded-2xl border border-slate-50 hover:border-purple-100 hover:bg-purple-50/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                    KB{i}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Toyota Vanguard - Full Service</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer: David M. • 09:00 AM</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2].map(m => <div key={m} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" title="Mechanic"></div>)}
                  </div>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-purple-600 hover:text-white rounded-lg text-xs font-black transition-all">Assign</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
          <h2 className="text-xl font-black text-slate-900 mb-6">Service Mix</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-1">General Service</div>
              <div className="h-8 bg-slate-50 rounded-lg overflow-hidden flex items-center px-4 relative">
                <div className="absolute inset-y-0 left-0 bg-purple-100 w-[60%]"></div>
                <span className="relative z-10 text-xs font-bold text-purple-700">60%</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-1">Body Work</div>
              <div className="h-8 bg-slate-50 rounded-lg overflow-hidden flex items-center px-4 relative">
                <div className="absolute inset-y-0 left-0 bg-primary-100 w-[25%]"></div>
                <span className="relative z-10 text-xs font-bold text-primary-700">25%</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-1">Diagnostics</div>
              <div className="h-8 bg-slate-50 rounded-lg overflow-hidden flex items-center px-4 relative">
                <div className="absolute inset-y-0 left-0 bg-emerald-100 w-[15%]"></div>
                <span className="relative z-10 text-xs font-bold text-emerald-700">15%</span>
              </div>
            </div>
          </div>
          </div>
          <button className="w-full mt-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 active:scale-95 transition-all">Optimize Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default GarageDashboard;
