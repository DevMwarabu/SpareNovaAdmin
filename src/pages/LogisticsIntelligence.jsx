import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Truck, Search, Filter, Plus, Download, RefreshCw,
  MapPin, Navigation, Clock, AlertCircle, CheckCircle2,
  ShieldCheck, Zap, Activity, Package, X, FileText,
  Image as ImageIcon, ChevronRight, Eye, UserCheck,
  Ban, RotateCcw, Loader2, UserX, TrendingUp
} from 'lucide-react';

const API_BASE = 'http://localhost:8003/api/v1';

// ── Status Badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = String(status || '').toLowerCase();
  const cfg = s === 'verified'
    ? { cls: 'border-emerald-500/20 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', label: 'Verified' }
    : s === 'suspended'
    ? { cls: 'border-red-500/20 bg-red-50 text-red-700', dot: 'bg-red-500', label: 'Suspended' }
    : s === 'rejected'
    ? { cls: 'border-rose-500/20 bg-rose-50 text-rose-700', dot: 'bg-rose-400', label: 'Rejected' }
    : { cls: 'border-amber-500/20 bg-amber-50 text-amber-700', dot: 'bg-amber-400', label: 'Pending' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-tight ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const LogisticsIntelligence = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/portal/logistics`, {
        params: { search, status: filterStatus, page: currentPage, per_page: 10 }
      });
      if (res.data.success) {
        setPartners(res.data.data || []);
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch logistics data:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, currentPage]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setCurrentPage(1); }, [search, filterStatus]);

  const openDetail = async (partner) => {
    setSelectedPartner(partner);
    setDetailData(null);
    setDetailLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/portal/logistics/${partner.id}`);
      if (res.data.success) setDetailData(res.data.data);
    } catch (e) {
      setDetailData(partner); // fallback
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setActionLoading(status);
    try {
      await axios.put(`${API_BASE}/portal/logistics/${id}/status`, { status });
      setSelectedPartner(null);
      fetchData();
    } catch (e) {
      alert('Status update failed: ' + (e.response?.data?.message || 'Try again.'));
    } finally {
      setActionLoading(null);
    }
  };

  const exportCSV = () => {
    if (!partners.length) return;
    const header = ['ID', 'Name', 'Email', 'Status', 'Joined', 'Revenue'];
    const rows = partners.map(p => [p.id, p.name, p.email || '', p.status || '', p.joinDate || '', p.revenue || '']);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'logistics_partners.csv';
    a.click();
  };

  // ── Detail Modal ─────────────────────────────────────────────────────────
  const DocumentViewer = ({ url, label }) => {
    if (!url) return null;
    const isPdf = url.toLowerCase().includes('.pdf');
    return (
      <a href={url} target="_blank" rel="noreferrer"
        className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 hover:border-primary-600/30 hover:shadow-lg transition-all">
        {isPdf ? (
          <div className="h-28 flex flex-col items-center justify-center gap-2 text-slate-500 group-hover:text-primary-600 transition-colors">
            <FileText size={32} />
            <span className="text-[9px] font-black uppercase tracking-widest">View PDF</span>
          </div>
        ) : (
          <img
            src={url}
            alt={label}
            className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        )}
        {!isPdf && (
          <div className="h-28 hidden flex-col items-center justify-center gap-2 text-slate-400">
            <ImageIcon size={28} />
            <span className="text-[9px]">No Image</span>
          </div>
        )}
        <div className="p-3 border-t border-slate-100">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        </div>
      </a>
    );
  };

  const statIcons = [Truck, AlertCircle, CheckCircle2];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
              <Truck size={24} />
            </div>
            Logistics Network
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage delivery partners, fleet tracking, and route intelligence.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={exportCSV} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
            <Download size={14} /> Export
          </button>
          <button onClick={() => navigate('/portal/register-partner?role=delivery')}
            className="bg-orange-600 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-orange-500/30 hover:bg-orange-700 flex items-center gap-2 transition-all active:scale-95">
            <Plus size={14} /> Register New
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.length > 0 ? stats.map((s, i) => {
          const Icon = statIcons[i] || Truck;
          return (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${s.col}-50 text-${s.col}-600 flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{s.v}</p>
                </div>
              </div>
              <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.col === 'red' ? 'bg-red-50 text-red-500' : s.col === 'orange' ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-slate-400'}`}>
                {s.c}
              </div>
            </div>
          );
        }) : Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-3xl" />)}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        {/* toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 relative group max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchData()}
              placeholder="Search partners…"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3 outline-none focus:border-primary-600 text-sm font-bold text-slate-900 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 outline-none">
              <option>All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <button onClick={fetchData} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all">
              <RefreshCw size={16} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                {['Partner & Status', 'Contact', 'Location', 'Revenue', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && (
                <tr><td colSpan={6}>
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td></tr>
              )}
              {partners.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => openDetail(p)}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs font-black flex items-center justify-center uppercase shadow-sm">
                        {String(p.name || 'P').substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{p.name}</p>
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-600">{p.email || '—'}</p>
                    <p className="text-[10px] font-bold text-slate-400">{p.phone || '—'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <MapPin size={12} className="text-slate-300" /> {p.location || 'Kenya'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={12} className="text-emerald-500" />
                      <span className="text-xs font-black text-slate-900">{p.revenue || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-500">{p.joinDate || '—'}</span>
                  </td>
                  <td className="px-6 py-5">
                    <button onClick={e => { e.stopPropagation(); openDetail(p); }}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-black text-primary-600 hover:text-primary-700 transition-all">
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && !partners.length && (
                <tr><td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Truck size={48} />
                    <p className="text-sm font-bold text-slate-400">No logistics partners found.</p>
                    <button onClick={() => navigate('/portal/register-partner?role=delivery')}
                      className="opacity-100 mt-2 px-6 py-3 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-black transition-all">
                      Onboard First Partner
                    </button>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {pagination ? `Showing ${pagination.from || 0}–${pagination.to || 0} of ${pagination.total}` : '—'}
          </p>
          {pagination && pagination.last_page > 1 && (
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                const n = Math.max(1, currentPage - 2) + i;
                if (n > pagination.last_page) return null;
                return (
                  <button key={n} onClick={() => setCurrentPage(n)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black shadow-sm transition-all ${n === currentPage ? 'bg-orange-600 text-white shadow-orange-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                    {n}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedPartner && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPartner(null)}
          >
            <motion.div
              key="modal-panel"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* modal header */}
              <div className="p-8 border-b border-slate-50 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white text-base font-black flex items-center justify-center uppercase shadow-xl">
                    {String(selectedPartner.name || 'P').substring(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{selectedPartner.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={selectedPartner.status} />
                      {selectedPartner.has_docs && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          <ShieldCheck size={10} /> Docs Uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedPartner(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* modal body */}
              <div className="overflow-y-auto p-8 space-y-8">
                {detailLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-orange-500" size={32} />
                  </div>
                ) : (
                  <>
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Email', value: (detailData || selectedPartner).email || '—' },
                        { label: 'Phone', value: (detailData || selectedPartner).phone || '—' },
                        { label: 'Location', value: (detailData || selectedPartner).location || 'Kenya' },
                        { label: 'Joined', value: (detailData || selectedPartner).joinDate || '—' },
                        { label: 'MTD Revenue', value: (detailData || selectedPartner).revenue || '—' },
                        { label: 'Fleet ID', value: (detailData || selectedPartner).id },
                      ].map(item => (
                        <div key={item.label} className="bg-slate-50 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                          <p className="text-sm font-black text-slate-900 break-all">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Documents */}
                    {detailData?.documents && Object.values(detailData.documents).some(Boolean) && (
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Documents</p>
                        <div className="grid grid-cols-3 gap-3">
                          <DocumentViewer url={detailData.documents.id_front} label="ID Front" />
                          <DocumentViewer url={detailData.documents.id_back} label="ID Back" />
                          <DocumentViewer url={detailData.documents.license} label="License" />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Partner Actions</p>
                      <div className="flex flex-wrap gap-3">
                        <button onClick={() => updateStatus(selectedPartner.id, 'verified')}
                          disabled={!!actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-black text-xs rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60">
                          {actionLoading === 'verified' ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />} Approve
                        </button>
                        <button onClick={() => updateStatus(selectedPartner.id, 'suspended')}
                          disabled={!!actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 text-white font-black text-xs rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-60">
                          {actionLoading === 'suspended' ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />} Suspend
                        </button>
                        <button onClick={() => updateStatus(selectedPartner.id, 'rejected')}
                          disabled={!!actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-black text-xs rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-60">
                          {actionLoading === 'rejected' ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />} Reject
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LogisticsIntelligence;
