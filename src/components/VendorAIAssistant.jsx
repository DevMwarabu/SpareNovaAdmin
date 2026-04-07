import { API_BASE } from '../api/config';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  X, 
  Send, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Target, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Activity,
  Bot,
  Star,
  Plus,
  LayoutGrid,
  BarChart3,
  Command
} from 'lucide-react';
import axios from 'axios';

const VendorAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Operational Hub Synchronized. I am your Strategic Assistant. How can I optimize your yield today?', time: 'Just now' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), type: 'user', text: input, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Tactical Logic (Heuristic Simulation)
    setTimeout(() => {
      let aiResponse = "I am processing that analytical request against currently scoped telemetry. For deeper insight, please execute a full regional audit.";
      
      const query = input.toLowerCase();
      if (query.includes('sales') || query.includes('revenue')) {
        aiResponse = "Current growth velocity is 12.4%. Market demand for Brake Pads is up 18% in Nairobi West. Consider increasing listed stock levels to avoid lost sales.";
      } else if (query.includes('stock') || query.includes('inventory')) {
        aiResponse = "Neural scan detected 4 items with 'Low Stock' status. Restocking Toyota Filters within 24 hours will yield an estimated 5% revenue boost due to high localized demand.";
      } else if (query.includes('price') || query.includes('pricing')) {
        aiResponse = "Market intelligence suggests 3% price optimization on fast-moving lubricants. Competitor nodes are currently 5% above your current threshold.";
      } else if (query.includes('delivery') || query.includes('shipping')) {
        aiResponse = "Logistic failure rate is at 2.1%. Route optimization for Karen Hub is recommended to bypass current Mombasa Road congestion.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: aiResponse, time: 'Just now' }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[500] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(10px)' }}
            className="mb-6 w-[420px] bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col shadow-purple-900/10"
          >
             {/* Assistant Header */}
             <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />
                <div className="relative z-10 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                         <BrainCircuit size={24} />
                      </div>
                      <div>
                         <h3 className="text-lg font-black tracking-tight italic uppercase leading-none">Neural <span className="text-purple-400">Assistant</span></h3>
                         <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Strategic Hub Synchronized</p>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <X size={20} />
                   </button>
                </div>
             </div>

             {/* Chat Area */}
             <div ref={scrollRef} className="h-[400px] overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-[28px] text-[11px] font-medium leading-relaxed relative ${
                      m.type === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-900/10' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                    }`}>
                       {m.type === 'ai' && <div className="text-[8px] font-black text-purple-600 uppercase tracking-widest mb-1 italic">Tactical Insight</div>}
                       {m.text}
                       <p className={`text-[7px] mt-2 font-black uppercase tracking-widest opacity-40 text-right ${m.type === 'user' ? 'text-white' : 'text-slate-400'}`}>
                          {m.time}
                       </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-white p-5 rounded-[28px] rounded-tl-none border border-slate-100 flex gap-1 items-center shadow-sm">
                        <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" />
                     </div>
                  </div>
                )}
             </div>

             {/* Proactive Suggestions */}
             <div className="p-4 bg-white border-t border-slate-50 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                {[
                  { label: 'Optimize Pricing', icon: TrendingUp },
                  { label: 'Restock Alert', icon: Zap },
                  { label: 'Demand Surge', icon: Activity },
                  { label: 'Loyalty Upgrade', icon: Star },
                ].map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(s.label)}
                    className="shrink-0 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-purple-200 hover:text-purple-600 transition-all flex items-center gap-2 italic"
                  >
                    <s.icon size={12} /> {s.label}
                  </button>
                ))}
             </div>

             {/* Input Area */}
             <div className="p-8 bg-white border-t border-slate-50">
                <div className="flex items-center gap-3 bg-slate-50 rounded-[24px] pl-6 pr-2 py-2 border border-slate-100 focus-within:border-purple-200 transition-colors shadow-inner">
                   <input 
                      placeholder="Ask Strategic AI..." 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest placeholder:text-slate-300 italic"
                   />
                   <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-purple-600 transition-all disabled:opacity-20 active:scale-90 shadow-xl shadow-slate-900/10"
                   >
                      <Send size={16} />
                   </button>
                </div>
             </div>

             {/* AI Compliance Footer */}
             <div className="px-8 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={12} className="text-emerald-500" />
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Security Encrypted</p>
                </div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Neural Engine v4.2</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Floating Command Hub */}
      <div className="fixed bottom-10 right-10 z-[500] flex flex-col items-end gap-5">
         {/* Blossom Actions */}
         <AnimatePresence>
            {isMenuOpen && !isOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 20 }}
                 className="flex flex-col gap-4 items-end mb-2"
               >
                  {[
                    { label: 'Strategic AI', icon: BrainCircuit, color: 'bg-purple-600 text-white shadow-purple-500/30', action: () => { setIsOpen(true); setIsMenuOpen(false); } },
                    { label: 'Deploy Product', icon: Plus, color: 'bg-white text-slate-800 shadow-slate-200', action: () => window.location.href = '/portal/products/add' },
                    { label: 'Market Analytics', icon: BarChart3, color: 'bg-white text-slate-800 shadow-slate-200', action: () => window.location.href = '/portal/analytics' },
                    { label: 'Global Overview', icon: LayoutGrid, color: 'bg-white text-slate-800 shadow-slate-200', action: () => window.location.href = '/portal' },
                  ].map((btn, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0, x: 20 }}
                      animate={{ scale: 1, x: 0 }}
                      exit={{ scale: 0, x: 20 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex items-center gap-3"
                    >
                       <span className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                          {btn.label}
                       </span>
                       <button 
                         onClick={btn.action}
                         className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-90 border border-slate-100/50 ${btn.color}`}
                       >
                          <btn.icon size={22} />
                       </button>
                    </motion.div>
                  ))}
               </motion.div>
            )}
         </AnimatePresence>

         {/* Primary Hub Trigger */}
         <motion.button 
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => {
              if (isOpen) { setIsOpen(false); }
              else { setIsMenuOpen(!isMenuOpen); }
           }}
           className={`w-20 h-20 rounded-[32px] flex items-center justify-center text-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] transition-all relative group overflow-hidden ${
              isOpen ? 'bg-slate-900 shadow-slate-900/40' : (isMenuOpen ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-primary-600')
           }`}
         >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <AnimatePresence mode="wait">
               {isOpen ? (
                 <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={28} />
                 </motion.div>
               ) : (
                 <motion.div key="hub" className="flex items-center justify-center">
                    {/* Pulsing Neural Rings */}
                    {!isMenuOpen && (
                      <>
                        <div className="absolute inset-0 border-4 border-white/20 rounded-[32px] animate-[ping_2s_infinite]" />
                        <div className="absolute inset-0 border-4 border-white/10 rounded-[32px] animate-[ping_3s_infinite]" />
                      </>
                    )}
                    {isMenuOpen ? <X size={28} /> : <Command size={32} strokeWidth={2.5} />}
                 </motion.div>
               )}
            </AnimatePresence>
         </motion.button>
      </div>
    </div>
  );
};

export default VendorAIAssistant;
