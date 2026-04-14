import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHistory } from '../contexts/HistoryContext';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';
import { ShoppingCart } from 'lucide-react';
import { buildApiUrl } from '../config/api';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToHistory } = useHistory();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(buildApiUrl('/books'))
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data?.result) ? data.result : data;
        const foundBook = Array.isArray(list) ? list.find((item) => item.id === id) : null;

        setBook(foundBook || null);
        setReviews([]);

        if (foundBook?.category) {
          addToHistory(foundBook.category);
        }
      })
      .catch((err) => console.error(err));
  }, [id, addToHistory]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để mua hàng!");
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

      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error(err);
      alert("Lỗi server!");
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Vui lòng đăng nhập để viết nhận xét!");
      navigate('/login');
      return;
    }

    if (userRating === 0) {
      alert("Vui lòng chọn số sao!");
      return;
    }

    const newReview = {
      user: user.fullName || user.email || "Khách",
      comment,
      rating: userRating
    };

    setReviews([newReview, ...reviews]);
    setComment('');
    setUserRating(0);
  };

  if (!book) {
    return <div className="p-10 text-center">Không tìm thấy sách.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="flex justify-center bg-gray-100 rounded-lg p-8">
          <img src={book.image} alt={book.title} className="max-w-xs shadow-2xl rounded" />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">Tác giả: {book.author}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
            </span>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{book.category}</span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <StarRating rating={book.rating} />
            <span className="text-gray-500">({reviews.length} đánh giá)</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
          >
            <ShoppingCart /> Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Đánh giá & Nhận xét</h2>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="font-semibold mb-4">Viết nhận xét của bạn</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block mb-2 text-sm">Đánh giá của bạn:</label>
              <StarRating rating={userRating} onRate={setUserRating} editable={true} />
            </div>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              rows="3"
              placeholder="Chia sẻ cảm nghĩ của bạn về sách này..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-black transition">
              Gửi nhận xét
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {reviews.map((rev, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{rev.user}</span>
                <StarRating rating={rev.rating} />
              </div>
              <p className="text-gray-600">{rev.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-gray-500">Chưa có nhận xét nào.</p>}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
