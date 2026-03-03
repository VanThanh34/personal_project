import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [allGames, setAllGames] = useState([]); // Dữ liệu gốc cho Top Game
    const [games, setGames] = useState([]);      // Dữ liệu cho Grid (có thể bị search/filter)
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [searchTerm, setSearchTerm] = useState('');

    // State Dùng để sắp xếp Top Game
    const [sortBy, setSortBy] = useState('download');

    const categories = ['Tất cả', 'Hành động', 'Nhập vai', 'Phiêu lưu', 'Chiến thuật', 'Game Indie', 'Thể thao'];

    // 1. Fetch dữ liệu gốc ban đầu (Chạy 1 lần)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await axiosClient.get('/games');
                const data = res.content || res.data?.content || (Array.isArray(res) ? res : []);
                setAllGames(data);       // Lưu làm gốc để tính Top Game
                setGames(data);          // Lưu vào list hiển thị
                setFilteredGames(data);  // Lưu vào list filter
            } catch (error) {
                console.error("Lỗi lấy danh sách game:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // 2. Hàm tìm kiếm (Gọi API Search)
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (searchTerm.trim()) {
                res = await axiosClient.get('/games/search', {
                    params: { keyword: searchTerm }
                });
            } else {
                res = await axiosClient.get('/games');
            }
            const data = res.content || res.data?.content || (Array.isArray(res) ? res : []);

            setGames(data);           // Cập nhật list hiển thị
            setFilteredGames(data);   // Cập nhật list filter
            setActiveCategory('Tất cả');
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            setGames([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (category) => {
        setActiveCategory(category);
        if (category === 'Tất cả') {
            setFilteredGames(games);
        } else {
            const filtered = games.filter(game =>
                game.categoryName?.toLowerCase().includes(category.toLowerCase())
            );
            setFilteredGames(filtered);
        }
    };

    // 3. Top Game luôn tính từ allGames (Không bị ảnh hưởng bởi Search)
    const topGames = [...allGames]
        .sort((a, b) => {
            if (sortBy === 'view') {
                return (b.viewCount || 0) - (a.viewCount || 0);
            }
            return (b.downloadCount || 0) - (a.downloadCount || 0);
        })
        .slice(0, 3);

    if (loading) return (
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
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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


                                    <div className="mt-2 text-xs text-gray-400 font-bold flex items-center gap-2">
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
                            key={cat}
                            onClick={() => handleFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-primary text-white shadow-neon-pink scale-105'
                                    : 'bg-surface text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredGames.length > 0 ? (
                        filteredGames.map((game) => (
                            <div key={game.id} className="group bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-2 hover:shadow-game-card">
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
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-500 text-xl">
                                {searchTerm
                                    ? `Không tìm thấy game nào cho từ khóa "${searchTerm}"`
                                    : `Chưa có game nào trong mục "${activeCategory}"`
                                }
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    fetchGames('');
                                    setActiveCategory('Tất cả');
                                }}
                                className="mt-4 text-primary hover:underline"
                            >
                                Xem tất cả game
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;