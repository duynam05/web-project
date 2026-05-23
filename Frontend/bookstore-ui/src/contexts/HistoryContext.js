import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { splitBookCategories } from '../utils/bookCategories';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [viewedCategories, setViewedCategories] = useState(() => {
    const saved = localStorage.getItem('viewedCategories');
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = useCallback((category) => {
    const nextCategories = splitBookCategories(category);
    if (nextCategories.length === 0) return;

    setViewedCategories((current) => {
      const normalizedCurrent = new Set(current.map((item) => item.toLowerCase()));
      const uniqueNewCategories = nextCategories.filter(
        (item) => !normalizedCurrent.has(item.toLowerCase()),
      );

      if (uniqueNewCategories.length === 0) {
        return current;
      }

      const next = [...uniqueNewCategories, ...current].slice(0, 5);
      localStorage.setItem('viewedCategories', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ viewedCategories, addToHistory }),
    [viewedCategories, addToHistory],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
};

export const useHistory = () => useContext(HistoryContext);
