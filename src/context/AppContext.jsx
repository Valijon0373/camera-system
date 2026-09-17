import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Initial Default Data
const initialUsers = [
  { id: '1', fullName: 'Bosh Administrator', username: 'admin', password: '123456', role: 'admin', allowedCameras: ['all'], createdAt: '2026-09-15 10:00' },
  { id: '2', fullName: 'Sardor Ikromov', username: 'user', password: '123456', role: 'operator', allowedCameras: ['1', '2', '3', '4'], createdAt: '2026-09-16 11:30' },
  { id: '3', fullName: 'Bekzod Rahimov', username: 'bekzod', password: 'pass123', role: 'operator', allowedCameras: ['1', '2'], createdAt: '2026-09-17 09:15' }
];

const initialRooms = [
  { id: '1', number: '101', name: 'Boshqaruv Zali', description: 'Asosiy operativ markaz' },
  { id: '2', number: '204', name: 'Server Xonasi', description: 'Markaziy serverlar va tarmoq uskunalari' },
  { id: '3', number: '301', name: 'Majlislar Zali', description: 'Rektorat majlislar zali' },
  { id: '4', number: '105', name: 'Asosiy Kirish Yo\'lagi', description: 'Bino kirish darvozasi va turniketlar' }
];

const initialCameras = [
  { id: '1', name: 'Kamera 101-A (PTZ Dome)', ip: '192.168.1.101', port: '554', protocol: 'RTSP', roomId: '1', status: 'online', ping: 12 },
  { id: '2', name: 'Kamera 204-B (Server Rack)', ip: '192.168.1.104', port: '80', protocol: 'HTTP', roomId: '2', status: 'online', ping: 8 },
  { id: '3', name: 'Kamera 301-C (Konferensiya)', ip: '192.168.1.108', port: '554', protocol: 'HLS', roomId: '3', status: 'online', ping: 15 },
  { id: '4', name: 'Kamera 105-D (Turniket N1)', ip: '192.168.1.115', port: '8080', protocol: 'MJPEG', roomId: '4', status: 'online', ping: 22 }
];

const initialLogs = [
  { id: '1', timestamp: '2026-09-17 11:00:15', date: '2026-09-17', time: '11:00:15', type: 'system', message: 'Tizim muvaffaqiyatli ishga tushirildi', user: 'System' },
  { id: '2', timestamp: '2026-09-17 11:02:40', date: '2026-09-17', time: '11:02:40', type: 'camera', message: 'Kamera 192.168.1.101 oqimi ulandi (1080p, 60fps)', user: 'System' },
  { id: '3', timestamp: '2026-09-17 11:04:10', date: '2026-09-17', time: '11:04:10', type: 'auth', message: 'Admin tizimga kirdi', user: 'admin' }
];

