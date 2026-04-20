import MaterialIcon from '../components/MaterialIcon';

const dashboardStats = [
  ['payments', 'bg-blue-50 text-blue-600', '+12.5%', 'text-emerald-600 bg-emerald-50', 'Tổng doanh thu', '128.450.000₫'],
  ['shopping_bag', 'bg-purple-50 text-purple-600', '+8.2%', 'text-emerald-600 bg-emerald-50', 'Tổng đơn hàng', '1,420'],
  ['book', 'bg-orange-50 text-orange-600', 'Ổn định', 'text-slate-400 bg-slate-50', 'Tổng số sách', '8,642'],
  ['person_add', 'bg-teal-50 text-teal-600', '+15.7%', 'text-emerald-600 bg-emerald-50', 'Tổng người dùng', '4,289'],
];

const chartBars = [
  ['Th 2', 'h-[40%]', 'Thứ 2: 15tr'],
  ['Th 3', 'h-[65%]', 'Thứ 3: 22tr'],
  ['Th 4', 'h-[55%]', 'Thứ 4: 18tr'],
  ['Th 5', 'h-[85%]', 'Thứ 5: 35tr', true],
  ['Th 6', 'h-[45%]', 'Thứ 6: 16tr'],
  ['Th 7', 'h-[75%]', 'Thứ 7: 28tr'],
  ['CN', 'h-[95%]', 'Chủ nhật: 40tr'],
];

const topCategories = [
  ['psychology', 'bg-blue-50 text-blue-600', 'Kinh tế - Kỹ năng', '420 cuốn / tuần', '35%'],
  ['auto_stories', 'bg-purple-50 text-purple-600', 'Văn học - Tiểu thuyết', '312 cuốn / tuần', '28%'],
  ['child_care', 'bg-orange-50 text-orange-600', 'Sách thiếu nhi', '258 cuốn / tuần', '20%'],
  ['language', 'bg-teal-50 text-teal-600', 'Ngoại ngữ', '145 cuốn / tuần', '12%'],
];

const recentOrders = [
  ['#ORD-8942', 'LH', 'bg-blue-100 text-blue-700', 'Lê Hoàng Nam', '10:42, 24/05/2024', '1.250.000₫', 'Đang xử lý', 'bg-blue-50 text-blue-600 border-blue-100', 'bg-blue-600 animate-pulse'],
  ['#ORD-8941', 'MT', 'bg-slate-100 text-slate-700', 'Minh Tuấn', '09:15, 24/05/2024', '450.000₫', 'Hoàn thành', 'bg-emerald-50 text-emerald-600 border-emerald-100', 'bg-emerald-500'],
  ['#ORD-8940', 'BA', 'bg-slate-100 text-slate-700', 'Bảo Anh', '21:30, 23/05/2024', '890.000₫', 'Chờ giao hàng', 'bg-amber-50 text-amber-600 border-amber-100', 'bg-amber-500'],
];

function DashboardPhase1() {
  return (
    <main className="ml-64 min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Chào buổi sáng, Quản trị viên</h2>
            <p className="mt-1 text-slate-500">Dưới đây là những gì đang diễn ra tại nhà sách của bạn hôm nay.</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50">
            <MaterialIcon className="text-lg">calendar_today</MaterialIcon>
            30 ngày qua
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map(([icon, iconWrap, change, changeWrap, label, value]) => (
            <div key={label} className="group flex flex-col justify-between rounded-lg border border-slate-100/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-lg p-2 ${iconWrap}`}><MaterialIcon>{icon}</MaterialIcon></div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${changeWrap}`}>{change}</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-100/50 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Biểu đồ doanh thu</h3>
                <p className="text-sm text-slate-500">Thống kê doanh số theo thời gian thực</p>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm">Tuần</button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-slate-900">Tháng</button>
              </div>
            </div>
            <div className="chart-gradient relative flex h-64 items-end justify-between gap-3 rounded-lg px-4 pb-2">
              {chartBars.map(([label, height, title, active]) => (
                <div key={label} className={`flex-1 rounded-t transition-all ${active ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600/20 hover:bg-blue-600/35'} ${height}`} title={title} />
              ))}
            </div>
            <div className="mt-4 flex justify-between px-2">{chartBars.map(([label]) => <span key={label} className="text-xs font-medium text-slate-400">{label}</span>)}</div>
          </div>

          <div className="flex flex-col rounded-lg border border-slate-100/50 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-slate-900">Danh mục bán chạy</h3>
            <div className="space-y-6">
              {topCategories.map(([icon, wrap, title, subtitle, share]) => (
                <div key={title} className="group flex cursor-default items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${wrap}`}><MaterialIcon className="text-lg">{icon}</MaterialIcon></div>
                    <div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="text-xs text-slate-500">{subtitle}</p></div>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{share}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-slate-100/50 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900">Đơn hàng gần đây</h3>
            <p className="text-sm text-slate-500">Danh sách 3 đơn hàng mới nhất</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  {['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Tổng tiền', 'Trạng thái'].map((head) => (
                    <th key={head} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map(([id, initials, initialsWrap, customer, date, total, status, statusWrap, dot]) => (
                  <tr key={id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-blue-600">{id}</td>
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold uppercase ${initialsWrap}`}>{initials}</div><span className="text-sm font-medium text-slate-900">{customer}</span></div></td>
                    <td className="px-6 py-4 text-sm text-slate-500">{date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{total}</td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusWrap}`}><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPhase1;
