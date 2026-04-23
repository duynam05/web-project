import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl } from '../config/api';

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        return;
      }

      const res = await fetch(buildApiUrl('/cart'), {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const data = await res.json();
      const cartData = data.result || {};
      const nextItems = Array.isArray(cartData.items) ? cartData.items : [];
      setCart(nextItems);
      setSelectedItems((current) =>
        current.filter((id) => nextItems.some((item) => item.id === id))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeFromCart = async (id) => {
    const currentToken = localStorage.getItem('token');
    await fetch(buildApiUrl(`/cart/${id}`), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    loadCart();
  };

  const updateQuantity = async (id, change) => {
    const currentToken = localStorage.getItem('token');
    const item = cart.find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      return;
    }

    await fetch(buildApiUrl(`/cart/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    loadCart();
  };

  const clearCart = async () => {
    const currentToken = localStorage.getItem('token');
    await fetch(buildApiUrl('/cart/clear'), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    setCart([]);
    setSelectedItems([]);
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems((current) =>
      current.length === cart.length ? [] : cart.map((item) => item.id)
    );
  };

  const selectedCartItems = cart.filter((item) => selectedItems.includes(item.id));
  const totalAmount = selectedCartItems.reduce(
    (sum, item) => sum + Number(item.lineTotal ?? (item.unitPrice ?? 0) * item.quantity),
    0
  );

  if (!token || !user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl">Vui long dang nhap</h2>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Gio hang trong</h2>
        <Link to="/books" className="text-blue-600 hover:underline">
          Quay lai mua sam
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Gio hang cua ban</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={cart.length > 0 && selectedItems.length === cart.length}
              onChange={toggleSelectAll}
            />
            Chon tat ca
          </label>

          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelectItem(item.id)}
              />
              <img
                src={item.image}
                alt={item.title}
                className="h-28 w-20 rounded object-cover"
              />
              <div className="flex-grow">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-gray-500">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.unitPrice ?? 0)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => updateQuantity(item.id, -1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>
                  <Plus size={16} />
                </button>
              </div>

              <button onClick={() => removeFromCart(item.id)}>
                <Trash2 size={20} className="text-red-500" />
              </button>
            </div>
          ))}

          <button onClick={clearCart} className="text-red-600">
            Xoa tat ca
          </button>
        </div>

        <div className="h-fit rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold">Tong cong</h3>

          <div className="flex justify-between">
            <span>Tam tinh:</span>
            <span>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(totalAmount)}
            </span>
          </div>

          <button
            onClick={() => {
              navigate('/checkout', {
                state: {
                  items: selectedCartItems,
                  totalPrice: totalAmount,
                },
              });
            }}
            disabled={selectedCartItems.length === 0}
            className="mt-6 w-full rounded bg-blue-600 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Thanh toan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
