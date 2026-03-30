import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Wrench, 
  Users, 
  CheckCircle,
  ArrowUpRight,
  Clock,
  Plus
} from 'lucide-react';


const StatCard = ({ title, value, change, icon, color }) => {
  const IconComponent = {
    Calendar: Calendar,
    Clock: Clock,
    Users: Users,
    CheckCircle: CheckCircle
  }[icon] || Calendar;

  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center`}>
          <IconComponent size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-black ${change >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-lg`}>
          <ArrowUpRight size={14} className={change < 0 ? 'rotate-90' : ''} /> {Math.abs(change)}%
        </div>
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
    </motion.div>
  );
};

const GarageDashboard = () => {
  const [stats, setStats] = React.useState([]);
  const [activeBookings, setActiveBookings] = React.useState([]);
  const [serviceMix, setServiceMix] = React.useState([]);
  const [businessUnit, setBusinessUnit] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const API_BASE = 'http://localhost:8003/api/v1';

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/dashboard/stats`);
        if (response.data.success) {
          setStats(response.data.stats);
          setActiveBookings(response.data.recentOrders);
          setServiceMix(response.data.serviceMix || []);
          setBusinessUnit(response.data.business_unit);
        }
      } catch (error) {
        console.error('Failed to fetch garage stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading && stats.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Garage Hub</h1>
          <p className="text-slate-500 font-medium">Manage service bookings and mechanic assignments.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.href = '/portal/products/add'}
            className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Plus size={20} /> Add Part
          </button>
          <button 
            onClick={() => window.location.href = '/portal/orders'}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
          >
            <Calendar size={20} /> View Schedule
          </button>
        </div>
      </div>

      {businessUnit && businessUnit.status !== 'verified' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-3xl border flex items-center justify-between ${
            businessUnit.status === 'pending' 
              ? 'bg-purple-50 border-purple-100 text-purple-800' 
              : 'bg-red-50 border-red-100 text-red-800'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              businessUnit.status === 'pending' ? 'bg-purple-100/50' : 'bg-red-100'
            }`}>
              {businessUnit.status === 'pending' ? <Clock size={24} /> : <Wrench size={24} />}
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tight text-sm">
                Infrastructure Status: {businessUnit.status.toUpperCase()}
              </h3>
              <p className="text-xs font-medium opacity-80">
                {businessUnit.status === 'pending' 
                  ? 'Institutional vetting for your garage is in progress. Booking synchronization will remain in sandbox mode until approval.'
                  : 'Critical Alert: Operational access restricted due to verification failure. Contact the Engineering Hub for re-validation.'}
              </p>
            </div>
          </div>
          <button className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
            businessUnit.status === 'pending' ? 'border-purple-200 hover:bg-purple-100' : 'border-red-200 hover:bg-red-100'
          }`}>
            Compliance Hub
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-slate-900 mb-6 font-display">Active Bookings</h2>
          <div className="space-y-4">
            {activeBookings.map((booking, i) => (
              <div key={i} className="group p-4 rounded-2xl border border-slate-50 hover:border-purple-100 hover:bg-purple-50/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                    KB{i+1}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{booking.item}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer: {booking.customer} • {booking.time}</div>
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
            {activeBookings.length === 0 && (
              <div className="text-center py-8 text-slate-400 font-medium text-xs">No active bookings found.</div>
            )}
          </div>
        </div>
        <div className="bg-[#0a0f1b] rounded-3xl p-8 text-white border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black mb-6 italic tracking-tight">Service Mix</h2>
            <div className="space-y-6">
              {serviceMix.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                    <span>{item.name}</span>
                    <span className={`text-${item.color}-400`}>{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1.5, delay: i * 0.2 }}
                        className={`absolute inset-y-0 left-0 bg-${item.color}-500 rounded-full`}
                    />
                  </div>
                </div>
              ))}
              {serviceMix.length === 0 && (
                  <div className="py-8 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest italic font-bold">Analyzing service history...</div>
              )}
            </div>
          </div>
          <button className="w-full mt-10 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic transition-all">Optimize Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default GarageDashboard;
