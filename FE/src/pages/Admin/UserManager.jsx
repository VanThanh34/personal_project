import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Gọi API: /admin/users (Khớp AdminUserController.java)
            const res = await axiosClient.get('/admin/users');
            setUsers(res.data || res);
        } catch (error) {
            console.error("Lỗi tải user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // Hàm Khóa/Mở khóa User
    const toggleStatus = async (user) => {
        const action = user.enabled ? 'disable' : 'enable';
        const confirmMsg = user.enabled
            ? `Bạn có muốn KHÓA tài khoản ${user.username}?`
            : `Bạn có muốn MỞ KHÓA tài khoản ${user.username}?`;

        if (window.confirm(confirmMsg)) {
            try {
                // Gọi API Disable/Enable (Khớp AdminUserController.java)
                await axiosClient.put(`/admin/users/${user.id}/${action}`);
                alert("Cập nhật trạng thái thành công!");
                fetchUsers(); // Load lại
            } catch (error) {
                alert("Lỗi khi cập nhật trạng thái!");
            }
        }
    }

    return (
        <div className="p-6 pt-24 min-h-screen bg-background text-white animate-fade-in">
            <h1 className="text-3xl font-display font-bold mb-8">Quản Lý Người Dùng</h1>

            <div className="bg-surface rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Thành viên</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Vai Trò</th>
                        <th className="p-4 text-center">Trạng Thái</th>
                        <th className="p-4 text-center">Hành Động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                    {loading ? (
                        <tr><td colSpan="6" className="p-8 text-center">Đang tải...</td></tr>
                    ) : users.map(user => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-gray-500">#{user.id}</td>
                            <td className="p-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                        className="w-full h-full rounded-full"
                                        alt=""
                                    />
                                </div>
                                <span className="font-bold text-white">{user.username}</span>
                            </td>
                            <td className="p-4 text-gray-400">{user.email}</td>
                            <td className="p-4">
                                {(user.roles || []).map((r, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20 mr-1">
                                            {r.name || r.authority || r}
                                        </span>
                                ))}
                            </td>
                            <td className="p-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        user.enabled
                                            ? 'bg-green-500/20 text-green-500'
                                            : 'bg-red-500/20 text-red-500'
                                    }`}>
                                        {user.enabled ? 'Active' : 'Banned'}
                                    </span>
                            </td>
                            <td className="p-4 text-center">
                                <button
                                    onClick={() => toggleStatus(user)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        user.enabled
                                            ? 'bg-red-600 hover:bg-red-500 text-white'
                                            : 'bg-green-600 hover:bg-green-500 text-white'
                                    }`}
                                >
                                    {user.enabled ? 'Khóa' : 'Mở Khóa'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;