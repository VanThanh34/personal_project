import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // 1. Khởi tạo state an toàn
    const [stats, setStats] = useState({
        totalGames: 0,
        totalUsers: 0,
        totalDownloads: 0,
        totalViews: 0
    });
    const [topGames, setTopGames] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 2. Fetch dữ liệu
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Gọi song song 3 API
                const [statsRes, topGamesRes, topCatsRes] = await Promise.all([
                    axiosClient.get('/admin/stats').catch(err => ({ data: null })), // Catch lẻ để không chết cả chùm
                    axiosClient.get('/admin/games/stats/top-download?size=5').catch(err => ({ content: [] })),
                    axiosClient.get('/admin/categories/stats/top-view?limit=5').catch(err => [])
                ]);

                // Xử lý an toàn: Nếu API lỗi hoặc trả về null thì dùng object rỗng {}
                // Fallback về state cũ hoặc object mặc định để tránh crash
                const safeStats = statsRes.data || statsRes || {};
                setStats({
                    totalGames: safeStats.totalGames || 0,
                    totalUsers: safeStats.totalUsers || 0,
                    totalDownloads: safeStats.totalDownloads || 0,
                    totalViews: safeStats.totalViews || 0
                });

                setTopGames(topGamesRes.content || topGamesRes.data?.content || []);
                setTopCategories(topCatsRes.data || topCatsRes || []);

            } catch (error) {
                console.error("Lỗi Dashboard Critial:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    // 3. Sử dụng Optional Chaining (?.) và Nullish Coalescing (??) để tránh crash
    const cards = [
        { title: 'TỔNG GAME', value: stats?.totalGames ?? 0, icon: '🎮', color: 'from-pink-500 to-rose-500', link: '/admin/games' },
        { title: 'THÀNH VIÊN', value: stats?.totalUsers ?? 0, icon: '👥', color: 'from-blue-500 to-cyan-500', link: '/admin/users' },
        { title: 'TỔNG LƯỢT TẢI', value: stats?.totalDownloads ?? 0, icon: '⬇️', color: 'from-green-500 to-emerald-500' },
        { title: 'TỔNG LƯỢT XEM', value: stats?.totalViews ?? 0, icon: '👁️', color: 'from-purple-500 to-violet-500' },
    ];

    return (
        <div className="p-6 pt-24 min-h-screen bg-background text-white animate-fade-in pb-20">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        QUẢN TRỊ HỆ THỐNG
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">Tổng quan hoạt động và hiệu suất nền tảng</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/admin/games')} className="px-4 py-2 bg-surface border border-gray-700 hover:border-primary rounded-lg text-sm font-bold transition-all">
                        Quản Lý Game
                    </button>
                    <button onClick={() => navigate('/admin/users')} className="px-4 py-2 bg-surface border border-gray-700 hover:border-secondary rounded-lg text-sm font-bold transition-all">
                        Quản Lý User
                    </button>
                </div>
            </div>

            {/* 1. Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        onClick={() => card.link && navigate(card.link)}
                        className={`relative p-6 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1`}
                    >
                        <div className="relative z-10">
                            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">{card.title}</p>
                            {/* Dùng toLocaleString() an toàn */}
                            <h3 className="text-4xl font-black text-white">{(card.value || 0).toLocaleString()}</h3>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl text-white opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500">
                            {card.icon}
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                ))}
            </div>

            {/* 2. Charts & Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* CỘT TRÁI: Top Games Table */}
                <div className="lg:col-span-2 bg-surface rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-primary">🔥</span> Top Game Thịnh Hành
                        </h2>
                        <button onClick={() => navigate('/admin/games')} className="text-xs font-bold text-gray-400 hover:text-white">Xem tất cả →</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Game</th>
                                <th className="p-4">Danh mục</th>
                                <th className="p-4">Lượt tải</th>
                                <th className="p-4 text-right">Lượt xem</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                            {topGames && topGames.length > 0 ? topGames.map((game, idx) => (
                                <tr key={game.id || idx} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold flex items-center gap-4">
                                            <span className={`w-6 h-6 rounded flex items-center justify-center text-xs ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-700 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                                {idx + 1}
                                            </span>
                                        <div className="flex items-center gap-3">
                                            <img src={game.thumbnailUrl || 'https://via.placeholder.com/50'} alt="" className="w-10 h-10 rounded object-cover" />
                                            <span className="truncate max-w-[150px]">{game.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">{game.categoryName}</td>
                                    <td className="p-4 text-green-400 font-bold">{(game.downloadCount || 0).toLocaleString()}</td>
                                    <td className="p-4 text-right text-blue-400 font-bold">{(game.viewCount || 0).toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Chưa có dữ liệu</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CỘT PHẢI: Top Categories */}
                <div className="bg-surface rounded-2xl border border-gray-800 shadow-xl p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-secondary">📊</span> Danh Mục Hot
                    </h2>
                    <div className="space-y-6">
                        {topCategories && topCategories.length > 0 ? topCategories.map((cat, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-gray-300 group-hover:text-white transition-colors">
                                        {cat.categoryName}
                                    </span>
                                    <span className="text-xs font-bold text-secondary">
                                        {(cat.totalViews || 0).toLocaleString()} views
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                                        style={{
                                            width: `${(cat.totalViews / (topCategories[0]?.totalViews || 1)) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center">Chưa có thống kê danh mục</p>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <h3 className="font-bold text-white mb-4">Trạng thái Server</h3>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm text-gray-400">Database Connection: <span className="text-green-500 font-bold">Stable</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            <span className="text-sm text-gray-400">API Latency: <span className="text-green-500 font-bold">24ms</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;