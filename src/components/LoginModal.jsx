import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, ShieldCheck, Eye, EyeOff, Camera, ChevronRight, Maximize2, Minimize2, Move3d, Compass, Layers } from 'lucide-react';
import { SplineScene } from './ui/splite';
import { Spotlight } from './ui/spotlight';

export const LoginModal = ({ isAdminRoute: propIsAdminRoute }) => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isAdminRoute = propIsAdminRoute !== undefined ? propIsAdminRoute : (
    typeof window !== 'undefined' && (window.location.pathname === '/admin' || window.location.hash === '#admin')
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

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
    <div className="fixed inset-0 z-50 w-screen h-screen min-h-screen bg-[#030611] overflow-hidden relative flex flex-col justify-between">
      {/* 3D Scene - FULLSCREEN BACKGROUND */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto animate-fade-in delay-100">
        <div className={`w-full h-full transform transition-transform duration-700 ease-out ${
          isFullScreen 
            ? 'translate-x-0 scale-100' 
            : 'translate-x-16 sm:translate-x-[15%] md:translate-x-[22%] lg:translate-x-[28%] xl:translate-x-[32%] scale-105 lg:scale-110'
        }`}>
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Ambient Glows & Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 pointer-events-none z-10" fill="white" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none z-10 animate-float-subtle" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none z-10 animate-float-subtle" style={{ animationDelay: '2.5s' }} />

      {/* Fullscreen Mode Overlay Toggle Button */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="px-3.5 py-2 rounded-2xl bg-[#070d1e]/80 hover:bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold flex items-center gap-2 backdrop-blur-xl shadow-xl transition-all active:scale-95 cursor-pointer pointer-events-auto animate-fade-slide-up delay-100 hover:shadow-teal-500/20"
        >
          {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span>{isFullScreen ? "Modalni Ko'rsatish" : "Tõliq 3D Ekranda Ko'rish"}</span>
        </button>
      </div>

      {/* Main Content Overlay: Left Side Container */}
      {!isFullScreen && (
        <div className="relative z-20 w-full h-full p-4 sm:p-8 lg:p-10 pl-6 sm:pl-14 md:pl-20 lg:pl-28 xl:pl-36 flex flex-col justify-center overflow-y-auto pointer-events-none">
          <div className="max-w-xl w-full pointer-events-auto">
            {/* Left Header Info */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-bold w-fit mb-3 shadow-sm backdrop-blur-md animate-fade-slide-up delay-100 hover:scale-105 transition-transform duration-300 cursor-default">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
              UrSPI Smart Camera System 3D
            </div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 leading-tight animate-fade-slide-up delay-200">
              UrSPI Kamera Kuzatuv Tizimi
            </h1>
            
            <p className="mt-2.5 text-slate-300 max-w-lg text-xs sm:text-sm leading-relaxed font-light drop-shadow-md animate-fade-slide-up delay-300">
              UrSPI kameralarini interaktiv real vaqt rejimida kuzatib boring. Zamonaviy texnologiyalar yordamida binolar va xonalardagi xavfsizlik va nazoratni maksimal darajaga yetkazing.
            </p>

            {/* Badges Row with 360° Nazorat */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs font-mono animate-fade-slide-up delay-400">
              <span className="px-3 py-1 rounded-xl bg-[#070d1e]/80 border border-teal-400/30 text-teal-300 flex items-center gap-1.5 backdrop-blur-md hover:border-teal-400/60 hover:scale-105 transition-all duration-300 cursor-default">
                <Move3d className="w-3.5 h-3.5" /> 3D Maket
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#070d1e]/80 border border-sky-400/30 text-sky-300 flex items-center gap-1.5 backdrop-blur-md hover:border-sky-400/60 hover:scale-105 transition-all duration-300 cursor-default">
                <Compass className="w-3.5 h-3.5" /> Interaktiv Aylantirish
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#070d1e]/80 border border-violet-400/30 text-violet-300 flex items-center gap-1.5 backdrop-blur-md font-bold hover:border-violet-400/60 hover:scale-105 transition-all duration-300 cursor-default">
                <Layers className="w-3.5 h-3.5 text-violet-400" /> 360° Nazorat
              </span>
            </div>

            {/* LOGIN MODAL CARD - PLACED DIRECTLY UNDER 360° NAZORAT ON THE LEFT */}
            <div className="mt-5 w-full dark-glass-modal rounded-3xl p-5 sm:p-7 relative overflow-hidden max-w-md animate-fade-scale-in delay-500 animate-pulse-glow hover:border-teal-400/50 transition-all duration-300">
              {/* Top Header Badge inside Form - Centered Icon & Text */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 via-sky-400 to-violet-400 p-0.5 shadow-lg shadow-teal-500/30 mb-2.5 animate-float-subtle">
                  <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center">
                    <Camera className="w-6 h-6 text-teal-300 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
                  UrSPI <span className="bg-gradient-to-r from-teal-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">Camera System</span>
                </h2>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  {isAdminRoute ? '🛡️ Administrator Kirish (/admin)' : 'Xonalar & IP Kameralar Kuzatuvi'}
                </p>
              </div>

              {/* Error notification */}
              {error && (
                <div className="mb-4 p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-medium flex items-center gap-2 animate-shake">
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-1.5">
                    Foydalanuvchi Logini
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-teal-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Login"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-mono font-bold rounded-xl border border-white/15 bg-black/60 text-white placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Maxfiy Parol
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-teal-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm font-mono font-bold rounded-xl border border-white/15 bg-black/60 text-white placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-teal-400 via-sky-400 to-violet-400 hover:from-teal-300 hover:via-sky-300 hover:to-violet-300 text-slate-950 font-black rounded-xl shadow-lg shadow-teal-500/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span className="text-xs sm:text-sm font-black">TIZIMGA KIRISH</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom HUD when Fullscreen */}
      {isFullScreen && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#070d1e]/85 border border-white/10 backdrop-blur-xl shadow-2xl text-xs font-mono text-slate-300">
          <span className="flex items-center gap-2 text-teal-400">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
            3D Rendering: Online
          </span>
          <span className="opacity-30">|</span>
          <span className="text-slate-300">UrSPI 3D Control System</span>
        </div>
      )}
    </div>
  );
};
