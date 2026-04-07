import { API_BASE } from '../api/config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Image as ImageIcon, 
  Star, 
  Search, 
  Plus, 
  RefreshCw,
  Edit3,
  Trash2,
  Globe,
  FileText,
  Zap,
  ArrowRight,
  ShieldCheck,
  Layers,
  Monitor,
  Smartphone,
  History,
  Loader2,
  AlertTriangle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmDialog from '../components/ConfirmDialog';

const CMS = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStagingId, setActiveStagingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  
  // Modal states
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [featuredForm, setFeaturedForm] = useState({ product_id: '', tier: 'GOLD' });
  const [bannerForm, setBannerForm] = useState({ title: '', type: 'PRIMARY_HERO', status: 'Active', link_url: '' });
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  // Confirmation state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/portal/cms`);
      if (res.data.success) {
        setBanners(res.data.banners);
        setFeatured(res.data.featured);
      }
    } catch (err) {
      console.error(`Failed to fetch CMS data:`, err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/portal/cms/products`);
      if (res.data.success) setAllProducts(res.data.products);
    } catch (err) { console.error("Catalog fetch failed"); }
  };

  useEffect(() => {
    fetchData();
    fetchProducts();
  }, []);

  const handleStageUpdate = async (type, id) => {
    setActiveStagingId(id);
    try {
      const res = await axios.put(`${API_BASE}/portal/cms/banner/${id}`, { staged: true });
      if (res.data.success) {
        showToast('Asset status staged successfully');
        fetchData();
      }
    } catch (err) {
      console.error("Staging failure");
      showToast('Architectural staging failed');
    } finally {
      setActiveStagingId(null);
    }
  };

  const handleDeleteBanner = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Decommission Brand Asset?',
      message: 'This protocol will permanently remove this marketplace staging slot from the index. This action is audited and irreversible.',
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE}/portal/cms/banner/${id}`);
          showToast('Asset decommissioned successfully');
          fetchData();
        } catch (err) {
          showToast('Decommission failure');
        }
      }
    });
  };

  const handleDeleteFeatured = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Revoke Curation Spotlight?',
      message: 'This item will be removed from the editorial spotlight gallery. It will remain in the catalog but lose its tier-priority visibility.',
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE}/portal/cms/featured/${id}`);
          showToast('Curation spotlight revoked');
          fetchData();
        } catch (err) {
          showToast('Revocation failed');
        }
      }
    });
  };

  const handleActionComingSoon = (action) => {
    showToast(`${action} interface coming in v2.0`);
  };

  const openBannerModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerForm({ title: banner.title, type: banner.type, status: banner.status, link_url: banner.link_url || '' });
    } else {
      setEditingBanner(null);
      setBannerForm({ title: '', type: 'PRIMARY_HERO', status: 'Active', link_url: '' });
    }
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async () => {
    try {
      if (editingBanner) {
        await axios.put(`${API_BASE}/portal/cms/banner/${editingBanner.id}`, bannerForm);
        showToast('Brand asset updated');
      } else {
        await axios.post(`${API_BASE}/portal/cms/banner`, bannerForm);
        showToast('New asset defined');
      }
      setIsBannerModalOpen(false);
      fetchData();
    } catch (err) { showToast('Sync failed'); }
  };

  const handleSaveFeatured = async () => {
    try {
      await axios.post(`${API_BASE}/portal/cms/featured`, featuredForm);
      showToast('Curation spotlight deployed');
      setIsFeaturedModalOpen(false);
      fetchData();
    } catch (err) { showToast('Revocation failed'); }
  };

  const filteredProducts = allProducts.filter(p => 
    p.title.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const selectedProduct = allProducts.find(p => p.id == featuredForm.product_id);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600 shadow-xl shadow-orange-500/10 border border-orange-100">
                <Layers size={24} />
             </div>
             Brand Experience Engine
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">Architectural Management of Public Assets & Digital Touchpoints</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => navigate(`/${JSON.parse(localStorage.getItem('user') || '{}').role?.toLowerCase() || 'admin'}/audit-logs`)}
             className="bg-white border-2 border-slate-100 text-slate-700 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200/20 hover:scale-105 transition-all flex items-center gap-3 italic"
           >
              <History size={18} /> Audit Ledger
           </button>
           <button 
             onClick={() => openBannerModal()}
             className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-3 italic border-t border-white/10"
           >
              <Plus size={18} /> Define Asset
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Banners Section */}
         <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 italic">
                  <ImageIcon size={20} className="text-orange-500" /> Marketplace Staging Slots
               </h3>
               <button onClick={fetchData} className="p-3 hover:bg-slate-50 rounded-2xl transition-all"><RefreshCw size={18} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} /></button>
            </div>
            <div className="p-6 space-y-4">
               {loading ? (
                  Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-50 h-28 rounded-[32px]"></div>)
               ) : banners.map((b) => (
                  <div key={b.id} className="group relative flex items-center justify-between p-6 bg-slate-50 rounded-[32px] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 italic uppercase">
                     <div className="flex items-center gap-6">
                        <div className="w-24 h-16 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 relative shadow-inner">
                           <ImageIcon size={24} className="text-white/20" />
                           <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-1.5">
                           <div className="flex items-center gap-3">
                              <p className="text-sm font-black text-slate-900 tracking-tight">{b.title}</p>
                              <span className="text-[8px] font-black px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full tracking-[0.2em]">{b.type}</span>
                           </div>
                           <div className="flex items-center gap-6">
                              <p className="text-[9px] font-black text-slate-400 tracking-widest flex items-center gap-1.5"><Zap size={10} className="text-orange-500" /> {b.clicks} ENGAGEMENTS</p>
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black border ${b.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                 {b.status}
                              </span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleStageUpdate('banner', b.id)}
                          className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                        >
                           {activeStagingId === b.id ? <Loader2 size={18} className="animate-spin text-orange-500" /> : <Monitor size={18} />}
                        </button>
                        <button onClick={() => openBannerModal(b)} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"><Edit3 size={18} /></button>
                        <button 
                          onClick={() => handleDeleteBanner(b.id)}
                          className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Featured Selections */}
         <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 italic">
                  <Star size={20} className="text-orange-500" /> Editorial Curations
               </h3>
               <div className="flex items-center gap-3">
                  <button onClick={() => setIsFeaturedModalOpen(true)} className="p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:scale-110 transition-all"><Plus size={16} /></button>
                  <button onClick={fetchData} className="p-3 hover:bg-slate-50 rounded-2xl transition-all"><RefreshCw size={18} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} /></button>
               </div>
            </div>
            <div className="p-6 space-y-4">
               {loading ? (
                  Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-50 h-28 rounded-[32px]"></div>)
               ) : featured.map((f) => (
                  <div key={f.id} className="group flex items-center justify-between p-6 bg-slate-50 rounded-[32px] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 italic uppercase">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center border border-slate-100 shadow-inner group-hover:border-orange-100 transition-all">
                           <Star size={24} className="text-orange-400 group-hover:rotate-12 transition-transform" />
                        </div>
                        <div className="space-y-1.5">
                           <p className="text-base font-black text-slate-900 tracking-tight leading-none">{f.name}</p>
                           <div className="flex items-center gap-4">
                              <p className="text-[9px] font-black text-slate-400 tracking-widest">{f.category}</p>
                              <span className="px-2 py-0.5 bg-slate-900 text-white text-[7px] font-black rounded-full tracking-[0.2em]">{f.tier} TIER</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm shadow-emerald-500/5 transition-all group-hover:opacity-0">DEPLOYED LIVE</span>
                        <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 flex gap-2">
                           <button onClick={() => handleDeleteFeatured(f.id)} className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                              <Trash2 size={18} />
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { l: 'SEO Governance', i: Globe, c: 'Metadata frameworks & global search indexing control.', col: 'blue' },
           { l: 'Institutional Catalog', i: FileText, c: 'Management of multi-tenant brand hierarchies.', col: 'indigo' },
           { l: 'Compliance Documentation', i: ShieldCheck, c: 'FAQ synchronization & governance policies.', col: 'teal' },
         ].map((tool, i) => (
            <motion.div 
               whileHover={{ y: -10 }}
               key={i} 
               className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group cursor-pointer italic uppercase"
            >
               <div className={`w-16 h-16 rounded-[24px] bg-${tool.col}-50 text-${tool.col}-600 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center mb-8 transition-all duration-700 shadow-inner group-hover:shadow-2xl`}>
                  <tool.i size={28} />
               </div>
               <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-3">{tool.l}</h4>
               <p className="text-[10px] font-black text-slate-400 leading-relaxed opacity-60 tracking-widest">{tool.c}</p>
               <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-900 tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Access Framework <ArrowRight size={14} className="inline ml-2" /></span>
               </div>
            </motion.div>
         ))}
      </div>
       {/* UI Toasts */}
       <AnimatePresence>
         {toast && (
           <motion.div 
             initial={{ opacity: 0, y: 50, x: '-50%' }}
             animate={{ opacity: 1, y: 0, x: '-50%' }}
             exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
             className="fixed bottom-10 left-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-[32px] shadow-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest italic"
           >
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
                 <RefreshCw size={14} className="animate-spin text-white" />
              </div>
              {toast}
           </motion.div>
         )}
       </AnimatePresence>

      {/* Confirmation Dialog */}
      <ConfirmDialog 
        {...confirmDialog}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      {/* Banner Creation/Editing Modal */}
      <AnimatePresence>
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[48px] shadow-2xl p-12 overflow-hidden border border-slate-100 italic uppercase"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-orange-50 text-orange-600"><ImageIcon size={24} /></div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingBanner ? 'Refine Asset' : 'Define New Asset'}</h2>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest">Architectural Marketplace Staging Slot</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 tracking-widest mb-2 block">Campaign Title</label>
                  <input 
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                    placeholder="e.g. FLASH SALE - 40% OFF"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 tracking-widest mb-2 block">Staging Type</label>
                    <select 
                      value={bannerForm.type}
                      onChange={(e) => setBannerForm({...bannerForm, type: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 focus:border-orange-500 transition-all outline-none appearance-none"
                    >
                      <option value="PRIMARY_HERO">PRIMARY HERO</option>
                      <option value="SECONDARY_PROTO">SECONDARY PROTO</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 tracking-widest mb-2 block">Governance Status</label>
                    <select 
                      value={bannerForm.status}
                      onChange={(e) => setBannerForm({...bannerForm, status: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 focus:border-orange-500 transition-all outline-none appearance-none"
                    >
                      <option value="Active">ACTIVE</option>
                      <option value="Scheduled">SCHEDULED</option>
                      <option value="Archived">ARCHIVED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 tracking-widest mb-2 block">Redirection Link (URI)</label>
                  <input 
                    value={bannerForm.link_url}
                    onChange={(e) => setBannerForm({...bannerForm, link_url: e.target.value})}
                    placeholder="/shop?category=brakes"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button onClick={() => setIsBannerModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Cancel Synchronization</button>
                <button onClick={handleSaveBanner} className="flex-1 bg-slate-900 text-white rounded-[24px] py-4 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all outline-none border-t border-white/10">Authorize Execution</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Featured Item Modal */}
      <AnimatePresence>
        {isFeaturedModalOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFeaturedModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[48px] shadow-2xl p-12 overflow-hidden border border-slate-100 italic uppercase"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-orange-50 text-orange-600"><Star size={24} /></div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Curation Hub</h2>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest">Linking Institutional Catalog to Spotlight</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-500 tracking-widest mb-2 block">Catalog Search</label>
                  <div className="relative group">
                    <input 
                      value={productSearchTerm || (selectedProduct?.title || '')}
                      onChange={(e) => {
                        setProductSearchTerm(e.target.value);
                        setIsProductDropdownOpen(true);
                        if (!e.target.value) setFeaturedForm({...featuredForm, product_id: ''});
                      }}
                      onFocus={() => setIsProductDropdownOpen(true)}
                      placeholder="SEARCH UNIFIED PRODUCT NODE..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 text-xs font-black text-slate-900 placeholder:text-slate-300 focus:border-orange-500 transition-all outline-none"
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                    
                    <AnimatePresence>
                      {isProductDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto z-50 p-2 space-y-1"
                        >
                          {filteredProducts.length > 0 ? filteredProducts.map(p => (
                            <button 
                              key={p.id}
                              onClick={() => {
                                setFeaturedForm({...featuredForm, product_id: p.id});
                                setProductSearchTerm('');
                                setIsProductDropdownOpen(false);
                              }}
                              className="w-full text-left p-4 hover:bg-slate-50 rounded-2xl transition-all flex items-center justify-between group"
                            >
                               <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{p.title}</span>
                               <span className="text-[8px] font-black text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">SELECT NODE</span>
                            </button>
                          )) : (
                            <div className="p-8 text-center text-slate-400 italic font-black text-[9px] uppercase tracking-widest">
                               <AlertTriangle size={24} className="mx-auto mb-3 opacity-20" />
                               No Unified Nodes Found
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {selectedProduct && !isProductDropdownOpen && (
                    <div className="mt-3 p-3 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
                       <span className="text-[9px] font-black text-orange-600 tracking-widest uppercase italic">Node Selected: {selectedProduct.title}</span>
                       <button onClick={() => {setFeaturedForm({...featuredForm, product_id: ''}); setProductSearchTerm('');}} className="p-1 hover:bg-white rounded-lg transition-all"><X size={14} className="text-orange-400" /></button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 tracking-widest mb-2 block">Editorial Tier</label>
                  <select 
                    value={featuredForm.tier}
                    onChange={(e) => setFeaturedForm({...featuredForm, tier: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 focus:border-orange-500 transition-all outline-none appearance-none"
                  >
                    <option value="PLATINUM">PLATINUM EXHIBIT</option>
                    <option value="GOLD">GOLD SELECTION</option>
                    <option value="SILVER">SILVER CURATION</option>
                  </select>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button onClick={() => setIsFeaturedModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Cancel Integration</button>
                <button 
                  onClick={handleSaveFeatured}
                  disabled={!featuredForm.product_id}
                  className="flex-1 bg-slate-900 text-white rounded-[24px] py-4 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all outline-none border-t border-white/10 disabled:opacity-50 disabled:scale-100"
                >
                  Deploy Spotight
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CMS;
