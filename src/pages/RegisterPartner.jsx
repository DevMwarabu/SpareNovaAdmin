import { API_BASE } from '../api/config';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Store, Gavel, Truck, ArrowRight, CheckCircle2, Loader2, Lock,
  Phone, MapPin, FileText, Image as ImageIcon, X, ShieldCheck,
  ArrowLeft, Mail, Building2, Briefcase, Eye, EyeOff, AlertCircle,
  CheckCircle, Circle
} from 'lucide-react';
import axios from 'axios';
import CountrySelector, { allCountries } from '../components/CountrySelector';



// ── Password Policy Engine ──────────────────────────────────────────────────
const passwordRules = [
  { id: 'len',     label: 'At least 8 characters',     test: (p) => p.length >= 8 },
  { id: 'upper',   label: 'One uppercase letter (A–Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',   label: 'One lowercase letter (a–z)', test: (p) => /[a-z]/.test(p) },
  { id: 'digit',   label: 'One number (0–9)',           test: (p) => /\d/.test(p) },
  { id: 'special', label: 'One special character (!@#…)', test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
];

const getStrength = (password) => {
  const passed = passwordRules.filter(r => r.test(password)).length;
  if (!password) return { score: 0, label: '', color: 'bg-slate-200' };
  if (passed <= 1) return { score: 1, label: 'Very Weak',  color: 'bg-red-500' };
  if (passed === 2) return { score: 2, label: 'Weak',      color: 'bg-orange-500' };
  if (passed === 3) return { score: 3, label: 'Fair',      color: 'bg-amber-400' };
  if (passed === 4) return { score: 4, label: 'Strong',    color: 'bg-emerald-400' };
  return               { score: 5, label: 'Very Strong', color: 'bg-emerald-600' };
};

// ── Shared Input wrapper ────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-primary-600 transition-colors">
      {label}
    </label>
    {children}
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
const RegisterPartner = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'store_owner';

  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '', email: '', phone: '', location: '', name: '', password: '',
  });
  const [files, setFiles] = useState({ id_front: null, id_back: null, supporting_document: null });
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(allCountries.find(c => c.code === 'KE') || allCountries[0]);

  const roles = {
    store_owner:  { title: 'Store Partner',    icon: Store, accent: 'blue'    },
    garage_owner: { title: 'Service Garage',   icon: Gavel, accent: 'emerald' },
    delivery:     { title: 'Logistics Fleet',  icon: Truck, accent: 'orange'  },
  };
  const currentRole = roles[role] || roles.store_owner;

  const steps = [
    { id: 1, label: 'Account Details', icon: Building2 },
    { id: 2, label: 'Verifications',   icon: ShieldCheck },
    { id: 3, label: 'Completion',      icon: CheckCircle2 },
  ];

  const strength      = useMemo(() => getStrength(formData.password), [formData.password]);
  const passedRules   = useMemo(() => passwordRules.filter(r => r.test(formData.password)), [formData.password]);
  const passwordReady = passedRules.length === passwordRules.length;

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const { name, files: sel } = e.target;
    if (sel?.[0]) setFiles(prev => ({ ...prev, [name]: sel[0] }));
  };

  const canProceed = formData.businessName && formData.email && passwordReady;

  const submitRegistration = async () => {
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === 'phone') {
          payload.append(k, `${selectedCountry.dial}${v}`);
        } else {
          payload.append(k, v);
        }
      });
      payload.append('role', role);
      if (!formData.name) payload.append('name', formData.businessName);
      if (files.id_front)           payload.append('id_front', files.id_front);
      if (files.id_back)            payload.append('id_back', files.id_back);
      if (files.supporting_document) payload.append('supporting_document', files.supporting_document);

      await axios.post(`${API_BASE}/register`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStep(3);
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const dest = role === 'store_owner' ? 'shops' : role === 'garage_owner' ? 'garages' : 'logistics';
    navigate(`/portal/${dest}`);
  };

  // ── File Upload Field ──────────────────────────────────────────────────
  const FileUploadField = ({ label, name, accept, icon: Icon, value }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all group cursor-pointer
        ${value ? 'border-primary-500 bg-primary-50/10' : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200'}`}>
        <input type="file" name={name} onChange={handleFileChange} accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer z-10" />
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
            ${value ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-white text-slate-300 border border-slate-100 group-hover:border-slate-200 group-hover:text-slate-400'}`}>
            {value ? <CheckCircle2 size={24} /> : <Icon size={24} />}
          </div>
          <div>
            <p className={`text-sm font-bold truncate px-4 ${value ? 'text-primary-900' : 'text-slate-400'}`}>
              {value ? value.name : `Select ${label}`}
            </p>
            {!value && <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight mt-1">PNG, JPG or PDF · 5MB max</p>}
          </div>
        </div>
        {value && (
          <button onClick={(e) => { e.preventDefault(); setFiles(prev => ({ ...prev, [name]: null })); }}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-xl text-slate-400 hover:text-red-500 transition-colors border border-slate-100">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-full space-y-8 pb-16">

      {/* ── Top Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary-600">
            <currentRole.icon size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button onClick={handleBack} className="text-slate-400 hover:text-primary-600 transition-colors text-xs font-bold uppercase tracking-widest">
                Network
              </button>
              <span className="text-slate-300 font-black">/</span>
              <span className="text-slate-900 text-xs font-black uppercase tracking-widest">Onboard {currentRole.title}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Creation Engine</h1>
          </div>
        </div>
        <button onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Cancel Onboarding
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* ── Left Sidebar ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Step tracker */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Onboarding Flow</p>
            <div className="space-y-5">
              {steps.map((s, idx) => (
                <div key={s.id} className="relative flex items-center gap-4">
                  {idx !== steps.length - 1 && (
                    <div className={`absolute left-5 top-10 w-0.5 h-6 transition-colors duration-700 ${step > s.id ? 'bg-emerald-400' : 'bg-slate-100'}`} />
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                    step === s.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 scale-110' :
                    step > s.id  ? 'bg-emerald-500 text-white shadow-md'                                  :
                    'bg-slate-50 text-slate-300 border border-slate-100'}`}>
                    {step > s.id ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-tight transition-colors ${
                      step === s.id ? 'text-primary-600' : step > s.id ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Step {s.id} of 3</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure badge */}
          <div className="bg-primary-600 rounded-[32px] p-7 text-white relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-1000" />
            <ShieldCheck size={30} className="mb-4 opacity-80" />
            <h3 className="text-base font-black italic mb-2 leading-snug">Secure Registration</h3>
            <p className="text-xs text-primary-100 font-medium leading-relaxed mb-4">You are registering a verified partner directly into the global SpareNova marketplace ecosystem.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
              Admin Authorized
            </div>
          </div>
        </div>

        {/* ── Main Form Panel ── */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-8 md:p-14 overflow-hidden">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: Account Details ── */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight italic mb-2">Account Configuration</h2>
                      <p className="text-slate-400 font-medium max-w-lg">Establish the primary identity and access credentials for the new {currentRole.title}.</p>
                    </div>
                    <div className="hidden sm:block text-right shrink-0">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Priority</p>
                      <p className="text-xs font-black text-slate-900 uppercase">Urgent · 1m</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

                    {/* ── Business Column ── */}
                    <div className="space-y-7">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Building2 size={15} />
                        </div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Business Identity</h3>
                      </div>

                      <Field label="Business Name">
                        <div className="relative">
                          <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={17} />
                          <input name="businessName" value={formData.businessName} onChange={handleChange}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-5 py-4 outline-none focus:bg-white focus:border-primary-600 focus:shadow-xl focus:shadow-primary-600/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
                            placeholder="e.g. SpareNova Parts Ltd" />
                        </div>
                      </Field>

                      <Field label="Operational Location">
                        <div className="relative">
                          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={17} />
                          <input name="location" value={formData.location} onChange={handleChange}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-5 py-4 outline-none focus:bg-white focus:border-primary-600 focus:shadow-xl focus:shadow-primary-600/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
                            placeholder="e.g. Nairobi, Industrial Area" />
                        </div>
                      </Field>

                      <Field label="Phone Number">
                        <div className="relative group/phone">
                          <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10">
                            <button 
                              type="button"
                              onClick={() => setShowCountrySelector(true)}
                              className="flex items-center gap-2 pl-4 pr-3 py-2 hover:bg-slate-100 rounded-xl transition-colors border-r border-slate-100"
                            >
                              <span className="text-xl leading-none">{selectedCountry.flag}</span>
                              <span className="text-xs font-black italic text-slate-400 group-focus-within/phone:text-primary-600 transition-colors">{selectedCountry.dial}</span>
                            </button>
                          </div>
                          <input 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-28 pr-5 py-4 outline-none focus:bg-white focus:border-primary-600 focus:shadow-xl focus:shadow-primary-600/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
                            placeholder="700 000 000" 
                          />
                          
                          <AnimatePresence>
                            {showCountrySelector && (
                              <CountrySelector 
                                selected={selectedCountry}
                                onSelect={(c) => {
                                  setSelectedCountry(c);
                                  setShowCountrySelector(false);
                                }}
                                onClose={() => setShowCountrySelector(false)}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      </Field>
                    </div>

                    {/* ── Access Column ── */}
                    <div className="space-y-7">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Lock size={15} />
                        </div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Access Credentials</h3>
                      </div>

                      <Field label="Admin Email (Username)">
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={17} />
                          <input name="email" type="email" value={formData.email} onChange={handleChange}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-5 py-4 outline-none focus:bg-white focus:border-primary-600 focus:shadow-xl focus:shadow-primary-600/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
                            placeholder="admin@business.com" />
                        </div>
                      </Field>

                      {/* Password with strength meter */}
                      <div className="space-y-3 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-primary-600 transition-colors">
                          Temporary Portal Password
                        </label>

                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={17} />
                          <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full bg-slate-50/50 border rounded-2xl pl-14 pr-14 py-4 outline-none focus:bg-white focus:shadow-xl transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm ${
                              formData.password && !passwordReady
                                ? 'border-amber-300 focus:border-amber-400 focus:shadow-amber-500/5'
                                : passwordReady
                                ? 'border-emerald-300 focus:border-emerald-400 focus:shadow-emerald-500/5'
                                : 'border-slate-100 focus:border-primary-600 focus:shadow-primary-600/5'
                            }`}
                            placeholder="Min. 8 chars with symbols"
                          />
                          <button type="button" onClick={() => setShowPassword(p => !p)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                          </button>
                        </div>

                        {/* Strength bar */}
                        {formData.password && (
                          <div className="space-y-2">
                            <div className="flex gap-1.5">
                              {[1,2,3,4,5].map(i => (
                                <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i <= strength.score ? strength.color : 'bg-slate-100'}`} />
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${
                                strength.score >= 4 ? 'text-emerald-600' : strength.score >= 3 ? 'text-amber-500' : 'text-red-500'
                              }`}>{strength.label}</span>
                              <span className="text-[10px] font-bold text-slate-400">{passedRules.length}/{passwordRules.length} Requirements Met</span>
                            </div>
                          </div>
                        )}

                        {/* Policy checklist */}
                        {formData.password && (
                          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                            {passwordRules.map(rule => {
                              const ok = rule.test(formData.password);
                              return (
                                <div key={rule.id} className="flex items-center gap-2.5">
                                  {ok
                                    ? <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                                    : <Circle size={13} className="text-slate-300 shrink-0" />
                                  }
                                  <span className={`text-[10px] font-bold transition-colors ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {rule.label}
                                  </span>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    {!canProceed && formData.password && !passwordReady && (
                      <p className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                        <AlertCircle size={14} /> Password does not meet all requirements
                      </p>
                    )}
                    <div className="ml-auto flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={() => window.location.href = `${API_BASE}/auth/google?role=${role}`}
                        className="px-8 bg-white border-2 border-slate-100 text-slate-900 font-black py-5 rounded-[24px] flex items-center gap-3 hover:border-primary-100 hover:bg-primary-50/10 transition-all shadow-sm active:scale-[0.98] uppercase tracking-widest text-[10px]"
                      >
                        <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-4 h-4" alt="Google" />
                        Register with Google
                      </button>

                      <button onClick={() => setStep(2)} disabled={!canProceed}
                        className="group px-10 bg-primary-600 text-white font-black py-5 rounded-[24px] flex items-center gap-3 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/30 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed">
                        Next: Verification Assets <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Documents ── */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="text-center max-w-xl mx-auto space-y-3">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Compliance Assets</h2>
                    <p className="text-slate-500 font-medium">Upload valid government-issued identification and business operating licenses.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUploadField label="Identity Card (Front)" name="id_front" accept="image/*" icon={ImageIcon} value={files.id_front} />
                    <FileUploadField label="Identity Card (Back)" name="id_back" accept="image/*" icon={ImageIcon} value={files.id_back} />
                  </div>

                  <div className="max-w-xl mx-auto">
                    <FileUploadField label="Business License / Tax Certificate" name="supporting_document" accept=".pdf,image/*" icon={FileText} value={files.supporting_document} />
                  </div>

                  <div className="flex gap-5 pt-6 border-t border-slate-50">
                    <button onClick={() => setStep(1)}
                      className="px-8 bg-slate-50 text-slate-500 font-black py-5 rounded-3xl hover:bg-slate-100 hover:text-slate-700 transition-all">
                      Back
                    </button>
                    <button disabled={loading || !files.id_front || !files.id_back} onClick={submitRegistration}
                      className="flex-1 bg-primary-600 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none">
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <>Generate Verified Partner Account <CheckCircle2 size={20} /></>}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Success ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="mb-8 inline-flex w-32 h-32 rounded-[52px] bg-emerald-50 items-center justify-center text-emerald-500 shadow-inner relative">
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[60px] animate-pulse" />
                    <CheckCircle2 size={64} className="relative z-10" />
                  </div>
                  
                  <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter italic uppercase">Provisioned</h1>
                  <p className="text-lg text-slate-500 font-medium mb-10 max-w-md mx-auto leading-snug px-4">
                    The {currentRole.title} account for <span className="text-slate-900 font-black underline decoration-emerald-200 decoration-4 underline-offset-4">{formData.businessName}</span> has been provisioned and is ready for live operations.
                  </p>

                  <div className="bg-slate-50 rounded-[40px] p-8 text-left mb-10 border border-slate-100 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 ml-1">Lifecycle Tracking</h3>
                    <div className="space-y-6">
                      {[
                        { t: 'Vault Review', d: 'Our analysts are verifying business identity.', col: 'blue' },
                        { t: 'Dispatch Access', d: 'Secure keys will be issued via email.', col: 'amber' },
                        { t: 'Marketplace Entry', d: 'Begin your commercial journey.', col: 'emerald' }
                      ].map((s, i) => (
                        <div key={i} className="flex gap-5">
                          <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 flex-shrink-0 flex items-center justify-center text-xs font-black shadow-sm text-${s.col}-600 border border-${s.col}-100`}>
                             {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 leading-tight uppercase italic">{s.t}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{s.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <button
                      onClick={() => {
                          setStep(1);
                          setFormData({ businessName: '', email: '', phone: '', location: '', name: '', password: '' });
                          setFiles({ id_front: null, id_back: null, supporting_document: null });
                      }}
                      className="px-10 bg-white border-2 border-slate-100 text-slate-900 font-black py-5 rounded-[28px] hover:border-primary-600/20 hover:bg-primary-50/10 transition-all flex items-center gap-2 uppercase tracking-widest text-xs"
                    >
                      <ArrowRight size={18} /> Onboard Another
                    </button>
                    <button
                      onClick={handleBack}
                      className="px-10 bg-slate-900 text-white font-black py-5 rounded-[28px] hover:bg-black transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest text-xs"
                    >
                      Return to Network List
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Status bar */}
          <div className="mt-6 flex items-center justify-center gap-8 py-4 px-8 bg-slate-50/50 rounded-[28px] border border-slate-100/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Online</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Encryption Enabled</span>
              <ShieldCheck size={12} className="text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPartner;
