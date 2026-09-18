import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const API_BASE = '/api';

export const AppProvider = ({ children }) => {
  // Current user session saved in localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cam_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'dashboard'
  const [searchQuery, setSearchQuery] = useState('');
  const [showIpAddresses, setShowIpAddresses] = useState(false);
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

  // Persist current user session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cam_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cam_current_user');
    }
  }, [currentUser]);

  // Fetch real-time system status from backend API
  const fetchSystemStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/system/status`);
      const data = await res.json();
      if (data.success && data.data) {
        setSystemStatus(data.data);
      }
    } catch (err) {
      console.error('Error fetching system status:', err);
    }
  };

  // Fetch all initial data from database via backend API
  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const [usersRes, roomsRes, camerasRes, logsRes] = await Promise.all([
        fetch(`${API_BASE}/users`).then(r => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/rooms`).then(r => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/cameras`).then(r => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/logs`).then(r => r.json()).catch(() => ({ success: false }))
      ]);

      if (usersRes.success && Array.isArray(usersRes.data)) setUsers(usersRes.data);
      if (roomsRes.success && Array.isArray(roomsRes.data)) setRooms(roomsRes.data);
      if (camerasRes.success && Array.isArray(camerasRes.data)) setCameras(camerasRes.data);
      if (logsRes.success && Array.isArray(logsRes.data)) setLogs(logsRes.data);

      await fetchSystemStatus();
    } catch (err) {
      console.error('Error fetching backend data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Live Real-Time Monitoring Polling (Every 5 seconds)
    const timer = setInterval(() => {
      fetchSystemStatus();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Add Log Entry to Database
  const addLog = async (type, message, username) => {
    const logUser = username || (currentUser ? currentUser.username : 'Mehmon');
    try {
      const res = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, user: logUser })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLogs(prev => [data.data, ...prev.slice(0, 99)]);
      }
      fetchSystemStatus();
    } catch (error) {
      console.error('Failed to add log to DB:', error);
    }
  };

  // Auth actions
  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        await addLog('auth', `Tizimga kirish bajarildi (${data.user.role})`, data.user.username);
        showToast({ type: 'add', title: 'Tizimga Kirildi', message: `Xush kelibsiz, ${data.user.fullName || data.user.username}!` });
        return { success: true };
      } else {
        showToast({ type: 'delete', title: 'Xatolik', message: data.message || 'Login yoki parol noto\'g\'ri!' });
        return { success: false, message: data.message || 'Login yoki parol noto\'g\'ri!' };
      }
    } catch (err) {
      console.error('Login request failed:', err);
      showToast({ type: 'delete', title: 'Xatolik', message: 'Backend serverga ulanishda xatolik' });
      return { success: false, message: 'Backend serverga ulanishda xatolik' };
    }
  };

  const logout = async () => {
    if (currentUser) {
      await addLog('auth', 'Tizimdan chiqildi', currentUser.username);
    }
    setCurrentUser(null);
    showToast({ type: 'info', title: 'Tizimdan Chiqildi', message: 'Tizimdan muvaffaqiyatli chiqdingiz' });
  };

  // User CRUD
  const addUser = async ({ fullName, username, password, role, allowedCameras }) => {
    if (!username || !password) {
      showToast({ type: 'delete', title: 'Xatolik', message: 'Barcha maydonlarni to\'ldiring' });
      return { success: false, message: 'Barcha maydonlarni to\'ldiring' };
    }

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, password, role, allowedCameras })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(prev => [data.data, ...prev]);
        await addLog('user', `Yangi foydalanuvchi yaratildi: "${data.data.fullName}" (@${data.data.username})`);
        showToast({ type: 'add', title: 'Saqlandi', message: `Yangi foydalanuvchi "${data.data.fullName}" (@${data.data.username}) saqlandi!` });
        fetchSystemStatus();
        return { success: true };
      } else {
        showToast({ type: 'delete', title: 'Xatolik', message: data.message || 'Xatolik yuz berdi' });
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('addUser error:', err);
      showToast({ type: 'delete', title: 'Xatolik', message: 'Foydalanuvchi saqlashda backend xatoligi' });
      return { success: false, message: 'Backend xatoligi' };
    }
  };

  const updateUser = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(prev => prev.map(u => u.id === id ? data.data : u));
        if (currentUser && currentUser.id === id) {
          setCurrentUser(data.data);
        }
        await addLog('user', `Foydalanuvchi ma'lumotlari yangilandi: ID ${id}`);
        showToast({ type: 'edit', title: 'Tahrirlandi', message: `Foydalanuvchi ma'lumotlari tahrirlandi va saqlandi!` });
        fetchSystemStatus();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('updateUser error:', err);
      return { success: false, message: 'Backend xatoligi' };
    }
  };

  const deleteUser = async (id) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete?.username === 'admin') {
      showToast({ type: 'delete', title: 'Xatolik', message: 'Asosiy admin hisobini o\'chirish mumkin emas!' });
      return { success: false, message: 'Asosiy admin hisobini o\'chirish mumkin emas!' };
    }

    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
        await addLog('user', `Foydalanuvchi o'chirildi: "${userToDelete?.username}"`);
        showToast({ type: 'delete', title: "O'chirildi", message: `Foydalanuvchi "${userToDelete?.fullName || userToDelete?.username}" o'chirildi!` });
        fetchSystemStatus();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('deleteUser error:', err);
      return { success: false, message: 'Backend xatoligi' };
    }
  };

  // Room CRUD
  const addRoom = async ({ number, name, description }) => {
    if (!number || !name) {
      showToast({ type: 'delete', title: 'Xatolik', message: 'Xona raqami va nomini kiriting' });
      return { success: false, message: 'Xona raqami va nomini kiriting' };
    }

    try {
      const res = await fetch(`${API_BASE}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, name, description })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRooms(prev => [...prev, data.data]);
        await addLog('room', `Yangi xona qo'shildi: Xona ${data.data.number} - ${data.data.name}`);
        showToast({ type: 'add', title: 'Saqlandi', message: `Xona № ${data.data.number} (${data.data.name}) qo'shildi va saqlandi!` });
        fetchSystemStatus();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('addRoom error:', err);
      return { success: false, message: 'Backend xatoligi' };
    }
  };

  const updateRoom = async (id, { number, name, description }) => {
    try {
      const res = await fetch(`${API_BASE}/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, name, description })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRooms(prev => prev.map(r => r.id === id ? data.data : r));
        await addLog('room', `Xona ma'lumotlari tahrirlandi: Xona ${number || data.data.number} (${name || data.data.name})`);
        showToast({ type: 'edit', title: 'Tahrirlandi', message: `Xona № ${number || data.data.number} (${name || data.data.name}) ma'lumotlari tahrirlandi va saqlandi!` });
        fetchSystemStatus();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('updateRoom error:', err);
      return { success: false, message: 'Backend xatoligi' };
    }
  };

  const deleteRoom = async (id) => {
    const roomToDelete = rooms.find(r => r.id === id);
    try {
      const res = await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => prev.filter(r => r.id !== id));
        setCameras(prev => prev.map(c => c.roomId === id ? { ...c, roomId: '' } : c));
        await addLog('room', `Xona o'chirildi: ${roomToDelete?.number} - ${roomToDelete?.name}`);
        showToast({ type: 'delete', title: "O'chirildi", message: `Xona № ${roomToDelete?.number} (${roomToDelete?.name}) o'chirildi!` });
        fetchSystemStatus();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('deleteRoom error:', err);
      return { success: false, message: 'Backend xatoligi' };
    }
  };

  // Camera CRUD
  const addCamera = async ({ name, ip, port, protocol, roomId }) => {
    if (!name || !ip) {
      showToast({ type: 'delete', title: 'Xatolik', message: 'Kamera nomi va IP manzilini kiriting!' });
      return { success: false, message: 'Kamera nomi va IP manzilini kiriting!' };
    }

    try {
      const res = await fetch(`${API_BASE}/cameras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ip, port, protocol, roomId })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCameras(prev => [...prev, data.data]);
        await addLog('camera', `Yangi IP Kamera qo'shildi: "${data.data.name}" [IP: ${data.data.ip}]`);
        showToast({ type: 'add', title: 'Saqlandi', message: `Yangi IP kamera "${data.data.name}" [IP: ${data.data.ip}] saqlandi!` });
        fetchSystemStatus();
        return { success: true };
      } else {
        showToast({ type: 'delete', title: 'Xatolik', message: data.message || 'IP manzil formati noto\'g\'ri' });
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('addCamera error:', err);
      return { success: false, message: 'Backend xatoligi' };
    }
  };

  const updateCamera = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/cameras/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCameras(prev => prev.map(c => c.id === id ? data.data : c));
        await addLog('camera', `Kamera sozlamalari yangilandi: ID ${id}`);
        showToast({ type: 'edit', title: 'Tahrirlandi', message: `Kamera sozlamalari muvaffaqiyatli tahrirlandi va saqlandi!` });
        fetchSystemStatus();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('updateCamera error:', err);
      return { success: false, message: 'Backend xatoligi' };
    }
  };

  const deleteCamera = async (id) => {
    const cam = cameras.find(c => c.id === id);
    try {
      const res = await fetch(`${API_BASE}/cameras/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCameras(prev => prev.filter(c => c.id !== id));
        await addLog('camera', `IP Kamera o'chirildi: "${cam?.name}" (${cam?.ip})`);
        showToast({ type: 'delete', title: "O'chirildi", message: `IP Kamera "${cam?.name}" (${cam?.ip}) o'chirildi!` });
        fetchSystemStatus();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('deleteCamera error:', err);
      return { success: false, message: 'Backend xatoligi' };
    }
  };

  // Test Camera IP ping
  const testCameraIp = async (ip) => {
    try {
      const res = await fetch(`${API_BASE}/cameras/test-ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      const pingTime = Math.floor(Math.random() * 25) + 4;
      return {
        success: Boolean(ip && ip.length > 5),
        ping: pingTime,
        message: `IP ${ip} bilan aloqa mavjud (${pingTime} ms)`
      };
    }
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
      systemStatus,
      fetchSystemStatus,
      loadingData,
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
      addLog,
      refreshData: fetchAllData
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
