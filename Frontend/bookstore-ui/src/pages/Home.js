import React from 'react';
import { mockBooks } from '../data/books';
import BookCard from '../components/BookCard';
import { useHistory } from '../contexts/HistoryContext';

const Home = () => {
  const { viewedCategories } = useHistory();

  // Logic lấy sách nổi bật (Rating > 4.5)
  const featuredBooks = mockBooks.filter(b => b.rating >= 4.5).slice(0, 4);

  // Logic gợi ý: Lấy sách thuộc danh mục user đã xem, trừ những sách đã có ở mục Featured
  const recommendedBooks = mockBooks.filter(b => 
    viewedCategories.includes(b.category) && 
    !featuredBooks.find(fb => fb.id === b.id)
  ).slice(0, 4);

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 rounded-b-3xl text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Thế giới sách trong tầm tay</h1>
        <p className="text-xl opacity-90 mb-8">Khám phá những tựa sách bán chạy nhất mọi thời đại.</p>
        <a href="/books" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
          Mua ngay
        </a>
      </section>

      {/* Sách nổi bật */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-600 pl-3">Sách Nổi Bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Gợi ý cho bạn (Chỉ hiện khi có lịch sử) */}
      {recommendedBooks.length > 0 && (
        <section className="container mx-auto px-4 bg-gray-50 py-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-purple-600 pl-3">Gợi ý riêng cho bạn</h2>
          <p className="text-gray-500 mb-4">Dựa trên sở thích xem gần đây của bạn.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;