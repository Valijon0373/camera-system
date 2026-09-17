import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, ShieldCheck, Eye, EyeOff, Camera, ChevronRight, KeyRound } from 'lucide-react';

export const LoginModal = ({ isAdminRoute: propIsAdminRoute }) => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdminRoute = propIsAdminRoute !== undefined ? propIsAdminRoute : (
    typeof window !== 'undefined' && (window.location.pathname === '/admin' || window.location.hash === '#admin')
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setLoading(false);
      if (!res.success) {
        setError(res.message);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg overflow-y-auto">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md glass-panel border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
        {/* Top Header Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-cyan-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Camera className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            UrSPI <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Camera System</span>
          </h1>
          {isAdminRoute ? (
            <div className="mt-2 flex flex-col items-center gap-1">
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold animate-pulse">
                🛡️ ADMINISTRATOR KIRISH SAHIFASI (/admin)
              </span>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Admin paneli va foydalanuvchilar boshqaruviga kirish
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 mt-1 font-mono">
              Xonalar & IP Kameralar Kuzatuv Tizimi
            </p>
          )}
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2.5 animate-shake">
            <ShieldCheck className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Foydalanuvchi Logini
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Login (masalan: admin)"
                className="w-full pl-11 pr-4 py-3 text-sm font-mono glass-input rounded-xl focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Maxfiy Parol
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-10 py-3 text-sm font-mono glass-input rounded-xl focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>TIZIMGA KIRISH</span>
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
