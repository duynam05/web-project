export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const USER_APP_LOGIN_URL = import.meta.env.VITE_USER_APP_LOGIN_URL || 'http://localhost:3000/login';

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;
