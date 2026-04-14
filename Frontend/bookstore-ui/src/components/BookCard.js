import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart } from 'lucide-react';
import { buildApiUrl } from '../config/api';

const BookCard = ({ book }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user) {
      alert("Vui lòng đăng nhập!");
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(buildApiUrl('/cart'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: book.id,
          quantity: 1
        })
      });

      if (!res.ok) {
        throw new Error("Add to cart failed");
      }

      alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error(err);
      alert("Lỗi server!");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <Link to={`/book/${book.id}`} className="relative h-64 overflow-hidden group">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-blue-600 font-semibold uppercase">{book.category}</span>
        <Link to={`/book/${book.id}`} className="text-lg font-bold text-gray-800 hover:text-blue-600 mt-1 line-clamp-1">
          {book.title}
        </Link>
        <p className="text-gray-500 text-sm mb-2">{book.author}</p>

        <div className="mb-2">
          <StarRating rating={book.rating} />
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
          </span>
          <button
            onClick={handleAddToCart}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
