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
  const role = user.role || 'admin';
  const isAdmin = role === 'admin' || role === 'platform_admin';

  const menuGroups = [
    {
      label: 'Main',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Analytics', icon: LineChart, path: '/admin/analytics' }, // Changed icon to LineChart
        { name: 'AI Insights', icon: Brain, path: '/admin/ai-insights' }, // Added AI Insights
      ]
    },
    ...(isAdmin ? [
      {
        label: 'Business Units',
        items: [
          { name: 'Shops', icon: Store, path: '/admin/shops' },
          { name: 'Garages', icon: Gavel, path: '/admin/garages' },
          { name: 'Logistics', icon: Truck, path: '/admin/logistics' },
        ]
      },
      {
        label: 'E-Commerce',
        items: [
          { name: 'Products', icon: ShoppingBag, path: '/admin/products' },
          { name: 'Orders', icon: Package, path: '/admin/orders' },
          { name: 'Offers', icon: Percent, path: '/admin/offers' },
          { name: 'Inventory', icon: Box, path: '/admin/inventory' },
        ]
      },
      {
        label: 'Administration',
        items: [
          { name: 'Users', icon: Users, path: '/admin/users' },
          { name: 'Reviews', icon: Star, path: '/admin/reviews' },
          { name: 'Disputes', icon: Gavel, path: '/admin/disputes' },
          { name: 'Security', icon: Shield, path: '/admin/security' },
          { name: 'Audit Logs', icon: ClipboardList, path: '/admin/audit-logs' },
          { name: 'SaaS Platform', icon: Layers, path: '/admin/saas' },
          { name: 'Communications', icon: Megaphone, path: '/admin/communications' },
          { name: 'System Logs', icon: Terminal, path: '/admin/system-logs' },
          { name: 'Content (CMS)', icon: Layout, path: '/admin/cms' },
          { name: 'Advanced Reports', icon: FileText, path: '/admin/reports' },
          { name: 'Payments', icon: CreditCard, path: '/admin/payments' },
          { name: 'Settings', icon: Settings, path: '/admin/settings' },
        ]
      }
    ] : [
      {
        label: 'Management',
        items: [
          { name: 'My Orders', icon: ShoppingBag, path: '/admin/orders', roles: ['shop', 'store_owner'] },
          { name: 'Inventory', icon: Store, path: '/admin/inventory', roles: ['shop', 'store_owner'] },
          { name: 'Services', icon: Wrench, path: '/admin/services', roles: ['garage', 'garage_owner'] },
          { name: 'Bookings', icon: Gavel, path: '/admin/bookings', roles: ['garage', 'garage_owner'] },
          { name: 'Fleet', icon: Truck, path: '/admin/fleet', roles: ['delivery'] },
          { name: 'Settings', icon: Settings, path: '/admin/settings' },
        ].filter(item => !item.roles || item.roles.includes(role))
      }
    ])
  ];

  return (
    <aside className="w-64 bg-sidebar-dark h-screen flex flex-col border-r border-sidebar-border relative z-40">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <span className="text-xl font-black text-white tracking-tight">Spare<span className="text-primary-500">Nova</span></span>
        </div>

        <nav className="space-y-8">
          {menuGroups.map((group, i) => (
            <div key={i}>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 ml-3">{group.label}</h3>
              <div className="space-y-1 relative">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/admin'}
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

      <div className="mb-4 pb-4 border-b border-sidebar-border">
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white transition-colors">
          <HelpCircle size={20} />
          <span className="text-sm font-bold">Help Center</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
