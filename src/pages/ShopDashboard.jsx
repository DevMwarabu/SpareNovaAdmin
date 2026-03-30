import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  DollarSign,
  ArrowUpRight,
  Plus
} from 'lucide-react';

const StatCard = ({ title, value, change, icon, color }) => {
  const IconComponent = {
    Wallet: DollarSign,
    ShoppingBag: ShoppingCart,
    Package: Package,
    AlertTriangle: AlertTriangle
  }[icon] || DollarSign;

  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center`}>
          <IconComponent size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-black ${change >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-lg`}>
          <ArrowUpRight size={14} className={change < 0 ? 'rotate-90' : ''} /> {Math.abs(change)}%
        </div>
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
    </motion.div>
  );
};

const ShopDashboard = () => {
  const [stats, setStats] = React.useState([]);
  const [recentSales, setRecentSales] = React.useState([]);
  const [stockInsights, setStockInsights] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const API_BASE = 'http://localhost:8003/api/v1';

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/dashboard/stats`);
        if (response.data.success) {
          setStats(response.data.stats);
          setRecentSales(response.data.recentOrders);
          setStockInsights(response.data.serviceMix || []);
        }
      } catch (error) {
        console.error('Failed to fetch shop stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading && stats.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop Console</h1>
          <p className="text-slate-500 font-medium">Manage your inventory and track sales performance.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.href = '/portal/products'}
            className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Manage Items
          </button>
          <button 
            onClick={() => window.location.href = '/portal/products'}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-slate-900 mb-6 font-display">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Order ID</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Customer</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Amount</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Status Registry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentSales.map((sale, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-xs text-slate-900">{sale.id}</td>
                    <td className="py-4 font-medium text-xs text-slate-600">{sale.customer}</td>
                    <td className="py-4 font-bold text-xs text-slate-900">{sale.amount}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-lg ${sale.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'} text-[10px] font-black uppercase tracking-tight`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentSales.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 font-medium text-xs">No recent sales detected.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-[#0a0f1b] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div>
            <h2 className="text-xl font-black mb-6 relative z-10 italic italic tracking-tight">Stock Insights</h2>
            <div className="space-y-6 relative z-10">
              {stockInsights.map((insight, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>{insight.name}</span>
                    <span className={`text-${insight.color}-400`}>{insight.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${insight.value}%` }}
                        transition={{ duration: 1.5, delay: i * 0.2 }}
                        className={`h-full bg-${insight.color}-500 rounded-full`}
                    />
                  </div>
                </div>
              ))}
              {stockInsights.length === 0 && (
                  <div className="py-8 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">Scanning inventory...</div>
              )}
            </div>
          </div>
          <button className="w-full mt-10 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black transition-all uppercase tracking-[0.2em] italic">Generate Stock Report</button>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
