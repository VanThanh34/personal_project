import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });

    // State xử lý UI
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState({ show: false, type: 'success', message: '' });

    const { register } = useAuth(); // Giờ thì lấy được hàm register rồi nhé
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Gọi hàm register từ Context
        const res = await register(formData);

        setIsLoading(false);

        if (res.success) {
            // Hiện Modal Thành công
            setModal({
                show: true,
                type: 'success',
                message: 'Tài khoản đã được tạo thành công! Hãy đăng nhập để tải game.'
            });
        } else {
            // Hiện Modal Lỗi
            setModal({
                show: true,
                type: 'error',
                message: res.message
            });
        }
    };

    const closeModal = () => {
        setModal({ ...modal, show: false });
        if (modal.type === 'success') {
            navigate('/login'); // Thành công thì đá về Login
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="bg-surface/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-display font-black text-white mb-2 tracking-tight">
                        TẠO <span className="text-accent">TÀI KHOẢN</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">Tham gia cộng đồng game thủ ngay hôm nay</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-gray-600 font-bold"
                            placeholder="Họ và tên hiển thị"
                            required
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-gray-600 font-bold"
                            placeholder="Tên đăng nhập"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder-gray-600 font-bold"
                            placeholder="Địa chỉ Email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-background/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all placeholder-gray-600 font-bold"
                            placeholder="Mật khẩu"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-secondary to-accent hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary/30 transition-all hover:scale-[1.02] transform mt-4 flex justify-center items-center"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            "ĐĂNG KÝ NGAY"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400 text-sm font-medium">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-white hover:text-secondary font-bold underline decoration-secondary decoration-2 underline-offset-4 transition-all">
                        Đăng nhập
                    </Link>
                </div>
            </div>

            {/* ============== MODAL THÔNG BÁO (Success/Error) ============== */}
            {modal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>

                    <div className={`relative bg-surface border ${modal.type === 'success' ? 'border-green-500/30' : 'border-red-500/30'} rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-blob text-center`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${modal.type === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            {modal.type === 'success' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">
                            {modal.type === 'success' ? 'Thành Công!' : 'Có Lỗi Xảy Ra'}
                        </h3>
                        <p className="text-gray-400 mb-6 text-sm px-4">
                            {modal.message}
                        </p>

                        <button
                            onClick={closeModal}
                            className={`w-full py-3 font-bold rounded-xl transition-all shadow-lg text-white ${modal.type === 'success' ? 'bg-green-600 hover:bg-green-500 shadow-green-500/30' : 'bg-red-600 hover:bg-red-500 shadow-red-500/30'}`}
                        >
                            {modal.type === 'success' ? 'ĐĂNG NHẬP NGAY' : 'THỬ LẠI'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterPage;