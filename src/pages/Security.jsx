import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  AlertOctagon, 
  UserX, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Lock, 
  Eye, 
  Search, 
  Filter,
  RefreshCw,
  MoreVertical
} from 'lucide-react';

const Security = () => {
  const [stats, setStats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/security`);
      if (res.data.success) {
        setStats(res.data.stats);
        setAlerts(res.data.alerts);
      }
    } catch (err) {
      console.error(`Failed to fetch security data:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-emerald-600 bg-emerald-50';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-red-50 text-red-600">
                <Shield size={24} />
             </div>
             Security & Fraud Control
          </h1>
          <p className="text-slate-500 font-medium mt-1">AI-driven fraud monitoring, identity verification and platform security auditing.</p>
        </div>
        <button 
           onClick={fetchData}
           className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-xs font-black shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all active:scale-95"
        >
           <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Force Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className={`w-12 h-12 rounded-2xl bg-${s.col === 'rose' ? 'rose' : s.col}-50 text-${s.col === 'rose' ? 'rose' : s.col}-600 flex items-center justify-center mb-4`}>
                 {i === 0 ? <UserX size={24} /> : i === 1 ? <AlertOctagon size={24} /> : <Activity size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">{s.v}</p>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full bg-${s.col === 'rose' ? 'rose' : s.col}-500`} style={{ width: '65%' }}></div>
                   </div>
                   <span className="text-[10px] font-bold text-slate-400">{s.c}</span>
                </div>
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-36 rounded-3xl"></div>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <AlertTriangle size={16} className="text-orange-500" /> High-Risk Detection Log
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"><Search size={16} /></button>
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"><Filter size={16} /></button>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50/50">
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Risk Asset</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Threat Type</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Risk Score</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Flag Pattern</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Time</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 relative">
                        {loading && (
                           <tr>
                              <td colSpan="5" className="py-20 text-center">
                                 <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                              </td>
                           </tr>
                        )}
                        {alerts.map((a, i) => (
                           <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                       {a.type.includes('User') ? <UserX size={16} /> : <ShieldAlert size={16} />}
                                    </div>
                                    <span className="text-xs font-black text-slate-900 truncate max-w-[120px]">{a.target}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{a.type}</span>
                              </td>
                              <td className="px-6 py-5">
                                 <span className={`px-2 py-1 rounded-md text-[10px] font-black ${getRiskColor(a.score)}`}>
                                    {a.score}%
                                 </span>
                              </td>
                              <td className="px-6 py-5">
                                 <span className="text-[10px] font-medium text-slate-500 line-clamp-1 italic">"{a.reason}"</span>
                              </td>
                              <td className="px-6 py-5 text-right font-black text-slate-400 text-[10px]">
                                 {a.date}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <ShieldCheck size={120} />
               </div>
               <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                     <Lock size={20} className="text-blue-400" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black tracking-tight">AI Security Shield</h3>
                     <p className="text-slate-400 text-sm font-medium mt-2 leading-relaxed">Neural fraud detection is active. We are currently monitoring 2,400+ data points per transaction.</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Biometric Verification: ACTIVE</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Geofencing Audit: ACTIVE</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 p-8 space-y-6 shadow-sm">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" /> Security Pulse
               </h3>
               <div className="space-y-4">
                  {[
                    { l: 'Successful Logins', v: '99.2%', col: 'emerald' },
                    { l: 'Failed Auth Attempts', v: '0.8%', col: 'orange' },
                    { l: 'Banned IPs', v: '12', col: 'red' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                       <span className="text-xs font-bold text-slate-500">{item.l}</span>
                       <span className={`text-xs font-black text-${item.col}-600`}>{item.v}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Security;
