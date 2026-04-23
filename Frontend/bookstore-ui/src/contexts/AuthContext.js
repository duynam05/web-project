import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { buildApiUrl } from '../config/api';

const AuthContext = createContext();
const USER_STORAGE_KEY = 'currentUser';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const setToken = (nextToken) => {
    setTokenState(nextToken);

    if (nextToken) {
      localStorage.setItem('token', nextToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const login = (userData, nextToken = null) => {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

    if (nextToken !== null) {
      setToken(nextToken);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('logout'));
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser && !user) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(buildApiUrl('/users/my-info'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          logout();
          return;
        }

        const profile = data.result || data;
        setUser(profile);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      } catch (error) {
        console.error('fetchMe error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
