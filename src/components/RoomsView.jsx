import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CameraStreamPlayer } from './CameraStreamPlayer';
import { Plus, Edit3, Trash2, Camera as CameraIcon, Check, X, Building, Info, SlidersHorizontal, RefreshCw, Eye, EyeOff, Search } from 'lucide-react';
import { FaPowerOff } from 'react-icons/fa6';
import { MdOutlineEdit } from 'react-icons/md';

export const RoomsView = () => {
  const { currentUser, rooms, cameras, addRoom, updateRoom, deleteRoom, searchQuery, setSearchQuery, showIpAddresses, setShowIpAddresses, theme } = useApp();
  const isLight = theme === 'light';
  const isAdmin = currentUser?.role === 'admin';
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');

  // Inline Editing state
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editNumber, setEditNumber] = useState('');
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Powered off cameras state
  const [disabledCameraIds, setDisabledCameraIds] = useState([]);

  const toggleCameraPower = (cameraId) => {
    if (!cameraId) return;
    setDisabledCameraIds(prev =>
      prev.includes(cameraId)
        ? prev.filter(id => id !== cameraId)
        : [...prev, cameraId]
    );
  };

  // Start inline editing
  const startEdit = (room) => {
    setEditingRoomId(room.id);
    setEditNumber(room.number);
    setEditName(room.name);
    setEditDesc(room.description || '');
  };

  const saveEdit = (id) => {
    if (!editNumber || !editName) return;
    updateRoom(id, { number: editNumber, name: editName, description: editDesc });
    setEditingRoomId(null);
  };

  const cancelEdit = () => {
    setEditingRoomId(null);
  };

  // Add room submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const res = addRoom({ number: newRoomNumber, name: newRoomName, description: newRoomDesc });
    if (res.success) {
      setIsAddModalOpen(false);
      setNewRoomNumber('');
      setNewRoomName('');
      setNewRoomDesc('');
    }
  };

  // Filter rooms by search query
  const filteredRooms = rooms.filter(room => {
    const q = searchQuery.toLowerCase();
    return (
      room.number.toLowerCase().includes(q) ||
      room.name.toLowerCase().includes(q) ||
      (room.description && room.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
        isLight ? 'bg-white/90 border-teal-100 shadow-sm shadow-teal-900/5' : 'bg-white/[0.03] border-white/10 backdrop-blur-md'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${isLight ? 'bg-teal-50 border border-teal-200' : 'bg-teal-400/15 border border-teal-400/30'}`}>
            <Building className={`w-6 h-6 ${isLight ? 'text-teal-600' : 'text-teal-300'}`} />
          </div>
          <div>
            <h2 className={`text-xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              UrSPI Xonalar va IP Kameralar Kuzatuvi
            </h2>
            <p className={`text-xs mt-0.5 font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Jami xonalar: <span className={`${isLight ? 'text-teal-600' : 'text-teal-300'} font-bold`}>{rooms.length} ta</span> | IP Kameralar: <span className="text-emerald-500 font-bold">{cameras.length} ta</span>
            </p>
          </div>
        </div>

        {/* Right side controls: Search, IP toggle, Add button */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 md:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-teal-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Xonalarni izlash..."
              className={`w-full pl-9 pr-7 py-2 text-xs font-mono rounded-xl border transition-all ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-teal-500' : 'bg-[#0a101c] border-white/10 text-white focus:border-teal-400'
              }`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-400 via-sky-400 to-violet-400 hover:from-teal-300 hover:via-sky-300 hover:to-violet-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 justify-center cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>YANGI XONA QO'SHISH</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className={`text-center py-16 rounded-3xl border ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
            <Building className={`w-8 h-8 animate-pulse ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
          </div>
          <h3 className={`text-base font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Xonalar topilmadi</h3>
          <p className={`text-xs max-w-sm mx-auto mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            Qidiruv so'rovi bo'yicha hech qanday xona mos kelmadi yoki hali xonalar qo'shilmagan.
          </p>
        </div>
      )}

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => {
          // Find camera associated with this room
          const roomCamera = cameras.find(c => c.roomId === room.id);
          const isCameraOff = roomCamera ? disabledCameraIds.includes(roomCamera.id) : true;
          const isEditing = editingRoomId === room.id;

          return (
            <div
              key={room.id}
              className={`glass-card rounded-2xl p-5 shadow-xl transition-all group flex flex-col justify-between ${
                isLight ? 'border-slate-200 hover:border-teal-300' : 'border-white/10 hover:border-teal-400/40'
              }`}
            >
              {/* Card Header (Room Number & Room Name edit area) */}
              <div className="mb-4 flex items-start justify-between gap-3">
                {isEditing ? (
                  /* Inline Editing Form */
                  <div className={`flex-1 space-y-2 p-3.5 rounded-xl border ${isLight ? 'bg-teal-50/70 border-teal-200' : 'bg-slate-950/80 border-teal-400/40'}`}>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className={`text-[10px] font-mono ${isLight ? 'text-teal-700' : 'text-teal-300'}`}>XONA RAQAMI</label>
                        <input
                          type="text"
                          value={editNumber}
                          onChange={(e) => setEditNumber(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono glass-input rounded-lg"
                          placeholder="masalan: 101"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className={`text-[10px] font-mono ${isLight ? 'text-teal-700' : 'text-teal-300'}`}>XONA NOMI</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono glass-input rounded-lg"
                          placeholder="masalan: Majlislar zali"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400">TAVSIF / IZOH</label>
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono glass-input rounded-lg"
                        placeholder="Qisqacha tavsifi"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white bg-slate-900 rounded-lg flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" /> Bekor qilish
                      </button>
                      <button
                        onClick={() => saveEdit(room.id)}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 shadow"
                      >
                        <Check className="w-4 h-4" /> SAQLASH
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Display Mode */
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-xs ${isLight ? 'bg-teal-50 border border-teal-200 text-teal-700' : 'bg-gradient-to-r from-teal-500/20 to-sky-500/20 border border-teal-400/40 text-teal-200'}`}>
                        XONA № {room.number}
                      </span>
                      {roomCamera && (
                        <span className={`flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-md ${
                          isCameraOff
                            ? isLight ? 'bg-rose-50 border border-rose-200 text-rose-600' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                            : isLight ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isCameraOff ? 'bg-rose-500' : 'bg-emerald-400 animate-ping'}`}></span>
                          <FaPowerOff className={`w-3 h-3 ${isCameraOff ? 'text-rose-400' : 'text-emerald-400'}`} />
                          {isCameraOff ? 'KAMERA O\'CHIRILGAN' : (showIpAddresses ? `IP: ${roomCamera.ip}` : 'KAMERA ONLINE')}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-extrabold transition-colors ${isLight ? 'text-slate-900 group-hover:text-teal-700' : 'text-white group-hover:text-teal-200'}`}>
                      {room.name}
                    </h3>
                    <p className={`text-xs font-mono mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {room.description || 'Tavsif ko\'rsatilmadi'}
                    </p>
                  </div>
                )}
              </div>

              {/* Video Player or No-Camera Placeholder */}
              <div className="mt-2">
                {roomCamera ? (
                  <CameraStreamPlayer
                    camera={roomCamera}
                    roomName={room.name}
                    roomNumber={room.number}
                    isPowerOn={!isCameraOff}
                    onTogglePower={() => toggleCameraPower(roomCamera.id)}
                  />
                ) : (
                  <div className={`aspect-video border border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${isLight ? 'bg-white border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                      <FaPowerOff className={`w-6 h-6 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                    <p className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Kamera biriktirilmagan (O'chirilgan)</p>
                    <p className={`text-[11px] font-mono mt-1 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                      Dashboard bo'limi orqali bu xonaga IP kamera biriktirishingiz mumkin.
                    </p>
                  </div>
                )}
              </div>

              {/* Card Bottom Footer: Edit & Delete (Trash) Action Buttons (Admin Only) */}
              {!isEditing && isAdmin && (
                <div className={`mt-3 pt-3 flex items-center justify-between border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Xona № {room.number}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 1) Power Icon button */}
                    <button
                      onClick={() => roomCamera && toggleCameraPower(roomCamera.id)}
                      disabled={!roomCamera}
                      className={`p-2 rounded-xl border transition-all hover:scale-110 flex items-center justify-center cursor-pointer ${
                        roomCamera
                          ? !isCameraOff
                            ? isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-600 shadow-sm shadow-emerald-500/20' : 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                            : isLight ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm shadow-rose-500/20' : 'bg-rose-500/15 border-rose-400/50 text-rose-400 shadow-lg shadow-rose-500/10'
                          : isLight ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed' : 'bg-white/5 border-white/10 text-slate-500 opacity-50 cursor-not-allowed'
                      }`}
                      title={
                        !roomCamera
                          ? "Kamera biriktirilmagan"
                          : !isCameraOff
                          ? "Kamerani o'chirish (Power Off)"
                          : "Kamerani yoqish (Power On)"
                      }
                    >
                      <FaPowerOff className={`w-4 h-4 ${roomCamera ? (!isCameraOff ? 'text-emerald-400' : 'text-rose-400') : 'text-slate-500'}`} />
                    </button>

                    {/* 2) Tahrirlash button */}
                    <button
                      onClick={() => startEdit(room)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-teal-400/50 hover:text-teal-200'
                      }`}
                      title="Xona raqami va nomini tahrirlash"
                    >
                      <MdOutlineEdit className="w-5 h-5 text-teal-400" />
                      <span>Tahrirlash</span>
                    </button>

                    {/* 3) O'chirish button */}
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer ${
                        isLight
                          ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 hover:border-rose-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/50'
                      }`}
                      title="Xonani o'chirish (Trash)"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>O'chirish</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Yangi Xona Qo'shish */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05080f]/80 backdrop-blur-sm">
          <div className={`relative w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <div className={`flex items-center justify-between pb-4 border-b mb-4 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Building className={`w-4 h-4 ${isLight ? 'text-teal-600' : 'text-teal-300'}`} />
                Yangi Xona Yaratish
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className={`p-1 rounded-lg ${isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Xona Raqami *
                </label>
                <input
                  type="text"
                  required
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="Masalan: 402"
                  className="w-full px-3.5 py-2.5 text-xs font-mono glass-input rounded-xl focus:ring-2 focus:ring-teal-400/40"
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Xona Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Masalan: Axborot Texnologiyalari Markazi"
                  className="w-full px-3.5 py-2.5 text-xs font-mono glass-input rounded-xl focus:ring-2 focus:ring-teal-400/40"
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Xona Izohi / Qisqa Tavsifi
                </label>
                <input
                  type="text"
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="Masalan: 4-qavat, o'ng qanot"
                  className="w-full px-3.5 py-2.5 text-xs font-mono glass-input rounded-xl focus:ring-2 focus:ring-teal-400/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 text-xs font-mono rounded-xl ${isLight ? 'text-slate-500 hover:text-slate-800 bg-slate-100' : 'text-slate-400 hover:text-white bg-white/5'}`}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 via-sky-400 to-violet-400 hover:from-teal-300 hover:via-sky-300 hover:to-violet-300 rounded-xl shadow-lg shadow-teal-500/20"
                >
                  SAQLASH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
