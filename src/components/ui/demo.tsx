'use client'

import React, { useState, useEffect } from 'react';
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Maximize2, Minimize2, Move3d, Compass, Layers, ShieldCheck } from 'lucide-react';

interface SplineSceneBasicProps {
  className?: string;
  isLoginLayout?: boolean;
}

export function SplineSceneBasic({ className = "", isLoginLayout = false }: SplineSceneBasicProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Handle ESC key to exit fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#030611] w-screen h-screen flex flex-col overflow-hidden animate-in fade-in duration-300">
        {/* Spotlight background */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Top Header Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between p-4 rounded-2xl bg-[#070d1e]/80 border border-teal-500/30 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Move3d className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                UrSPI Kamera Kuzatuv Tizimi
                <span className="px-2 py-0.5 rounded-full bg-teal-400/15 border border-teal-400/40 text-teal-300 text-[10px] font-mono">
                  TÕLIQ EKRAN MODE
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Real vaqt rejimida 3D maketni sichqoncha bilan aylantirish va zumlash mumkin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              <span>🎮 Aylantirish: chap tugma</span>
              <span className="opacity-40">|</span>
              <span>🔍 Zumlash: scroller</span>
            </div>
            <button
              onClick={toggleFullScreen}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Chiqish (ESC)</span>
            </button>
          </div>
        </div>

        {/* Fullscreen 3D Canvas */}
        <div className="w-full h-full relative">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>

        {/* Floating Bottom HUD */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#070d1e]/85 border border-white/10 backdrop-blur-xl shadow-2xl text-xs font-mono text-slate-300">
          <span className="flex items-center gap-2 text-teal-400">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
            3D Rendering: Online
          </span>
          <span className="opacity-30">|</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            UrSPI Kameralar Boshqaruvi
          </span>
          <span className="opacity-30">|</span>
          <span className="text-slate-400">UrSPI 3D Control System</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full relative overflow-hidden bg-slate-950/90 border border-teal-500/20 shadow-2xl rounded-3xl ${className || (isLoginLayout ? 'h-full min-h-[500px] lg:min-h-full flex flex-col justify-between' : 'h-[520px]')}`}>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      {/* Fullscreen Trigger Button */}
      <button
        onClick={toggleFullScreen}
        title="Tõliq ekranda ko'rish"
        className="absolute top-4 right-4 z-30 px-3 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/35 border border-teal-400/40 text-teal-300 text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all shadow-lg hover:shadow-teal-500/25 active:scale-95 cursor-pointer"
      >
        <Maximize2 className="w-4 h-4" />
        <span className="hidden sm:inline">Tõliq Ekranda Ko'rish</span>
      </button>

      <div className="flex h-full flex-col lg:flex-row">
        {/* Left content */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 pl-8 sm:pl-12 lg:pl-16 relative z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-bold w-fit mb-4 shadow-sm backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            UrSPI Smart Camera System 3D
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 leading-tight">
            UrSPI Kamera Kuzatuv Tizimi
          </h1>
          <p className="mt-4 text-slate-300 max-w-lg text-xs sm:text-sm md:text-base leading-relaxed font-light">
            UrSPI kameralarini interaktiv real vaqt rejimida kuzatib boring. Zamonaviy texnologiyalar yordamida binolar va xonalardagi xavfsizlik va nazoratni maksimal darajaga yetkazing.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-teal-300 flex items-center gap-1.5">
              <Move3d className="w-3.5 h-3.5" /> 3D Maket
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-sky-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Interaktiv Aylantirish
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-violet-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 360° Nazorat
            </span>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative min-h-[300px] lg:min-h-full overflow-hidden">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full transform lg:translate-x-28 xl:translate-x-36 scale-105"
          />
        </div>
      </div>
    </div>
  );
}

