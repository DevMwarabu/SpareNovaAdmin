import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  DollarSign, 
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Download
} from 'lucide-react';

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/payments`, {
        params: { page: currentPage, per_page: 8 }
      });
      if (res.data.success) {
        setTransactions(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch payments:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const statIcons = [Wallet, DollarSign, Clock, FileText];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CreditCard size={24} />
             </div>
             Payment Ledger
          </h1>
          <p className="text-slate-500 font-medium mt-1">Monitor revenue, commissions and merchant payouts.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
             <Calendar size={14} /> Transactions
           </button>
           <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 flex items-center gap-2 transition-all active:scale-95">
             <Download size={14} /> Account Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {stats.length > 0 ? stats.map((s, i) => {
           const Icon = statIcons[i];
           return (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className={`w-10 h-10 rounded-xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center mb-4`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
                <div className="flex items-end gap-2">
                   <p className="text-2xl font-black text-slate-900">{i !== 3 ? 'KES ' : ''}{s.v}</p>
                </div>
                <p className={`text-[10px] font-bold mt-1 ${s.col === 'orange' ? 'text-orange-500' : 'text-emerald-500'}`}>{s.c}</p>
              </div>
           </div>
         )}) : Array(4).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-32 rounded-3xl"></div>)}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50">
           <h2 className="text-xl font-black text-slate-900 tracking-tight italic">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-slate-50/50">
               <tr>
                 <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Transaction ID & Date</th>
                 <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Service / Merchant</th>
                 <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Type</th>
                 <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                 <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5">
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                 </tr>
              )}
               {transactions.map((t) => (
                 <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                   <td className="px-8 py-6">
                      <div className="text-xs font-black text-slate-400 font-serif lowercase italic mb-1">{t.id}</div>
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.date}</div>
                   </td>
                   <td className="px-8 py-6">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-sm">{t.logo}</div>
                        <span className="text-sm font-black text-slate-900">{t.merchant}</span>
                     </div>
                   </td>
                   <td className="px-8 py-6">
                     <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${t.type === 'Payout' ? 'bg-primary-50 text-primary-600' : 'bg-purple-50 text-purple-600'}`}>
                        {t.type}
                     </span>
                   </td>
                   <td className="px-8 py-6 text-sm font-black text-slate-900 tracking-tight">{t.amount}</td>
                   <td className="px-8 py-6">
                      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${t.status === 'Completed' ? 'text-emerald-500' : 'text-orange-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${t.status === 'Completed' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                        {t.status}
                      </div>
                   </td>
                 </tr>
               ))}
               {transactions.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-sm font-bold text-slate-400">
                       No transactions found.
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
                        className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
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

export default Payments;
