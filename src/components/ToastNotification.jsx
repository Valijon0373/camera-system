import React from 'react';
import { CheckCircle2, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastNotification = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2.5 max-w-2xl w-[92%] pointer-events-none">
      {toasts.map((toast) => {
        const isDelete = toast.type === 'delete' || toast.type === 'error';
        const isEdit = toast.type === 'edit';

        const titleText = isDelete
          ? "O'chirildi"
          : isEdit
          ? "Tahrirlandi"
          : "Qo'shildi";

        // Green outlined alert for Tahrirlandi & Qo'shildi
        // Red outlined alert for O'chirildi
        const boxStyles = isDelete
          ? 'border border-rose-500 bg-[#160b0e]/95 text-rose-400 shadow-xl shadow-rose-950/40'
          : 'border border-emerald-500 bg-[#09140e]/95 text-emerald-400 shadow-xl shadow-emerald-950/40';

        const IconComponent = isDelete ? Trash2 : CheckCircle2;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative w-full flex items-center justify-center px-10 py-3 rounded-xl backdrop-blur-md transition-all animate-in slide-in-from-top-6 duration-300 ${boxStyles}`}
          >
            {/* Centered Icon & Text */}
            <div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium text-center min-w-0 mx-auto">
              <IconComponent className={`w-5 h-5 shrink-0 ${isDelete ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span className="font-extrabold uppercase tracking-wider underline underline-offset-2 shrink-0">
                {toast.title || titleText}:
              </span>
              <span className="truncate opacity-95">
                {toast.message}
              </span>
            </div>

            {/* Right Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className={`absolute right-3 p-1 rounded-lg transition-colors shrink-0 cursor-pointer ${
                isDelete ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-emerald-500/20 text-emerald-400'
              }`}
              title="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
