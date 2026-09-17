import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoomsView } from './RoomsView';
import {
  LayoutDashboard,
  Users,
  Camera as CameraIcon,
  Building,
  Activity,
  Menu,
  Search,
  RotateCw,
  Sparkles,
  User,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Server,
  KeyRound,
  Wifi,
  Shield,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  Clock,
  Zap,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  X
} from 'lucide-react';

export const DashboardView = () => {
  const {
    currentUser,
    users,
    addUser,
    deleteUser,
    cameras,
    addCamera,
    deleteCamera,
    rooms,
    testCameraIp,
    logs,
    showIpAddresses,
    setShowIpAddresses,
    setActiveTab,
    logout,
    theme,
    toggleTheme
  } = useApp();

  // Active sidebar nav item: 'dashboard' | 'users' | 'cameras' | 'rooms' | 'logs'
  const [navTab, setNavTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddCamModalOpen, setIsAddCamModalOpen] = useState(false);

  // User form states
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('operator');
  const [userMsg, setUserMsg] = useState(null);

  // Camera form states
  const [camName, setCamName] = useState('');
  const [camIp, setCamIp] = useState('');
  const [camPort, setCamPort] = useState('554');
  const [camProtocol, setCamProtocol] = useState('RTSP');
  const [camRoomId, setCamRoomId] = useState('');
  const [camMsg, setCamMsg] = useState(null);
  const [pingResult, setPingResult] = useState(null);

  // Password visibility map
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle Add User
  const handleAddUser = (e) => {
    e.preventDefault();
    setUserMsg(null);
    const res = addUser({ fullName: newFullName, username: newUsername, password: newPassword, role: newRole });
    if (res.success) {
      setUserMsg({ type: 'success', text: `Foydalanuvchi "${newFullName || newUsername}" muvaffaqiyatli yaratildi!` });
      setNewFullName('');
      setNewUsername('');
      setNewPassword('');
      setTimeout(() => {
        setIsAddUserModalOpen(false);
        setUserMsg(null);
      }, 800);
    } else {
      setUserMsg({ type: 'error', text: res.message });
    }
  };

  // Handle Add Camera IP
  const handleAddCamera = (e) => {
    e.preventDefault();
    setCamMsg(null);
    const res = addCamera({
      name: camName,
      ip: camIp,
      port: camPort,
      protocol: camProtocol,
      roomId: camRoomId
    });
    if (res.success) {
      setCamMsg({ type: 'success', text: `Kamera "${camName}" muvaffaqiyatli qo'shildi!` });
      setCamName('');
      setCamIp('');
      setCamPort('554');
      setCamRoomId('');
      setPingResult(null);
      setTimeout(() => {
        setIsAddCamModalOpen(false);
        setCamMsg(null);
      }, 800);
    } else {
      setCamMsg({ type: 'error', text: res.message });
    }
  };

  const handleTestIp = () => {
    if (!camIp) {
      setCamMsg({ type: 'error', text: 'Iltimos, IP manzilni kiriting!' });
      return;
    }
    const res = testCameraIp(camIp);
    setPingResult(res);
  };

  const onlineCamerasCount = cameras.filter(c => c.status === 'online').length;

  const isLight = theme === 'light';
  const cardClass = isLight ? 'bg-white/90 border border-slate-200 text-slate-800 shadow-sm shadow-teal-900/5' : 'bg-[#12182a]/90 border border-white/[0.06] text-white shadow-xl shadow-black/20';
  const subCardClass = isLight ? 'bg-slate-50 border border-slate-200 text-slate-800' : 'bg-[#0a101c] border border-white/10 text-slate-200';
  const textTitleClass = isLight ? 'text-slate-900' : 'text-white';
  const textSubClass = isLight ? 'text-slate-600' : 'text-slate-400';
  const inputClass = isLight ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-teal-500' : 'bg-[#0a101c] border border-white/10 text-white placeholder:text-slate-500 focus:border-teal-400';
  const labelClass = isLight ? 'block text-xs font-mono text-slate-700 uppercase mb-1' : 'block text-xs font-mono text-slate-300 uppercase mb-1';
  const tableHeaderClass = isLight ? 'bg-teal-50 text-teal-800 uppercase text-[11px] font-bold' : 'bg-[#151c33] text-slate-300 uppercase text-[11px] font-bold';
  const tableThClass = isLight ? 'border border-slate-200 px-3.5 py-2.5 font-bold text-slate-700 bg-teal-50' : 'border border-[#222c4a] px-3.5 py-2.5 font-bold text-slate-300 bg-[#151c33]';
  const tableTdClass = isLight ? 'border border-slate-200 px-3.5 py-2.5 text-slate-800' : 'border border-[#222c4a] px-3.5 py-2.5 text-slate-200';
  const tableRowClass = isLight ? 'hover:bg-teal-50/70 text-slate-800 transition-colors even:bg-slate-50/60' : 'hover:bg-[#10172a] text-slate-200 transition-colors even:bg-[#0a0e1a]/40';
  const primaryBtn = 'px-4 py-2.5 bg-gradient-to-r from-teal-400 via-sky-400 to-violet-400 hover:from-teal-300 hover:via-sky-300 hover:to-violet-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer';
  const navActive = isLight
    ? 'bg-gradient-to-r from-teal-500 to-sky-500 text-white font-bold shadow-lg shadow-teal-500/20'
    : 'bg-gradient-to-r from-teal-400 to-sky-400 text-slate-950 font-bold shadow-lg shadow-teal-400/20';
  const navIdle = isLight
    ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
    : 'text-slate-400 hover:text-white hover:bg-white/5';
  const navBadgeIdle = isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-slate-300';
  const navBadgeActive = isLight ? 'bg-white/25 text-white' : 'bg-slate-950/25 text-slate-950';

  return (
    <div className={`flex h-[calc(100vh-4rem)] font-sans overflow-hidden border-t ${
      theme === 'light' ? 'bg-transparent text-slate-800 border-teal-100' : 'bg-transparent text-slate-100 border-white/5'
    }`}>
      
      {/* LEFT SIDEBAR */}
      <aside className={`flex flex-col justify-between transition-all duration-300 z-30 border-r ${
        theme === 'light' ? 'bg-white/90 border-teal-100' : 'bg-[#0b101c]/90 border-white/5'
      } ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div>
          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            
            {/* 1. Dashboard tab */}
            <button
              onClick={() => setNavTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                navTab === 'dashboard' ? navActive : navIdle
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>Dashboard</span>}
              </div>
            </button>

            {/* 2. Kameralar (IP Boshqaruvi) tab */}
            <button
              onClick={() => setNavTab('cameras')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                navTab === 'cameras' ? navActive : navIdle
              }`}
            >
              <div className="flex items-center gap-3">
                <CameraIcon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>Kameralar (IP Nomi)</span>}
              </div>
              {sidebarOpen && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  navTab === 'cameras' ? navBadgeActive : navBadgeIdle
                }`}>
                  {cameras.length}
                </span>
              )}
            </button>

            {/* 3. Xonalar kuzatuvi */}
            <button
              onClick={() => setNavTab('rooms')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                navTab === 'rooms' ? navActive : navIdle
              }`}
            >
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>Xonalar Kuzatuvi</span>}
              </div>
              {sidebarOpen && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  navTab === 'rooms' ? navBadgeActive : navBadgeIdle
                }`}>
                  {rooms.length}
                </span>
              )}
            </button>

            {/* 4. Foydalanuvchilar (Login/Parol) tab */}
            <button
              onClick={() => setNavTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                navTab === 'users' ? navActive : navIdle
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>Foydalanuvchilar (Login)</span>}
              </div>
              {sidebarOpen && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  navTab === 'users' ? navBadgeActive : navBadgeIdle
                }`}>
                  {users.length}
                </span>
              )}
            </button>

            {/* 5. Tizim Loglari */}
            <button
              onClick={() => setNavTab('logs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                navTab === 'logs' ? navActive : navIdle
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>Tizim Loglari</span>}
              </div>
            </button>

          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className={`p-3 border-t ${isLight ? 'border-teal-100' : 'border-white/5'}`}>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isLight
                ? 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100'
                : 'border-violet-400/30 hover:border-violet-400/60 bg-violet-500/10 text-violet-300 hover:text-violet-200'
            }`}
          >
            {sidebarOpen ? (
              <>
                <span>Kuzatuv Ekraniga Qaytish</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <ArrowUpRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* MAIN RIGHT CONTAINER */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${
        theme === 'light' ? 'bg-transparent' : 'bg-transparent'
      }`}>

        {/* DASHBOARD BODY CONTENT (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: MAIN DASHBOARD VIEW (Matching screenshot design) */}
          {navTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Section Header */}
              <div>
                <h3 className={`text-xl font-extrabold tracking-tight ${textTitleClass}`}>Umumiy Statistika & Tahlil</h3>
                <p className={`text-xs font-mono mt-0.5 ${textSubClass}`}>
                  Real-vaqtdagi kameralar, xonalar hamda foydalanuvchilarning tahlili va ko'rsatkichlari
                </p>
              </div>

              {/* 6 METRIC CARDS GRID (Exact 6 cards layout from screenshot) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                
                {/* Card 1: Jami Kameralar */}
                <div className={`${cardClass} rounded-2xl p-5 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
                      <CameraIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`text-2xl font-black ${textTitleClass}`}>{cameras.length}</h4>
                      <p className={`text-xs font-semibold mt-0.5 ${textSubClass}`}>Jami Kameralar</p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Online IP Oqimlar */}
                <div className={`${cardClass} rounded-2xl p-5 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                      <Wifi className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-emerald-500">{onlineCamerasCount}</h4>
                      <p className={`text-xs font-semibold mt-0.5 ${textSubClass}`}>Online IP Oqimlar</p>
                    </div>
                  </div>
                </div>

                {/* Card 3: Jami Xonalar */}
                <div className={`${cardClass} rounded-2xl p-5 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`text-2xl font-black ${textTitleClass}`}>{rooms.length}</h4>
                      <p className={`text-xs font-semibold mt-0.5 ${textSubClass}`}>Jami Xonalar</p>
                    </div>
                  </div>
                </div>

                {/* Card 4: Foydalanuvchilar */}
                <div className={`${cardClass} rounded-2xl p-5 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center text-teal-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`text-2xl font-black ${textTitleClass}`}>{users.length}</h4>
                      <p className={`text-xs font-semibold mt-0.5 ${textSubClass}`}>Foydalanuvchilar</p>
                    </div>
                  </div>
                </div>

                {/* Card 5: O'rtacha Latency (Ping) */}
                <div className={`${cardClass} rounded-2xl p-5 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-amber-500">14 ms</h4>
                      <p className={`text-xs font-semibold mt-0.5 ${textSubClass}`}>O'rtacha Ping (Latency)</p>
                    </div>
                  </div>
                </div>

                {/* Card 6: Tizim Hodisalari */}
                <div className={`${cardClass} rounded-2xl p-5 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
                      <Server className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-cyan-500">{logs.length}</h4>
                      <p className={`text-xs font-semibold mt-0.5 ${textSubClass}`}>Tizim Hodisalari (Loglar)</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* ANALYTICS CHARTS / PANELS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Panel: Kameralar Statusi Taqsimoti */}
                <div className={`lg:col-span-2 ${cardClass} rounded-2xl p-6 space-y-4`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2.5 ${textTitleClass}`}>
                    <div className="p-1.5 rounded-lg bg-teal-400/15 text-teal-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <span>Kameralar Oqimi Taqsimoti</span>
                  </h4>

                  <div className="space-y-3 font-mono text-xs pt-2">
                    <div>
                      <div className={`flex justify-between mb-1 ${textSubClass}`}>
                        <span>RTSP Oqimlar (1080p 60fps)</span>
                        <span className="text-teal-400 font-bold">100%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-[#0a0e1a]'}`}>
                        <div className="bg-teal-400 h-full w-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className={`flex justify-between mb-1 ${textSubClass}`}>
                        <span>HLS / HTTP Oqimlar</span>
                        <span className="text-cyan-500 font-bold">85%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-[#0a0e1a]'}`}>
                        <div className="bg-cyan-500 h-full w-[85%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className={`flex justify-between mb-1 ${textSubClass}`}>
                        <span>Motion Detection Tayyorlik</span>
                        <span className="text-purple-500 font-bold">94%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-[#0a0e1a]'}`}>
                        <div className="bg-purple-500 h-full w-[94%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Ijro Samaradorligi */}
                <div className={`lg:col-span-1 ${cardClass} rounded-2xl p-6 flex flex-col justify-between`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2.5 mb-4 ${textTitleClass}`}>
                    <div className="p-1.5 rounded-lg bg-teal-400/15 text-teal-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span>Tizim Barqarorligi</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className={`${subCardClass} p-4 rounded-xl`}>
                      <span className="text-2xl font-black text-teal-400">99.9%</span>
                      <p className={`text-[10px] mt-1 font-mono ${textSubClass}`}>Uptime Ishonchlilik</p>
                    </div>

                    <div className={`${subCardClass} p-4 rounded-xl`}>
                      <span className="text-2xl font-black text-amber-500">0%</span>
                      <p className={`text-[10px] mt-1 font-mono ${textSubClass}`}>Yo'qotilgan kadrlar</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Summary Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Mavjud Kameralar */}
                <div className={`${cardClass} rounded-2xl p-5`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-sm font-bold flex items-center gap-2.5 ${textTitleClass}`}>
                      <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-500">
                        <CameraIcon className="w-5 h-5" />
                      </div>
                      <span>Mavjud Kameralar</span>
                    </h4>
                    <button onClick={() => setNavTab('cameras')} className="text-xs text-emerald-500 hover:underline font-mono font-bold">
                      Barchasi →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono border-collapse border border-slate-300 dark:border-[#222c4a]">
                      <thead>
                        <tr className={tableHeaderClass}>
                          <th className={`${tableThClass} w-10 text-center`}>№</th>
                          <th className={tableThClass}>Kamera Nomi</th>
                          <th className={tableThClass}>Protokol</th>
                          <th className={tableThClass}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cameras.slice(0, 4).map((c, idx) => (
                          <tr key={c.id} className={tableRowClass}>
                            <td className={`${tableTdClass} text-center font-bold text-teal-400`}>{idx + 1}</td>
                            <td className={`${tableTdClass} font-bold ${textTitleClass}`}>{c.name}</td>
                            <td className={`${tableTdClass} text-cyan-500 font-bold`}>{c.protocol}</td>
                            <td className={tableTdClass}>
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/30">
                                Online ({c.ping}ms)
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Foydalanuvchilar Loginlari */}
                <div className={`${cardClass} rounded-2xl p-5`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-sm font-bold flex items-center gap-2.5 ${textTitleClass}`}>
                      <div className="p-1.5 rounded-lg bg-teal-400/15 text-teal-400">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <span>Foydalanuvchilar Loginlari</span>
                    </h4>
                    <button onClick={() => setNavTab('users')} className="text-xs text-teal-400 hover:underline font-mono font-bold">
                      Barchasi →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono border-collapse border border-slate-300 dark:border-[#222c4a]">
                      <thead>
                        <tr className={tableHeaderClass}>
                          <th className={`${tableThClass} w-10 text-center`}>№</th>
                          <th className={tableThClass}>Ism Familiyasi</th>
                          <th className={tableThClass}>Login</th>
                          <th className={tableThClass}>Rol</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 4).map((u, idx) => (
                          <tr key={u.id} className={tableRowClass}>
                            <td className={`${tableTdClass} text-center font-bold text-teal-400`}>{idx + 1}</td>
                            <td className={`${tableTdClass} font-bold ${textTitleClass}`}>{u.fullName || u.username}</td>
                            <td className={`${tableTdClass} font-black text-black font-mono text-sm`}>@{u.username}</td>
                            <td className={tableTdClass}>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-teal-400/20 text-teal-400 font-bold">
                                {u.role.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Tizim Loglari */}
                <div className={`${cardClass} rounded-2xl p-5`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-sm font-bold flex items-center gap-2.5 ${textTitleClass}`}>
                      <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-500">
                        <Activity className="w-5 h-5" />
                      </div>
                      <span>Tizim Loglari</span>
                    </h4>
                    <button onClick={() => setNavTab('logs')} className="text-xs text-cyan-500 hover:underline font-mono font-bold">
                      Barchasi →
                    </button>
                  </div>

                  <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto">
                    {logs.slice(0, 4).map(log => (
                      <div key={log.id} className={`p-2 rounded-xl flex items-center justify-between ${subCardClass}`}>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${log.type === 'login' ? 'bg-emerald-500' : 'bg-cyan-500'}`}></span>
                          <span className={`truncate ${textTitleClass}`}>{log.message}</span>
                        </div>
                        <span className={`text-[10px] ${textSubClass} shrink-0 ml-2`}>{log.timestamp.split(' ')[1] || log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: FOYDALANUVCHILAR RO'YXATI */}
          {navTab === 'users' && (
            <div className="space-y-4">
              
              {/* Table Container */}
              <div className={`${cardClass} rounded-2xl p-6 overflow-hidden space-y-4`}>
                {/* Header with Title and Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#1e2746]">
                  <div>
                    <h3 className={`text-lg font-extrabold flex items-center gap-2 ${textTitleClass}`}>
                      <Users className="w-5 h-5 text-teal-400" />
                      Tizim Foydalanuvchilari Ro'yxati
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-teal-400/20 text-teal-400">
                        {users.length} ta
                      </span>
                    </h3>
                    <p className={`text-xs mt-1 ${textSubClass}`}>
                      Tizimga kirish huquqiga ega bo'lgan barcha operatorlar va administratorlar ro'yxati
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setUserMsg(null);
                      setIsAddUserModalOpen(true);
                    }}
                    className={primaryBtn}
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Qo'shish</span>
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse border border-slate-300 dark:border-[#222c4a]">
                    <thead>
                      <tr className={tableHeaderClass}>
                        <th className={`${tableThClass} w-12 text-center`}>№</th>
                        <th className={tableThClass}>Ism Familiyasi (F.I.SH)</th>
                        <th className={tableThClass}>Foydalanuvchi Logini</th>
                        <th className={tableThClass}>Paroli</th>
                        <th className={tableThClass}>Roli</th>
                        <th className={tableThClass}>Yaratilgan Sana</th>
                        <th className={`${tableThClass} text-right`}>Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, idx) => (
                        <tr key={u.id} className={tableRowClass}>
                          <td className={`${tableTdClass} text-center font-bold text-teal-400`}>{idx + 1}</td>
                          <td className={`${tableTdClass} font-bold ${textTitleClass}`}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                              {u.fullName || u.username}
                            </div>
                          </td>
                          <td className={`${tableTdClass} font-black text-black font-mono text-sm tracking-wide`}>
                            @{u.username}
                          </td>
                          <td className={`${tableTdClass} font-mono ${textSubClass}`}>
                            <div className="flex items-center gap-2">
                              <span>{visiblePasswords[u.id] ? u.password : '••••••••'}</span>
                              <button
                                onClick={() => togglePasswordVisibility(u.id)}
                                className="text-slate-400 hover:text-teal-400 p-1.5 rounded-lg transition-colors hover:bg-teal-400/10 cursor-pointer"
                                title="Parolni ko'rsatish/berkitish"
                              >
                                {visiblePasswords[u.id] ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                              </button>
                            </div>
                          </td>
                          <td className={tableTdClass}>
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                              u.role === 'admin' ? 'bg-teal-400/20 text-teal-400 border border-teal-400/40' : 'bg-slate-200 text-slate-700 dark:bg-[#1e2746] dark:text-slate-300'
                            }`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className={`${tableTdClass} ${textSubClass}`}>{u.createdAt}</td>
                          <td className={`${tableTdClass} text-right`}>
                            {u.username !== 'admin' ? (
                              <button
                                onClick={() => deleteUser(u.id)}
                                className={`p-2 rounded-xl border hover:border-red-500/50 text-slate-400 hover:text-red-500 transition-all hover:scale-105 cursor-pointer ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0a0e1a] border-[#1e2746]'}`}
                                title="Hisobni o'chirish"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-sans italic">Asosiy admin</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: KAMERALAR (IP & NOMI BOSHGARUVI) */}
          {navTab === 'cameras' && (
            <div className="space-y-4">
              
              {/* Table Container */}
              <div className={`${cardClass} rounded-2xl p-6 overflow-hidden space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#1e2746]">
                  <div>
                    <h3 className={`text-lg font-extrabold flex items-center gap-2 ${textTitleClass}`}>
                      <Server className="w-5 h-5 text-teal-400" />
                      Mavjud Kameralar Ro'yxati
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-teal-400/20 text-teal-400">
                        {cameras.length} ta
                      </span>
                    </h3>
                    <p className={`text-xs mt-1 ${textSubClass}`}>
                      Tizimga ulangan kameralar, IP manzillar va ularning oqim protokollari
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowIpAddresses(!showIpAddresses)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all ${
                        showIpAddresses ? 'bg-teal-400/20 border-teal-400/40 text-teal-400 font-bold' : isLight ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-[#0a0e1a] border-[#1e2746] text-slate-400'
                      }`}
                    >
                      {showIpAddresses ? '👁️ IP Ko\'rinmoqda' : '🙈 IP Berkitilgan'}
                    </button>

                    <button
                      onClick={() => {
                        setCamMsg(null);
                        setIsAddCamModalOpen(true);
                      }}
                      className={primaryBtn}
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Qo'shish</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse border border-slate-300 dark:border-[#222c4a]">
                    <thead>
                      <tr className={tableHeaderClass}>
                        <th className={`${tableThClass} w-12 text-center`}>№</th>
                        <th className={tableThClass}>Kamera Nomi</th>
                        <th className={tableThClass}>IP Manzil</th>
                        <th className={tableThClass}>Protokol</th>
                        <th className={tableThClass}>Xona</th>
                        <th className={tableThClass}>Status</th>
                        <th className={`${tableThClass} text-right`}>Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cameras.map((cam, idx) => {
                        const associatedRoom = rooms.find(r => r.id === cam.roomId);
                        return (
                          <tr key={cam.id} className={tableRowClass}>
                            <td className={`${tableTdClass} text-center font-bold text-teal-400`}>{idx + 1}</td>
                            <td className={`${tableTdClass} font-bold ${textTitleClass}`}>{cam.name}</td>
                            <td className={`${tableTdClass} text-cyan-500 font-bold`}>
                              {showIpAddresses ? `${cam.ip}:${cam.port}` : '192.168.x.***'}
                            </td>
                            <td className={`${tableTdClass} ${textSubClass}`}>{cam.protocol}</td>
                            <td className={`${tableTdClass} ${textSubClass}`}>
                              {associatedRoom ? `№ ${associatedRoom.number} (${associatedRoom.name})` : <span className="opacity-50">-</span>}
                            </td>
                            <td className={tableTdClass}>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Online ({cam.ping}ms)
                              </span>
                            </td>
                            <td className={`${tableTdClass} text-right`}>
                              <button
                                onClick={() => deleteCamera(cam.id)}
                                className={`p-2 rounded-xl border hover:border-red-500/50 text-slate-400 hover:text-red-500 transition-all hover:scale-105 cursor-pointer ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0a0e1a] border-[#1e2746]'}`}
                                title="Kamerani o'chirish"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: XONALAR KUZATUVI (Live camera streams view) */}
          {navTab === 'rooms' && (
            <RoomsView />
          )}

          {/* TAB 5: LOGS */}
          {navTab === 'logs' && (
            <div className={`${cardClass} rounded-2xl p-6 space-y-4`}>
              <h3 className={`text-base font-bold flex items-center gap-2 ${textTitleClass}`}>
                <Activity className="w-4 h-4 text-teal-400" />
                Tizim Jurnali va Xavfsizlik Loglari
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse border border-slate-300 dark:border-[#222c4a]">
                  <thead>
                    <tr className={tableHeaderClass}>
                      <th className={`${tableThClass} w-12 text-center`}>№</th>
                      <th className={tableThClass}>Sana va Vaqt</th>
                      <th className={tableThClass}>Turi</th>
                      <th className={tableThClass}>Xabar / Hodisa</th>
                      <th className={tableThClass}>Foydalanuvchi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, idx) => (
                      <tr key={log.id} className={tableRowClass}>
                        <td className={`${tableTdClass} text-center font-bold text-teal-400`}>{idx + 1}</td>
                        <td className={`${tableTdClass} ${textSubClass} whitespace-nowrap`}>{log.timestamp}</td>
                        <td className={tableTdClass}>
                          <span className={`px-2 py-0.5 rounded text-teal-400 border text-[10px] font-bold ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#151c33] border-[#222c4a]'}`}>
                            {log.type.toUpperCase()}
                          </span>
                        </td>
                        <td className={`${tableTdClass} font-bold ${textTitleClass}`}>{log.message}</td>
                        <td className={`${tableTdClass} ${textSubClass}`}>
                          User: <strong className={textTitleClass}>{log.user}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODAL 1: FOYDALANUVCHI QO'SHISH */}
          {isAddUserModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className={`${cardClass} w-full max-w-md rounded-2xl p-6 shadow-2xl relative border border-slate-200 dark:border-[#1e2746]`}>
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-[#1e2746]">
                  <h3 className={`text-base font-bold flex items-center gap-2 ${textTitleClass}`}>
                    <KeyRound className="w-5 h-5 text-teal-400" />
                    Foydalanuvchiga Login-Parol Berish
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddUserModalOpen(false);
                      setUserMsg(null);
                    }}
                    className={`p-1.5 rounded-xl transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#151c33] text-slate-400 hover:text-white'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {userMsg && (
                  <div className={`p-3 mb-4 rounded-xl text-xs font-medium ${
                    userMsg.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-500' : 'bg-red-500/15 border border-red-500/30 text-red-500'
                  }`}>
                    {userMsg.text}
                  </div>
                )}

                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      Ism Familiyasi (F.I.SH) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      placeholder="masalan: Sardor Ikromov"
                      className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none ${inputClass}`}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Login (Username) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="masalan: operator_nodir"
                      className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none ${inputClass}`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Maxfiy Parol *
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none ${inputClass}`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Foydalanuvchi Roli
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none ${inputClass}`}
                    >
                      <option value="operator">Operator (Kuzatuv va xonalar)</option>
                      <option value="admin">Administrator (To'liq huquqlar)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddUserModalOpen(false);
                        setUserMsg(null);
                      }}
                      className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl border transition-all ${
                        isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-[#151c33] hover:bg-[#1c2646] border-[#222c4a] text-slate-300'
                      }`}
                    >
                      Bekor qilish
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-teal-400 via-sky-400 to-violet-400 hover:from-teal-300 hover:via-sky-300 hover:to-violet-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
                    >
                      LOGIN-PAROL SAQLASH
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 2: KAMERA QO'SHISH */}
          {isAddCamModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className={`${cardClass} w-full max-w-lg rounded-2xl p-6 shadow-2xl relative border border-slate-200 dark:border-[#1e2746]`}>
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-[#1e2746]">
                  <h3 className={`text-base font-bold flex items-center gap-2 ${textTitleClass}`}>
                    <CameraIcon className="w-5 h-5 text-teal-400" />
                    Yangi Kamera Qo'shish
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddCamModalOpen(false);
                      setCamMsg(null);
                    }}
                    className={`p-1.5 rounded-xl transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#151c33] text-slate-400 hover:text-white'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {camMsg && (
                  <div className={`p-3 mb-4 rounded-xl text-xs font-medium ${
                    camMsg.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-500' : 'bg-red-500/15 border border-red-500/30 text-red-500'
                  }`}>
                    {camMsg.text}
                  </div>
                )}

                <form onSubmit={handleAddCamera} className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      Kamera Nomi *
                    </label>
                    <input
                      type="text"
                      required
                      value={camName}
                      onChange={(e) => setCamName(e.target.value)}
                      placeholder="Masalan: Kamera 101-PTZ Front"
                      className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none ${inputClass}`}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      IP Manzil
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={camIp}
                        onChange={(e) => setCamIp(e.target.value)}
                        placeholder="192.168.1.120"
                        className={`flex-1 px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none ${inputClass}`}
                      />
                      <button
                        type="button"
                        onClick={handleTestIp}
                        className={`px-3.5 py-2.5 font-mono text-xs rounded-xl border shrink-0 text-teal-400 font-bold cursor-pointer ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#151c33] border-[#222c4a]'}`}
                      >
                        Ping Test
                      </button>
                    </div>
                  </div>

                  {pingResult && (
                    <div className={`p-2.5 rounded-xl font-mono text-[11px] ${subCardClass}`}>
                      {pingResult.message}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>
                        Port
                      </label>
                      <input
                        type="text"
                        value={camPort}
                        onChange={(e) => setCamPort(e.target.value)}
                        placeholder="554"
                        className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none ${inputClass}`}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Protokol
                      </label>
                      <select
                        value={camProtocol}
                        onChange={(e) => setCamProtocol(e.target.value)}
                        className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none ${inputClass}`}
                      >
                        <option value="RTSP">RTSP</option>
                        <option value="HTTP">HTTP</option>
                        <option value="HLS">HLS</option>
                        <option value="MJPEG">MJPEG</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Biriktiriladigan Xona
                    </label>
                    <select
                      value={camRoomId}
                      onChange={(e) => setCamRoomId(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none ${inputClass}`}
                    >
                      <option value="">-- Xona biriktirilmagan --</option>
                      {rooms.map(r => (
                        <option key={r.id} value={r.id}>
                          Xona № {r.number} - {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddCamModalOpen(false);
                        setCamMsg(null);
                      }}
                      className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl border transition-all ${
                        isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-[#151c33] hover:bg-[#1c2646] border-[#222c4a] text-slate-300'
                      }`}
                    >
                      Bekor qilish
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-teal-400 via-sky-400 to-violet-400 hover:from-teal-300 hover:via-sky-300 hover:to-violet-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
                    >
                      KAMERANI SAQLASH
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
