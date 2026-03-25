import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../components/UI/DialogModal';

const ProfilePage = () => {
    const { isAuthenticated, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        username: '',
        email: '',
        fullName: '',
        dob: '',
        avatar: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axiosClient.get('/user/profile');
                // Backend responses often have nested data or flat structures
                const data = res.data || res;
                setProfile({
                    username: data.username || '',
                    email: data.email || '',
                    fullName: data.fullName || '',
                    dob: data.dob || '',
                    avatar: data.avatar || ''
                });
            } catch (error) {
                console.error("Lỗi lấy thông tin profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axiosClient.put('/user/profile', {
                fullName: profile.fullName,
                dob: profile.dob
            });
            setModal({ isOpen: true, title: 'Thành Công', message: 'Hồ sơ đã được cập nhật!', type: 'success' });
            // Refresh Navbar Auth Context user info
            updateUser({
                fullName: res.data ? res.data.fullName : res.fullName,
                dob: res.data ? res.data.dob : res.dob
            });
        } catch (error) {
            console.error(error);
            setModal({ isOpen: true, title: 'Lỗi', message: 'Không thể cập nhật hồ sơ.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Construct Form Data
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Upload
            setLoading(true);
            const res = await axiosClient.post('/user/profile/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const data = res.data || res;
            
            // Update local state
            setProfile({ ...profile, avatar: data.avatarUrl });
            setModal({ isOpen: true, title: 'Thành Công', message: 'Cập nhật ảnh đại diện thành công!', type: 'success' });
            
            // Refresh global Auth Context
            updateUser({ avatar: data.avatarUrl });
        } catch (error) {
            console.error("Lỗi upload avatar:", error);
            setModal({ isOpen: true, title: 'Lỗi', message: 'Không thể upload ảnh, vui lòng thử lại!', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile.username) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-white pt-24 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] -z-10"></div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-10 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                    <h1 className="text-4xl font-display font-black tracking-tight drop-shadow-lg">HỒ SƠ CÁ NHÂN</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Avatar & Short Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
                            
                            {/* Avatar Section */}
                            <div className="relative mb-6">
                                <div className="w-40 h-40 rounded-full border-4 border-white/10 p-1 relative z-10 bg-background/50 backdrop-blur-md">
                                    <img 
                                        src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.username || "User"}&background=random`} 
                                        alt="Avatar" 
                                        className={`w-full h-full rounded-full object-cover transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}
                                    />
                                    {loading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 border-2 border-t-primary rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={handleAvatarClick}
                                    className="absolute bottom-2 right-2 bg-gradient-to-r from-primary to-secondary w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20 border-2 border-background"
                                    title="Thay đổi ảnh đại diện"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleAvatarChange} 
                                    className="hidden" 
                                    accept="image/*"
                                />
                            </div>

                            <h2 className="text-2xl font-bold mb-1">{profile.fullName || profile.username}</h2>
                            <p className="text-gray-400 text-sm mb-6 font-medium">@{profile.username}</p>

                            <button 
                                onClick={logout}
                                className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                ĐĂNG XUẤT
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: Form Info */}
                    <div className="lg:col-span-2">
                        <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
                            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
                                Thông tin cơ bản
                            </h3>

                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Username (Readonly) */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tên đăng nhập</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={profile.username}
                                                disabled
                                                className="w-full bg-black/30 border border-white/5 rounded-xl px-5 py-3.5 text-gray-400 cursor-not-allowed font-medium"
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        </div>
                                    </div>

                                    {/* Email (Readonly) */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={profile.email}
                                                disabled
                                                className="w-full bg-black/30 border border-white/5 rounded-xl px-5 py-3.5 text-gray-400 cursor-not-allowed font-medium"
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Họ và tên</label>
                                        <input 
                                            type="text" 
                                            name="fullName"
                                            value={profile.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-background/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-5 py-3.5 text-white outline-none transition-all font-bold placeholder-gray-600"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>

                                    {/* DOB */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ngày sinh</label>
                                        <input 
                                            type="date" 
                                            name="dob"
                                            value={profile.dob}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-background/50 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-5 py-3.5 text-white outline-none transition-all font-bold [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={saving}
                                        className="bg-primary hover:bg-pink-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-neon-pink transition-all hover:scale-105 flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                                </svg>
                                                LƯU THAY ĐỔI
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog Modal */}
            <DialogModal 
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
};

export default ProfilePage;
