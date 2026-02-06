import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import GameDetailPage from './pages/Game/GameDetailPage';
import HistoryPage from './pages/User/HistoryPage';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import Dashboard from './pages/Admin/Dashboard';
import GameManager from './pages/Admin/GameManager';
import UserManager from './pages/Admin/UserManager';
function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/games" element={<GameManager />} />
            <Route path="/admin/users" element={<UserManager />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
