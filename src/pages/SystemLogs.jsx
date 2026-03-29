import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Terminal, 
  Activity, 
  Cpu, 
  Server, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Search,
  HardDrive,
  Database,
  Unplug,
  Download,
  Trash2,
  Cpu as CpuIcon,
  ShieldAlert
} from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [apis, setApis] = useState([]);
  const [stats, setStats] = useState([]);
  const [uptime, setUptime] = useState('Unknown');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Confirmation state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const API_BASE = 'http://localhost:8003/api/v1';

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/system-logs`);
      if (res.data.success) {
        setLogs(res.data.logs);
        setApis(res.data.apis);
        setStats(res.data.stats);
        setUptime(res.data.uptime);
      }
    } catch (err) {
      console.error(`Failed to fetch system logs:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Flush Infrastructure Logs?',
      message: 'This protocol will permanently truncate the current execution ledger. This action is audited and irreversible.',
      onConfirm: async () => {
        try {
          setLoading(true);
          const res = await axios.post(`${API_BASE}/admin/system-logs/clear`);
          if (res.data.success) {
            showToast('Log cluster truncated successfully');
            fetchData();
          }
        } catch (err) {
          console.error('Clear failed:', err);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDownloadLogs = () => {
    window.open(`${API_BASE}/admin/system-logs/download`, '_blank');
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-xl shadow-slate-900/10">
                <Terminal size={24} />
             </div>
             Infrastructure Watchtower
          </h1>
          <p className="text-slate-500 font-medium mt-1">Global system logs, API health monitoring and infrastructure performance metrics.</p>
        </div>
         <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">System Uptime</p>
               <p className="text-xs font-black text-blue-600 italic">{uptime}</p>
            </div>
            <button 
               onClick={fetchData}
               className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-xs font-black shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all active:scale-95"
            >
               <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Cluster
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className={`w-12 h-12 rounded-2xl bg-${s.col === 'rose' ? 'rose' : s.col}-50 text-${s.col === 'rose' ? 'rose' : s.col}-600 flex items-center justify-center mb-4`}>
                 {i === 0 ? <Activity size={24} /> : i === 1 ? <AlertCircle size={24} /> : <Server size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">{s.v}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{s.c}</p>
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-32 rounded-3xl"></div>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900 rounded-[40px] border border-slate-800 shadow-2xl p-8 group">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Terminal size={14} className="text-emerald-500" /> REAL-TIME SYSTEM TAIL (laravel.log)
                  </h3>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">STREAMING</span>
                  </div>
               </div>
               <div className="font-mono text-[11px] space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
                  {logs.length > 0 ? logs.map((log) => (
                    <div key={log.id} className="group/line py-1 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                       <span className="text-slate-600 mr-4">[{log.time}]</span>
                       <span className={`mr-4 font-black ${log.level === 'ERROR' ? 'text-rose-500' : log.level === 'WARNING' ? 'text-orange-500' : 'text-blue-400'}`}>
                          {log.level}:
                       </span>
                       <span className="text-slate-300 break-all">{log.content.substring(25)}</span>
                    </div>
                  )) : (
                    <div className="py-20 text-center text-slate-600 italic">
                       // Initializing cluster monitoring...
                    </div>
                  )}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-6">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14} className="text-blue-500" /> API SERVICE HEALTH
               </h3>
               <div className="space-y-4">
                  {apis.map((api, i) => (
                    <div key={i} className="group p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                       <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black text-slate-900">{api.name}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tight ${api.status === 'Healthy' ? 'text-emerald-600 bg-emerald-50' : 'text-orange-600 bg-orange-50'}`}>
                              {api.status === 'Healthy' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                              {api.status}
                          </span>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                             <Clock size={12} /> {api.latency}
                          </div>
                          <div className="text-[10px] font-black text-slate-900 italic">{api.uptime} Uptime</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
               <div className="relative z-10 space-y-6 text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-md border border-white/10">
                     <Database size={24} className="text-blue-400" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black">Cluster Persistence</h3>
                     <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed">Storage usage is at 42%. Auto-scaling is enabled for regional nodes.</p>
                  </div>
                   <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[42%]" />
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <ShieldAlert size={14} className="text-rose-500" /> INFRASTRUCTURE MANAGEMENT
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={handleDownloadLogs}
                     className="p-5 bg-slate-900 text-white rounded-3xl flex flex-col items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 uppercase italic"
                   >
                      <Download size={20} />
                      <span className="text-[9px] font-black tracking-widest leading-none">Export Ledger</span>
                   </button>
                   <button 
                     onClick={handleClearLogs}
                     className="p-5 bg-rose-50 text-rose-600 border border-rose-100 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-rose-100 hover:scale-[1.02] active:scale-95 transition-all uppercase italic"
                   >
                      <Trash2 size={20} />
                      <span className="text-[9px] font-black tracking-widest leading-none text-rose-600">Flush Logs</span>
                   </button>
                </div>
             </div>
          </div>
       </div>

       {/* Confirm Dialog */}
       <ConfirmDialog 
         {...confirmDialog}
         onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
       />

       {/* Toast */}
       <AnimatePresence>
         {toast && (
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95 }}
             className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-[32px] shadow-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest italic"
           >
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                 <RefreshCw size={14} className="animate-spin" />
              </div>
              {toast}
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

export default SystemLogs;
