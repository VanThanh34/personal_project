import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

// IMPORT THƯ VIỆN WEBSOCKET
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const AdminDashboard = () => {
    // State thống kê
    const [stats, setStats] = useState({});
    // State cho 2 bảng Top
    const [topDownloads, setTopDownloads] = useState([]);
    const [topViews, setTopViews] = useState([]);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- HÀM FETCH DỮ LIỆU (Tách ra để dùng lại khi WebSocket báo tin) ---
    const fetchAllData = async () => {
        try {
            const [statsRes, topDownloadRes, topViewRes] = await Promise.all([
                axiosClient.get('/admin/stats').catch(() => ({})),
                axiosClient.get('/admin/games/stats/top-download?size=5').catch(() => ({ content: [] })),
                axiosClient.get('/admin/games/stats/top-view?size=5').catch(() => ({ content: [] }))
            ]);

            setStats(statsRes.data || statsRes || {});
            setTopDownloads(topDownloadRes.content || topDownloadRes.data?.content || []);
            setTopViews(topViewRes.content || topViewRes.data?.content || []);
        } catch (error) {
            console.error("Dashboard Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // 1. Load dữ liệu lần đầu khi vào trang
    useEffect(() => {
        fetchAllData();
    }, []);

    // 2. KẾT NỐI WEBSOCKET
    useEffect(() => {
        // Lưu ý: Dùng đường dẫn gốc http://localhost:8080/ws để tránh lỗi proxy
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, () => {
            console.log('⚡ WebSocket Connected: Sẵn sàng nhận tín hiệu!');

            // Đăng ký nhận tin nhắn từ topic
            stompClient.subscribe('/topic/admin-update', (message) => {
                if (message.body === 'REFRESH_DASHBOARD') {
                    console.log("🔄 Có dữ liệu mới! Đang cập nhật Dashboard...");
                    // Gọi hàm fetch lại dữ liệu ngay lập tức
                    fetchAllData();
                }
            });
        }, (error) => {
            console.error('WebSocket Error:', error);
        });

        // Ngắt kết nối khi rời trang Dashboard
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, []);

    const handleViewAll = (type) => {
        if (type === 'download') {
            navigate('/admin/games?sort=downloadCount,desc');
        } else {
            navigate('/admin/games?sort=viewCount,desc');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    const cards = [
        { title: 'TỔNG GAME', value: stats?.totalGames ?? 0, icon: '🎮', color: 'from-pink-500 to-rose-500' },
        { title: 'THÀNH VIÊN', value: stats?.totalUsers ?? 0, icon: '👥', color: 'from-blue-500 to-cyan-500' },
        { title: 'LƯỢT TẢI', value: stats?.totalDownloads ?? 0, icon: '⬇️', color: 'from-green-500 to-emerald-500' },
        { title: 'LƯỢT XEM', value: stats?.totalViews ?? 0, icon: '👁️', color: 'from-purple-500 to-violet-500' },
    ];

    // Hàm xử lý ảnh lỗi (Fallback Image)
    const handleImageError = (e) => {
        e.target.onerror = null; // Tránh loop vô hạn
        e.target.src = "https://placehold.co/64x64/2d2d2d/FFF?text=GAME";
    };

    return (
        <div className="p-6 pt-24 min-h-screen bg-background text-white animate-fade-in pb-20">
            <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {cards.map((card, index) => (
                    <div key={index} className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg text-white`}>
                        <p className="text-xs font-bold uppercase opacity-80">{card.title}</p>
                        <h3 className="text-3xl font-black mt-1">{(card.value || 0).toLocaleString()}</h3>
                    </div>
                ))}
            </div>

            {/* Grid 2 Cột */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. BẢNG TOP DOWNLOAD */}
                <div className="bg-surface rounded-2xl border border-gray-800 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-green-400">
                            <span>⬇️</span> Top 5 Tải Nhiều
                        </h2>
                        <button
                            onClick={() => handleViewAll('download')}
                            className="text-xs font-bold text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg transition-all"
                        >
                            Xem tất cả →
                        </button>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-800">
                            {topDownloads.map((game, idx) => (
                                <tr key={game.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 w-12 text-center font-mono text-gray-500 font-bold">{idx + 1}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {/* SỬA LỖI ẢNH TẠI ĐÂY */}
                                            <img
                                                src={game.thumbnailUrl || "https://placehold.co/64x64/2d2d2d/FFF?text=GAME"}
                                                alt={game.title}
                                                className="w-10 h-10 rounded object-cover border border-gray-700"
                                                onError={handleImageError} // Bắt sự kiện lỗi ảnh
                                            />
                                            <span className="font-bold truncate max-w-[150px]">{game.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-bold text-green-400">
                                        {game.downloadCount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. BẢNG TOP VIEW */}
                <div className="bg-surface rounded-2xl border border-gray-800 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-blue-400">
                            <span>👁️</span> Top 5 Xem Nhiều
                        </h2>
                        <button
                            onClick={() => handleViewAll('view')}
                            className="text-xs font-bold text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg transition-all"
                        >
                            Xem tất cả →
                        </button>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-800">
                            {topViews.map((game, idx) => (
                                <tr key={game.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 w-12 text-center font-mono text-gray-500 font-bold">{idx + 1}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {/* SỬA LỖI ẢNH TẠI ĐÂY */}
                                            <img
                                                src={game.thumbnailUrl || "https://placehold.co/64x64/2d2d2d/FFF?text=GAME"}
                                                alt={game.title}
                                                className="w-10 h-10 rounded object-cover border border-gray-700"
                                                onError={handleImageError} // Bắt sự kiện lỗi ảnh
                                            />
                                            <span className="font-bold truncate max-w-[150px]">{game.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-bold text-blue-400">
                                        {game.viewCount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;