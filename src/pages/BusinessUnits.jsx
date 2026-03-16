import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  Download,
  Loader2,
  FileText
} from 'lucide-react';

const BusinessUnitList = ({ title, type, icon: Icon, color }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [units, setUnits] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/${type}`, {
        params: { search: searchTerm, status: filterStatus, page: currentPage, per_page: 8 }
      });
      if (res.data.success) {
        setUnits(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/admin/${type}/${id}`);
      if (res.data.success) {
        setSelectedUnit(res.data.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type} details:`, err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterStatus, type, currentPage]);

  // Reset page to 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, type]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/admin/${type}/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchData(); // Refresh list after update
        if (selectedUnit && selectedUnit.id === id) {
           setIsModalOpen(false);
           setSelectedUnit(null);
        }
      }
    } catch (err) {
      console.error(`Failed to update status for ${type} ${id}:`, err);
    }
  };

  const handleExport = () => {
    if (!units.length) return;
    setIsExporting(true);
    
    try {
      // Create CSV Headers
      const headers = ['ID', 'Name', 'Owner', 'Email', 'Location', 'Status', 'Join Date', 'MTD Revenue'];
      const csvContent = [
        headers.join(','),
        ...units.map(u => [
          u.id,
          `"${u.name}"`,
          `"${u.owner}"`,
          u.email,
          `"${u.location}"`,
          u.status,
          u.joinDate,
          u.revenue.replace('KES ', '').replace(',', '')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  const handleRegisterNew = () => {
    // Navigate in the same window (pane) to dedicated registration page
    const mappedRole = type === 'shops' ? 'store_owner' : type === 'garages' ? 'garage_owner' : 'delivery';
    navigate(`/admin/register-partner?role=${mappedRole}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600 border border-${color}-100`}>
                <Icon size={24} />
             </div>
             {title}
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage and monitor all registered {type} on the platform.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            disabled={isExporting || units.length === 0}
            className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all disabled:opacity-50"
          >
             {isExporting ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />} 
             {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button 
            onClick={handleRegisterNew}
            className={`bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 flex items-center gap-2 transition-all active:scale-95`}
          >
             <Plus size={16} /> Register New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-primary-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                   {i === 0 ? <Icon size={24} /> : i === 1 ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.l}</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{s.v}</p>
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                {s.c}
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-3xl"></div>)}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <form 
             onSubmit={(e) => { e.preventDefault(); fetchData(); }}
             className="relative group flex-1 max-w-md"
           >
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
             <input 
               placeholder={`Search ${type}...`} 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
             />
           </form>
           <div className="flex gap-2">
             <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"><Filter size={18} /></button>
             <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none"
             >
                <option value="All Status">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
             </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Info</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact & Docs</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   {type === 'logistics' ? 'Trips (MTD)' : type === 'garages' ? 'Services (MTD)' : 'Revenue (MTD)'}
                </th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="6">
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                 </tr>
              )}
              {units.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => openDetails(u.id)}>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-black shadow-sm group-hover:bg-white transition-colors">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-primary-600 transition-colors">{u.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Joined: {u.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-700">{u.owner}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{u.email}</span>
                      <div className="flex items-center gap-1 mt-1">
                        {u.has_docs ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md"><ShieldCheck size={10} /> Docs Verified</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md"><AlertCircle size={10} /> Missing Docs</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <MapPin size={14} className="text-slate-300" />
                      {u.location}
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
                    {type === 'logistics' ? '' : 'KES '} {u.revenue}
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openDetails(u.id)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      >
                         <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {units.length === 0 && !loading && (
                 <tr>
                    <td colSpan="6" className="px-8 py-10 text-center text-sm font-bold text-slate-400">
                       No {type} found.
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
               {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(n => (
                 <button 
                    key={n} 
                    onClick={() => setCurrentPage(n)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-primary-600 text-white shadow-primary-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    {n}
                  </button>
               ))}
             </div>
           )}
        </div>
      </div>

      {/* Merchant Detail Modal */}
      {isModalOpen && selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[48px] w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all z-20"
              >
                <Plus size={24} className="rotate-45" />
              </button>

              <div className="p-12">
                 <div className="flex flex-col md:flex-row gap-12">
                    <div className="flex-1 space-y-8">
                       <div className="flex items-center gap-6">
                          <div className={`w-24 h-24 rounded-[32px] bg-${color}-50 text-${color}-600 flex items-center justify-center border border-${color}-100 shadow-sm`}>
                             <Icon size={48} />
                          </div>
                          <div>
                             <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{selectedUnit.name}</h2>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{type}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                  selectedUnit.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                }`}>{selectedUnit.status}</span>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Merchant Control</p>
                             <p className="text-lg font-black text-slate-900">{selectedUnit.owner}</p>
                             <p className="text-sm font-medium text-slate-500">{selectedUnit.email}</p>
                             {selectedUnit.phone && <p className="text-sm font-medium text-slate-500">{selectedUnit.phone}</p>}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform Performance</p>
                             <p className="text-lg font-black text-emerald-600">{selectedUnit.revenue}</p>
                             <p className="text-sm font-medium text-slate-500">Revenue this Month</p>
                          </div>
                       </div>

                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Documents</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             {Object.entries(selectedUnit.documents).map(([key, url]) => {
                                const isPdf = url?.toLowerCase().endsWith('.pdf');
                                return (
                                   <div key={key} className="group relative aspect-video bg-slate-50 rounded-2xl border border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center gap-2">
                                      {url ? (
                                         <>
                                            {isPdf ? (
                                               <div className="w-full h-full flex flex-col items-center justify-center bg-red-50/30 text-red-500 group-hover:scale-110 transition-transform duration-500">
                                                  <FileText size={32} />
                                                  <span className="text-[10px] font-black uppercase mt-2">View PDF</span>
                                               </div>
                                            ) : (
                                               <img 
                                                  src={url} 
                                                  alt={key} 
                                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                  onError={(e) => {
                                                     e.target.onerror = null;
                                                     e.target.src = 'https://placehold.co/400x300/f8fafc/cbd5e1?text=Image+Unavailable';
                                                  }}
                                               />
                                            )}
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                               <a href={url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform">
                                                  <ExternalLink size={20} />
                                               </a>
                                            </div>
                                         </>
                                      ) : (
                                         <>
                                            <AlertCircle size={20} className="text-slate-300" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key.replace('_', ' ')} Missing</span>
                                         </>
                                      )}
                                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter text-slate-500 border border-slate-100">
                                         {key.replace('_', ' ')}
                                      </div>
                                   </div>
                                );
                             })}
                          </div>
                       </div>
                    </div>

                    <div className="w-full md:w-72 space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</p>
                       <button 
                          onClick={() => handleStatusUpdate(selectedUnit.id, 'verified')}
                          disabled={selectedUnit.status === 'verified'}
                          className="w-full bg-emerald-600 text-white p-4 rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                       >
                          <ShieldCheck size={18} /> Approve Merchant
                       </button>
                       <button 
                          onClick={() => handleStatusUpdate(selectedUnit.id, 'suspended')}
                          disabled={selectedUnit.status === 'suspended'}
                          className="w-full bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl text-xs font-black hover:bg-slate-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                       >
                          <AlertCircle size={18} /> Suspend Operations
                       </button>
                       <button 
                          onClick={() => handleStatusUpdate(selectedUnit.id, 'rejected')}
                          className="w-full bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                       >
                          <Plus size={18} className="rotate-45" /> Terminate Contract
                       </button>
                       
                       <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Location & Logistics</p>
                          <div className="space-y-4">
                             <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-slate-400 mt-0.5" />
                                <div>
                                   <p className="text-xs font-bold text-slate-700">{selectedUnit.location}</p>
                                   <p className="text-[10px] text-slate-400 font-medium">Headquarters</p>
                                </div>
                             </div>
                             <div className="flex items-start gap-3">
                                <TrendingUp size={16} className="text-slate-400 mt-0.5" />
                                <div>
                                   <p className="text-xs font-bold text-slate-700">{selectedUnit.joinDate}</p>
                                   <p className="text-[10px] text-slate-400 font-medium">Onboarding Date</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BusinessUnitList;
