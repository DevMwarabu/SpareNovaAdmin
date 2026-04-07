import { API_BASE } from '../api/config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Users as UsersIcon, 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  Mail, 
  CheckCircle2, 
  XCircle,
  Clock,
  Filter,
  Activity,
  ArrowRight,
  Store,
  Star,
  DollarSign,
  X,
  AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All Roles');
  const [filterStatus, setFilterStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  
  // Drawer & Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [suspendModalUser, setSuspendModalUser] = useState(null);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'store_staff' });
  const [isAdding, setIsAdding] = useState(false);

  

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE}/portal/users`, {
        params: { search: searchTerm, role: filterRole, status: filterStatus, page: currentPage, per_page: 8 },
        headers
      });
      if (res.data.success) {
        setUsers(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch users:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      setIsAdding(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await axios.post(`${API_BASE}/portal/users/staff`, addForm, { headers });
      if (res.data.success) {
        setIsAddModalOpen(false);
        setAddForm({ name: '', email: '', password: '', role: 'store_staff' });
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Provisioning failed');
    } finally {
      setIsAdding(false);
    }
  };

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // ACCESS CONTROL: Institutional Intelligence Scoping
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      // Allow Admin, Store Owner, Garage Owner
      if (!['admin', 'store_owner', 'shop', 'garage_owner', 'garage'].includes(user.role)) {
        navigate(`/${JSON.parse(localStorage.getItem('user') || '{}').role?.toLowerCase() || 'admin'}`);
      }
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterRole, filterStatus, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await axios.put(`${API_BASE}/portal/users/${id}/status`, { status: newStatus }, { headers });
      if (res.data.success) {
        fetchData();
      } else {
        alert(res.data.message || 'Failed to update user.');
      }
    } catch (err) {
      alert(err.response?.data?.message || `Failed to update status for user ${id}`);
    }
  };

  const isInstitutional = currentUser && currentUser.role !== 'admin';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-sm">
                <UsersIcon size={24} />
             </div>
             {isInstitutional ? 'Institutional Network' : 'Global User Management'}
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">
             {isInstitutional ? 'Manage technical staff and verified customer principal nodes.' : 'Configure global user roles, permissions and ecosystem access.'}
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black shadow-2xl shadow-slate-900/20 hover:bg-slate-800 flex items-center gap-3 transition-all active:scale-95 uppercase tracking-widest italic"
        >
           <UserPlus size={18} /> {isInstitutional ? 'Add Institutional Staff' : 'Generate Platform Node'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center`}>
                   {i === 0 ? <UsersIcon size={24} /> : i === 1 ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
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
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
             <input 
               placeholder="Search by name or email..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
             />
           </div>
           <div className="relative">
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className={`p-3 rounded-xl transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest ${isFilterOpen || filterRole !== 'All Roles' || filterStatus !== '' ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
             >
               <Filter size={18} /> Filter
             </button>

             <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl shadow-primary-500/10 border border-slate-100 p-6 z-50 text-left"
                  >
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Advanced Telemetry Filter</p>
                     
                     <div className="space-y-5">
                       <div>
                         <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 italic">Account Hierarchy</label>
                         <select 
                           value={filterRole}
                           onChange={(e) => setFilterRole(e.target.value)}
                           className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20 italic uppercase"
                         >
                            <option>All Roles</option>
                            <option>Admins</option>
                            <option>Store Owners</option>
                            <option>Garage Owners</option>
                            <option>Delivery Partners</option>
                            <option>Customers</option>
                         </select>
                       </div>

                       <div>
                         <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 italic">Operation Protocol</label>
                         <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20 italic uppercase"
                         >
                            <option value="">All States</option>
                            <option value="Active">Active / Verified</option>
                            <option value="Pending">Pending Assignment</option>
                            <option value="Suspended">Suspended</option>
                         </select>
                       </div>
                       
                       <div className="pt-2 flex items-center justify-between border-t border-slate-50 mt-2">
                          <button 
                            onClick={() => { setFilterRole('All Roles'); setFilterStatus(''); }}
                            className="text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest italic"
                          >
                             Reset Params
                          </button>
                          <button 
                             onClick={() => setIsFilterOpen(false)}
                             className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-sm active:scale-95"
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
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Security Role</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Account status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Join Date</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
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
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => { setSelectedUser(u); setIsDrawerOpen(true); }}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 font-black shadow-sm border border-slate-200">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1">{u.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 italic lowercase tracking-tight">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                      <Shield size={14} className="text-primary-500" />
                      {u.role}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {u.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500 tracking-tight font-serif">
                    {u.joinDate}
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={u.status.toLowerCase()} 
                        onChange={(e) => {
                          if (e.target.value === 'suspended' && u.status.toLowerCase() !== 'suspended') {
                             setSuspendModalUser(u);
                          } else {
                             handleStatusUpdate(u.id, e.target.value);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 outline-none transition-all cursor-pointer hover:border-primary-300 focus:border-primary-500"
                      >
                         <option value="active">Active</option>
                         <option value="suspended">Suspend User</option>
                      </select>
                      <button 
                        onClick={() => window.location.href = `mailto:${u.email}`}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      >
                        <Mail size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-sm font-bold text-slate-400">
                       No users found matching criteria.
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

      <AnimatePresence>
        {isDrawerOpen && selectedUser && (
           <>
             {/* Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsDrawerOpen(false)}
               className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
             />

             {/* Drawer */}
             <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100"
             >
               <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 font-black shadow-sm border border-slate-200 text-xl">
                        {selectedUser.name.charAt(0)}
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">{selectedUser.name}</h2>
                        <p className="text-xs font-bold text-slate-400 italic lowercase tracking-tight mt-1">{selectedUser.email}</p>
                     </div>
                  </div>
                  <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"><X size={20} /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {/* Institutional Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <div className="flex items-center gap-2 mb-2 text-emerald-600">
                           <DollarSign size={16} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Revenue Generated</span>
                        </div>
                        <p className="text-lg font-black text-emerald-900 tracking-tight">{selectedUser.revenue || 'KES 0'}</p>
                     </div>
                     <div className="p-5 bg-purple-50 rounded-3xl border border-purple-100">
                        <div className="flex items-center gap-2 mb-2 text-purple-600">
                           <Shield size={16} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Loyalty Score</span>
                        </div>
                        <div className="flex items-end gap-2">
                           <p className="text-lg font-black text-purple-900 tracking-tight leading-none">{selectedUser.ai_segment?.loyalty_score || 0}</p>
                           <span className="text-[10px] font-bold text-purple-600/60 pb-0.5">/ 100</span>
                        </div>
                     </div>
                     <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 col-span-2">
                        <div className="flex items-center gap-2 mb-2 text-blue-600">
                           <Store size={16} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Institutional Linkage</span>
                        </div>
                        <p className="text-sm font-black text-blue-900 uppercase tracking-tight italic">{selectedUser.shop_link}</p>
                     </div>
                  </div>

                  {/* Activity Graph */}
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity size={16} className="text-slate-400" /> Platform Telemetry (6M)</h3>
                    <div className="h-40 bg-slate-50 rounded-3xl p-4 border border-slate-100">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={selectedUser.activity_graph || []}>
                           <defs>
                             <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                               <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                           <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                              itemStyle={{ color: '#0f172a', fontWeight: 900, fontSize: '12px' }}
                            />
                           <Area type="monotone" dataKey="activity" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                         </AreaChart>
                       </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Reviews matrix */}
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Star size={16} className="text-slate-400" /> Immutable Activity Ledger</h3>
                    <div className="space-y-3">
                       {selectedUser.activities && selectedUser.activities.length > 0 ? (
                          selectedUser.activities.map((act) => (
                             <div key={act.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="flex items-center gap-1 text-orange-400">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                         <Star key={i} size={12} fill={i < act.rating ? "currentColor" : "none"} />
                                      ))}
                                   </div>
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{act.date}</span>
                                </div>
                                <p className="text-xs font-black text-slate-900 italic tracking-tight mb-1">{act.title}</p>
                                <p className="text-[11px] font-bold text-slate-500 line-clamp-2 leading-relaxed">{act.body}</p>
                             </div>
                          ))
                       ) : (
                          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                             <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">No traceable activities</p>
                          </div>
                       )}
                    </div>
                  </div>
               </div>
             </motion.div>
           </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddModalOpen && (
           <>
             {/* Modal Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
             >
               {/* Modal Card */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                 className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl relative overflow-hidden border border-white"
               >
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-400"></div>
                 <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 shadow-inner">
                       <UserPlus size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Provision Staff Node</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Register new institutional technical asset</p>
                    </div>
                 </div>
                 
                 <form onSubmit={handleAddStaff} className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 italic">Full Name (Asset Identity)</label>
                       <input 
                          required
                          value={addForm.name}
                          onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 placeholder:text-slate-300 focus:border-purple-500 outline-none transition-all"
                          placeholder="e.g. John Logistics"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 italic">Communication Hub (Email)</label>
                       <input 
                          required
                          type="email"
                          value={addForm.email}
                          onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 placeholder:text-slate-300 focus:border-purple-500 outline-none transition-all"
                          placeholder="staff@sparenova.com"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 italic">Hierarchy Role</label>
                          <select 
                             value={addForm.role}
                             onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                             className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 focus:border-purple-500 outline-none transition-all uppercase italic"
                          >
                             <option value="store_staff">Store Staff</option>
                             <option value="mechanic">Mechanic</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 italic">Access Key (Password)</label>
                          <input 
                             required
                             type="password"
                             value={addForm.password}
                             onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                             className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-900 focus:border-purple-500 outline-none transition-all"
                             placeholder="••••••••"
                          />
                       </div>
                    </div>
                    
                    <div className="pt-4 flex items-center gap-4">
                       <button 
                          type="button"
                          onClick={() => setIsAddModalOpen(false)}
                          className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 italic"
                       >
                          Abort Protocol
                       </button>
                       <button 
                          type="submit"
                          disabled={isAdding}
                          className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3 italic"
                       >
                          {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                          {isAdding ? 'Provisioning...' : 'Authorize Node Generation'}
                       </button>
                    </div>
                 </form>
               </motion.div>
             </motion.div>
           </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {suspendModalUser && (
           <>
             {/* Modal Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
             >
               {/* Modal Card */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                 className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative overflow-hidden"
               >
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-rose-400"></div>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
                       <AlertTriangle size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight">Confirm Suspension</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{suspendModalUser.name}</p>
                    </div>
                 </div>
                 
                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-8">
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                       You are about to suspend this individual's institutional access. They will instantly be locked out of the operational platform and a <strong className="text-slate-900 border-b border-red-200">branded warning dispatch</strong> will be routed to their email.
                    </p>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <button 
                       onClick={() => setSuspendModalUser(null)}
                       className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                    >
                       Cancel
                    </button>
                    <button 
                       onClick={() => {
                          handleStatusUpdate(suspendModalUser.id, 'suspended');
                          setSuspendModalUser(null);
                       }}
                       className="flex-1 py-3.5 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 active:scale-95"
                    >
                       Confirm Suspend
                    </button>
                 </div>
               </motion.div>
             </motion.div>
           </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;

