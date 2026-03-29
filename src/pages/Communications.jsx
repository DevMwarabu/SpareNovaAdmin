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
  Clock,
  X,
  Edit3,
  Trash2,
  FileText,
  ShieldCheck,
  Zap,
  Radio,
  Signal,
  Loader2,
  Trash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmDialog from '../components/ConfirmDialog';

const Communications = () => {
  const [activeTab, setActiveTab] = useState('broadcasts'); // 'broadcasts' or 'templates'
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'Announcement',
    target_type: 'All',
    priority: 'normal'
  });

  const [templateData, setTemplateData] = useState({
    id: null,
    name: '',
    subject: '',
    body: ''
  });

  // Confirmation States
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });

  const API_BASE = 'http://localhost:8003/api/v1';

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/notifications`);
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error(`Failed to fetch notifications:`, err.response?.data?.message || err.message);
      showToast('Ledger synchronization failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/email-templates`);
      if (res.data.success) {
        setTemplates(res.data.data);
      }
    } catch (err) {
      console.error(`Failed to fetch templates:`, err.response?.data?.message || err.message);
      showToast('Protocol synchronization failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'broadcasts') fetchNotifications();
    else fetchTemplates();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/admin/notifications`, formData);
      if (res.data.success) {
        setShowModal(false);
        fetchNotifications();
        showToast('Broadcast dispatched & audited successfully', 'success');
        setFormData({ title: '', message: '', type: 'Announcement', target_type: 'All', priority: 'normal' });
      }
    } catch (err) {
      showToast('Dispatch failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const isEdit = !!templateData.id;
      const res = isEdit 
        ? await axios.put(`${API_BASE}/admin/email-templates/${templateData.id}`, templateData)
        : await axios.post(`${API_BASE}/admin/email-templates`, templateData);
      
      if (res.data.success) {
        setShowTemplateModal(false);
        fetchTemplates();
        showToast(`Governance template ${isEdit ? 'updated' : 'defined'} & audited`, 'success');
        setTemplateData({ id: null, name: '', subject: '', body: '' });
      }
    } catch (err) {
      showToast('Template operation failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Decommission Protocol?',
      message: 'Are you sure you want to permanently decommission this governance protocol? This action cannot be reversed.',
      type: 'danger',
      onConfirm: async () => {
        try {
          setLoading(true);
          await axios.delete(`${API_BASE}/admin/email-templates/${id}`);
          fetchTemplates();
          showToast('Protocol decommissioned', 'success');
        } catch (err) {
          showToast('Decommission failure', 'danger');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const getPriorityColor = (p) => {
    switch (p.toLowerCase()) {
      case 'urgent': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      {/* Toast System */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900/95 backdrop-blur-xl text-white px-8 py-4 rounded-[32px] shadow-2xl flex items-center gap-4 border border-white/10"
          >
             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${toast.type === 'danger' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-blue-500 shadow-blue-500/20'}`}>
                <Zap size={18} className="animate-pulse" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest italic">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 shadow-xl shadow-blue-500/10 border border-blue-100">
                <Megaphone size={24} />
             </div>
             Institutional Dispatch Center
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">Global Platform Communications & Governance Protocols</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => {
                   if (activeTab === 'broadcasts') setShowModal(true);
                   else {
                     setTemplateData({ id: null, name: '', subject: '', body: '' });
                     setShowTemplateModal(true);
                   }
                }}
                className="bg-slate-900 text-white px-10 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 italic border-t border-white/10"
            >
                <Plus size={18} /> {activeTab === 'broadcasts' ? 'Staging New Broadcast' : 'Define Protocol'}
            </button>
        </div>
      </div>

      {/* High-Fidelity Tab Switcher */}
      <div className="flex p-1.5 bg-white/60 backdrop-blur-md border border-slate-100 rounded-[32px] w-fit shadow-inner">
         <button 
           onClick={() => setActiveTab('broadcasts')}
           className={`px-10 py-3.5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 italic ${activeTab === 'broadcasts' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'}`}
         >
            <History size={16} /> Broadcast History
         </button>
         <button 
           onClick={() => setActiveTab('templates')}
           className={`px-10 py-3.5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 italic ${activeTab === 'templates' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'}`}
         >
            <ShieldCheck size={16} /> Governance Templates
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between px-10">
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 italic">
                     {activeTab === 'broadcasts' ? <History size={18} className="text-blue-500" /> : <FileText size={18} className="text-blue-500" />} 
                     {activeTab === 'broadcasts' ? 'Institutional Broadcast Ledger' : 'Institutional Protocol Templates'}
                  </h3>
                  <button onClick={activeTab === 'broadcasts' ? fetchNotifications : fetchTemplates} className="p-3 hover:bg-slate-50 rounded-2xl transition-all active:scale-90">
                     <RefreshCw size={18} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                  </button>
               </div>
               
               <div className="divide-y divide-slate-50">
                  {loading && (
                    <div className="p-32 text-center">
                       <Loader2 size={32} className="animate-spin text-blue-600 mx-auto" />
                       <p className="mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Synchronizing Ledger...</p>
                    </div>
                  )}

                  <AnimatePresence mode='wait'>
                    {!loading && activeTab === 'broadcasts' ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="divide-y divide-slate-50"
                      >
                        {notifications.map((n, idx) => (
                          <motion.div 
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: idx * 0.05 }}
                             key={n.id} 
                             className="p-8 px-10 hover:bg-slate-50/50 transition-all group flex items-start justify-between gap-6"
                          >
                             <div className="flex gap-6">
                                <div className={`w-14 h-14 rounded-[20px] shadow-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${n.type === 'Warning' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                   {n.type === 'Warning' ? <AlertTriangle size={24} /> : <Info size={24} />}
                                </div>
                                <div className="space-y-2 uppercase italic">
                                   <div className="flex items-center gap-3">
                                      <h4 className="text-base font-black text-slate-900 tracking-tight">{n.title}</h4>
                                      <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest border shadow-sm ${getPriorityColor(n.priority)}`}>
                                         {n.priority}
                                      </span>
                                   </div>
                                   <p className="text-[11px] font-medium text-slate-500 leading-relaxed max-w-xl opacity-80">{n.message}</p>
                                   <div className="flex items-center gap-6 pt-2">
                                      <span className="text-[9px] font-black text-slate-400 flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-100 italic">
                                         <Users size={12} className="text-blue-500" /> {n.target_type} TRANSMISSION
                                      </span>
                                      <span className="text-[9px] font-black text-slate-400 flex items-center gap-1.5 inline-block opacity-40">
                                         <Clock size={12} /> {new Date(n.created_at).toLocaleString()}
                                      </span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm shadow-emerald-500/5">
                                <CheckCircle2 size={12} /> Dispatched & Audited
                             </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : !loading && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="divide-y divide-slate-50"
                      >
                        {templates.map((t, idx) => (
                          <motion.div 
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: idx * 0.05 }}
                             key={t.id} 
                             className="p-8 px-10 hover:bg-slate-50/50 transition-all group"
                          >
                             <div className="flex items-start justify-between gap-6">
                                <div className="flex gap-6">
                                   <div className="w-14 h-14 rounded-[20px] bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shadow-inner border border-slate-100 group-hover:border-blue-100">
                                      <FileText size={24} />
                                   </div>
                                   <div className="space-y-2 uppercase italic">
                                      <div className="flex items-center gap-3">
                                         <h4 className="text-base font-black text-slate-900 tracking-tight">{t.name}</h4>
                                         <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-slate-200 shadow-sm">Protocol</span>
                                      </div>
                                      <p className="text-[10px] font-black text-blue-600 mb-1 opacity-70">SUBJECT REACODE: {t.subject}</p>
                                      <p className="text-[11px] font-medium text-slate-400 line-clamp-2 leading-loose opacity-60">
                                         {t.body}
                                      </p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                   <button 
                                     onClick={() => {
                                       setTemplateData(t);
                                       setShowTemplateModal(true);
                                     }}
                                     className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/10"
                                    >
                                      <Edit3 size={18} />
                                   </button>
                                   <button 
                                     onClick={() => deleteTemplate(t.id)}
                                     className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm hover:shadow-xl hover:shadow-rose-500/10"
                                    >
                                      <Trash2 size={18} />
                                   </button>
                                </div>
                             </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!loading && ((activeTab === 'broadcasts' && notifications.length === 0) || (activeTab === 'templates' && templates.length === 0)) && (
                    <div className="p-32 text-center space-y-4">
                       <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto text-slate-200 shadow-inner italic">
                          <Radio size={40} />
                       </div>
                       <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] italic">No active frequency detected.</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-10">
            <div className="bg-slate-900 rounded-[56px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/10 border border-white/5 uppercase italic">
               <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <Signal size={140} />
               </div>
               
               {/* Transmission Pulse SVG */}
               <div className="absolute inset-0 pointer-events-none opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <motion.circle 
                      cx="200" cy="100" r="50" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="1"
                      animate={{ r: [50, 150], opacity: [0.5, 0] }}
                      initial={{ r: 50, opacity: 0.5 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.circle 
                      cx="200" cy="100" r="50" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="1"
                      animate={{ r: [50, 150], opacity: [0.5, 0] }}
                      initial={{ r: 50, opacity: 0.5 }}
                      transition={{ duration: 4, repeat: Infinity, delay: 2, ease: "linear" }}
                    />
                  </svg>
               </div>

               <div className="relative z-10 space-y-8">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl text-[10px] font-black tracking-widest text-blue-300 border border-white/10">
                     <Radio size={14} className="animate-pulse" /> DISPATCH SIGNAL: ACTIVE
                  </div>
                  <div>
                     <h3 className="text-3xl font-black tracking-tighter leading-none mb-2 mt-4">Platform <br/><span className="text-blue-400">Telemetry</span></h3>
                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-loose opacity-60">Industrial messaging bus is operational. Broadcast reach is currently peaking at 99.98% connectivity.</p>
                  </div>
                  <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
                     <div>
                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Success Yield</p>
                        <p className="text-2xl font-black text-white italic tracking-tighter">99.8<span className="text-blue-400 text-sm">%</span></p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Frequency</p>
                        <p className="text-2xl font-black text-white italic tracking-tighter">&lt; 2<span className="text-blue-400 text-sm">SEC</span></p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[48px] border border-slate-100 p-10 space-y-8 shadow-2xl shadow-slate-200/40 uppercase italic">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                  <Zap size={16} className="text-blue-600" /> Protocol Integrity
               </h3>
               <div className="space-y-5">
                  {[
                    { l: 'Template Engine', s: 'Operational' },
                    { l: 'Broadcast Loop', s: 'Active' },
                    { l: 'Audit Ledger', s: 'Synchronized' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm group hover:border-blue-100 transition-all">
                       <span className="text-[11px] font-black text-slate-500">{item.l}</span>
                       <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm animate-pulse">{item.s}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
               onClick={() => setShowModal(false)} 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="bg-white w-full max-w-2xl rounded-[56px] p-12 relative z-10 shadow-2xl overflow-hidden uppercase italic"
             >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl -translate-x-12 -translate-y-12 opacity-50" />
                
                <div className="flex items-center justify-between mb-12 relative z-10">
                   <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">Institutional Broadcast</h2>
                      <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-2 opacity-60 italic">Staging Platform-Wide Signal Transmission</p>
                   </div>
                   <button onClick={() => setShowModal(false)} className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all shadow-inner active:scale-90">
                      <X size={24} />
                   </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Protocol Type</label>
                         <select 
                           value={formData.type}
                           onChange={(e) => setFormData({...formData, type: e.target.value})}
                           className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] px-6 py-4 text-xs font-black outline-none focus:border-blue-100 focus:bg-white transition-all shadow-inner uppercase tracking-widest italic"
                         >
                            <option>Announcement</option>
                            <option>Warning</option>
                            <option>Update</option>
                         </select>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Target Framework</label>
                         <select 
                           value={formData.target_type}
                           onChange={(e) => setFormData({...formData, target_type: e.target.value})}
                           className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] px-6 py-4 text-xs font-black outline-none focus:border-blue-100 focus:bg-white transition-all shadow-inner uppercase tracking-widest italic"
                         >
                            <option>All</option>
                            <option>Vendors</option>
                            <option>Customers</option>
                            <option>Garages</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Signal Header</label>
                      <input 
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] px-8 py-5 text-xs font-black outline-none focus:border-blue-100 focus:bg-white transition-all shadow-inner placeholder:text-slate-300 uppercase italic tracking-tighter"
                         placeholder="e.g. Critical System Performance Update..."
                         required
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Signal Payload</label>
                      <textarea 
                         value={formData.message}
                         onChange={(e) => setFormData({...formData, message: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-50 rounded-[32px] px-8 py-6 text-xs font-black outline-none focus:border-blue-100 focus:bg-white transition-all shadow-inner h-40 resize-none leading-relaxed placeholder:text-slate-300 uppercase italic"
                         placeholder="Synthesize the institutional announcement body..."
                         required
                      />
                   </div>
                   <div className="flex items-center gap-6 pt-6">
                      <button 
                         type="submit"
                         className="w-full bg-blue-600 text-white py-6 rounded-[28px] font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 italic border-t border-white/10"
                         disabled={loading}
                      >
                         {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-1 transition-transform" />} 
                         {loading ? 'Transmitting Signal...' : 'Authorize Global Dispatch'}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Template Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
               onClick={() => setShowTemplateModal(false)} 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="bg-white w-full max-w-2xl rounded-[56px] p-12 relative z-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto uppercase italic"
             >
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl -translate-x-12 -translate-y-12 opacity-50" />

                <div className="flex items-center justify-between mb-12 relative z-10">
                   <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">Protocol Sandbox</h2>
                      <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-2 opacity-60 italic">Define Governance Communication Framework</p>
                   </div>
                   <button onClick={() => setShowTemplateModal(false)} className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all shadow-inner active:scale-90">
                      <X size={24} />
                   </button>
                </div>

                <form onSubmit={handleTemplateSubmit} className="space-y-8 relative z-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Protocol ID (Internal Reference)</label>
                      <input 
                         value={templateData.name}
                         onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] px-8 py-5 text-xs font-black outline-none focus:border-indigo-100 focus:bg-white transition-all shadow-inner placeholder:text-slate-300 uppercase italic tracking-tighter"
                         placeholder="e.g. PARTNER_SUSPENSION_V2"
                         required
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Transmission Subject</label>
                      <input 
                         value={templateData.subject}
                         onChange={(e) => setTemplateData({...templateData, subject: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] px-8 py-5 text-xs font-black outline-none focus:border-indigo-100 focus:bg-white transition-all shadow-inner placeholder:text-slate-300 uppercase italic"
                         placeholder="e.g. Legal Notice: Institutional Protocol Deviation"
                         required
                      />
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between ml-1">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sandbox Payload Body</label>
                         <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">Industrial Shell Only</span>
                      </div>
                      <textarea 
                         value={templateData.body}
                         onChange={(e) => setTemplateData({...templateData, body: e.target.value})}
                         className="w-full bg-slate-50 border-2 border-slate-50 rounded-[32px] px-8 py-6 text-xs font-black outline-none focus:border-indigo-100 focus:bg-white transition-all shadow-inner h-48 resize-none leading-relaxed placeholder:text-slate-300 uppercase italic"
                         placeholder="Synthesize the minimalist governance content..."
                         required
                      />
                   </div>
                   
                   <div className="p-8 bg-indigo-50/50 rounded-[32px] border border-indigo-100 flex gap-5">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 shrink-0 h-fit">
                         <Signal size={20} />
                      </div>
                      <div>
                         <p className="text-[11px] font-black text-indigo-900 leading-none mb-1.5 uppercase italic tracking-widest">Auto-Injection Protocol</p>
                         <p className="text-[10px] font-bold text-indigo-700/60 leading-relaxed uppercase tracking-tighter">
                            Branded institutional headers, legal signatures, and encryption footers are injected within the production delivery nodes. The Sandbox focuses purely on tactical payload.
                         </p>
                      </div>
                   </div>

                   <div className="flex items-center gap-6 pt-6">
                      <button 
                         type="submit"
                         className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-slate-900/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 italic border-t border-white/10"
                         disabled={loading}
                      >
                         {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />} 
                         {loading ? 'Synchronizing Sandbox...' : 'Authorize Protocol Sync'}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog 
        {...confirmDialog}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
};

export default Communications;
