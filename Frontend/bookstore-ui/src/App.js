// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { ShoppingCart, BookOpen, User } from 'lucide-react'; // Icon User
// import Home from './pages/Home';
// import BookList from './pages/BookList';
// import BookDetail from './pages/BookDetail';
// import Cart from './pages/Cart';
// import AccountPage from './pages/AccountPage'; // Import AccountPage
// import { CartProvider, useCart } from './contexts/CartContext';
// import { HistoryProvider } from './contexts/HistoryContext';

// // Navbar Component
// const Navbar = () => {
//   const { cart } = useCart();
//   const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

//   return (
//     <nav className="bg-white shadow sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//         <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
//           <BookOpen /> BookStore
//         </Link>
//         <div className="flex items-center gap-6 font-medium">
//           <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
//           <Link to="/books" className="hover:text-blue-600">Sách</Link>

//           {/* Nút Giỏ hàng */}
//           <Link to="/cart" className="relative p-2 hover:text-blue-600">
//             <ShoppingCart size={24} />
//             {totalItems > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {totalItems}
//               </span>
//             )}
//           </Link>

//           {/* Icon Tài khoản */}
//           <Link to="/account" className="p-2 hover:text-blue-600" title="Tài khoản">
//             <User size={24} />
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// function App() {
//   return (
//     <HistoryProvider>
//       <CartProvider>
//         <Router>
//           {/* Flex layout column, min-h-screen để footer luôn dưới màn hình */}
//           <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800 font-sans">
//             <Navbar />
            
//             {/* Main content flex-grow */}
//             <main className="flex-grow">
//               <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/books" element={<BookList />} />
//                 <Route path="/book/:id" element={<BookDetail />} />
//                 <Route path="/cart" element={<Cart />} />
//                 <Route path="/account" element={<AccountPage />} />
//               </Routes>
//             </main>

//             {/* Footer */}
//             <footer className="bg-gray-800 text-white py-8 text-center">
//               <p>&copy; 2024 BookStore. All rights reserved.</p>
//             </footer>
//           </div>
//         </Router>
//       </CartProvider>
//     </HistoryProvider>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, BookOpen, LogIn } from 'lucide-react';

// Pages
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Contexts
import { CartProvider, useCart } from './contexts/CartContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { resolveAvatarUrl, DEFAULT_AVATAR_URL } from './config/api';

// --- NAVBAR COMPONENT ---
const Navbar = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <BookOpen /> BookStore
        </Link>
        <div className="flex items-center gap-6 font-medium">
          <Link to="/" className="hover:text-blue-600 hidden sm:block">Trang chủ</Link>
          <Link to="/books" className="hover:text-blue-600">Sách</Link>
          
          <Link to="/cart" className="relative p-2 hover:text-blue-600">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <Link to="/account" className="flex items-center gap-2 hover:text-blue-600 group">
               <img
                 src={resolveAvatarUrl(user.avatar)}
                 alt="User"
                 className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                 onError={(e) => {
                   e.currentTarget.onerror = null;
                   e.currentTarget.src = DEFAULT_AVATAR_URL;
                 }}
               />
               <span className="hidden md:block max-w-[100px] truncate">{user.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm">
              <LogIn size={18} /> Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <HistoryProvider>
        <CartProvider>
          <Router>
            {/* 1. Thêm 'flex flex-col' vào thẻ bao ngoài cùng */}
            <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800 font-sans">
              
              <Navbar />
              
              {/* 2. Bọc Routes trong thẻ main có class 'flex-grow' 
                 Điều này giúp phần nội dung tự động giãn ra chiếm hết khoảng trống, đẩy footer xuống */}
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<BookList />} />
                  <Route path="/book/:id" element={<BookDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </main>
              
              <footer className="bg-gray-800 text-white py-8 text-center mt-auto">
                <p>&copy; 2024 BookStore. All rights reserved.</p>
              </footer>

            </div>
          </Router>
        </CartProvider>
      </HistoryProvider>
    </AuthProvider>
  );
}

export default App;
