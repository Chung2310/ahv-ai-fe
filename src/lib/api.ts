import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
    
    // Tự động xử lý lỗi 401: Xóa storage nếu không phải route login
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.clear();
      // Tùy chọn: force reload hoặc redirect nếu cần
      if (!window.location.pathname.includes('/login')) {
         window.location.href = '/login';
      }
    }

    // Gắn message vào đối tượng error và reject
    error.message = message;
    return Promise.reject(error);
  }
);

export default api;
