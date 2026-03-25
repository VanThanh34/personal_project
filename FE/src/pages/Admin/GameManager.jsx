import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useSearchParams } from 'react-router-dom'; 
import DialogModal from '../../components/UI/DialogModal';

const GameManager = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editGameId, setEditGameId] = useState(null);
    const [dialogConfig, setDialogConfig] = useState({ isOpen: false, title: '', message: '', type: 'alert', onConfirm: null });

    const showDialog = (title, message, type = 'alert', onConfirm = null) => {
        setDialogConfig({ isOpen: true, title, message, type, onConfirm });
    };

    const closeDialog = () => {
        setDialogConfig(prev => ({ ...prev, isOpen: false }));
    };
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnailUrl: '',
        downloadUrl: '',
        categoryId: '',
        fileSize: ''
    });

    // Lấy tham số từ URL (?sort=...)
    const [searchParams, setSearchParams] = useSearchParams();
    const sortParam = searchParams.get('sort') || 'id,desc'; // Mặc định là mới nhất

    const fetchGames = async () => {
        try {
            setLoading(true);
            // Truyền tham số sort xuống API Backend 
            const res = await axiosClient.get(`/admin/games?size=100&sort=${sortParam}`);
            setGames(res.content || res.data?.content || []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axiosClient.get('/admin/categories/stats');
            setCategories(Array.isArray(res) ? res : res.content || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Khi URL thay đổi (sortParam đổi), tự động gọi lại API Fetch Games
    useEffect(() => {
        fetchGames();
    }, [sortParam]);

    // Gọi lần đầu để lấy danh sách Category
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = (id) => {
        showDialog('Xác Nhận Vô Hiệu Hoá', 'CẢNH BÁO: Bạn chắc chắn muốn vô hiệu hóa game này chứ?', 'confirm', async () => {
            try {
                await axiosClient.delete(`/admin/games/${id}`);
                fetchGames();
                closeDialog();
                setTimeout(() => showDialog('Thành Công', 'Vô hiệu hóa game thành công!', 'alert'), 300);
            } catch (e) { 
                closeDialog();
                setTimeout(() => showDialog('Lỗi', 'Lỗi vô hiệu hóa game', 'alert'), 300);
            }
        });
    };

    const handleRestore = (id) => {
        showDialog('Xác Nhận Khôi Phục', 'Bạn muốn khôi phục game này về trạng thái hoạt động?', 'confirm', async () => {
            try {
                await axiosClient.put(`/admin/games/${id}/restore`);
                fetchGames();
                closeDialog();
                setTimeout(() => showDialog('Thành Công', 'Khôi phục game thành công!', 'alert'), 300);
            } catch (e) { 
                closeDialog();
                setTimeout(() => showDialog('Lỗi', 'Lỗi khôi phục game', 'alert'), 300);
            }
        });
    };

    const handleOpenAdd = () => {
        setFormData({ title: '', description: '', thumbnailUrl: '', downloadUrl: '', categoryId: '', fileSize: '' });
        setEditGameId(null);
        setShowModal(true);
    };

    const handleOpenEdit = (game) => {
        setFormData({
            title: game.title || '',
            description: game.description || '',
            thumbnailUrl: game.thumbnailUrl || '',
            downloadUrl: game.downloadUrl || '',
            categoryId: game.categoryId || '',
            fileSize: game.fileSize || ''
        });
        setEditGameId(game.id);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                categoryId: formData.categoryId ? Number(formData.categoryId) : 1,
                fileSize: formData.fileSize ? Number(formData.fileSize) : 0,
                enabled: editGameId ? formData.enabled !== false : true
            };
            if (editGameId) {
                await axiosClient.put(`/admin/games/${editGameId}`, payload);
                showDialog('Thành Công', 'Cập nhật thông tin game thành công!', 'alert');
            } else {
                await axiosClient.post('/admin/games', payload);
                showDialog('Thành Công', 'Thêm game mới thành công!', 'alert');
            }
            setShowModal(false);
            fetchGames();
        } catch (error) {
            console.error(error);
            showDialog('Lỗi Hệ Thống', 'Đã xảy ra lỗi khi lưu game. Vui lòng thử lại!', 'alert');
        }
    };

    return (
        <div className="p-6 pt-24 min-h-screen bg-background text-white animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold">Quản Lý Game</h1>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-gray-400 text-sm font-bold">Sắp xếp theo:</span>
                        <select 
                            value={sortParam}
                            onChange={(e) => setSearchParams({ sort: e.target.value })}
                            className="bg-gray-800 text-sm font-bold text-white border border-gray-600 rounded px-3 py-1 outline-none"
                        >
                            <option value="id,desc">Mới nhất 🕒</option>
                            <option value="title,asc">Tên Game (A-Z) 🔤</option>
                            <option value="viewCount,desc">Nhiều lượt xem 👁️</option>
                            <option value="downloadCount,desc">Nhiều lượt tải ⬇️</option>
                        </select>
                    </div>
                </div>
                <button onClick={handleOpenAdd} className="bg-primary hover:bg-pink-600 px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/30">
                    + Thêm Game
                </button>
            </div>


            <div className="bg-surface rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Game</th>
                        <th className="p-4">Danh mục</th>
                        <th className="p-4">Thống kê</th>
                        <th className="p-4">Trạng thái</th>
                        <th className="p-4 text-center">Hành Động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                    {games.map(game => (
                        <tr key={game.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-gray-500">#{game.id}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src={game.thumbnailUrl} className="w-10 h-10 rounded object-cover" alt="" />
                                    <span className="font-bold">{game.title}</span>
                                </div>
                            </td>
                            <td className="p-4 text-sm">
                                <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded">{game.categoryName || 'Không có'}</span>
                            </td>
                            <td className="p-4 text-sm">
                                <div className="text-green-400">⬇ {game.downloadCount}</div>
                                <div className="text-blue-400">👁 {game.viewCount}</div>
                            </td>
                            <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${game.enabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {game.enabled ? 'Active' : 'Disabled'}
                                    </span>
                            </td>
                            <td className="p-4 text-center">
                                <button onClick={() => handleOpenEdit(game)} className="text-blue-400 hover:text-white hover:bg-blue-600 p-2 rounded transition-colors mr-2">✏️</button>
                                {game.enabled !== false ? (
                                    <button onClick={() => handleDelete(game.id)} className="text-red-500 hover:text-white hover:bg-red-600 p-2 rounded transition-colors">🗑️</button>
                                ) : (
                                    <button onClick={() => handleRestore(game.id)} className="text-green-500 hover:text-white hover:bg-green-600 p-2 rounded transition-colors">♻️</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 font-display text-white">
                            {editGameId ? 'Chỉnh Sửa Game' : 'Thêm Game Mới'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Tiêu đề Game (*)</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Mô tả</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-primary"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Thumbnail URL</label>
                                    <input type="text" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Download URL (*)</label>
                                    <input required type="text" name="downloadUrl" value={formData.downloadUrl} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Danh mục (*)</label>
                                    <select 
                                        required 
                                        name="categoryId" 
                                        value={formData.categoryId} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white outline-none focus:border-primary"
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(cat => (
                                            <option key={cat.categoryId} value={cat.categoryId}>
                                                {cat.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">File Size (Bytes)</label>
                                    <input type="number" name="fileSize" value={formData.fileSize} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white outline-none focus:border-primary" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-700">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                    Hủy
                                </button>
                                <button type="submit" className="px-6 py-2 bg-primary hover:bg-pink-600 font-bold rounded shadow-lg shadow-primary/30 transition-colors">
                                    {editGameId ? 'Cập Nhật' : 'Tạo Mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Dialog Modal */}
            <DialogModal 
                isOpen={dialogConfig.isOpen}
                title={dialogConfig.title}
                message={dialogConfig.message}
                type={dialogConfig.type}
                onConfirm={dialogConfig.onConfirm}
                onClose={closeDialog}
            />
        </div>
    );
};

export default GameManager;