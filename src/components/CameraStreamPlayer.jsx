import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Maximize2, Camera, RefreshCw, Radio, Lock, ShieldAlert, Volume2, VolumeX, Eye } from 'lucide-react';

export const CameraStreamPlayer = ({ camera, roomName, roomNumber }) => {
  const { showIpAddresses } = useApp();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [ptzAction, setPtzAction] = useState(null);
  const [fps, setFps] = useState(60);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);

  // Dynamic canvas surveillance stream generator
  useEffect(() => {
    let animationFrameId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let phase = Math.random() * 100;
    let boxX = 150;
    let boxY = 100;
    let boxDx = 1.2;
    let boxDy = 0.8;

    const render = () => {
      phase += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Background dark surveillance grid pattern
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0a111e');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#050a12');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Animated Motion Detection / Simulated Surveillance View
      // Draw radar scan line effect
      const scanY = (Math.sin(phase * 0.8) + 1) * 0.5 * height;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 5);
      scanGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      scanGrad.addColorStop(1, 'rgba(16, 185, 129, 0.2)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, width, 25);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // Bouncing target detection box
      boxX += boxDx;
      boxY += boxDy;
      if (boxX < 40 || boxX > width - 140) boxDx *= -1;
      if (boxY < 40 || boxY > height - 100) boxDy *= -1;

      // Target object outline
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, 90, 60);

      // Target corners
      const cLen = 10;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      // Top-Left
      ctx.beginPath(); ctx.moveTo(boxX - 5, boxY - 5 + cLen); ctx.lineTo(boxX - 5, boxY - 5); ctx.lineTo(boxX - 5 + cLen, boxY - 5); ctx.stroke();
      // Top-Right
      ctx.beginPath(); ctx.moveTo(boxX + 95 - cLen, boxY - 5); ctx.lineTo(boxX + 95, boxY - 5); ctx.lineTo(boxX + 95, boxY - 5 + cLen); ctx.stroke();

      // Target Label
      ctx.fillStyle = '#10b981';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`HARAKAT DETEKSIYASI (98.4%)`, boxX, boxY - 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`OBJ_ID: #8492`, boxX + 5, boxY + 30);

      // Crosshair in center
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(centerX - 15, centerY); ctx.lineTo(centerX + 15, centerY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(centerX, centerY - 15); ctx.lineTo(centerX, centerY + 15); ctx.stroke();
      ctx.beginPath(); ctx.arc(centerX, centerY, 8, 0, Math.PI * 2); ctx.stroke();

      // 3. HUD Overlay Details
      // REC Indicator
      const isRedDot = Math.floor(Date.now() / 600) % 2 === 0;
      ctx.fillStyle = isRedDot ? '#ef4444' : '#7f1d1d';
      ctx.beginPath();
      ctx.arc(25, 25, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText('REC [LIVE]', 38, 29);

      // Camera Name & IP overlay at bottom left
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(15, height - 45, 260, 32);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.strokeRect(15, height - 45, 260, 32);

      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`KAMERA: ${camera?.name || 'IP KAMERA'}`, 25, height - 30);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono", monospace';
      if (showIpAddresses && camera?.ip) {
        ctx.fillText(`IP: ${camera.ip}:${camera?.port || '554'} (${camera?.protocol || 'RTSP'})`, 25, height - 16);
      } else {
        ctx.fillText(`HOLAT: JONLI ULANISH (${camera?.protocol || 'HD STREAM'})`, 25, height - 16);
      }

      // Timestamp & Room info at top right
      const now = new Date();
      const timeStr = now.toLocaleTimeString('uz-UZ', { hour12: false }) + '.' + Math.floor(now.getMilliseconds() / 100);
      const dateStr = now.toISOString().split('T')[0];

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(width - 210, 15, 195, 38);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(width - 210, 15, 195, 38);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText(timeStr, width - 200, 32);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`${dateStr} | XONA: ${roomNumber || ''}`, width - 200, 46);

      // Technical Signal Overlay at bottom right
      ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`SIGNAL: 99% | ${camera?.ping || 14}ms | 60FPS`, width - 170, height - 20);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [camera, roomNumber]);

  // Take Snapshot feature
  const handleTakeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `Snapshot_${camera?.name || 'Camera'}_${Date.now()}.png`;
    link.click();

    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 2500);
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.log(err));
      setIsFullscreen(false);
    }
  };

  // PTZ Control animation trigger
  const handlePtz = (direction) => {
    setPtzAction(direction);
    setTimeout(() => setPtzAction(null), 1200);
  };

  return (
    <div ref={containerRef} className="relative group bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl transition-all">
      {/* Canvas Video Stream */}
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="w-full h-auto aspect-video object-cover block bg-slate-900"
      />

      {/* PTZ Action Overlay */}
      {ptzAction && (
        <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-[2px] flex items-center justify-center animate-fade-in pointer-events-none">
          <div className="bg-slate-900/90 border border-cyan-500/50 rounded-lg px-4 py-2 text-cyan-400 font-mono text-sm flex items-center gap-2 shadow-lg">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            PTZ HARAKATI: <span className="font-bold uppercase text-white">{ptzAction}</span>
          </div>
        </div>
      )}

      {/* Snapshot Alert */}
      {snapshotSuccess && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-bold font-mono text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Camera className="w-4 h-4" />
          RASM XOTIRAGA SAQLANDI!
        </div>
      )}

      {/* Hover Controls Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* PTZ Buttons */}
          <div className="flex items-center bg-slate-900/80 border border-slate-700/60 rounded-lg p-1 text-xs">
            <button onClick={() => handlePtz('Yuqoriga')} className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-cyan-400 font-mono" title="Yuqoriga">▲</button>
            <button onClick={() => handlePtz('Pastga')} className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-cyan-400 font-mono" title="Pastga">▼</button>
            <button onClick={() => handlePtz('Chapga')} className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-cyan-400 font-mono" title="Chapga">◄</button>
            <button onClick={() => handlePtz('O\'ngga')} className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-cyan-400 font-mono" title="O'ngga">►</button>
            <button onClick={() => handlePtz('Zoom +')} className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-cyan-400 font-mono border-l border-slate-700 ml-1 pl-1.5" title="Yaqinlashtirish">+ Zoom</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={() => setIsAudioOn(!isAudioOn)}
            className={`p-2.5 rounded-xl border text-xs transition-all hover:scale-105 ${isAudioOn ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white'}`}
            title={isAudioOn ? 'Ovozni o\'chirish' : 'Ovozni yoqish'}
          >
            {isAudioOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Snapshot button */}
          <button
            onClick={handleTakeSnapshot}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all hover:scale-105"
            title="Rasmga olish (Snapshot)"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all hover:scale-105"
            title="To'liq ekranga o'tkazish"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
