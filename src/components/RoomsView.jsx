import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CameraStreamPlayer } from './CameraStreamPlayer';
import { Plus, Edit3, Trash2, Camera as CameraIcon, Check, X, Building, Info, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const RoomsView = () => {
  const { rooms, cameras, addRoom, updateRoom, deleteRoom, searchQuery, showIpAddresses, theme } = useApp();
  const isLight = theme === 'light';
  
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
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800 backdrop-blur-md'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h2 className={`text-xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Xonalar va IP Kameralar Kuzatuvi
            </h2>
            <p className={`text-xs mt-0.5 font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Jami xonalar: <span className="text-cyan-500 font-bold">{rooms.length} ta</span> | IP Kameralar: <span className="text-emerald-500 font-bold">{cameras.length} ta</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4.5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 self-stretch sm:self-auto justify-center cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>YANGI XONA QO'SHISH</span>
        </button>
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800/80 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto mb-3">
            <Building className="w-8 h-8 text-slate-400 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-slate-300">Xonalar topilmadi</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-mono">
            Qidiruv so'rovi bo'yicha hech qanday xona mos kelmadi yoki hali xonalar qo'shilmagan.
          </p>
        </div>
      )}

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => {
          // Find camera associated with this room
          const roomCamera = cameras.find(c => c.roomId === room.id);
          const isEditing = editingRoomId === room.id;

          return (
            <div
              key={room.id}
              className="glass-card rounded-2xl border border-slate-800/80 p-5 shadow-xl hover:border-slate-700/80 transition-all group flex flex-col justify-between"
            >
              {/* Card Header (Room Number & Room Name edit area) */}
              <div className="mb-4 flex items-start justify-between gap-3">
                {isEditing ? (
                  /* Inline Editing Form */
                  <div className="flex-1 space-y-2 bg-slate-950/80 p-3.5 rounded-xl border border-cyan-500/40">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-cyan-400">XONA RAQAMI</label>
                        <input
                          type="text"
                          value={editNumber}
                          onChange={(e) => setEditNumber(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono glass-input rounded-lg"
                          placeholder="masalan: 101"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-mono text-cyan-400">XONA NOMI</label>
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
                      <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs">
                        XONA № {room.number}
                      </span>
                      {roomCamera && (
                        <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          {showIpAddresses ? `IP: ${roomCamera.ip}` : 'KAMERA ONLINE'}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-extrabold transition-colors ${isLight ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-300'}`}>
                      {room.name}
                    </h3>
                    <p className={`text-xs font-mono mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {room.description || 'Tavsif ko\'rsatilmadi'}
                    </p>
                  </div>
                )}

                {/* Edit & Delete Action Buttons */}
                {!isEditing && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(room)}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-300 transition-all hover:scale-105"
                      title="Xona raqami va nomini tahrirlash"
                    >
                      <Edit3 className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-all hover:scale-105"
                      title="Xonani o'chirish"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
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
                  />
                ) : (
                  <div className="aspect-video bg-slate-950/80 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-2">
                      <CameraIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-xs font-bold text-slate-400">Kamera biriktirilmagan</p>
                    <p className="text-[11px] text-slate-600 font-mono mt-1">
                      Dashboard bo'limi orqali bu xonaga IP kamera biriktirishingiz mumkin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Yangi Xona Qo'shish */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md glass-panel border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                Yangi Xona Yaratish
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Xona Raqami *
                </label>
                <input
                  type="text"
                  required
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="Masalan: 402"
                  className="w-full px-3.5 py-2.5 text-xs font-mono glass-input rounded-xl focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Xona Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Masalan: Axborot Texnologiyalari Markazi"
                  className="w-full px-3.5 py-2.5 text-xs font-mono glass-input rounded-xl focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Xona Izohi / Qisqa Tavsifi
                </label>
                <input
                  type="text"
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="Masalan: 4-qavat, o'ng qanot"
                  className="w-full px-3.5 py-2.5 text-xs font-mono glass-input rounded-xl focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white bg-slate-900 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-cyan-500/20"
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
