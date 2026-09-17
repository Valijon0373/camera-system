import React from 'react';
import { useApp } from '../context/AppContext';
import { Camera, LayoutDashboard, Grid, LogOut, User, Search, Shield, Activity, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout, activeTab, setActiveTab, searchQuery, setSearchQuery, cameras, theme, toggleTheme } = useApp();

  const onlineCount = cameras.filter(c => c.status === 'online').length;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
      theme === 'light' ? 'bg-white/80 border-teal-100 text-slate-900 shadow-sm shadow-teal-900/5' : 'bg-[#070b14]/75 border-white/5 text-white'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 via-sky-400 to-violet-400 p-0.5 shadow-lg shadow-teal-500/25 transition-transform hover:scale-105">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-[#070b14]'}`}>
                <Camera className="w-6 h-6 text-teal-400" />
              </div>
            </div>
            <div>
              <div className={`font-extrabold text-base tracking-tight flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                UrSPI <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">CAM</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg font-bold ${theme === 'light' ? 'bg-teal-50 border border-teal-200 text-teal-700' : 'bg-teal-400/10 border border-teal-400/30 text-teal-300'}`}>PRO v2.4</span>
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
                  ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-amber-300 hover:border-amber-400/30'
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
              theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${theme === 'light' ? 'bg-teal-50 border border-teal-200 text-teal-600' : 'bg-teal-400/15 border border-teal-400/40 text-teal-300'}`}>
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <p className={`text-xs font-bold leading-none ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>{currentUser?.username}</p>
                <p className={`text-[10px] font-mono leading-tight uppercase font-semibold ${theme === 'light' ? 'text-teal-600' : 'text-teal-300'}`}>{currentUser?.role}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className={`p-2.5 rounded-xl border transition-all ${
                theme === 'light'
                  ? 'bg-slate-50 hover:bg-rose-50 border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600'
                  : 'bg-white/5 hover:bg-rose-500/15 border-white/10 hover:border-rose-400/40 text-slate-400 hover:text-rose-300'
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
