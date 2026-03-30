import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Clock, 
  Calendar, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Zap,
  Users,
  Settings as SettingsIcon,
  ShoppingBag
} from 'lucide-react';
import axios from 'axios';

const GarageOperations = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Active Bookings', value: '12', change: '+2 today', col: 'blue', icon: Calendar },
    { label: 'Installation Jobs', value: '8', change: '4 arriving', col: 'emerald', icon: Package },
    { label: 'Service Efficiency', value: '94%', change: 'SLA Optimal', col: 'purple', icon: Zap },
  ]);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate fetching scoped garage data
      // In production: const res = await axios.get(`${API_BASE}/portal/garage/operations`);
      setTimeout(() => {
        setBookings([
          { id: 1, customer: 'John Doe', service: 'Full Service - Toyota Vitz', date: '2026-03-30', time: '10:00 AM', status: 'In Progress', type: 'Direct Booking' },
          { id: 2, customer: 'Jane Smith', service: 'Brake Pad Replacement', date: '2026-03-30', time: '02:30 PM', status: 'Pending', type: 'Installation' },
          { id: 3, customer: 'Mike Ross', service: 'Oil Change', date: '2026-03-31', time: '09:00 AM', status: 'Confirmed', type: 'Direct Booking' },
        ]);
        setInstallations([
          { id: 101, part: 'Brembo Brake Pads', order_no: 'ORD-8821', shop: 'Nairobi Brake Center', status: 'In Transit', eta: '2 hours' },
          { id: 102, part: 'Castrol Edge 5W-30', order_no: 'ORD-8825', shop: 'Lubricant Hub', status: 'Ready for Install', eta: 'Arrived' },
        ]);
        setLoading(false);
      }, 800);
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
      'in progress': 'bg-blue-50 text-blue-600 border-blue-100',
      'pending': 'bg-orange-50 text-orange-600 border-orange-100',
      'confirmed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'in transit': 'bg-indigo-50 text-indigo-600 border-indigo-100',
      'ready for install': 'bg-purple-50 text-purple-600 border-purple-100'
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
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
              <Wrench size={24} />
            </div>
            Garage Ops <span className="text-emerald-500">Command</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60 italic">Installation Jobs & Service Lifecycle Management</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
             <Plus size={14} /> New Manual Booking
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-100 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight italic">{s.value}</p>
              </div>
            </div>
            <div className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase italic group-hover:bg-emerald-50 group-hover:text-emerald-600">
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50">
          <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-[32px] w-full max-w-lg shadow-inner">
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[24px] transition-all flex items-center justify-center gap-2 ${activeTab === 'bookings' ? 'bg-white text-slate-900 shadow-2xl shadow-slate-200 border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Calendar size={16} /> Service Matrix
            </button>
            <button 
              onClick={() => setActiveTab('installations')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[24px] transition-all flex items-center justify-center gap-2 ${activeTab === 'installations' ? 'bg-white text-slate-900 shadow-2xl shadow-slate-200 border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Package size={16} /> Installation Jobs
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[24px] transition-all flex items-center justify-center gap-2 ${activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-2xl shadow-slate-200 border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ShoppingBag size={16} /> Unit Stock
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Initializing Command Console...</p>
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'bookings' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Job Node</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Scheduling</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Lifecycle</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {bookings.map(b => (
                        <tr key={b.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm italic">
                                {b.customer.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 leading-none mb-1.5 italic uppercase">{b.customer}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{b.service}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex flex-col gap-1">
                              <p className="text-[11px] font-black text-slate-700 italic leading-none">{b.date}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{b.time}</p>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <StatusPill status={b.status} />
                          </td>
                          <td className="px-10 py-6 text-right">
                             <button className="p-2 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all opacity-0 group-hover:opacity-100">
                                <ChevronRight size={18} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'installations' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Component Asset</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Origin Node</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Status</th>
                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {installations.map(ins => (
                        <tr key={ins.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm italic">
                                <Package size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 leading-none mb-1.5 italic uppercase">{ins.part}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">{ins.order_no}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <p className="text-[11px] font-black text-slate-700 italic underline decoration-slate-200">{ins.shop}</p>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex flex-col gap-1">
                               <StatusPill status={ins.status} />
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic italic">ETA: {ins.eta}</p>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-emerald-600 transition-all opacity-0 group-hover:opacity-100 italic">
                                Update Logistics
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <TrendingUp size={20} />
                 </div>
                 <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Operational Intelligence</h3>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed italic border-l-2 border-emerald-500/50 pl-6 mb-8 uppercase tracking-tight">
                "Brake Pad installation jobs have increased by 40% this week. We recommend adding 1 technician to the Friday afternoon shift to maintain SLA compliance."
              </p>
            </div>
            <button className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors group/btn italic">
               Deploy Staffing Optimization <ChevronRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                  <Clock size={20} />
               </div>
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Upcoming Schedule</h3>
            </div>
            <div className="space-y-4">
               {[
                 { time: '10:00 AM', job: 'Major Engine Service', unit: 'Toyota Prado' },
                 { time: '11:30 AM', job: 'Suspension Check', unit: 'BMW X5' },
                 { time: '02:00 PM', job: 'Hybrid Battery Diag', unit: 'Toyota Aqua' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-100 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg italic">{item.time}</span>
                       <span className="text-xs font-black text-slate-700 italic uppercase">{item.job}</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase group-hover:text-emerald-500 transition-colors uppercase italic">{item.unit}</span>
                 </div>
               ))}
            </div>
          </div>
          <button className="w-full mt-8 py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-all italic tracking-[0.2em]">
             View Full Governance Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GarageOperations;
