import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Mail, 
  Database, 
  CheckCircle2,
  Trash2,
  Plus,
  Monitor,
  CreditCard,
  Layout,
  Save,
  Loader2,
  Lock,
  Smartphone,
  Server,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronRight,
  Send,
  Zap,
  Calendar,
  Video,
  Car,
  Cpu,
  Fingerprint,
  RefreshCw,
  Upload,
  CloudUpload,
  X,
  Search,
  Store,
  Tag,
  MousePointer2,
  User,
  Phone,
  Shield,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8003/api/v1';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('branding');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingType, setTestingType] = useState(null);
  const [settings, setSettings] = useState({});
  const [commissionRules, setCommissionRules] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: '', avatar: '' });
  const [unitDetails, setUnitDetails] = useState(null);
  const [message, setMessage] = useState(null);
  const [role, setRole] = useState('admin');

  useEffect(() => {
    // ACCESS CONTROL: Institutional Context Recovery
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      setRole(u.role);
      // Auto-switch tab if not admin
      if (u.role !== 'admin' && activeTab === 'branding') {
        setActiveTab('profile');
      }
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const showToast = (text, type = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (role === 'admin') {
        await fetchSettings();
        await fetchCommissionRules();
      }
      await fetchProfile();
      setLoading(false);
    };
    loadData();
  }, [role]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE}/portal/profile`, { headers });
      if (response.data.success) {
        setUserProfile(response.data.user);
        setUnitDetails(response.data.business_unit);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
        const formData = new FormData();
        formData.append('name', userProfile.name);
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await axios.post(`${API_BASE}/portal/profile`, formData, { headers });
        if (response.data.success) {
            showToast('Identity synchronized successfully');
            fetchProfile();
            // Update local storage name if changed
            const u = JSON.parse(localStorage.getItem('user'));
            u.name = response.data.user.name;
            localStorage.setItem('user', JSON.stringify(u));
            window.dispatchEvent(new Event('user_update'));
        }
    } catch (error) {
        showToast('Profile sync failed', 'error');
    } finally {
        setSaving(false);
    }
  };

  const handleBusinessSave = async (e) => {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await axios.post(`${API_BASE}/portal/profile/business`, unitDetails, { headers });
        if (response.data.success) {
            showToast('Infrastructure nodes updated successfully');
            fetchProfile();
        }
    } catch (error) {
        showToast('Business update failed', 'error');
    } finally {
        setSaving(false);
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE}/portal/settings`, { headers });
      const fetchedSettings = response.data.settings || {};
      
      // Inject Industrial Gmail Defaults if missing
      if (!fetchedSettings.mail_host) fetchedSettings.mail_host = 'smtp.gmail.com';
      if (!fetchedSettings.mail_port) fetchedSettings.mail_port = '587';
      
      setSettings(fetchedSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showToast('Could not load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommissionRules = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE}/commissions`, { headers });
      setCommissionRules(response.data.rules || []);
    } catch (error) {
      console.error('Error fetching commission rules:', error);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (key, index, field, value) => {
    const newArray = [...(settings[key] || [])];
    if (!newArray[index]) newArray[index] = {};
    newArray[index][field] = value;
    setSettings(prev => ({ ...prev, [key]: newArray }));
  };

  const addArrayItem = (key, template) => {
    const newArray = [...(settings[key] || [])];
    newArray.unshift(template);
    setSettings(prev => ({ ...prev, [key]: newArray }));
  };


  const removeArrayItem = (key, index) => {
    const newArray = (settings[key] || []).filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, [key]: newArray }));
    showToast('Promotional node staged for removal', 'success');
  };


  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      await axios.post(`${API_BASE}/portal/settings`, settings, { headers });
      
      for (const rule of commissionRules) {
        if (rule.id) {
          await axios.put(`${API_BASE}/commissions/${rule.id}`, rule, { headers });
        } else {
          await axios.post(`${API_BASE}/commissions`, rule, { headers });
        }
      }

      showToast('All settings and rules saved to database', 'success');
      fetchSettings();
      fetchCommissionRules();
      
      // Notify other components of branding changes
      window.dispatchEvent(new Event('branding_update'));
    } catch (error) {
      console.error('Error saving:', error);
      showToast('Save failed. Please check the network.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (type, keyId) => {
    setTestingType(type);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await axios.post(`${API_BASE}/portal/settings/verify-connection`, {
        type,
        key: settings[keyId],
        key_id: keyId
      }, { headers });
      if (response.data.success) {
        showToast(response.data.message, 'success');
      } else {
        showToast(response.data.message, 'error');
      }
    } catch (error) {
      showToast('Connection Protocol Failed', 'error');
    } finally {
      setTestingType(null);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing with database...</p>
      </div>
    );
  }

  const tabs = role === 'admin' ? [
    { id: 'branding', label: 'Identity & Brand', icon: Fingerprint, col: 'slate' },
    { id: 'ai', label: 'AI Configuration', icon: Cpu, col: 'purple' },
    { id: 'meetings', label: 'Virtual Meetings', icon: Video, col: 'blue' },
    { id: 'calendar', label: 'Google Calendar', icon: Calendar, col: 'rose' },
    { id: 'vehicle', label: 'Vehicle API', icon: Car, col: 'orange' },
    { id: 'payments', label: 'Payments (M-Pesa)', icon: CreditCard, col: 'emerald' },
    { id: 'commissions', label: 'Fee Rules', icon: ShieldCheck, col: 'indigo' },
    { id: 'email', label: 'Email Setup', icon: Mail, col: 'sky' },
    { id: 'marketing', label: 'Sliders & Features', icon: Layout, col: 'slate' },
    { id: 'general', label: 'Core Info', icon: Globe, col: 'slate' },
  ] : [
    { id: 'profile', label: 'My Identity', icon: User, col: 'slate' },
    { id: 'business', label: 'Business Profile', icon: Store, col: 'indigo' },
    { id: 'security', label: 'Security Lab', icon: Shield, col: 'rose' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 z-[300] px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border ${message.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'}`}
          >
             <p className="text-[10px] font-black uppercase tracking-widest">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 italic uppercase">
             <div className="p-3 rounded-[20px] bg-slate-900 text-white shadow-xl rotate-[-3deg]">
                <SettingsIcon size={24} />
             </div>
             Settings Hub
          </h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-[9px] tracking-[0.2em] opacity-60 ml-1">Live Database Administration Portal</p>
        </div>
        <button 
          onClick={role === 'admin' ? handleSave : (activeTab === 'profile' ? handleProfileSave : handleBusinessSave)}
          disabled={saving}
          className="bg-slate-950 text-white px-8 py-3.5 rounded-[20px] text-[10px] font-black shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 transition-all disabled:opacity-50 uppercase tracking-widest"
        >
          {saving ? <Loader2 className="animate-spin text-emerald-400" size={16} /> : <Save className="text-emerald-400" size={16} />} 
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         <div className="lg:col-span-3 space-y-1 lg:sticky lg:top-24 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-xl border border-slate-100 italic translate-x-2' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? `bg-${tab.col}-50 text-${tab.col}-600` : 'bg-transparent'}`}>
                   <tab.icon size={16} />
                </div>
                {tab.label}
              </button>
            ))}
         </div>

         <div className="lg:col-span-9 bg-white rounded-[40px] border border-slate-100 shadow-2xl p-8 md:p-10 min-h-[600px] overflow-hidden">
            <AnimatePresence mode="wait">
               <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-10 relative z-10" >
                  
                  {activeTab === 'branding' && (
                    <section className="space-y-8 animate-in fade-in duration-500">
                      <h3 className="text-xl font-black text-slate-900 italic uppercase underline decoration-slate-900/10 underline-offset-8">Brand Identity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1 italic">Institutional Logo</label>
                           <LogoPicker value={settings.custom_logo} onChange={(url) => handleChange('custom_logo', url)} />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1 italic">Primary Brand Color</label>
                           <div className="p-6 bg-slate-50 rounded-[32px] flex items-center gap-6 border border-slate-100">
                              <input type="color" value={settings.brand_color || '#0F172A'} onChange={(e) => handleChange('brand_color', e.target.value)} className="w-16 h-16 rounded-[24px] border-none shadow-xl cursor-pointer" />
                              <div className="flex flex-wrap gap-2">
                                {['#0F172A', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(c => (
                                  <button key={c} onClick={() => handleChange('brand_color', c)} className={`w-7 h-7 rounded-full border-2 ${settings.brand_color === c ? 'border-slate-900 scale-110 shadow-lg' : 'border-white'}`} style={{backgroundColor: c}} />
                                ))}
                              </div>
                           </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {activeTab === 'profile' && (
                    <section className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-black text-slate-900 italic uppercase">Your Identity</h3>
                         <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest italic shadow-xl">Role: {role.toUpperCase()}</div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-12 items-start">
                         <div className="relative group/avatar">
                            <div className="w-40 h-40 bg-slate-100 rounded-[48px] overflow-hidden border-4 border-white shadow-2xl relative">
                               {userProfile.avatar ? (
                                 <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <User size={64} />
                                 </div>
                               )}
                               <input 
                                 type="file" 
                                 className="hidden" 
                                 id="avatar-upload" 
                                 onChange={(e) => setUserProfile({...userProfile, avatarFile: e.target.files[0], avatar: URL.createObjectURL(e.target.files[0])})} 
                               />
                               <label 
                                 htmlFor="avatar-upload" 
                                 className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm"
                               >
                                  <CloudUpload size={32} className="text-white" />
                               </label>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl shadow-emerald-500/30">
                               <ShieldCheck size={20} />
                            </div>
                         </div>

                         <div className="flex-1 space-y-8 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <Field label="Full Name" value={userProfile.name} onChange={(v) => setUserProfile({...userProfile, name: v})} />
                               <div className="space-y-2 opacity-50 pointer-events-none">
                                  <label className="text-[8px] font-black uppercase text-slate-400 ml-1 tracking-widest">Institutional Email (Read Only)</label>
                                  <div className="bg-slate-50 border border-slate-100 rounded-[20px] px-5 py-3.5 text-xs font-black text-slate-400 italic">
                                     {userProfile.email}
                                  </div>
                               </div>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
                               <div className="flex items-center gap-3 text-slate-900">
                                  <Lock size={18} className="text-slate-400" />
                                  <h4 className="text-[10px] font-black uppercase tracking-widest">Authentication Synchronization</h4>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Field label="New Password" type="password" placeholder="Min 8 characters" value={userProfile.password} onChange={(v) => setUserProfile({...userProfile, password: v})} />
                                  <Field label="Confirm Secret" type="password" value={userProfile.password_confirmation} onChange={(v) => setUserProfile({...userProfile, password_confirmation: v})} />
                                </div>
                            </div>
                         </div>
                      </div>
                    </section>
                  )}

                  {activeTab === 'business' && unitDetails && (
                    <section className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                       <div className="flex items-center justify-between">
                         <h3 className="text-xl font-black text-slate-900 italic uppercase">Business Infrastructure</h3>
                         <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic shadow-xl ${
                           unitDetails.status === 'verified' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                         }`}>Status: {unitDetails.status.toUpperCase()}</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-8">
                            <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-6">
                               <div className="flex items-center gap-3 text-slate-900">
                                  <Phone size={18} className="text-slate-400" />
                                  <h4 className="text-[10px] font-black uppercase tracking-widest">Communications Hub</h4>
                               </div>
                               <div className="space-y-6">
                                  <Field label="Official Phone Number" placeholder="+254..." value={unitDetails.phone} onChange={(v) => setUnitDetails({...unitDetails, phone: v})} />
                                  <Field label="WhatsApp Pipeline" placeholder="+254..." value={unitDetails.whatsapp} onChange={(v) => setUnitDetails({...unitDetails, whatsapp: v})} />
                               </div>
                            </div>
                            <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[40px] space-y-2">
                               <div className="flex items-center gap-2 text-indigo-600">
                                  <Globe size={18} />
                                  <h4 className="text-[10px] font-black uppercase tracking-widest">Global Linkage</h4>
                               </div>
                               <Field label="Operational Website" placeholder="https://..." value={unitDetails.website} onChange={(v) => setUnitDetails({...unitDetails, website: v})} />
                            </div>
                         </div>

                         <div className="p-10 bg-slate-900 rounded-[48px] text-white space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] italic opacity-60">Social Reach Architecture</h4>
                            <div className="space-y-6 relative z-10">
                               <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                                     <Facebook size={14} />
                                     <label className="text-[8px] font-black uppercase tracking-widest">Institutional Facebook</label>
                                  </div>
                                  <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs font-black text-white outline-none focus:bg-white/10 transition-all font-mono" 
                                    value={unitDetails.facebook || ''} 
                                    onChange={(e) => setUnitDetails({...unitDetails, facebook: e.target.value})}
                                    placeholder="Username or URL"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                                     <Instagram size={14} />
                                     <label className="text-[8px] font-black uppercase tracking-widest">Creative Instagram</label>
                                  </div>
                                  <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs font-black text-white outline-none focus:bg-white/10 transition-all font-mono" 
                                    value={unitDetails.instagram || ''} 
                                    onChange={(e) => setUnitDetails({...unitDetails, instagram: e.target.value})}
                                    placeholder="Username or URL"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                                     <Twitter size={14} />
                                     <label className="text-[8px] font-black uppercase tracking-widest">Network Twitter / X</label>
                                  </div>
                                  <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs font-black text-white outline-none focus:bg-white/10 transition-all font-mono" 
                                    value={unitDetails.twitter || ''} 
                                    onChange={(e) => setUnitDetails({...unitDetails, twitter: e.target.value})}
                                    placeholder="@handle"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                                     <Linkedin size={14} />
                                     <label className="text-[8px] font-black uppercase tracking-widest">Technical LinkedIn</label>
                                  </div>
                                  <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs font-black text-white outline-none focus:bg-white/10 transition-all font-mono" 
                                    value={unitDetails.linkedin || ''} 
                                    onChange={(e) => setUnitDetails({...unitDetails, linkedin: e.target.value})}
                                    placeholder="Company Page"
                                  />
                               </div>
                            </div>
                            <div className="pt-4  border-t border-white/10 flex items-center gap-4 text-slate-500">
                               <ExternalLink size={24} />
                               <p className="text-[8px] font-black uppercase tracking-tighter italic">Live verification of social nodes is performed periodically by platform security.</p>
                            </div>
                         </div>
                      </div>
                    </section>
                  )}

                  {activeTab === 'security' && (
                    <section className="space-y-10 animate-in fade-in slide-in-from-right-4">
                       <h3 className="text-xl font-black text-slate-900 italic uppercase">Security Lab</h3>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col items-center text-center gap-4">
                             <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-900"><Shield size={32}/></div>
                             <h4 className="text-[10px] font-black uppercase tracking-widest">Identity Shield</h4>
                             <p className="text-[8px] font-medium text-slate-400">Two-factor authentication is active on this account via institutional email linkage.</p>
                          </div>
                          <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col items-center text-center gap-4 opacity-50 grayscale cursor-not-allowed">
                             <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-900"><Fingerprint size={32}/></div>
                             <h4 className="text-[10px] font-black uppercase tracking-widest">Biometric Link</h4>
                             <p className="text-[8px] font-medium text-slate-400">Hardware tokens are currently restricted by platform governance.</p>
                          </div>
                          <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col items-center text-center gap-4">
                             <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-900"><Database size={32}/></div>
                             <h4 className="text-[10px] font-black uppercase tracking-widest">Infrastructure Audit</h4>
                             <button className="text-[8px] font-black uppercase tracking-widest text-indigo-600 italic underline">Download Access History</button>
                          </div>
                       </div>
                       <div className="p-10 bg-red-50 border border-red-100 rounded-[48px] space-y-6">
                          <div className="flex items-center gap-4 text-red-600">
                             <Trash2 size={24} />
                             <h4 className="text-sm font-black uppercase tracking-[0.2em] italic">Decommission Institutional Node</h4>
                          </div>
                          <p className="text-[10px] font-bold text-red-800 tracking-tight">Requesting account termination will trigger a 30-day cooling-off protocol. All linked business units will be suspended immediately. This action is audited and irreversible.</p>
                          <button className="px-8 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 transition-all">Initiate Termination Protocol</button>
                       </div>
                    </section>
                  )}

                  {activeTab === 'ai' && (
                    <section className="space-y-8 p-10 bg-purple-50/30 rounded-[40px] border border-purple-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-900 italic uppercase underline decoration-purple-500/30 underline-offset-8">Neural Intelligence Hub</h3>
                        <button 
                          onClick={() => handleTestConnection('openai', 'openai_api_key')}
                          disabled={testingType === 'openai'}
                          className="bg-purple-600 text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/10"
                        >
                          {testingType === 'openai' ? <RefreshCw size={10} className="animate-spin" /> : <Zap size={10} />}
                          Verify Connection
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Field label="OpenAI API Key" type="password" value={settings.openai_api_key} onChange={(v) => handleChange('openai_api_key', v)} />
                        <Select label="Inference Model" value={settings.openai_model} options={[{v:'gpt-4o', l:'GPT-4o (Premium)'}, {v:'gpt-3.5-turbo', l:'GPT-3.5 (Speed)'}]} onChange={(v) => handleChange('openai_model', v)} />
                      </div>
                    </section>
                  )}

                  {activeTab === 'meetings' && (
                    <section className="space-y-8 p-10 bg-blue-50/30 rounded-[40px] border border-blue-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-900 italic uppercase underline decoration-blue-500/30 underline-offset-8">Virtual Meetings</h3>
                        <button 
                          onClick={() => handleTestConnection('zoom', 'zoom_client_id')}
                          disabled={testingType === 'zoom'}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/10"
                        >
                          {testingType === 'zoom' ? <RefreshCw size={10} className="animate-spin" /> : <Zap size={10} />}
                          Test Zoom API
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <Field label="Zoom Account ID" value={settings.zoom_account_id} onChange={(v)=>handleChange('zoom_account_id', v)} placeholder="Essential for S2S OAuth"/>
                         <div className="hidden md:block"></div>
                         <Field label="Zoom Client ID" value={settings.zoom_client_id} onChange={(v)=>handleChange('zoom_client_id', v)}/>
                         <Field label="Zoom Secret" type="password" value={settings.zoom_client_secret} onChange={(v)=>handleChange('zoom_client_secret', v)}/>
                         <Field label="Teams Tenant ID" value={settings.teams_tenant_id} onChange={(v)=>handleChange('teams_tenant_id', v)} placeholder="Azure AD Tenant ID"/>
                         <div className="hidden md:block"></div>
                         <Field label="Teams Client ID" value={settings.teams_client_id} onChange={(v)=>handleChange('teams_client_id', v)}/>
                         <Field label="Teams Secret" type="password" value={settings.teams_client_secret} onChange={(v)=>handleChange('teams_client_secret', v)}/>
                      </div>
                    </section>
                  )}

                  {activeTab === 'calendar' && (
                    <section className="space-y-8 p-10 bg-rose-50/30 rounded-[40px] border border-rose-100">
                      <div className="flex justify-between items-center">
                         <h3 className="text-xl font-black text-slate-900 italic uppercase underline decoration-rose-500/30 underline-offset-8">Google Calendar</h3>
                         <button 
                           onClick={() => handleTestConnection('google_calendar', 'google_calendar_client_id')}
                           disabled={testingType === 'google_calendar'}
                           className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/10"
                         >
                           {testingType === 'google_calendar' ? <RefreshCw size={10} className="animate-spin" /> : <Zap size={10} />}
                           Authorize Protocol
                         </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <Field label="Client ID" value={settings.google_calendar_client_id} onChange={(v)=>handleChange('google_calendar_client_id', v)}/>
                         <Field label="Client Secret" type="password" value={settings.google_calendar_client_secret} onChange={(v)=>handleChange('google_calendar_client_secret', v)}/>
                      </div>
                    </section>
                  )}

                  {activeTab === 'vehicle' && (
                    <section className="space-y-8 p-10 bg-orange-50/30 rounded-[40px] border border-orange-100">
                       <h3 className="text-xl font-black text-slate-900 italic uppercase underline decoration-orange-500/30 underline-offset-8">Vehicle Technicals API</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <Field label="API Key" value={settings.car_api_key} onChange={(v)=>handleChange('car_api_key', v)}/>
                          <Field label="API Secret" type="password" value={settings.car_api_secret} onChange={(v)=>handleChange('car_api_secret', v)}/>
                       </div>
                    </section>
                  )}

                  {activeTab === 'payments' && (
                    <section className="space-y-8 p-10 bg-emerald-50/30 rounded-[40px] border border-emerald-100">
                       <h3 className="text-xl font-black text-slate-900 italic uppercase underline decoration-emerald-500/30 underline-offset-8">M-Pesa Multi-Tenant Hub</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <Field label="Consumer Key" value={settings.payments_mpesa_consumer_key} onChange={(v)=>handleChange('payments_mpesa_consumer_key', v)}/>
                          <Field label="Consumer Secret" type="password" value={settings.payments_mpesa_consumer_secret} onChange={(v)=>handleChange('payments_mpesa_consumer_secret', v)}/>
                          <Field label="Shortcode" value={settings.payments_mpesa_shortcode} onChange={(v)=>handleChange('payments_mpesa_shortcode', v)}/>
                          <Field label="Passkey" type="password" value={settings.payments_mpesa_passkey} onChange={(v)=>handleChange('payments_mpesa_passkey', v)}/>
                       </div>
                    </section>
                  )}

                  {activeTab === 'commissions' && (
                    <section className="space-y-6">
                       <div className="flex justify-between items-center bg-indigo-50/30 p-6 rounded-[32px] border border-indigo-100">
                         <h3 className="text-xl font-black text-slate-900 italic uppercase decoration-indigo-500/30 underline underline-offset-4">Platform Fee Architecture</h3>
                         <button onClick={() => setCommissionRules([...commissionRules, { min_amount: 0, max_amount: 0, type: 'percent', value: 0, is_active: true }])} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-600/10 hover:scale-105 active:scale-95 transition-all"><Plus size={14}/> New Logic</button>
                       </div>
                       <div className="space-y-4 pt-4">
                         {commissionRules.map((rule, i) => (
                           <div key={i} className="p-6 bg-slate-50 rounded-[32px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end relative border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-xl hover:border-indigo-100 group">
                              <button onClick={async () => { 
                                if(rule.id) {
                                  const token = localStorage.getItem('token');
                                  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                                  await axios.delete(`${API_BASE}/commissions/${rule.id}`, { headers }); 
                                }
                                setCommissionRules(commissionRules.filter((_, idx)=>idx!==i)); 
                              }} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-slate-300 hover:text-red-500 transition-all shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 border border-slate-100"><Trash2 size={14}/></button>
                              <div className="w-full"><Field label="Min (KES)" type="number" value={rule.min_amount} onChange={(v)=>{const nr=[...commissionRules]; nr[i].min_amount=v; setCommissionRules(nr);}}/></div>
                              <div className="w-full"><Field label="Max (KES)" type="number" value={rule.max_amount} onChange={(v)=>{const nr=[...commissionRules]; nr[i].max_amount=v; setCommissionRules(nr);}}/></div>
                              <div className="w-full"><Select label="Type" value={rule.type} options={[{v:'percent',l:'Percentage'},{v:'fixed',l:'Fixed Fee'}]} onChange={(v)=>{const nr=[...commissionRules]; nr[i].type=v; setCommissionRules(nr);}}/></div>
                              <div className="w-full"><Field label="Value" type="number" value={rule.value} onChange={(v)=>{const nr=[...commissionRules]; nr[i].value=v; setCommissionRules(nr);}}/></div>
                              <div className="pb-3 text-center flex flex-col items-center">
                                 <label className="text-[8px] font-black uppercase text-slate-400 block mb-1.5 tracking-tighter">Active</label>
                                 <Toggle checked={rule.is_active} onChange={(v)=>{const nr=[...commissionRules]; nr[i].is_active=v; setCommissionRules(nr);}}/>
                              </div>
                           </div>
                         ))}
                         {commissionRules.length === 0 && (
                           <div className="h-40 border-2 border-dashed border-slate-100 rounded-[40px] flex items-center justify-center bg-slate-50/50">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">No fee rules defined for the platform</p>
                           </div>
                         )}
                       </div>
                    </section>
                  )}

                  {activeTab === 'email' && (
                    <section className="space-y-8 p-10 bg-sky-50/30 rounded-[40px] border border-sky-100">
                       <h3 className="text-xl font-black text-slate-900 italic uppercase underline decoration-sky-500/30 underline-offset-8">Global Email Infrastructure</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <Field label="Gmail Address" value={settings.mail_username} onChange={(v)=>handleChange('mail_username', v)} placeholder="e.g. system@gmail.com"/>
                          <Field label="App Password" type="password" value={settings.mail_password} onChange={(v)=>handleChange('mail_password', v)} placeholder="16-character google app password"/>
                          <div className="md:col-span-2 p-8 bg-white rounded-[28px] border border-dashed border-sky-200 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                             <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-900 italic tracking-widest underline decoration-sky-500/20 underline-offset-4">Transactional Content Management</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Modify the visual and textual structure of system emails</p>
                             </div>
                             <button onClick={()=>window.location.href='/portal/communications'} className="px-6 py-3 bg-sky-600 text-white rounded-xl text-[9px] uppercase tracking-widest font-black shadow-lg shadow-sky-600/20 hover:scale-105 transition-all">Open Communications Lab</button>
                          </div>
                       </div>
                    </section>
                  )}

                  {activeTab === 'marketing' && (
                    <div className="space-y-10">
                       <section className="space-y-8">
                         <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[32px] border border-slate-200">
                           <h3 className="text-xl font-black text-slate-900 italic uppercase underline decoration-slate-950/10 underline-offset-4">Landing Matrix Sliders</h3>
                           <button onClick={()=>addArrayItem('home_slider_slides', {title:'', image_url:'', link_url:'', source_type: 'product'})} className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"><Plus size={14}/> New Promo Node</button>
                         </div>
                         <div className="space-y-6 pt-4">
                           <AnimatePresence mode="popLayout">
                             {(settings.home_slider_slides || []).map((slide, i) => (
                               <motion.div 
                                 key={i}
                                 layout
                                 initial={{ opacity: 0, scale: 0.9, y: -40 }}
                                 animate={{ opacity: 1, scale: 1, y: 0 }}
                                 exit={{ opacity: 0, scale: 0.9, y: -20, height: 0, marginBottom: 0, overflow: 'hidden' }}
                                 transition={{ 
                                   type: 'spring', 
                                   damping: 30, 
                                   stiffness: 120,
                                   opacity: { duration: 0.5 },
                                   y: { stiffness: 80, damping: 25 }
                                 }}
                               >
                                 <SlideSourcePicker 
                                   slide={slide} 
                                   brandColor={settings.brand_color || '#0F172A'}
                                   onRemove={() => removeArrayItem('home_slider_slides', i)}
                                   onChange={(field, val) => handleArrayChange('home_slider_slides', i, field, val)}
                                   onSync={handleSave}
                                 />
                               </motion.div>
                             ))}
                           </AnimatePresence>

                           {(!settings.home_slider_slides || settings.home_slider_slides.length === 0) && (

                              <div className="h-40 border-2 border-dashed border-slate-100 rounded-[40px] flex items-center justify-center bg-slate-50/50">
                                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">No promotional assets staged for deployment</p>
                              </div>
                           )}
                         </div>
                       </section>
                    </div>
                  )}

                  {activeTab === 'general' && (
                    <section className="space-y-8 p-10 bg-slate-50 rounded-[48px] border border-slate-100">
                       <h3 className="text-xl font-black text-slate-900 italic uppercase underline decoration-slate-950/10 underline-offset-8">Institutional Core Configuration</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <Field label="Official Site Name" value={settings.site_name} onChange={(v)=>handleChange('site_name', v)}/>
                          <Field label="System Default Commission (%)" type="number" value={settings.payments_commission_percent} onChange={(v)=>handleChange('payments_commission_percent', v)}/>
                          <div className="md:col-span-2">
                             <Field label="Institutional Meta Description" value={settings.site_description} onChange={(v)=>handleChange('site_description', v)} placeholder="Platform overview for SEO synthesis..."/>
                          </div>
                       </div>
                    </section>
                  )}

               </motion.div>
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};

const LogoPicker = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'multipart/form-data' };
      const response = await axios.post(`${API_BASE}/portal/settings/upload`, formData, {
        headers
      });
      if (response.data.success) {
        onChange(response.data.url);
      }
    } catch (error) {
      console.error('Logo upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-xl transition-all duration-500">
       <div className="w-20 h-20 bg-white rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm relative group/logo">
          {value ? (
            <img src={value} alt="Current Logo" className="w-full h-full object-contain p-2" />
          ) : (
            <ImageIcon size={24} className="text-slate-200" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
               <Loader2 size={16} className="text-white animate-spin" />
            </div>
          )}
       </div>
       <div className="flex-1 space-y-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*"
          />
          <div className="flex flex-wrap gap-3">
             <button 
               onClick={() => fileInputRef.current.click()}
               disabled={uploading}
               className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
             >
               {uploading ? 'Uploading...' : 'Change Logo'}
               <Upload size={12} />
             </button>
             {value && (
               <button 
                 onClick={() => onChange('')}
                 className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-100 transition-all"
               >
                 Remove
                 <X size={12} />
               </button>
             )}
          </div>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Recommended: Transparent PNG or SVG (Max 2MB)</p>
       </div>
    </div>
  );
};

const SlideSourcePicker = ({ slide, onRemove, onChange, onSync, brandColor }) => {
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  const sourceType = slide.source_type || 'custom';

  useEffect(() => {
    if (showCatalog) fetchCatalog();
  }, [showCatalog]);

  useEffect(() => {
    setImgError(false);
  }, [slide.image_url]);

  const fetchCatalog = async () => {
    try {
      const response = await axios.get(`${API_BASE}/portal/cms/products`);
      setCatalog(response.data.products || []);
    } catch (e) { console.error(e); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const response = await axios.post(`${API_BASE}/portal/settings/upload`, formData);
      if (response.data.success) onChange('image_url', response.data.url);
    } catch (e) { console.error(e); } finally { setUploading(false); }
  };

  const filtered = catalog.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.shop_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 relative group transition-all hover:bg-white hover:shadow-2xl overflow-hidden">
       <button onClick={onRemove} className="absolute -top-1 -right-1 w-10 h-10 rounded-bl-[20px] bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg"><Trash2 size={16}/></button>
       
       <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-64 space-y-4">
             <div className="h-44 bg-slate-100 rounded-[32px] overflow-hidden border border-slate-200 relative group/preview">
                {slide.image_url && !imgError ? (
                  <img 
                    src={slide.image_url} 
                    className="w-full h-full object-cover" 
                    alt="Slide" 
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-slate-50">
                     <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-200 group-hover/preview:scale-110 transition-transform">
                        <ImageIcon size={32} />
                     </div>
                     <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest text-center px-6 italic opacity-60">Asset Placeholder</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                   <button onClick={() => fileInputRef.current.click()} className="p-3 bg-white rounded-2xl text-slate-900 shadow-xl hover:scale-110 active:scale-90 transition-all"><CloudUpload size={20}/></button>
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center backdrop-blur-sm">
                     <Loader2 size={24} className="text-white animate-spin mb-2" />
                     <p className="text-[8px] font-black uppercase text-white tracking-widest italic animate-pulse">Processing Asset</p>
                  </div>
                )}
             </div>
             <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
             
             <div className="flex bg-slate-200/50 p-1 rounded-2xl">
                {['custom', 'catalog'].map(t => (
                  <button 
                    key={t}
                    onClick={() => onChange('source_type', t)}
                    className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${sourceType === t ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>

          <div className="flex-1 space-y-8 py-2">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1 flex items-center gap-2">
                      <Tag size={12} className="text-indigo-500" />
                      Promotional Headline
                   </label>
                   <input 
                     value={slide.title || ''} 
                     onChange={(e) => onChange('title', e.target.value)} 
                     className="w-full bg-white border border-slate-100 rounded-[20px] px-6 py-4 text-xs font-black text-slate-900 outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all shadow-sm italic"
                     placeholder="e.g. MEGA SUMMER SALE 2024"
                   />
                </div>

                <div className="space-y-4 text-left">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-900 ml-1 flex items-center gap-2">
                      <MousePointer2 size={12} className="text-indigo-500" />
                      Interaction Target
                   </label>
                   {sourceType === 'catalog' ? (
                      <button 
                        onClick={() => setShowCatalog(true)}
                        className="w-full bg-indigo-50/50 border border-indigo-100 rounded-[20px] px-6 py-4 text-xs font-black text-indigo-600 flex items-center justify-between group/btn hover:bg-white transition-all shadow-sm text-left"
                      >
                         <div className="truncate">
                            {slide.link_url || 'SYNCHRONIZE WITH CATALOG'}
                         </div>
                         <Search size={14} className="group-hover/btn:scale-125 transition-transform" />
                      </button>
                   ) : (
                      <input 
                        value={slide.link_url || ''} 
                        onChange={(e) => onChange('link_url', e.target.value)} 
                        className="w-full bg-white border border-slate-100 rounded-[20px] px-6 py-4 text-xs font-black text-slate-900 outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all shadow-sm"
                        placeholder="e.g. /products/all"
                      />
                   )}
                </div>
             </div>

             <div className="p-6 bg-indigo-900 rounded-[24px] text-white flex items-center gap-6 shadow-2xl relative overflow-hidden group/overlay">
                <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover/overlay:rotate-12 transition-transform">
                   <Monitor size={120} />
                </div>
                <div className="flex-1 space-y-1 relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] italic opacity-60">Strategic Placement</p>
                   <p className="text-xs font-black text-indigo-100">This promo node will be injected into the Landing Matrix Slider without temporal expiration.</p>
                </div>
                <button 
                  onClick={onSync}
                  className="px-5 py-2.5 bg-white text-indigo-900 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10"
                >
                  Live Site Sync
                </button>
             </div>
          </div>
       </div>

       <AnimatePresence>
          {showCatalog && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[400] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6"
            >
               <motion.div 
                 initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                 className="w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col h-[70vh]"
               >
                  <div className="p-10 pb-6 space-y-8">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <div 
                             className="p-4 text-white rounded-[24px] rotate-[-3deg] shadow-xl"
                             style={{ backgroundColor: brandColor }}
                           >
                              <Database size={28} />
                           </div>
                           <div>
                              <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-tight">Catalog Orchestrator</h2>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select an entity for promotional linkage</p>
                           </div>
                        </div>
                        <button onClick={() => setShowCatalog(false)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X size={20}/></button>
                     </div>
                     <div className="relative">
                        <input 
                           autoFocus
                           placeholder="Search Products & Offers..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-100 rounded-[28px] px-10 py-6 text-base font-black text-slate-900 outline-none transition-all pl-16 shadow-inner focus:bg-white"
                           style={{ 
                             boxShadow: search ? `0 0 0 4px ${brandColor}10` : 'none',
                             borderColor: search ? brandColor : undefined
                           }}
                        />
                        <Search 
                          className="absolute left-7 top-1/2 -translate-y-1/2 transition-colors" 
                          style={{ color: search ? brandColor : '#CBD5E1' }}
                          size={24} 
                        />
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar space-y-3">
                     {filtered.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => {
                            onChange('title', p.title);
                            onChange('link_url', p.link);
                            if (p.image) onChange('image_url', p.image);
                            setShowCatalog(false);
                          }}
                          className="w-full flex items-center gap-6 p-6 bg-slate-50 rounded-[36px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all group"
                          style={{ 
                            borderLeft: `8px solid ${brandColor}00`,
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = brandColor}
                          onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = 'transparent'}
                        >
                           <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden border border-slate-100 group-hover:rotate-3 transition-transform">
                              {p.image ? (
                                <img src={p.image} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100"><ImageIcon size={18} className="text-slate-300" /></div>
                              )}
                           </div>
                           <div className="flex-1 text-left space-y-0.5">
                              <p className="text-xs font-black text-slate-900 uppercase leading-snug group-hover:italic transition-all">{p.title}</p>
                              <div className="flex items-center gap-3">
                                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-200/50 rounded-lg text-slate-500">
                                    <Store size={10} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">{p.shop_name}</span>
                                 </div>
                                 {p.is_offer && (
                                   <div 
                                     className="px-2 py-0.5 rounded-lg text-white flex items-center gap-1"
                                     style={{ backgroundColor: brandColor }}
                                   >
                                      <Zap size={10}/>
                                      <span className="text-[8px] font-black uppercase tracking-widest">Active Offer</span>
                                   </div>
                                 )}
                              </div>
                           </div>
                           <div 
                             className="opacity-0 group-hover:opacity-100 transition-opacity text-white p-3 rounded-2xl shadow-xl"
                             style={{ backgroundColor: brandColor }}
                           >
                              <MousePointer2 size={18} />
                           </div>
                        </button>
                     ))}
                     {filtered.length === 0 && (
                        <div className="h-40 flex flex-col items-center justify-center gap-3">
                           <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 italic font-black text-slate-300">?</div>
                           <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest italic text-center">No entities matched your search parameters</p>
                        </div>
                     )}
                  </div>
               </motion.div>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};


const Field = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-2">
    <label className="text-[8px] font-black uppercase text-slate-400 ml-1 tracking-widest">{label}</label>
    <div className="relative group/field">
       <input 
         type={type} 
         value={value || ''} 
         onChange={(e) => onChange(e.target.value)} 
         placeholder={placeholder} 
         className="w-full bg-slate-50/50 border border-slate-100 rounded-[20px] px-5 py-3.5 text-xs font-black text-slate-900 outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all duration-300 shadow-sm" 
       />
       <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/field:opacity-40 transition-opacity">
          {type === 'password' ? <Lock size={12}/> : <ChevronRight size={12}/>}
       </div>
    </div>
  </div>
);

const Select = ({ label, value, options, onChange }) => (
  <div className="space-y-2">
    <label className="text-[8px] font-black uppercase text-slate-400 ml-1 tracking-widest">{label}</label>
    <div className="relative group/select">
      <select 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-slate-50/50 border border-slate-100 rounded-[20px] px-5 py-3.5 text-xs font-black text-slate-900 outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all duration-300 shadow-sm"
      >
        <option value="" disabled>Select implementation...</option>
        {(options || []).map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
      </select>
      <ChevronRight size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 group-focus-within/select:rotate-[-90deg] transition-transform" />
    </div>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button 
    onClick={() => onChange(!checked)} 
    className={`w-12 h-6 rounded-full flex items-center px-1 transition-all duration-500 shadow-inner ${checked ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-200 shadow-slate-200/20'}`}
  >
    <motion.div 
      animate={{ x: checked ? 24 : 0 }} 
      className="w-4 h-4 bg-white rounded-full shadow-lg border border-slate-100" 
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </button>
);

export default Settings;
