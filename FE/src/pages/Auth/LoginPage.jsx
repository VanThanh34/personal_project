import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient'; // Import axiosClient để gọi API

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // State cho Modal Lỗi
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Gọi API đăng nhập từ Backend
            // Lưu ý: Đường dẫn '/auth/login' tùy thuộc vào Controller của ông
            const res = await axiosClient.post('/auth/login', { username, password });

            // Xử lý dữ liệu trả về (hỗ trợ cả trường hợp axios đã bóc vỏ hoặc chưa)
            const data = res.data || res;

            if (data.token) {
                // Đăng nhập thành công -> Lưu vào Context
                // data.user hoặc data tùy thuộc vào BE trả về object nào chứa roles
                // Giả sử BE trả về: { token: "...", roles: ["ROLE_ADMIN"], username: "..." }
                login(data, data.token);

                // Điều hướng dựa trên quyền (Role)
                const roles = data.roles || [];
                if (roles.includes('ROLE_ADMIN') || roles.includes('ADMIN')) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/'); // User thường về trang chủ
                }
            } else {
                throw new Error("Không nhận được token xác thực!");
            }

        } catch (error) {
            console.error("Login Error:", error);
            // Lấy thông báo lỗi từ Backend nếu có
            const msg = error.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không đúng!";
            setErrorMessage(msg);
            setShowErrorModal(true); // Hiện Modal thay vì alert
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="bg-surface/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md relative z-10 animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-display font-black text-white mb-2 tracking-tight">
                        CHÀO MỪNG <span className="text-primary">TRỞ LẠI</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">Đăng nhập để tiếp tục tải game tốc độ cao</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tài khoản</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600 font-bold"
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mật khẩu</label>
                            <a href="#" className="text-xs font-bold text-primary hover:text-pink-400 transition-colors">Quên mật khẩu?</a>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600 font-bold"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] transform disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            "ĐĂNG NHẬP NGAY"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400 text-sm font-medium">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-white hover:text-primary font-bold underline decoration-primary decoration-2 underline-offset-4 transition-all">
                        Đăng ký ngay
                    </Link>
                </div>
            </div>

            {/* ============== ERROR MODAL (Thay thế Alert) ============== */}
            {showErrorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowErrorModal(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-surface border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.2)] max-w-sm w-full p-6 animate-blob text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Đăng Nhập Thất Bại</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            {errorMessage}
                        </p>

                        <button
                            onClick={() => setShowErrorModal(false)}
                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/30"
                        >
                            THỬ LẠI
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;