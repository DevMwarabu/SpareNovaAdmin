import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Store, 
  Gavel, 
  Truck,
  Shield,
  ClipboardList,
  Layers,
  Megaphone,
  Terminal,
  Layout,
  FileText,
  Users, 
  Settings, 
  HelpCircle,
  LineChart, // Changed from BarChart3
  Brain, // Added Brain icon
  CreditCard,
  Wrench,
  ShoppingBag,
  Package,
  Percent,
  Star,
  Box // Added Box icon, assuming it's used for Inventory
} from 'lucide-react';


const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = (user.role || 'admin').toLowerCase();
  
  const isAdmin = ['admin', 'platform_admin', 'staff', 'super_admin'].includes(role);

  const menuGroups = isAdmin ? [
    {
      label: 'Main',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/portal' },
        { name: 'Analytics', icon: LineChart, path: '/portal/analytics' },
        { name: 'AI Insights', icon: Brain, path: '/portal/ai-insights' },
      ]
    },
    {
      label: 'Business Units',
      items: [
        { name: 'Shops', icon: Store, path: '/portal/shops' },
        { name: 'Garages', icon: Gavel, path: '/portal/garages' },
        { name: 'Logistics', icon: Truck, path: '/portal/logistics' },
      ]
    },
    {
      label: 'E-Commerce',
      items: [
        { name: 'Products', icon: ShoppingBag, path: '/portal/products' },
        { name: 'Orders', icon: Package, path: '/portal/orders' },
        { name: 'Offers', icon: Percent, path: '/portal/offers' },
        { name: 'Inventory', icon: Box, path: '/portal/inventory' },
      ]
    },
    {
      label: 'Administration',
      items: [
        { name: 'Users', icon: Users, path: '/portal/users' },
        { name: 'Reviews', icon: Star, path: '/portal/reviews' },
        { name: 'Disputes', icon: Gavel, path: '/portal/disputes' },
        { name: 'Security', icon: Shield, path: '/portal/security' },
        { name: 'Audit Logs', icon: ClipboardList, path: '/portal/audit-logs' },
        { name: 'SaaS Platform', icon: Layers, path: '/portal/saas' },
        { name: 'Communications', icon: Megaphone, path: '/portal/communications' },
        { name: 'System Logs', icon: Terminal, path: '/portal/system-logs' },
        { name: 'Content (CMS)', icon: Layout, path: '/portal/cms' },
        { name: 'Advanced Reports', icon: FileText, path: '/portal/reports' },
        { name: 'Payments', icon: CreditCard, path: '/portal/payments' },
        { name: 'Settings', icon: Settings, path: '/portal/settings' },
      ]
    }
  ] : [
    {
      label: 'Management Console',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/portal' },
        { name: 'Orders', icon: Package, path: '/portal/orders' },
        { name: 'Products', icon: ShoppingBag, path: '/portal/products' },
        { name: 'Inventory', icon: Box, path: '/portal/inventory' },
        { name: 'Customers', icon: Users, path: '/portal/users' },
        { name: 'Delivery', icon: Truck, path: '/portal/logistics' },
        { name: 'Garage Ops', icon: Wrench, path: '/portal/garages' },
        { name: 'Finance', icon: CreditCard, path: '/portal/payments' },
        { name: 'Marketing', icon: Percent, path: '/portal/offers' },
        { name: 'Loyalty Hub', icon: Brain, path: '/portal/loyalty' },
        { name: 'Reports', icon: FileText, path: '/portal/reports' },
        { name: 'Settings', icon: Settings, path: '/portal/settings' },
      ]
    }
  ];

  const [logo, setLogo] = React.useState(localStorage.getItem('platform_logo'));

  React.useEffect(() => {
    const handleBrandingUpdate = () => {
      setLogo(localStorage.getItem('platform_logo'));
    };
    window.addEventListener('branding_update', handleBrandingUpdate);
    return () => window.removeEventListener('branding_update', handleBrandingUpdate);
  }, []);

  return (
    <aside className="w-64 bg-sidebar-dark h-screen flex flex-col border-r border-sidebar-border relative z-40 select-none">
      {/* Logo Header - Fixed */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-2 mb-6 transition-all duration-500">
          {logo ? (
             <img src={logo} alt="Logo" className="max-h-12 w-auto object-contain object-left max-w-[180px] animate-in fade-in duration-1000" />
          ) : (

             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20 animate-in zoom-in duration-700">
                  <span className="text-white font-black text-xl italic">S</span>
                </div>
                <span className="text-xl font-black text-white tracking-tight italic">Spare<span className="text-primary-500">Nova</span></span>
             </div>
          )}
        </div>
      </div>


      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        <nav className="space-y-8 pb-4">
          {menuGroups.map((group, i) => (
            <div key={i}>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 ml-3">{group.label}</h3>
              <div className="space-y-1 relative">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/portal'}
                    className={({ isActive }) => 
                      `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                        isActive 
                        ? 'text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="active-sidebar-pill"
                            className="absolute inset-0 bg-primary-500 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)] shadow-primary-500/20"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-3 w-full">
                          <item.icon size={20} className="transition-transform group-hover:scale-110" />
                          <span className="text-sm font-bold">{item.name}</span>
                        </div>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer - Fixed Bottom */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white transition-colors group">
          <HelpCircle size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-bold">Help Center</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
