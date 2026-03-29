import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Package, 
  Database,
  BarChart3,
  RefreshCw,
  Archive,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/inventory`, {
        params: { 
          search: searchTerm, 
          page: currentPage, 
          per_page: 8,
          status: filterStatus,
          min_price: minPrice,
          max_price: maxPrice
        }
      });
      if (res.data.success) {
        setInventory(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch inventory:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage, filterStatus, minPrice, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, minPrice, maxPrice]);

  const getStatusColor = (status) => {
    if (status === 'Out of Stock') return 'bg-red-50 text-red-600';
    if (status === 'Low Stock') return 'bg-orange-50 text-orange-600';
    return 'bg-emerald-50 text-emerald-600';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Box size={24} />
             </div>
             Inventory Intelligence
          </h1>
          <p className="text-slate-500 font-medium mt-1">Real-time visibility into global stock levels across all marketplace vendors.</p>
        </div>
        <button 
           onClick={fetchData}
           className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-xs font-black shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all active:scale-95"
        >
           <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center mb-4`}>
                 {i === 0 ? <Database size={24} /> : i === 1 ? <AlertTriangle size={24} /> : i === 2 ? <TrendingUp size={24} /> : <BarChart3 size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">{s.v}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{s.c}</p>
              </div>
           </div>
         )) : Array(4).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-32 rounded-3xl"></div>)}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative group flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
             <input 
               placeholder="Search by Product Name, OEM, or Store..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
             />
           </div>
           <div className="relative">
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className={`p-3 rounded-xl transition-colors ${isFilterOpen ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
             >
               <Filter size={18} />
             </button>

             <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-100 p-6 z-50 text-left"
                  >
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Advanced Telemetry Filter</p>
                     
                     <div className="space-y-5">
                       <div>
                         <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 italic">Stock Protocol</label>
                         <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 italic uppercase"
                         >
                            <option value="">All Stock Levels</option>
                            <option value="In Stock">In Stock (Healthy)</option>
                            <option value="Low Stock">Low Stock (Critical)</option>
                            <option value="Out of Stock">Out of Stock</option>
                         </select>
                       </div>

                       <div>
                         <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 italic">Price Threshold (KES)</label>
                         <div className="flex items-center gap-3">
                            <input 
                              type="number" 
                              placeholder="Min" 
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-300 placeholder:italic italic"
                            />
                            <span className="text-slate-300 font-black">-</span>
                            <input 
                              type="number" 
                              placeholder="Max" 
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-300 placeholder:italic italic"
                            />
                         </div>
                       </div>
                       
                       <div className="pt-2 flex items-center justify-between border-t border-slate-50 mt-2">
                          <button 
                            onClick={() => { setFilterStatus(''); setMinPrice(''); setMaxPrice(''); }}
                            className="text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest italic"
                          >
                             Reset Params
                          </button>
                          <button 
                             onClick={() => setIsFilterOpen(false)}
                             className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 italic"
                          >
                             Apply Matrix
                          </button>
                       </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Product & Vendor</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">OEM / Part Number</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Stock</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Unit Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5">
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                 </tr>
              )}
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                          {item.image ? (
                             <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Archive size={18} />
                             </div>
                          )}
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 leading-none mb-1">{item.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.store}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-slate-600 font-mono italic">{item.oem}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-black text-slate-900">{item.stock}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Units</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-slate-900 text-sm italic tracking-tight">
                    {item.price}
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                             <Package size={32} />
                          </div>
                          <p className="text-sm font-bold text-slate-400">Empty warehouse. No stock entries found.</p>
                       </div>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */ }
        <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             {pagination ? `Showing ${pagination.from || 0}-${pagination.to || 0} of ${pagination.total} Results` : 'Loading...'}
           </p>
           {pagination && pagination.last_page > 1 && (
             <div className="flex gap-1">
               {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const n = startPage + i;
                  if (n > pagination.last_page) return null;
                  return (
                    <button 
                        key={n} 
                        onClick={() => setCurrentPage(n)}
                        className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-primary-600 text-white shadow-primary-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                      >
                        {n}
                      </button>
                  );
               })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
