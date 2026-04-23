import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildApiUrl } from '../config/api';

const statusColor = {
  PENDING: 'text-yellow-600',
  PENDING_PAYMENT: 'text-orange-500',
  CONFIRMED: 'text-blue-600',
  SHIPPING: 'text-purple-600',
  COMPLETED: 'text-green-600',
  CANCELLED: 'text-red-600',
};

const ORDER_STATUS_VI = {
  PENDING: 'Cho xu ly',
  PENDING_PAYMENT: 'Cho thanh toan',
  CONFIRMED: 'Da xac nhan',
  SHIPPING: 'Dang giao hang',
  COMPLETED: 'Hoan thanh',
  CANCELLED: 'Da huy',
};

const OrderListPage = () => {
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(buildApiUrl('/api/orders'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) setOrders(data.result || []);
    };

    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Don hang cua ban</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.orderId}
            to={`/account/orders/${order.orderId}`}
            className="block bg-white p-4 rounded shadow hover:shadow-md"
          >
            <div className="flex justify-between">
              <span className="font-semibold">#{order.orderId.slice(0, 8)}</span>

              <span className={statusColor[order.status]}>
                {ORDER_STATUS_VI[order.status] || order.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 mt-1">
              {order.items?.length || 0} san pham • {Number(order.totalPrice || 0).toLocaleString()}d
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderListPage;
