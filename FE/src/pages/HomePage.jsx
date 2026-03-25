import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/UI/FavoriteButton';

const HomePage = () => {
    const [games, setGames] = useState([]);
    const [topGames, setTopGames] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination & Filter States
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [activeCategory, setActiveCategory] = useState({ id: null, name: 'Tất cả' });
    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState(''); // Chỉ tìm khi submit
    const [sortBy, setSortBy] = useState('download'); // download hoặc view

    const categories = [
        { id: null, name: 'Tất cả' },
        { id: 1, name: 'Hành động' },
        { id: 2, name: 'Nhập vai' },
        { id: 3, name: 'Phiêu lưu' },
        { id: 5, name: 'Chiến thuật' },
        { id: 6, name: 'Kinh dị' },
        { id: 4, name: 'Thể thao' }
    ];

    // Fetch Top Games độc lập
    useEffect(() => {
        const fetchTopGames = async () => {
            try {
                const sortField = sortBy === 'view' ? 'viewCount' : 'downloadCount';
                const res = await axiosClient.get(`/games/search`, {
                    params: { sort: `${sortField},desc`, page: 0, size: 3 }
                });
                setTopGames(res.content || res.data?.content || []);
            } catch (error) {
                console.error("Lỗi lấy Top Game:", error);
            }
        };
        fetchTopGames();
    }, [sortBy]);

    // Fetch Games Grid (Phân trang thực sự trên Server)
    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                const params = { page, size: 10 };
                if (appliedSearch.trim()) params.keyword = appliedSearch;
                if (activeCategory.id) params.categoryId = activeCategory.id;

                const res = await axiosClient.get('/games/search', { params });
                setGames(res.content || res.data?.content || []);
                setTotalPages(res.totalPages !== undefined ? res.totalPages : (res.data?.totalPages || 0));
            } catch (error) {
                console.error("Lỗi lấy danh sách game:", error);
                setGames([]);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, [page, activeCategory, appliedSearch]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        setAppliedSearch(searchInput);
        setActiveCategory({ id: null, name: 'Tất cả' });
    };

    const handleFilter = (catObj) => {
        setActiveCategory(catObj);
        setPage(0);
    };

    // Helper tính toán các trang hiển thị (2 trước, 2 sau)
    const getPageNumbers = () => {
        let startPage = Math.max(0, page - 2);
        let endPage = Math.min(totalPages - 1, page + 2);

        // Đảm bảo luôn cố gắng hiển thị đủ 5 nút nếu có thể
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
        <div className="min-h-screen bg-background text-white pb-20">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10"></div>
                <div className="container mx-auto text-center animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
                        KHO GAME <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500">
                            CHẤT LƯỢNG CAO
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                        Tải game miễn phí, tốc độ cao. Cập nhật liên tục các tựa game hot nhất từ thị trường.
                    </p>

                    {/* SEARCH BAR */}
                    <div className="max-w-2xl mx-auto relative group z-10">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <form onSubmit={handleSearch} className="relative flex items-center bg-gray-900 rounded-full p-2 border border-gray-700 shadow-2xl">
                            <input
                                type="text"
                                className="flex-1 bg-transparent text-white px-6 py-3 focus:outline-none placeholder-gray-500 font-medium"
                                placeholder="Bạn muốn tìm game gì hôm nay? (VD: GTA, Elden Ring...)"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-primary hover:bg-pink-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-neon-pink flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span>TÌM</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* TOP TRENDING SECTION */}
            {topGames.length > 0 && (
                <section id="top-games" className="container mx-auto px-6 mb-20">
                    {/* Header Top Game + Dropdown Sort */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-1 h-8 bg-primary rounded-full"></div>
                            <h2 className="text-2xl font-display font-bold">GAME NỔI BẬT</h2>
                        </div>


                        <div className="flex items-center gap-3 bg-surface p-1 rounded-lg border border-gray-700">
                            <span className="text-xs font-bold text-gray-400 pl-3">Xếp theo:</span>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topGames.map((game, index) => (
                            <Link key={game.id} to={`/games/${game.id}`} className="relative group h-[250px] rounded-2xl overflow-hidden cursor-pointer block border border-transparent hover:border-primary/50 transition-all">
                                <img
                                    src={game.thumbnailUrl || 'https://via.placeholder.com/400x300'}
                                    alt={game.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                                <div className="absolute top-4 left-4 font-black text-6xl text-white/10 group-hover:text-primary/20 transition-colors">
                                    0{index + 1}
                                </div>

                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1 block">
                                        {game.categoryName || 'Hot'}
                                    </span>
                                    <h3 className="text-xl font-bold truncate">{game.title}</h3>


                                    <div className="mt-2 text-xs text-gray-400 font-bold flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            {sortBy === 'download' ? (
                                                <span className="text-green-400 flex items-center gap-1">
                                                    ⬇ {game.downloadCount} lượt tải
                                                </span>
                                            ) : (
                                                <span className="text-blue-400 flex items-center gap-1">
                                                    👁 {game.viewCount} lượt xem
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-black/40 backdrop-blur p-1.5 rounded-full hover:bg-black/60 transition-colors pointer-events-auto">
                                            <FavoriteButton gameId={game.id} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* MAIN CATALOG SECTION */}
            <section className="container mx-auto px-6">
                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => handleFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory.name === cat.name
                                ? 'bg-primary text-white shadow-neon-pink scale-105'
                                : 'bg-surface text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Game Grid */}
                {/* Game Grid */}
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
                                        <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                                            <span>
                                                {game.fileSize ? (game.fileSize / 1024 / 1024 / 1024).toFixed(2) + ' GB' : 'N/A'}
                                            </span>
                                            <span>⬇ {game.downloadCount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-500 text-xl">
                                {appliedSearch
                                    ? `Không tìm thấy game nào cho từ khóa "${appliedSearch}"`
                                    : `Chưa có game nào trong mục "${activeCategory.name}"`
                                }
                            </p>
                            <button
                                onClick={() => {
                                    setSearchInput('');
                                    setAppliedSearch('');
                                    setActiveCategory({ id: null, name: 'Tất cả' });
                                    setPage(0);
                                }}
                                className="mt-4 text-primary hover:underline"
                            >
                                Xem tất cả game
                            </button>
                        </div>
                    )}
                </div>

                {/* SERVER-SIDE PAGINATION CONTROLS */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 md:gap-4 mt-12 w-full">
                        <button
                            disabled={page === 0}
                            onClick={() => {
                                setPage(page - 1);
                                window.scrollTo({ top: document.getElementById('top-games')?.offsetTop || 0, behavior: 'smooth' });
                            }}
                            className="bg-surface border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base hidden sm:block"
                        >
                            &laquo; Trang Trước
                        </button>
                        <button
                            disabled={page === 0}
                            onClick={() => {
                                setPage(page - 1);
                                window.scrollTo({ top: document.getElementById('top-games')?.offsetTop || 0, behavior: 'smooth' });
                            }}
                            className="bg-surface border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-bold transition-all text-sm sm:hidden"
                        >
                            &laquo;
                        </button>

                        <div className="flex items-center gap-1 md:gap-2">
                            {/* Trang đầu tiên nếu bị ẩn */}
                            {getPageNumbers()[0] > 0 && (
                                <>
                                    <button
                                        onClick={() => {
                                            setPage(0);
                                            window.scrollTo({ top: document.getElementById('top-games')?.offsetTop || 0, behavior: 'smooth' });
                                        }}
                                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg font-bold bg-surface border border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white transition-all text-sm md:text-base"
                                    >
                                        1
                                    </button>
                                    {getPageNumbers()[0] > 1 && <span className="text-gray-500 font-bold px-1 md:px-2">...</span>}
                                </>
                            )}

                            {/* Các trang lân cận */}
                            {getPageNumbers().map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => {
                                        setPage(pageNum);
                                        window.scrollTo({ top: document.getElementById('top-games')?.offsetTop || 0, behavior: 'smooth' });
                                    }}
                                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg font-bold transition-all text-sm md:text-base ${page === pageNum
                                        ? 'bg-primary text-white shadow-neon-pink'
                                        : 'bg-surface border border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {pageNum + 1}
                                </button>
                            ))}

                            {/* Trang cuối cùng nếu bị ẩn */}
                            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                                <>
                                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 2 && <span className="text-gray-500 font-bold px-1 md:px-2">...</span>}
                                    <button
                                        onClick={() => {
                                            setPage(totalPages - 1);
                                            window.scrollTo({ top: document.getElementById('top-games')?.offsetTop || 0, behavior: 'smooth' });
                                        }}
                                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg font-bold bg-surface border border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white transition-all text-sm md:text-base"
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}
                        </div>

                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => {
                                setPage(page + 1);
                                window.scrollTo({ top: document.getElementById('top-games')?.offsetTop || 0, behavior: 'smooth' });
                            }}
                            className="bg-surface border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base hidden sm:block"
                        >
                            Trang Sau &raquo;
                        </button>
                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => {
                                setPage(page + 1);
                                window.scrollTo({ top: document.getElementById('top-games')?.offsetTop || 0, behavior: 'smooth' });
                            }}
                            className="bg-surface border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-bold transition-all text-sm sm:hidden"
                        >
                            &raquo;
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;