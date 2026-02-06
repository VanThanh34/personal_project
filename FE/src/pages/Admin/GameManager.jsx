import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useSearchParams } from 'react-router-dom'; // Import hook này

const GameManager = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy tham số từ URL (?sort=...)
    const [searchParams] = useSearchParams();
    const sortParam = searchParams.get('sort') || 'id,desc'; // Mặc định là mới nhất

    const fetchGames = async () => {
        try {
            setLoading(true);
            // Truyền tham số sort xuống API Backend
            const res = await axiosClient.get(`/admin/games?size=100&sort=${sortParam}`);
            setGames(res.content || res.data?.content || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Khi URL thay đổi (sortParam đổi), tự động gọi lại API
    useEffect(() => {
        fetchGames();
    }, [sortParam]);

    const handleDelete = async (id) => {
        if (window.confirm("CẢNH BÁO: Xóa game này?")) {
            try {
                await axiosClient.delete(`/admin/games/${id}`);
                fetchGames();
            } catch (e) { alert("Lỗi xóa game"); }
        }
    };

    return (
        <div className="p-6 pt-24 min-h-screen bg-background text-white animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold">Quản Lý Game</h1>
                    {/* Hiển thị dòng trạng thái đang sắp xếp theo gì */}
                    <p className="text-primary text-sm font-bold mt-1">
                        {sortParam.includes('downloadCount') && 'Đang sắp xếp: Tải nhiều nhất ⬇️'}
                        {sortParam.includes('viewCount') && 'Đang sắp xếp: Xem nhiều nhất 👁️'}
                        {sortParam.includes('id') && 'Đang sắp xếp: Mới nhất 🕒'}
                    </p>
                </div>
                {/* ... (Giữ nguyên nút Thêm game cũ) */}
                <button className="bg-primary hover:bg-pink-600 px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/30">
                    + Thêm Game
                </button>
            </div>

            {/* ... (Giữ nguyên Table cũ của ông) */}
            <div className="bg-surface rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Game</th>
                        <th className="p-4">Thống kê</th> {/* Gộp Download/View vào cột này cho gọn */}
                        <th className="p-4">Trạng thái</th>
                        <th className="p-4 text-center">Hành Động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                    {games.map(game => (
                        <tr key={game.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-gray-500">#{game.id}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src={game.thumbnailUrl} className="w-10 h-10 rounded object-cover" alt="" />
                                    <span className="font-bold">{game.title}</span>
                                </div>
                            </td>
                            <td className="p-4 text-sm">
                                <div className="text-green-400">⬇ {game.downloadCount}</div>
                                <div className="text-blue-400">👁 {game.viewCount}</div>
                            </td>
                            <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${game.enabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {game.enabled ? 'Active' : 'Disabled'}
                                    </span>
                            </td>
                            <td className="p-4 text-center">
                                <button onClick={() => handleDelete(game.id)} className="text-red-500 hover:text-white hover:bg-red-600 p-2 rounded transition-colors">🗑️</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GameManager;