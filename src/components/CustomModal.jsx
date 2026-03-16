import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const CustomModal = ({ isOpen, onClose, title, message, type = 'success' }) => {
  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={32} />,
    error: <AlertCircle className="text-red-500" size={32} />,
    info: <Info className="text-primary-500" size={32} />,
  };

  const colors = {
    success: 'bg-emerald-50 border-emerald-100',
    error: 'bg-red-50 border-red-100',
    info: 'bg-primary-50 border-primary-100',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl shadow-slate-900/20 w-full max-w-md overflow-hidden pointer-events-auto border border-slate-100"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${colors[type]} border`}>
                    {icons[type]}
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{message}</p>
                
                <button
                  onClick={onClose}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-900/10"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
