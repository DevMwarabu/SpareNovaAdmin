import { API_BASE } from '../api/config';
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
  ChevronDown,
  Info,
  Compass,
  Monitor,
  Activity,
  Box,
  CornerDownRight,
  ClipboardList,
  Search,
  Lock
} from 'lucide-react';



const ProductForm = () => {
  const { id, role } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  // Role-based Access Control for Logistics
  const canEditLogistics = role === 'logistics' || role === 'admin';
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // 1. Core
    product_name: '',
    description: '',
    short_description: '',
    
    // 2. Classification
    category_id: '',
    sub_category_id: '',
    brand_id: '',
    part_type: 'OEM', // OEM, Aftermarket, Refurbished
    
    // 3. Identification
    oem_number: '',
    part_number: '',
    sku: '',
    serial_number: '',
    
    // 4. Pricing
    cost_price: '',
    price: '',
    discount_price: '',
    min_price: '',
    max_price: '',
    currency: 'KES',
    
    // 5. Inventory
    stock_quantity: '',
    min_stock_level: '5',
    max_stock_level: '',
    warehouse_location: '',
    
    // 6. Media
    main_image: '',
    gallery_images: [],
    video_url: '',
    
    // 7. Logistics
    weight: '',
    length: '',
    width: '',
    height: '',
    
    // 8. Delivery & Installation
    delivery_meta: {
      standard: true,
      express: false,
      pickup: true,
      fee_override: '',
      estimated_time: ''
    },
    installation_available: false,
    installation_price: '',
    
    // 9. Compatibility (Option B)
    vehicles: [], // Array of IDs
    
    // Legacy mapping (keep title for sync)
    title: ''
  });

  const [metadata, setMetadata] = useState({
    categories: [],
    subCategories: [],
    brands: [],
    vehicles: []
  });

  const [specInput, setSpecInput] = useState({ key: '', value: '' });
  const [compatibilityInput, setCompatibilityInput] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [catRes, brandRes, vehRes] = await Promise.all([
          axios.get(`${API_BASE}/portal/categories`, { headers }),
          axios.get(`${API_BASE}/portal/brands`, { headers }),
          axios.get(`${API_BASE}/portal/vehicles`, { headers })
        ]);

        setMetadata({
          categories: catRes.data.success ? catRes.data.data : [],
          brands: brandRes.data.success ? brandRes.data.data : [],
          vehicles: vehRes.data.success ? vehRes.data.data : [],
          subCategories: []
        });

        if (isEdit) {
          const prodRes = await axios.get(`${API_BASE}/portal/products/${id}`, { headers });
          if (prodRes.data.success) {
            const p = prodRes.data.product;
            setFormData({
              ...p,
              product_name: p.title || p.product_name,
              vehicles: p.vehicles?.map(v => v.id) || []
            });
            setImagePreviews(p.gallery_images || p.images || []);
          }
        }
      } catch (err) {
        console.error('Metadata context failure:', err);
        setError('Systems Failure: Unable to synchronize with institutional metadata nodes.');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchMetadata();
  }, [id, isEdit]);

  // Update sub-categories when primary category changes
  useEffect(() => {
    if (formData.category_id && metadata.categories.length > 0) {
      const selectedCat = metadata.categories.find(c => c.id === parseInt(formData.category_id));
      setMetadata(prev => ({
        ...prev,
        subCategories: selectedCat ? selectedCat.children || [] : []
      }));
    } else {
      setMetadata(prev => ({ ...prev, subCategories: [] }));
    }
  }, [formData.category_id, metadata.categories]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    for (const file of files) {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      try {
        const response = await axios.post(`${API_BASE}/portal/products/upload`, formDataUpload, { headers });
        if (response.data.success) {
          if (formData.gallery_images.length === 0) {
             setFormData(prev => ({ ...prev, main_image: response.data.url }));
          }
          setFormData(prev => ({
            ...prev,
            gallery_images: [...prev.gallery_images, response.data.path]
          }));
          setImagePreviews(prev => [...prev, response.data.url]);
        }
      } catch (err) {
        setError('Artifact Indexing Failed: Image rejected by protocol.');
      }
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const method = isEdit ? 'put' : 'post';
      const url = isEdit ? `${API_BASE}/portal/products/${id}` : `${API_BASE}/portal/products`;
      
      const response = await axios[method](url, formData, { headers });
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* ── 1. Core Identity Node ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-100/50 transition-colors" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Core Identity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Institutional nomenclature & semantics</p>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Designation</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., G-Series Performance Brake Kit"
                  value={formData.product_name}
                  onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm font-black text-slate-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Executive Summary (Short Description)</label>
                <input 
                  type="text" 
                  placeholder="The definitive braking solution for endurance heavy-duty performance..."
                  value={formData.short_description}
                  onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm font-black text-slate-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Specifications Hub (Rich Description)</label>
                <textarea 
                  rows={6}
                  placeholder="Detail the technical superiority, composition, and long-term lifespan metrics..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[32px] px-8 py-6 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm resize-none"
                />
              </div>
            </div>
          </section>

          {/* ── 2. Classification Matrix ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Compass size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Classification Matrix</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Institutional taxonomy & origin</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Sector (Category)</label>
                <select 
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm font-black text-slate-900 outline-none appearance-none"
                >
                  <option value="">SCAN SECTORS...</option>
                  {metadata.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub-Sector (Optional)</label>
                <select 
                  value={formData.sub_category_id}
                  onChange={(e) => setFormData({...formData, sub_category_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm font-black text-slate-900 outline-none appearance-none"
                >
                  <option value="">SCAN SUB-SECTORS...</option>
                  {metadata.subCategories.length > 0 ? metadata.subCategories.map(sc => (
                    <option key={sc.id} value={sc.id}>{sc.name.toUpperCase()}</option>
                  )) : <option value="" disabled>NO SUB-SECTORS DETECTED</option>}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manufacturer Brand</label>
                <select 
                  value={formData.brand_id}
                  onChange={(e) => setFormData({...formData, brand_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm font-black text-slate-900 outline-none appearance-none"
                >
                  <option value="">SCAN BRANDS...</option>
                  {metadata.brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Part Provenance (Type)</label>
                <div className="flex gap-2">
                   {['OEM', 'Aftermarket', 'Refurbished'].map(type => (
                     <button
                       key={type}
                       type="button"
                       onClick={() => setFormData({...formData, part_type: type})}
                       className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.part_type === type ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                     >
                       {type}
                     </button>
                   ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. Compatibility Engine (Option B) ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                <Monitor size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Compatibility Engine</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Vehicle fitment & model mapping</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search vehicles to link (e.g., Toyota Camry 2022)..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-6 py-5 text-sm font-bold outline-none focus:bg-white focus:border-primary-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                {metadata.vehicles.map(vehicle => {
                  const isSelected = formData.vehicles.includes(vehicle.id);
                  return (
                    <button
                      key={vehicle.id}
                      onClick={() => {
                        const newVehicles = isSelected 
                          ? formData.vehicles.filter(id => id !== vehicle.id)
                          : [...formData.vehicles, vehicle.id];
                        setFormData({...formData, vehicles: newVehicles});
                      }}
                      className={`flex items-center justify-between p-5 rounded-[28px] border transition-all text-left group ${isSelected ? 'bg-primary-50 border-primary-200 ring-2 ring-primary-500/10' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                    >
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-primary-600' : 'text-slate-400'}`}>{vehicle.make}</p>
                        <p className="text-sm font-black text-slate-900 uppercase">{vehicle.model}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-0.5">{vehicle.year_from} - {vehicle.year_to} | {vehicle.engine_type}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-slate-300 group-hover:bg-slate-100'}`}>
                        {isSelected ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── 4. Commercial Protocol Tier ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Commercial Protocol</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Multi-tier pricing & cost analytics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Retail (Selling) Price</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">KES</span>
                   <input 
                     type="number" 
                     value={formData.price}
                     onChange={(e) => setFormData({...formData, price: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-6 py-5 text-sm font-black outline-none"
                     placeholder="0.00"
                   />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Price</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">KES</span>
                   <input 
                     type="number" 
                     value={formData.discount_price}
                     onChange={(e) => setFormData({...formData, discount_price: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-6 py-5 text-sm font-black outline-none"
                     placeholder="0.00"
                   />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Cost Price</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">KES</span>
                   <input 
                     type="number" 
                     value={formData.cost_price}
                     onChange={(e) => setFormData({...formData, cost_price: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-6 py-5 text-sm font-black outline-none"
                     placeholder="0.00"
                   />
                </div>
              </div>
            </div>
          </section>

          {/* ── 5. Logistics Dimensional Node ── */}
          <section className={`bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-8 transition-all ${!canEditLogistics ? 'opacity-80' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Logistics Dimensions</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Physical attributes for delivery calculation</p>
                </div>
              </div>
              {!canEditLogistics && (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <Lock size={12} className="text-slate-300" />
                  System Managed
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { label: 'Weight (kg)', key: 'weight', icon: Activity },
                 { label: 'Length (cm)', key: 'length', icon: Box },
                 { label: 'Width (cm)', key: 'width', icon: Box },
                 { label: 'Height (cm)', key: 'height', icon: Box },
               ].map((dim) => (
                 <div key={dim.key} className={`space-y-3 p-6 rounded-[32px] border transition-all ${!canEditLogistics ? 'bg-slate-50/30 border-slate-50 cursor-not-allowed' : 'bg-slate-50/50 border-slate-100 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{dim.label}</label>
                       <dim.icon size={12} className="text-slate-300" />
                    </div>
                    <input 
                      type="number" 
                      value={formData[dim.key]}
                      disabled={!canEditLogistics}
                      onChange={(e) => setFormData({...formData, [dim.key]: e.target.value})}
                      className={`w-full bg-transparent text-lg font-black outline-none ${!canEditLogistics ? 'text-slate-400 cursor-not-allowed' : 'text-slate-900'}`}
                      placeholder="0.0"
                    />
                 </div>
               ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
          
          {/* ── 6. Visual Artifacts Hub ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-base font-black text-slate-900">Visual Artifacts</h3>
               <Upload size={18} className="text-orange-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {imagePreviews.map((url, idx) => (
                 <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group border border-slate-100">
                    <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                    <button 
                      onClick={() => {
                        setFormData(prev => ({ ...prev, gallery_images: prev.gallery_images.filter((_, i) => i !== idx) }));
                        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                    >
                       <X size={14} />
                    </button>
                    {url === formData.main_image && (
                      <div className="absolute inset-x-0 bottom-0 py-1.5 bg-primary-600/90 backdrop-blur-sm text-[8px] font-black text-white uppercase tracking-widest text-center">
                        Main Visual
                      </div>
                    )}
                    <button 
                      onClick={() => setFormData({...formData, main_image: url})}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-black uppercase tracking-widest"
                    >
                      Set Primary
                    </button>
                 </div>
               ))}
               <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-primary-200 transition-all group">
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 flex items-center justify-center transition-all">
                    <Upload size={20} />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add Media</span>
               </label>
            </div>
          </section>

          {/* ── 7. Identification Layer ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6">
             <div className="flex items-center gap-3">
                <Info size={18} className="text-blue-500" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">Identification & OEM</h3>
             </div>
             
             <div className="space-y-5">
                {[
                  { label: 'OEM Number (Global)', key: 'oem_number', placeholder: 'OEM-XXX-YYY' },
                  { label: 'Part Number (Provider)', key: 'part_number', placeholder: 'PART-99-00' },
                  { label: 'SKU / Barcode', key: 'sku', placeholder: 'SKU-SN-0000' },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-[8px]">{field.label}</label>
                     <input 
                       type="text" 
                       value={formData[field.key]}
                       onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                       placeholder={field.placeholder}
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:bg-white focus:border-blue-400"
                     />
                  </div>
                ))}
             </div>
          </section>

          {/* ── 8. Inventory Protocols ── */}
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 tracking-tight">Inventory Protocol</h3>
                <Layers size={18} className="text-orange-500" />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Qty</label>
                   <input 
                     type="number" 
                     value={formData.stock_quantity}
                     onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-black outline-none"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Min Alert</label>
                   <input 
                     type="number" 
                     value={formData.min_stock_level}
                     onChange={(e) => setFormData({...formData, min_stock_level: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-black outline-none"
                   />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Warehouse Node (Location)</label>
                <input 
                  type="text" 
                  value={formData.warehouse_location}
                  onChange={(e) => setFormData({...formData, warehouse_location: e.target.value})}
                  placeholder="e.g., Aisle 4, Shelf B12"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none"
                />
             </div>
          </section>

          {/* ── 9. Delivery & Install Hub ── */}
          <section className="bg-slate-900 text-white rounded-[40px] p-8 space-y-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl group-hover:bg-primary-500/20 transition-all duration-700" />
             
             <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center animate-pulse">
                   <Truck size={20} />
                </div>
                <h3 className="text-base font-black tracking-tight uppercase tracking-widest">Fulfillment Strategy</h3>
             </div>

             <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 gap-3">
                   {[
                     { key: 'standard', label: 'Standard Fleet (3-5 Days)', icon: CornerDownRight },
                     { key: 'express', label: 'Express Protocol (Next Day)', icon: Zap },
                     { key: 'pickup', label: 'In-Store Artifact Pickup', icon: Package }
                   ].map(option => (
                     <button
                       key={option.key}
                       onClick={() => setFormData({
                         ...formData, 
                         delivery_meta: { ...formData.delivery_meta, [option.key]: !formData.delivery_meta[option.key] }
                       })}
                       className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.delivery_meta[option.key] ? 'border-primary-500 bg-primary-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'}`}
                     >
                        <div className="flex items-center gap-3">
                           <option.icon size={14} className={formData.delivery_meta[option.key] ? 'text-primary-400' : 'text-slate-600'} />
                           <span className="text-[10px] font-black uppercase tracking-widest">{option.label}</span>
                        </div>
                        {formData.delivery_meta[option.key] && <CheckCircle2 size={14} />}
                     </button>
                   ))}
                </div>

                <div className="pt-6 border-t border-white/10 space-y-4">
                   <div 
                     onClick={() => setFormData({...formData, installation_available: !formData.installation_available})}
                     className="flex items-center justify-between cursor-pointer group/toggle"
                   >
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Garage Installation</span>
                         <span className="text-[8px] font-bold text-slate-500 italic mt-0.5 uppercase">Professional fitment at checkout</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${formData.installation_available ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                         <motion.div 
                           animate={{ x: formData.installation_available ? 24 : 0 }}
                           className="w-4 h-4 bg-white rounded-full shadow-lg"
                         />
                      </div>
                   </div>

                   {formData.installation_available && (
                      <motion.div initial={{ opacity: 0, scale:0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Installation Fee (KES)</label>
                         <input 
                           type="number" 
                           value={formData.installation_price}
                           onChange={(e) => setFormData({...formData, installation_price: e.target.value})}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-black text-white outline-none focus:border-primary-500"
                           placeholder="0.00"
                         />
                      </motion.div>
                   )}
                </div>
             </div>
          </section>

          {/* ── Submission Command ── */}
          <div className="space-y-4">
             <button 
               onClick={handleSubmit}
               disabled={loading || !formData.product_name || !formData.category_id || !formData.price || !formData.stock_quantity}
               className="w-full py-8 bg-slate-900 border border-white/10 text-white rounded-[40px] text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-950/40 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all flex flex-col items-center justify-center gap-1 relative overflow-hidden"
             >
                {loading ? (
                   <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <span className="text-white text-lg font-black tracking-tight">{isEdit ? 'REFRACTOR LISTING' : 'DEPLOY ARTIFACT'}</span>
                    <span className="text-[8px] font-bold text-slate-500 tracking-[0.5em] group-hover:text-primary-400 transition-colors">INITIATE MARKETPLACE SYNC</span>
                  </>
                )}
             </button>
             <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                <ShieldCheck size={16} className="text-emerald-500" />
                <p className="text-[8px] font-bold text-slate-400 text-center uppercase tracking-widest leading-loose">
                  Institutional Governance: By deploying, you verify <span className="text-slate-900 font-black italic">authentic provenance</span> & cross-compatibility matrices.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
