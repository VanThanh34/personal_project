import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const CategoryPage = () => {
    const { category } = useParams(); // Lấy category từ URL
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mapping URL param to display name if needed, or just use param directly
    // Assuming param is like "action", "rpg" maps to "Hành động", "Nhập vai"
    // Or simpler: User passes actual Category Name in URL for now to simpler match
    // Let's decodeURI to handle Vietnamese characters
    const categoryName = decodeURIComponent(category);

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get('/games');
                const allGames = res.content || res.data?.content || (Array.isArray(res) ? res : []);

                // Filter client-side based on category name
                // Flexible matching: includes, case-insensitive
                const filtered = allGames.filter(game =>
                    game.categoryName?.toLowerCase().includes(categoryName.toLowerCase())
                );

                setGames(filtered);
            } catch (error) {
                console.error("Lỗi lấy danh sách game:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, [categoryName]);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center pt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
            <div className="container mx-auto px-6">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
                        DANH MỤC <span className="text-primary uppercase">{categoryName}</span>
                    </h1>
                    <p className="text-gray-400">
                        Danh sách các tựa game thuộc thể loại {categoryName}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {games.length > 0 ? (
                        games.map((game) => (
                            <Link
                                key={game.id}
                                to={`/games/${game.id}`}
                                className="group bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-2 hover:shadow-game-card block"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img
                                        src={game.thumbnailUrl || 'https://via.placeholder.com/300x400'}
                                        alt={game.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-300 flex items-center gap-1">
                                        👁 {game.viewCount || 0}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="text-xs text-gray-500 mb-1">{game.categoryName || 'Game'}</div>
                                    <h3 className="font-display font-bold text-lg truncate group-hover:text-primary transition-colors">
                                        {game.title}
                                    </h3>
                                    <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                                        <span>
                                            {game.fileSize ? (game.fileSize / 1024 / 1024 / 1024).toFixed(2) + ' GB' : 'N/A'}
                                        </span>
                                        <span>⬇ {game.downloadCount || 0}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-500 text-xl">
                                Chưa có game nào trong danh mục này.
                            </p>
                            <Link to="/" className="text-primary hover:underline mt-4 inline-block">
                                Quay lại trang chủ
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
