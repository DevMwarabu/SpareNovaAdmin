import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Store, Gavel, Truck, ArrowRight, CheckCircle2, Loader2, Lock, User, Phone, MapPin, Upload, FileText, Image as ImageIcon, X, ShieldCheck, ArrowLeft, Mail, Building2, Briefcase } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8003/api/v1';

const RegisterPartner = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'store_owner';
  
  const [step, setStep] = useState(1); // 1: Details, 2: Docs, 3: Success
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

  const roles = {
    'store_owner': { title: 'Store Partner', icon: Store, color: 'blue', desc: 'Add new product vendor' },
    'garage_owner': { title: 'Service Garage', icon: Gavel, color: 'emerald', desc: 'Add independent service center' },
    'delivery': { title: 'Logistics Fleet', icon: Truck, color: 'orange', desc: 'Add last-mile delivery partner' },
  };

  const currentRole = roles[role] || roles['store_owner'];

  const steps = [
    { id: 1, label: 'Account Details', icon: User },
    { id: 2, label: 'Verifications', icon: ShieldCheck },
    { id: 3, label: 'Completion', icon: CheckCircle2 }
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

      await axios.post(`${API_BASE}/register`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setStep(3);
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const FileUploadField = ({ label, name, accept, icon: Icon, value }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all group ${value ? 'border-primary-500 bg-primary-50/10' : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200'}`}>
        <input 
          type="file" 
          name={name} 
          onChange={handleFileChange}
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 scale-95 group-hover:scale-100 ${value ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-white text-slate-400 border border-slate-100'}`}>
            {value ? <CheckCircle2 size={24} /> : <Icon size={24} />}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className={`text-sm font-bold truncate px-4 ${value ? 'text-primary-900' : 'text-slate-400'}`}>
              {value ? value.name : `Select ${label}`}
            </p>
            {!value && <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight mt-1">PNG, JPG or PDF • 5MB Max</p>}
          </div>
        </div>
        {value && (
          <button 
            onClick={(e) => { e.preventDefault(); setFiles(prev => ({ ...prev, [name]: null })); }}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-xl text-slate-400 hover:text-red-500 transition-colors border border-slate-100"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );

  const handleBack = () => {
    const backTo = role === 'store_owner' ? 'shops' : role === 'garage_owner' ? 'garages' : 'logistics';
    navigate(`/admin/${backTo}`);
  };

  return (
    <div className="min-h-full space-y-8 pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className={`w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary-600`}>
              <currentRole.icon size={28} />
           </div>
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <button onClick={handleBack} className="text-slate-400 hover:text-primary-600 transition-colors text-xs font-bold uppercase tracking-widest">Network</button>
                 <span className="text-slate-300 font-black">/</span>
                 <span className="text-slate-900 text-xs font-black uppercase tracking-widest">Onboard {currentRole.title}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Creation Engine</h1>
           </div>
        </div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Cancel Onboarding
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Progress Sidebar */}
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Onboarding Flow</p>
              <div className="space-y-4">
                 {steps.map((s, idx) => (
                   <div key={s.id} className="relative flex items-center gap-4 group">
                      {idx !== steps.length - 1 && (
                        <div className={`absolute left-5 top-10 w-0.5 h-6 transition-colors duration-500 ${step > s.id ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                      )}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        step === s.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 scale-110' : 
                        step > s.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                        'bg-slate-50 text-slate-300 border border-slate-100'
                      }`}>
                         {step > s.id ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                      </div>
                      <div className="flex flex-col">
                         <span className={`text-xs font-black uppercase tracking-tight transition-colors ${step === s.id ? 'text-primary-600' : step > s.id ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {s.label}
                         </span>
                         <span className="text-[10px] font-medium text-slate-400">Step {s.id} of 3</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-primary-600 rounded-[32px] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-1000" />
              <ShieldCheck size={32} className="mb-4 opacity-80" />
              <h3 className="text-lg font-black italic mb-2 tracking-tight leading-tight">Secure Registration</h3>
              <p className="text-sm text-primary-100 font-medium leading-relaxed mb-4">You are registering a verified partner directly into the global SpareNova marketplace ecosystem.</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                 Admin Authorized
              </div>
           </div>
        </div>

        {/* Right Column: Main Form */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-8 md:p-14 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <div className="flex items-start justify-between">
                     <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic mb-2 italic">Account Configuration</h2>
                        <p className="text-slate-400 font-medium max-w-lg">Establish the primary identity and access credentials for the new {currentRole.title}.</p>
                     </div>
                     <div className="hidden sm:block text-right">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Priority</span>
                        <p className="text-xs font-black text-slate-900 uppercase">Urgent • 1m</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                     {/* Business Details Section */}
                     <div className="space-y-8">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                              <Building2 size={16} />
                           </div>
                           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Business Identity</h3>
                        </div>
                        
                        <div className="space-y-5">
                          <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-primary-600 transition-colors">Business Name</label>
                            <div className="relative">
                              <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                              <input 
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 outline-none focus:bg-white focus:border-primary-600 focus:shadow-xl focus:shadow-primary-600/5 transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                                placeholder="e.g. SpareNova Parts Ltd" 
                              />
                            </div>
                          </div>

                          <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-primary-600 transition-colors">Operational Location</label>
                            <div className="relative">
                              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                              <input 
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 outline-none focus:bg-white focus:border-primary-600 focus:shadow-xl focus:shadow-primary-600/5 transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                                placeholder="e.g. Nairobi, Industrial Area" 
                              />
                            </div>
                          </div>
                        </div>
                     </div>

                     {/* Security & Access Section */}
                     <div className="space-y-8">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                              <Lock size={16} />
                           </div>
                           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Access Credentials</h3>
                        </div>

                        <div className="space-y-5">
                           <div className="space-y-2 group">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-primary-600 transition-colors">Admin Email (Username)</label>
                             <div className="relative">
                               <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                               <input 
                                 name="email"
                                 type="email"
                                 value={formData.email}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 outline-none focus:bg-white focus:border-primary-600 focus:shadow-xl focus:shadow-primary-600/5 transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                                 placeholder="admin@business.com" 
                               />
                             </div>
                           </div>

                           <div className="space-y-2 group">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-primary-600 transition-colors">Temporary Portal Password</label>
                             <div className="relative">
                               <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                               <input 
                                 name="password"
                                 type="password"
                                 value={formData.password}
                                 onChange={handleInputChange}
                                 className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 outline-none focus:bg-white focus:border-primary-600 focus:shadow-xl focus:shadow-primary-600/5 transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                                 placeholder="••••••••••••" 
                               />
                             </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!formData.businessName || !formData.email || !formData.password}
                      className="group px-10 bg-primary-600 text-white font-black py-5 rounded-[24px] flex items-center gap-3 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none"
                    >
                      Next: Verification Assets <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="text-center max-w-xl mx-auto space-y-3">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Compliance Assets</h2>
                     <p className="text-slate-500 font-medium">Please upload valid government-issued identification and business operating licenses.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <FileUploadField 
                        label="Identity Card (Front)" 
                        name="id_front" 
                        accept="image/*" 
                        icon={ImageIcon} 
                        value={files.id_front} 
                     />
                     <FileUploadField 
                        label="Identity Card (Back)" 
                        name="id_back" 
                        accept="image/*" 
                        icon={ImageIcon} 
                        value={files.id_back} 
                     />
                  </div>
                  
                  <div className="max-w-xl mx-auto">
                    <FileUploadField 
                      label="Business License / Tax Certificate" 
                      name="supporting_document" 
                      accept=".pdf,image/*" 
                      icon={FileText} 
                      value={files.supporting_document} 
                    />
                  </div>

                  <div className="flex gap-6 mt-12 border-t border-slate-50 pt-10">
                    <button
                      onClick={() => setStep(1)}
                      className="px-8 bg-slate-50 text-slate-500 font-black py-5 rounded-3xl hover:bg-slate-100 hover:text-slate-700 transition-all"
                    >
                      Return to Steps
                    </button>
                    <button
                      disabled={loading || !files.id_front || !files.id_back}
                      onClick={submitRegistration}
                      className="flex-1 bg-primary-600 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <>Generate Verified Partner Account <CheckCircle2 size={20} /></>}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="relative inline-block mb-10">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[40px] animate-pulse" />
                    <div className="relative w-32 h-32 rounded-[48px] bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30">
                      <CheckCircle2 size={56} className="animate-bounce-subtle" />
                    </div>
                  </div>
                  
                  <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight italic uppercase">Activation Successful</h1>
                  <p className="text-lg text-slate-500 font-medium mb-12 max-w-md mx-auto leading-relaxed">
                    The {currentRole.title} account for <span className="text-slate-900 font-black decoration-primary-500/30 underline decoration-4 underline-offset-4">{formData.businessName}</span> has been provisioned and is ready for live operations.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <button
                      onClick={() => {
                          setStep(1);
                          setFormData({ businessName: '', email: '', phone: '', location: '', name: '', password: '' });
                          setFiles({ id_front: null, id_back: null, supporting_document: null });
                      }}
                      className="px-10 bg-white border-2 border-slate-100 text-slate-900 font-black py-5 rounded-[28px] hover:border-primary-600/20 hover:bg-primary-50/10 transition-all flex items-center gap-2"
                    >
                      <ArrowRight size={18} /> Onboard Another
                    </button>
                    <button
                      onClick={handleBack}
                      className="px-10 bg-slate-900 text-white font-black py-5 rounded-[28px] hover:bg-black transition-all shadow-xl shadow-slate-900/10"
                    >
                      Return to Network List
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 py-4 px-8 bg-slate-50/50 rounded-[28px] border border-slate-100/50">
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
