import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buildApiUrl } from '../config/api';

const ORDER_STATUS_VI = {
  PENDING: 'Cho xu ly',
  PENDING_PAYMENT: 'Cho thanh toan',
  CONFIRMED: 'Da xac nhan',
  SHIPPING: 'Dang giao hang',
  COMPLETED: 'Hoan thanh',
  CANCELLED: 'Da huy',
};

const PAYMENT_STATUS_VI = {
  UNPAID: 'Chua thanh toan',
  PENDING: 'Dang xu ly',
  PAID: 'Da thanh toan',
  FAILED: 'That bai',
};

const PAYMENT_METHOD_VI = {
  COD: 'Thanh toan khi nhan hang',
  ONLINE: 'Thanh toan VNPay',
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const token = localStorage.getItem('token');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(buildApiUrl(`/api/orders/${orderId}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) setOrder(data.result);
    };

    if (token) fetchOrder();
  }, [orderId, token]);

  if (!order) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Don hang #{order.orderId.slice(0, 8)}</h1>

      <div className="bg-white p-4 rounded shadow space-y-1">
        <p>
          <b>Trang thai:</b> {ORDER_STATUS_VI[order.status] || order.status}
        </p>
        <p>
          <b>Thanh toan:</b> {PAYMENT_STATUS_VI[order.paymentStatus] || order.paymentStatus}
        </p>
        <p>
          <b>Phuong thuc:</b> {PAYMENT_METHOD_VI[order.paymentMethod] || order.paymentMethod}
        </p>
        <p>
          <b>Dia chi:</b> {order.address}
        </p>
        <p>
          <b>Tong tien:</b> {Number(order.totalPrice || 0).toLocaleString()}d
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">San pham</h2>

        {order.items?.map((item) => (
          <div key={item.id} className="flex gap-3 border-b py-2">
            <img
              src={item.image}
              className="w-16 h-20 object-cover rounded"
              alt={item.title}
            />

            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">SL: {item.quantity}</p>
            </div>

            <div className="font-semibold">{Number(item.lineTotal || 0).toLocaleString()}d</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailPage;
