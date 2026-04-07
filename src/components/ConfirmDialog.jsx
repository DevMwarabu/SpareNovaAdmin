import { API_BASE } from '../api/config';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CheckCircle2, ShieldAlert } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm Action", cancelText = "Discard", type = "warning" }) => {
  const isDanger = type === 'danger' || type === 'warning';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-[56px] p-12 relative z-10 shadow-2xl overflow-hidden uppercase italic"
          >
            <div className={`absolute top-0 right-0 w-48 h-48 ${isDanger ? 'bg-rose-50' : 'bg-blue-50'} rounded-full blur-3xl -translate-x-12 -translate-y-12 opacity-50`} />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-8 shadow-xl ${isDanger ? 'bg-rose-50 text-rose-500 shadow-rose-500/10 border border-rose-100' : 'bg-blue-50 text-blue-500 shadow-blue-500/10 border border-blue-100'}`}>
                {isDanger ? <ShieldAlert size={32} /> : <CheckCircle2 size={32} />}
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-4 italic uppercase">{title}</h2>
              <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] leading-relaxed opacity-60 italic mb-10">
                {message}
              </p>

              <div className="flex flex-col w-full gap-4">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`w-full py-6 rounded-[28px] font-black text-[12px] uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-4 italic border-t border-white/10 ${isDanger ? 'bg-rose-600 text-white shadow-rose-500/30 hover:bg-rose-700' : 'bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700'}`}
                >
                   {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest italic"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
