import Icon from '../components/Icon'
import { notificationItems } from '../data/mockData'

function SettingsPage() {
  return (
    <>
      <section className="hero-panel hero-panel--compact">
        <div>
          <h1>Cấu hình hệ thống</h1>
          <p>Quản lý tài khoản cá nhân và các thiết lập vận hành nhà sách.</p>
        </div>
        <div className="hero-panel__actions">
          <button className="primary-button" type="button">Lưu tất cả thay đổi</button>
        </div>
      </section>

      <section className="settings-layout">
        <div className="settings-main">
          <article className="card form-card">
            <div className="section-title">
              <Icon name="users" />
              <h2>Thông tin cá nhân</h2>
            </div>

            <div className="profile-box">
              <div className="profile-box__avatar" />
              <div className="profile-box__meta">
                <strong>Ảnh đại diện</strong>
                <p>Tải lên ảnh định dạng JPG hoặc PNG. Tối đa 5MB.</p>
                <div className="profile-box__actions">
                  <button className="text-button" type="button">Tải lên ảnh mới</button>
                  <button className="text-button text-button--danger" type="button">Gỡ bỏ</button>
                </div>
              </div>
            </div>

            <div className="form-grid form-grid--users">
              <label className="field">
                <span>Họ và tên</span>
                <input type="text" defaultValue="Nguyễn Văn Admin" />
              </label>
              <label className="field">
                <span>Email liên hệ</span>
                <input type="email" defaultValue="admin@lexicon.vn" />
              </label>
              <label className="field field--full">
                <span>Mật khẩu hiện tại</span>
                <div className="field-shell">
                  <Icon name="lock" />
                  <input type="password" defaultValue="123456789" />
                  <Icon name="eye" />
                </div>
                <small>Thay đổi mật khẩu tài khoản</small>
              </label>
            </div>
          </article>

          <article className="card form-card">
            <div className="section-title">
              <Icon name="settings" />
              <h2>Thiết lập hệ thống</h2>
            </div>

            <div className="settings-options">
              <div className="settings-option">
                <div className="settings-option__meta">
                  <div className="mini-icon mini-icon--soft">
                    <Icon name="globe" />
                  </div>
                  <div>
                    <strong>Ngôn ngữ hiển thị</strong>
                    <span>Chọn ngôn ngữ chính cho giao diện</span>
                  </div>
                </div>
                <button className="ghost-select" type="button">
                  Tiếng Việt
                  <Icon name="arrowDown" />
                </button>
              </div>

              <div className="settings-option">
                <div className="settings-option__meta">
                  <div className="mini-icon mini-icon--soft">
                    <Icon name="wallet" />
                  </div>
                  <div>
                    <strong>Đơn vị tiền tệ</strong>
                    <span>Sử dụng cho các báo cáo doanh thu</span>
                  </div>
                </div>
                <button className="ghost-select" type="button">VND (₫)</button>
              </div>

              <div className="settings-option">
                <div className="settings-option__meta">
                  <div className="mini-icon mini-icon--soft">
                    <Icon name="moon" />
                  </div>
                  <div>
                    <strong>Chế độ giao diện</strong>
                    <span>Chế độ tối giúp bảo vệ mắt</span>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span />
                </label>
              </div>
            </div>
          </article>
        </div>

        <aside className="settings-side">
          <article className="card form-card">
            <div className="section-title">
              <Icon name="bell" />
              <h2>Thông báo</h2>
            </div>

            <div className="notification-group">
              <div className="notification-group__title">Email &amp; Hệ thống</div>
              {notificationItems.slice(0, 3).map((item) => (
                <label className="notification-item" key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                  <input defaultChecked={item.enabled} type="checkbox" />
                </label>
              ))}
            </div>

            <div className="notification-group">
              <div className="notification-group__title">Hoạt động tài khoản</div>
              {notificationItems.slice(3).map((item) => (
                <label className="notification-item" key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                  <input defaultChecked={item.enabled} type="checkbox" />
                </label>
              ))}
            </div>

            <div className="danger-box">
              <strong>Cảnh báo vùng nguy hiểm</strong>
              <p>Các thay đổi ở đây có thể ảnh hưởng tới toàn bộ hệ thống.</p>
              <button className="danger-button" type="button">YÊU CẦU XÁC THỰC 2 LỚP</button>
            </div>
          </article>

          <article className="support-card">
            <div className="support-card__icon">
              <Icon name="book" />
            </div>
            <div>
              <h2>Bạn cần hỗ trợ kỹ thuật?</h2>
              <p>Đội ngũ kỹ thuật Lexicon luôn sẵn sàng hỗ trợ 24/7 cho cửa hàng của bạn.</p>
            </div>
            <button className="support-card__button" type="button">Liên hệ ngay</button>
          </article>
        </aside>
      </section>
    </>
  )
}

export default SettingsPage