export const AppProvider = ({ children }) => {
  // Load state from localStorage or initial defaults
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cam_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cam_users');
    if (!saved) return initialUsers;
    const parsed = JSON.parse(saved);
    // Ensure all users have a fullName & allowedCameras fallback if loaded from older localStorage
    return parsed.map(u => ({
      ...u,
      fullName: u.fullName || (u.username === 'admin' ? 'Bosh Administrator' : u.username),
      allowedCameras: Array.isArray(u.allowedCameras) ? u.allowedCameras : (u.role === 'admin' ? ['all'] : ['1', '2', '3', '4'])
    }));
  });

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('cam_rooms');
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [cameras, setCameras] = useState(() => {
    const saved = localStorage.getItem('cam_cameras');
    return saved ? JSON.parse(saved) : initialCameras;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('cam_logs');
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'dashboard'
  const [searchQuery, setSearchQuery] = useState('');
  const [showIpAddresses, setShowIpAddresses] = useState(false); // Default false per user request
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cam_theme') || 'dark';
  });

  // Global Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const showToast = ({ type = 'add', title, message }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, type, title, message };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Global Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    onConfirm: null
  });

  const askConfirmation = ({ title, message, itemName, onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title: title || "O'chirishni tasdiqlang",
      message: message || "Haqiqatdan ham ushbu ma'lumotni o'chirmoqchimisiz?",
      itemName: itemName || '',
      onConfirm
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('cam_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Handle /admin route on load
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/admin' || hash === '#admin') {
      setActiveTab('dashboard');
    }
  }, []);

  // Persist states
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cam_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cam_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cam_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cam_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('cam_cameras', JSON.stringify(cameras));
  }, [cameras]);

  useEffect(() => {
    localStorage.setItem('cam_logs', JSON.stringify(logs));
  }, [logs]);

  // Add Log Entry
  const addLog = (type, message, username) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog = {
      id: Date.now().toString(),
      timestamp: `${dateStr} ${timeStr}`,
      date: dateStr,
      time: timeStr,
      type,
      message,
      user: username || (currentUser ? currentUser.username : 'Mehmon')
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  // Auth actions
  const login = (username, password) => {
    const found = users.find(u => u.username.trim().toLowerCase() === username.trim().toLowerCase() && u.password === password);
    if (found) {
      setCurrentUser(found);
      addLog('auth', `Tizimga kirish bajarildi (${found.role})`, found.username);
      showToast({ type: 'add', title: 'Tizimga Kirildi', message: `Xush kelibsiz, ${found.fullName || found.username}!` });
      return { success: true };
    }
    showToast({ type: 'delete', title: 'Xatolik', message: 'Login yoki parol noto\'g\'ri!' });
    return { success: false, message: 'Login yoki parol noto\'g\'ri!' };
  };

  const logout = () => {
    if (currentUser) {
      addLog('auth', 'Tizimdan chiqildi', currentUser.username);
    }
    setCurrentUser(null);
    showToast({ type: 'info', title: 'Tizimdan Chiqildi', message: 'Tizimdan muvaffaqiyatli chiqdingiz' });
  };

  // User CRUD
  const addUser = ({ fullName, username, password, role, allowedCameras }) => {
    if (!username || !password) {
      showToast({ type: 'delete', title: 'Xatolik', message: 'Barcha maydonlarni to\'ldiring' });
      return { success: false, message: 'Barcha maydonlarni to\'ldiring' };
    }
    const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      showToast({ type: 'delete', title: 'Xatolik', message: 'Ushbu nomdagi foydalanuvchi mavjud!' });
      return { success: false, message: 'Ushbu nomdagi foydalanuvchi mavjud!' };
    }

    const defaultAllowed = role === 'admin' ? ['all'] : (allowedCameras && allowedCameras.length > 0 ? allowedCameras : cameras.map(c => c.id));

    const newUser = {
      id: Date.now().toString(),
      fullName: fullName && fullName.trim() ? fullName.trim() : username.trim(),
      username: username.trim(),
      password: password.trim(),
      role: role || 'operator',
      allowedCameras: defaultAllowed,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    addLog('user', `Yangi foydalanuvchi yaratildi: "${newUser.fullName}" (@${newUser.username})`);
    showToast({ type: 'add', title: 'Saqlandi', message: `Yangi foydalanuvchi "${newUser.fullName}" (@${newUser.username}) saqlandi!` });
    return { success: true };
  };

  const updateUser = (id, updatedData) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
    }
    addLog('user', `Foydalanuvchi ma'lumotlari yangilandi: ID ${id}`);
    showToast({ type: 'edit', title: 'Tahrirlandi', message: `Foydalanuvchi ma'lumotlari tahrirlandi va saqlandi!` });
    return { success: true };
  };

  const deleteUser = (id) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete?.username === 'admin') {
      showToast({ type: 'delete', title: 'Xatolik', message: 'Asosiy admin hisobini o\'chirish mumkin emas!' });
      return { success: false, message: 'Asosiy admin hisobini o\'chirish mumkin emas!' };
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    addLog('user', `Foydalanuvchi o'chirildi: "${userToDelete?.username}"`);
    showToast({ type: 'delete', title: "O'chirildi", message: `Foydalanuvchi "${userToDelete?.fullName || userToDelete?.username}" o'chirildi!` });
    return { success: true };
  };

  // Room CRUD
  const addRoom = ({ number, name, description }) => {
    if (!number || !name) {
      showToast({ type: 'delete', title: 'Xatolik', message: 'Xona raqami va nomini kiriting' });
      return { success: false, message: 'Xona raqami va nomini kiriting' };
    }
    const newRoom = {
      id: Date.now().toString(),
      number: number.trim(),
      name: name.trim(),
      description: description ? description.trim() : 'Xona tavsifi'
    };
    setRooms(prev => [...prev, newRoom]);
    addLog('room', `Yangi xona qo'shildi: Xona ${newRoom.number} - ${newRoom.name}`);
    showToast({ type: 'add', title: 'Saqlandi', message: `Xona № ${newRoom.number} (${newRoom.name}) qo'shildi va saqlandi!` });
    return { success: true };
  };

  const updateRoom = (id, { number, name, description }) => {
    setRooms(prev => prev.map(r => r.id === id ? {
      ...r,
      number: number !== undefined ? number.trim() : r.number,
      name: name !== undefined ? name.trim() : r.name,
      description: description !== undefined ? description.trim() : r.description
    } : r));
    addLog('room', `Xona ma'lumotlari tahrirlandi: Xona ${number} (${name})`);
    showToast({ type: 'edit', title: 'Tahrirlandi', message: `Xona № ${number} (${name}) ma'lumotlari tahrirlandi va saqlandi!` });
    return { success: true };
  };

  const deleteRoom = (id) => {
    const roomToDelete = rooms.find(r => r.id === id);
    setRooms(prev => prev.filter(r => r.id !== id));
    // Remove roomId association from cameras
    setCameras(prev => prev.map(c => c.roomId === id ? { ...c, roomId: '' } : c));
    addLog('room', `Xona o'chirildi: ${roomToDelete?.number} - ${roomToDelete?.name}`);
    showToast({ type: 'delete', title: "O'chirildi", message: `Xona № ${roomToDelete?.number} (${roomToDelete?.name}) o'chirildi!` });
    return { success: true };
  };

  // Camera CRUD
  const addCamera = ({ name, ip, port, protocol, roomId }) => {
    if (!name || !ip) {
      showToast({ type: 'delete', title: 'Xatolik', message: 'Kamera nomi va IP manzilini kiriting!' });
      return { success: false, message: 'Kamera nomi va IP manzilini kiriting!' };
    }
    
    // IP format check simulation
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ip.trim())) {
      showToast({ type: 'delete', title: 'Xatolik', message: 'Noto\'g\'ri IP manzil formati' });
      return { success: false, message: 'Noto\'g\'ri IP manzil formati (masalan: 192.168.1.100)' };
    }

    const newCam = {
      id: Date.now().toString(),
      name: name.trim(),
      ip: ip.trim(),
      port: port ? port.trim() : '554',
      protocol: protocol || 'RTSP',
      roomId: roomId || '',
      status: 'online',
      ping: Math.floor(Math.random() * 20) + 5
    };
    setCameras(prev => [...prev, newCam]);
    addLog('camera', `Yangi IP Kamera qo'shildi: "${newCam.name}" [IP: ${newCam.ip}]`);
    showToast({ type: 'add', title: 'Saqlandi', message: `Yangi IP kamera "${newCam.name}" [IP: ${newCam.ip}] saqlandi!` });
    return { success: true };
  };

  const updateCamera = (id, updatedData) => {
    setCameras(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
    addLog('camera', `Kamera sozlalamalari yangilandi: ID ${id}`);
    showToast({ type: 'edit', title: 'Tahrirlandi', message: `Kamera sozlamalari muvaffaqiyatli tahrirlandi va saqlandi!` });
    return { success: true };
  };

  const deleteCamera = (id) => {
    const cam = cameras.find(c => c.id === id);
    setCameras(prev => prev.filter(c => c.id !== id));
    addLog('camera', `IP Kamera o'chirildi: "${cam?.name}" (${cam?.ip})`);
    showToast({ type: 'delete', title: "O'chirildi", message: `IP Kamera "${cam?.name}" (${cam?.ip}) o'chirildi!` });
    return { success: true };
  };

  // Simulates IP Ping test
  const testCameraIp = (ip) => {
    const pingTime = Math.floor(Math.random() * 25) + 4;
    const isSuccess = Boolean(ip && ip.length > 5);
    return {
      success: isSuccess,
      ping: pingTime,
      message: isSuccess ? `IP ${ip} bilan aloqa mavjud (${pingTime} ms)` : `IP ${ip} so'rovga javob bermadi`
    };
  };

  // Check if camera is allowed for user
  const isCameraAllowedForUser = (user, cameraId) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (!user.allowedCameras) return true;
    if (user.allowedCameras.includes('all')) return true;
    return user.allowedCameras.includes(cameraId);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      rooms,
      cameras,
      logs,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      theme,
      toggleTheme,
      showIpAddresses,
      setShowIpAddresses,
      toasts,
      showToast,
      removeToast,
      confirmModal,
      askConfirmation,
      closeConfirmModal,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      addRoom,
      updateRoom,
      deleteRoom,
      addCamera,
      updateCamera,
      deleteCamera,
      testCameraIp,
      isCameraAllowedForUser,
      addLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
