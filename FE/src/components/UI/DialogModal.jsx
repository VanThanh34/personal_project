import React, { useState, useEffect } from 'react';

const DialogModal = ({ isOpen, title, message, type = 'alert', onConfirm, onClose, showInput = false, inputPlaceholder = '' }) => {
    const [inputValue, setInputValue] = useState('');
    
    // Reset input khi mở
    useEffect(() => {
        if (isOpen) setInputValue('');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] animate-fade-in">
            <div className="bg-surface border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                <h3 className={`text-xl font-bold mb-3 ${type === 'confirm' ? 'text-yellow-400' : 'text-primary'}`}>
                    {title}
                </h3>
                <p className="text-gray-300 mb-6">{message}</p>
                
                {showInput && (
                    <div className="mb-8">
                        <textarea 
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-primary resize-none"
                            placeholder={inputPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            rows="2"
                        />
                    </div>
                )}
                
                <div className="flex justify-end gap-3">
                    {type === 'confirm' && (
                        <button 
                            onClick={onClose} 
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-colors"
                        >
                            Hủy
                        </button>
                    )}
                    <button 
                        onClick={() => {
                            if (type === 'confirm' && onConfirm) onConfirm(inputValue);
                            if (type !== 'confirm' && onClose) onClose();
                        }}
                        className={`px-8 py-2 rounded-lg font-bold transition-colors shadow-lg ${
                            type === 'confirm' 
                                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/30' 
                                : 'bg-primary hover:bg-pink-600 text-white shadow-primary/30'
                        }`}
                    >
                        {type === 'confirm' ? 'Xác Nhận' : 'Đồng Ý'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DialogModal;
