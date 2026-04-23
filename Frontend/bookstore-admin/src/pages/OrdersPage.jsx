import { useEffect, useMemo, useRef, useState } from 'react';

import MaterialIcon from '../components/MaterialIcon';

const STATUS_FILTERS = [
  { value: 'ALL', label: 'Tất cả đơn' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

function formatCurrency(value) {
  if (value == null || Number.isNaN(Number(value))) return '0đ';
  return `${Number(value).toLocaleString('vi-VN')}đ`;
}

function formatDateTime(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function initialsOf(value = '') {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'KH';
}

function avatarTone(index) {
  const tones = [
    'bg-amber-50 text-amber-600',
    'bg-blue-50 text-blue-600',
    'bg-emerald-50 text-emerald-600',
    'bg-slate-100 text-slate-600',
    'bg-pink-50 text-pink-600',
  ];
  return tones[index % tones.length];
}

function statusMeta(status) {
  switch (status) {
    case 'PENDING':
      return { label: 'Chờ xử lý', wrap: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' };
    case 'PENDING_PAYMENT':
      return { label: 'Chờ thanh toán', wrap: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100', dot: 'bg-fuchsia-500' };
    case 'CONFIRMED':
      return { label: 'Đã xác nhận', wrap: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' };
    case 'SHIPPING':
      return { label: 'Đang giao', wrap: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' };
    case 'COMPLETED':
      return { label: 'Hoàn thành', wrap: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
    case 'CANCELLED':
      return { label: 'Đã hủy', wrap: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500' };
    default:
      return { label: status || 'Không rõ', wrap: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
  }
}

function matchesKeyword(order, keyword) {
  if (!keyword) return true;
  const normalized = keyword.trim().toLowerCase();
  return [order.orderId, order.customerName, order.customerEmail, order.customerId, order.phone, order.address].some((value) =>
    String(value || '').toLowerCase().includes(normalized),
  );
}

function DetailPanel({ selectedOrder, onCloseDetail }) {
  if (!selectedOrder) return null;

  const status = statusMeta(selectedOrder.status);

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Chi tiết đơn hàng</h3>
          <p className="mt-1 text-sm font-semibold text-slate-800">#{selectedOrder.orderId?.slice(0, 8)}</p>
        </div>
        <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" type="button" onClick={onCloseDetail}>
          <MaterialIcon>close</MaterialIcon>
        </button>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Danh sách sách</h4>
          <div className="space-y-3">
            {(selectedOrder.items || []).map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-4">
                <div className="h-16 w-12 overflow-hidden rounded border border-slate-100 bg-slate-50">
                  {item.image ? <img alt={item.title} className="h-full w-full object-cover" src={item.image} /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">Số lượng: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-slate-700">{formatCurrency(item.lineTotal)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Khách hàng</p>
            <p className="mt-3 font-bold text-slate-900">{selectedOrder.customerName || 'Chưa có tên'}</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>{selectedOrder.customerEmail || '--'}</p>
              <p>{selectedOrder.phone || '--'}</p>
              <p>{selectedOrder.address || '--'}</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Trạng thái hiện tại</p>
            <div className="mt-3">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${status.wrap}`}>
                <span className={`mr-2 h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
            <p className="mt-4 text-lg font-bold text-slate-900">{formatCurrency(selectedOrder.totalPrice)}</p>
            <p className="mt-1 text-sm text-slate-500">Ngày đặt: {formatDateTime(selectedOrder.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage({
  orders,
  loading,
  error,
  busyOrderId,
  selectedOrder,
  detailLoading,
  onRefresh,
  onViewOrder,
  onCloseDetail,
}) {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const detailPanelRef = useRef(null);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
        return matchesStatus && matchesKeyword(order, keyword);
      }),
    [orders, statusFilter, keyword],
  );

  const pendingCount = orders.filter((order) => order.status === 'PENDING' || order.status === 'PENDING_PAYMENT').length;
  const shippingCount = orders.filter((order) => order.status === 'SHIPPING').length;
  const revenue = orders.reduce((total, order) => total + Number(order.totalPrice || 0), 0);

  useEffect(() => {
    if (!selectedOrder || detailLoading) return;
    detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedOrder, detailLoading]);

  return (
    <main className="ml-64 min-h-screen p-8">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-8 shadow-lg md:col-span-8">
          <div className="relative z-10">
            <h2 className="mb-1 text-xs font-medium uppercase tracking-widest text-white/80">TỔNG SỐ ĐƠN HÀNG</h2>
            <p className="mb-6 text-4xl font-bold tracking-tight text-white">{orders.length} đơn hàng</p>
            <div className="flex gap-12">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white/60">Doanh thu</span>
                <span className="text-lg font-bold text-white">{formatCurrency(revenue)}</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute bottom-0 left-1/2 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl transition-transform duration-700 group-hover:-translate-y-8" />
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-slate-100 bg-white p-8 shadow-sm md:col-span-4">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <MaterialIcon fill>local_shipping</MaterialIcon>
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                {orders.length ? `+${((shippingCount / orders.length) * 100).toFixed(1)}%` : '+0%'}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">Đang vận chuyển</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{shippingCount} Đơn hàng</p>
          </div>
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${orders.length ? Math.max((shippingCount / orders.length) * 100, 8) : 0}%` }} />
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-30 mb-6 rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md">
        <div className="flex flex-nowrap items-center justify-between gap-3 overflow-x-auto">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {STATUS_FILTERS.map((filter) => {
              const active = statusFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  className={`h-9 whitespace-nowrap rounded-full px-4 text-[13px] leading-none transition-colors ${
                    active
                      ? 'bg-blue-600 font-semibold text-white shadow-md shadow-blue-600/20'
                      : 'border border-slate-200 bg-white font-semibold text-slate-500 shadow-sm hover:bg-slate-50'
                  }`}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-500 transition-all hover:border-blue-200 hover:shadow-sm" type="button">
              <MaterialIcon className="text-[18px]">filter_list</MaterialIcon>
              Lọc
            </button>
            <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-500 transition-all hover:border-blue-200 hover:shadow-sm" type="button" onClick={onRefresh}>
              <MaterialIcon className="text-[18px]">download</MaterialIcon>
              {loading ? 'Đang tải' : 'Xuất CSV'}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
        {error ? <p className="mx-6 mt-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Mã đơn hàng</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Khách hàng</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-widest text-slate-500">Tổng tiền</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Trạng thái</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Ngày đặt</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {!loading && !filteredOrders.length ? (
                <tr>
                  <td className="px-6 py-12 text-center text-sm text-slate-500" colSpan={6}>
                    Không có đơn hàng nào để hiển thị.
                  </td>
                </tr>
              ) : null}

              {filteredOrders.map((order, index) => {
                const status = statusMeta(order.status);
                const isBusy = busyOrderId === order.orderId;
                const isSelected = selectedOrder?.orderId === order.orderId;

                return (
                  <tr
                    key={order.orderId}
                    className={`group cursor-pointer transition-colors hover:bg-slate-50/30 ${isSelected ? 'bg-blue-50/40' : ''}`}
                    onClick={() => onViewOrder(order.orderId)}
                  >
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm font-bold text-blue-600">#{order.orderId?.slice(0, 8)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ${avatarTone(index)}`}>
                          {initialsOf(order.customerName || order.customerEmail)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{order.customerName || 'Chưa có tên'}</p>
                          <p className="text-[11px] font-medium text-slate-500">{order.customerEmail || '--'}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-5 text-right text-sm font-bold ${order.status === 'CANCELLED' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.wrap}`}>
                        <span className={`mr-2 h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-slate-500">{formatDateTime(order.createdAt)}</td>
                    <td className="px-6 py-5 text-right">
                      <button
                        className="p-1.5 text-slate-400 transition-colors hover:text-blue-600 disabled:opacity-50"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onViewOrder(order.orderId);
                        }}
                        disabled={isBusy}
                      >
                        <MaterialIcon className="text-[20px]">{detailLoading && isSelected ? 'progress_activity' : 'more_vert'}</MaterialIcon>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-tighter text-slate-500">Hiển thị {filteredOrders.length ? `1 - ${filteredOrders.length}` : '0'} của {orders.length} đơn hàng</p>
          <div className="flex items-center gap-1">
            <button className="rounded p-1 text-slate-500 transition-colors disabled:opacity-30" type="button" disabled>
              <MaterialIcon className="text-[20px]">chevron_left</MaterialIcon>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white" type="button">1</button>
            <button className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-slate-500 hover:bg-white" type="button">2</button>
            <button className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-slate-500 hover:bg-white" type="button">3</button>
            <span className="px-1 text-xs text-slate-400">...</span>
            <button className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-slate-500 hover:bg-white" type="button">25</button>
            <button className="rounded p-1 text-slate-500 transition-colors hover:bg-white" type="button">
              <MaterialIcon className="text-[20px]">chevron_right</MaterialIcon>
            </button>
          </div>
        </div>
      </div>

      <div ref={detailPanelRef}>
        <DetailPanel selectedOrder={selectedOrder} onCloseDetail={onCloseDetail} />
      </div>
    </main>
  );
}
