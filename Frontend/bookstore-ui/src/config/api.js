export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080";

export const DEFAULT_AVATAR_URL = "/default-avatar.svg";

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;

export const resolveImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/placeholder-book.svg';
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return imagePath;
};

export const resolveAvatarUrl = (avatarPath) => {
  if (!avatarPath) {
    return DEFAULT_AVATAR_URL;
  }

  if (/^https?:\/\//i.test(avatarPath)) {
    return avatarPath;
  }

  return avatarPath;
};
