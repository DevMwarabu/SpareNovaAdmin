import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Truck, 
  ShieldCheck, 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Mail,
  ChevronRight,
  Headphones
} from 'lucide-react';

const CommunicationHub = () => {
  const [activeChannel, setActiveChannel] = useState('customers');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock Data for Industrial Communication
  const channels = [
    { id: 'customers', label: 'Client Node', icon: Users, count: 3, col: 'blue' },
    { id: 'delivery', label: 'Logistics Fleet', icon: Truck, count: 1, col: 'orange' },
    { id: 'admin', label: 'Ecosystem Governance', icon: ShieldCheck, count: 0, col: 'purple' },
  ];

  const [chats, setChats] = useState({
    customers: [
      { id: 101, name: 'Maina Kamau', lastMsg: 'Is the radiator assembly genuine?', time: '12m ago', unread: true, status: 'online' },
      { id: 102, name: 'Alice Wambui', lastMsg: 'Need urgent dispatch for #ORD-9901.', time: '1h ago', unread: false, status: 'offline' },
    ],
    delivery: [
      { id: 201, name: 'Driver Node 08', lastMsg: 'At pickup location. Awaiting confirmation.', time: '2m ago', unread: true, status: 'online' },
    ],
    admin: [
      { id: 301, name: 'Platform Support', lastMsg: 'Compliance verification completed.', time: '2d ago', unread: false, status: 'online' },
    ]
  });

  const [activeConversation, setActiveConversation] = useState([
     { id: 1, type: 'received', text: 'Hello, I noticed the Spark Plugs are listed as out-of-stock. Will you restock today?', time: '10:42 AM' },
     { id: 2, type: 'sent', text: 'Confirmed. We are currently processing a shipment from the central hub. Should be active in 2 hours.', time: '10:45 AM', read: true },
     { id: 3, type: 'received', text: 'Excellent, I will place the order then. Is there a discount for bulk purchase?', time: '11:02 AM' },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleSendMessage = () => {
     if (!message.trim()) return;
     const newMsg = { id: Date.now(), type: 'sent', text: message, time: 'Now', read: false };
     setActiveConversation(prev => [...prev, newMsg]);
     setMessage('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
             <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600 shadow-xl shadow-orange-500/10 border border-orange-100">
                <MessageSquare size={24} />
             </div>
             Communication <span className="text-orange-500">Hub</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest italic opacity-60">Multi-Channel Operational Synergy Center</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-3 italic">
              <Headphones size={18} /> Ecosystem Support Matrix
           </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[60px] border border-slate-100 shadow-sm overflow-hidden flex shadow-slate-200/50">
         {/* Sidebar: Channel Persistence */}
         <div className="w-[380px] border-r border-slate-50 flex flex-col bg-slate-50/20">
            <div className="p-8 space-y-8">
               {/* Channel Selector */}
               <div className="flex p-1.5 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                  {channels.map(ch => (
                    <button 
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id)}
                      className={`flex-1 py-4 rounded-[24px] flex flex-col items-center gap-1.5 transition-all relative ${
                        activeChannel === ch.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/10' : 'text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                       <ch.icon size={18} />
                       <span className="text-[8px] font-black uppercase tracking-[0.2em]">{ch.label.split(' ')[0]}</span>
                       {ch.count > 0 && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                       )}
                    </button>
                  ))}
               </div>

               {/* Search Threads */}
               <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors" size={16} />
                  <input placeholder="Search Operational Threads..." className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black placeholder:text-slate-200 outline-none focus:ring-4 focus:ring-orange-500/5 transition-all uppercase italic" />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8 space-y-2">
               {chats[activeChannel].map(chat => (
                 <motion.div 
                   layout
                   key={chat.id}
                   onClick={() => setSelectedChat(chat)}
                   className={`p-6 rounded-[32px] cursor-pointer transition-all border-2 group ${
                     selectedChat?.id === chat.id 
                      ? 'bg-white border-orange-100 shadow-xl shadow-slate-200/30' 
                      : 'bg-transparent border-transparent hover:bg-white/60 hover:border-slate-100'
                   }`}
                 >
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full border-4 border-white shadow-sm ${chat.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <h4 className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight">{chat.name}</h4>
                       </div>
                       <span className="text-[8px] font-black text-slate-300 uppercase italic">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                       <p className="text-[10px] font-medium text-slate-500 truncate italic grow">{chat.lastMsg}</p>
                       {chat.unread && (
                          <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center text-[9px] font-black text-white italic shadow-lg shadow-orange-500/20">
                             1
                          </div>
                       )}
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Chat Area: Operational Detail */}
         <div className="flex-1 flex flex-col bg-white">
            {selectedChat ? (
               <>
                  {/* Chat Header */}
                  <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg italic shadow-xl shadow-slate-900/10">
                           {selectedChat.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">{selectedChat.name}</h3>
                           <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[9px] font-black text-emerald-500 uppercase italic tracking-widest">Authorized Communications Active</span>
                              <ShieldCheck size={12} className="text-emerald-500" />
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all active:scale-95">
                           <MoreVertical size={20} />
                        </button>
                     </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/20 custom-scrollbar">
                     <div className="flex justify-center mb-10">
                        <span className="px-6 py-2 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-300 uppercase tracking-widest italic shadow-sm">End-to-End Encrypted Operational Channel</span>
                     </div>
                     {activeConversation.map(msg => (
                       <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] p-8 rounded-[44px] transition-all relative ${
                             msg.type === 'sent' 
                              ? 'bg-slate-900 text-white rounded-tr-none shadow-2xl shadow-slate-900/10' 
                              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                          }`}>
                             <p className="text-[12px] font-medium leading-relaxed italic">{msg.text}</p>
                             <div className="mt-4 flex items-center justify-between gap-10">
                                <span className={`text-[8px] font-black uppercase tracking-widest opacity-60 ${msg.type === 'sent' ? 'text-white' : 'text-slate-400'}`}>{msg.time}</span>
                                {msg.type === 'sent' && (
                                   <div className="flex items-center gap-1 text-emerald-400">
                                      <CheckCircle2 size={10} className={msg.read ? 'text-emerald-400' : 'text-white/20'} /> Read
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Operational Input Area */}
                  <div className="p-10 border-t border-slate-50">
                     <div className="flex items-center gap-4 mb-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Authorized Intelligence Templates</p>
                        <div className="flex-1 h-px bg-slate-50" />
                     </div>
                     <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                        {[
                          'Stock Confirmed', 'Restock Delayed', 'Quality Guaranteed', 'Tracking Updated', 'Pricing Policy'
                        ].map(t => (
                          <button key={t} className="shrink-0 px-4 py-2 border-2 border-slate-50 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:border-orange-200 hover:text-orange-600 transition-all italic">
                             {t}
                          </button>
                        ))}
                     </div>
                     <div className="bg-slate-50 rounded-[40px] p-2 pl-8 flex items-center gap-4 border border-slate-100 focus-within:border-orange-200 focus-within:bg-white transition-all shadow-inner">
                        <button className="p-3 text-slate-300 hover:text-slate-500 transition-colors">
                           <Paperclip size={22} />
                        </button>
                        <input 
                           placeholder="Transmit Operational Data..." 
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                           onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                           className="flex-1 bg-transparent border-none outline-none text-xs font-black uppercase text-slate-800 placeholder:text-slate-300 italic tracking-wider"
                        />
                        <button 
                          onClick={handleSendMessage}
                          className="w-14 h-14 bg-slate-900 text-white rounded-[32px] flex items-center justify-center hover:bg-orange-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                        >
                           <Send size={24} />
                        </button>
                     </div>
                  </div>
               </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-20 gap-8 animate-pulse text-center">
                  <div className="w-32 h-32 bg-slate-50 rounded-[60px] flex items-center justify-center text-slate-200 shadow-inner">
                     <Mail size={64} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest italic">Hub Selection Required</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 max-w-sm italic">Synchronize with an operational thread to begin ecological communication and logistics governance.</p>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default CommunicationHub;
