import "./App.css"
import { useEffect, useState } from "react"

const pages = [
  { key: "dashboard", label: "Bảng điều khiển", icon: "dashboard" },
  { key: "books", label: "Sách", icon: "book" },
  { key: "categories", label: "Danh mục", icon: "category" },
  { key: "inventory", label: "Kho hàng", icon: "inventory_2" },
  { key: "orders", label: "Đơn hàng", icon: "shopping_cart" },
  { key: "users", label: "Người dùng", icon: "group" },
  { key: "reviews", label: "Đánh giá", icon: "reviews" },
  { key: "coupons", label: "Mã giảm giá", icon: "sell" },
  { key: "reports", label: "Báo cáo", icon: "analytics" },
  { key: "settings", label: "Cài đặt", icon: "settings" },
]

const dashboardStats = [
  ["payments", "bg-blue-50 text-blue-600", "+12.5%", "text-emerald-600 bg-emerald-50", "Tổng doanh thu", "128.450.000₫"],
  ["shopping_bag", "bg-purple-50 text-purple-600", "+8.2%", "text-emerald-600 bg-emerald-50", "Tổng đơn hàng", "1,420"],
  ["book", "bg-orange-50 text-orange-600", "Ổn định", "text-slate-400 bg-slate-50", "Tổng số sách", "8,642"],
  ["person_add", "bg-teal-50 text-teal-600", "+15.7%", "text-emerald-600 bg-emerald-50", "Tổng người dùng", "4,289"],
]

const chartBars = [
  ["Th 2", "h-[40%]", "Thứ 2: 15tr"],
  ["Th 3", "h-[65%]", "Thứ 3: 22tr"],
  ["Th 4", "h-[55%]", "Thứ 4: 18tr"],
  ["Th 5", "h-[85%]", "Thứ 5: 35tr", true],
  ["Th 6", "h-[45%]", "Thứ 6: 16tr"],
  ["Th 7", "h-[75%]", "Thứ 7: 28tr"],
  ["CN", "h-[95%]", "Chủ nhật: 40tr"],
]

const topCategories = [
  ["psychology", "bg-blue-50 text-blue-600", "Kinh tế - Kỹ năng", "420 cuốn / tuần", "35%"],
  ["auto_stories", "bg-purple-50 text-purple-600", "Văn học - Tiểu thuyết", "312 cuốn / tuần", "28%"],
  ["child_care", "bg-orange-50 text-orange-600", "Sách thiếu nhi", "258 cuốn / tuần", "20%"],
  ["language", "bg-teal-50 text-teal-600", "Ngoại ngữ", "145 cuốn / tuần", "12%"],
]

const recentOrders = [
  ["#ORD-8942", "LH", "bg-blue-100 text-blue-700", "Lê Hoàng Nam", "10:42, 24/05/2024", "1.250.000₫", "Đang xử lý", "bg-blue-50 text-blue-600 border-blue-100", "bg-blue-600 animate-pulse"],
  ["#ORD-8941", "MT", "bg-slate-100 text-slate-700", "Minh Tuấn", "09:15, 24/05/2024", "450.000₫", "Hoàn thành", "bg-emerald-50 text-emerald-600 border-emerald-100", "bg-emerald-500"],
  ["#ORD-8940", "BA", "bg-slate-100 text-slate-700", "Bảo Anh", "21:30, 23/05/2024", "890.000₫", "Chờ giao hàng", "bg-amber-50 text-amber-600 border-amber-100", "bg-amber-500"],
  ["#ORD-8939", "KD", "bg-red-100 text-red-700", "Kiều Diễm", "18:45, 23/05/2024", "2.100.000₫", "Đã hủy", "bg-red-50 text-red-600 border-red-100", "bg-red-600"],
  ["#ORD-8938", "VT", "bg-slate-100 text-slate-700", "Văn Thành", "15:20, 23/05/2024", "630.000₫", "Hoàn thành", "bg-emerald-50 text-emerald-600 border-emerald-100", "bg-emerald-500"],
]

const books = [
  ["Đại Gia Gatsby", "F. Scott Fitzgerald", "ISBN: 978-3-16-148410-0", "Văn học", "125.000đ", "42", "Còn hàng", "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400", "bg-blue-600 animate-pulse", "https://lh3.googleusercontent.com/aida-public/AB6AXuAbxmMHWAZcqmd7YJpce1sQMMSxuLvq4CTCKxZpeciUlRvHixn_klQz0uceLRSw2dIykNcEcnJuX4D5lYrb3hFxZ8Fb9dPoJsh8lp5kqcWVhgmTAkRto2B3HHhIxoIWkjlUP-ckN9Is5DjyBma6HmP2O9rlxkY6klEttIGzFpAglkFV9hZmMurZd6kMPKQlA3Mg3fsVIg1HVZn-wJiC84kXao_ngpLOVXgqu4PkNp20tDnSRm2f0URTbmzdTlAZ6fwMwr69TT6JTt0"],
  ["Thay Đổi Tí Hon, Hiệu Quả Bất Ngờ", "James Clear", "ISBN: 978-0-73-521129-2", "Kỹ năng", "189.000đ", "15", "Sắp hết", "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400", "bg-amber-500", "https://lh3.googleusercontent.com/aida-public/AB6AXuA61ZBmU3SNISLusFZOum0wYWBsXmFKvkcwKdXxCIAg9mhOkDVKeeerSzUFlwSxzKyM9a-iBpmTehOllDaLH1UV3QaSjOHlTrMnpZ5taY-SN8rQhWg6D_ALp80gxAvxawhAYR8yR6sbwYIaJySGvK5hROLQpy3gsJwee4WcrJApMi_gdgPRZ-IzvfRmiwNmw30akvDY-Nqx0WpwvhAxpD_TIYlg9N6WoB2hvU6i2LU1WZ0ig6Rx4E5Ktof9Z0kw9fxguEa58sHwJ4Y"],
  ["Tư Duy Nhanh Và Chậm", "Daniel Kahneman", "ISBN: 978-0-37-427563-1", "Kinh tế", "250.000đ", "0", "Hết hàng", "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400", "bg-red-600", "https://lh3.googleusercontent.com/aida-public/AB6AXuBlQTM3f7q9gN7wey-iDdXvubF7-Koc_Yw1nwBsYle-Uz6trSm8E_L-uCFpLMSGmAqjT_nSPoQgbIQ9jlp8iRHfK90PMkItZqCCgqgZx8oZvLV8mVe1D8rAcGdcj8BJ7WiX2VY-jYqyOTYMLEYWtz_pxPQx59GuwTGmsmoiKtBanHdAlSBfK05gPRCOshDCCqaTJnKRtXxNZdo33eOeipzGxPwnmaJh6U6UY7eB4kC2s5TdsBGtTIAnuRKo_cIXKpAidTZwYPzqtvg"],
  ["Nhà Giả Kim", "Paulo Coelho", "ISBN: 978-0-06-112241-5", "Văn học", "95.000đ", "112", "Còn hàng", "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400", "bg-blue-600", "https://lh3.googleusercontent.com/aida-public/AB6AXuBiDEgIui6-yyrV1Nioy_eu1FFPtN1WAbyVFYTNM6C8qhyPUY2SusdKDw7Y61_KkPg_2nl6DhXR0KSu_BKqOm_Df-Ic6seWCfmGOXl3vnU9Xqy6nOqd3r6MkqlAFPBEfdolswTBbDyD--KRYcP7BGTHb4-L52rBYNfPQEmfBGckRsrXHwLl_5lXBuAtL2qIkEUu5zJLd4TmE-0AgPQvf1pIE4KPm7J9_ycrHOGdtRK4CKX9xO6JZyNKmUsPnJDshxjiQfECyTlNAxo"],
]

function MaterialIcon({ children, className = "", fill = false }) {
  return <span className={`material-symbols-outlined ${className}`} style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>{children}</span>
}

function getPageFromHash() {
  if (typeof window === "undefined") return "dashboard"
  return window.location.hash.replace("#", "") || "dashboard"
}

