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
  FileText
} from 'lucide-react';

const CMS = () => {
  const [banners, setBanners] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8003/api/v1';

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                <Layout size={24} />
             </div>
             Content Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage homepage banners, featured products, and SEO pages.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-2">
           <Plus size={18} /> New Component
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Banners Section */}
         <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={18} className="text-slate-400" /> Homepage Banners
               </h3>
               <button onClick={fetchData}><RefreshCw size={16} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} /></button>
            </div>
            <div className="p-4 space-y-4">
               {banners.map((b) => (
                 <div key={b.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-[24px] hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-10 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                          <ImageIcon size={20} className="text-slate-400" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900">{b.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.clicks} Clicks · {b.status}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg"><Edit3 size={16} /></button>
                       <button className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Featured Products */}
         <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Star size={18} className="text-slate-400" /> Featured Selections
               </h3>
            </div>
            <div className="p-4 space-y-4">
               {featured.map((f) => (
                 <div key={f.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-[24px] hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                          <Star size={18} className="text-orange-400" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900">{f.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.category}</p>
                       </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">LIVE</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { l: 'SEO Pages', i: Globe, c: 'Manage meta tags & titles' },
           { l: 'Brand Catalog', i: FileText, c: 'Edit partner brand logos' },
           { l: 'Help Center', i: Search, c: 'Update documentation & FAQs' },
         ].map((tool, i) => (
           <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center mb-6 transition-all">
                 <tool.i size={20} />
              </div>
              <h4 className="text-lg font-black text-slate-900">{tool.l}</h4>
              <p className="text-xs font-medium text-slate-500 mt-2">{tool.c}</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default CMS;
