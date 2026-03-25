import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const FavoriteButton = ({ gameId, className = "" }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && gameId) {
            axiosClient.get(`/user/favorites/check/${gameId}`)
                .then(res => setIsFavorited(res.isFavorited))
                .catch(err => console.error("Error checking favorite:", err));
        }
    }, [gameId, isAuthenticated]);

    const handleToggle = async (e) => {
        e.preventDefault(); // Prevent navigating to game detail if inside a Link wrapper
        e.stopPropagation();
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            // Optimistic UI Update
            setIsFavorited(!isFavorited);
            
            await axiosClient.post(`/user/favorites/${gameId}`);
        } catch (error) {
            console.error("Error toggling favorite:", error);
            // Revert state if api fails
            setIsFavorited(isFavorited);
        }
    };

    return (
        <button 
            onClick={handleToggle}
            className={`transition-all hover:scale-110 active:scale-95 ${className}`}
            title={isFavorited ? "Bỏ yêu thích" : "Yêu thích"}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={isFavorited ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                className={`w-6 h-6 ${isFavorited ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'text-gray-300 hover:text-pink-400 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]'}`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    );
};

export default FavoriteButton;