function SideNav({ currentPage, onNavigate }) {
  const subtitle = currentPage === "dashboard" ? "Hệ thống Quản lý Sách" : "The Literary Curator"

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50 font-['Inter'] antialiased tracking-tight dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-8 px-8 py-6">
        <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">Lumina Ledger</h1>
        <p className={`${currentPage === "dashboard" ? "text-[10px] font-semibold uppercase tracking-widest" : "text-xs font-normal"} text-slate-500`}>{subtitle}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {pages.map((item) => {
          const active =
            currentPage === item.key ||
            (item.key === "books" && (currentPage === "book-create" || currentPage === "book-edit")) ||
            (item.key === "categories" && currentPage === "category-create")
          return (
            <button
              key={item.key}
              className={`flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                active
                  ? "rounded-lg bg-blue-50/50 font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              }`}
              type="button"
              onClick={() => onNavigate(item.key)}
            >
              <MaterialIcon fill={active}>{item.icon}</MaterialIcon>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <button className="flex w-full items-center gap-3 px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200">
          <MaterialIcon>logout</MaterialIcon>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}

function TopBar({ currentPage }) {
  const placeholder =
    currentPage === "dashboard"
      ? "Tìm kiếm sách, đơn hàng..."
      : currentPage === "books"
        ? "Tìm kiếm sách, tác giả hoặc ISBN..."
        : currentPage === "book-create"
          ? "Tìm kiếm sách..."
          : "Tìm kiếm sách, mã hàng..."

  const role =
    currentPage === "dashboard"
      ? "QUẢN TRỊ VIÊN"
      : currentPage === "books" || currentPage === "book-create"
        ? "NGƯỜI QUẢN LÝ"
        : "ADMINISTRATOR"

  const inputShape = currentPage === "dashboard" ? "rounded-lg" : "rounded-full"
  const inputWidth = currentPage === "dashboard" ? "" : "w-64 lg:w-96"

  return (
    <header className="sticky top-0 right-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
      <div className="flex flex-1 items-center gap-4">
        <div className={`group relative w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500/20 ${inputShape}`}>
          <input className={`border-none bg-slate-100 py-2 pl-10 pr-4 text-sm transition-all focus:ring-0 dark:bg-slate-800 ${inputShape} ${inputWidth}`} placeholder={placeholder} type="text" />
          <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">search</MaterialIcon>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-500">
          <MaterialIcon>notifications</MaterialIcon>
          <span className={`absolute ${currentPage === "dashboard" ? "top-2.5 right-2.5 h-2 w-2 rounded-full bg-error ring-2 ring-white" : "top-2 right-2 h-2 w-2 rounded-full bg-primary"}`} />
        </button>

        <div className={`flex items-center gap-3 ${currentPage === "dashboard" ? "border-l border-slate-200 pl-6" : ""}`}>
          <div className="text-right">
            <p className="text-sm font-semibold text-on-surface dark:text-white">Lumina Admin</p>
            <p className="text-[10px] font-medium uppercase tracking-tight text-slate-500">{role}</p>
          </div>
          <img alt="Lumina Admin" className={`${currentPage === "dashboard" ? "h-10 w-10 shadow-sm" : "h-9 w-9"} rounded-full border border-slate-200 object-cover`} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBncrUBR9RQQJdHNeY5d7odTCZ4D2sctbRl816bmX79972h439S78FtpXcmj4R7-9yRKOJr9o6OrzbVk_i4oQ4VSgVqeKu6-4lRw7FG5H8AzIG1kf4PAf_BQuxk0Pe3eu37I_bphCTdmZvaWzkLvelQ_B8y3_kAGVnQfJFosjm-VCBaIEVpgn-WhAbOYHvGB6b6RIweANE_7QJNeerW_z4GZSh6h-00J9mmOJ8QFVks4wo34HDDjkiGAmV4_xZyBhTMlUQwvynnhc0" />
        </div>
      </div>
    </header>
  )
}

function DashboardPage() {
  return (
    <main className="ml-64 min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">Chào buổi sáng, Quản trị viên</h2>
            <p className="mt-1 text-on-surface-variant">Dưới đây là những gì đang diễn ra tại nhà sách của bạn hôm nay.</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-on-surface shadow-sm transition-colors hover:bg-slate-50">
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
                <h3 className="mt-1 text-2xl font-bold text-on-surface">{value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-100/50 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Biểu đồ doanh thu</h3>
                <p className="text-sm text-slate-500">Thống kê doanh số theo thời gian thực</p>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button className="rounded-md bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm">Tuần</button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-slate-900">Tháng</button>
              </div>
            </div>
            <div className="chart-gradient relative flex h-64 items-end justify-between gap-3 rounded-lg px-4 pb-2">
              {chartBars.map(([label, height, title, active]) => <div key={label} className={`flex-1 rounded-t transition-all ${active ? "bg-primary hover:bg-primary/80" : "bg-primary/20 hover:bg-primary/40"} ${height}`} title={title} />)}
            </div>
            <div className="mt-4 flex justify-between px-2">{chartBars.map(([label]) => <span key={label} className="text-xs font-medium text-slate-400">{label}</span>)}</div>
          </div>

          <div className="flex flex-col rounded-lg border border-slate-100/50 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-on-surface">Danh mục bán chạy</h3>
            <div className="space-y-6">
              {topCategories.map(([icon, wrap, title, subtitle, share]) => (
                <div key={title} className="group flex cursor-default items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${wrap}`}><MaterialIcon className="text-lg">{icon}</MaterialIcon></div>
                    <div><p className="text-sm font-semibold text-on-surface">{title}</p><p className="text-xs text-slate-500">{subtitle}</p></div>
                  </div>
                  <span className="text-sm font-bold text-on-surface">{share}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6"><button className="w-full rounded-lg bg-primary/5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10">Xem chi tiết báo cáo</button></div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-slate-100/50 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Đơn hàng gần đây</h3>
              <p className="text-sm text-slate-500">Danh sách 5 đơn hàng mới nhất</p>
            </div>
            <button className="text-sm font-bold text-primary transition-colors hover:text-blue-700">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  {["Mã đơn", "Khách hàng", "Ngày đặt", "Tổng tiền", "Trạng thái"].map((head) => <th key={head} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">{head}</th>)}
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map(([id, initials, initialsWrap, customer, date, total, status, statusWrap, dot]) => (
                  <tr key={id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-primary">{id}</td>
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold uppercase ${initialsWrap}`}>{initials}</div><span className="text-sm font-medium text-on-surface">{customer}</span></div></td>
                    <td className="px-6 py-4 text-sm text-slate-500">{date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">{total}</td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusWrap}`}><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{status}</span></td>
                    <td className="px-6 py-4 text-right"><button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100"><MaterialIcon className="text-lg">more_vert</MaterialIcon></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}

function BooksPage({ onCreate, onEdit }) {
  return (
    <main className="ml-64 min-h-screen px-8 pb-12 pt-8">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-400">
            <a className="transition-colors hover:text-primary" href="#dashboard">Trang chủ</a>
            <MaterialIcon className="text-[10px]">chevron_right</MaterialIcon>
            <span className="text-slate-900 dark:text-white">Quản lý sách</span>
          </nav>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Thư viện Sách</h2>
          <p className="mt-1 text-slate-500">Quản lý và cập nhật kho sách của hệ thống.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-blue-700 active:scale-95" onClick={onCreate} type="button">
          <MaterialIcon>add</MaterialIcon>
          Thêm sách mới
        </button>
      </div>

      <section className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-500 dark:bg-slate-800/50">
          <MaterialIcon className="text-lg">filter_list</MaterialIcon>
          Bộ lọc:
        </div>
        <div className="relative">
          <select className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-900">
            <option>Tất cả danh mục</option>
            <option>Văn học</option>
            <option>Kinh tế</option>
            <option>Kỹ năng</option>
            <option>Thiếu nhi</option>
          </select>
          <MaterialIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">expand_more</MaterialIcon>
        </div>
        <div className="relative">
          <select className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-900">
            <option>Trạng thái kho</option>
            <option>Còn hàng</option>
            <option>Hết hàng</option>
            <option>Sắp hết</option>
          </select>
          <MaterialIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">expand_more</MaterialIcon>
        </div>
        <div className="flex-grow" />
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary">
          <MaterialIcon className="text-lg">restart_alt</MaterialIcon>
          Làm mới
        </button>
      </section>

      <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Sách</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Danh mục</th>
                <th className="px-6 py-4 text-right text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Giá bán</th>
                <th className="px-6 py-4 text-center text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Tồn kho</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="px-6 py-4 text-right text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {books.map(([title, author, isbn, category, price, stock, status, statusWrap, dot, image]) => (
                <tr key={title} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded border border-slate-100 shadow-sm">
                        <img alt={`${title} Cover`} className="h-full w-full object-cover" src={image} />
                      </div>
                      <div>
                        <h4 className="leading-tight font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">{title}</h4>
                        <p className="text-xs text-slate-500">{author}</p>
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-tighter text-slate-400">{isbn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">{category}</span></td>
                  <td className="px-6 py-4 text-right"><span className="font-bold text-slate-900 dark:text-white">{price}</span></td>
                  <td className="px-6 py-4 text-center"><span className={`font-medium ${stock === "0" ? "text-error" : "text-slate-900 dark:text-white"}`}>{stock}</span></td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusWrap}`}><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded-lg p-2 text-slate-400 transition-all hover:bg-primary/5 hover:text-primary" title="Chỉnh sửa" type="button" onClick={onEdit}>
                        <MaterialIcon>edit</MaterialIcon>
                      </button>
                      <button className="rounded-lg p-2 text-slate-400 transition-all hover:bg-error/5 hover:text-error" title="Xóa" type="button">
                        <MaterialIcon>delete</MaterialIcon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500">Hiển thị <span className="text-slate-900 dark:text-white">1 - 4</span> của <span className="text-slate-900 dark:text-white">124</span> đầu sách</p>
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 disabled:opacity-30" disabled type="button"><MaterialIcon>chevron_left</MaterialIcon></button>
            <button className="h-8 w-8 rounded-lg bg-primary text-xs font-bold text-white shadow-sm" type="button">1</button>
            <button className="h-8 w-8 rounded-lg text-xs font-bold transition-colors hover:bg-slate-100 dark:hover:bg-slate-800" type="button">2</button>
            <button className="h-8 w-8 rounded-lg text-xs font-bold transition-colors hover:bg-slate-100 dark:hover:bg-slate-800" type="button">3</button>
            <span className="px-1 text-slate-400">...</span>
            <button className="h-8 w-8 rounded-lg text-xs font-bold transition-colors hover:bg-slate-100 dark:hover:bg-slate-800" type="button">31</button>
            <button className="p-2 text-slate-400 transition-colors hover:text-slate-900" type="button"><MaterialIcon>chevron_right</MaterialIcon></button>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-800/50 dark:bg-blue-900/10">
          <div className="relative z-10"><p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Tổng đầu sách</p><h3 className="text-4xl font-black text-slate-900 dark:text-white">1,248</h3><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><span className="font-bold text-green-600">+12%</span> so với tháng trước</p></div>
          <MaterialIcon className="absolute -bottom-4 -right-4 text-8xl text-primary/5">auto_stories</MaterialIcon>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="relative z-10"><p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Giá trị kho hàng</p><h3 className="text-4xl font-black text-slate-900 dark:text-white">324.5M</h3><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MaterialIcon className="text-xs">payments</MaterialIcon>VND (Giá bán lẻ)</p></div>
          <MaterialIcon className="absolute -bottom-4 -right-4 text-8xl text-slate-200/50">account_balance_wallet</MaterialIcon>
        </div>
      </div>
    </main>
  )
}

function CreateBookPage() {
  return (
    <main className="ml-64 flex min-h-screen flex-1 flex-col overflow-y-auto bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-8 md:p-12">
        <nav className="mb-6 flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="cursor-pointer transition-colors hover:text-primary">Quản lý</span>
          <MaterialIcon className="text-[10px]">chevron_right</MaterialIcon>
          <span className="cursor-pointer transition-colors hover:text-primary">Sách</span>
          <MaterialIcon className="text-[10px]">chevron_right</MaterialIcon>
          <span className="font-semibold text-primary">Thêm sách mới</span>
        </nav>

        <div className="flex flex-col gap-12 md:flex-row">
          <div className="md:w-1/3">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-on-surface">Thêm Sách Mới</h2>
            <p className="text-sm leading-relaxed text-on-surface-variant">Cung cấp các chi tiết về ấn phẩm mới nhất của bạn để quản lý trong thư viện số của The Literary Curator.</p>
            <div className="group mt-10 cursor-pointer">
              <label className="mb-4 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-on-surface-variant">Ảnh bìa sách</label>
              <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-high p-8 transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]">
                <MaterialIcon className="text-4xl text-on-surface-variant/40 transition-colors group-hover:text-primary">add_photo_alternate</MaterialIcon>
                <div className="text-center"><p className="text-sm font-medium text-on-surface">Tải lên ảnh bìa</p><p className="mt-1 text-xs text-on-surface-variant">Hỗ trợ JPG, PNG (Tối đa 2MB)</p></div>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="rounded-xl border border-slate-100 bg-surface-container-lowest p-8 shadow-[0px_12px_40px_rgba(0,0,0,0.04)]">
              <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2"><label className="mb-2 block px-1 text-[0.75rem] font-semibold text-on-surface-variant">Tên sách</label><input className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="Nhập tiêu đề sách..." type="text" /></div>
                <div><label className="mb-2 block px-1 text-[0.75rem] font-semibold text-on-surface-variant">Tác giả</label><input className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="Tên tác giả..." type="text" /></div>
                <div><label className="mb-2 block px-1 text-[0.75rem] font-semibold text-on-surface-variant">ISBN</label><input className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="e.g. 978-3-16-148410-0" type="text" /></div>
                <div><label className="mb-2 block px-1 text-[0.75rem] font-semibold text-on-surface-variant">Thể loại</label><div className="relative"><select className="w-full appearance-none rounded-lg border-none bg-surface-container-high px-4 py-3 text-on-surface outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20"><option value="">Chọn thể loại</option><option>Văn học</option><option>Kinh tế</option><option>Kỹ năng sống</option><option>Thiếu nhi</option><option>Khoa học</option></select><MaterialIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">expand_more</MaterialIcon></div></div>
                <div><label className="mb-2 block px-1 text-[0.75rem] font-semibold text-on-surface-variant">Giá bán (VNĐ)</label><div className="relative"><input className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 pr-12 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="0" type="number" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-on-surface-variant">₫</span></div></div>
                <div><label className="mb-2 block px-1 text-[0.75rem] font-semibold text-on-surface-variant">Số lượng tồn kho</label><input className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="0" type="number" /></div>
                <div />
                <div className="md:col-span-2"><label className="mb-2 block px-1 text-[0.75rem] font-semibold text-on-surface-variant">Mô tả nội dung</label><textarea className="w-full resize-none rounded-lg border-none bg-surface-container-high px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="Tóm tắt nội dung sách và các thông tin nổi bật khác..." rows="5" /></div>
                <div className="mt-2 flex items-center justify-end gap-4 border-t border-slate-50 pt-6 md:col-span-2"><button className="px-6 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface" type="button">Hủy bỏ</button><button className="flex items-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-blue-700 active:scale-95" type="submit"><MaterialIcon className="text-sm">save</MaterialIcon>Lưu thông tin</button></div>
              </form>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex gap-4 rounded-xl border border-primary/10 bg-primary-container/30 p-6"><MaterialIcon className="text-primary" fill>info</MaterialIcon><div><h4 className="text-sm font-bold text-on-primary-container">Mẹo nhỏ</h4><p className="mt-1 text-xs leading-relaxed text-on-primary-container/80">Đảm bảo ảnh bìa có chất lượng cao (300dpi) để hiển thị tốt nhất trên cửa hàng trực tuyến.</p></div></div>
              <div className="flex gap-4 rounded-xl border border-outline-variant/10 bg-surface-container-high p-6"><MaterialIcon className="text-slate-500">history</MaterialIcon><div><h4 className="text-sm font-bold text-slate-700">Lịch sử</h4><p className="mt-1 text-xs leading-relaxed text-slate-500">Sách sẽ được thêm vào trạng thái "Chờ duyệt" trước khi công khai lên kệ.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function EditBookPage() {
  return (
    <>
      <main className="relative ml-64 flex min-h-screen flex-grow flex-col overflow-x-hidden">
        <div className="mx-auto w-full max-w-6xl p-10">
          <nav className="mb-6 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-widest text-slate-400">
            <a className="transition-colors hover:text-primary" href="#books">Sách</a>
            <MaterialIcon className="text-[12px]">chevron_right</MaterialIcon>
            <a className="transition-colors hover:text-primary" href="#books">Danh mục</a>
            <MaterialIcon className="text-[12px]">chevron_right</MaterialIcon>
            <span className="font-bold text-slate-900">Chỉnh sửa sách</span>
          </nav>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Cập nhật thông tin sách</h2>
            <p className="mt-2 max-w-2xl text-lg text-slate-500">Cập nhật chi tiết tác phẩm, số lượng tồn kho và thông tin thương mại cho mã hàng này.</p>
          </div>

          <form className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
                <span className="mb-6 self-start text-[0.7rem] font-bold uppercase tracking-widest text-primary">Ảnh bìa</span>
                <div className="group relative mb-6 aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-lg shadow-md">
                  <img alt="Sách Đại Gia Gatsby" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3QZnuMs_T30_bQLB7-6BHZiMTj2AFF7Kh8C9d6zUzwC5dkLlE146H1gqUni6XuzeeGid46gt4V8syaT8F8Ei3tB3KPR63bKVNP9iR_T1Y5X7VGCP3r-0AD515M3ORxoPM8HsOQYvkztgEUQUCpfVwaLOGJbL-9Nf9EaWRtarpkaiHFobAEbgEH8trCRr8S1dkl2sqCy-AHZPwEOxZH_PTJIA5NzcREO9ni5uZkgCu3IKEIfu2Y7FJypbdMdCayGuUyY6ZhhywlhM" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <MaterialIcon className="mb-2 text-3xl">photo_camera</MaterialIcon>
                    <span className="text-xs font-bold uppercase tracking-widest">Thay đổi ảnh</span>
                  </div>
                </div>
                <p className="text-[0.7rem] italic leading-relaxed text-slate-400">Định dạng hỗ trợ: JPG, PNG, WEBP.<br />Tối đa 5MB. Khuyên dùng tỉ lệ 2:3.</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/50 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-blue-100 bg-white text-primary shadow-sm">
                    <MaterialIcon fill>analytics</MaterialIcon>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Hiệu suất bán hàng</h4>
                    <p className="text-xs text-slate-500">124 bản trong tháng này</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 lg:col-span-8">
              <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="mb-8 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <MaterialIcon className="text-primary">auto_stories</MaterialIcon>
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2"><label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Tiêu đề (Title)</label><input className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue="Đại Gia Gatsby" type="text" /></div>
                  <div><label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Tác giả (Author)</label><input className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue="F. Scott Fitzgerald" type="text" /></div>
                  <div><label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">ISBN-13</label><input className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue="978-604-56-1234-5" type="text" /></div>
                  <div><label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Danh mục (Category)</label><select className="w-full appearance-none rounded-lg border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"><option>Văn học kinh điển</option><option>Tiểu thuyết hiện đại</option><option>Kinh tế &amp; Quản trị</option><option>Tâm lý học</option></select></div>
                  <div><label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Nhà xuất bản</label><input className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue="NXB Hội Nhà Văn" type="text" /></div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="mb-8 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <MaterialIcon className="text-primary">payments</MaterialIcon>
                  Thương mại &amp; Kho vận
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="relative"><label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Giá bán (Price)</label><div className="relative"><input className="w-full rounded-lg border-slate-200 bg-slate-50 pl-4 pr-12 py-3 font-bold text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue="125000" type="number" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.7rem] font-bold text-slate-400">VND</span></div></div>
                  <div className="relative"><label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Tồn kho (Stock)</label><div className="relative"><input className="w-full rounded-lg border-slate-200 bg-slate-50 pl-4 pr-12 py-3 font-bold text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue="48" type="number" /><MaterialIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">inventory_2</MaterialIcon></div></div>
                  <div><label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Trạng thái</label><div className="inline-flex w-full items-center justify-center rounded-lg border-2 border-primary/20 bg-blue-50 px-4 py-3 text-[0.75rem] font-bold uppercase tracking-widest text-primary">Còn hàng</div></div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <label className="mb-3 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Giới thiệu tóm tắt</label>
                <textarea className="w-full resize-none rounded-lg border-slate-200 bg-slate-50 px-4 py-3 font-medium leading-relaxed text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue={'Đại Gia Gatsby là một tiểu thuyết của nhà văn F. Scott Fitzgerald, người Mỹ. Truyện lấy bối cảnh tại Vùng Long Island ở New York, câu chuyện mô tả thời kỳ rực rỡ của "Thời đại Jazz" trong lịch sử Hoa Kỳ...'} rows="5" />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button className="scale-95 rounded-lg border border-slate-200 bg-white px-8 py-4 text-sm font-bold tracking-wide text-slate-500 transition-all hover:bg-slate-50 active:opacity-80" type="button">Hủy thay đổi</button>
                <button className="flex scale-95 items-center gap-3 rounded-lg bg-primary px-10 py-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-primary/30 transition-all hover:bg-blue-800 active:opacity-80" type="submit">Lưu thay đổi<MaterialIcon className="text-[20px]">check_circle</MaterialIcon></button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-white text-primary shadow-xl transition-all hover:-translate-y-1">
          <MaterialIcon fill>help</MaterialIcon>
          <div className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded bg-slate-900 px-3 py-2 text-[0.7rem] font-bold uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100">Trợ giúp</div>
        </button>
      </div>
    </>
  )
}

function CategoryPage({ onNavigate }) {
  return (
    <div className="editorial-gradient min-h-screen bg-surface text-on-surface">
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50 px-4 py-8 font-['Inter'] antialiased tracking-tight">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-bold tracking-tighter text-slate-900">Lumina Ledger</h1>
          <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-widest text-slate-500">The Literary Curator</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {pages.map((item) => {
            const active = item.key === "categories"
            return (
              <button
                key={item.key}
                className={`group flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
                  active && item.key === "categories"
                    ? "bg-blue-50/50 font-semibold text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                type="button"
                onClick={() => onNavigate(item.key)}
              >
                <MaterialIcon fill={active}>{item.icon}</MaterialIcon>
                <span className={`text-[0.8125rem] ${active ? "font-semibold" : "font-medium"}`}>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-slate-200 pt-6">
          <button className="flex w-full scale-95 items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-error active:opacity-80" type="button">
            <MaterialIcon>logout</MaterialIcon>
            <span className="text-[0.8125rem] font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="ml-64 flex min-h-screen flex-col">
        <header className="sticky top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-full focus-within:ring-2 focus-within:ring-blue-500/20">
              <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</MaterialIcon>
              <input className="w-full rounded-full border-none bg-slate-100/50 py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:ring-0" placeholder="Tìm kiếm danh mục..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 transition-colors hover:text-blue-500" type="button">
              <MaterialIcon>notifications</MaterialIcon>
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-error" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
              <div className="text-right">
                <p className="text-sm font-semibold text-on-surface">Lumina Admin</p>
                <p className="text-[10px] font-medium uppercase tracking-tight text-slate-500">NGƯỜI QUẢN LÝ</p>
              </div>
              <img alt="Lumina Admin" className="h-9 w-9 rounded-full border border-slate-200 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWFDUpTqu0vL7YgtTtTW3yxhAX3ZPlI3WAKaYXTuFoQnWO3Wa_2vkPGwxVW3jnuxWMt57FpFLJkhfWZ2JyNvzkB2MN4qo8Gvozr29yJec2Quto7VYBoNHbTz_5Hp2cROuz6UDVUfo9cc58dvVODby7tBnmr3r0XIBnKvKBuESOR_ZTVeiQURiwyqNQOvz2K-wD3csYdQEcxxOp_xbl5WCIAkqxhCIxcoqlSpJVxnxpetEoij7Sy2PC4vD8Er9o4FPfEp2yW3ypLUA" />
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl space-y-10 p-8 pt-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-2">
              <h2 className="text-[2.75rem] font-bold leading-tight tracking-tight text-on-surface">Quản lý Danh mục</h2>
              <p className="max-w-lg leading-relaxed text-on-surface-variant">Tổ chức và phân loại kho sách của bạn một cách khoa học để tối ưu hóa trải nghiệm tìm kiếm của độc giả.</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" type="button" onClick={() => onNavigate("category-create")}>
              <MaterialIcon>add</MaterialIcon>
              Thêm danh mục mới
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="flex h-40 flex-col justify-between rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-[0px_12px_32px_rgba(43,52,55,0.06)]">
              <div className="flex items-start justify-between">
                <span className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">Tổng số danh mục</span>
                <div className="rounded-lg bg-primary-container p-2">
                  <MaterialIcon className="text-primary">category</MaterialIcon>
                </div>
              </div>
              <div>
                <p className="text-4xl font-bold">24</p>
                <p className="mt-1 flex items-center gap-1 text-[0.75rem] font-medium text-emerald-600">
                  <MaterialIcon className="text-sm">trending_up</MaterialIcon>
                  +2 trong tháng này
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest shadow-[0px_12px_32px_rgba(43,52,55,0.06)]">
            <div className="flex items-center justify-between border-b border-surface-container-low px-8 py-6">
              <h3 className="text-xl font-semibold">Danh sách danh mục</h3>
              <div className="flex gap-2">
                <button className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low" type="button"><MaterialIcon>filter_list</MaterialIcon></button>
                <button className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low" type="button"><MaterialIcon>download</MaterialIcon></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    {["Tên danh mục", "Mô tả", "Số lượng sách", "Trạng thái"].map((head) => (
                      <th key={head} className="px-8 py-4 text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">{head}</th>
                    ))}
                    <th className="px-8 py-4 text-right text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {[
                    ["menu_book", "bg-primary-container/30", "text-primary", "Văn học", "Các tác phẩm kinh điển, tiểu thuyết hiện đại và thơ ca...", "1,240", "bg-primary w-3/4", "Đang hoạt động", true],
                    ["payments", "bg-blue-100/50", "text-primary", "Kinh tế", "Quản trị kinh doanh, tài chính cá nhân và khởi nghiệp...", "856", "bg-primary/70 w-1/2", "Đang hoạt động", true],
                    ["psychology", "bg-amber-100", "text-amber-600", "Kỹ năng sống", "Phát triển bản thân, tâm lý học và kỹ năng mềm...", "532", "bg-amber-500 w-1/3", "Đang hoạt động", true],
                    ["biotech", "bg-slate-200", "text-slate-600", "Khoa học", "Kiến thức phổ thông, vật lý, thiên văn và sinh học...", "0", "bg-slate-400 w-0", "Trống", false],
                  ].map(([icon, iconWrap, iconColor, title, desc, count, bar, status, active]) => (
                    <tr key={title} className="group transition-colors hover:bg-surface-container-low/30">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconWrap}`}>
                            <MaterialIcon className={iconColor}>{icon}</MaterialIcon>
                          </div>
                          <span className="text-lg font-semibold text-on-surface">{title}</span>
                        </div>
                      </td>
                      <td className="max-w-xs truncate px-8 py-6 text-sm text-on-surface-variant">{desc}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-on-surface">{count}</span>
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-container-high">
                            <div className={`h-full ${bar}`} />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${active ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant"}`}>{status}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-primary-container hover:text-primary" type="button" onClick={() => onNavigate("category-edit")}>
                            <MaterialIcon className="text-[20px]">edit</MaterialIcon>
                          </button>
                          <button className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error" type="button">
                            <MaterialIcon className="text-[20px]">delete</MaterialIcon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-surface-container-low bg-surface-container-low/20 px-8 py-6">
              <p className="text-[0.75rem] text-on-surface-variant">Hiển thị 1-10 trong tổng số 24 danh mục</p>
              <div className="flex items-center gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50" disabled type="button"><MaterialIcon>chevron_left</MaterialIcon></button>
                <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-bold text-on-primary shadow-md shadow-primary/20" type="button">1</button>
                <button className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container-low" type="button">2</button>
                <button className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container-low" type="button">3</button>
                <button className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low" type="button"><MaterialIcon>chevron_right</MaterialIcon></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 py-6">
            <div className="relative flex gap-6 overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-low">
                <MaterialIcon className="text-on-surface-variant">history</MaterialIcon>
              </div>
              <div className="relative z-10 space-y-2">
                <h4 className="font-bold text-on-surface">Hoạt động gần đây</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" /><span className="text-on-surface-variant">Admin đã thêm danh mục <b>Kỹ năng sống</b> 2 giờ trước.</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" /><span className="text-on-surface-variant">Cập nhật mô tả danh mục <b>Kinh tế</b>.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl transition-all hover:scale-110 active:scale-95 md:hidden" type="button" onClick={() => onNavigate("category-create")}>
          <MaterialIcon className="text-2xl">add</MaterialIcon>
        </button>
      </main>
    </div>
  )
}

function CreateCategoryPage({ onNavigate }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-on-surface antialiased">
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 flex-col space-y-2 border-r border-slate-200 bg-slate-50 p-4 md:flex">
        <div className="mb-8 px-4">
          <h1 className="text-xl font-bold tracking-tighter text-slate-900">Lumina Ledger</h1>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">The Literary Curator</p>
        </div>
        <nav className="flex-1 space-y-1">
          {pages.map((item) => {
            const active = item.key === "categories"
            return (
              <button
                key={item.key}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                  active && item.key === "categories"
                    ? "rounded-lg bg-blue-50/50 font-semibold text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                type="button"
                onClick={() => onNavigate(item.key)}
              >
                <MaterialIcon fill={active}>{item.icon}</MaterialIcon>
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto pt-4">
          <button className="flex w-full items-center gap-3 px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900" type="button">
            <MaterialIcon>logout</MaterialIcon>
            Đăng xuất
          </button>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
            <img alt="Lumina Ledger Logo" className="h-8 w-8 rounded-full bg-slate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfOgeSybfTqiExo857l7Yxr5IsJSda7HYv73eD2SnDt88dFI5k0SUie3pQ6xX__P-8KynG01OZaIZxUMU1_ZuAsVuw3_uLhZLDuauwma8e-HAg3uAL2IjLFmVcIOFcybvVjO4TpE5IpQBQ8w5cPDL0DC8DqXy4njnErpaB8PI5XzI-TvGOjBAuC2-y3k03BeUhCWt7qhPxFbvjB9YYgDgi960g6Wt-2QQDySiTmsPirt7d6hxBVtCxqu8vcb6uNAKGAnPApiK85z4" />
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-xs font-bold">Hệ thống Quản lý Sách</p>
              <p className="truncate text-[10px] text-slate-400">admin@literarycurator.vn</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="ml-0 flex h-screen min-w-0 flex-1 flex-col overflow-y-auto md:ml-64">
        <header className="sticky top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 transition-colors hover:bg-slate-100 md:hidden" type="button">
              <MaterialIcon>menu</MaterialIcon>
            </button>
            <div className="flex w-64 items-center rounded-full bg-surface-container-high px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/20">
              <MaterialIcon className="mr-2 text-lg text-slate-400">search</MaterialIcon>
              <input className="w-full border-none bg-transparent text-sm focus:ring-0" placeholder="Tìm kiếm hệ thống..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 transition-colors hover:text-blue-500" type="button"><MaterialIcon>notifications</MaterialIcon></button>
            <button className="p-2 text-slate-500 transition-colors hover:text-blue-500" type="button"><MaterialIcon>mail</MaterialIcon></button>
            <div className="mx-2 h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">Lumina Admin</span>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90" type="button">
                Hành động nhanh
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-6 lg:p-12">
          <div className="mb-10">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <a className="hover:underline" href="#categories">Danh mục</a>
              <MaterialIcon className="text-xs">chevron_right</MaterialIcon>
              <span className="text-slate-500">Thêm mới</span>
            </div>
            <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface">Tạo Danh Mục Mới</h2>
            <p className="max-w-2xl leading-relaxed text-on-surface-variant">Xây dựng cấu trúc phân loại cho bộ sưu tập sách của bạn. Các danh mục được thiết kế tốt giúp độc giả dễ dàng khám phá kho tàng tri thức.</p>
          </div>

          <form className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-7">
              <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-8 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                  <MaterialIcon className="text-primary">edit_note</MaterialIcon>
                  Thông tin cơ bản
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 ml-1 block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Tên danh mục <span className="text-error">*</span></label>
                    <input className="w-full rounded-xl border-none bg-surface-container-high px-4 py-3 font-medium text-on-surface transition-all focus:ring-2 focus:ring-primary/20" placeholder="Ví dụ: Văn học Kinh điển" type="text" />
                  </div>
                  <div>
                    <label className="mb-2 ml-1 block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Danh mục cha (Tùy chọn)</label>
                    <div className="relative">
                      <select className="w-full cursor-pointer appearance-none rounded-xl border-none bg-surface-container-high px-4 py-3 font-medium text-on-surface transition-all focus:ring-2 focus:ring-primary/20">
                        <option value="">Không có (Là danh mục gốc)</option>
                        <option value="1">Văn học</option>
                        <option value="2">Kỹ năng sống</option>
                        <option value="3">Kinh tế - Kinh doanh</option>
                        <option value="4">Ngoại ngữ</option>
                      </select>
                      <MaterialIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">expand_more</MaterialIcon>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 ml-1 block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Mô tả chi tiết</label>
                    <textarea className="w-full resize-none rounded-xl border-none bg-surface-container-high px-4 py-3 font-medium text-on-surface transition-all focus:ring-2 focus:ring-primary/20" placeholder="Mô tả về các loại sách thuộc danh mục này..." rows="5" />
                    <p className="mt-2 text-xs text-on-surface-variant">Thông tin này sẽ hiển thị ở đầu trang danh mục cho khách hàng.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 pt-4">
                <button className="rounded-lg px-6 py-3 font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high" type="button">Hủy bỏ</button>
                <button className="rounded-lg bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" type="submit">Tạo danh mục</button>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-8 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                  <MaterialIcon className="text-primary">rebase_edit</MaterialIcon>
                  Biểu tượng nhận diện
                </h3>
                <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low p-8">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
                    <MaterialIcon className="text-4xl" fill>auto_stories</MaterialIcon>
                  </div>
                  <span className="text-sm font-bold text-on-surface">Đang chọn: Truyện/Sách</span>
                </div>
                <label className="mb-4 ml-1 block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Chọn từ thư viện</label>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {["book", "auto_stories", "history_edu", "psychology", "brush", "science", "finance", "language", "child_care", "more_horiz"].map((icon, index) => (
                    <button key={icon} className={`aspect-square rounded-lg border transition-all ${index === 1 ? "border-primary/30 bg-primary-container text-primary" : "border-transparent bg-surface-container-high hover:border-primary/20 hover:bg-primary/10 hover:text-primary"}`} type="button">
                      <MaterialIcon fill={index === 1}>{icon}</MaterialIcon>
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-6">
                <div className="flex items-start gap-4">
                  <MaterialIcon className="mt-1 text-primary">info</MaterialIcon>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-primary">Mẹo nhỏ</h4>
                    <p className="text-xs leading-relaxed text-on-surface-variant">Việc gắn biểu tượng giúp nhân viên kho hàng nhanh chóng nhận diện khu vực sách trên ứng dụng quản lý di động.</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>

        <footer className="mt-auto border-t border-surface-container px-6 py-8 text-center text-on-surface-variant">
          <p className="text-xs">© 2024 Lumina Ledger • Hệ thống Quản trị Nhà sách Cao cấp</p>
        </footer>
      </div>
    </div>
  )
}

function EditCategoryPage({ onNavigate }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-on-background">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col bg-slate-50 px-4 py-6 font-['Inter'] antialiased tracking-tight md:flex">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-bold tracking-tighter text-slate-900">The Curator</h1>
          <p className="text-xs text-slate-500">Hệ thống quản lý</p>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            ["dashboard", "dashboard", "Bảng điều khiển"],
            ["books", "menu_book", "Sách"],
            ["categories", "category", "Danh mục"],
            ["inventory", "inventory_2", "Kho hàng"],
            ["orders", "shopping_cart", "Đơn hàng"],
            ["users", "group", "Người dùng"],
            ["reviews", "star", "Đánh giá"],
            ["coupons", "local_offer", "Mã giảm giá"],
            ["reports", "analytics", "Báo cáo"],
            ["settings", "settings", "Cài đặt"],
          ].map(([key, icon, label]) => {
            const active = key === "categories"
            return (
              <button
                key={key}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors duration-150 ${
                  active
                    ? "border-r-4 border-blue-600 bg-blue-50/50 font-semibold text-blue-600"
                    : "text-slate-500 hover:bg-slate-200/50"
                }`}
                onClick={() => onNavigate(key)}
                type="button"
              >
                <MaterialIcon>{icon}</MaterialIcon>
                <span className="text-sm">{label}</span>
              </button>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-slate-100 pt-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-slate-500 transition-colors duration-150 hover:bg-slate-200/50" type="button">
            <MaterialIcon>logout</MaterialIcon>
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <div className="ml-0 flex flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md">
          <div className="flex flex-1 items-center gap-4">
            <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-slate-50 px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/20">
              <MaterialIcon className="text-slate-400">search</MaterialIcon>
              <input className="w-full border-none bg-transparent text-sm focus:ring-0" placeholder="Tìm kiếm tài liệu..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-600 transition-all hover:text-blue-600" type="button">
              <MaterialIcon>notifications</MaterialIcon>
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
              <div className="text-right">
                <p className="text-sm font-semibold text-on-surface">Lumina Admin</p>
                <p className="text-[10px] font-medium uppercase tracking-tight text-slate-500">NGƯỜI QUẢN LÝ</p>
              </div>
              <img alt="Lumina Admin" className="h-9 w-9 rounded-full border border-slate-200 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWFDUpTqu0vL7YgtTtTW3yxhAX3ZPlI3WAKaYXTuFoQnWO3Wa_2vkPGwxVW3jnuxWMt57FpFLJkhfWZ2JyNvzkB2MN4qo8Gvozr29yJec2Quto7VYBoNHbTz_5Hp2cROuz6UDVUfo9cc58dvVODby7tBnmr3r0XIBnKvKBuESOR_ZTVeiQURiwyqNQOvz2K-wD3csYdQEcxxOp_xbl5WCIAkqxhCIxcoqlSpJVxnxpetEoij7Sy2PC4vD8Er9o4FPfEp2yW3ypLUA" />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl p-8">
          <nav className="mb-8 flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-outline">
                <span className="cursor-pointer transition-colors hover:text-primary" onClick={() => onNavigate("categories")}>DANH MỤC</span>
                <MaterialIcon className="text-[12px]">chevron_right</MaterialIcon>
                <span className="text-primary-dim">CHỈNH SỬA</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-background">Chỉnh sửa Danh mục</h2>
            </div>
            <div className="flex gap-3">
              <button className="rounded-lg px-6 py-2.5 text-sm font-semibold text-on-secondary-container transition-colors hover:bg-surface-container-high" type="button" onClick={() => onNavigate("categories")}>Hủy bỏ</button>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-dim" type="button">
                <MaterialIcon className="text-[18px]">save</MaterialIcon>
                Lưu thay đổi
              </button>
            </div>
          </nav>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-7">
              <section className="rounded-xl bg-surface-container-lowest p-8 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                  <span className="h-6 w-1 rounded-full bg-primary" />
                  Thông tin cơ bản
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-wider text-outline">Tên danh mục</label>
                    <input className="w-full rounded-lg border-none bg-surface-container-low px-4 py-3 font-medium text-on-background focus:ring-2 focus:ring-primary/20" defaultValue="Văn học đương đại" type="text" />
                  </div>
                  <div>
                    <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-wider text-outline">Danh mục cha</label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border-none bg-surface-container-low px-4 py-3 font-medium text-on-background focus:ring-2 focus:ring-primary/20">
                        <option>Sách Tiếng Việt</option>
                        <option defaultValue>Văn học</option>
                        <option>Kinh tế</option>
                        <option>Kỹ năng sống</option>
                      </select>
                      <MaterialIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline">expand_more</MaterialIcon>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 ml-1 block text-[11px] font-bold uppercase tracking-wider text-outline">Mô tả chi tiết</label>
                    <textarea className="w-full resize-none rounded-lg border-none bg-surface-container-low px-4 py-3 font-medium text-on-background focus:ring-2 focus:ring-primary/20" defaultValue="Các tác phẩm văn học được sáng tác trong giai đoạn từ năm 1975 đến nay, bao gồm cả văn học trong nước và tác phẩm dịch từ nước ngoài. Tập trung vào các chủ đề hiện đại, đời sống đô thị và tâm lý con người thế kỷ 21." rows="6" />
                  </div>
                </div>
              </section>

              <section className="rounded-xl bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <span className="h-6 w-1 rounded-full bg-primary" />
                    Icon đại diện
                  </h3>
                  <span className="rounded bg-primary-container px-2 py-1 text-[11px] font-bold text-primary-dim">ĐÃ CHỌN</span>
                </div>
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
                  {["auto_stories", "menu_book", "history_edu", "ink_pen", "library_books", "import_contacts", "bookmark", "local_library", "collections_bookmark", "description", "style", "edit_note"].map((icon, index) => (
                    <button key={icon} className={`aspect-square rounded-lg border-2 transition-all ${index === 1 ? "border-primary bg-primary-container text-primary shadow-sm" : "border-transparent bg-surface-container-low text-outline hover:bg-primary/10 hover:text-primary"}`} type="button">
                      <MaterialIcon>{icon}</MaterialIcon>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8 lg:col-span-5">
              <section className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-dim p-8 text-on-primary shadow-xl">
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl transition-all group-hover:bg-white/20" />
                <div className="relative z-10">
                  <MaterialIcon className="mb-4 text-4xl" fill>menu_book</MaterialIcon>
                  <h4 className="mb-2 text-2xl font-bold">Văn học đương đại</h4>
                  <p className="mb-6 text-sm leading-relaxed text-white/80">
                    Danh mục con của <span className="font-bold underline decoration-white/30 underline-offset-4">Văn học</span>
                  </p>
                  <div className="flex gap-8">
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-widest text-white/60">Số lượng sách</p>
                      <p className="text-xl font-bold">1,248</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-widest text-white/60">Lượt xem tháng</p>
                      <p className="text-xl font-bold">4.8k</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-xl bg-surface-container-lowest p-8 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                  <span className="h-6 w-1 rounded-full bg-primary" />
                  Trạng thái &amp; Hiển thị
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                    <div>
                      <p className="text-sm font-semibold">Hiển thị trên trang chủ</p>
                      <p className="text-xs text-on-surface-variant">Cho phép khách hàng thấy danh mục này</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input className="peer sr-only" defaultChecked type="checkbox" />
                      <div className="h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                    <div>
                      <p className="text-sm font-semibold">Ưu tiên sắp xếp</p>
                      <p className="text-xs text-on-surface-variant">Thứ tự ưu tiên trong danh sách menu</p>
                    </div>
                    <input className="w-16 rounded bg-surface-container-lowest px-2 py-1 text-center font-bold text-primary ring-1 ring-primary/20" defaultValue="1" type="number" />
                  </div>
                  <div className="border-t border-surface-container-low pt-4">
                    <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-outline">Lịch sử cập nhật</p>
                    <div className="flex items-center gap-3">
                      <img alt="Editor" className="h-8 w-8 rounded-full border border-surface-container-high" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRd-_qDJ1wDFJJ1xw2ZtTSG-EMPlIQSY4S6gPDnTM0koNTqQPR3Xy6ngyTtXJ19rc8wkSJd14PPzfX8ItalVc8U6AdYYJY4wK2zEpw70jPcvpWjooLToMdsavPPGzvd3CTvx31DZOWXEFDRxKoa9k4IdxRxC_8jMJRsFzNCNWe_QiN1mxvuPpDukBwq6hHQibdXnnyR4Wet31N7ZsJZRq03HuGTGmlB4JhUew-aVXQQUDyatJyrczvsm-xUhS9B12y-dwiGIkK2Oo" />
                      <div>
                        <p className="text-xs font-semibold">Cập nhật lần cuối bởi Trần Anh</p>
                        <p className="text-[10px] text-on-surface-variant">14:30 - 20/05/2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function InventoryPage({ onNavigate }) {
  return (
    <main className="relative ml-64 flex min-h-screen flex-grow flex-col overflow-x-hidden bg-surface">
      <header className="sticky top-0 right-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md">
        <div className="flex max-w-md flex-grow items-center gap-4">
          <div className="relative w-full">
            <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</MaterialIcon>
            <input className="w-full rounded-lg border-none bg-slate-50 py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20" placeholder="Tìm kiếm sách, mã ISBN..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600" type="button">
            <MaterialIcon>notifications</MaterialIcon>
          </button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
            <div className="text-right">
              <p className="text-sm font-semibold text-on-surface">Lumina Admin</p>
              <p className="text-[10px] font-medium uppercase tracking-tight text-slate-500">NGƯỜI QUẢN LÝ</p>
            </div>
            <img alt="Lumina Admin" className="h-9 w-9 rounded-full border border-slate-200 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWFDUpTqu0vL7YgtTtTW3yxhAX3ZPlI3WAKaYXTuFoQnWO3Wa_2vkPGwxVW3jnuxWMt57FpFLJkhfWZ2JyNvzkB2MN4qo8Gvozr29yJec2Quto7VYBoNHbTz_5Hp2cROuz6UDVUfo9cc58dvVODby7tBnmr3r0XIBnKvKBuESOR_ZTVeiQURiwyqNQOvz2K-wD3csYdQEcxxOp_xbl5WCIAkqxhCIxcoqlSpJVxnxpetEoij7Sy2PC4vD8Er9o4FPfEp2yW3ypLUA" />
          </div>
        </div>
      </header>

      <div className="space-y-8 p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="editorial-shadow relative col-span-1 overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white md:col-span-2">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Tổng tồn kho</p>
              <h2 className="mt-2 text-4xl font-bold">12.840</h2>
              <p className="mt-1 text-sm opacity-90">Sản phẩm hiện có trong kho</p>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-10">
              <MaterialIcon className="text-[10rem]">inventory</MaterialIcon>
            </div>
          </div>
          <div className="editorial-shadow flex flex-col rounded-lg border border-slate-100 bg-white p-6">
            <MaterialIcon className="mb-4 text-red-500" fill>warning</MaterialIcon>
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Sắp hết hàng</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">124</h3>
            <p className="mt-auto text-xs font-medium text-red-500">+12 sản phẩm từ hôm qua</p>
          </div>
          <div className="editorial-shadow flex flex-col rounded-lg border border-slate-100 bg-white p-6">
            <MaterialIcon className="mb-4 text-green-600">trending_up</MaterialIcon>
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Xuất kho tháng này</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">2.450</h3>
            <p className="mt-auto text-xs font-medium text-green-600">Tăng 8% so với tháng trước</p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-4 md:flex-row">
          <div>
            <button className="mb-4 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700" type="button" onClick={() => onNavigate("inventory-create")}>
              <MaterialIcon className="text-lg">add_box</MaterialIcon>
              <span>Nhập kho sản phẩm</span>
            </button>
            <h2 className="text-xl font-bold text-slate-900">Danh mục tồn kho</h2>
            <p className="mt-0.5 text-sm text-slate-500">Quản lý và theo dõi số lượng sách tại các chi nhánh.</p>
          </div>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            <button className="rounded bg-white px-4 py-1.5 text-xs font-bold text-blue-600 shadow-sm" type="button">Tất cả</button>
            <button className="rounded px-4 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:bg-white/50" type="button">Sắp hết hàng</button>
            <button className="rounded px-4 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:bg-white/50" type="button">Hết hàng</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="editorial-shadow overflow-hidden rounded-lg border border-slate-100 bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["Sách", "Mã ISBN", "Tồn kho", "Trạng thái"].map((head) => (
                      <th key={head} className="px-6 py-4 text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">{head}</th>
                    ))}
                    <th className="w-10 px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["Nhà Giả Kim", "Paulo Coelho", "978-604-56-114-1", "452", "Còn hàng", "bg-blue-50 text-blue-700 border-blue-100", "bg-blue-600 animate-pulse", "https://lh3.googleusercontent.com/aida-public/AB6AXuADw4-AK30LcxdLZ8nGjpHPs5ShZPlGYoQdFIlmOmh8y5I6jSYVA-8rWFU59xFg9d9-DOEaB2JOrBngdDRkCG7PKv3Y8Q9hoILar5ApCVfo4XkP3iDdI_HHaIE2tAbH5cM-yM3TfGv-IaMy8lVwtEElUE5dHofKZBPJxTJfVdQBeIjGa_J8sheOsVcKBZTZ5cKOx30gdgI6kvLIBO4sB46yjtnUkA9uXpC4p5q1PXn2V2BVRKe3Yiut8LKTdJu_PXgtLXlGEhkUxKM"],
                    ["Sapiens: Lược Sử Loài Người", "Yuval Noah Harari", "978-604-56-421-2", "18", "Sắp hết hàng", "bg-red-50 text-red-700 border-red-100", "bg-red-500", "https://lh3.googleusercontent.com/aida-public/AB6AXuCf3tf9s0JOg1RHqyMV8HsJADcuWweA0YtnI08aR0lIwP7Qa_g2cAEMd_B-fyQ4j2Z8oAfS3jQT_s4BfXlhZz5P3aq4dCEqAugHdC-pUZAsNZxm3wxTxViST1oouRVqj2j9EB8KdYo_zWZ4JWlOPUGYn1bP_SW9ONrgpLsyQ8NFUuJ-Fdnsh-qrt3r-G5e8KgXctfGwIzqdsJ9cRfMhD2FyF0aHmezvwSQtqGO7lGtOjBRvBxlfomT3rUH6fGez3UzSceToeGLBFJM"],
                    ["Hoàng Tử Bé", "Antoine de Saint-Exupéry", "978-604-56-789-0", "0", "Hết hàng", "bg-slate-100 text-slate-500 border-slate-200", "bg-slate-400", "https://lh3.googleusercontent.com/aida-public/AB6AXuCZHPKQMlFFPzKQTljHYUtDKs6X8heK-y8ZFlcPiF6r3670ItfNVoCTunksUZXzBE0LQ2rmi-tUk5m5_5NkGom9xUCvDtAQqOKFxavxYNJzNIDeLqG1VzCiKMge2_AWbTn8lDyaE32SZI-qegRdMsLeBMFZUUivbjuWYI-Co3_mkgQs5iiXT891osZUEbaJBiUTQKLmPDnWSbL219_AauYiFp4h3m07Ik-6Pujqq4a-LYhDK2rLh-v1sfZR366P-eJOKrNf4EIBg3E"],
                  ].map(([title, author, isbn, stock, status, badge, dot, image]) => (
                    <tr key={title} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-slate-100 shadow-sm">
                            <img alt={`${title} Cover`} className="h-full w-full object-cover" src={image} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{title}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5"><span className="font-mono text-xs text-slate-500">{isbn}</span></td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900">{stock}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest ${badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-slate-400 transition-colors hover:text-red-500" type="button">
                          <MaterialIcon className="text-lg">delete</MaterialIcon>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                <p className="text-xs text-slate-500">Hiển thị <span className="font-bold text-slate-900">1 - 5</span> của <span className="font-bold text-slate-900">1,248</span> sản phẩm</p>
                <div className="flex items-center gap-1">
                  <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-blue-600" type="button"><MaterialIcon className="text-lg">chevron_left</MaterialIcon></button>
                  <button className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white" type="button">1</button>
                  <button className="flex h-7 w-7 items-center justify-center rounded text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100" type="button">2</button>
                  <button className="flex h-7 w-7 items-center justify-center rounded text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100" type="button">3</button>
                  <span className="px-1 text-xs text-slate-400">...</span>
                  <button className="flex h-7 w-7 items-center justify-center rounded text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100" type="button">25</button>
                  <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-blue-600" type="button"><MaterialIcon className="text-lg">chevron_right</MaterialIcon></button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="editorial-shadow rounded-lg border border-slate-100 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Lịch sử giao dịch</h3>
                <button className="text-xs font-bold text-blue-600 hover:underline" type="button">Xem tất cả</button>
              </div>
              <div className="space-y-6">
                {[
                  ["login", "bg-green-50 text-green-600", "Nhập kho: +250 cuốn", "Nhà Giả Kim", "14:20 • 12/10/2023", "Kho A-1"],
                  ["logout", "bg-blue-50 text-blue-600", "Xuất kho: -12 cuốn", "Sapiens: Lược Sử Loài Người", "09:15 • 12/10/2023", "Đơn hàng #3401"],
                  ["inventory", "bg-orange-50 text-orange-600", "Kiểm kho định kỳ", "Toàn bộ danh mục Văn học", "Hôm qua • 17:00", "By Admin"],
                ].map(([icon, wrap, title, subtitle, time, tag], index) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${wrap}`}>
                        <MaterialIcon className="text-lg">{icon}</MaterialIcon>
                      </div>
                      {index < 2 ? <div className="mt-2 h-full w-px bg-slate-100" /> : null}
                    </div>
                    <div className={index < 2 ? "pb-6" : ""}>
                      <p className="text-sm font-bold text-slate-900">{title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[0.65rem] text-slate-400">{time}</span>
                        <span className="rounded border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[0.6rem] font-medium text-slate-500">{tag}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function InventoryCreatePage() {
  return (
    <div className="editorial-gradient ml-64 flex min-h-screen flex-1 flex-col bg-surface">
      <header className="sticky top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md font-['Inter'] text-sm">
        <div className="flex items-center gap-4">
          <div className="group relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MaterialIcon className="text-sm text-slate-400">search</MaterialIcon>
            </div>
            <input className="w-64 rounded-full border-none bg-slate-100 py-2 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-primary/20" placeholder="Tìm kiếm sách, tác giả..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="p-2 text-slate-500 transition-colors hover:text-primary" type="button">
            <MaterialIcon>notifications</MaterialIcon>
          </button>
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-700">Lumina Admin</span>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-primary">
              <img alt="Lumina Admin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJi1fpZy3Qm0XMan9WElYF0W2Iku6YrSuHxCWHBSDWxiGLJJoeiLUuIAe-jR_HDPAwjeSSM0PjON_Z7QJ3KGfDEuKyEky9B_arh3DqbriM2hD05_-7ucQRfA9X21Pqabby9wyI1_9EnV9dn17eX-v7etLu5ySU0erdRvWtBuP18Kv0e-3aNd_fI8kosBX-CAJGUAGTTdDlDI7MeuWMe7Lgws6bs52kf-YNAom7XqfvSW6oWi7rkqjLS23_XzamL0FZDWHnblV9kEw" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl p-8">
        <div className="flex flex-col items-start gap-10 md:flex-row">
          <div className="w-full flex-1">
            <div className="mb-10">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-on-surface">Nhập kho sản phẩm</h2>
              <p className="text-on-surface-variant">Cập nhật số lượng sách mới và quản lý thông tin nhà cung cấp.</p>
            </div>

            <div className="rounded-xl border border-outline bg-surface-container-lowest p-8 shadow-sm">
              <form className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Chọn Sách</label>
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <MaterialIcon className="text-primary">menu_book</MaterialIcon>
                    </div>
                    <input className="w-full rounded-lg border-none bg-surface-container-high py-4 pl-12 pr-4 text-on-surface transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20" placeholder="Nhập tên sách hoặc mã ISBN..." type="text" />
                    <div className="absolute left-0 right-0 top-full z-10 mt-2 hidden overflow-hidden rounded-lg border border-outline bg-white shadow-xl group-focus-within:block">
                      <div className="flex cursor-pointer items-center gap-4 p-4 hover:bg-slate-50">
                        <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-slate-200 shadow-sm">
                          <img alt="Book Cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3KJfKOBQfWctrGBcxyEZNHQDKa7OHHt1UFIfHgqa0aZZ-18ni8codi2RYiXm32PL8snXun9TcmYzBVwB_ltcUMYZNVmjjDSKQ31mPzNFEFXyhjhMXQv_7V-iMCOCDLDx-HrBTrtbdwAJJ1jlIOkMff7lSFV03ecAg-Xw--yRQrtUIq3TRe5EAnKZxdcgM8jDt5qAR2VhBkl7i0mtQ8gYf3eesLsUkTI6OR8DGsCCwI90m7mfwQKshB2rkOGmoen7_jPO0YHkqCI8" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Cội Nguồn (Origin)</p>
                          <p className="text-xs text-on-surface-variant">Dan Brown • 978-604-55-2312-5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Nhà Cung Cấp</label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border-none bg-surface-container-high py-4 pl-4 pr-10 text-on-surface transition-all focus:ring-2 focus:ring-primary/20">
                        <option>Công ty Văn hóa Phương Nam</option>
                        <option>NXB Trẻ</option>
                        <option>Nhã Nam</option>
                        <option>Fahasa</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <MaterialIcon className="text-slate-400">expand_more</MaterialIcon>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Số Lượng Nhập</label>
                    <input className="w-full rounded-lg border-none bg-surface-container-high px-4 py-4 text-on-surface transition-all focus:ring-2 focus:ring-primary/20" placeholder="0" type="number" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Đơn Giá Nhập (VNĐ)</label>
                    <div className="relative">
                      <input className="w-full rounded-lg border-none bg-surface-container-high px-4 py-4 text-on-surface transition-all focus:ring-2 focus:ring-primary/20" placeholder="100.000" type="text" />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-xs font-semibold text-on-surface-variant">₫</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Ghi Chú</label>
                    <textarea className="w-full resize-none rounded-lg border-none bg-surface-container-high px-4 py-4 text-on-surface transition-all focus:ring-2 focus:ring-primary/20" placeholder="Nhập lý do nhập kho hoặc thông tin vận chuyển..." rows="4" />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button className="rounded-lg px-8 py-3 font-semibold text-on-surface-variant transition-colors hover:bg-slate-100" type="button">
                    Hủy bỏ
                  </button>
                  <button className="rounded-lg bg-primary px-10 py-3 font-semibold text-on-primary shadow-md transition-all hover:bg-primary-dim" type="submit">
                    Hoàn tất nhập kho
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="w-full shrink-0 md:w-80">
            <div className="rounded-xl border border-outline bg-white/40 p-6 backdrop-blur-sm">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-lg font-bold text-on-surface">Lịch sử nhập kho</h3>
                <MaterialIcon className="text-xl text-primary">history</MaterialIcon>
              </div>
              <div className="space-y-6">
                <div className="group cursor-pointer">
                  <div className="mb-2 flex items-start gap-4">
                    <div className="h-14 w-10 shrink-0 overflow-hidden rounded-sm bg-slate-100 shadow-sm transition-transform group-hover:scale-105">
                      <img alt="Recent Book" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7L9d8QdDUhl7kOnf-EjzTXVWkCVp8YNGgbTX2WmC5TmcKP96i3vGmyqhJTMg4A1puSGCjxISABTzGodBklpxooDRlc0nXIXIlyXkLZFQKJWfENMPurZ06CHmQppDBB3_l6FEnHEPpcM_iiAyVTscEQ7TGNP7omuRPkqJOSI0bZrQE95FL5XcbZhPhm1H78J6Nupy5dcDRUlPyhac13HQ5i7UGVwmKGzt-wv4SS2uwG7WHTv7Ql4UmF8bQ5F_DNret8S_1-iKqSWI" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold leading-tight text-on-surface">Sherlock Holmes (Trọn bộ)</p>
                      <p className="mt-1 text-xs text-on-surface-variant">20 phút trước</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-primary-container/40 px-3 py-2">
                    <span className="text-xs font-semibold text-on-primary-container">+50 cuốn</span>
                    <span className="text-xs font-medium text-slate-500">12.500.000đ</span>
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full rounded-lg border border-primary/20 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/5" type="button">
                Xem tất cả báo cáo
              </button>
            </div>

            <div className="mt-8 rounded-xl border border-outline bg-white/40 p-6 backdrop-blur-sm">
              <h4 className="mb-4 text-sm font-bold text-on-surface">Tình trạng tồn kho</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-on-surface-variant">Hàng sắp hết</span>
                  <span className="rounded-full bg-error-container px-2 py-1 text-[10px] font-bold uppercase text-on-error-container">12 đầu sách</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-4/5 bg-error" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-on-surface-variant">Tổng giá trị kho</span>
                  <span className="text-sm font-bold text-on-surface">1.450.000.000đ</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

function OrdersPage() {
  return (
    <>
      <header className="sticky top-0 right-0 z-30 ml-64 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md font-['Inter'] text-sm">
        <div className="flex flex-1 items-center gap-4">
          <div className="group relative w-full max-w-md">
            <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600">search</MaterialIcon>
            <input className="w-full rounded-full border-none bg-slate-100 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20" placeholder="Tìm kiếm đơn hàng, mã số..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="scale-95 rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100/50 hover:text-blue-600 active:opacity-80" type="button">
            <MaterialIcon>notifications</MaterialIcon>
          </button>
          <button className="scale-95 rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100/50 hover:text-blue-600 active:opacity-80" type="button">
            <MaterialIcon>help_outline</MaterialIcon>
          </button>
          <div className="flex items-center gap-3 border-l border-slate-100">
            <div className="text-right">
              <p className="text-sm font-semibold text-on-surface">Lumina Admin</p>
              <p className="text-[10px] font-medium uppercase tracking-tight text-slate-500">NGƯỜI QUẢN LÝ</p>
            </div>
            <img alt="Lumina Admin" className="h-9 w-9 rounded-full border border-slate-200 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWFDUpTqu0vL7YgtTtTW3yxhAX3ZPlI3WAKaYXTuFoQnWO3Wa_2vkPGwxVW3jnuxWMt57FpFLJkhfWZ2JyNvzkB2MN4qo8Gvozr29yJec2Quto7VYBoNHbTz_5Hp2cROuz6UDVUfo9cc58dvVODby7tBnmr3r0XIBnKvKBuESOR_ZTVeiQURiwyqNQOvz2K-wD3csYdQEcxxOp_xbl5WCIAkqxhCIxcoqlSpJVxnxpetEoij7Sy2PC4vD8Er9o4FPfEp2yW3ypLUA" />
          </div>
        </div>
      </header>

      <main className="ml-64 min-h-screen bg-surface p-8">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary-dim p-8 shadow-lg md:col-span-8">
            <div className="relative z-10">
              <h2 className="mb-1 text-xs font-medium uppercase tracking-widest text-white/80">TỔNG QUAN HÔM NAY</h2>
              <p className="mb-6 text-4xl font-bold tracking-tight text-white">42 đơn hàng mới</p>
              <div className="flex gap-12">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white/60">Doanh thu</span>
                  <span className="text-lg font-bold text-white">12,450,000đ</span>
                </div>
              </div>
            </div>
            <div className="absolute -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/5 blur-3xl transition-transform duration-700 group-hover:scale-110 right-0 top-0" />
            <div className="absolute bottom-0 left-1/2 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl transition-transform duration-700 group-hover:-translate-y-8" />
          </div>
          <div className="flex flex-col justify-between rounded-lg border border-slate-100 bg-white p-8 shadow-sm md:col-span-4">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-lg bg-primary-container p-2 text-primary"><MaterialIcon>local_shipping</MaterialIcon></span>
                <span className="rounded-full bg-primary-container px-2 py-1 text-xs font-bold text-primary">+4.2%</span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant">Đang vận chuyển</p>
              <p className="mt-1 text-2xl font-bold">18 Đơn hàng</p>
            </div>
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[65%] rounded-full bg-primary" />
            </div>
          </div>
        </div>

        <div className="sticky top-[4.5rem] z-20 mb-6 flex flex-wrap items-center justify-between gap-4 bg-surface/95 py-2 backdrop-blur-sm">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {["Tất cả đơn", "Chờ xử lý", "Đang giao", "Hoàn thành", "Đã hủy"].map((label, index) => (
              <button key={label} className={`whitespace-nowrap rounded-full px-5 py-2 text-sm ${index === 0 ? "bg-primary font-semibold text-white shadow-md shadow-primary/20" : "border border-slate-200 bg-white font-medium text-on-surface-variant transition-colors hover:bg-slate-50"}`} type="button">
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant transition-all hover:border-primary/30 hover:shadow-sm" type="button">
              <MaterialIcon className="text-[20px]">filter_list</MaterialIcon>
              Lọc
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant transition-all hover:border-primary/30 hover:shadow-sm" type="button">
              <MaterialIcon className="text-[20px]">download</MaterialIcon>
              Xuất CSV
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {["Mã đơn hàng", "Khách hàng", "Tổng tiền", "Trạng thái", "Ngày đặt"].map((head, index) => (
                    <th key={head} className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ${index === 2 ? "text-right" : ""}`}>{head}</th>
                  ))}
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  ["#ORD-9921", "NP", "bg-amber-50 text-amber-600", "Nguyễn Nam Phương", "phuong.nn@email.com", "845,000đ", "Chờ xử lý", "bg-amber-50 text-amber-700 border-amber-100", "bg-amber-500", "15:30, 24/05/2024"],
                  ["#ORD-9918", "LT", "bg-blue-50 text-blue-600", "Lê Thanh Thảo", "thanhthao.le@email.com", "1,250,000đ", "Đang giao", "bg-blue-50 text-blue-700 border-blue-100", "bg-blue-500", "09:15, 24/05/2024"],
                  ["#ORD-9915", "VH", "bg-emerald-50 text-emerald-600", "Vũ Huy Hoàng", "hoangvu@email.com", "340,000đ", "Hoàn thành", "bg-emerald-50 text-emerald-700 border-emerald-100", "bg-emerald-500", "20:45, 23/05/2024"],
                  ["#ORD-9912", "TM", "bg-slate-100 text-slate-600", "Trần Minh Tâm", "minhtam@email.com", "520,000đ", "Đã hủy", "bg-red-50 text-red-700 border-red-100", "bg-red-500", "14:20, 23/05/2024"],
                  ["#ORD-9909", "KA", "bg-pink-50 text-pink-600", "Kiều Anh", "kieuanh.99@email.com", "2,100,000đ", "Hoàn thành", "bg-emerald-50 text-emerald-700 border-emerald-100", "bg-emerald-500", "11:00, 23/05/2024"],
                ].map(([id, initials, avatarWrap, name, email, total, status, badge, dot, date]) => (
                  <tr key={id} className="group transition-colors hover:bg-slate-50/30">
                    <td className="px-6 py-5"><span className="font-mono text-sm font-bold text-primary">{id}</span></td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ${avatarWrap}`}>{initials}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{name}</p>
                          <p className="text-[11px] font-medium text-slate-500">{email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-5 text-right text-sm font-bold ${status === "Đã hủy" ? "text-slate-400 line-through" : "text-slate-700"}`}>{total}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${badge}`}>
                        <span className={`mr-2 h-1.5 w-1.5 rounded-full ${dot}`} />
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-slate-500">{date}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-1.5 text-slate-400 transition-colors hover:text-primary" type="button">
                        <MaterialIcon className="text-[20px]">more_vert</MaterialIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Hiển thị 1 - 5 của 1,248 đơn hàng</p>
            <div className="flex items-center gap-1">
              <button className="rounded p-1 text-on-surface-variant transition-colors hover:bg-white disabled:opacity-30" disabled type="button">
                <MaterialIcon className="text-[20px]">chevron_left</MaterialIcon>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded bg-primary text-xs font-bold text-white" type="button">1</button>
              <button className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-on-surface-variant transition-colors hover:bg-white" type="button">2</button>
              <button className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-on-surface-variant transition-colors hover:bg-white" type="button">3</button>
              <span className="px-1 text-xs text-slate-400">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-on-surface-variant transition-colors hover:bg-white" type="button">25</button>
              <button className="rounded p-1 text-on-surface-variant transition-colors hover:bg-white" type="button">
                <MaterialIcon className="text-[20px]">chevron_right</MaterialIcon>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function UsersPage() {
  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50 font-['Inter'] antialiased tracking-tight dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-full flex-col">
          <div className="p-8">
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">Lumina Ledger</h1>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Hệ thống Quản lý Sách</p>
          </div>
          <nav className="flex flex-grow flex-col gap-1 px-4">
            {pages.map((item) => {
              const active = item.key === "users"
              return (
                <button
                  key={item.key}
                  className={`flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                    active
                      ? "rounded-lg bg-blue-50/50 font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                  }`}
                  type="button"
                  onClick={() => (window.location.hash = item.key)}
                >
                  <MaterialIcon fill={active}>{item.icon}</MaterialIcon>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <button className="flex items-center gap-3 px-4 py-2 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/10" type="button">
              <MaterialIcon>logout</MaterialIcon>
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 min-h-screen bg-surface">
        <header className="sticky top-0 right-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md font-['Inter'] text-sm dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
          <div className="flex flex-1 items-center gap-5">
            <div className="relative w-full max-w-md">
              <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</MaterialIcon>
              <input className="w-full rounded-full border-none bg-slate-100 py-1.5 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800" placeholder="Tìm kiếm người dùng..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="p-2 text-slate-500 transition-colors hover:text-blue-600" type="button">
              <MaterialIcon>notifications</MaterialIcon>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-5 dark:border-slate-700">
              <div className="text-right">
                <p className="text-sm font-semibold text-on-surface">Lumina Admin</p>
                <p className="text-[10px] font-medium uppercase tracking-tight text-slate-500">NGƯỜI QUẢN LÝ</p>
              </div>
              <img alt="Lumina Admin" className="h-9 w-9 rounded-full border border-slate-200 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWFDUpTqu0vL7YgtTtTW3yxhAX3ZPlI3WAKaYXTuFoQnWO3Wa_2vkPGwxVW3jnuxWMt57FpFLJkhfWZ2JyNvzkB2MN4qo8Gvozr29yJec2Quto7VYBoNHbTz_5Hp2cROuz6UDVUfo9cc58dvVODby7tBnmr3r0XIBnKvKBuESOR_ZTVeiQURiwyqNQOvz2K-wD3csYdQEcxxOp_xbl5WCIAkqxhCIxcoqlSpJVxnxpetEoij7Sy2PC4vD8Er9o4FPfEp2yW3ypLUA" />
            </div>
          </div>
        </header>

        <div className="px-10 pb-12 pt-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="mb-1 text-3xl font-extrabold tracking-tight text-on-surface">Người dùng</h2>
              <p className="text-sm text-on-surface-variant">Quản lý và phân quyền hệ thống thành viên của bạn.</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95" type="button" onClick={() => (window.location.hash = "user-create")}>
              <MaterialIcon className="text-lg">person_add</MaterialIcon>
              Thêm người dùng mới
            </button>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              ["group", "bg-blue-50 text-blue-600", "Tổng thành viên", "1,284", "text-green-600", "trending_up", "+12% tháng này"],
              ["verified", "bg-green-50 text-green-600", "Đang hoạt động", "1,102", "text-slate-400", "", "85.8% tỷ lệ tương tác"],
              ["shield_person", "bg-amber-50 text-amber-600", "Vai trò quản lý", "14", "text-slate-400", "", "Bao gồm Biên tập viên"],
              ["block", "bg-red-50 text-red-600", "Đã chặn", "32", "text-red-400", "warning", "Cần xem xét lại"],
            ].map(([icon, iconWrap, label, value, noteColor, noteIcon, note]) => (
              <div key={label} className="rounded-lg border border-slate-200/60 bg-surface-container-lowest p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${iconWrap}`}>
                    <MaterialIcon>{icon}</MaterialIcon>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
                </div>
                <p className="text-3xl font-bold text-on-surface">{value}</p>
                <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${noteColor}`}>
                  {noteIcon ? <MaterialIcon className="text-xs">{noteIcon}</MaterialIcon> : null}
                  {note}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-surface-container-lowest shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
              <div className="flex gap-2">
                <button className="rounded-lg border border-primary/20 bg-white px-4 py-1.5 text-sm font-semibold text-primary shadow-sm" type="button">Tất cả</button>
                <button className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100" type="button">Khách hàng</button>
                <button className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100" type="button">Nhân viên</button>
              </div>
              <button className="p-2 text-slate-400 transition-colors hover:text-on-surface" type="button">
                <MaterialIcon>filter_list</MaterialIcon>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/80">
                    {["Người dùng", "Email", "Vai trò", "Trạng thái"].map((head) => (
                      <th key={head} className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{head}</th>
                    ))}
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["Lê Thị Mai", "#USER-9283", "mai.le@example.com", "Biên tập viên", "bg-slate-100 text-slate-700", "Hoạt động", "text-green-600", "bg-green-500", false, "block", "https://lh3.googleusercontent.com/aida-public/AB6AXuDoh7f1CKXBibfJTY_Nsc39ihbI1BVBbmcbABu-1cJ3u-kXKxw-uQzsMg8kDjcLUR4cnLEt_PF-r_Q9Mmqzgdu--mSE3kWDOZa3BWIriaEVyA_M2h7N-ngZV7NrXmIs58FDmm21zXnCXWWD3Ys9RUUA-76J9J-izr2kve5FapUEU6Ds_BAzReQTbpsHFF9ExKTIt45Jp-kEOdiSGdlbse0arYu39j4EtTvLylRossTvMS7qW2eRnyC2heT5Hu5-Zqjq5wLpTPtmhTM"],
                    ["Nguyễn Văn An", "#USER-8172", "an.nguyen@email.com", "Khách hàng VIP", "bg-blue-50 text-blue-700", "Hoạt động", "text-green-600", "bg-green-500", false, "block", "https://lh3.googleusercontent.com/aida-public/AB6AXuDifI-z5Btg2tmAdXOGvJyhfqHQfAuYq5EXPXzV3pOCIeqUPiCBNds1spfWVZYjUPG0_NzE_Ghnl6fNHj4mb3zZf9mBLNmozEbNiafOExLqdJ0nzVtThHWly08UBsTj3uw024_HM6TeZgunpH8of08leflBG7v28x54w8FGTGrM0JudRExcjdvVC8CskwvjVO8ZCiMYimJSp40SIGw83iwE283j6ScvYptj5KiuOqETzTW6x9lMmuJu0gNdRCMfP5ODnOc50p7C72o"],
                    ["Phạm Minh Đức", "#USER-7721", "duc.pham@outlook.com", "Khách hàng", "bg-slate-100 text-slate-500", "Đã chặn", "text-red-500", "bg-red-500", true, "verified_user", "https://lh3.googleusercontent.com/aida-public/AB6AXuAGPr6phFAp502c8bEPiiYHU_8BffixFn4WnupFgYJw3ue2F-3Msru5khov-dbmkqG_HICa5DF_qgwsaDRdfb80hFjNmz6DwDsB1nrnQx0dF66Ces49tBTpJCTDsg2fCcVESJa9MVsqW_O-3q_d5yOA-WJZfAKSYvipO5ffhQcmtL2MQnXbxGn5LOyH-VQqW_Zc172_8uhN5-mcegZTUbJ4LrGtH6uSqV6XPh0hqo72q0EkHXOUr5Cw3Z6ejbLQnF7q6bJi29ctW2s"],
                    ["Trần Phương Thảo", "#USER-6652", "thao.tp@gmail.com", "Khách hàng", "bg-slate-100 text-slate-500", "Ngoại tuyến", "text-slate-400", "bg-slate-300", false, "block", "https://lh3.googleusercontent.com/aida-public/AB6AXuD6LL2HhwjEyoUFcJj9D1uqSTAgWxrdm3CnJi_Sr-VSwTQbmYFe3Qj1pktK49ZuuD5dfV-2ikpSxL62DENiL1Bz8AzUexsHwo2P7_4eDH4B8lylk8HhkcKbUUD9hWGnumHB8fYdimS3XKicEFmb42cAYXxX2vmfkPnZswFfDMrv4c0FmkZ0QcHNZ0d0n6syzsNhj0O2hEffxoDvvB04VUhR8x0Z9dsss6RybUphxsz2bRibaHpu6KDMVQ4x41Ay4P2NimOu6wwYBms"],
                  ].map(([name, id, email, role, roleClass, status, statusClass, dotClass, muted, actionIcon, avatar]) => (
                    <tr key={id} className="group transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 overflow-hidden rounded-full bg-slate-100 ${muted ? "grayscale opacity-70" : ""}`}>
                            <img alt="User Avatar" className="h-full w-full object-cover" src={avatar} />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${muted ? "text-slate-400 line-through" : "text-on-surface"}`}>{name}</p>
                            <p className="text-[11px] text-slate-400">ID: {id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${muted ? "text-slate-400" : "text-on-surface-variant"}`}>{email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleClass}`}>{role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${statusClass}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary" type="button" title="Chỉnh sửa" onClick={() => (window.location.hash = "user-edit")}>
                            <MaterialIcon className="text-lg">edit</MaterialIcon>
                          </button>
                          <button className={`rounded-lg p-2 transition-colors ${actionIcon === "verified_user" ? "text-primary hover:bg-blue-50 hover:opacity-80" : "text-slate-400 hover:bg-red-50 hover:text-error"}`} type="button" title={actionIcon === "verified_user" ? "Bỏ chặn" : "Chặn"}>
                            <MaterialIcon className="text-lg">{actionIcon}</MaterialIcon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 p-6">
              <p className="text-xs font-medium text-slate-400">Đang hiển thị 1-10 trên tổng số 1,284 người dùng</p>
              <div className="flex gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50" type="button">
                  <MaterialIcon className="text-sm">chevron_left</MaterialIcon>
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary bg-primary text-xs font-bold text-on-primary" type="button">1</button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium transition-colors hover:bg-slate-50" type="button">2</button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium transition-colors hover:bg-slate-50" type="button">3</button>
                <span className="flex items-end px-1 text-slate-400">...</span>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium transition-colors hover:bg-slate-50" type="button">128</button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50" type="button">
                  <MaterialIcon className="text-sm">chevron_right</MaterialIcon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function UserCreatePage() {
  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-full flex-col space-y-2 p-4">
          <div className="mb-4 px-4 py-6">
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">Lumina Ledger</h1>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-500">The Literary Curator</p>
          </div>
          <nav className="flex-1 space-y-1">
            {pages.map((item) => {
              const active = item.key === "users"
              return (
                <button
                  key={item.key}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                    active
                      ? "scale-95 rounded-lg bg-blue-50/50 font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                  }`}
                  type="button"
                  onClick={() => (window.location.hash = item.key)}
                >
                  <MaterialIcon fill={active}>{item.icon}</MaterialIcon>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="mt-auto pt-6">
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 dark:border-slate-800/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">QT</div>
                <div className="overflow-hidden">
                  <p className="truncate text-xs font-bold">Quản Trị Viên</p>
                  <p className="truncate text-[10px] text-slate-500">admin@curator.vn</p>
                </div>
              </div>
            </div>
            <button className="mt-2 flex items-center gap-3 px-4 py-2 text-sm text-slate-600 transition-colors hover:text-red-500 dark:text-slate-400" type="button">
              <MaterialIcon>logout</MaterialIcon>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 right-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative w-full max-w-md rounded-full focus-within:ring-2 focus-within:ring-blue-500/20">
              <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</MaterialIcon>
              <input className="w-full rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 text-sm transition-all focus:ring-0" placeholder="Tìm kiếm hệ thống..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="relative rounded-full p-2 text-slate-500 transition-colors hover:text-blue-500" type="button">
                <MaterialIcon>notifications</MaterialIcon>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-error dark:border-slate-900" />
              </button>
              <button className="rounded-full p-2 text-slate-500 transition-colors hover:text-blue-500" type="button">
                <MaterialIcon>mail</MaterialIcon>
              </button>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Lumina Admin</span>
              <img alt="Lumina Admin" className="h-8 w-8 rounded-full border border-slate-200 shadow-sm dark:border-slate-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0aY4XooFQUezZxyjaqu0W5Uvi05-gnO_AkeMR1dKesnhfqPR5u4U4I94exRvKL38J0IJAABtATHsjERfs9YboEDfosQsBy2tdBMv8G-MigC0Itj5KlqIEyfe3jFm8_lpuIM04x7aJUK0KGuHT5VFKzRSlb1Cj2-vz8iIIjywCFNKDxy_lM3Vm8iGK5DJQ0MT6WNS8XlSPFWsW05tnE8MtkgEHZLFKRnvJ-4shPDxvAln88-_w_AV9C8xbOjSx_psHRCbas_4KSPo" />
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl p-8 lg:p-12">
          <div className="mb-10">
            <nav className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <button className="flex items-center gap-1 transition-colors hover:text-primary" type="button" onClick={() => (window.location.hash = "reports")}>
                <MaterialIcon className="text-sm">analytics</MaterialIcon>
                Báo cáo
              </button>
              <span>/</span>
              <button className="transition-colors hover:text-primary" type="button" onClick={() => (window.location.hash = "users")}>Quản lý người dùng</button>
              <span>/</span>
              <span className="text-on-surface-variant">Thêm nhân sự mới</span>
            </nav>
            <h2 className="mb-2 text-4xl font-bold tracking-tight text-on-surface">Tạo Tài Khoản Nhân Viên</h2>
            <p className="max-w-2xl leading-relaxed text-on-surface-variant">Điền thông tin chi tiết để cấp quyền truy cập hệ thống cho thành viên mới. Đảm bảo vai trò được phân bổ chính xác theo chức năng nhiệm vụ.</p>
          </div>

          <form className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="rounded-xl border border-slate-200/40 bg-surface-container-lowest p-8 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <MaterialIcon className="text-primary">person</MaterialIcon>
                  Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Họ và Tên</label>
                    <input className="w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="Nguyễn Văn A" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Số điện thoại</label>
                    <input className="w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="090 123 4567" type="tel" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email công việc</label>
                    <input className="w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="username@literarycurator.vn" type="email" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/40 bg-surface-container-lowest p-8 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <MaterialIcon className="text-primary">lock</MaterialIcon>
                  Bảo mật & Truy cập
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Mật khẩu khởi tạo</label>
                    <div className="relative">
                      <input className="w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="••••••••" type="password" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" type="button">
                        <MaterialIcon className="text-sm">visibility</MaterialIcon>
                      </button>
                    </div>
                    <p className="mt-1 text-[10px] italic text-slate-400">Lưu ý: Nhân viên sẽ được yêu cầu đổi mật khẩu trong lần đăng nhập đầu tiên.</p>
                  </div>
                  <div className="flex items-start gap-4 rounded-lg bg-primary-container/30 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                      <MaterialIcon className="text-primary" fill>verified_user</MaterialIcon>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-primary-container">Xác thực hai yếu tố (2FA)</h4>
                      <p className="mt-1 text-xs leading-relaxed text-on-primary-container/70">Hệ thống sẽ tự động gửi yêu cầu thiết lập xác thực qua ứng dụng Authenticator sau khi tài khoản được kích hoạt.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-4">
              <div className="rounded-xl border border-slate-200/40 bg-surface-container-lowest p-6 shadow-sm">
                <label className="mb-4 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Vai trò hệ thống</label>
                <div className="space-y-3">
                  {[
                    ["admin", "Admin", "Toàn quyền hệ thống", false],
                    ["manager", "Quản lý (Manager)", "Quản lý kho và đơn hàng", true],
                    ["staff", "Nhân viên (Staff)", "Cập nhật dữ liệu & Bán hàng", false],
                  ].map(([value, title, desc, checked]) => (
                    <label key={value} className="group flex cursor-pointer items-center rounded-lg border-2 border-transparent bg-surface-container-low p-3 transition-all hover:bg-slate-100 has-[:checked]:border-primary/50 has-[:checked]:bg-primary-container/20">
                      <input className="hidden" defaultChecked={checked} name="role" type="radio" value={value} />
                      <div className="flex-1">
                        <div className="text-sm font-bold group-has-[:checked]:text-primary">{title}</div>
                        <div className="text-[10px] text-slate-500">{desc}</div>
                      </div>
                      <MaterialIcon className={checked ? "text-primary" : "text-slate-300"}>check_circle</MaterialIcon>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/40 bg-surface-container-lowest p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-on-surface">Trạng thái hoạt động</label>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input defaultChecked className="peer sr-only" type="checkbox" />
                    <div className="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-primary peer-checked:after:translate-x-full after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-['']" />
                  </label>
                </div>
                <p className="mt-2 text-[10px] text-slate-500">Tài khoản sẽ được phép đăng nhập ngay sau khi tạo nếu được kích hoạt.</p>
              </div>

              <div className="group relative h-48 overflow-hidden rounded-xl bg-slate-900 shadow-lg">
                <img alt="Bookstore Interior" className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4Yy-HbldWDEZC2Q7V0EsWG4OvvW4mCEtMcvtxz0V94UQuLxu0Da7VqDyxBBuKDrwefkxMU7szWy_PujIFfkAuWuUHhBfrYYl3L_p6UGODzfmsgbPmN1N61DlokKjP1j1ybKnR_sA-SFNaoBxa3F_L5yz0AM2DvTKLs8zED0nEbOAlIUkm_dC4JJ5rO-lEw-UfOv8VDcQalrslyX1SWk2k7DSUvQA-s08OkGu80PKBRX-F5GPtCbLEKRSC5J9KbnhSzg-8MNbBwn8" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-900 to-transparent p-6">
                  <p className="text-lg font-bold italic leading-tight text-white">"Sách là nguồn tri thức vô tận của nhân loại."</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" type="submit">
                  <MaterialIcon className="text-sm">person_add</MaterialIcon>
                  Xác nhận thêm nhân sự
                </button>
                <button className="w-full rounded-lg bg-transparent py-3 font-medium text-on-surface-variant transition-all hover:bg-slate-200/50" type="button" onClick={() => (window.location.hash = "users")}>
                  Hủy bỏ
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}

function UserEditPage() {
  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex h-screen w-64 flex-col overflow-hidden border-r border-slate-200 bg-slate-50 px-4 py-8">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-bold tracking-tighter text-slate-900">Lumina Ledger</h1>
          <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-wider text-slate-500">The Literary Curator</p>
        </div>
        <nav className="no-scrollbar flex-grow space-y-1 overflow-y-auto">
          {pages.map((item) => {
            const active = item.key === "users"
            return (
              <button
                key={item.key}
                className={`group flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
                  active ? "bg-blue-50/50 font-semibold text-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                type="button"
                onClick={() => (window.location.hash = item.key)}
              >
                <MaterialIcon fill={active}>{item.icon}</MaterialIcon>
                <span className="text-[0.75rem] font-semibold uppercase">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-slate-200 pt-4">
          <button className="group flex items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-red-600" type="button">
            <MaterialIcon>logout</MaterialIcon>
            <span className="text-[0.75rem] font-semibold uppercase">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="relative ml-64 flex min-h-screen flex-grow flex-col overflow-x-hidden">
        <header className="sticky top-0 right-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md">
          <div className="flex max-w-md flex-grow items-center gap-4">
            <div className="relative w-full rounded-full transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
              <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</MaterialIcon>
              <input className="w-full rounded-full border-none bg-slate-50 py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:ring-0" placeholder="Tìm kiếm người dùng..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center text-slate-500 transition-colors hover:text-blue-500" type="button">
              <MaterialIcon>notifications</MaterialIcon>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
              <div className="text-right">
                <p className="text-[0.75rem] font-bold leading-none text-slate-900">Quản trị viên</p>
                <p className="mt-1 text-[0.65rem] text-slate-500">Lumina Ledger Team</p>
              </div>
              <img alt="Lumina Admin" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG1scEsERKE4MT0CBZXBhOXgzoLgAiYHRhehnc7m9_QzmVAiK_JSIN0tIpxncc31E3Bqp3_tU8J6n4YR6s5uA2wgoX8DdfiVL4pBL1WzsQDP5bogRL9603jXAeOxu610E8tYPdOs42at-N4ZxkNaL_IzDrWuihiAHNHoVAVGf7suC13pPz4HnkVG9xvEhsS9ev0U1aS5canPRkSUQou69YXcW9dXa3NoRa8Knhxap2q2iW_sk7Pi_6huK0gZRWpdpAowYTdZPfbUE" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl p-10">
          <nav className="mb-6 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            <button className="transition-colors hover:text-primary" type="button" onClick={() => (window.location.hash = "users")}>Nhân viên</button>
            <MaterialIcon className="text-[10px]">chevron_right</MaterialIcon>
            <span className="text-slate-900">Chỉnh sửa người dùng</span>
          </nav>

          <div className="mb-10">
            <h2 className="text-[2rem] font-bold tracking-tight text-slate-900">Cập nhật thông tin</h2>
            <p className="mt-1 text-slate-500">Cập nhật hồ sơ cá nhân và phân quyền truy cập cho nhân viên.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <div className="editorial-shadow flex flex-col items-center rounded-xl bg-white p-8 text-center">
                <div className="group relative mb-6 cursor-pointer">
                  <img alt="Nguyễn Văn An profile" className="h-32 w-32 rounded-full border-4 border-slate-50 object-cover shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp59nhnnImmcB0kpKsGmejCus0rEk7RZrO8MfSAWFs3TZzyU_Nc-e387b6IQ9vS_bE2IMXCvuKYpOijUiVtbf0bBv2MibcmpD7Ra7jMbEm8jq_hgYvf6mjDM0wknU0dBrSXS_mk8OafM90g3q31t8D0X-aNa7vf7_1l0_2JIS0CaIK1J36tUsoNWJMeND-781UHnVucEZMcPuELGJ1vPrjli6NSRMx-Aek5QpRdqo8KyGW95W7biR9Ds_aTC5jJ3Dpj0I1dZOhSSE" />
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <MaterialIcon className="text-white">photo_camera</MaterialIcon>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Nguyễn Văn An</h3>
                <p className="mb-4 text-sm text-slate-500">Mã NV: CUR-8842</p>
                <div className="rounded-full bg-blue-50 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-blue-600">Quản lý</div>
              </div>

              <div className="editorial-shadow rounded-xl bg-white p-6">
                <h4 className="mb-4 text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Lịch sử hoạt động</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Đăng nhập thành công</p>
                      <p className="text-[0.7rem] text-slate-500">10:45 AM - Hôm nay</p>
                    </div>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-300" />
                    <div>
                      <p className="font-semibold text-slate-900">Cập nhật kho sách</p>
                      <p className="text-[0.7rem] text-slate-500">03:20 PM - Hôm qua</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-8">
              <div className="editorial-shadow rounded-xl bg-white p-8">
                <form className="space-y-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <label className="mb-3 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Họ tên</label>
                      <input className="w-full rounded-lg border-none bg-slate-50 px-5 py-3 font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-600/20" defaultValue="Nguyễn Văn An" type="text" />
                    </div>
                    <div>
                      <label className="mb-3 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Email</label>
                      <input className="w-full rounded-lg border-none bg-slate-50 px-5 py-3 font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-600/20" defaultValue="an.nguyen@thecurator.vn" type="email" />
                    </div>
                    <div>
                      <label className="mb-3 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Vai trò</label>
                      <div className="relative">
                        <select className="w-full appearance-none rounded-lg border-none bg-slate-50 px-5 py-3 font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-600/20" defaultValue="manager">
                          <option value="admin">Admin</option>
                          <option value="manager">Quản lý</option>
                          <option value="staff">Nhân viên</option>
                        </select>
                        <MaterialIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">expand_more</MaterialIcon>
                      </div>
                    </div>
                    <div>
                      <label className="mb-3 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Trạng thái</label>
                      <div className="flex h-[48px] gap-2 rounded-lg bg-slate-50 p-1">
                        <label className="flex flex-1 cursor-pointer items-center justify-center rounded-md transition-all has-[:checked]:bg-white has-[:checked]:shadow-sm">
                          <input defaultChecked className="hidden" name="status" type="radio" value="active" />
                          <span className="text-[0.75rem] font-bold text-slate-700">Hoạt động</span>
                        </label>
                        <label className="flex flex-1 cursor-pointer items-center justify-center rounded-md transition-all has-[:checked]:bg-white has-[:checked]:shadow-sm">
                          <input className="hidden" name="status" type="radio" value="locked" />
                          <span className="text-[0.75rem] font-bold text-slate-700">Khóa</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <label className="mb-5 block text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">Quyền hạn truy cập</label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {[
                        ["Quản lý kho", true],
                        ["Xử lý đơn hàng", true],
                        ["Báo cáo doanh thu", false],
                      ].map(([label, checked]) => (
                        <label key={label} className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-slate-50 p-4 transition-all hover:border-slate-200">
                          <input defaultChecked={checked} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                          <span className="text-[0.875rem] font-semibold text-slate-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-8">
                    <button className="rounded-lg px-8 py-3.5 text-[0.875rem] font-bold text-slate-500 transition-all hover:bg-slate-50" type="button" onClick={() => (window.location.hash = "users")}>
                      Hủy bỏ
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-10 py-3.5 text-[0.875rem] font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-[0.98]" type="submit">
                      <MaterialIcon className="text-lg">save</MaterialIcon>
                      Lưu cập nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function ReviewsPage() {
  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex h-screen w-64 flex-col overflow-y-auto border-r border-slate-200 bg-slate-50 px-4 py-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">Lumina Ledger</h1>
          <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-wider text-slate-500">The Literary Curator</p>
        </div>
        <nav className="flex-1 space-y-1">
          {pages.map((item) => {
            const active = item.key === "reviews"
            return (
              <button
                key={item.key}
                className={`group flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
                  active
                    ? "bg-blue-50/50 font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                }`}
                type="button"
                onClick={() => (window.location.hash = item.key)}
              >
                <MaterialIcon fill={active}>{item.icon}</MaterialIcon>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-slate-200 pt-4 dark:border-slate-800">
          <button className="group flex items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200" type="button">
            <MaterialIcon>logout</MaterialIcon>
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <header className="sticky top-0 right-0 z-30 ml-64 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
        <div className="group flex w-96 items-center rounded-full bg-slate-100 px-4 py-1.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 dark:bg-slate-800">
          <MaterialIcon className="mr-2 text-xl text-slate-400">search</MaterialIcon>
          <input className="w-full border-none bg-transparent text-sm text-on-surface focus:ring-0" placeholder="Tìm kiếm đánh giá hoặc tên sách..." type="text" />
        </div>
        <div className="flex items-center gap-5">
          <button className="relative text-slate-500 transition-colors hover:text-blue-600" type="button">
            <MaterialIcon>notifications</MaterialIcon>
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-error dark:border-slate-900" />
          </button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-5 dark:border-slate-800">
            <div className="text-right">
              <p className="text-sm font-semibold text-on-surface">Lumina Admin</p>
              <p className="text-[10px] font-medium uppercase tracking-tight text-slate-500">NGƯỜI QUẢN LÝ</p>
            </div>
            <img alt="Lumina Admin" className="h-9 w-9 rounded-full border border-slate-200 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWFDUpTqu0vL7YgtTtTW3yxhAX3ZPlI3WAKaYXTuFoQnWO3Wa_2vkPGwxVW3jnuxWMt57FpFLJkhfWZ2JyNvzkB2MN4qo8Gvozr29yJec2Quto7VYBoNHbTz_5Hp2cROuz6UDVUfo9cc58dvVODby7tBnmr3r0XIBnKvKBuESOR_ZTVeiQURiwyqNQOvz2K-wD3csYdQEcxxOp_xbl5WCIAkqxhCIxcoqlSpJVxnxpetEoij7Sy2PC4vD8Er9o4FPfEp2yW3ypLUA" />
          </div>
        </div>
      </header>

      <main className="ml-64 min-h-screen bg-surface-container-low p-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-on-surface">Quản lý Đánh giá</h2>
            <nav className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
              <span>Trang chủ</span>
              <MaterialIcon className="text-sm">chevron_right</MaterialIcon>
              <span className="text-primary">Đánh giá khách hàng</span>
            </nav>
          </div>
          <div className="flex gap-4">
            <div className="flex rounded-lg border border-slate-100 bg-surface-container-lowest p-1 shadow-sm">
              <button className="rounded-md bg-blue-50 px-4 py-2 text-sm font-semibold text-primary" type="button">Tất cả</button>
              <button className="px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface" type="button">Chờ duyệt</button>
              <button className="px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface" type="button">Tiêu cực</button>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]" type="button">
              <MaterialIcon className="text-lg">filter_list</MaterialIcon>
              Bộ lọc nâng cao
            </button>
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-surface-container-lowest p-6 shadow-sm">
            <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant">Trung bình sao</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-on-surface">4.8</span>
              <div className="flex text-yellow-500">
                <MaterialIcon className="text-sm" fill>star</MaterialIcon>
                <MaterialIcon className="text-sm" fill>star</MaterialIcon>
                <MaterialIcon className="text-sm" fill>star</MaterialIcon>
                <MaterialIcon className="text-sm" fill>star</MaterialIcon>
                <MaterialIcon className="text-sm">star_half</MaterialIcon>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-surface-container-lowest p-6 shadow-sm">
            <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant">Tổng đánh giá</p>
            <p className="text-4xl font-bold text-on-surface">1,284</p>
          </div>
          <div className="rounded-lg border-l-4 border-error bg-surface-container-lowest p-6 shadow-sm">
            <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant">Chờ duyệt</p>
            <p className="text-4xl font-bold text-error">12</p>
          </div>
          <div className="rounded-lg border-l-4 border-primary bg-surface-container-lowest p-6 shadow-sm">
            <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant">Tỷ lệ phản hồi</p>
            <p className="text-4xl font-bold text-primary">94%</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative grid grid-cols-12 items-start gap-8 rounded-lg border border-slate-50 bg-surface-container-lowest p-8 shadow-sm">
            <div className="col-span-3">
              <div className="mb-4 flex gap-4">
                <img alt="Bìa sách Muôn Kiếp Nhân Sinh" className="h-28 w-20 rounded object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfPO8FfPoPBZ3R1wAetU4HcsAlCLrAq3H7AlMkBZmx5QqK5y21_QET8V8gQmJ6i08l99cyfLHhEh0ONuMxLDCOrZj0TIryhiP_bIOW5dv1rv4sUfgtTXrEVf-ArCkMt5FdHeR8JqW916v4yVhfOL4eZyp8nRM53QUGRkQpUINlDfpfYfMyaMMaKKpJDPehSHoLMlH3O4aXeQQMWKkDztm0GB7L_mIOGoIQqUz6THlURQynCe-xYjlD1G8KEwqdvXfkZcb0Ih-WLVg" />
                <div className="flex flex-col justify-center">
                  <h4 className="mb-1 text-base font-bold leading-tight">Muôn Kiếp Nhân Sinh</h4>
                  <p className="text-xs text-on-surface-variant">Nguyên Phong</p>
                  <span className="mt-2 self-start rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Triết học</span>
                </div>
              </div>
              <div className="mb-2 flex items-center gap-1 text-yellow-500">
                <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                <MaterialIcon className="text-lg" fill>star</MaterialIcon>
              </div>
            </div>
            <div className="col-span-7 border-l border-slate-100 pl-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-sm font-bold text-on-surface">Trần Minh Quân</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-xs text-on-surface-variant">2 giờ trước</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-on-surface">
                "Một cuốn sách thực sự khai sáng. Nội dung sâu sắc, cách trình bày của Lumina Ledger rất tinh tế, chất lượng giấy in và đóng gói cực kỳ cẩn thận. Tôi rất hài lòng với dịch vụ lần này."
              </p>
              <div className="flex gap-3">
                <span className="rounded bg-slate-100 px-3 py-1 text-[0.65rem] font-bold uppercase text-on-surface-variant">Đã mua hàng</span>
                <span className="flex items-center gap-1 rounded bg-green-50 px-3 py-1 text-[0.65rem] font-bold uppercase text-green-700">
                  <MaterialIcon className="text-[12px]">check_circle</MaterialIcon>
                  Đã duyệt
                </span>
              </div>
            </div>
            <div className="col-span-2 flex flex-col items-end gap-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700" type="button">
                <MaterialIcon className="text-sm">reply</MaterialIcon>
                Phản hồi
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-slate-50" type="button">
                <MaterialIcon className="text-sm">more_horiz</MaterialIcon>
                Chi tiết
              </button>
            </div>
          </div>

          <div className="relative grid grid-cols-12 items-start gap-8 overflow-hidden rounded-lg border border-slate-50 bg-surface-container-lowest p-8 shadow-sm">
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-error" />
            <div className="col-span-3">
              <div className="mb-4 flex gap-4">
                <img alt="Bìa sách Tư Duy Nhanh và Chậm" className="h-28 w-20 rounded object-cover opacity-80 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwQRwOYxoFgGjfuEkvcxDUOtsdz9C-gdWRerbWSx6B-4yYdmnQl4RIb0BfH7YHJeBCRceNpZ55-sTSXPSLjJcYrtnzR4boLTACUiWh9HAWuiBR_ycyrc5g9yc-hId1xKCK4BjAy8x3C8Q6m4ZjHwd-PkqZuq-y2od0jsQ7sIKp53W_B-HqElQHRb98nEWQLsqjIqWG7F3cna3tu6eI6QNTc5EvdZCqZ2wica9AvS11SsKdr05clkVBIm3HfTJoFZmU6eCWuSh6kRk" />
                <div className="flex flex-col justify-center">
                  <h4 className="mb-1 text-base font-bold leading-tight">Tư Duy Nhanh và Chậm</h4>
                  <p className="text-xs text-on-surface-variant">Daniel Kahneman</p>
                  <span className="mt-2 self-start rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-600">Kinh tế</span>
                </div>
              </div>
              <div className="mb-2 flex items-center gap-1 text-yellow-500">
                <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                <MaterialIcon className="text-lg">star</MaterialIcon>
                <MaterialIcon className="text-lg">star</MaterialIcon>
              </div>
            </div>
            <div className="col-span-7 border-l border-slate-100 pl-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-sm font-bold text-on-surface">Lê Hoàng Anh</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-xs text-on-surface-variant">1 ngày trước</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-on-surface">
                "Sách bị móp góc một chút khi giao đến. Nội dung thì không có gì bàn cãi nhưng khâu vận chuyển cần cải thiện hơn. Mong shop phản hồi về trường hợp này."
              </p>
              <div className="flex gap-3">
                <span className="flex items-center gap-1 rounded bg-error-container px-3 py-1 text-[0.65rem] font-bold uppercase text-on-error-container">
                  <MaterialIcon className="text-[12px]">schedule</MaterialIcon>
                  Chờ duyệt
                </span>
                <span className="rounded bg-slate-100 px-3 py-1 text-[0.65rem] font-bold uppercase text-error">Cần hỗ trợ</span>
              </div>
            </div>
            <div className="col-span-2 flex flex-col items-end gap-3">
              <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700" type="button">
                Duyệt ngay
              </button>
              <button className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-slate-200" type="button">
                Phản hồi
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/20 bg-surface-container-lowest p-8 shadow-sm ring-1 ring-blue-500/5">
            <div className="mb-8 grid grid-cols-12 items-start gap-8">
              <div className="col-span-3">
                <div className="mb-4 flex gap-4">
                  <img alt="Bìa sách Nhà Giả Kim" className="h-28 w-20 rounded object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU6fBPhJmSIWdpoYQ0Wlr5PvvqT83JuG35KAnoyoZPPMQpLjb7A6doQ6qWflmwptULqYvbDoMHiPzq8la9VdEXCb6ObjIH34q7PbiiLz-lCgchxLo0JmIM5uIRlapEyDh20500Ln6Sofy-MhukMndcgjpTfmX9_dTbecIWDO97pttODU_nYvgQyuHM76C32Wo6_DP_dvLKh4p7wLavDHfRLNNzoWYNxD9VDO2IWT2xOUp8RSP0ED1tmQd9jtzme4wnyTLLwfiSpFk" />
                  <div className="flex flex-col justify-center">
                    <h4 className="mb-1 text-base font-bold leading-tight">Nhà Giả Kim</h4>
                    <p className="text-xs text-on-surface-variant">Paulo Coelho</p>
                    <span className="mt-2 self-start rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-on-surface-variant">Văn học</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                  <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                  <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                  <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                  <MaterialIcon className="text-lg" fill>star</MaterialIcon>
                </div>
              </div>
              <div className="col-span-7 border-l border-slate-100 pl-8">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-sm font-bold text-on-surface">Nguyễn Thu Thủy</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-xs text-on-surface-variant">5 giờ trước</span>
                </div>
                <p className="text-sm leading-relaxed text-on-surface">
                  "Giao hàng cực nhanh, đặt sáng chiều đã có. Đóng gói rất xịn xò, có cả bookmark tặng kèm. Rất thích cách Lumina Ledger chăm chút cho từng đơn hàng."
                </p>
              </div>
              <div className="col-span-2 flex justify-end">
                <button className="p-2 text-on-surface-variant transition-colors hover:text-primary" type="button">
                  <MaterialIcon>close</MaterialIcon>
                </button>
              </div>
            </div>

            <div className="ml-12 rounded-lg border border-slate-100 bg-slate-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  <MaterialIcon className="text-sm" fill>shield_person</MaterialIcon>
                </div>
                <span className="text-xs font-bold uppercase tracking-tight text-on-surface">Phản hồi từ Lumina Ledger</span>
              </div>
              <textarea className="min-h-[100px] w-full rounded-lg border border-slate-200 p-4 text-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Nhập nội dung phản hồi của bạn..." />
              <div className="mt-4 flex justify-end gap-3">
                <button className="rounded-lg px-6 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-slate-200" type="button">Hủy bỏ</button>
                <button className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700" type="button">Gửi phản hồi</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between rounded-lg border border-slate-50 bg-surface-container-lowest px-8 py-4 shadow-sm">
          <span className="text-xs font-medium text-on-surface-variant">Hiển thị 1-10 trên 1,284 đánh giá</span>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-on-surface-variant transition-colors hover:bg-slate-50" type="button">
              <MaterialIcon>chevron_left</MaterialIcon>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white" type="button">1</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-sm font-bold text-on-surface-variant transition-colors hover:bg-slate-50" type="button">2</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-sm font-bold text-on-surface-variant transition-colors hover:bg-slate-50" type="button">3</button>
            <span className="flex items-end px-2 text-on-surface-variant">...</span>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-sm font-bold text-on-surface-variant transition-colors hover:bg-slate-50" type="button">128</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-on-surface-variant transition-colors hover:bg-slate-50" type="button">
              <MaterialIcon>chevron_right</MaterialIcon>
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

function CouponsPage() {
  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50 px-4 py-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <MaterialIcon>menu_book</MaterialIcon>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">Lumina Ledger</h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">The Literary Curator</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {pages.map((item) => {
            const active = item.key === "coupons"
            return (
              <button
                key={item.key}
                className={`group flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-all active:scale-95 active:opacity-80 ${
                  active
                    ? "bg-blue-50/50 font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                type="button"
                onClick={() => (window.location.hash = item.key)}
              >
                <MaterialIcon fill={active}>{item.icon}</MaterialIcon>
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-slate-200 pt-6 dark:border-slate-800">
          <button className="flex w-full items-center gap-3 px-4 py-2 text-slate-600 transition-all hover:text-error active:scale-95 dark:text-slate-400" type="button">
            <MaterialIcon>logout</MaterialIcon>
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <header className="sticky top-0 right-0 z-30 ml-64 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
        <div className="flex max-w-xl flex-1 items-center">
          <div className="relative w-full rounded-full transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
            <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</MaterialIcon>
            <input className="w-full rounded-full border-none bg-slate-100 py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:ring-0 dark:bg-slate-800" placeholder="Tìm kiếm mã giảm giá..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button className="relative text-slate-500 transition-colors hover:text-blue-600" type="button">
            <MaterialIcon>notifications</MaterialIcon>
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-red-500 dark:border-slate-900" />
          </button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-5 dark:border-slate-700">
            <div className="text-right">
              <p className="text-sm font-semibold text-on-surface">Lumina Admin</p>
              <p className="text-[10px] font-medium uppercase tracking-tight text-slate-500">NGƯỜI QUẢN LÝ</p>
            </div>
            <img alt="Lumina Admin" className="h-9 w-9 rounded-full border border-slate-200 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWFDUpTqu0vL7YgtTtTW3yxhAX3ZPlI3WAKaYXTuFoQnWO3Wa_2vkPGwxVW3jnuxWMt57FpFLJkhfWZ2JyNvzkB2MN4qo8Gvozr29yJec2Quto7VYBoNHbTz_5Hp2cROuz6UDVUfo9cc58dvVODby7tBnmr3r0XIBnKvKBuESOR_ZTVeiQURiwyqNQOvz2K-wD3csYdQEcxxOp_xbl5WCIAkqxhCIxcoqlSpJVxnxpetEoij7Sy2PC4vD8Er9o4FPfEp2yW3ypLUA" />
          </div>
        </div>
      </header>

      <main className="ml-64 px-8 pb-8 pt-12">
        <div className="mb-12 flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-[2.75rem] font-bold leading-none tracking-tight">Quản lý Mã giảm giá</h2>
            <p className="max-w-lg text-on-surface-variant">Tạo và quản lý các chương trình khuyến mãi để thúc đẩy doanh số và gắn kết với độc giả của bạn.</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary shadow-md transition-all hover:brightness-110 active:scale-95" type="button" onClick={() => (window.location.hash = "coupon-create")}>
            <MaterialIcon>add</MaterialIcon>
            <span>Tạo mã mới</span>
          </button>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="flex flex-col justify-between rounded-lg border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
            <span className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Đang hoạt động</span>
            <div className="mt-4">
              <span className="text-3xl font-bold">12</span>
              <span className="ml-2 text-xs font-semibold text-primary">+2 trong tuần này</span>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-lg border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
            <span className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Lượt sử dụng</span>
            <div className="mt-4">
              <span className="text-3xl font-bold">1,248</span>
              <span className="ml-2 text-xs font-semibold text-primary">↑ 12%</span>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-lg border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
            <span className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant">Tổng giảm giá</span>
            <div className="mt-4">
              <span className="text-3xl font-bold">45.2M</span>
              <span className="ml-1 text-xs font-semibold text-on-surface-variant">VNĐ</span>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-lg border-l-4 border-primary bg-surface-container-lowest p-6 shadow-sm">
            <span className="text-[0.75rem] font-bold uppercase tracking-wider text-primary">Hiệu quả nhất</span>
            <div className="mt-4">
              <span className="text-xl font-bold">BOOKWEEK24</span>
              <p className="text-xs text-on-surface-variant">412 lượt sử dụng</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Danh sách mã hiện có</h3>
            <div className="flex gap-2">
              <button className="rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold transition-colors hover:bg-primary hover:text-on-primary dark:bg-slate-800" type="button">Tất cả</button>
              <button className="rounded-full border border-slate-100 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm transition-colors hover:bg-primary hover:text-on-primary dark:border-slate-800 dark:bg-slate-900" type="button">Đang chạy</button>
              <button className="rounded-full border border-slate-100 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm transition-colors hover:bg-primary hover:text-on-primary dark:border-slate-800 dark:bg-slate-900" type="button">Hết hạn</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              ["-20%", "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400", "SUMMERREAD24", "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", "Còn hàng", "Ưu đãi mùa hè dành cho tất cả các tựa sách văn học kinh điển.", "30 Th08, 2024", "156/500", "w-[31%]", "edit", "delete", false],
              ["-50k", "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", "WELCOMEBACK", "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", "Còn hàng", "Tri ân khách hàng quay lại mua sắm sau 3 tháng.", "15 Th12, 2024", "892/1000", "w-[89%]", "edit", "delete", false],
              ["-15%", "bg-slate-200 text-slate-500 dark:bg-slate-700", "FESTIVAL23", "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400", "Hết hạn", "Mã giảm giá hội sách năm 2023.", "31 Th12, 2023", "500/500", "w-full bg-slate-400", "visibility", "delete", true],
            ].map(([discount, badgeWrap, code, statusWrap, status, description, expiry, used, progress, actionA, actionB, expired]) => (
              <div key={code} className={`flex items-center gap-8 rounded-lg p-6 transition-all ${expired ? "border border-dashed border-slate-200 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-900/50" : "group border border-slate-100 bg-surface-container-lowest shadow-sm hover:border-blue-200"}`}>
                <div className={`flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg ${badgeWrap}`}>
                  <span className="text-xl font-extrabold">{discount}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <h4 className={`text-lg font-bold tracking-tight ${expired ? "text-on-surface-variant" : ""}`}>{code}</h4>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${statusWrap}`}>{status}</span>
                  </div>
                  <p className="truncate text-sm text-on-surface-variant">{description}</p>
                </div>
                <div className="grid grid-cols-3 gap-8 pr-4 text-right">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Hết hạn</p>
                    <p className="text-sm font-semibold">{expiry}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Đã dùng</p>
                    <div className="flex items-center justify-end gap-2">
                      <p className="text-sm font-semibold">{used}</p>
                    </div>
                    <div className={`ml-auto mt-2 h-1 w-24 overflow-hidden rounded-full ${expired ? "bg-slate-200 dark:bg-slate-800" : "bg-slate-100 dark:bg-slate-800"}`}>
                      <div className={`h-full bg-primary ${progress}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800" type="button">
                      <MaterialIcon className="text-xl">{actionA}</MaterialIcon>
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600" type="button">
                      <MaterialIcon className="text-xl">{actionB}</MaterialIcon>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

function CouponCreatePage() {
  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50 px-4 py-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-full flex-col space-y-2">
          <div className="mb-4 px-4 py-6">
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">Lumina Ledger</h1>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-500">The Literary Curator</p>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {pages.map((item) => {
              const active = item.key === "coupons"
              return (
                <button
                  key={item.key}
                  className={`group flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
                    active
                      ? "bg-blue-50/50 font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                  }`}
                  type="button"
                  onClick={() => (window.location.hash = item.key)}
                >
                  <MaterialIcon fill={active}>{item.icon}</MaterialIcon>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="mt-auto border-t border-slate-200 pt-4 dark:border-slate-800">
            <button className="group flex items-center gap-3 rounded-lg px-4 py-2 text-red-600 transition-all hover:bg-red-50 dark:hover:bg-red-950/20" type="button">
              <MaterialIcon>logout</MaterialIcon>
              <span className="text-sm font-bold uppercase tracking-wide">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="group relative rounded-full focus-within:ring-2 focus-within:ring-blue-500/20">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 transition-colors group-focus-within:text-blue-600">
                <MaterialIcon className="text-xl">search</MaterialIcon>
              </span>
              <input className="block w-64 rounded-full border-none bg-slate-100 py-2 pl-10 pr-4 text-sm transition-all focus:ring-0 dark:bg-slate-800" placeholder="Tìm kiếm tài liệu..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="group relative p-2 text-slate-500 transition-colors hover:text-blue-500" type="button">
              <MaterialIcon className="transition-all group-active:scale-95">notifications</MaterialIcon>
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-100 pl-4 dark:border-slate-800">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Lumina Admin</span>
              <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-sm">
                <img alt="Lumina Admin" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPnn7ECj7PnUb3zoEDW2e8c7TCyf_1Px9hOLJY7RsiT5PqOXuUfkz--9HC0Rbha7DABPlhcRhZexy8q-MEiB6ncHb2kflLtuUe54Y936vSpSpAn6GvO2ZGO7G6zPkfvupWxbcjQ1skshnpAJgZ4vEwDPnVDNFrtsZ_eaRWOMXBsAC0YSJr0FqLnl9NQcVMtb7XQfDnAg_uuIrm-KKv0xGBoY3m8vMfU1cRzy-bOCg8iqErxDtPjayPChThwxn42Xsi0jOxEvi9hTI" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-10 overflow-y-auto p-8 lg:p-12">
          <div className="space-y-2">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>QUẢN LÝ VOUCHER</span>
              <MaterialIcon className="text-[12px]">chevron_right</MaterialIcon>
              <span className="text-primary">TẠO MỚI</span>
            </nav>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Tạo Mã Giảm Giá Mới</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500">Thiết lập các chương trình khuyến mãi và ưu đãi dành cho khách hàng thân thiết. Các mã giảm giá sẽ được áp dụng trực tiếp tại giỏ hàng.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-slate-100 bg-surface-container-lowest p-6 shadow-sm md:col-span-2">
                  <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Mã Voucher</label>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <input className="block w-full rounded bg-surface-container-high px-4 py-3 font-mono text-sm uppercase tracking-widest transition-all placeholder:normal-case focus:ring-2 focus:ring-primary/20" placeholder="Ví dụ: SUMMERSALE24" type="text" />
                    </div>
                    <button className="flex items-center justify-center gap-2 rounded bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-all hover:opacity-90 active:scale-95" type="button">
                      <MaterialIcon className="text-lg">autorenew</MaterialIcon>
                      <span>TẠO MÃ NGẪU NHIÊN</span>
                    </button>
                  </div>
                  <p className="mt-3 text-xs italic text-slate-500">Gợi ý: Sử dụng tên chiến dịch kết hợp với năm (VD: TẾT2024)</p>
                </div>

                <div className="rounded-lg border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
                  <label className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Loại Giảm Giá</label>
                  <div className="space-y-3">
                    <label className="group flex cursor-pointer items-center gap-3 rounded border-2 border-transparent bg-surface-container-low p-4 transition-all hover:border-primary/20">
                      <input defaultChecked className="text-primary focus:ring-primary" name="discount_type" type="radio" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface">Phần trăm (%)</span>
                        <span className="text-xs text-slate-500">Giảm theo tỷ lệ đơn hàng</span>
                      </div>
                    </label>
                    <label className="group flex cursor-pointer items-center gap-3 rounded border-2 border-transparent bg-surface-container-low p-4 transition-all hover:border-primary/20">
                      <input className="text-primary focus:ring-primary" name="discount_type" type="radio" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface">Số tiền cố định (₫)</span>
                        <span className="text-xs text-slate-500">Giảm một khoản tiền cụ thể</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-lg border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
                  <div>
                    <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Giá Trị Giảm</label>
                    <div className="relative">
                      <input className="block w-full rounded bg-surface-container-high px-4 py-3 text-lg font-bold transition-all focus:ring-2 focus:ring-primary/20" placeholder="0" type="number" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                    </div>
                  </div>
                  <div className="mt-4 rounded bg-blue-50 p-3">
                    <div className="flex items-center gap-2 text-primary">
                      <MaterialIcon className="text-sm">info</MaterialIcon>
                      <span className="text-xs font-semibold">Tối đa giảm 500.000₫</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-100 bg-surface-container-lowest p-6 shadow-sm md:col-span-2">
                  <label className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Điều Kiện & Giới Hạn</label>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <span className="mb-2 block text-xs font-semibold text-slate-600">Giá trị đơn hàng tối thiểu</span>
                      <div className="relative">
                        <input className="block w-full rounded bg-surface-container-high px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-primary/20" defaultValue="0" type="text" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">VNĐ</span>
                      </div>
                    </div>
                    <div>
                      <span className="mb-2 block text-xs font-semibold text-slate-600">Tổng lượt sử dụng tối đa</span>
                      <div className="relative">
                        <input className="block w-full rounded bg-surface-container-high px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-primary/20" defaultValue="100" type="number" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-slate-400">Lần</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-4">
              <div className="rounded-lg border border-slate-100 bg-surface-container-lowest p-6 shadow-sm">
                <label className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Thời Gian Hiệu Lực</label>
                <div className="space-y-4">
                  <div>
                    <span className="mb-2 block text-xs font-semibold text-slate-600">Ngày bắt đầu</span>
                    <div className="relative">
                      <input className="block w-full rounded bg-surface-container-high px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-primary/20" type="date" />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <MaterialIcon className="text-sm">calendar_today</MaterialIcon>
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="mb-2 block text-xs font-semibold text-slate-600">Ngày kết thúc</span>
                    <div className="relative">
                      <input className="block w-full rounded bg-surface-container-high px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-primary/20" type="date" />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <MaterialIcon className="text-sm">event_busy</MaterialIcon>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90" />
                <div className="relative space-y-6 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <MaterialIcon className="text-4xl">book</MaterialIcon>
                    <div className="rounded bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-tighter">PREVIEW</div>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/60">DỰ KIẾN HIỂN THỊ</p>
                    <h3 className="break-all text-2xl font-black tracking-wider">MÃ_VOUCHER</h3>
                    <p className="mt-2 text-4xl font-black">Giảm 0%</p>
                  </div>
                  <div className="flex items-end justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-tighter text-white/50">Hạn dùng</p>
                      <p className="text-xs font-bold">Chưa xác định</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-tighter text-white/50">Min Order</p>
                      <p className="text-xs font-bold">0₫</p>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full rounded bg-primary py-4 text-sm font-bold uppercase tracking-wide text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95" type="button">
                  XÁC NHẬN TẠO VOUCHER
                </button>
                <button className="w-full rounded bg-slate-100 py-4 text-sm font-bold uppercase tracking-wide text-slate-600 transition-all hover:bg-slate-200 active:scale-95" type="button" onClick={() => (window.location.hash = "coupons")}>
                  HỦY BỎ
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function SettingsPage() {
  return (
    <>
      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-0 bottom-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50 font-['Inter'] antialiased tracking-tight">
          <div className="flex h-full flex-col space-y-2 p-4">
            <div className="mb-4 px-4 py-6">
              <h1 className="text-xl font-bold tracking-tighter text-slate-900">Lumina Ledger</h1>
              <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-widest text-slate-500">The Literary Curator</p>
            </div>
            <nav className="flex-1 space-y-1">
              {pages.map((item) => {
                const active = item.key === "settings"
                return (
                  <button
                    key={item.key}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                      active
                        ? "rounded-lg bg-blue-50/50 font-semibold text-blue-600"
                        : "scale-95 text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:opacity-80"
                    }`}
                    type="button"
                    onClick={() => (window.location.hash = item.key)}
                  >
                    <MaterialIcon className="text-lg" fill={active}>{item.icon}</MaterialIcon>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>
            <div className="border-t border-slate-200 pt-4">
              <div className="scale-95 cursor-pointer px-4 py-2 transition-all active:opacity-80">
                <div className="flex items-center gap-3">
                  <img alt="Admin User" className="h-8 w-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCmfO95szsdRqsDagOb9OmBMlC6w39hVJOjPWueg_1Zfj4hKqufZkelWRMGC4j0cPLxxCnWfPODKN6qgWLwNJ_aCUR4I0LBaMeRBV8sd91tvcKUvR-5hORVBEaKdDsqKrDcpZtA15mPZSKg7PdLHx-GIEwNkpakqAf3VkEKk9bkzjCUvldYpcI6fPzSBayWOpYoNAo91KSY_4D7Hsaw8YE7WhYq8WPvF3-UXg66OhjvxHUqoDPxKmeFmnWU2v0NkwV1DKIW_sEq9M" />
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-bold text-slate-900">Admin User</p>
                    <button className="flex items-center gap-1 text-[0.7rem] text-slate-500 transition-colors hover:text-red-500" type="button">
                      <MaterialIcon className="text-[0.8rem]">logout</MaterialIcon>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="ml-64 flex flex-1 flex-col">
          <header className="sticky top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-8 shadow-sm backdrop-blur-md font-['Inter'] text-sm">
            <div className="flex flex-1 items-center">
              <div className="relative w-96">
                <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</MaterialIcon>
                <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-1.5 pl-10 text-xs outline-none transition-all focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20" placeholder="Tìm kiếm cài đặt..." type="text" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 transition-colors hover:text-blue-500" type="button">
                <MaterialIcon>notifications</MaterialIcon>
              </button>
              <div className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-slate-50">
                <img alt="Lumina Admin" className="h-7 w-7 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCmfO95szsdRqsDagOb9OmBMlC6w39hVJOjPWueg_1Zfj4hKqufZkelWRMGC4j0cPLxxCnWfPODKN6qgWLwNJ_aCUR4I0LBaMeRBV8sd91tvcKUvR-5hORVBEaKdDsqKrDcpZtA15mPZSKg7PdLHx-GIEwNkpakqAf3VkEKk9bkzjCUvldYpcI6fPzSBayWOpYoNAo91KSY_4D7Hsaw8YE7WhYq8WPvF3-UXg66OhjvxHUqoDPxKmeFmnWU2v0NkwV1DKIW_sEq9M" />
                <span className="font-medium text-slate-700 transition-colors group-hover:text-blue-600">Lumina Admin</span>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 overflow-y-auto p-8 md:p-12">
            <div className="mb-10">
              <span className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-600">Lumina Ledger</span>
              <h3 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900">Cài đặt trung tâm</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
                Quản lý hồ sơ cá nhân, cấu hình cửa hàng và các thiết lập bảo mật cấp cao cho hệ thống quản trị nhà sách của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <nav className="sticky top-24 space-y-1">
                  <a className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-2.5 text-sm font-bold text-blue-600 shadow-sm transition-all" href="#profile">
                    <span>Hồ sơ cá nhân</span>
                    <MaterialIcon className="text-[1rem]">chevron_right</MaterialIcon>
                  </a>
                  <a className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm text-slate-500 transition-all hover:bg-slate-100" href="#general">
                    <span>Cài đặt chung</span>
                  </a>
                  <a className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm text-slate-500 transition-all hover:bg-slate-100" href="#security">
                    <span>Bảo mật</span>
                  </a>
                  <a className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm text-slate-500 transition-all hover:bg-slate-100" href="#notifications">
                    <span>Thông báo</span>
                  </a>
                </nav>
              </div>

              <div className="space-y-8 pb-20 lg:col-span-9">
                <section className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm" id="profile">
                  <div className="mb-8 flex items-center gap-3">
                    <MaterialIcon className="text-blue-600" fill>account_circle</MaterialIcon>
                    <h4 className="text-lg font-bold tracking-tight text-slate-900">Hồ sơ cá nhân</h4>
                  </div>
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="group relative">
                        <img alt="Profile Picture" className="h-24 w-24 rounded-lg object-cover ring-4 ring-blue-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMRajZDNxb6dbuhHwZfcemHDYzSNs4lSn0qt0Koset6-pmN-EiuVsydkNhJs5tjWS47OwpMeZWC7wlwKqg2e67G_9wdvX3ydzZhba6lwUbya22tNM_C6Pyqn3dGRDRaSz9ZzB2UhRWUIOp-lX_oujIb85_6ZWC2RYbj6J18eCQhsBB13qPP3_YiZ3JCHhZba9O0RtHK6B26WaN5TpVL8WyV0YnQokNV75Rb13nPgadv5cIOjY2UZqs02B5r2a-16mfj1Dri3lDPoU" />
                        <button className="absolute -bottom-2 -right-2 rounded-lg bg-blue-600 p-1.5 text-white shadow-lg transition-transform hover:scale-105" type="button">
                          <MaterialIcon className="text-sm">photo_camera</MaterialIcon>
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Ảnh đại diện</p>
                        <p className="mb-3 text-xs text-slate-500">JPG, GIF hoặc PNG. Tối đa 2MB.</p>
                        <div className="flex gap-2">
                          <button className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white" type="button">Tải lên</button>
                          <button className="rounded-lg border border-red-100 px-4 py-1.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-50" type="button">Xóa</button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Họ và tên</label>
                        <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20" defaultValue="Nguyễn Văn Admin" type="text" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Email quản trị</label>
                        <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20" defaultValue="admin@curator.vn" type="email" />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Tiểu sử ngắn</label>
                        <textarea className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20" defaultValue="Người điều hành chính hệ thống quản lý sách Lumina Ledger tại khu vực phía Nam." rows={3} />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm" id="general">
                  <div className="mb-8 flex items-center gap-3">
                    <MaterialIcon className="text-blue-600" fill>storefront</MaterialIcon>
                    <h4 className="text-lg font-bold tracking-tight text-slate-900">Cài đặt chung</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Tên cửa hàng</label>
                      <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20" defaultValue="Lumina Ledger" type="text" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Số điện thoại liên hệ</label>
                      <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20" defaultValue="+84 901 234 567" type="text" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Địa chỉ văn phòng</label>
                      <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20" defaultValue="123 Đường Sách, Quận 1, TP. Hồ Chí Minh" type="text" />
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm" id="security">
                  <div className="mb-8 flex items-center gap-3">
                    <MaterialIcon className="text-blue-600" fill>verified_user</MaterialIcon>
                    <h4 className="text-lg font-bold tracking-tight text-slate-900">Bảo mật</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mật khẩu</p>
                        <p className="text-xs text-slate-500">Cập nhật mật khẩu để đảm bảo an toàn tài khoản.</p>
                      </div>
                      <button className="rounded-lg border border-blue-100 bg-white px-5 py-2 text-xs font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white" type="button">Đổi mật khẩu</button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100/50 text-blue-600">
                          <MaterialIcon>phonelink_lock</MaterialIcon>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Xác thực 2 yếu tố (2FA)</p>
                          <p className="text-xs text-slate-500">Thêm một lớp bảo mật cho tài khoản của bạn.</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-4 text-[0.65rem] font-bold uppercase text-red-500">Chưa kích hoạt</span>
                        <button className="relative w-10 rounded-full bg-slate-300 p-0.5 transition-colors" type="button">
                          <div className="h-4 w-4 rounded-full bg-white transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm" id="notifications">
                  <div className="mb-8 flex items-center gap-3">
                    <MaterialIcon className="text-blue-600" fill>notifications_active</MaterialIcon>
                    <h4 className="text-lg font-bold tracking-tight text-slate-900">Tùy chọn thông báo</h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      ["mail", "Email định kỳ", "Nhận báo cáo doanh thu hàng tuần qua email.", true],
                      ["inventory", "Cảnh báo tồn kho", "Thông báo khi sách trong kho sắp hết hàng.", true],
                      ["stars", "Đánh giá mới", "Nhận tin nhắn khi có khách hàng để lại đánh giá sách.", false],
                    ].map(([icon, title, desc, checked]) => (
                      <label key={title} className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent p-4 transition-colors hover:border-slate-100 hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                          <MaterialIcon className="text-slate-400">{icon}</MaterialIcon>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{title}</p>
                            <p className="text-xs text-slate-500">{desc}</p>
                          </div>
                        </div>
                        <input defaultChecked={checked} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" type="checkbox" />
                      </label>
                    ))}
                  </div>
                </section>

                <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
                  <button className="rounded-lg px-8 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100" type="button">Hủy bỏ</button>
                  <button className="rounded-lg bg-blue-600 px-10 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95" type="button">Lưu thay đổi</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

function App() {
  const [page, setPage] = useState(getPageFromHash)

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash())
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const navigate = (nextPage) => {
    window.location.hash = nextPage
    setPage(nextPage)
  }

    return (
      page === "categories" ? (
        <CategoryPage onNavigate={navigate} />
      ) : page === "reviews" ? (
        <ReviewsPage />
      ) : page === "coupons" ? (
        <CouponsPage />
      ) : page === "coupon-create" ? (
        <CouponCreatePage />
      ) : page === "settings" ? (
        <SettingsPage />
      ) : page === "users" ? (
        <UsersPage />
      ) : page === "user-create" ? (
        <UserCreatePage />
      ) : page === "user-edit" ? (
        <UserEditPage />
      ) : page === "category-edit" ? (
        <EditCategoryPage onNavigate={navigate} />
      ) : page === "category-create" ? (
        <CreateCategoryPage onNavigate={navigate} />
      ) : (
        <div className="bg-surface font-['Inter'] text-on-surface antialiased">
          <SideNav currentPage={page} onNavigate={navigate} />
          <TopBar currentPage={page} />
        {page === "books" ? <BooksPage onCreate={() => navigate("book-create")} onEdit={() => navigate("book-edit")} /> : page === "book-create" ? <CreateBookPage /> : page === "book-edit" ? <EditBookPage /> : page === "inventory" ? <InventoryPage onNavigate={navigate} /> : page === "inventory-create" ? <InventoryCreatePage /> : page === "orders" ? <OrdersPage /> : <DashboardPage />}
        </div>
      )
  )
}

export default App
