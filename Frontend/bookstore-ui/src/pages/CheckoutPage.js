import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { buildApiUrl } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useCartActions } from '../contexts/CartContext';

const PHONE_REGEX = /^0\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCart, resetCart } = useCartActions();

  const displayName = user?.fullName || user?.name || user?.email || '';
  const displayEmail = user?.email || '';

  const [form, setForm] = useState({
    name: displayName,
    email: displayEmail,
    phone: '',
    address: '',
    paymentMethod: 'COD',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.fullName || user.email || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const items = state?.items || [];
  const total = items.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);

  const validateField = (name, value) => {
    let message = '';

    switch (name) {
      case 'name':
        if (!value.trim()) message = 'Tên không được để trống';
        break;
      case 'email':
        if (!value.trim()) message = 'Email không được để trống';
        else if (!EMAIL_REGEX.test(value)) message = 'Email không hợp lệ';
        break;
      case 'phone':
        if (!value.trim()) message = 'SĐT không được để trống';
        else if (!PHONE_REGEX.test(value)) message = 'SĐT phải 10 số và bắt đầu bằng 0';
        break;
      case 'address':
        if (!value.trim()) message = 'Địa chỉ không được để trống';
        break;
      default:
        break;
    }

    setErrors((prev) => {
      if (!message) {
        const { [name]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: message };
    });

    return message === '';
  };

  const searchAddress = (text) => {
    setForm((prev) => ({ ...prev, address: text }));

    if (timeoutId) clearTimeout(timeoutId);

    const nextTimeoutId = setTimeout(async () => {
      if (text.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${text}, Vietnam`);
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    setTimeoutId(nextTimeoutId);
  };

  const selectAddress = (address) => {
    setForm((prev) => ({ ...prev, address: address.display_name }));
    setSuggestions([]);
  };

  const validateStep1 = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Tên không được để trống';
    if (!form.email.trim()) nextErrors.email = 'Email không được để trống';
    else if (!EMAIL_REGEX.test(form.email)) nextErrors.email = 'Email không hợp lệ';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};

    if (!form.phone.trim()) nextErrors.phone = 'SĐT không được để trống';
    else if (!PHONE_REGEX.test(form.phone)) nextErrors.phone = 'SĐT phải 10 số và bắt đầu bằng 0';

    if (!form.address.trim()) nextErrors.address = 'Địa chỉ không được để trống';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const syncCartBadge = async () => {
    try {
      await fetchCart();
    } catch {
      resetCart();
    }
  };

  const createOrder = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const res = await fetch(buildApiUrl('/api/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          phone: form.phone,
          address: form.address,
          paymentMethod: form.paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Tạo đơn thất bại');
      }

      return data.result;
    } catch (err) {
      toast.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2()) return;

    const order = await createOrder();
    if (!order) return;

    await syncCartBadge();

    if (form.paymentMethod === 'COD') {
      toast.success('Đặt hàng thành công');
      navigate('/account');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(buildApiUrl(`/api/orders/${order.orderId}/payment`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Thanh toán thất bại');
      }

      toast.success('Thanh toán thành công');
      await syncCartBadge();
      navigate('/account');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!items.length) {
    return <div className="p-10 text-center">Không có sản phẩm</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Thanh toán</h1>

      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <h2 className="font-semibold">Thông tin người đặt</h2>

        {user ? (
          <div className="text-sm text-gray-600 space-y-1">
            <p><b>Họ tên:</b> {user.fullName}</p>
            <p><b>Email:</b> {user.email}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              value={form.name}
              onChange={(e) => {
                const value = e.target.value;
                setForm((prev) => ({ ...prev, name: value }));
                validateField('name', value);
              }}
              onBlur={(e) => validateField('name', e.target.value)}
              placeholder="Họ tên"
              className={`w-full border p-2 rounded ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name ? <p className="text-red-500 text-xs">{errors.name}</p> : null}

            <input
              value={form.email}
              onChange={(e) => {
                const value = e.target.value;
                setForm((prev) => ({ ...prev, email: value }));
                validateField('email', value);
              }}
              onBlur={(e) => validateField('email', e.target.value)}
              placeholder="Email"
              className={`w-full border p-2 rounded ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email ? <p className="text-red-500 text-xs">{errors.email}</p> : null}
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <label className="font-semibold">Số điện thoại</label>
        <input
          value={form.phone}
          onChange={(e) => {
            const value = e.target.value;
            setForm((prev) => ({ ...prev, phone: value }));
            validateField('phone', value);
          }}
          onBlur={(e) => validateField('phone', e.target.value)}
          placeholder="Nhập số điện thoại"
          className={`w-full mt-2 border p-2 rounded ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone ? <p className="text-red-500 text-xs mt-1">{errors.phone}</p> : null}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <label className="font-semibold">Địa chỉ giao hàng</label>
        <input
          value={form.address}
          onChange={(e) => {
            const value = e.target.value;
            searchAddress(value);
            validateField('address', value);
          }}
          onBlur={(e) => validateField('address', e.target.value)}
          placeholder="Nhập địa chỉ..."
          className={`w-full mt-2 border p-2 rounded ${errors.address ? 'border-red-500' : ''}`}
        />
        {errors.address ? <p className="text-red-500 text-xs mt-1">{errors.address}</p> : null}

        {suggestions.length > 0 ? (
          <div className="border mt-2 rounded bg-white shadow">
            {suggestions.map((address) => (
              <div
                key={address.place_id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectAddress(address)}
              >
                {address.display_name}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <h2 className="font-semibold">Sản phẩm</h2>

        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm border-b pb-2">
            <span>{item.title} x {item.quantity}</span>
            <span>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(item.unitPrice * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Phương thức thanh toán</h2>
        <select
          value={form.paymentMethod}
          onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
          className="w-full border p-2 rounded"
        >
          <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          <option value="ONLINE">VNPay</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex justify-between font-bold">
        <span>Tổng thanh toán</span>
        <span className="text-red-600">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(total)}
        </span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {form.paymentMethod === 'ONLINE' ? 'Thanh toán qua VNPay' : 'Đặt hàng'}
      </button>
    </div>
  );
};

export default CheckoutPage;
