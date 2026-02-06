import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-surface border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 block">
                            GamePlatform
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Nền tảng tải game miễn phí chất lượng cao. Cập nhật liên tục các tựa game hot nhất, Việt Hóa và Patch mới nhất.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 font-display">Danh Mục</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/search?category=action" className="hover:text-primary transition-colors">Hành Động</Link></li>
                            <li><Link to="/search?category=rpg" className="hover:text-primary transition-colors">Nhập Vai</Link></li>
                            <li><Link to="/search?category=strategy" className="hover:text-primary transition-colors">Chiến Thuật</Link></li>
                            <li><Link to="/search?category=indie" className="hover:text-primary transition-colors">Game Indie</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 font-display">Hỗ Trợ</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="#" className="hover:text-primary transition-colors">Hướng dẫn tải</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Báo lỗi link</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Liên hệ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 font-display">Nhận Tin Mới</h4>
                        <p className="text-gray-400 text-sm mb-4">Đăng ký để nhận thông báo về game mới nhất.</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Email của bạn..." className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary outline-none flex-1" />
                            <button className="bg-primary hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">© 2026 GamePlatform. Design by Văn Thành.</p>
                    <div className="flex gap-4">
                        {/* Social Icons Placeholder */}
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all cursor-pointer">FB</div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all cursor-pointer">YT</div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all cursor-pointer">DC</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
