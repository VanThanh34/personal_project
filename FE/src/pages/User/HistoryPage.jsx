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
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4">
                    Lịch sử tải xuống
                </h1>

                {history.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-white/5">
                        <p className="text-gray-400 text-lg mb-4">Bạn chưa tải game nào cả.</p>
                        <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">Khám phá game ngay &rarr;</Link>
                    </div>
                ) : (
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-300">
                                <thead className="bg-slate-900/50 text-xs uppercase font-semibold text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">Game</th>
                                        <th className="px-6 py-4">Ngày tải</th>
                                        <th className="px-6 py-4 text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.map((item, index) => (
                                        <tr key={index} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white text-lg">{item.gameTitle}</div>
                                                <div className="text-xs text-gray-500">Mã: {item.gameCode}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(item.downloadDate).toLocaleDateString('vi-VN')}
                                                <br />
                                                <span className="text-xs text-gray-600">
                                                    {new Date(item.downloadDate).toLocaleTimeString('vi-VN')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link to={`/games/${item.gameId}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
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
