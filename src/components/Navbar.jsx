import React from 'react';
import { Search, Bell, User, MessageSquare } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm shadow-slate-200/50">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search analytics, products or orders..." 
            className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/10 transition-all font-medium"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors relative">
          <MessageSquare size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
        
        <div className="flex items-center gap-3 pl-2 group">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-black text-slate-900 leading-none">
              {JSON.parse(localStorage.getItem('user') || '{}').name || 'Demo Admin'}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {JSON.parse(localStorage.getItem('user') || '{}').role || 'SaaS Admin'}
            </div>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/register'; }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 hover:from-red-50 hover:to-red-100 hover:text-red-600 transition-all shadow-sm"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
