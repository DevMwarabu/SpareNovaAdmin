import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Gavel, Truck, ShieldCheck, ArrowRight, CheckCircle2, Loader2, Mail, Lock, User, Phone, MapPin, LogIn, UserPlus, Upload, FileText, Image as ImageIcon, X, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8003/api/v1';

const Auth = () => {
  const [step, setStep] = useState(0); // 0: Landing, 1: Role, 2: Details, 5: Docs, 3: Success, 4: Login
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
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
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google?role=${role || 'customer'}`;
  };

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
      
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
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
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${value ? 'border-primary-600 bg-primary-50/20' : 'border-slate-100 hover:border-slate-200'}`}>
        <input 
          type="file" 
          name={name} 
          onChange={handleFileChange}
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${value ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
            {value ? <CheckCircle2 size={18} /> : <Icon size={18} />}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className={`text-xs font-bold truncate ${value ? 'text-primary-900' : 'text-slate-400'}`}>
              {value ? value.name : `Select ${label}`}
            </p>
            {!value && <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight">Image or PDF • Max 5MB</p>}
          </div>
          {value && (
            <button 
              onClick={(e) => { e.preventDefault(); setFiles(prev => ({ ...prev, [name]: null })); }}
              className="relative z-20 p-1 hover:bg-primary-100 rounded-lg text-primary-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 selection:bg-primary-100 selection:text-primary-900">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[540px] relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span className="text-white font-black text-2xl tracking-tighter">S</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Spare<span className="text-primary-600">Nova</span></span>
          </motion.div>
          <div className="h-px w-12 bg-slate-200 mx-auto" />
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100/50 p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight italic">Welcome Back</h1>
                  <p className="text-slate-500 font-medium tracking-tight">Complete your journey with SpareNova</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => setStep(4)}
                    className="group relative p-8 rounded-[32px] bg-sidebar-dark text-white text-left transition-all hover:opacity-90 shadow-2xl shadow-primary-900/10 active:scale-95 border border-sidebar-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xl font-black italic">Sign In</span>
                       <LogIn size={24} className="text-primary-400" />
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed tracking-tight">Access your business dashboard</p>
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    className="group relative p-8 rounded-[32px] bg-white border-2 border-slate-100 text-left transition-all hover:border-primary-100 hover:bg-primary-50/20 active:scale-95 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xl font-black italic text-slate-900">Create Account</span>
                       <UserPlus size={24} className="text-slate-400 group-hover:text-primary-600" />
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed tracking-tight">Join for Shops, Garages & Delivery</p>
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
                <div className="text-center mb-8 relative">
                   <button onClick={() => setStep(0)} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors rotate-180">
                    <ArrowRight size={20} />
                  </button>
                  <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight italic">Who are you?</h1>
                  <p className="text-slate-500 font-medium tracking-tight">Select your business category</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`group relative p-5 rounded-3xl border-2 text-left transition-all duration-300 ${role === r.id ? `border-primary-600 bg-primary-50/30 ring-4 ring-primary-500/5` : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all ${role === r.id ? `bg-primary-600 text-white` : `bg-white text-slate-400 shadow-sm shadow-slate-200/50 group-hover:text-slate-600`}`}>
                        <r.icon size={20} />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1">{r.title}</h3>
                      <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{r.desc}</p>
                      {role === r.id && (
                        <motion.div layoutId="role-check" className="absolute top-4 right-4 text-primary-600">
                          <CheckCircle2 size={16} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!role}
                  onClick={() => setStep(2)}
                  className="w-full bg-sidebar-dark text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-sidebar-dark/20 active:scale-95"
                >
                  Continue <ArrowRight size={18} />
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
                <div className="mb-8 relative">
                   <button onClick={() => setStep(1)} className="absolute -left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors rotate-180">
                    <ArrowRight size={20} />
                  </button>
                  <div className="text-center">
                    <h1 className="text-2xl font-black text-slate-900 mb-2 italic">Account Details</h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{selectedRoleData?.title}</p>
                  </div>
                </div>

                <form 
                  onSubmit={(e) => { e.preventDefault(); setStep(5); }}
                  className="space-y-4 mb-8"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Name</label>
                    <div className="relative group">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                      <input 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-600/5 transition-all font-bold text-slate-900" 
                        placeholder="Company Ltd" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
                      <input 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:border-primary-600 transition-all font-bold text-slate-900" 
                        placeholder="ceo@company.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:border-primary-600 transition-all font-bold text-slate-900" 
                        placeholder="+254..." 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Create Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                      <input 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-primary-600 transition-all font-bold text-slate-900" 
                        placeholder="••••••••" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={!formData.email || !formData.password || !formData.businessName}
                    className="w-full bg-primary-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20"
                  >
                    Verify Identity <ArrowRight size={18} />
                  </button>
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
                <div className="mb-8 relative text-center">
                   <button onClick={() => setStep(2)} className="absolute -left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors rotate-180">
                    <ArrowRight size={20} />
                  </button>
                  <h1 className="text-2xl font-black text-slate-900 mb-2 italic">Verification</h1>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Required for business trust</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <FileUploadField 
                      label="ID Front" 
                      name="id_front" 
                      accept="image/*" 
                      icon={ImageIcon} 
                      value={files.id_front} 
                    />
                    <FileUploadField 
                      label="ID Back" 
                      name="id_back" 
                      accept="image/*" 
                      icon={ImageIcon} 
                      value={files.id_back} 
                    />
                  </div>
                  <FileUploadField 
                    label="Business / Supporting Docs" 
                    name="supporting_document" 
                    accept=".pdf,image/*" 
                    icon={FileText} 
                    value={files.supporting_document} 
                  />
                </div>

                <button
                  disabled={loading || !files.id_front || !files.id_back}
                  onClick={submitRegistration}
                  className="w-full bg-primary-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <>Complete Selection <ArrowRight size={18} /></>}
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
                <div className="mb-8 relative text-center">
                   <button onClick={() => setStep(0)} className="absolute -left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors rotate-180">
                    <ArrowRight size={20} />
                  </button>
                  <h1 className="text-2xl font-black text-slate-900 mb-2 italic">Sign In</h1>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest tracking-tight">Business Dashboard</p>
                </div>

                <form 
                  onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
                  className="space-y-4 mb-8"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:border-primary-600 transition-all font-bold text-slate-900" 
                      placeholder="business@example.com" 
                    />
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                      <input 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-primary-600 transition-all font-bold text-slate-900" 
                        placeholder="••••••••" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !formData.email || !formData.password}
                    className="w-full bg-primary-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Sign In <ArrowRight size={18} /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="mb-6 inline-flex w-24 h-24 rounded-[40px] bg-emerald-50 items-center justify-center text-emerald-500 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2 italic">Submitted!</h1>
                <p className="text-slate-500 font-medium mb-8 text-sm">Your application is now under review. We'll notify you via <span className="text-slate-900 font-bold">{formData.email}</span> once verified.</p>

                <div className="bg-slate-50 rounded-[32px] p-6 text-left mb-8 border border-slate-100">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Next Steps</h3>
                  <div className="space-y-4">
                    {[
                      { t: 'Review', d: 'Our team verifies your documents.' },
                      { t: 'Wait', d: 'Confirmation email sent within 24h.' },
                      { t: 'Go Live', d: 'Setup your products & services.' }
                    ].map((s, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 rounded-xl bg-white flex-shrink-0 flex items-center justify-center text-xs font-black shadow-sm text-slate-600 border border-slate-100">{i + 1}</div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">{s.t}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{s.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = 'http://localhost:8003'}
                  className="w-full bg-primary-600 text-white font-black py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95"
                >
                  Return to Homepage
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Secured by SpareNova Cloud • Enterprise Grade Auth
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
