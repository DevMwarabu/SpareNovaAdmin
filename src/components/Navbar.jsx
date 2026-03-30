import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, User, MessageSquare, 
  LogOut, Settings, UserCircle, 
  ExternalLink, CheckCircle2, AlertCircle,
  Clock, X, Zap, ShieldCheck, ChevronDown,
  Globe, Activity, Layers, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ADMIN_MODULES = [
   { type: 'ui', title: 'Intelligence Dashboard', subtitle: 'Global System Telemetry Overview', url: '/portal', roles: ['admin', 'store_owner', 'garage_owner', 'delivery'] },
   { type: 'ui', title: 'Data Analytics', subtitle: 'Platform Conversions & Sales Metrics', url: '/portal/analytics', roles: ['admin'] },
   { type: 'ui', title: 'Shop Network', subtitle: 'Business Units & Vendor Franchises', url: '/portal/shops', roles: ['admin'] },
   { type: 'ui', title: 'Service Garages', subtitle: 'On-Demand Mechanics & Hubs', url: '/portal/garages', roles: ['admin'] },
   { type: 'ui', title: 'Logistics Control', subtitle: 'Fleet Management & Deliveries', url: '/portal/logistics', roles: ['admin', 'delivery'] },
   { type: 'ui', title: 'Loyalty Hub', subtitle: 'Customers, Drivers, and Administrators', url: '/portal/users', roles: ['admin', 'store_owner', 'garage_owner'] },
   { type: 'ui', title: 'Payment Gateways', subtitle: 'Financial Transactions & Escrow', url: '/portal/payments', roles: ['admin'] },
   { type: 'ui', title: 'Inventory Pipeline', subtitle: 'Stock Constraints & Audits', url: '/portal/inventory', roles: ['admin', 'store_owner'] },
   { type: 'ui', title: 'Products Hub', subtitle: 'Items & SKU Identifiers', url: '/portal/products', roles: ['admin', 'store_owner'] },
   { type: 'ui', title: 'Order Dispatches', subtitle: 'Cart Settlements & Deliveries', url: '/portal/orders', roles: ['admin', 'store_owner', 'garage_owner'] },
   { type: 'ui', title: 'Promotional Offers', subtitle: 'Discounts & Conversion Campaigns', url: '/portal/offers', roles: ['admin', 'store_owner'] },
   { type: 'ui', title: 'Customer Reviews', subtitle: 'Store Verification & Ratings', url: '/portal/reviews', roles: ['admin', 'store_owner', 'garage_owner'] },
   { type: 'ui', title: 'Dispute Mediation', subtitle: 'Conflict Resolution & Evidence', url: '/portal/disputes', roles: ['admin', 'store_owner', 'garage_owner'] },
   { type: 'ui', title: 'Security Sentinel', subtitle: 'Fraud Deflection & Risk Scores', url: '/portal/security', roles: ['admin'] },
   { type: 'ui', title: 'SaaS Configurations', subtitle: 'Vendor Subscriptions & Billings', url: '/portal/saas', roles: ['admin'] },
   { type: 'ui', title: 'AI Insights Engine', subtitle: 'Machine Learning Predictors', url: '/portal/ai-insights', roles: ['admin', 'store_owner', 'garage_owner'] },
   { type: 'ui', title: 'Audit Ledger', subtitle: 'Compliance Trails & Integrity Logs', url: '/portal/audit-logs', roles: ['admin'] },
   { type: 'ui', title: 'Communications', subtitle: 'Email Templates & Mass Broadcasting', url: '/portal/communications', roles: ['admin'] },
   { type: 'ui', title: 'System Logs', subtitle: 'API Health & Server Protocols', url: '/portal/system-logs', roles: ['admin'] },
   { type: 'ui', title: 'CMS Architecture', subtitle: 'Legal, Policies, & Branding Interfaces', url: '/portal/cms', roles: ['admin'] },
   { type: 'ui', title: 'Reporting Modules', subtitle: 'PDF Accounting & Export Protocols', url: '/portal/reports', roles: ['admin'] },
   { type: 'ui', title: 'Platform Settings', subtitle: 'Institutional App Overrides', url: '/portal/settings', roles: ['admin'] },
   { type: 'ui', title: 'Vendor Onboarding', subtitle: 'Register Partner Terminal', url: '/portal/register-partner', roles: ['admin'] }
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const API_BASE = 'http://localhost:8003/api/v1';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
        setIsMessagesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    axios.get(`${API_BASE}/dashboard/alerts`)
      .then(res => {
         if (res.data.success) {
            setNotifications(res.data.notifications);
            setMessages(res.data.messages);
         }
      })
      .catch(err => console.error(err));
      
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
     if (!searchQuery || searchQuery.length < 2) {
         setSearchResults([]);
         return;
     }
     setIsSearching(true);
     const delayDebounceFn = setTimeout(() => {
      axios.get(`${API_BASE}/portal/search?q=${searchQuery}`)
        .then(res => {
           if (res.data.success) {
              const matchedUI = ADMIN_MODULES.filter(m => 
                 (m.roles.includes(user.role) || user.role === 'admin') &&
                 (m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  m.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
              );
              setSearchResults([...matchedUI, ...res.data.data].slice(0, 8));
           }
        })
        .finally(() => setIsSearching(false));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Demo Admin", "role": "Institutional Overseer"}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/register';
  };

    const getNoteStyles = (type) => {
      switch(type) {
        case 'success': return { i: CheckCircle2, c: 'emerald' };
        case 'warning': return { i: AlertCircle, c: 'orange' };
        case 'error': return { i: AlertCircle, c: 'red' };
        default: return { i: Activity, c: 'blue' };
      }
    };

  return (
    <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-[100] shadow-sm shadow-slate-200/20 italic uppercase">
      <div className="flex-1 max-w-2xl">
        <div className={`relative group transition-all duration-500 ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
          <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-500 ${isSearchFocused ? 'text-orange-500 scale-110' : 'text-slate-400'}`}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search Global Intelligence Hub..." 
            className="w-full bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-3.5 text-[11px] font-black outline-none focus:ring-8 focus:ring-orange-500/5 transition-all placeholder:text-slate-300 tracking-widest italic"
          />
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{isSearching ? 'Scanning global index...' : 'Live Search Results'}</p>
                   <button onClick={() => setIsSearchFocused(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={16} className="text-slate-300" /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   {searchResults.length > 0 ? searchResults.map((item, i) => {
                     let Icon = Activity;
                     let color = 'blue';
                     if (item.type === 'ui') { Icon = Activity; color = 'rose'; }
                     if (item.type === 'user') { Icon = User; color = 'indigo'; }
                     if (item.type === 'product') { Icon = Layers; color = 'emerald'; }
                     if (item.type === 'vendor') { Icon = Target; color = 'orange'; }
                     if (item.type === 'order') { Icon = ShieldCheck; color = 'purple'; }
                     
                     return (
                     <button key={i} onClick={() => { setIsSearchFocused(false); navigate(item.url); }} className="flex items-center gap-4 p-5 rounded-[28px] hover:bg-slate-50 transition-all group text-left border border-transparent hover:border-slate-100 italic uppercase">
                        <div className={`w-10 h-10 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                           <Icon size={20} />
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-slate-900 leading-tight mb-1">{item.title}</p>
                           <p className="text-[8px] font-black text-slate-400 tracking-widest italic opacity-60 line-clamp-1">{item.subtitle}</p>
                        </div>
                     </button>
                    )}) : (
                      <div className="col-span-2 text-center py-6 text-[10px] font-black tracking-widest uppercase text-slate-400 italic">
                         {isSearching ? 'Scanning...' : (searchQuery.length >= 2 ? 'No telemetry found.' : 'Awaiting input...')}
                      </div>
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex items-center gap-4" ref={dropdownRef}>
        {/* Messages */}
        <div className="relative">
          <button 
            onClick={() => { setIsMessagesOpen(!isMessagesOpen); setIsNotificationsOpen(false); setIsProfileOpen(false); }}
            className={`p-3.5 rounded-2xl transition-all relative group ${isMessagesOpen ? 'bg-orange-50 text-orange-600 shadow-xl shadow-orange-500/10' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <MessageSquare size={22} className="group-hover:rotate-12 transition-transform" />
            <span className={`absolute top-3 right-3 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white shadow-sm ${messages.length > 0 ? 'animate-pulse' : 'hidden'}`}></span>
          </button>
          
          <AnimatePresence>
            {isMessagesOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute top-full right-0 mt-5 w-96 bg-white rounded-[44px] shadow-2xl border border-slate-100 overflow-hidden z-50 shadow-orange-900/10"
              >
                <div className="p-8 bg-orange-50/50 border-b border-orange-100 flex items-center justify-between">
                  <p className="text-[11px] font-black text-orange-900 uppercase tracking-widest italic flex items-center gap-2"><Zap size={14} /> Partner Pulse</p>
                  <span className="text-[9px] font-black text-white bg-orange-600 px-3 py-1 rounded-full shadow-lg shadow-orange-500/20">{messages.length} ACTIVE</span>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {messages.map((msg, i) => (
                    <button key={i} onClick={() => { setIsMessagesOpen(false); navigate('/portal/disputes'); }} className="w-full px-8 py-6 border-b border-slate-50 hover:bg-slate-50/80 transition-all text-left group">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] font-black text-slate-900 uppercase italic group-hover:text-orange-600 transition-colors tracking-tight line-clamp-1 pr-2">{msg.from}</p>
                        <span className="text-[9px] font-bold text-slate-400 italic shrink-0">{msg.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-black leading-relaxed italic opacity-70 line-clamp-2 uppercase tracking-wide">{msg.text}</p>
                    </button>
                  ))}
                  {messages.length === 0 && (
                     <div className="px-8 py-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">All Support Channels Cleared</div>
                  )}
                </div>
                <button onClick={() => navigate('/portal/disputes')} className="w-full py-6 text-[10px] font-black text-orange-600 hover:bg-orange-50 transition-colors uppercase tracking-[0.2em] italic border-t border-orange-50">Operational Log Access</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsMessagesOpen(false); setIsProfileOpen(false); }}
            className={`p-3.5 rounded-2xl transition-all relative group ${isNotificationsOpen ? 'bg-indigo-50 text-indigo-600 shadow-xl shadow-indigo-500/10' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Bell size={22} className="group-hover:rotate-[-12deg] transition-transform" />
            <span className={`absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm ${notifications.length > 0 ? 'animate-pulse' : 'hidden'}`}></span>
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute top-full right-0 mt-5 w-96 bg-white rounded-[44px] shadow-2xl border border-slate-100 overflow-hidden z-50 shadow-indigo-900/10"
              >
                <div className="p-8 bg-indigo-50/50 border-b border-indigo-100 flex items-center justify-between">
                  <p className="text-[11px] font-black text-indigo-900 uppercase tracking-widest italic flex items-center gap-2"><Globe size={14} /> Intelligence Mesh</p>
                  <button className="text-[9px] font-black text-indigo-400 hover:text-indigo-600 transition-colors uppercase italic border-b border-indigo-200">System Ack</button>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.map((note, i) => {
                    const style = getNoteStyles(note.type);
                    const Icon = style.i;
                    return (
                    <button key={i} className="w-full px-8 py-6 border-b border-slate-50 hover:bg-slate-50/80 transition-all text-left flex items-start gap-5 group">
                      <div className={`w-10 h-10 rounded-2xl bg-${style.c}-50 text-${style.c}-600 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform`}>
                         <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-black text-slate-800 uppercase italic leading-tight mb-2 tracking-tight line-clamp-1">{note.title}</p>
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest italic flex items-center gap-2 opacity-60">
                           <Clock size={12} /> {note.time}
                        </p>
                      </div>
                    </button>
                  )})}
                  {notifications.length === 0 && (
                     <div className="px-8 py-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No System Broadcasts</div>
                  )}
                </div>
                <button className="w-full py-6 text-[10px] font-black text-slate-400 hover:bg-slate-50 transition-colors uppercase tracking-[0.2em] italic font-bold">Clear Protocol Cache</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-10 w-[1px] bg-slate-100 mx-4 opacity-50"></div>
        
        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); setIsMessagesOpen(false); }}
            className={`flex items-center gap-5 p-1.5 pr-6 rounded-[24px] border-2 transition-all outline-none group ${isProfileOpen ? 'bg-slate-900 border-slate-900 shadow-2xl shadow-slate-900/20' : 'bg-white border-white hover:bg-slate-50'}`}
          >
            <div className={`w-11 h-11 rounded-[18px] flex items-center justify-center transition-all shadow-xl ${isProfileOpen ? 'bg-white/10 text-white' : 'bg-slate-900 text-white'}`}>
              <User size={22} />
            </div>
            <div className="text-left hidden sm:block">
              <div className={`text-[12px] font-black leading-none mb-1.5 uppercase transition-colors ${isProfileOpen ? 'text-white' : 'text-slate-900'}`}>{user.name}</div>
              <div className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${isProfileOpen ? 'text-white/40' : 'text-slate-400 opacity-60'}`}>{user.role}</div>
            </div>
            <ChevronDown size={14} className={`ml-2 transition-transform duration-500 ${isProfileOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute top-full right-0 mt-5 w-72 bg-white rounded-[44px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 p-4 z-50 shadow-slate-900/10"
              >
                <div className="p-6 bg-slate-50/50 rounded-[32px] mb-4 border border-slate-100 italic">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-60">Governance Protocol</p>
                   <p className="text-[12px] font-black text-slate-900 uppercase truncate leading-none">Institutional Security Node</p>
                </div>
                <div className="space-y-2">
                  {[
                    ...(user.role === 'admin' || user.role === 'store_owner' ? [{ label: 'Governance Identity', icon: UserCircle, action: () => navigate('/portal/users'), col: 'slate' }] : []),
                    ...(user.role === 'admin' ? [{ label: 'System Configuration', icon: Settings, action: () => navigate('/portal/settings'), col: 'slate' }] : []),
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={item.action}
                      className="w-full flex items-center gap-4 px-6 py-4 rounded-[24px] text-[11px] font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all uppercase italic group"
                    >
                      <item.icon size={20} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                      {item.label}
                    </button>
                  ))}
                  <div className="h-[1px] bg-slate-50 mx-6 my-2 opacity-50"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-[11px] font-black text-rose-500 hover:bg-rose-50 transition-all uppercase italic shadow-sm hover:shadow-xl hover:shadow-rose-500/10 mt-2"
                  >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    Terminate Deployment
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
