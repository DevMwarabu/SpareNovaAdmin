import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, 
  Send, 
  Users, 
  Store, 
  AlertTriangle, 
  Info, 
  Megaphone, 
  History, 
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';

const Communications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'Announcement',
    target_type: 'All',
    priority: 'normal'
  });

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/notifications`);
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error(`Failed to fetch notifications:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/admin/notifications`, formData);
      if (res.data.success) {
        setShowModal(false);
        fetchData();
        setFormData({ title: '', message: '', type: 'Announcement', target_type: 'All', priority: 'normal' });
      }
    } catch (err) {
      console.error(`Failed to send notification:`, err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Megaphone size={24} />
             </div>
             Dispatch Center
          </h1>
          <p className="text-slate-500 font-medium mt-1">Broadcast platform announcements, vendor critical warnings, and system updates.</p>
        </div>
        <button 
           onClick={() => setShowModal(true)}
           className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
           <Plus size={18} /> Create Broadcast
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <History size={16} className="text-slate-400" /> Broadcast History
                  </h3>
                  <button onClick={fetchData} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                     <RefreshCw size={16} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                  </button>
               </div>
               <div className="divide-y divide-slate-50">
                  {loading && (
                    <div className="p-20 text-center">
                       <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  )}
                  {notifications.map((n) => (
                    <div key={n.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                       <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'Warning' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                {n.type === 'Warning' ? <AlertTriangle size={20} /> : <Info size={20} />}
                             </div>
                             <div>
                                <h4 className="text-sm font-black text-slate-900 mb-1">{n.title}</h4>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed mb-3">{n.message}</p>
                                <div className="flex items-center gap-4">
                                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${getPriorityColor(n.priority)}`}>
                                      {n.priority} Priority
                                   </span>
                                   <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                      <Users size={12} /> {n.target_type}
                                   </span>
                                   <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                      <Clock size={12} /> {new Date(n.created_at).toLocaleString()}
                                   </span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                             <CheckCircle2 size={10} /> Dispatched
                          </div>
                       </div>
                    </div>
                  ))}
                  {notifications.length === 0 && !loading && (
                    <div className="p-20 text-center text-sm font-bold text-slate-400 italic">
                       No broadcasts staged or dispatched yet.
                    </div>
                  )}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Megaphone size={120} />
               </div>
               <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                     <Bell size={20} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black tracking-tight">Rapid Response</h3>
                     <p className="text-blue-100 text-sm font-medium mt-2 leading-relaxed">Notifications are pushed via WebSocket and Email simultaneously to all platform nodes.</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[10px] font-black uppercase text-blue-300 tracking-tighter">Avg Reach</p>
                        <p className="text-lg font-black text-white">99.8%</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-blue-300 tracking-tighter">Delivery</p>
                        <p className="text-lg font-black text-white">&lt; 2s</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 p-8 space-y-6 shadow-sm">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Plus size={14} className="text-slate-900" /> Platform Presets
               </h3>
               <div className="space-y-4">
                  {[
                    { l: 'New Year Promotion', t: 'Store' },
                    { l: 'System Maintenance', t: 'All' },
                    { l: 'Urgent Pay Update', t: 'Vendors' },
                  ].map((item, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                       <span className="text-xs font-bold text-slate-700">{item.l}</span>
                       <span className="text-[9px] font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">USE PRESET</span>
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
           <div className="bg-white w-full max-w-xl rounded-[40px] p-10 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Compose Platform Broadcast</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Type</label>
                       <select 
                         value={formData.type}
                         onChange={(e) => setFormData({...formData, type: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                       >
                          <option>Announcement</option>
                          <option>Warning</option>
                          <option>Update</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Target</label>
                       <select 
                         value={formData.target_type}
                         onChange={(e) => setFormData({...formData, target_type: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                       >
                          <option>All</option>
                          <option>Vendors</option>
                          <option>Customers</option>
                          <option>Garages</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Broadcast Title</label>
                    <input 
                       value={formData.title}
                       onChange={(e) => setFormData({...formData, title: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                       placeholder="e.g. Server Maintenance Notice"
                       required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Broadcast Message</label>
                    <textarea 
                       value={formData.message}
                       onChange={(e) => setFormData({...formData, message: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none h-32 resize-none"
                       placeholder="Detail the announcement..."
                       required
                    />
                 </div>
                 <div className="flex items-center gap-4 pt-4">
                    <button 
                       type="button"
                       onClick={() => setShowModal(false)}
                       className="flex-1 bg-slate-50 text-slate-400 px-6 py-4 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all"
                    >
                       Discard
                    </button>
                    <button 
                       type="submit"
                       className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-xs shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                       disabled={loading}
                    >
                       <Send size={16} /> {loading ? 'Sending...' : 'Dispatch Now'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Communications;
