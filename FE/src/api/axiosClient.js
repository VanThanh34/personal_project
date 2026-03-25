import axios from 'axios';

const axiosClient = axios.create({
    baseURL: '/', // Proxy handle base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach token
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle errors
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Handle 401 Unauthorized
        if (error.response && error.response.status === 401) {
            const isDisabled = error.response.data?.error === 'User Disabled';
            const msg = error.response.data?.message;
            
            if (isDisabled) {
                // Đẩy event báo hiệu tài khoản bị khóa
                window.dispatchEvent(new CustomEvent('auth-locked', { detail: msg }));
            } else {
                // Redirect standard 401
                window.location.href = '/login';
            }
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
