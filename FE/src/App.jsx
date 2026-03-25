import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import DialogModal from './components/UI/DialogModal';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import VerifyAccountPage from './pages/Auth/VerifyAccountPage';
import GameDetailPage from './pages/Game/GameDetailPage';
import HistoryPage from './pages/User/HistoryPage';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import Dashboard from './pages/Admin/Dashboard';
import GameManager from './pages/Admin/GameManager';
import UserManager from './pages/Admin/UserManager';
import CommunityPage from './pages/CommunityPage';
import TopGamesPage from './pages/Game/TopGamesPage';
import CategoryPage from './pages/Game/CategoryPage';
import FavoriteGamesPage from './pages/User/FavoriteGamesPage';
import ProfilePage from './pages/User/ProfilePage';

function App() {
  const [lockedData, setLockedData] = useState({ isOpen: false, message: '' });

  useEffect(() => {
    const handleAuthLocked = (e) => {
      setLockedData({ isOpen: true, message: e.detail });
    };
    window.addEventListener('auth-locked', handleAuthLocked);
    return () => window.removeEventListener('auth-locked', handleAuthLocked);
  }, []);

  const handleCloseLockedModal = () => {
    setLockedData({ isOpen: false, message: '' });
    window.location.href = '/login'; // Chuyển hướng khi đã nhận được tin buồn
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-account" element={<VerifyAccountPage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/top-games" element={<TopGamesPage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/favorites" element={<FavoriteGamesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/games" element={<GameManager />} />
          <Route path="/admin/users" element={<UserManager />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Global Lock Modal */}
      <DialogModal 
          isOpen={lockedData.isOpen}
          title="TÀI KHOẢN ĐÃ BỊ KHÓA"
          message={lockedData.message}
          type="alert"
          onClose={handleCloseLockedModal}
      />
    </div>
  )
}

export default App
