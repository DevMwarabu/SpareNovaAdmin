import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Store, Gavel, Truck, ShieldCheck, ArrowRight, CheckCircle2, Loader2, Mail, Lock, User, 
  Phone, MapPin, LogIn, UserPlus, Upload, FileText, Image as ImageIcon, X, Eye, EyeOff,
  Building2, Briefcase, AlertCircle, Circle, CheckCircle
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8003/api/v1';

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

// ── Shared UI Components ──────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="group space-y-2">
    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors group-focus-within:text-primary-600">
      {label}
    </label>
    {children}
  </div>
);

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isAdminMode = searchParams.get('admin_mode') === 'true';
  const initialRole = searchParams.get('role');
  const initialStep = (isAdminMode && initialRole) ? 2 : 0;

  const [step, setStep] = useState(initialStep); // 0: Landing, 1: Role, 2: Details, 5: Docs, 3: Success, 4: Login
  const [role, setRole] = useState(initialRole || null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    location: '',
    name: '',
    password: '',
  });
  const [files, setFiles] = useState({
    id_front: null,
    id_back: null,
    supporting_document: null
  });

  // Password Policy Logic
  const strength      = useMemo(() => getStrength(formData.password), [formData.password]);
  const passedRules   = useMemo(() => passwordRules.filter(r => r.test(formData.password)), [formData.password]);
  const passwordReady = passedRules.length === passwordRules.length;

  const roles = [
    { id: 'store_owner', title: 'Shop Owner', icon: Store, color: 'emerald', desc: 'Manage products & inventory' },
    { id: 'garage_owner', title: 'Garage Owner', icon: Gavel, color: 'purple', desc: 'Mechanics & service bookings' },
    { id: 'delivery', title: 'Delivery Partner', icon: Truck, color: 'orange', desc: 'Logistics & fleet management' },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/login`, {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      window.location.href = '/admin';
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || 'Invalid credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const submitRegistration = async () => {
    setLoading(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => payload.append(key, formData[key]));
      payload.append('role', role);
      if (!formData.name) payload.append('name', formData.businessName);
      
      if (files.id_front) payload.append('id_front', files.id_front);
      if (files.id_back) payload.append('id_back', files.id_back);
      if (files.supporting_document) payload.append('supporting_document', files.supporting_document);

      const response = await axios.post(`${API_BASE}/register`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (!isAdminMode) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
      }
      setStep(3);
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleData = roles.find(r => r.id === role);

  const FileUploadField = ({ label, name, accept, icon: Icon, value }) => (
    <div className="space-y-2">
      <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
      <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all group ${value ? 'border-primary-600 bg-primary-50/20' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}>
        <input 
          type="file" 
          name={name} 
          onChange={handleFileChange}
          accept={accept}
          className="absolute inset-0 z-10 opacity-0 cursor-pointer"
        />
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${value ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
            {value ? <CheckCircle2 size={18} /> : <Icon size={18} />}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className={`text-[11px] font-black truncate leading-tight ${value ? 'text-primary-900' : 'text-slate-500'}`}>
              {value ? value.name : `Select ${label}`}
            </p>
            {!value && <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tight">Image or PDF • Max 5MB</p>}
          </div>
          {value && (
            <button 
              onClick={(e) => { e.preventDefault(); setFiles(prev => ({ ...prev, [name]: null })); }}
              className="relative z-20 p-1.5 bg-white rounded-lg text-slate-400 hover:text-red-500 transition-colors border border-slate-100 shadow-sm"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const canProceedToDocs = formData.businessName && formData.email && formData.phone && passwordReady;

  return (
    <div className={`${isAdminMode ? 'w-full py-2' : 'min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 selection:bg-primary-100 selection:text-primary-900'}`}>
      {/* Background Orbs - Hidden in Admin Mode */}
      {!isAdminMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-400/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/5 rounded-full blur-[120px]" />
        </div>
      )}

      <motion.div 
        initial={isAdminMode ? { opacity: 0, y: 10 } : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`w-full ${isAdminMode ? 'max-w-none' : 'max-w-[580px]'} relative z-10`}
      >
        {/* Logo Section - Hidden in Admin Mode */}
        {!isAdminMode && (
          <div className="text-center mb-10">
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <div className="w-12 h-12 rounded-[18px] bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-600/30">
                <span className="text-white font-black text-2xl tracking-tighter">S</span>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Spare<span className="text-primary-600">Nova</span></span>
            </motion.div>
            <div className="h-px w-12 bg-slate-200 mx-auto" />
          </div>
        )}

        {isAdminMode && (
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Creation Engine</h1>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Direct Partner Onboarding</p>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600 flex items-center gap-2">
               <ShieldCheck size={14} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest">Admin Authorization</span>
            </div>
          </div>
        )}

        <div className={`overflow-hidden ${isAdminMode ? 'bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm' : 'bg-white rounded-[48px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] border border-slate-100/50 p-8 md:p-14'}`}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight italic uppercase">Gateway</h1>
                  <p className="text-slate-500 font-medium text-lg leading-tight tracking-tight">The SpareNova commerce ecosystem awaits.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <button
                    onClick={() => setStep(4)}
                    className="group relative p-10 rounded-[40px] bg-slate-950 text-white text-left transition-all hover:bg-black shadow-2xl shadow-slate-950/20 active:scale-[0.98] border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-2xl font-black italic uppercase tracking-tighter">Sign In</span>
                       <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                          <LogIn size={20} className="text-white" />
                       </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">Identity Verified Access</p>
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    className="group relative p-10 rounded-[40px] bg-white border-2 border-slate-100 text-left transition-all hover:border-primary-100 hover:bg-primary-50/10 active:scale-[0.98] shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-2xl font-black italic text-slate-900 uppercase tracking-tighter">Provision Account</span>
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          <UserPlus size={20} className="text-slate-400 group-hover:text-white" />
                       </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">For Shops, Garages & Logistics</p>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-10 relative">
                   <button onClick={() => setStep(0)} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight italic uppercase">Identity Selection</h1>
                  <p className="text-slate-500 font-medium tracking-tight">Specify the professional role for this account.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`group relative p-6 rounded-[32px] border-2 text-left transition-all duration-300 ${role === r.id ? `border-primary-600 bg-primary-50/30 ring-4 ring-primary-500/5` : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200'}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all ${role === r.id ? `bg-primary-600 text-white shadow-xl shadow-primary-600/20` : `bg-white text-slate-300 shadow-sm group-hover:text-slate-500`}`}>
                        <r.icon size={24} />
                      </div>
                      <h3 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight italic">{r.title}</h3>
                      <p className="text-[10px] text-slate-400 font-bold leading-snug uppercase tracking-widest">{r.desc}</p>
                      {role === r.id && (
                        <motion.div layoutId="role-check" className="absolute top-6 right-6 text-primary-600">
                          <CheckCircle2 size={20} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!role}
                  onClick={() => setStep(2)}
                  className="w-full bg-slate-950 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:bg-black disabled:opacity-50 transition-all shadow-2xl shadow-slate-950/20 active:scale-[0.98] uppercase tracking-widest text-xs"
                >
                  Proceed to Configuration <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-10 relative">
                   <button onClick={() => setStep(1)} className="absolute -left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <div className="text-center">
                    <h1 className="text-3xl font-black text-slate-900 mb-2 italic uppercase">Configuration</h1>
                    <p className="text-primary-600 text-[10px] font-black uppercase tracking-[0.3em]">{selectedRoleData?.title} Onboarding</p>
                  </div>
                </div>

                <form 
                  onSubmit={(e) => { e.preventDefault(); setStep(5); }}
                  className="space-y-6"
                >
                  <Field label="Business Name">
                    <div className="relative group">
                      <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                      <input 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[22px] pl-14 pr-6 py-4 outline-none focus:bg-white focus:border-primary-600 focus:shadow-xl focus:shadow-primary-600/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm" 
                        placeholder="SpareNova Logistics Ltd" 
                      />
                    </div>
                  </Field>

                  <div className="grid grid-cols-2 gap-5">
                    <Field label="Admin Email (Username)">
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600" size={18} />
                        <input 
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50/50 border border-slate-100 rounded-[22px] pl-14 pr-4 py-4 outline-none focus:bg-white focus:border-primary-600 transition-all font-bold text-slate-900 text-sm" 
                          placeholder="admin@corp.com" 
                        />
                      </div>
                    </Field>
                    <Field label="Contact Phone">
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50/50 border border-slate-100 rounded-[22px] pl-14 pr-4 py-4 outline-none focus:bg-white focus:border-primary-600 transition-all font-bold text-slate-900 text-sm" 
                          placeholder="+254 7..." 
                        />
                      </div>
                    </Field>
                  </div>

                  <Field label="Identity Password">
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                      <input 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full bg-slate-50/50 border rounded-[22px] pl-14 pr-12 py-4 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm ${
                          formData.password && !passwordReady ? 'border-amber-300 focus:border-amber-500' : 
                          passwordReady ? 'border-emerald-300 focus:border-emerald-500' : 'border-slate-100 focus:border-primary-600'
                        }`} 
                        placeholder="••••••••" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Password Policy Inline UI */}
                    {formData.password && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
                        <div className="flex gap-1.5 h-1.5">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= strength.score ? strength.color : 'bg-slate-100'}`} />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${strength.score >= 4 ? 'text-emerald-500' : strength.score >= 2 ? 'text-amber-500' : 'text-red-500'}`}>
                              {strength.label}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400">{passedRules.length}/{passwordRules.length} Rules Applied</span>
                        </div>
                        <div className="bg-slate-50/80 rounded-[20px] p-4 border border-slate-100 space-y-2">
                           {passwordRules.map(rule => {
                             const ok = rule.test(formData.password);
                             return (
                               <div key={rule.id} className="flex items-center gap-2.5">
                                 {ok ? <CheckCircle size={14} className="text-emerald-500" /> : <Circle size={14} className="text-slate-200" />}
                                 <span className={`text-[10px] font-black transition-colors ${ok ? 'text-emerald-700' : 'text-slate-400 underline decoration-slate-200 decoration-wavy'}`}>{rule.label}</span>
                               </div>
                             );
                           })}
                        </div>
                      </motion.div>
                    )}
                  </Field>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={!canProceedToDocs}
                      className="w-full bg-primary-600 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/20 disabled:opacity-30 disabled:grayscale uppercase tracking-widest text-xs"
                    >
                      Authenticate and Proceed <ArrowRight size={20} />
                    </button>
                    {!canProceedToDocs && formData.password && (
                      <p className="text-center mt-4 text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse">
                        <AlertCircle size={12} /> Verification requirements incomplete
                      </p>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-10 relative text-center">
                   <button onClick={() => setStep(2)} className="absolute -left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <h1 className="text-3xl font-black text-slate-900 mb-2 italic uppercase">Assets</h1>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Verification</p>
                </div>

                <div className="space-y-5 mb-10">
                  <div className="grid grid-cols-2 gap-4">
                    <FileUploadField 
                      label="Identity (Front)" 
                      name="id_front" 
                      accept="image/*" 
                      icon={ImageIcon} 
                      value={files.id_front} 
                    />
                    <FileUploadField 
                      label="Identity (Back)" 
                      name="id_back" 
                      accept="image/*" 
                      icon={ImageIcon} 
                      value={files.id_back} 
                    />
                  </div>
                  <FileUploadField 
                    label="Business License / Permit" 
                    name="supporting_document" 
                    accept=".pdf,image/*" 
                    icon={FileText} 
                    value={files.supporting_document} 
                  />
                </div>

                <button
                  disabled={loading || !files.id_front || !files.id_back}
                  onClick={submitRegistration}
                  className="w-full bg-primary-600 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/20 disabled:bg-slate-100 disabled:text-slate-300 uppercase tracking-widest text-xs"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>Generate Provisioned Account <CheckCircle2 size={20} /></>}
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-10 relative text-center">
                   <button onClick={() => setStep(0)} className="absolute -left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <h1 className="text-4xl font-black text-slate-900 mb-2 italic uppercase">Authenticate</h1>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest tracking-tight">Enterprise Identity Access</p>
                </div>

                <form 
                  onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
                  className="space-y-6"
                >
                  <Field label="Corporate Email">
                    <div className="relative group">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                       <input 
                         name="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         className="w-full bg-slate-50 border border-slate-100 rounded-[22px] pl-14 pr-6 py-5 outline-none focus:border-primary-600 focus:bg-white transition-all font-bold text-slate-900 text-sm" 
                         placeholder="admin@sparenova.com" 
                       />
                    </div>
                  </Field>
                  <Field label="Key Password">
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                      <input 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-[22px] pl-14 pr-12 py-5 outline-none focus:border-primary-600 focus:bg-white transition-all font-bold text-slate-900 text-sm" 
                        placeholder="••••••••" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </Field>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading || !formData.email || !formData.password}
                      className="w-full bg-slate-950 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl shadow-slate-950/20 disabled:opacity-50 uppercase tracking-widest text-xs"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <>Initiate Access <ArrowRight size={20} /></>}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

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
                <p className="text-slate-500 font-medium mb-10 text-lg leading-snug px-4">Your application is now being processed. We'll notify <span className="text-slate-900 font-black underline decoration-emerald-200 decoration-4 underline-offset-4">{formData.email}</span> upon verification.</p>

                <div className="bg-slate-50 rounded-[40px] p-8 text-left mb-10 border border-slate-100 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 ml-1">Lifecycle Tracking</h3>
                  <div className="space-y-6">
                    {[
                      { t: 'Vault Review', d: 'Our analysts are verifying business identity.', icon: ShieldCheck, col: 'blue' },
                      { t: 'Dispatch Access', d: 'Secure keys will be issued via email.', icon: Lock, col: 'amber' },
                      { t: 'Marketplace Entry', d: 'Begin your commercial journey.', icon: TrendingUp = Zap, col: 'emerald' }
                    ].map((s, i) => (
                      <div key={i} className="flex gap-5">
                        <div className={`w-12 h-12 rounded-2xl bg-${s.col === 'blue' ? 'blue' : s.col === 'amber' ? 'amber' : 'emerald'}-50 flex-shrink-0 flex items-center justify-center text-xs font-black shadow-sm text-${s.col === 'blue' ? 'blue' : s.col === 'amber' ? 'amber' : 'emerald'}-600 border border-${s.col === 'blue' ? 'blue' : s.col === 'amber' ? 'amber' : 'emerald'}-100`}>
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

                <div className="flex flex-col gap-4">
                   <button
                     onClick={() => window.location.href = isAdminMode ? `/admin/${role === 'store_owner' ? 'shops' : role === 'garage_owner' ? 'garages' : 'logistics'}` : 'http://localhost:8003'}
                     className="w-full bg-primary-600 text-white font-black py-5 rounded-[24px] hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/20 active:scale-95 uppercase tracking-widest text-xs"
                   >
                     {isAdminMode ? 'Back to Dashboard' : 'Return to Portal'}
                   </button>
                   {!isAdminMode && (
                      <button onClick={() => setStep(0)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Return to Gateway</button>
                   )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Auth</span>
           </div>
           <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SpareNova Logic Engine</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
