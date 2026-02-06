import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Khởi tạo state từ localStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // --- HÀM GIẢI MÃ JWT (MỚI) ---
    // Hàm này giúp "đọc" thông tin ẩn bên trong token
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Lỗi giải mã Token:", error);
            return null;
        }
    };

    // Hàm Login (Đã nâng cấp)
    const login = (apiResponse, token) => {
        // 1. Giải mã token để lấy thông tin gốc từ Backend
        const decodedToken = parseJwt(token);
        console.log("Thông tin giải mã từ Token:", decodedToken); // LOG để ông check

        // 2. Tổng hợp dữ liệu user
        // Ưu tiên lấy từ Token (vì nó chuẩn nhất), sau đó mới lấy từ API response
        // Spring Boot thường lưu roles trong key 'roles', 'authorities', hoặc 'scope'
        const userData = {
            ...apiResponse, // Giữ lại các info khác nếu có (như avatar, full name)
            username: decodedToken?.sub || apiResponse.username,
            // Tự động tìm roles ở mọi ngóc ngách trong token
            roles: decodedToken?.roles || decodedToken?.authorities || decodedToken?.scope || []
        };

        console.log("User Data cuối cùng lưu vào Context:", userData);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    const register = async (registerData) => {
        try {
            const res = await axiosClient.post('/auth/register', registerData);
            return { success: true, message: "Đăng ký thành công!" };
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại."
            };
        }
    };

    // Hàm kiểm tra quyền Admin
    const isAdmin = () => {
        if (!user) return false;

        // Lấy roles từ user (lúc này đã được decode chuẩn từ token)
        const roles = user.roles || [];

        console.log("Đang kiểm tra quyền Admin. User roles:", roles);

        if (!Array.isArray(roles) || roles.length === 0) return false;

        // Check xem có chữ ADMIN nào trong mảng roles không
        return roles.some(role => {
            const r = String(role).toUpperCase();
            // Spring Security có thể lưu là "ROLE_ADMIN", "ADMIN", hoặc "SCOPE_ADMIN"
            return r.includes('ADMIN');
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);