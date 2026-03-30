import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Star, 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ThumbsUp,
  User,
  ShoppingBag,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/portal/reviews`, {
        params: { search: searchTerm, status: filterStatus, page: currentPage, per_page: 8 }
      });
      if (res.data.success) {
        setReviews(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch reviews:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterStatus, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/portal/reviews/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(`Failed to update review status:`, err);
    }
  };

  const statusStyles = {
    'Approved': 'bg-emerald-50 text-emerald-600',
    'Pending': 'bg-orange-50 text-orange-600',
    'Rejected': 'bg-red-50 text-red-600'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
                <Star size={24} fill="currentColor" />
             </div>
             Reputation & Reviews
          </h1>
          <p className="text-slate-500 font-medium mt-1">Monitor vendor ratings, moderate customer feedback, and analyze sentiment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center`}>
                   {i === 0 ? <MessageSquare size={24} /> : i === 1 ? <ThumbsUp size={24} /> : <Flag size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
                  <p className="text-xl font-black text-slate-900">{s.v}</p>
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                {s.c}
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-3xl"></div>)}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative group flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={18} />
             <input 
               placeholder="Search by User, Product or Review Title..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all"
             />
           </div>
           <div className="flex gap-2 relative">
             <button 
               onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
               className={`p-3 rounded-xl transition-all border-2 flex items-center gap-2 ${showAdvancedFilter || filterStatus !== 'All Status' ? 'bg-amber-50 border-amber-500 text-amber-600 shadow-xl shadow-amber-500/20' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
             >
               <Filter size={18} />
               {(filterStatus !== 'All Status') && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
               )}
             </button>
             <AnimatePresence>
               {showAdvancedFilter && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-80 bg-white rounded-[32px] shadow-2xl shadow-slate-900/10 border border-slate-100 p-6 z-50 origin-top-right"
                  >
                     <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                        <div>
                           <p className="text-[12px] font-black text-slate-900 uppercase italic tracking-tight">Intelligence Matrix</p>
                        </div>
                        <button onClick={() => setShowAdvancedFilter(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                           <XCircle size={14} />
                        </button>
                     </div>
                     
                     <div className="space-y-5">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3 pl-1">Moderation State</label>
                          <div className="grid grid-cols-2 gap-2">
                             {['All Status', 'Pending', 'Approved', 'Rejected'].map(state => (
                                <button 
                                  key={state}
                                  onClick={() => setFilterStatus(state === 'All Status' ? 'All Status' : state.toLowerCase())}
                                  className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === (state === 'All Status' ? 'All Status' : state.toLowerCase()) ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                  {state}
                                </button>
                             ))}
                          </div>
                       </div>
                     </div>
                     
                     <div className="mt-8 flex gap-3">
                        <button onClick={() => { setFilterStatus('All Status'); setShowAdvancedFilter(false); }} className="flex-1 py-3.5 rounded-2xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Reset</button>
                        <button onClick={() => setShowAdvancedFilter(false)} className="flex-[2] py-3.5 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Apply Matrix</button>
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
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer & Date</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Review Content</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Product / Store</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5">
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                 </tr>
              )}
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors">{r.customer}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 max-w-md">
                    <div className="flex flex-col gap-1">
                       <p className="text-xs font-black text-slate-800 line-clamp-1 italic">"{r.title}"</p>
                       <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-relaxed">{r.comment}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1 items-start">
                       <button onClick={() => r.product_id ? navigate(`/portal/products/${r.product_id}`) : null} className={`text-xs font-bold text-slate-700 transition-colors text-left truncate max-w-[150px] ${r.product_id ? 'hover:text-amber-600 decoration-amber-500/30 hover:underline underline-offset-4 cursor-pointer' : 'cursor-default'}`}>
                          {r.product}
                       </button>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.store}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-0.5">
                       {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < r.rating ? 'text-amber-400' : 'text-slate-200'} fill={i < r.rating ? 'currentColor' : 'none'} />
                       ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">
                    <div className="flex items-center justify-end gap-3">
                       <span className={`px-2 py-1 rounded text-[9px] uppercase tracking-tighter font-black ${statusStyles[r.status]}`}>{r.status}</span>
                       {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
                         <div className="flex gap-1">
                            <button 
                               onClick={() => handleStatusUpdate(r.id, 'approved')}
                               title="Approve Review"
                               className="p-1.5 bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                            >
                               <CheckCircle2 size={16} />
                            </button>
                            <button 
                               onClick={() => handleStatusUpdate(r.id, 'rejected')}
                               title="Reject Review"
                               className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                               <XCircle size={16} />
                            </button>
                         </div>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                       <p className="text-sm font-bold text-slate-400 italic">No customer reviews found matching criteria.</p>
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
                        className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
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

export default Reviews;
