import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axiosClient.get('/downloads/history');
                setHistory(res);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return (
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
                    <h1 className="text-4xl font-display font-black tracking-tight drop-shadow-lg">LỊCH SỬ TẢI XUỐNG</h1>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-20 bg-surface/60 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
                        <p className="text-gray-400 text-lg mb-6 font-medium">Bạn chưa tải game nào cả.</p>
                        <Link to="/" className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full transition-all shadow-neon-pink hover:scale-105 inline-block">Khám phá game ngay</Link>
                    </div>
                ) : (
                    <div className="bg-surface/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-300">
                                <thead className="bg-black/30 text-xs uppercase font-bold text-gray-400 tracking-widest border-b border-white/10">
                                    <tr>
                                        <th className="px-8 py-5">Game</th>
                                        <th className="px-8 py-5">Thời gian</th>
                                        <th className="px-8 py-5 text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.map((item, index) => (
                                        <tr key={index} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-white text-lg group-hover:text-primary transition-colors">{item.gameTitle}</div>
                                                <div className="text-xs text-gray-500 font-medium tracking-wider mt-1 break-all flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                    </svg>
                                                    Mã Tải Lần Này: {item.downloadId}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-bold text-gray-300">
                                                    {new Date(item.downloadedAt).toLocaleDateString('vi-VN')}
                                                </div>
                                                <div className="text-xs text-secondary font-medium mt-1">
                                                    {new Date(item.downloadedAt).toLocaleTimeString('vi-VN')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <Link to={`/games/${item.gameId}`} className="text-primary hover:text-white text-sm font-bold bg-primary/10 hover:bg-primary px-4 py-2 rounded-full transition-colors inline-block">
                                                    Xem lại
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
