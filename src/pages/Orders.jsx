import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ExternalLink,
  Package,
  Truck,
  CheckCircle2,
  X,
  AlertTriangle,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  Activity,
  User,
  Store as StoreIcon
} from 'lucide-react';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Governance States
  const [isAdminActionOpen, setIsAdminActionOpen] = useState(false);
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [actionType, setActionType] = useState(null); // 'preparing', 'dispatched', 'cancelled'
  const [targetId, setTargetId] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const showToast = (message, type = 'blue') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/portal/orders`, {
        params: { search: searchTerm, status: filterStatus, page: currentPage, per_page: 8 }
      });
      if (res.data.success) {
        setOrders(res.data.data);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(`Failed to fetch orders:`, err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/portal/orders/templates`);
      if (res.data.success) {
        setAdminTemplates(res.data.data);
      }
    } catch (err) {
      console.error("Templates fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTemplates();
  }, [searchTerm, filterStatus, currentPage]);

  const handleGovernanceRequest = (id, action) => {
    setTargetId(id);
    setActionType(action);
    setIsAdminActionOpen(true);
  };

  const executeAdminAction = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_BASE}/portal/orders/${targetId}/status`, { 
        status: actionType,
        template_id: selectedTemplateId
      });
      if (res.data.success) {
        setIsAdminActionOpen(false);
        showToast('Operational state transition confirmed', 'emerald');
        fetchData();
        if (selectedOrder && selectedOrder.id === targetId) {
            setIsModalOpen(false);
        }
      }
    } catch (err) {
      showToast('Governance protocol failed', 'rose');
    } finally {
      setLoading(false);
      setSelectedTemplateId('');
    }
  };

  const statusColors = {
      'pending': 'bg-slate-50 text-slate-500 border-slate-100',
      'preparing': 'bg-blue-50 text-blue-600 border-blue-100',
      'ready': 'bg-indigo-50 text-indigo-600 border-indigo-100',
      'dispatched': 'bg-purple-50 text-purple-600 border-purple-100',
      'in_transit': 'bg-orange-50 text-orange-600 border-orange-100',
      'delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'cancelled': 'bg-red-50 text-red-600 border-red-100'
  };

  const openDetails = (order) => {
     setSelectedOrder(order);
     setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen pb-20">
      {/* Toast System */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${toast.type}-500 shadow-xl shadow-${toast.type}-500/20`}>
              <Zap size={16} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600 shadow-xl shadow-orange-500/10 border border-orange-100">
                <Package size={24} />
             </div>
             Fulfillment Hub
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60 italic">Marketplace Operations & Logistics Management</p>
        </div>
        <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
           {['All Status', 'Pending', 'In Transit', 'Delivered'].map(s => (
             <button 
                key={s} 
                onClick={() => setFilterStatus(s === 'All Status' ? 'All Status' : s.toLowerCase().replace(' ', '_'))}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === (s === 'All Status' ? 'All Status' : s.toLowerCase().replace(' ', '_')) ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
               {s}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-primary-100 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                   {i === 0 ? <ShoppingBag size={28} /> : i === 1 ? <Truck size={28} /> : <CheckCircle2 size={28} />}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{s.l}</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tight italic">{s.v}</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-xl uppercase italic">
                {s.c}
              </div>
           </div>
         )) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-3xl"></div>)}
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="relative group flex-1 max-w-md">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
             <input 
               placeholder="Index Order, Client or Hub ID..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-4 text-xs font-black placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-orange-500/5 transition-all uppercase tracking-widest italic"
             />
           </div>
           <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 shadow-sm">
                 <ShieldCheck size={18} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Compliant Fleet</p>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 uppercase italic opacity-70">
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Order Manifest</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Client & Yield</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Hub & Fleet</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400">Industrial Status</th>
                <th className="px-10 py-5 text-[10px] font-black tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                 <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto shadow-xl"></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-6 italic animate-pulse">Synchronizing Fulfillment Ledger...</p>
                    </td>
                 </tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => openDetails(o)}>
                       <div className={`w-11 h-11 rounded-xl bg-white border-2 flex items-center justify-center text-slate-900 text-[11px] font-black shadow-sm italic transition-colors ${o.ai_risk.level === 'High' ? 'border-rose-200 text-rose-600 bg-rose-50' : 'border-slate-100 group-hover:border-orange-100'}`}>
                          {o.ai_risk.level === 'High' ? '!' : '#'}
                       </div>
                       <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                             <span className="text-[11px] font-black text-slate-900 italic tracking-tighter leading-none group-hover:text-orange-600 transition-colors uppercase">{o.order_number}</span>
                             {o.ai_risk.score > 70 && (
                                <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[7px] font-black uppercase rounded border border-rose-100 animate-pulse">Priority</span>
                             )}
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mt-1">{o.date}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-1.5">
                       <span className="text-[11px] font-black text-slate-700 uppercase italic opacity-80 leading-none">{o.customer}</span>
                       <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 tracking-tight italic">KES {o.amount.toLocaleString()}</span>
                          <span className={`text-[8px] font-black uppercase tracking-widest ${o.payment_status === 'paid' ? 'text-emerald-500' : 'text-slate-300'}`}>{o.payment_status}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                     <div className="flex flex-col gap-1.5">
                       <span className="text-[11px] font-black text-slate-700 uppercase italic leading-none">{o.store}</span>
                       <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 italic">
                          <Truck size={12} className="text-primary-400" /> {o.delivery_partner}
                       </span>
                     </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusColors[o.delivery_status] || 'bg-slate-50 text-slate-500'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${o.delivery_status.includes('deliver') || o.delivery_status === 'completed' ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse`} />
                       {o.delivery_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                       {o.delivery_status === 'pending' ? (
                         <div className="flex gap-2">
                            <button 
                              onClick={() => handleGovernanceRequest(o.id, 'preparing')}
                              className="px-4 py-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all italic"
                            >
                               Accept
                            </button>
                            <button 
                              onClick={() => handleGovernanceRequest(o.id, 'cancelled')}
                              className="px-4 py-2 bg-white border border-slate-200 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all italic"
                            >
                               Reject
                            </button>
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <select 
                              value={o.delivery_status} 
                              onChange={(e) => handleGovernanceRequest(o.id, e.target.value)}
                              className="bg-white border-2 border-slate-50 rounded-xl px-2 py-1.5 text-[10px] font-black text-slate-500 outline-none transition-all cursor-pointer hover:border-orange-100 focus:border-orange-500 uppercase italic shadow-sm"
                            >
                               <option value="pending">Pending</option>
                               <option value="preparing">Preparing</option>
                               <option value="packed">Packed</option>
                               <option value="dispatched">Dispatched</option>
                               <option value="in_transit">In Transit</option>
                               <option value="delivered">Delivered</option>
                               <option value="cancelled">Cancel Order</option>
                            </select>
                            <button onClick={() => openDetails(o)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-xl shadow-slate-200/50">
                               <ExternalLink size={18} />
                            </button>
                         </div>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center text-slate-100 shadow-inner">
                             <Package size={48} />
                          </div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic opacity-40">Orders Manifest Blank: No Synchronized Deliveries</p>
                       </div>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */ }
        <div className="p-8 bg-slate-50/20 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">
             {pagination ? `${pagination.from || 0}-${pagination.to || 0} of ${pagination.total} Logistical Nodes Indexed` : 'Synchronizing Metadata...'}
           </p>
           {pagination && pagination.last_page > 1 && (
             <div className="flex gap-2">
               {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const n = startPage + i;
                  if (n > pagination.last_page) return null;
                  return (
                    <button 
                        key={n} 
                        onClick={() => setCurrentPage(n)}
                        className={`w-10 h-10 rounded-xl text-[10px] font-black shadow-xl transition-all ${n === currentPage ? 'bg-orange-600 text-white shadow-orange-900/40' : 'bg-white text-slate-600 border-2 border-slate-50 hover:bg-slate-50 hover:border-slate-100'}`}
                      >
                        {n}
                      </button>
                  );
               })}
             </div>
           )}
        </div>
      </div>

      {/* Governance Drawer / Admin Action Sidebar */}
      <AnimatePresence>
        {isAdminActionOpen && (
           <div className="fixed inset-0 z-[200] flex justify-end bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto flex flex-col"
              >
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm shadow-slate-100/30">
                    <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-[24px] shadow-xl ${actionType === 'dispatched' ? 'bg-orange-50 text-orange-600 shadow-orange-500/10' : 'bg-rose-50 text-rose-600 shadow-rose-500/10'}`}>
                          <Truck size={28} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Logistics Governance</p>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize italic">{actionType.replace('_', ' ')} AUTHORIZATION</h2>
                       </div>
                    </div>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 transition-all">
                       <X size={28} />
                    </button>
                 </div>

                 <div className="p-10 space-y-10 flex-1">
                    <div className="p-8 bg-slate-50 rounded-[44px] border border-slate-100 space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm border border-slate-100">
                             <Mail size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic leading-none mb-1">Logistics Communication</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60 italic leading-none">Select Operational Dispatch Protocol</p>
                          </div>
                       </div>
                       <select 
                         value={selectedTemplateId}
                         onChange={(e) => setSelectedTemplateId(e.target.value)}
                         className="w-full bg-white border-2 border-slate-100 rounded-[20px] px-6 py-4 text-[11px] font-black text-slate-600 outline-none focus:ring-4 focus:ring-orange-500/5 transition-all shadow-xl shadow-slate-200/50 uppercase tracking-[0.1em] italic"
                       >
                          <option value="">Awaiting Logistical Protocol...</option>
                          {adminTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                       </select>
                       
                       {selectedTemplateId && adminTemplates.find(t => t.id === Number(selectedTemplateId)) && (
                         <div className="mt-6 p-6 bg-white rounded-[28px] border border-orange-50 animate-in fade-in zoom-in-95 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                               <ShieldCheck size={14} className="text-orange-500" />
                               <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest italic leading-none">Operational Draft Preview</p>
                            </div>
                            <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed italic font-medium opacity-80">{adminTemplates.find(t => t.id === Number(selectedTemplateId)).body}</p>
                         </div>
                       )}
                    </div>

                    <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-start gap-5">
                       <Zap size={24} className="text-blue-600 shrink-0 mt-1 shadow-sm" />
                       <div>
                          <p className="text-[12px] font-black text-blue-900 uppercase tracking-widest mb-1.5 italic leading-none">Fulfillment Compliance Module</p>
                          <p className="text-[10px] text-blue-700 font-black leading-relaxed tracking-tight uppercase opacity-50 italic">Authorizing this state transition will trigger real-time metadata updates for the client and dispatch an encrypted fulfillment notice. This action is recorded in the platform integrity mesh.</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 border-t border-slate-50 bg-white sticky bottom-0">
                    <button 
                      onClick={executeAdminAction}
                      disabled={!selectedTemplateId || loading}
                      className={`w-full py-5 rounded-[24px] text-xs font-black shadow-2xl transition-all flex items-center justify-center gap-4 ${actionType === 'dispatched' ? 'bg-orange-600 text-white shadow-orange-500/30' : 'bg-slate-900 text-white shadow-slate-900/30'} disabled:opacity-20 disabled:grayscale hover:scale-[1.02] active:scale-95 uppercase tracking-widest italic`}
                    >
                       {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={20} />}
                       {loading ? 'Dispatching Logistics Intel...' : 'Authorize State Transition'}
                    </button>
                    <button onClick={() => setIsAdminActionOpen(false)} className="w-full mt-6 py-4 rounded-xl text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-[0.2em] italic">
                       Discard Logistical Request
                    </button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* AI Risk Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500 px-8">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="bg-white rounded-[60px] w-full max-w-5xl overflow-hidden shadow-2xl relative flex flex-col border border-white"
             >
                <div className="p-10 pb-6 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[32px] bg-orange-50 text-orange-600 flex items-center justify-center border-2 border-white shadow-xl shadow-orange-500/10">
                         <Package size={40} />
                      </div>
                      <div>
                         <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2 italic uppercase">{selectedOrder.order_number}</h2>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">Industrial Cycle: {selectedOrder.date}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm ${statusColors[selectedOrder.delivery_status]}`}>{selectedOrder.delivery_status}</span>
                         </div>
                      </div>
                   </div>
                   <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-14 h-14 bg-slate-50 hover:bg-slate-100 rounded-[24px] text-slate-400 flex items-center justify-center transition-all shadow-inner active:scale-95"
                  >
                    <X size={32} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-10 pb-10 max-h-[70vh] custom-scrollbar">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Customer Node */}
                      <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col justify-between">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Client Node</p>
                         <div>
                            <p className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{selectedOrder.customer}</p>
                            <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-2"><User size={14} className="text-primary-400" /> Account Verified</p>
                            <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2"><MapPin size={14} className="text-primary-400" /> Strategic Hub Mombasa</p>
                         </div>
                      </div>

                      {/* AI Risk Score (Industrial) */}
                      <div className={`p-8 rounded-[40px] border flex flex-col justify-between group transition-all ${
                         selectedOrder.ai_risk.level === 'High' ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50/50 border-emerald-100'
                      }`}>
                         <p className={`text-[10px] font-black uppercase tracking-widest mb-6 italic ${
                            selectedOrder.ai_risk.level === 'High' ? 'text-rose-600' : 'text-emerald-600'
                         }`}>AI Fraud Matrix</p>
                         <div>
                            <div className="flex items-end gap-2 mb-1">
                               <p className={`text-4xl font-black italic tracking-tighter ${
                                  selectedOrder.ai_risk.level === 'High' ? 'text-rose-600' : 'text-emerald-600'
                               }`}>{selectedOrder.ai_risk.score}</p>
                               <p className="text-[10px] font-black uppercase mb-1.5 opacity-40">Risk Pts</p>
                            </div>
                            <p className={`text-[10px] font-black uppercase italic tracking-widest ${
                               selectedOrder.ai_risk.level === 'High' ? 'text-rose-500/60' : 'text-emerald-500/60'
                            }`}>{selectedOrder.ai_risk.level} Severity Protocol</p>
                         </div>
                         {selectedOrder.ai_risk.flag && (
                            <div className="mt-4 flex items-center gap-1.5 text-[8px] font-black uppercase bg-white/50 px-2 py-1 rounded-lg border border-red-100 text-rose-600 animate-pulse">
                               <AlertTriangle size={10} /> {selectedOrder.ai_risk.flag}
                            </div>
                         )}
                      </div>

                      {/* Logistics Node */}
                      <div className="p-8 bg-white rounded-[40px] border border-slate-100 flex flex-col justify-between shadow-xl shadow-slate-200/50">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Logistics Hub</p>
                         <div className="space-y-4">
                            <div className="flex items-start gap-4">
                               <StoreIcon size={18} className="text-primary-500 shrink-0 mt-0.5" />
                               <div>
                                  <p className="text-sm font-black text-slate-900 italic leading-none">{selectedOrder.store}</p>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Origin Node</p>
                               </div>
                            </div>
                            <div className="flex items-start gap-4">
                               <Truck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                               <div>
                                  <p className="text-sm font-black text-slate-900 italic leading-none">{selectedOrder.delivery_partner}</p>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Industrial Carrier</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="mt-10 space-y-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                         <Activity size={14} className="text-orange-500" /> Operational Integrity Mesh
                      </p>
                      <div className="bg-slate-50 border border-slate-100 rounded-[32px] overflow-hidden">
                         <div className="grid grid-cols-4 border-b border-slate-100 bg-white/50">
                            {['Cycle Hash', 'Timestamp', 'Validation', 'Status'].map(h => (
                               <div key={h} className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 italic">{h}</div>
                            ))}
                         </div>
                         <div className="divide-y divide-slate-100">
                            {[1, 2, 3].map(i => (
                               <div key={i} className="grid grid-cols-4 px-8 py-4 items-center">
                                  <span className="text-[10px] font-mono text-slate-400 italic">#FULF-{9920 + i}</span>
                                  <span className="text-[10px] font-black text-slate-600 italic">2026-03-2{9-i} 14:2{i}</span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 w-fit">CRC Valid</span>
                                  <span className="text-[10px] font-black text-slate-600 uppercase italic opacity-60">Ready</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-10 bg-slate-50/50 border-t border-slate-50 flex gap-4">
                    <button 
                        onClick={() => handleGovernanceRequest(selectedOrder.id, 'dispatched')}
                        disabled={selectedOrder.delivery_status === 'dispatched' || selectedOrder.delivery_status === 'delivered'}
                        className="flex-[2] bg-orange-600 text-white py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-20 disabled:grayscale italic"
                    >
                        <Truck size={20} /> Authorize Fleet Dispatch
                    </button>
                    <button 
                        onClick={() => handleGovernanceRequest(selectedOrder.id, 'cancelled')}
                        disabled={selectedOrder.delivery_status === 'cancelled'}
                        className="flex-1 bg-white border-2 border-slate-100 text-slate-700 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 shadow-xl shadow-slate-200/50 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-20 italic"
                    >
                        <X size={20} /> Terminate Order
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
