import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ExternalLink,
  Package,
  Truck,
  CheckCircle2
} from 'lucide-react';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const API_BASE = 'http://localhost:8003/api/v1';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/orders`, {
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

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterStatus, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/admin/orders/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(`Failed to update status for order ${id}:`, err);
    }
  };

  const statusColors = {
      'pending': 'bg-slate-50 text-slate-600',
      'preparing': 'bg-blue-50 text-blue-600',
      'ready': 'bg-indigo-50 text-indigo-600',
      'dispatched': 'bg-purple-50 text-purple-600',
      'in_transit': 'bg-orange-50 text-orange-600',
      'delivered': 'bg-emerald-50 text-emerald-600',
      'completed': 'bg-emerald-50 text-emerald-600',
      'cancelled': 'bg-red-50 text-red-600'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <Package size={24} />
             </div>
             Order Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Monitor all marketplace orders, track deliveries, and manage issues centrally.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.length > 0 ? stats.map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center`}>
                   {i === 0 ? <ShoppingBag size={24} /> : i === 1 ? <Truck size={24} /> : <CheckCircle2 size={24} />}
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
               placeholder="Search Order ID, Customer, or Shop..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
             />
           </div>
           <div className="flex gap-2">
             <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"><Filter size={18} /></button>
             <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 outline-none"
             >
                <option value="All Status">All Status</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready for Pickup</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
             </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID & Date</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer & Value</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Shop & Logistics</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
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
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-black text-slate-900 leading-none mb-1">#{o.order_number}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{o.date}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-700">{o.customer}</span>
                      <span className="text-sm font-black text-slate-900 tracking-tight">KES {numberWithCommas(o.amount)} <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">{o.payment_status}</span></span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-700">{o.store}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{o.delivery_partner}</span>
                     </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusColors[o.delivery_status] || 'bg-slate-50 text-slate-600'}`}>
                      {o.delivery_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                      <select 
                        value={o.delivery_status} 
                        onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                        className="opacity-0 group-hover:opacity-100 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 outline-none transition-all cursor-pointer hover:border-primary-300 focus:border-primary-500"
                      >
                         <option value="pending">Pending</option>
                         <option value="preparing">Preparing</option>
                         <option value="ready">Ready</option>
                         <option value="in_transit">In Transit</option>
                         <option value="delivered">Delivered</option>
                         <option value="cancelled">Cancel Order</option>
                      </select>
                      <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><ExternalLink size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-sm font-bold text-slate-400">
                       No orders found matching criteria.
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

// Helper
function numberWithCommas(x) {
    if (!x) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default Orders;
