import React, { createContext, useState, useContext } from 'react';
import { buildApiUrl } from '../config/api';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalQuantity: 0,
    totalPrice: 0
  });

  // BADGE = số loại sản phẩm
  // const cartItemCount = cart?.items?.length || 0;
  const cartItemCount =
    cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(buildApiUrl('/cart'), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setCart(data.result);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải giỏ hàng");
    }
  };

  // wrapper actions để show toast UI đồng nhất
  const addToCartSuccess = (msg = "Đã thêm vào giỏ hàng") => {
    toast.success(msg);
  };

  const removeFromCartSuccess = (msg = "Đã xóa sản phẩm") => {
    toast.info(msg);
  };

  const updateCartSuccess = (msg = "Đã cập nhật giỏ hàng") => {
    toast.success(msg);
  };

  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      fetchCart,
      cartItemCount,
      addToCartSuccess,
      removeFromCartSuccess,
      updateCartSuccess
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);