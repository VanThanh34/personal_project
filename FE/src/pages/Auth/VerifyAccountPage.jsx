import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const VerifyAccountPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [status, setStatus] = useState('processing'); // processing, success, error
    const [message, setMessage] = useState('Đang xác thực tài khoản...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token không hợp lệ hoặc thiếu token.');
            return;
        }

        const verifyToken = async () => {
            try {
                await axiosClient.get(`/auth/verify?token=${token}`);
                setStatus('success');
                setMessage('Tài khoản của bạn đã được kích hoạt thành công!');

                // Tự động chuyển trang sau 3s
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Xác thực thất bại! Token có thể đã hết hạn.');
            }
        };

        verifyToken();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="mb-6 flex justify-center">
                    {status === 'processing' && (
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {status === 'success' && (
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 animate-bounce-small">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500 animate-shake">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                </div>

                <h2 className={`text-2xl font-bold mb-2 ${status === 'success' ? 'text-green-500' :
                        status === 'error' ? 'text-red-500' : 'text-white'
                    }`}>
                    {status === 'processing' && 'Đang Xử Lý...'}
                    {status === 'success' && 'Thành Công!'}
                    {status === 'error' && 'Thất Bại'}
                </h2>

                <p className="text-gray-400 mb-6">{message}</p>

                {status === 'success' && (
                    <p className="text-sm text-gray-500 animate-pulse">Đang chuyển hướng về trang đăng nhập...</p>
                )}

                {status === 'error' && (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-bold transition-all"
                    >
                        Về Đăng Nhập
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerifyAccountPage;
