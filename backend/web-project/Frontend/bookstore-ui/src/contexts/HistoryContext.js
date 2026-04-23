import React, { createContext, useState, useContext } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  // Lưu danh mục người dùng đã xem
  const [viewedCategories, setViewedCategories] = useState(() => {
    const saved = localStorage.getItem('viewedCategories');
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = (category) => {
    if (!viewedCategories.includes(category)) {
      const newHistory = [category, ...viewedCategories].slice(0, 5); // Chỉ giữ 5 danh mục gần nhất
      setViewedCategories(newHistory);
      localStorage.setItem('viewedCategories', JSON.stringify(newHistory));
    }
  };

  return (
    <HistoryContext.Provider value={{ viewedCategories, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
