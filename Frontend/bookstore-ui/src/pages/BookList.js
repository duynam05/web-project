import React, { useEffect, useMemo, useState } from 'react';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';
import { buildApiUrl } from '../config/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    fetch(buildApiUrl('/books'))
      .then((res) => res.json())
      .then((data) => {
        const list = data.result || data;
        setBooks(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.error(err));
  }, []);

  const categories = [
    'All',
    ...new Set(books.map((b) => b.category).filter(Boolean))
  ];

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (selectedCategory !== 'All') {
      result = result.filter((b) => b.category === selectedCategory);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((b) =>
        (b.title || '').toLowerCase().includes(lower) ||
        (b.author || '').toLowerCase().includes(lower)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price_asc':
          return (a.price || 0) - (b.price || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [books, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded shadow">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded"
            placeholder="Tìm sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popular">Phổ biến</option>
          <option value="rating">Rating</option>
          <option value="price_asc">Giá tăng</option>
          <option value="price_desc">Giá giảm</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookList;
