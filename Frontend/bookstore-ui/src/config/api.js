export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080";

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;
