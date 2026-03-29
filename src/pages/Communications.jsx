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
  Zap
} from 'lucide-react';

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
      console.error(`Failed to fetch notifications:`, err);
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
      console.error(`Failed to fetch templates:`, err);
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
        showToast('Broadcast dispatched successfully', 'success');
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
        showToast(`Template ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        setTemplateData({ id: null, name: '', subject: '', body: '' });
      }
    } catch (err) {
      showToast('Template operation failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm('Permanently decommission this governance template?')) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/admin/email-templates/${id}`);
      fetchTemplates();
      showToast('Template deleted', 'success');
    } catch (err) {
      showToast('Deletion failed', 'danger');
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      {/* Toast System */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${toast.type === 'danger' ? 'bg-rose-500' : 'bg-primary-500'}`}>
              <Zap size={16} />
           </div>
           <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Megaphone size={24} />
             </div>
             Dispatch Center
          </h1>
          <p className="text-slate-500 font-medium mt-1">Industrial Governance & Platform Communications Hub.</p>
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
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
                <Plus size={18} /> {activeTab === 'broadcasts' ? 'Create Broadcast' : 'Define Template'}
            </button>
        </div>
      </div>

      {/* High-Fidelity Tab Switcher */}
      <div className="flex p-1.5 bg-white border border-slate-100 rounded-2xl w-fit shadow-sm">
         <button 
           onClick={() => setActiveTab('broadcasts')}
           className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'broadcasts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'}`}
         >
            <History size={14} /> Broadcast History
         </button>
         <button 
           onClick={() => setActiveTab('templates')}
           className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'templates' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'}`}
         >
            <ShieldCheck size={14} /> Governance Templates
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex items-center justify-between px-8">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     {activeTab === 'broadcasts' ? <History size={16} className="text-slate-400" /> : <FileText size={16} className="text-slate-400" />} 
                     {activeTab === 'broadcasts' ? 'Broadcast History' : 'Governance Protocol Templates'}
                  </h3>
                  <button onClick={activeTab === 'broadcasts' ? fetchNotifications : fetchTemplates} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                     <RefreshCw size={16} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                  </button>
               </div>
               
               <div className="divide-y divide-slate-50">
                  {loading && (
                    <div className="p-20 text-center">
                       <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  )}

                  {activeTab === 'broadcasts' ? (
                    <>
                      {notifications.map((n) => (
                        <div key={n.id} className="p-6 px-8 hover:bg-slate-50/50 transition-colors group">
                           <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-4">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'Warning' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {n.type === 'Warning' ? <AlertTriangle size={20} /> : <Info size={20} />}
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="text-sm font-black text-slate-900">{n.title}</h4>
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
                              <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                 <CheckCircle2 size={10} /> Dispatched
                              </div>
                           </div>
                        </div>
                      ))}
                      {notifications.length === 0 && !loading && (
                        <div className="p-20 text-center text-sm font-bold text-slate-400 italic">No broadcasts staged or dispatched yet.</div>
                      )}
                    </>
                  ) : (
                    <>
                      {templates.map((t) => (
                        <div key={t.id} className="p-6 px-8 hover:bg-slate-50/50 transition-colors group">
                           <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <FileText size={20} />
                                 </div>
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                       <h4 className="text-sm font-black text-slate-900 italic">{t.name}</h4>
                                       <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded">Email Template</span>
                                    </div>
                                    <p className="text-xs font-bold text-primary-600 mb-1">Subject: {t.subject}</p>
                                    <p className="text-[11px] font-medium text-slate-400 line-clamp-2 leading-relaxed">
                                       {t.body}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                   onClick={() => {
                                     setTemplateData(t);
                                     setShowTemplateModal(true);
                                   }}
                                   className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm"
                                  >
                                    <Edit3 size={16} />
                                 </button>
                                 <button 
                                   onClick={() => deleteTemplate(t.id)}
                                   className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                                  >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </div>
                        </div>
                      ))}
                      {templates.length === 0 && !loading && (
                        <div className="p-20 text-center text-sm font-bold text-slate-400 italic">No governance templates defined.</div>
                      )}
                    </>
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
                     <Zap size={20} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black tracking-tight">System Telemetry</h3>
                     <p className="text-blue-100 text-sm font-medium mt-2 leading-relaxed">Administrative notifications are dispatched through the global messaging bus.</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[10px] font-black uppercase text-blue-300 tracking-tighter">Avg Reach</p>
                        <p className="text-lg font-black text-white">99.8%</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-blue-300 tracking-tighter">Latency</p>
                        <p className="text-lg font-black text-white">&lt; 2s</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 p-8 space-y-6 shadow-sm">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-slate-900" /> Protocol Status
               </h3>
               <div className="space-y-4">
                  {[
                    { l: 'Template Engine', s: 'Operational' },
                    { l: 'Broadcast Loop', s: 'Active' },
                    { l: 'Mail Server', s: 'Staged' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                       <span className="text-xs font-bold text-slate-500">{item.l}</span>
                       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{item.s}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
           <div className="bg-white w-full max-w-xl rounded-[40px] p-10 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Platform Broadcast</h2>
                 <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">
                    <X size={20} />
                 </button>
              </div>
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
                       type="submit"
                       className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-xs shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                       disabled={loading}
                    >
                       <Send size={16} /> {loading ? 'Sending...' : 'Dispatch Now'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowTemplateModal(false)} />
           <div className="bg-white w-full max-w-xl rounded-[40px] p-10 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">
                    {templateData.id ? 'Modify Protocol Template' : 'Define New Protocol'}
                 </h2>
                 <button onClick={() => setShowTemplateModal(false)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">
                    <X size={20} />
                 </button>
              </div>
              <form onSubmit={handleTemplateSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Protocol Name (Internal)</label>
                    <input 
                       value={templateData.name}
                       onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                       placeholder="e.g. Policy Infringement Flag"
                       required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Subject Line</label>
                    <input 
                       value={templateData.subject}
                       onChange={(e) => setTemplateData({...templateData, subject: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none"
                       placeholder="e.g. Action Required: Product Violation"
                       required
                    />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                       <label className="text-[10px] font-black uppercase text-slate-400">Communication Body</label>
                       <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Minimalist Design Enforced</span>
                    </div>
                    <textarea 
                       value={templateData.body}
                       onChange={(e) => setTemplateData({...templateData, body: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none h-48 resize-none leading-relaxed"
                       placeholder="Write the minimalist template content..."
                       required
                    />
                 </div>
                 <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                    <Info size={18} className="text-blue-600 shrink-0" />
                    <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-tighter">
                       Note: Body content should be professional and concise. Branded headers and footers are injected automatically at the delivery node.
                    </p>
                 </div>
                 <div className="flex items-center gap-4 pt-4">
                    <button 
                       type="submit"
                       className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                       disabled={loading}
                    >
                       <CheckCircle2 size={16} /> {loading ? 'Saving...' : 'Sync Template'}
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
