import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  LifeBuoy, 
  Book, 
  MessageCircle, 
  PhoneCall, 
  ChevronDown, 
  ChevronUp,
  FileText,
  ShieldAlert,
  CreditCard,
  Truck,
  Wrench,
  Store
} from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = (user.role || 'admin').toLowerCase();
  const isAdmin = ['admin', 'platform_admin', 'staff', 'super_admin'].includes(role);

  const allCategories = [
    { 
      icon: CreditCard, title: 'Billing & Payments', desc: 'Invoices, refunds, and payout schedules', color: 'blue',
      path: `/${role}/payments`,
      roles: ['admin', 'platform_admin', 'staff', 'super_admin', 'shop', 'store_owner', 'garage', 'garage_owner']
    },
    { 
      icon: Store, title: 'Store Management', desc: 'Products, inventory, and orders', color: 'purple',
      path: `/${role}/products`,
      roles: ['admin', 'platform_admin', 'staff', 'super_admin', 'shop', 'store_owner']
    },
    { 
      icon: Wrench, title: 'Garage Operations', desc: 'Service requests and garage management', color: 'orange',
      path: `/${role}/garages`,
      roles: ['admin', 'platform_admin', 'staff', 'super_admin', 'garage', 'garage_owner']
    },
    { 
      icon: Truck, title: 'Logistics & Shipping', desc: 'Tracking, dispatch, and delivery issues', color: 'emerald',
      path: `/${role}/logistics`,
      roles: ['admin', 'platform_admin', 'staff', 'super_admin', 'delivery']
    },
    { 
      icon: ShieldAlert, title: 'Trust & Safety', desc: 'Disputes, reports, and security', color: 'rose',
      path: `/${role}/security`,
      roles: ['admin', 'platform_admin', 'staff', 'super_admin']
    },
    { 
      icon: Book, title: 'Platform Guide', desc: 'How to use SpareNova Admin', color: 'indigo',
      path: `#faq`,
      roles: ['admin', 'platform_admin', 'staff', 'super_admin', 'shop', 'store_owner', 'garage', 'garage_owner', 'delivery']
    },
  ];

  const categories = allCategories.filter(c => c.roles.includes(role));

  const faqs = [
    {
      q: 'How do I update my payout method?',
      a: 'Navigate to Settings > Financial Hub. From there, you can add or modify your designated bank account or mobile money details. Changes take 24-48 hours to verify.'
    },
    {
      q: 'What happens if a customer disputes an order?',
      a: 'A dispute hold is automatically placed on the funds. You will be notified via email and in the Disputes tab to provide evidence (e.g., dispatch photos, tracking IDs) within 72 hours.'
    },
    {
      q: 'How do I reset a staff member\'s password?',
      a: 'Go to the Users tab, select the staff member, and click "Reset Password" from the actions menu. A temporary secure link will be dispatched to their registered email.'
    },
    {
      q: 'Can I integrate my existing inventory system?',
      a: 'Yes. We offer a RESTful API and webhooks for real-time synchronization. Access the Developer Portal under Settings to generate your API keys.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 rounded-[48px] p-12 shadow-2xl shadow-slate-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 text-white pointer-events-none">
          <LifeBuoy size={240} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black text-white tracking-tight italic uppercase mb-4">
            How can we assist you?
          </h1>
          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            Search our knowledge base, browse categories, or contact our dedicated institutional support team.
          </p>
          
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles, guides, or error codes..." 
              className="w-full bg-white/10 border border-white/20 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:bg-white/15 transition-all shadow-inner backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => {
          const isAnchor = cat.path.startsWith('#');
          const CardContent = (
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer hover:-translate-y-1 h-full">
              <div className={`w-12 h-12 rounded-2xl bg-${cat.color}-50 text-${cat.color}-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <cat.icon size={24} />
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-2">{cat.title}</h3>
              <p className="text-[11px] font-bold text-slate-500 leading-relaxed">{cat.desc}</p>
            </div>
          );

          if (isAnchor) {
            return (
              <a href={cat.path} key={i} className="block">
                {CardContent}
              </a>
            );
          }

          return (
            <Link to={cat.path} key={i} className="block">
              {CardContent}
            </Link>
          );
        })}
      </div>

      <div id="faq" className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* FAQs */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight italic uppercase flex items-center gap-3">
            <FileText className="text-indigo-500" size={24} /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden transition-all shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="p-6 flex items-center justify-between gap-4">
                  <h4 className="text-sm font-black text-slate-800">{faq.q}</h4>
                  <div className={`p-2 rounded-xl transition-colors ${openFaq === index ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                    {openFaq === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6"
                    >
                      <div className="w-full h-px bg-slate-50 mb-4" />
                      <p className="text-[12px] font-bold text-slate-500 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight italic uppercase flex items-center gap-3">
            <LifeBuoy className="text-emerald-500" size={24} /> Contact Us
          </h2>
          <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Priority Support</p>
                   <h3 className="text-2xl font-black italic">Need immediate help?</h3>
                </div>
                
                <a href="mailto:support@sparenova.com" className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-0.5">Email Support</p>
                      <p className="text-sm font-black">support@sparenova.com</p>
                   </div>
                </a>

                <a href="tel:+254700000000" className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PhoneCall size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-0.5">Hotline (24/7)</p>
                      <p className="text-sm font-black">+254 700 000 000</p>
                   </div>
                </a>
             </div>
             
             <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 pointer-events-none">
                <LifeBuoy size={160} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
