import Icon from '../components/Icon'
import { orderRows, orderStats } from '../data/mockData'

function OrdersPage({ onCreateOrder }) {
  return (
    <>
      <section className="stats-grid stats-grid--orders">
        {orderStats.map((item) => (
          <article className="stat-card stat-card--order" key={item.title}>
            <div className="stat-card__top">
              <div className={`stat-card__icon stat-card__icon--${item.deltaType}`}>
                <Icon name={item.icon} />
              </div>
              <span
                className={`pill ${
                  item.deltaType === 'negative'
                    ? 'pill--negative'
                    : item.deltaType === 'positiveAlt'
                      ? 'pill--neutral'
                      : 'pill--positive'
                }`}
              >
                {item.delta}
              </span>
            </div>
            <p className="stat-card__label stat-card__label--normal">{item.title}</p>
            <strong className="stat-card__value">{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="card orders-card">
        <div className="orders-toolbar">
          <div className="orders-toolbar__actions">
            <button className="toolbar-button" type="button">
              <Icon name="filter" />
              Lọc đơn hàng
            </button>
            <button className="toolbar-button" type="button">
              <Icon name="file" />
              Tháng này
            </button>
          </div>
          <button className="primary-button" type="button" onClick={onCreateOrder}>
            <Icon name="plus" />
            Tạo Đơn Hàng Mới
          </button>
        </div>

        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orderRows.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>
                    <div className="user-cell">
                      <div className={`user-avatar user-avatar--${order.avatarTone}`}>{order.avatar}</div>
                      <div className="user-cell__content">
                        <strong>{order.customer}</strong>
                        <span>{order.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{order.createdAt}</td>
                  <td className="order-total">{order.total}</td>
                  <td>
                    <span className={`tag tag--${order.statusTone}`}>{order.status}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="ghost-icon-button" type="button" aria-label={`Xem ${order.id}`}>
                        <Icon name="eye" />
                      </button>
                      <button className="ghost-icon-button" type="button" aria-label={`Sửa ${order.id}`}>
                        <Icon name="edit" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="inventory-footer orders-footer">
          <p>Hiển thị 4 trên 1,212 đơn hàng</p>
          <div className="pagination">
            <button className="pagination__button" type="button" aria-label="Trang trước">
              <Icon name="chevronLeft" />
            </button>
            <button className="pagination__page pagination__page--active" type="button">1</button>
            <button className="pagination__page" type="button">2</button>
            <button className="pagination__page" type="button">3</button>
            <span className="pagination__ellipsis">...</span>
            <button className="pagination__page" type="button">120</button>
            <button className="pagination__button" type="button" aria-label="Trang sau">
              <Icon name="chevronRight" />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default OrdersPage
