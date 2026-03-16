import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  MapPin,
  TrendingUp,
  Download
} from 'lucide-react';

const BusinessUnitList = ({ title, type, icon: Icon, color }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - in real app would fetch from Laravel
  const units = [
    { id: 1, name: 'SpareNova Central', owner: 'John Doe', location: 'Nairobi', status: 'verified', joinDate: '2026-03-01', revenue: '450k' },
    { id: 2, name: 'Premium Autoparts', owner: 'Sarah Smith', location: 'Mombasa', status: 'pending', joinDate: '2026-03-10', revenue: '0' },
    { id: 3, name: 'QuickFix Spares', owner: 'Mike Tyson', location: 'Kisumu', status: 'verified', joinDate: '2026-02-15', revenue: '120k' },
    { id: 4, name: 'GearHead Shop', owner: 'Emily Blunt', location: 'Eldoret', status: 'suspended', joinDate: '2026-01-20', revenue: '85k' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600`}>
                <Icon size={24} />
             </div>
             {title}
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage and monitor all registered {type} on the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
             <Download size={14} /> Export
          </button>
          <button className={`bg-primary-600 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary-500/30 hover:bg-primary-700 flex items-center gap-2 transition-all active:scale-95`}>
             <Plus size={16} /> Register New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { l: 'Total Units', v: '142', c: '+8%', i: Icon, col: color },
           { l: 'Verified', v: '128', c: '90%', i: ShieldCheck, col: 'blue' },
           { l: 'Pending Approval', v: '14', c: 'Needs review', i: AlertCircle, col: 'orange' },
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center`}>
                  <s.i size={24} />
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
         ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative group flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
             <input 
               placeholder={`Search ${type}...`} 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
             />
           </div>
           <div className="flex gap-2">
             <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"><Filter size={18} /></button>
             <select className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none">
                <option>All Status</option>
                <option>Verified</option>
                <option>Pending</option>
                <option>Suspended</option>
             </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Info</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue (MTD)</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {units.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1">{u.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Owner: {u.owner}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <MapPin size={14} className="text-slate-300" />
                      {u.location}, KE
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      u.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 
                      u.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${u.status === 'verified' ? 'bg-emerald-600' : u.status === 'pending' ? 'bg-orange-600' : 'bg-red-600'}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900 tracking-tight">
                    KES {u.revenue}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><ExternalLink size={18} /></button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg transition-all"><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Showing 1-4 of 142 Results</p>
           <div className="flex gap-1">
             {[1,2,3].map(n => (
               <button key={n} className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === 1 ? 'bg-primary-600 text-white shadow-primary-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{n}</button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessUnitList;
