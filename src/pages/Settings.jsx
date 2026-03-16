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
  Send
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8003/api/v1';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});
  const [commissionRules, setCommissionRules] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
    fetchCommissionRules();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE}/settings`);
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCommissionRules = async () => {
    try {
      const response = await axios.get(`${API_BASE}/commissions`);
      setCommissionRules(response.data.rules);
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
    setMessage(null);
    try {
      await axios.post(`${API_BASE}/settings`, settings);
      
      // Save commission rules
      for (const rule of commissionRules) {
        try {
          if (rule.id) {
            await axios.put(`${API_BASE}/commissions/${rule.id}`, rule);
          } else {
            await axios.post(`${API_BASE}/commissions`, rule);
          }
        } catch (ruleErr) {
          console.error('Error saving commission rule:', ruleErr);
          throw new Error(`Failed to save commission rule: ${ruleErr.response?.data?.message || ruleErr.message}`);
        }
      }

      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      fetchSettings();
      fetchCommissionRules();
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save settings.';
      const details = error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : '';
      setMessage({ type: 'error', text: `${errorMsg} ${details}`.trim() });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General Info', icon: Globe },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'commissions', label: 'Commission Rules', icon: ShieldCheck },
    { id: 'email', label: 'Email Config', icon: Mail },
    { id: 'slider', label: 'Home Slider', icon: ImageIcon },
    { id: 'content', label: 'Home Content', icon: Layout },
    { id: 'footer', label: 'Footer Info', icon: Monitor },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-900/10">
                <SettingsIcon size={24} />
             </div>
             System Core
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage platform-wide configurations and business rules.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-600 text-white px-8 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary-500/30 hover:bg-primary-700 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
          {saving ? 'Saving...' : 'Deploy Changes'}
        </button>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <Bell size={18} />}
          <span className="text-sm font-bold">{message.text}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         {/* Sticky Navigation */}
         <div className="lg:col-span-3 space-y-2 lg:sticky lg:top-24">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-3xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-primary-600 shadow-xl shadow-slate-200/50 border border-slate-100' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
              >
                <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary-50' : 'bg-transparent'}`}>
                   <tab.icon size={20} />
                </div>
                {tab.label}
              </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="lg:col-span-9 bg-white rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 p-8 md:p-12 min-h-[600px]">
            <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, x: 10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -10 }}
                 transition={{ duration: 0.2 }}
                 className="space-y-10"
               >
                  {activeTab === 'general' && (
                    <section className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900 italic">Platform Profile</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Site Name" value={settings.site_name} onChange={(v) => handleChange('site_name', v)} />
                        
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Brand Color</label>
                          <div className="flex items-center gap-4">
                             <input 
                               type="color" 
                               value={settings.brand_color || '#3B82F6'} 
                               onChange={(e) => handleChange('brand_color', e.target.value)}
                               className="w-12 h-12 rounded-xl border-none p-0 overflow-hidden cursor-pointer"
                             />
                             <div className="flex flex-wrap gap-2">
                               {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#0F172A'].map((color) => (
                                 <button
                                   key={color}
                                   onClick={() => handleChange('brand_color', color)}
                                   className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${settings.brand_color === color ? 'border-slate-900 shadow-lg' : 'border-white shadow-sm'}`}
                                   style={{ backgroundColor: color }}
                                 />
                               ))}
                             </div>
                          </div>
                        </div>

                        <Field label="Commission Percentage (%)" type="number" value={settings.payments_commission_percent} onChange={(v) => handleChange('payments_commission_percent', v)} />
                        <Field label="Support Email" value={settings.footer_contact_email} onChange={(v) => handleChange('footer_contact_email', v)} />
                      </div>
                    </section>
                  )}

                  {activeTab === 'payments' && (
                    <div className="space-y-10">
                      <section className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-slate-900 italic flex items-center gap-2">
                            <Smartphone size={20} className="text-emerald-600" /> M-Pesa Integration
                          </h3>
                          <Toggle 
                            checked={settings.payments_mpesa_enabled === '1' || settings.payments_mpesa_enabled === true} 
                            onChange={(v) => handleChange('payments_mpesa_enabled', v)} 
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2 border-slate-50 mt-4">
                          <Select 
                            label="Environment" 
                            value={settings.payments_mpesa_environment} 
                            options={[{v: 'sandbox', l: 'Sandbox'}, {v: 'production', l: 'Production'}]}
                            onChange={(v) => handleChange('payments_mpesa_environment', v)} 
                          />
                          <Field label="Shortcode" value={settings.payments_mpesa_shortcode} onChange={(v) => handleChange('payments_mpesa_shortcode', v)} />
                          <Field label="Consumer Key" type="password" value={settings.payments_mpesa_consumer_key} onChange={(v) => handleChange('payments_mpesa_consumer_key', v)} placeholder="••••••••••••••••" />
                          <Field label="Consumer Secret" type="password" value={settings.payments_mpesa_consumer_secret} onChange={(v) => handleChange('payments_mpesa_consumer_secret', v)} placeholder="••••••••••••••••" />
                          <Field label="Passkey" type="password" value={settings.payments_mpesa_passkey} onChange={(v) => handleChange('payments_mpesa_passkey', v)} placeholder="••••••••••••••••" />
                        </div>
                      </section>

                      <div className="h-px bg-slate-50" />

                      <section className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-slate-900 italic flex items-center gap-2">
                            <CreditCard size={20} className="text-primary-600" /> Stripe Integration
                          </h3>
                          <Toggle 
                            checked={settings.payments_stripe_enabled === '1' || settings.payments_stripe_enabled === true} 
                            onChange={(v) => handleChange('payments_stripe_enabled', v)} 
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2 border-slate-50 mt-4">
                          <Field label="Publishable Key" value={settings.payments_stripe_publishable_key} onChange={(v) => handleChange('payments_stripe_publishable_key', v)} />
                          <Field label="Secret Key" type="password" value={settings.payments_stripe_secret_key} onChange={(v) => handleChange('payments_stripe_secret_key', v)} placeholder="••••••••••••••••" />
                          <Field label="Webhook Secret" type="password" value={settings.payments_stripe_webhook_secret} onChange={(v) => handleChange('payments_stripe_webhook_secret', v)} placeholder="••••••••••••••••" />
                        </div>
                      </section>
                    </div>
                  )}

                  {activeTab === 'commissions' && (
                    <section className="space-y-8">
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-black text-slate-900 italic">Tiered Commission Rules</h3>
                         <button 
                           onClick={() => setCommissionRules([...commissionRules, { min_amount: 0, max_amount: null, type: 'percent', value: 0, is_active: true }])}
                           className="text-primary-600 hover:text-primary-700 text-xs font-black uppercase tracking-widest flex items-center gap-1"
                         >
                           <Plus size={14} /> Add Rule
                         </button>
                      </div>
                      
                      <div className="space-y-4">
                        {commissionRules.map((rule, i) => (
                          <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-transparent hover:border-slate-200 transition-all flex flex-wrap md:flex-nowrap items-end gap-4 relative group">
                            <button 
                              onClick={async () => {
                                if (rule.id) await axios.delete(`${API_BASE}/commissions/${rule.id}`);
                                setCommissionRules(commissionRules.filter((_, idx) => idx !== i));
                              }}
                              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className="w-full md:w-32">
                              <Field label="Min (KES)" type="number" value={rule.min_amount} onChange={(v) => {
                                const newRules = [...commissionRules];
                                newRules[i].min_amount = v;
                                setCommissionRules(newRules);
                              }} />
                            </div>
                            <div className="w-full md:w-32">
                              <Field label="Max (KES)" type="number" value={rule.max_amount} onChange={(v) => {
                                const newRules = [...commissionRules];
                                newRules[i].max_amount = v;
                                setCommissionRules(newRules);
                              }} />
                            </div>
                            <div className="w-full md:w-32">
                              <Select label="Type" value={rule.type} options={[{v: 'percent', l: '%'}, {v: 'fixed', l: 'Fixed'}]} onChange={(v) => {
                                const newRules = [...commissionRules];
                                newRules[i].type = v;
                                setCommissionRules(newRules);
                              }} />
                            </div>
                            <div className="w-full md:w-32">
                              <Field label="Value" type="number" value={rule.value} onChange={(v) => {
                                const newRules = [...commissionRules];
                                newRules[i].value = v;
                                setCommissionRules(newRules);
                              }} />
                            </div>
                            <div className="pb-4">
                              <Toggle checked={rule.is_active} onChange={(v) => {
                                const newRules = [...commissionRules];
                                newRules[i].is_active = v;
                                setCommissionRules(newRules);
                              }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {activeTab === 'email' && (
                    <section className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900 italic flex items-center gap-2">
                        <Send size={20} className="text-primary-600" /> Mail Infrastructure
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select 
                          label="Mailer Engine" 
                          value={settings.mail_mailer} 
                          options={[{v: 'smtp', l: 'SMTP Server'}, {v: 'log', l: 'Log Only (Dev)'}, {v: 'ses', l: 'Amazon SES'}]}
                          onChange={(v) => handleChange('mail_mailer', v)} 
                        />
                        <Field label="SMTP Host" value={settings.mail_host} onChange={(v) => handleChange('mail_host', v)} placeholder="smtp.mailtrap.io" />
                        <Field label="SMTP Port" type="number" value={settings.mail_port} onChange={(v) => handleChange('mail_port', v)} placeholder="587" />
                        <Field label="User Auth" value={settings.mail_username} onChange={(v) => handleChange('mail_username', v)} placeholder="username" />
                        <Field label="Access Secret" type="password" value={settings.mail_password} onChange={(v) => handleChange('mail_password', v)} placeholder="••••••••••••••••" />
                        <Select 
                          label="Encryption" 
                          value={settings.mail_encryption} 
                          options={[{v: 'tls', l: 'TLS'}, {v: 'ssl', l: 'SSL'}, {v: 'none', l: 'None'}]}
                          onChange={(v) => handleChange('mail_encryption', v)} 
                        />
                        <Field label="Sender Address" value={settings.mail_from_address} onChange={(v) => handleChange('mail_from_address', v)} placeholder="noreply@sparenova.com" />
                        <Field label="Sender Identity" value={settings.mail_from_name} onChange={(v) => handleChange('mail_from_name', v)} placeholder="SpareNova Platform" />
                      </div>
                    </section>
                  )}

                  {activeTab === 'slider' && (
                    <section className="space-y-8">
                       <div className="flex items-center justify-between">
                         <h3 className="text-xl font-black text-slate-900 italic">Homepage Carousel</h3>
                         <button 
                           onClick={() => addArrayItem('home_slider_slides', { title: '', subtitle: '', image_url: '', link_url: '', link_label: '' })}
                           className="text-primary-600 hover:text-primary-700 text-xs font-black uppercase tracking-widest flex items-center gap-1"
                         >
                           <Plus size={14} /> New Slide
                         </button>
                       </div>
                       
                       <div className="space-y-6">
                          {(settings.home_slider_slides || []).map((slide, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-[40px] relative group border border-transparent hover:border-slate-200 transition-all space-y-6">
                              <button 
                                onClick={() => removeArrayItem('home_slider_slides', i)}
                                className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field label="Slide Heading" value={slide.title} onChange={(v) => handleArrayChange('home_slider_slides', i, 'title', v)} />
                                <Field label="Slide Text" value={slide.subtitle} onChange={(v) => handleArrayChange('home_slider_slides', i, 'subtitle', v)} />
                                <Field label="Image Path/URL" value={slide.image_url} onChange={(v) => handleArrayChange('home_slider_slides', i, 'image_url', v)} placeholder="/images/slider/1.jpg" />
                                <div className="grid grid-cols-2 gap-4">
                                  <Field label="Button Text" value={slide.link_label} onChange={(v) => handleArrayChange('home_slider_slides', i, 'link_label', v)} placeholder="Shop Now" />
                                  <Field label="Target Path" value={slide.link_url} onChange={(v) => handleArrayChange('home_slider_slides', i, 'link_url', v)} placeholder="/products" />
                                </div>
                              </div>
                            </div>
                          ))}
                       </div>
                    </section>
                  )}

                  {activeTab === 'content' && (
                    <section className="space-y-10">
                      <div className="space-y-6">
                        <h3 className="text-xl font-black text-slate-900 italic">Intro Hub</h3>
                        <div className="space-y-4">
                          <Field label="Main Hero Title" value={settings.home_intro_title} onChange={(v) => handleChange('home_intro_title', v)} />
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hero Subtext</label>
                            <textarea 
                              value={settings.home_intro_subtitle || ''} 
                              onChange={(e) => handleChange('home_intro_subtitle', e.target.value)}
                              rows={3}
                              className="w-full bg-slate-50 border border-slate-100 rounded-[28px] px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-slate-900 italic">Trust Features</h3>
                          <button 
                            onClick={() => addArrayItem('home_features', { icon: '', title: '', subtitle: '' })}
                            disabled={(settings.home_features || []).length >= 4}
                            className="text-primary-600 hover:text-primary-700 text-xs font-black uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
                          >
                            <Plus size={14} /> Add Feature
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {(settings.home_features || []).map((feature, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-[32px] relative group border border-transparent hover:border-slate-200 transition-all">
                              <button 
                                onClick={() => removeArrayItem('home_features', i)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Icon Path" value={feature.icon} onChange={(v) => handleArrayChange('home_features', i, 'icon', v)} />
                                <Field label="Feature Title" value={feature.title} onChange={(v) => handleArrayChange('home_features', i, 'title', v)} />
                                <Field label="Brief Detail" value={feature.subtitle} onChange={(v) => handleArrayChange('home_features', i, 'subtitle', v)} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {activeTab === 'footer' && (
                    <section className="space-y-12">
                       <div className="space-y-8">
                         <h3 className="text-xl font-black text-slate-900 italic">Brand Identity</h3>
                         <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Footer Brand Story</label>
                              <textarea 
                                value={settings.footer_description || ''} 
                                onChange={(e) => handleChange('footer_description', e.target.value)}
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[28px] px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all" 
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Field label="HQ Address" value={settings.footer_contact_address} onChange={(v) => handleChange('footer_contact_address', v)} />
                              <Field label="Contact Phone" value={settings.footer_contact_phone} onChange={(v) => handleChange('footer_contact_phone', v)} />
                            </div>
                         </div>
                       </div>

                       <div className="space-y-8">
                          <h3 className="text-xl font-black text-slate-900 italic">Footer Subscription</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Subscribe Title" value={settings.footer_subscribe_title} onChange={(v) => handleChange('footer_subscribe_title', v)} />
                            <Field label="Subscribe Button Text" value={settings.footer_subscribe_button} onChange={(v) => handleChange('footer_subscribe_button', v)} />
                            <Field label="Placeholder Text" value={settings.footer_subscribe_placeholder} onChange={(v) => handleChange('footer_subscribe_placeholder', v)} />
                            <Field label="Marketing Subtext" value={settings.footer_subscribe_text} onChange={(v) => handleChange('footer_subscribe_text', v)} />
                          </div>
                       </div>

                       <div className="h-px bg-slate-50" />

                       <div className="space-y-8">
                          <h3 className="text-xl font-black text-slate-900 italic">Social Matrix</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(settings.footer_social_links || []).map((social, i) => (
                              <div key={i} className="space-y-2 p-4 bg-slate-50 rounded-2xl relative">
                                <button onClick={() => removeArrayItem('footer_social_links', i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={12} /></button>
                                <div className="text-[8px] font-black uppercase text-slate-400">{social.label}</div>
                                <input value={social.url} onChange={(e) => handleArrayChange('footer_social_links', i, 'url', e.target.value)} className="w-full bg-white/50 text-[11px] font-bold p-2 rounded-lg outline-none" />
                              </div>
                            ))}
                            <button onClick={() => addArrayItem('footer_social_links', { label: 'New', url: '#' })} className="border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:border-primary-200 hover:text-primary-300 transition-all"><Plus size={20} /></button>
                          </div>
                       </div>

                       <div className="h-px bg-slate-50" />

                       <div className="space-y-8">
                          <h3 className="text-xl font-black text-slate-900 italic">Checkout Trust</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Cart Title" value={settings.cart_title} onChange={(v) => handleChange('cart_title', v)} />
                            <Field label="Cart Subtitle" value={settings.cart_subtitle} onChange={(v) => handleChange('cart_subtitle', v)} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Field label="Trust Line 1" value={settings.cart_trust_line_1} onChange={(v) => handleChange('cart_trust_line_1', v)} />
                            <Field label="Trust Line 2" value={settings.cart_trust_line_2} onChange={(v) => handleChange('cart_trust_line_2', v)} />
                            <Field label="Trust Line 3" value={settings.cart_trust_line_3} onChange={(v) => handleChange('cart_trust_line_3', v)} />
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
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <input 
      type={type}
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all" 
    />
  </div>
);

const Select = ({ label, value, options, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <div className="relative">
      <select 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none pr-12"
      >
        {options.map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
      </select>
      <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
    </div>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`w-14 h-7 rounded-full flex items-center px-1.5 transition-all shadow-inner ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
  >
    <motion.div 
      animate={{ x: checked ? 28 : 0 }}
      className="w-4 h-4 bg-white rounded-full shadow-lg" 
    />
  </button>
);

export default Settings;
