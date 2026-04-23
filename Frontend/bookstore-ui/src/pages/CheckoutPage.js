import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const PHONE_REGEX = /^0\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.fullName || user?.name || '';
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
  const [submitError, setSubmitError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);

  const items = state?.items || [];
  const total = items.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * item.quantity,
    0
  );

  const searchAddress = (text) => {
    setForm((prev) => ({ ...prev, address: text }));

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const nextTimeoutId = setTimeout(async () => {
      if (text.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${text}, Vietnam`
        );
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    setTimeoutId(nextTimeoutId);
  };

  const selectAddress = (suggestion) => {
    setForm((prev) => ({ ...prev, address: suggestion.display_name }));
    setSuggestions([]);
  };

  const validateStep1 = () => {
    if (user) {
      return true;
    }

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Ten khong duoc de trong';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email khong duoc de trong';
    } else if (!EMAIL_REGEX.test(form.email)) {
      nextErrors.email = 'Email khong hop le';
    }

    setErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};

    if (!form.phone.trim()) {
      nextErrors.phone = 'So dien thoai khong duoc de trong';
    } else if (!PHONE_REGEX.test(form.phone)) {
      nextErrors.phone = 'So dien thoai phai co 10 so va bat dau bang 0';
    }

    if (!form.address.trim()) {
      nextErrors.address = 'Dia chi khong duoc de trong';
    }

    setErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      setSubmitError('');

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
        throw new Error(data?.message || 'Tao don that bai');
      }

      return data.result;
    } catch (err) {
      setSubmitError(err.message || 'Co loi xay ra');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!validateStep1() || !validateStep2()) {
      return;
    }

    const order = await createOrder();
    if (!order) {
      return;
    }

    if (form.paymentMethod === 'ONLINE') {
      navigate('/vnpay-gateway', {
        state: { orderId: order.orderId },
      });
      return;
    }

    window.alert('Dat hang thanh cong');
    navigate('/account');
  };

  if (!items.length) {
    return <div className="p-10 text-center">Khong co san pham</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Thanh toan</h1>

      {submitError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      ) : null}

      <div className="space-y-3 rounded-lg bg-white p-4 shadow">
        <h2 className="font-semibold">Thong tin nguoi dat</h2>

        {user ? (
          <div className="space-y-1 text-sm text-gray-600">
            <p><b>Ho ten:</b> {user.fullName || user.name || 'Khach hang'}</p>
            <p><b>Email:</b> {user.email}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ho ten"
              className={`w-full rounded border p-2 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name ? <p className="text-xs text-red-500">{errors.name}</p> : null}

            <input
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className={`w-full rounded border p-2 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <label className="font-semibold">So dien thoai</label>
        <input
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          placeholder="0xxxxxxxxx"
          className={`mt-2 w-full rounded border p-2 ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <label className="font-semibold">Dia chi giao hang</label>
        <input
          value={form.address}
          onChange={(e) => searchAddress(e.target.value)}
          placeholder="Nhap dia chi..."
          className={`mt-2 w-full rounded border p-2 ${errors.address ? 'border-red-500' : ''}`}
        />
        {errors.address ? <p className="mt-1 text-xs text-red-500">{errors.address}</p> : null}

        {suggestions.length > 0 ? (
          <div className="mt-2 rounded border bg-white shadow">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => selectAddress(suggestion)}
              >
                {suggestion.display_name}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">Goi y dia chi (VN)</h2>
        <p className="text-xs text-gray-500">
          Goi y se hien thi trong luc nhap dia chi.
        </p>
      </div>

      <div className="space-y-3 rounded-lg bg-white p-4 shadow">
        <h2 className="font-semibold">San pham</h2>

        {items.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-2 text-sm">
            <span>{item.title} x {item.quantity}</span>
            <span>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format((item.unitPrice ?? 0) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">Phuong thuc thanh toan</h2>

        <select
          value={form.paymentMethod}
          onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
          className="w-full rounded border p-2"
        >
          <option value="COD">Thanh toan khi nhan hang (COD)</option>
          <option value="ONLINE">VNPay (Fake Gateway)</option>
        </select>
      </div>

      <div className="flex justify-between rounded-lg bg-white p-4 font-bold shadow">
        <span>Tong thanh toan</span>
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
        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {form.paymentMethod === 'ONLINE' ? 'Thanh toan qua VNPay' : 'Dat hang'}
      </button>
    </div>
  );
};

export default CheckoutPage;
