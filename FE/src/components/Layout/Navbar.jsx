import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();
    const dropdownRef = useRef(null);

    // Hiệu ứng cuộn trang kính mờ
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Đóng dropdown khi click ra ngoài
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navLinks = [
        { name: 'TRANG CHỦ', path: '/' },
        { name: 'TOP GAME', path: '/#top-games' },
        { name: 'CỘNG ĐỒNG', path: '/community' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-gray-800' : 'bg-transparent py-4'
        }`}>
            <div className="container mx-auto px-6 flex items-center justify-between h-16">
                {/* LOGO */}
                <Link to="/" className="text-2xl font-display font-black tracking-tighter text-white flex items-center gap-2">
                    <span className="text-primary text-4xl">B</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        PLATFORM
                    </span>
                </Link>

                {/* MENU GIỮA */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm font-bold tracking-widest transition-colors hover:text-primary ${
                                location.pathname === link.path ? 'text-primary' : 'text-gray-300'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Link riêng cho Admin nếu muốn hiện ở thanh chính */}
                    {isAuthenticated && isAdmin() && (
                        <Link to="/admin" className="text-sm font-bold tracking-widest text-secondary hover:text-white transition-colors">
                            QUẢN TRỊ
                        </Link>
                    )}
                </div>

                {/* KHU VỰC USER / LOGIN */}
                <div className="flex items-center gap-4">
                    {!isAuthenticated ? (
                        // CHƯA ĐĂNG NHẬP
                        <>
                            <Link to="/login" className="hidden md:block text-sm font-bold text-gray-300 hover:text-white transition-colors">
                                ĐĂNG NHẬP
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2 bg-primary hover:bg-pink-600 text-white text-sm font-bold rounded-full transition-all shadow-neon-pink hover:scale-105"
                            >
                                THAM GIA NGAY
                            </Link>
                        </>
                    ) : (
                        // ĐÃ ĐĂNG NHẬP -> HIỆN AVATAR VÀ DROPDOWN
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 focus:outline-none group"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                                        {user?.fullName || user?.username || "Gamer"}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        {isAdmin() ? 'Administrator' : 'Member'}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                                    <img
                                        src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.username || "User") + "&background=random"}
                                        alt="Avatar"
                                        className="w-full h-full rounded-full object-cover border-2 border-background"
                                    />
                                </div>
                            </button>

                            {/* DROPDOWN MENU */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-surface border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in origin-top-right">
                                    <div className="py-2">
                                        {/* MENU CHO ADMIN */}
                                        {isAdmin() ? (
                                            <>
                                                <Link to="/admin/dashboard" className="block px-4 py-3 text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors font-bold">
                                                    📊 Thống kê Dashboard
                                                </Link>
                                                <Link to="/admin/games" className="block px-4 py-3 text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors font-bold">
                                                    🎮 Quản lý Game
                                                </Link>
                                                <Link to="/admin/users" className="block px-4 py-3 text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors font-bold">
                                                    👥 Quản lý User
                                                </Link>
                                            </>
                                        ) : (
                                            /* MENU CHO USER THƯỜNG */
                                            <>
                                                <Link to="/profile" className="block px-4 py-3 text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors font-bold">
                                                    👤 Hồ sơ cá nhân
                                                </Link>
                                                <Link to="/history" className="block px-4 py-3 text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors font-bold">
                                                    ⏳ Lịch sử tải game
                                                </Link>
                                                <Link to="/favorites" className="block px-4 py-3 text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors font-bold">
                                                    ❤️ Game yêu thích
                                                </Link>
                                            </>
                                        )}

                                        <div className="h-[1px] bg-gray-700 my-1"></div>

                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-bold"
                                        >
                                            🚪 Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;