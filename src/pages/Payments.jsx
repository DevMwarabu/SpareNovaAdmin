import React from 'react';
import { motion } from 'framer-motion';
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
  const transactions = [
    { id: 'TXN-9021', type: 'Payout', merchant: 'SpareNova Central', date: '2026-03-15', amount: 'KES 45,000', status: 'Completed', logo: 'S' },
    { id: 'TXN-9020', type: 'Commission', merchant: 'System Fee', date: '2026-03-14', amount: 'KES 2,400', status: 'Completed', logo: 'F' },
    { id: 'TXN-9019', type: 'Payout', merchant: 'Premium Spares', date: '2026-03-14', amount: 'KES 12,800', status: 'Pending', logo: 'P' },
    { id: 'TXN-9018', type: 'Subscription', merchant: 'QuickFix Garage', date: '2026-03-13', amount: 'KES 5,000', status: 'Completed', logo: 'Q' },
  ];

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
         {[
           { l: 'Total Revenue', v: '1.2M', c: '+12%', col: 'blue', i: Wallet },
           { l: 'Commission Earned', v: '142K', c: '+8%', col: 'emerald', i: DollarSign },
           { l: 'Pending Payouts', v: '85K', c: '3 Requests', col: 'orange', i: Clock },
           { l: 'Subscriptions', v: '42', c: 'This month', col: 'purple', i: FileText },
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className={`w-10 h-10 rounded-xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center mb-4`}>
                <s.i size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
                <div className="flex items-end gap-2">
                   <p className="text-2xl font-black text-slate-900">KES {s.v}</p>
                   <p className={`text-[10px] font-bold mb-1 ${s.col === 'orange' ? 'text-orange-500' : 'text-emerald-500'}`}>{s.c}</p>
                </div>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50">
           <h2 className="text-xl font-black text-slate-900 tracking-tight italic">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-slate-50/50">
               <tr>
                 <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Transaction ID</th>
                 <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Service / Merchant</th>
                 <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Type</th>
                 <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                 <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {transactions.map((t) => (
                 <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                   <td className="px-8 py-6 text-xs font-black text-slate-400 font-serif lowercase italic">{t.id}</td>
                   <td className="px-8 py-6">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black">{t.logo}</div>
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
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
