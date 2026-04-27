export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://web-project-2-viwf.onrender.com';
export const USER_APP_LOGIN_URL =
  import.meta.env.VITE_USER_APP_LOGIN_URL || 'https://duynam05.github.io/web-project/#/login';

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;
