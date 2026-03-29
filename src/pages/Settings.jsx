import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8003/api/v1';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingType, setTestingType] = useState(null);
  const [settings, setSettings] = useState({});
  const [commissionRules, setCommissionRules] = useState([]);
  const [message, setMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    fetchSettings();
    fetchCommissionRules();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/admin/settings`);
      setSettings(response.data.settings || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
      showToast('Could not load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommissionRules = async () => {
    try {
      const response = await axios.get(`${API_BASE}/commissions`);
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
    newArray.push(template);
    setSettings(prev => ({ ...prev, [key]: newArray }));
  };

  const removeArrayItem = (key, index) => {
    const newArray = (settings[key] || []).filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, [key]: newArray }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_BASE}/admin/settings`, settings);
      
      for (const rule of commissionRules) {
        if (rule.id) {
          await axios.put(`${API_BASE}/commissions/${rule.id}`, rule);
        } else {
          await axios.post(`${API_BASE}/commissions`, rule);
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
      const response = await axios.post(`${API_BASE}/admin/settings/verify-connection`, {
        type,
        key: settings[keyId],
        key_id: keyId
      });
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

  const tabs = [
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
          onClick={handleSave}
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
                        <Field label="Custom Logo URL" value={settings.custom_logo} onChange={(v) => handleChange('custom_logo', v)} placeholder="https://..." />
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
                              <button onClick={async () => { if(rule.id) await axios.delete(`${API_BASE}/commissions/${rule.id}`); setCommissionRules(commissionRules.filter((_, idx)=>idx!==i)); }} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-slate-300 hover:text-red-500 transition-all shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 border border-slate-100"><Trash2 size={14}/></button>
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
                          <Field label="SMTP Username" value={settings.mail_username} onChange={(v)=>handleChange('mail_username', v)}/>
                          <Field label="SMTP Password" type="password" value={settings.mail_password} onChange={(v)=>handleChange('mail_password', v)}/>
                          <Field label="SMTP Host" value={settings.mail_host} onChange={(v)=>handleChange('mail_host', v)}/>
                          <Field label="SMTP Port" value={settings.mail_port} onChange={(v)=>handleChange('mail_port', v)}/>
                          <div className="md:col-span-2 p-8 bg-white rounded-[28px] border border-dashed border-sky-200 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                             <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-900 italic tracking-widest underline decoration-sky-500/20 underline-offset-4">Transactional Content Management</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Modify the visual and textual structure of system emails</p>
                             </div>
                             <button onClick={()=>window.location.href='/admin/communications'} className="px-6 py-3 bg-sky-600 text-white rounded-xl text-[9px] uppercase tracking-widest font-black shadow-lg shadow-sky-600/20 hover:scale-105 transition-all">Open Communications Lab</button>
                          </div>
                       </div>
                    </section>
                  )}

                  {activeTab === 'marketing' && (
                    <div className="space-y-10">
                       <section className="space-y-8">
                         <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[32px] border border-slate-200">
                           <h3 className="text-xl font-black text-slate-900 italic uppercase underline decoration-slate-950/10 underline-offset-4">Landing Matrix Sliders</h3>
                           <button onClick={()=>addArrayItem('home_slider_slides', {title:'', image_url:'', link_url:''})} className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"><Plus size={14}/> New Asset</button>
                         </div>
                         <div className="space-y-4 pt-4">
                           {(settings.home_slider_slides || []).map((slide, i) => (
                             <div key={i} className="p-8 bg-slate-50 rounded-[40px] grid grid-cols-1 md:grid-cols-3 gap-6 relative border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all">
                               <button onClick={()=>removeArrayItem('home_slider_slides', i)} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-slate-300 hover:text-red-500 transition-all shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 border border-slate-100"><Trash2 size={16}/></button>
                               <div className="md:col-span-1"><Field label="Headline" value={slide.title} onChange={(v)=>handleArrayChange('home_slider_slides',i,'title',v)} placeholder="e.g. New Arrivals"/></div>
                               <div className="md:col-span-1"><Field label="Asset Link (Image URL)" value={slide.image_url} onChange={(v)=>handleArrayChange('home_slider_slides',i,'image_url',v)} placeholder="https://..."/></div>
                               <div className="md:col-span-1"><Field label="Redirect Path" value={slide.link_url} onChange={(v)=>handleArrayChange('home_slider_slides',i,'link_url',v)} placeholder="/shop/category/..."/></div>
                             </div>
                           ))}
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
