import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const GameDetailPage = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // State quản lý Modal
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [downloadModal, setDownloadModal] = useState({
        show: false,
        status: 'idle',
        message: ''
    });

    const hasFetched = useRef(false);

    useEffect(() => {
        hasFetched.current = false;
    }, [id]);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchGame = async () => {
            try {
                const res = await axiosClient.get(`/games/${id}`);
                // Chỗ này ông làm đúng rồi nè (res.data || res)
                setGame(res.data || res);
            } catch (error) {
                console.error("Error fetching game:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id]);

    // --- HÀM DOWNLOAD (ĐÃ SỬA LỖI UNDEFINED) ---
    const handleDownload = async () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        setDownloadModal({
            show: true,
            status: 'processing',
            message: 'Đang khởi tạo link tải bảo mật...'
        });

        try {
            const response = await axiosClient.post(`/downloads/generate/${id}`);

            // --- SỬA LỖI TẠI ĐÂY ---
            // Kiểm tra kỹ: nếu response.data có thì lấy, không thì lấy chính response
            const secureLink = response.data || response;

            // Log ra để kiểm tra chắc chắn nó là Link chứ không phải undefined
            console.log("Link tải nhận được:", secureLink);

            if (!secureLink || typeof secureLink !== 'string' || !secureLink.startsWith('http')) {
                throw new Error("Link tải không hợp lệ!");
            }

            // Kích hoạt tải xuống
            window.location.href = secureLink;

            setDownloadModal({
                show: true,
                status: 'success',
                message: 'Link tải dùng 1 lần đã kích hoạt! Trình duyệt đang tải file...'
            });

        } catch (error) {
            console.error("Download failed:", error);
            const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra!";
            setDownloadModal({
                show: true,
                status: 'error',
                message: errorMessage
            });
        }
    };

    const closeDownloadModal = () => {
        setDownloadModal({ ...downloadModal, show: false });
    };

    const redirectToLogin = () => {
        navigate('/login');
    };

    const formatSize = (bytes) => {
        if (!bytes) return 'Unknown';
        const gb = bytes / (1024 * 1024 * 1024);
        if (gb < 1) return (bytes / (1024 * 1024)).toFixed(0) + ' MB';
        return gb.toFixed(2) + ' GB';
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!game) return <div className="text-white text-center pt-20">Không tìm thấy game!</div>;

    return (
        <div className="min-h-screen bg-background pt-20 pb-20 relative">
            <div className="absolute top-0 left-0 w-full h-[70vh] overflow-hidden z-0">
                <img
                    src={game.thumbnailUrl || "https://placehold.co/1920x1080/1e293b/fff?text=Game+Background"}
                    className="w-full h-full object-cover opacity-20 blur-sm scale-105"
                    alt="bg"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 aspect-[3/4] relative group">
                            <img
                                src={game.thumbnailUrl || "https://placehold.co/600x800/1e293b/fff?text=Game+Cover"}
                                alt={game.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-secondary/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                                    Premium
                                </span>
                            </div>
                        </div>

                        <div className="bg-surface/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
                            <div className="flex justify-between items-center mb-6 text-gray-300 text-sm font-bold">
                                <span>Phiên bản</span>
                                <span className="text-white bg-white/10 px-2 py-1 rounded">v1.2.0</span>
                            </div>
                            <button
                                onClick={handleDownload}
                                disabled={downloadModal.status === 'processing'}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 relative overflow-hidden group
                                    ${downloadModal.status === 'processing'
                                    ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                    : 'bg-gradient-to-r from-primary to-secondary text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="relative z-10">Tải Game Ngay</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-secondary font-bold tracking-wider text-sm uppercase">
                                    {game.categoryName || 'GAME'}
                                </span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
                                {game.title}
                            </h1>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <span className="text-xl">👁️</span>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Lượt xem</p>
                                        <p className="text-sm font-bold text-white">{game.viewCount}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <span className="text-xl">⬇️</span>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Lượt tải</p>
                                        <p className="text-sm font-bold text-white">{game.downloadCount}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <span className="text-xl">💾</span>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Dung lượng</p>
                                        <p className="text-sm font-bold text-white">{formatSize(game.fileSize)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface/50 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-secondary"></div>
                                <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-primary">#</span> Giới thiệu Game
                                </h2>
                                <div className="prose prose-invert prose-lg text-gray-300 leading-relaxed font-sans">
                                    {game.description ? (
                                        game.description.split('\n').map((line, i) => (
                                            <p key={i} className="mb-4">{line}</p>
                                        ))
                                    ) : (
                                        <p className="italic text-gray-500">Chưa có mô tả chi tiết cho tựa game này.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL LOGIN */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowLoginModal(false)}></div>
                    <div className="relative bg-surface border border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(236,72,153,0.3)] max-w-md w-full p-8 animate-blob text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Yêu Cầu Đăng Nhập</h3>
                        <p className="text-gray-400 mb-8">Ông bạn già ơi, cần đăng nhập mới tải được game nhé!</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowLoginModal(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors">Để sau</button>
                            <button onClick={redirectToLogin} className="flex-1 py-3 bg-primary hover:bg-pink-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-neon-pink">Đăng Nhập Ngay</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DOWNLOAD */}
            {downloadModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={downloadModal.status !== 'processing' ? closeDownloadModal : undefined}></div>
                    <div className="relative bg-surface border border-gray-700 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in-up">
                        <div className="flex justify-center mb-6">
                            {downloadModal.status === 'processing' && (
                                <div className="relative w-20 h-20">
                                    <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🚀</div>
                                </div>
                            )}
                            {downloadModal.status === 'success' && (
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 animate-bounce-small">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                            {downloadModal.status === 'error' && (
                                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500 animate-shake">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </div>
                            )}
                        </div>
                        <h3 className={`text-2xl font-black mb-3 ${downloadModal.status === 'error' ? 'text-red-500' : downloadModal.status === 'success' ? 'text-green-500' : 'text-white'}`}>
                            {downloadModal.status === 'processing' && "ĐANG XỬ LÝ..."}
                            {downloadModal.status === 'success' && "THÀNH CÔNG!"}
                            {downloadModal.status === 'error' && "CÓ LỖI XẢY RA"}
                        </h3>
                        <p className="text-gray-400 mb-8 font-medium leading-relaxed">{downloadModal.message}</p>
                        {downloadModal.status !== 'processing' && (
                            <button onClick={closeDownloadModal} className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg hover:-translate-y-1 ${downloadModal.status === 'error' ? 'bg-red-600 hover:bg-red-500 shadow-red-500/30' : 'bg-green-600 hover:bg-green-500 shadow-green-500/30'}`}>ĐÃ HIỂU</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameDetailPage;