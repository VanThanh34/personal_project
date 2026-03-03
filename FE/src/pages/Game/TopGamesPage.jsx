import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Link } from 'react-router-dom';

const TopGamesPage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('download'); // 'download' | 'view'

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await axiosClient.get('/games');
                const data = res.content || res.data?.content || (Array.isArray(res) ? res : []);
                setGames(data);
            } catch (error) {
                console.error("Lỗi lấy danh sách game:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const sortedGames = [...games].sort((a, b) => {
        if (sortBy === 'view') {
            return (b.viewCount || 0) - (a.viewCount || 0);
        }
        return (b.downloadCount || 0) - (a.downloadCount || 0);
    });

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center pt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-black mb-2">
                            BẢNG XẾP HẠNG <span className="text-primary">TOP GAME</span>
                        </h1>
                        <p className="text-gray-400">Những tựa game được cộng đồng yêu thích nhất hiện nay.</p>
                    </div>

                    <div className="flex items-center gap-3 bg-surface p-1 rounded-lg border border-gray-700">
                        <span className="text-sm font-bold text-gray-400 pl-3">Sắp xếp theo:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-white text-sm font-bold focus:outline-none p-2 rounded-md cursor-pointer hover:bg-white/5"
                        >
                            <option value="download" className="text-black bg-white">
                                ⬇ Lượt tải nhiều nhất
                            </option>
                            <option value="view" className="text-black bg-white">
                                👁 Lượt xem nhiều nhất
                            </option>
                        </select>
                    </div>
                </div>

                {/* Game List */}
                <div className="space-y-4">
                    {sortedGames.map((game, index) => (
                        <Link
                            key={game.id}
                            to={`/games/${game.id}`}
                            className="group block bg-surface rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-6">
                                {/* Rank Number */}
                                <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/5 font-black text-2xl text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                    {index + 1}
                                </div>

                                {/* Thumbnail */}
                                <div className="w-full md:w-64 aspect-video rounded-lg overflow-hidden shrink-0">
                                    <img
                                        src={game.thumbnailUrl || 'https://via.placeholder.com/300x200'}
                                        alt={game.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 text-center md:text-left">
                                    <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                                        {game.categoryName || 'Game'}
                                    </div>
                                    <h3 className="text-2xl font-display font-bold truncate mb-2 group-hover:text-primary transition-colors">
                                        {game.title}
                                    </h3>
                                    <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-gray-400 font-bold">
                                        <span className="flex items-center gap-2">
                                            ⬇ {game.downloadCount || 0}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            👁 {game.viewCount || 0}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            📂 {(game.fileSize / 1024 / 1024 / 1024).toFixed(2)} GB
                                        </span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="shrink-0 mt-4 md:mt-0">
                                    <span className="px-6 py-3 bg-white/5 hover:bg-primary text-white font-bold rounded-lg transition-colors inline-block">
                                        TẢI NGAY
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopGamesPage;
