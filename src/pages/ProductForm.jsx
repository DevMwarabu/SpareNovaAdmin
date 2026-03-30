import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  Tag, 
  DollarSign, 
  Layers, 
  Truck, 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Zap,
  AlertCircle,
  X,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

const API_BASE = 'http://localhost:8003/api/v1';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    price: '',
    stock: '',
    oem_number: '',
    specs: [],
    compatibility: [],
    images: []
  });

  const [specInput, setSpecInput] = useState({ key: '', value: '' });
  const [compatibilityInput, setCompatibilityInput] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get(`${API_BASE}/portal/categories`);
        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }

        if (isEdit) {
          const prodRes = await axios.get(`${API_BASE}/portal/products/${id}`);
          if (prodRes.data.success) {
            const p = prodRes.data.product;
            
            // Transform specs object to array for form
            const specsArray = p.specs ? Object.entries(p.specs).map(([key, value]) => ({ key, value })) : [];
            
            setFormData({
              title: p.title || '',
              category_id: p.category_id || '',
              price: p.price || '',
              stock: p.stock || '',
              oem_number: p.oem || '',
              specs: specsArray,
              compatibility: p.compatibility || [],
              images: p.images || []
            });
            setImagePreviews(p.images || []);
          }
        }
      } catch (err) {
        console.error('Failed to initialize product hub:', err);
        setError('Systems Failure: Unable to synchronize with marketplace telemetry.');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);
    for (const file of files) {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      try {
        const response = await axios.post(`${API_BASE}/portal/products/upload`, formDataUpload);
        if (response.data.success) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, response.data.path]
          }));
          setImagePreviews(prev => [...prev, response.data.url]);
        }
      } catch (err) {
        setError('Artifact Indexing Failed: Image rejected by protocol.');
      }
    }
    setLoading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    if (!specInput.key || !specInput.value) return;
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, { ...specInput }]
    }));
    setSpecInput({ key: '', value: '' });
  };

  const removeSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  const addCompatibility = (e) => {
    if (e.key === 'Enter' && compatibilityInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        compatibility: [...prev.compatibility, compatibilityInput.trim()]
      }));
      setCompatibilityInput('');
    }
  };

  const removeCompatibility = (index) => {
    setFormData(prev => ({
      ...prev,
      compatibility: prev.compatibility.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const specsObject = {};
    formData.specs.forEach(s => { specsObject[s.key] = s.value; });

    try {
      const payload = {
        ...formData,
        specs: specsObject
      };
      
      const method = isEdit ? 'put' : 'post';
      const url = isEdit ? `${API_BASE}/portal/products/${id}` : `${API_BASE}/portal/products`;
      
      const response = await axios[method](url, payload);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate(`/${JSON.parse(localStorage.getItem('user') || '{}').role?.toLowerCase() || 'admin'}/products`), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Pipeline Malfunction: System refused the listing update.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Zap className="text-primary-600 animate-pulse" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Telemetry...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* ── Header Infrastructure ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(`/${JSON.parse(localStorage.getItem('user') || '{}').role?.toLowerCase() || 'admin'}/products`)}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-600/5 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1 italic flex items-center gap-2">
              <Zap size={14} /> Catalog Architecture: {isEdit ? 'Refactoring' : 'Initializing'}
            </p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{isEdit ? 'Update Artifact' : 'Institutional Listing'}</h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
           <ShieldCheck size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest">Global Governance Active</span>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center gap-4 text-rose-600 shadow-xl shadow-rose-500/5"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
               <AlertCircle size={24} />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">System Exception</p>
               <p className="text-sm font-bold opacity-80">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto p-2 hover:bg-rose-100 rounded-lg transition-colors">
               <X size={20} />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
             <div className="bg-white p-12 rounded-[40px] shadow-2xl relative z-10 max-w-sm w-full text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/10">
                   <CheckCircle2 size={40} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900 mb-2">{isEdit ? 'Changes Indexed' : 'Listing Indexed'}</h2>
                   <p className="text-sm font-bold text-slate-400">{isEdit ? 'Your unit parameters have been successfully updated in the master ledger.' : 'Your unit is now entering the AI Verification cycle for global visibility.'}</p>
                </div>
                <div className="h-1 bg-slate-50 w-full rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '100%' }}
                     transition={{ duration: 2 }}
                     className="h-full bg-emerald-500"
                   />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* ── Product Identity Section ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-100/50 transition-colors" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Entity Profile</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Core specifications & provenance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., G-Series Performance Brake Kit"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm font-black text-slate-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category Unit</label>
                  <div className="relative group/select">
                    <select 
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm font-black text-slate-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="">SCAN CATEGORIES...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover/select:text-primary-500 transition-colors" size={20} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">OEM Protocol (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="OEM-XXXX-XXXX"
                    value={formData.oem_number}
                    onChange={(e) => setFormData({...formData, oem_number: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm font-black text-slate-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Visual Architecture Section ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Visual Artifacts</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">High-resolution imagery gallery</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
               {imagePreviews.map((url, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="aspect-square rounded-3xl overflow-hidden relative group"
                 >
                   <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                   <button 
                     onClick={() => removeImage(idx)}
                     className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                   >
                     <Trash2 size={16} />
                   </button>
                   {idx === 0 && (
                     <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                        Primary Map
                     </div>
                   )}
                 </motion.div>
               ))}
               
               <label className="aspect-square rounded-3xl border-4 border-dashed border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group">
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-all">
                     <Upload size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase group-hover:text-primary-600 transition-colors">Index Data</p>
               </label>
            </div>
          </section>

          {/* ── Technical Parameters Section ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Technical Parameters</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Dynamic unit specification matrix</p>
              </div>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Label (e.g., Material)" 
                      value={specInput.key}
                      onChange={(e) => setSpecInput({...specInput, key: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold text-slate-700 outline-none focus:border-primary-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Value (e.g., Carbon Steel)" 
                      value={specInput.value}
                      onChange={(e) => setSpecInput({...specInput, value: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold text-slate-700 outline-none focus:border-primary-300"
                    />
                    <button 
                      type="button"
                      onClick={addSpec}
                      className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all shrink-0"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <AnimatePresence>
                    {formData.specs.map((spec, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:shadow-lg transition-all"
                      >
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{spec.key}</span>
                            <span className="text-xs font-black text-slate-900 uppercase italic">{spec.value}</span>
                         </div>
                         <button onClick={() => removeSpec(idx)} className="text-slate-300 hover:text-rose-500 transition-colors">
                            <X size={16} />
                         </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* ── Commercials Section ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Commercials</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Retail Price (KES)</label>
                <div className="relative ring-offset-2 focus-within:ring-2 focus-within:ring-primary-500 transition-all rounded-3xl">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">KES</div>
                   <input 
                     type="number" 
                     required
                     value={formData.price}
                     onChange={(e) => setFormData({...formData, price: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-8 py-5 text-lg font-black text-slate-900 outline-none shadow-sm"
                     placeholder="0.00"
                   />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Active Inventory</label>
                <input 
                  type="number" 
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-lg font-black text-slate-900 outline-none shadow-sm"
                  placeholder="Items in stock"
                />
              </div>
            </div>
          </section>

          {/* ── Compatibility Matrix ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                <Truck size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Compatibility</h3>
            </div>

            <div className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Match (Press Enter)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Toyota Camry 2022" 
                    value={compatibilityInput}
                    onChange={(e) => setCompatibilityInput(e.target.value)}
                    onKeyDown={addCompatibility}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 outline-none focus:border-purple-300"
                  />
               </div>

               <div className="flex flex-wrap gap-2">
                 <AnimatePresence>
                   {formData.compatibility.map((tag, idx) => (
                     <motion.div 
                       key={idx}
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.8 }}
                       className="px-4 py-2 bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 group"
                     >
                        {tag}
                        <button onClick={() => removeCompatibility(idx)} className="text-purple-300 hover:text-rose-500 transition-colors">
                           <X size={12} />
                        </button>
                     </motion.div>
                   ))}
                 </AnimatePresence>
                 {formData.compatibility.length === 0 && (
                   <p className="text-[10px] font-bold text-slate-400 italic">No compatibility tags defined.</p>
                 )}
               </div>
            </div>
          </section>

          {/* ── Submission Hub ── */}
          <div className="space-y-4">
             <button 
               onClick={handleSubmit}
               disabled={loading || !formData.title || !formData.category_id || !formData.price || !formData.stock}
               className="w-full py-6 bg-slate-900 text-white rounded-3xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
             >
                {loading ? (
                   <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <CheckCircle2 size={18} /> {isEdit ? 'Update Artifact' : 'Deploy Listing'}
                  </>
                )}
             </button>
             <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest leading-loose">
               By {isEdit ? 'updating' : 'deploying'}, you verify that this unit meets all <span className="text-primary-600">SpareNova Intelligence Standards</span> and OEM authenticity protocols.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
