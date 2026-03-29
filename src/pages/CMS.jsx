import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CMS = () => {
  const [banners, setBanners] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [activeStagingId, setActiveStagingId] = useState(null);
  const [toast, setToast] = useState(null);
  const API_BASE = 'http://localhost:8003/api/v1';

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/cms`);
      if (res.data.success) {
        setBanners(res.data.banners);
        setFeatured(res.data.featured);
      }
    } catch (err) {
      console.error(`Failed to fetch CMS data:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStageUpdate = async (type, id) => {
    setActiveStagingId(id);
    try {
      const res = await axios.put(`${API_BASE}/admin/cms/banner/${id}`, { staged: true });
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
           <button className="bg-white border-2 border-slate-100 text-slate-700 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200/20 hover:scale-105 transition-all flex items-center gap-3 italic">
              <History size={18} /> Audit Ledger
           </button>
           <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-3 italic border-t border-white/10">
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
                        <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"><Edit3 size={18} /></button>
                        <button className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={18} /></button>
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
                     <span className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm shadow-emerald-500/5">DEPLOYED LIVE</span>
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
    </div>
  );
};

export default CMS;
