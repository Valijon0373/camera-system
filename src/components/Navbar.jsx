import React from 'react';
import { useApp } from '../context/AppContext';
import { Camera, LayoutDashboard, Grid, LogOut, User, Search, Shield, Activity, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout, activeTab, setActiveTab, searchQuery, setSearchQuery, cameras, theme, toggleTheme } = useApp();

  const onlineCount = cameras.filter(c => c.status === 'online').length;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
      theme === 'light' ? 'bg-white/90 border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-950/80 border-slate-800/80 text-white'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-slate-950'}`}>
                <Camera className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
            <div>
              <div className={`font-extrabold text-base tracking-tight flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                UrSPI <span className="text-cyan-500">CAM</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 font-bold">PRO v2.4</span>
              </div>
              <p className={`text-[11px] font-mono hidden sm:block ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Xonalar & Kameralar Kuzatuv Tizimi</p>
            </div>
          </div>



          {/* User profile & Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Day / Night Mode Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-mono font-semibold ${
                theme === 'light'
                  ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700'
              }`}
              title={theme === 'light' ? "Tungi rejimga o'tish" : "Kunduzki rejimga o'tish"}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-5 h-5 text-amber-600 fill-amber-500" />
                  <span className="hidden xl:inline font-bold">Kunduzki</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-cyan-400" />
                  <span className="hidden xl:inline font-bold">Tungi</span>
                </>
              )}
            </button>



            {/* Current user badge */}
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border ${
              theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <p className={`text-xs font-bold leading-none ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>{currentUser?.username}</p>
                <p className="text-[10px] font-mono text-cyan-500 leading-tight uppercase font-semibold">{currentUser?.role}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className={`p-2.5 rounded-xl border transition-all ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-red-100 border-slate-200 hover:border-red-300 text-slate-600 hover:text-red-600'
                  : 'bg-slate-900 hover:bg-red-500/20 border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400'
              }`}
              title="Tizimdan chiqish"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
