import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Link, useNavigate } from 'react-router-dom';
import FavoriteButton from '../../components/UI/FavoriteButton';
import { useAuth } from '../../context/AuthContext';

const FavoriteGamesPage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get('/user/favorites', { params: { page, size: 10 } });
                setGames(res.content || res.data?.content || []);
                setTotalPages(res.totalPages !== undefined ? res.totalPages : (res.data?.totalPages || 0));
            } catch (error) {
                console.error("Lỗi lấy danh sách game yêu thích:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [page, isAuthenticated, navigate]);

    // Helper tính toán các trang hiển thị (2 trước, 2 sau)
    const getPageNumbers = () => {
        let startPage = Math.max(0, page - 2);
        let endPage = Math.min(totalPages - 1, page + 2);

        if (endPage - startPage < 4) {
            if (startPage === 0) {
                endPage = Math.min(totalPages - 1, startPage + 4);
            } else if (endPage === totalPages - 1) {
                startPage = Math.max(0, endPage - 4);
            }
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (loading && games.length === 0) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
            <div className="container mx-auto px-6">
                
                <div className="flex items-center gap-4 mb-12 border-b border-gray-800 pb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                        <span className="text-2xl">❤️</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-bold">GAME YÊU THÍCH</h1>
                        <p className="text-gray-400 text-sm mt-1">Danh sách tinh hoa do chính bạn bình chọn</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {games.length > 0 ? (
                        <>
                            {games.map((game) => (
                                <div key={game.id} className="group bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-2 hover:shadow-game-card flex flex-col">
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <img
                                            src={game.thumbnailUrl || 'https://via.placeholder.com/300x400'}
                                            alt={game.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <Link
                                                to={`/games/${game.id}`}
                                                className="px-6 py-3 bg-primary text-white font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                            >
                                                CHI TIẾT
                                            </Link>
                                        </div>
                                        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                                            <div className="bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-300 flex items-center gap-1">
                                                👁 {game.viewCount || 0}
                                            </div>
                                            <div className="bg-black/50 backdrop-blur p-1.5 rounded-full hover:bg-black/80 transition-colors z-10 pointer-events-auto">
                                                <FavoriteButton gameId={game.id} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="text-xs text-gray-500 mb-1">{game.categoryName || 'Game'}</div>
                                        <h3 className="font-display font-bold text-lg truncate group-hover:text-primary transition-colors flex-1">
                                            {game.title}
                                        </h3>
                                        <div className="mt-2 text-xs text-gray-400 font-bold flex items-center justify-between gap-2">
                                            <span className="text-green-400 flex items-center gap-1">
                                                ⬇ {game.downloadCount || 0} lượt tải
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="col-span-full text-center py-20 bg-surface/50 rounded-2xl border border-gray-800 border-dashed">
                            <div className="text-6xl mb-4 opacity-50">💔</div>
                            <h3 className="text-2xl font-bold mb-2">Chưa có game yêu thích nào!</h3>
                            <p className="text-gray-500 text-base mb-6">
                                Hãy dạo vòng trang chủ và thả tim những tựa game bạn ưng ý nhé.
                            </p>
                            <Link to="/" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-full hover:shadow-neon-pink transition-all hover:scale-105">
                                KHÁM PHÁ NGAY
                            </Link>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 md:gap-4 mt-12 w-full">
                        <button
                            disabled={page === 0}
                            onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="bg-surface border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base hidden sm:block"
                        >
                            &laquo; Trang Trước
                        </button>
                        
                        <div className="flex items-center gap-1 md:gap-2">
                            {getPageNumbers().map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg font-bold transition-all text-sm md:text-base ${page === pageNum
                                        ? 'bg-primary text-white shadow-neon-pink'
                                        : 'bg-surface border border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {pageNum + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="bg-surface border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base hidden sm:block"
                        >
                            Trang Sau &raquo;
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default FavoriteGamesPage;
