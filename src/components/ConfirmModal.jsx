import React from 'react';
import { Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ConfirmModal = () => {
  const { confirmModal, closeConfirmModal, theme } = useApp();

  if (!confirmModal || !confirmModal.isOpen) return null;

  const isLight = theme === 'light';

  const handleConfirm = async () => {
    if (confirmModal.onConfirm) {
      await confirmModal.onConfirm();
    }
    closeConfirmModal();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl relative border transition-all ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#0f172a] border-white/10 text-white'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={closeConfirmModal}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${
            isLight ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          {/* Warning Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
            <Trash2 className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-extrabold tracking-tight">
            {confirmModal.title || "O'chirishni tasdiqlang"}
          </h3>

          <p className={`text-xs mt-2 font-medium leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {confirmModal.message || "Haqiqatdan ham ushbu ma'lumotni o'chirmoqchimisiz?"}
          </p>

          {confirmModal.itemName && (
            <div className={`mt-3 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold border ${
              isLight ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {confirmModal.itemName}
            </div>
          )}

          {/* Action Buttons: Ha / Yo'q */}
          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <button
              type="button"
              onClick={closeConfirmModal}
              className={`py-3 px-4 font-bold text-xs rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-[#1e293b] hover:bg-[#334155] border-white/10 text-slate-200'
              }`}
            >
              Yo'q, bekor qilish
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="py-3 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Trash2 className="w-4 h-4" />
              <span>Ha, o'chirilsin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
