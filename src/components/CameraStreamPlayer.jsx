import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Maximize2, Camera, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { FaPowerOff } from 'react-icons/fa6';

export const CameraStreamPlayer = ({ camera, roomName, roomNumber, isPowerOn: controlledPowerOn, onTogglePower }) => {
  const { showIpAddresses } = useApp();
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [internalPowerOn, setInternalPowerOn] = useState(true);
  const isPowerOn = controlledPowerOn !== undefined ? controlledPowerOn : internalPowerOn;

  const handleTogglePower = () => {
    if (onTogglePower) {
      onTogglePower();
    } else {
      setInternalPowerOn(!internalPowerOn);
    }
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [ptzAction, setPtzAction] = useState(null);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);
  const [streamError, setStreamError] = useState('');
  const [useSnapshot, setUseSnapshot] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const [reloadKey, setReloadKey] = useState(0);

  const streamSrc = camera?.id ? `/api/cameras/${camera.id}/stream?k=${reloadKey}` : '';
  const snapshotSrc = camera?.id ? `/api/cameras/${camera.id}/snapshot?t=${Date.now()}` : '';
  const [liveSnapshot, setLiveSnapshot] = useState(snapshotSrc);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setStreamError('');
    setUseSnapshot(false);
  }, [camera?.id, isPowerOn]);

  useEffect(() => {
    if (!isPowerOn || !useSnapshot || !camera?.id) return undefined;
    setLiveSnapshot(`/api/cameras/${camera.id}/snapshot?t=${Date.now()}`);
    const timer = setInterval(() => {
      setLiveSnapshot(`/api/cameras/${camera.id}/snapshot?t=${Date.now()}`);
    }, 700);
    return () => clearInterval(timer);
  }, [isPowerOn, useSnapshot, camera?.id]);

  const handleTakeSnapshot = async () => {
    if (!camera?.id) return;
    try {
      const res = await fetch(`/api/cameras/${camera.id}/snapshot`);
      if (!res.ok) throw new Error('snapshot failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Snapshot_${camera?.name || 'Camera'}_${Date.now()}.jpg`;
      link.click();
      URL.revokeObjectURL(url);
      setSnapshotSuccess(true);
      setTimeout(() => setSnapshotSuccess(false), 2500);
    } catch {
      const img = imgRef.current;
      if (!img) return;
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 640;
      canvas.height = img.naturalHeight || 360;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg');
      link.download = `Snapshot_${camera?.name || 'Camera'}_${Date.now()}.jpg`;
      link.click();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  const handlePtz = (direction) => {
    setPtzAction(direction);
    setTimeout(() => setPtzAction(null), 1200);
  };

  const retryStream = () => {
    setStreamError('');
    setUseSnapshot(false);
    setReloadKey((k) => k + 1);
  };

  const timeStr = clock.toLocaleTimeString('uz-UZ', { hour12: false });
  const dateStr = clock.toISOString().split('T')[0];

  return (
    <div ref={containerRef} className="relative group bg-[#05080f] rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all">
      {!isPowerOn ? (
        <div className="w-full aspect-video bg-[#070b14] rounded-xl flex flex-col items-center justify-center p-6 text-center border border-rose-500/20">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-3 animate-pulse">
            <FaPowerOff className="w-7 h-7 text-rose-500" />
          </div>
          <h4 className="text-xs font-bold text-slate-200 font-mono tracking-wider">KAMERA ELEKTR MANBASI O'CHIRILGAN</h4>
          <p className="text-[11px] text-slate-400 font-mono mt-1 max-w-xs">
            IP Kamera ta'minoti to'xtatilgan (Power Off status). Jonli efirni davom ettirish uchun yoqing.
          </p>
          <button
            onClick={handleTogglePower}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold font-mono text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <FaPowerOff className="w-3.5 h-3.5" />
            <span>KAMERANI YOQISH (POWER ON)</span>
          </button>
        </div>
      ) : (
        <div className="relative w-full aspect-video bg-slate-950">
          {streamSrc && (
            <img
              ref={imgRef}
              src={useSnapshot ? liveSnapshot : streamSrc}
              alt={camera?.name || 'Kamera'}
              className="w-full h-full object-cover block bg-slate-900"
              onError={() => {
                if (!useSnapshot) {
                  setUseSnapshot(true);
                  setStreamError("Jonli oqim ulanmadi. Snapshot rejimida urinib ko'rilmoqda.");
                } else {
                  setStreamError("Kameradan tasvir olinmadi. IP/RTSP manzil va tarmoqni tekshiring.");
                }
              }}
            />
          )}

          <div className="absolute top-3 left-3 pointer-events-none max-w-[58%] drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.95)]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-white">REC [LIVE]</span>
            </div>
          </div>

          <div className="absolute top-3 right-3 text-right pointer-events-none drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.95)]">
            <div className="text-[12px] font-mono font-bold text-emerald-400">{timeStr}</div>
            <div className="text-[10px] font-mono text-slate-200">{dateStr} | XONA: {roomNumber || ''}</div>
          </div>

          {streamError && (
            <div className="absolute inset-x-4 bottom-16 bg-rose-950/80 border border-rose-500/40 text-rose-100 text-[11px] font-mono rounded-lg px-3 py-2 flex items-center justify-between gap-2">
              <span>{streamError}</span>
              <button onClick={retryStream} className="shrink-0 px-2 py-1 rounded bg-rose-500 text-white font-bold">Qayta</button>
            </div>
          )}
        </div>
      )}

      {ptzAction && (
        <div className="absolute inset-0 bg-teal-950/40 backdrop-blur-[2px] flex items-center justify-center animate-fade-in pointer-events-none">
          <div className="bg-slate-900/90 border border-teal-400/50 rounded-lg px-4 py-2 text-teal-300 font-mono text-sm flex items-center gap-2 shadow-lg">
            <RefreshCw className="w-4 h-4 animate-spin text-teal-300" />
            PTZ HARAKATI: <span className="font-bold uppercase text-white">{ptzAction}</span>
          </div>
        </div>
      )}

      {snapshotSuccess && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-bold font-mono text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Camera className="w-4 h-4" />
          RASM XOTIRAGA SAQLANDI!
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/80 border border-slate-700/60 rounded-lg p-1 text-xs">
            <button onClick={() => handlePtz('Yuqoriga')} className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-teal-300 font-mono" title="Yuqoriga">▲</button>
            <button onClick={() => handlePtz('Pastga')} className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-teal-300 font-mono" title="Pastga">▼</button>
            <button onClick={() => handlePtz('Chapga')} className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-teal-300 font-mono" title="Chapga">◄</button>
            <button onClick={() => handlePtz("O'ngga")} className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-teal-300 font-mono" title="O'ngga">►</button>
            <button onClick={() => handlePtz('Zoom +')} className="hover:bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 hover:text-teal-300 font-mono border-l border-slate-700 ml-1 pl-1.5" title="Yaqinlashtirish">+ Zoom</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioOn(!isAudioOn)}
            className={`p-2.5 rounded-xl border text-xs transition-all hover:scale-105 ${isAudioOn ? 'bg-teal-400/20 border-teal-400/50 text-teal-200' : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white'}`}
            title={isAudioOn ? "Ovozni o'chirish" : 'Ovozni yoqish'}
          >
            {isAudioOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={handleTakeSnapshot}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all hover:scale-105"
            title="Rasmga olish (Snapshot)"
          >
            <Camera className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-teal-300 hover:border-teal-400/50 transition-all hover:scale-105"
            title="To'liq ekranga o'tkazish"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
