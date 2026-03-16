import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  Plus, 
  RefreshCw,
  Clock,
  ChevronRight
} from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/reports`);
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error(`Failed to fetch reports:`, err);
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
             <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                <BarChart3 size={24} />
             </div>
             Advanced Analytics
          </h1>
          <p className="text-slate-500 font-medium mt-1">Generate deep-dive reports across Sales, Logistics, and Vendor performance.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-2">
           <Plus size={18} /> New Report Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {[
           { l: 'Revenue Audit', v: 'KES 4.2M', c: '+12% vs LW', col: 'blue' },
           { l: 'Dispatch Rate', v: '94.2%', c: 'Target: 98%', col: 'emerald' },
           { l: 'Stock Velocity', v: '18 Days', c: 'Fast Moving', col: 'indigo' },
           { l: 'Dispute Ratio', v: '0.4%', c: 'Optimal', col: 'rose' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
              <p className="text-xl font-black text-slate-900">{stat.v}</p>
              <p className={`text-[10px] font-bold mt-1 uppercase tracking-tighter text-${stat.col}-500`}>{stat.c}</p>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <FileText size={18} className="text-slate-400" /> Automated Report Library
            </h3>
            <div className="flex gap-2">
               <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-slate-900 transition-colors"><Filter size={16} /></button>
               <button onClick={fetchData} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-slate-900 transition-colors"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
            </div>
         </div>
         <div className="divide-y divide-slate-50">
            {reports.map((r) => (
              <div key={r.id} className="p-6 hover:bg-slate-50/50 transition-colors group flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                       <FileText size={20} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-slate-900">{r.name}</h4>
                       <div className="flex items-center gap-4 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.type}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest"><Clock size={10} /> Generated {r.last_generated}</span>
                       </div>
                    </div>
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                    <Download size={14} /> Download PDF
                 </button>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Reports;
