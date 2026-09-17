import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginModal } from './components/LoginModal';
import { Navbar } from './components/Navbar';
import { RoomsView } from './components/RoomsView';
import { DashboardView } from './components/DashboardView';
import { ToastNotification } from './components/ToastNotification';
import { ConfirmModal } from './components/ConfirmModal';

const MainContent = () => {
  const { currentUser, activeTab, setActiveTab, theme } = useApp();
  const [routePath, setRoutePath] = React.useState(() => typeof window !== 'undefined' ? (window.location.pathname + window.location.hash) : '');

  // Listen to route changes
  React.useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      setRoutePath(path + hash);

      if (path === '/admin' || hash === '#admin') {
        setActiveTab('dashboard');
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, [setActiveTab]);

  const isAdminRoute = routePath.includes('/admin') || routePath.includes('#admin');

  // If user is not logged in OR if visiting /admin without being an admin user -> Show LoginModal
  if (!currentUser || (isAdminRoute && currentUser.role !== 'admin')) {
    return (
      <>
        <ToastNotification />
        <ConfirmModal />
        <LoginModal isAdminRoute={isAdminRoute} />
      </>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${theme === 'light' ? 'app-shell-light text-slate-900' : 'app-shell-dark text-slate-100'}`}>
      <ToastNotification />
      <ConfirmModal />
      <Navbar />

      <main className={`flex-1 w-full ${activeTab === 'dashboard' ? '' : 'px-4 sm:px-6 lg:px-8 py-6'}`}>
        {activeTab === 'rooms' && <RoomsView />}
        {activeTab === 'dashboard' && <DashboardView />}
      </main>

      {/* Footer */}
      <footer className={`border-t py-4 text-center text-xs font-mono transition-colors ${
        theme === 'light' ? 'border-teal-100 bg-white/80 text-slate-500' : 'border-white/5 bg-[#05080f]/90 text-slate-500'
      }`}>
        <p>UrSPI Camera & Room Control System &copy; 2026. Barcha huquqlar saqlangan.</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
