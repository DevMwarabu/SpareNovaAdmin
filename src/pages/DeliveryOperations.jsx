import { API_BASE } from '../api/config';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Clock,
  Navigation2,
  Zap,
  Users,
  Box,
  ChevronRight,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const DeliveryOperations = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Pending Pickups', value: '14', change: '5 urgent', col: 'orange', icon: Package },
    { label: 'Active Transit', value: '22', change: 'Live Tracking', col: 'blue', icon: Truck },
    { label: 'Success Rate', value: '98.2%', change: '+0.5% vs LW', col: 'emerald', icon: Zap },
  ]);

  

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate fetching scoped delivery data
      setTimeout(() => {
        setJobs([
          { id: 1, order: 'ORD-9901', shop: 'Nairobi Auto Parts', destination: 'Karen Garage Node', item: 'Radiator Assembly', status: 'Pending Pickup', priority: 'High' },
          { id: 2, order: 'ORD-9905', shop: 'Westlands Spares', destination: 'Langata Hub', item: 'Suspension Kit', status: 'In Transit', priority: 'Medium' },
          { id: 3, order: 'ORD-9912', shop: 'Industrial Area WH', destination: 'City Center Ops', item: 'Brake Disc x4', status: 'Arriving', priority: 'Low' },
        ]);
        setLoading(false);
      }, 700);
    } catch (err) {
      console.error("Fetch failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const StatusPill = ({ status }) => {
    const s = status.toLowerCase();
    const colors = {
      'pending pickup': 'bg-orange-50 text-orange-600 border-orange-100',
      'in transit': 'bg-blue-50 text-blue-600 border-blue-100',
      'arriving': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'delayed': 'bg-rose-50 text-rose-600 border-rose-100',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${colors[s] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic">
            <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
              <Truck size={24} />
            </div>
            Logistics <span className="text-orange-500">Command</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60 italic">Fleet Lifecycle & Route Optimization Hub</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 flex items-center gap-2 transition-all italic">
             <Navigation size={16} /> Deploy Route Optimization
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-orange-100 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight italic">{s.value}</p>
              </div>
            </div>
            <div className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase italic group-hover:bg-orange-50 group-hover:text-orange-600">
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-[32px] w-full max-w-sm shadow-inner">
            <button 
              onClick={() => setActiveTab('queue')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[24px] transition-all flex items-center justify-center gap-2 ${activeTab === 'queue' ? 'bg-white text-slate-900 shadow-2xl shadow-slate-200 border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Box size={16} /> Job Queue
            </button>
            <button 
              onClick={() => setActiveTab('fleet')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[24px] transition-all flex items-center justify-center gap-2 ${activeTab === 'fleet' ? 'bg-white text-slate-900 shadow-2xl shadow-slate-200 border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Navigation2 size={16} /> Fleet Track
            </button>
          </div>
          
          <div className="flex gap-2">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors" size={14} />
                <input placeholder="SCAN ORDER ID..." className="bg-slate-50 border-none rounded-2xl pl-10 pr-6 py-3 text-[10px] font-black placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-orange-500/5 transition-all uppercase italic" />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Establishing Satellite Uplink...</p>
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'queue' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Consignment Node</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Route Logic</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Status</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {jobs.map(j => (
                        <tr key={j.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm italic">
                                <Package size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 leading-none mb-1.5 italic uppercase">{j.order}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{j.item}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase italic">From:</span>
                                <span className="text-[10px] font-black text-slate-900 uppercase italic underline decoration-orange-200">{j.shop}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase italic">To:</span>
                                <span className="text-[10px] font-black text-slate-900 uppercase italic">{j.destination}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex flex-col gap-2">
                               <StatusPill status={j.status} />
                               {j.priority === 'High' && (
                                 <span className="flex items-center gap-1 text-[8px] font-black uppercase text-rose-500 italic animate-pulse">
                                    <AlertCircle size={8} /> Urgent Consignment
                                 </span>
                               )}
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-orange-600 transition-all opacity-0 group-hover:opacity-100 italic">
                                Assign Agent
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* AI Intelligence Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-10 rounded-[60px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-orange-500/20 transition-all duration-1000" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                    <TrendingUp size={20} />
                 </div>
                 <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Consignment Intelligence</h3>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed italic border-l-2 border-orange-500/50 pl-6 mb-8 uppercase tracking-tight">
                "Heavy congestion detected on Mombasa Road. We have recalculated 14 routes for your fleet, saving an estimated 112 minutes of aggregate transit time."
              </p>
            </div>
            <button className="flex items-center gap-3 text-orange-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors group/btn italic">
               Activate Intelligent Rerouting <ChevronRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                  <Activity size={20} />
               </div>
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Fleet Velocity Live</h3>
            </div>
            <div className="space-y-4">
               {[
                 { agent: 'Driver 08', unit: 'Motorcycle A-02', speed: '42 km/h', target: 'Westlands' },
                 { agent: 'Driver 14', unit: 'Van L-09', speed: '18 km/h (Slow)', target: 'Karen Hub' },
                 { agent: 'Driver 21', unit: 'Motorcycle B-11', speed: '48 km/h', target: 'Industrial Area' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-slate-100 hover:border-orange-100 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black italic">
                          {item.agent.split(' ')[1]}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-700 italic uppercase leading-none">{item.agent}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{item.unit}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-[10px] font-black italic ${item.speed.includes('Slow') ? 'text-rose-500' : 'text-emerald-500'}`}>{item.speed}</p>
                       <p className="text-[8px] font-black text-slate-400 uppercase italic mt-0.5">{item.target}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
          <button className="w-full mt-8 py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-all italic tracking-[0.2em]">
             Open Full Logistics Map Gateway
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOperations;
