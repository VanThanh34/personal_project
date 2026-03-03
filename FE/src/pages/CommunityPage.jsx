import React from 'react';

const CommunityPage = () => {
    return (
        <div className="min-h-screen bg-background text-white pb-20 pt-20">
            {/* HERO SECTION */}
            <section className="relative py-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[100px] -z-10"></div>
                <div className="container mx-auto text-center animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-display font-black mb-6">
                        CỘNG ĐỒNG <span className="text-primary">GAME THỦ</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                        Nơi giao lưu, chia sẻ kinh nghiệm và cập nhật những tựa game mới nhất. Tham gia ngay để không bỏ lỡ!
                    </p>
                </div>
            </section>

            {/* DISCORD SECTION */}
            <section className="container mx-auto px-6 mb-20">
                <div className="bg-[#5865F2] rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl hover:shadow-neon-blue transition-all duration-300">
                    <div className="relative z-10 max-w-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <i className="fab fa-discord text-4xl text-white"></i>
                            <h2 className="text-3xl font-display font-bold text-white">Discord Server</h2>
                        </div>
                        <p className="text-white/90 text-lg mb-6">
                            Tham gia máy chủ Discord chính thức của chúng tôi để trò chuyện trực tiếp với Admin, báo lỗi game, và tìm bạn chơi cùng.
                        </p>
                        <div className="flex items-center gap-4 text-white/80 text-sm font-bold mb-8">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span> 500+ Online
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span> 2000+ Thành viên
                            </span>
                        </div>
                        <a
                            href="https://discord.gg/A43sxJMhsA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-8 py-3 bg-white text-[#5865F2] font-black rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            THAM GIA NGAY
                        </a>
                    </div>
                    {/* Decorative Icon Background */}
                    <div className="absolute right-[-50px] bottom-[-50px] text-white/10 text-[300px] font-black rotate-12 select-none pointer-events-none">
                        <i className="fab fa-discord"></i>
                    </div>
                </div>
            </section>

            {/* ADMIN CONTACT SECTION */}
            <section className="container mx-auto px-6 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Admin Card */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-8 hover:border-primary/50 transition-all group">
                        <h3 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
                            <span className="text-blue-500"><i className="fab fa-facebook"></i></span>
                            Liên hệ Admin
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Gặp vấn đề về tải game, cài đặt hoặc muốn đóng góp ý kiến? Nhắn tin trực tiếp cho Admin qua Facebook.
                        </p>
                        <a
                            href="https://www.facebook.com/BinchiLinhh/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
                        >
                            Gửi tin nhắn <span className="text-xl">&rarr;</span>
                        </a>
                    </div>

                    {/* Group Card */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-8 hover:border-pink-500/50 transition-all group">
                        <h3 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
                            <span className="text-pink-500"><i className="fas fa-users"></i></span>
                            Group Cộng Đồng
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Tham gia nhóm Facebook để thảo luận, share kèo game hay và nhận thông báo mới nhất.
                        </p>
                        <a
                            href="https://facebook.com/groups/your-group" // Thay bằng link thật
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-pink-400 font-bold hover:text-pink-300 transition-colors"
                        >
                            Tham gia nhóm <span className="text-xl">&rarr;</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="container mx-auto px-6 pb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Thành viên', value: '1,204', color: 'text-primary' },
                        { label: 'Game đã đăng', value: '85', color: 'text-blue-400' },
                        { label: 'Lượt tải', value: '15.2K', color: 'text-green-400' },
                        { label: 'Online', value: '124', color: 'text-yellow-400' },
                    ].map((stat, index) => (
                        <div key={index} className="bg-surface/50 p-6 rounded-xl text-center border border-white/5">
                            <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CommunityPage;
