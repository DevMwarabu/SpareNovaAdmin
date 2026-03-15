import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Gavel, Truck, ShieldCheck, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8003/api/v1';

const Registration = () => {
  const [step, setStep] = useState(1);
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

  const roles = [
    { id: 'admin', title: 'Platform Admin', icon: ShieldCheck, color: 'blue', desc: 'Overall owner of the SaaS system' },
    { id: 'shop', title: 'Shop Owner', icon: Store, color: 'emerald', desc: 'Manage products and inventory' },
    { id: 'garage', title: 'Garage Owner', icon: Gavel, color: 'purple', desc: 'Manage mechanics and service bookings' },
    { id: 'delivery', title: 'Delivery Partner', icon: Truck, color: 'orange', desc: 'Manage logistics and fleet' },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitRegistration = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/register`, {
        ...formData,
        role: role,
        name: formData.name || formData.businessName, // Fallback
      });
      console.log('Registration Success:', response.data);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      setStep(3);
    } catch (error) {
      console.error('Registration Error:', error.response?.data || error.message);
      alert('Registration failed: ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_40%),_radial-gradient(circle_at_bottom_left,_var(--tw-gradient-to),_transparent_40%)] from-blue-50 to-indigo-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Progress/Info */}
        <div className="md:w-1/3 bg-slate-900 p-8 text-white relative flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
              Spare<span className="text-blue-400">Nova</span>
            </h2>
            <p className="text-slate-400 text-sm mb-8 font-medium italic">Empowering the automotive industry.</p>
            
            <div className="space-y-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= s ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-500'}`}>
                    {step > s ? <CheckCircle2 size={16} /> : s}
                  </div>
                  <span className={`text-sm font-bold ${step >= s ? 'text-white' : 'text-slate-500'}`}>
                    {s === 1 && 'Business Role'}
                    {s === 2 && 'Business Details'}
                    {s === 3 && 'Verification'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12">
            <div className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Registration Status</div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="md:w-2/3 p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Register Your Business</h1>
                  <p className="text-slate-500 font-medium">Select your role to get started with SpareNova.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:-translate-y-1 ${role === r.id ? `border-${r.color}-500 bg-${r.color}-50/50 shadow-lg shadow-${r.color}-500/10` : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${role === r.id ? `bg-${r.color}-500 text-white` : `bg-${r.color}-50 text-${r.color}-600 group-hover:bg-${r.color}-100`}`}>
                        <r.icon size={24} />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1">{r.title}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{r.desc}</p>
                      {role === r.id && (
                        <motion.div layoutId="role-check" className="absolute top-4 right-4 text-blue-500">
                          <CheckCircle2 size={20} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-6">
                  <button
                    disabled={!role}
                    onClick={() => setStep(2)}
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                  >
                    Continue <ArrowRight size={20} />
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
                className="space-y-6"
              >
                <div>
                  <button onClick={() => setStep(1)} className="text-sm font-bold text-blue-500 hover:text-blue-600 mb-4 flex items-center gap-1">← Back to Role</button>
                  <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Business Details</h1>
                  <p className="text-slate-500 font-medium">Tell us more about your business.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Business Name</label>
                      <input 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                        placeholder="AutoParts Inc." 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Public Name / Owner</label>
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                        placeholder="John Doe" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Contact Email</label>
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                        placeholder="office@business.com" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        type="tel" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                        placeholder="+254 7..." 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Location</label>
                      <input 
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                        placeholder="Nairobi, Westlands" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Login Password</label>
                      <input 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        type="password" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    disabled={loading || !formData.email || !formData.password}
                    onClick={submitRegistration}
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Complete Registration <ArrowRight size={20} /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-100/50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={48} />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Registration Under Review</h1>
                  <p className="text-slate-500 font-medium">We are verifying your business details. You will receive an email once approved.</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left">
                  <h3 className="font-bold text-slate-900 mb-4">What's Next?</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">1</div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">Our team reviews your documents (approx. 24h).</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">2</div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">You'll receive a secure login link to your dashboard.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">3</div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">Start managing your business on SpareNova!</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => window.location.href = '/admin'}
                    className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                  >
                    Go to My Dashboard
                  </button>
                  <button
                    onClick={() => window.location.href = 'http://localhost:8003'}
                    className="w-full border-2 border-slate-100 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Back to Storefront
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Registration;
