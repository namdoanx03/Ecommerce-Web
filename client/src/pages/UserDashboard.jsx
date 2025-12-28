import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiShoppingBag, FiHeart, FiCreditCard, FiMapPin, FiUser, FiDownload, FiShield } from 'react-icons/fi'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { setOrder } from '../store/orderSlice'

const UserDashboard = () => {
  const user = useSelector(state => state.user)
  const orders = useSelector(state => state.orders.order)
  const allProducts = useSelector(state => state.product.data || state.product.allProducts || [])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(location.pathname === '/myorders' ? 'order' : 'dashboard')
  const [page, setPage] = useState(1)
  const pageSize = 5

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await Axios({ ...SummaryApi.getOrderItems })
        if (response.data && response.data.success) {
          dispatch(setOrder(response.data.data))
        }
      } catch (error) {
        // silent
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [dispatch])

  useEffect(() => {
    if (location.pathname === '/myorders') {
      setActiveTab('order')
    } else {
      setActiveTab('dashboard')
    }
  }, [location.pathname])

  const stats = useMemo(() => {
    const total = orders.length || 0
    const pending = orders.filter(o => (o.order_status || '').toUpperCase() === 'PENDING').length
    const wishlist = 0
    return { total, pending, wishlist }
  }, [orders])

  const name = user.name || 'User'

  const totalPages = useMemo(() => {
    if (!orders || orders.length === 0) return 1
    return Math.ceil(orders.length / pageSize)
  }, [orders, pageSize])

  const paginatedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return []
    const start = (page - 1) * pageSize
    return orders.slice(start, start + pageSize)
  }, [orders, page, pageSize])

  useEffect(() => {
    // Nếu tổng số trang thay đổi làm page hiện tại > totalPages thì đưa về trang cuối.
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [totalPages, page])

  const getProductImage = (productId, fallbackImage) => {
    if (fallbackImage) return fallbackImage
    const prod = allProducts.find(p => p._id === productId)
    if (!prod) return '/no-image.png'
    if (Array.isArray(prod.image) && prod.image[0]) return prod.image[0]
    if (typeof prod.image === 'string') return prod.image
    return '/no-image.png'
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  const getPaymentMethod = (paymentMethod) => {
    if (!paymentMethod) return 'N/A';
    const method = paymentMethod.toUpperCase();
    if (method.includes('VNPAY')) {
      return 'VNPay';
    } else if (method.includes('CASH ON DELIVERY') || method.includes('COD')) {
      return 'Thanh toán khi nhận hàng';
    }
    return paymentMethod;
  }

  const getDeliveryStatusColor = (orderStatus) => {
    if (!orderStatus) return 'bg-red-100 text-red-700';
    
    const status = orderStatus.toUpperCase();
    if (status.includes('SUCCESS')) {
      return 'bg-green-100 text-green-700';
    } else {
      // Tất cả các trạng thái khác (PENDING, FAILED, CANCELLED, CANCEL) đều là "Đã hủy"
      return 'bg-red-100 text-red-700';
    }
  }

  const getDeliveryStatusText = (orderStatus) => {
    if (!orderStatus) return 'Đã hủy';
    
    const status = orderStatus.toUpperCase();
    if (status.includes('SUCCESS')) {
      return 'Thành công';
    } else {
      // Tất cả các trạng thái khác (PENDING, FAILED, CANCELLED, CANCEL) đều là "Đã hủy"
      return 'Đã hủy';
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header / Breadcrumb */}
      <div className="bg-[#F8F8F8] border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-5 sm:py-7 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700">User Dashboard</h2>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 hover:text-emerald-600">
              <FiHome className="w-4 h-4" />
              <span>Home</span>
            </button>
            <span className="text-gray-400">&gt;</span>
            <span className="font-medium">User Dashboard</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-8 lg:py-10 flex flex-col lg:flex-row gap-8">
        {/* Left sidebar card */}
        <aside className="w-full lg:w-1/3 xl:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-b from-emerald-50 to-white px-6 pt-8 pb-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center text-3xl font-semibold text-emerald-600">
                {user.avatar ? (
                  <img src={user.avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">{name}</h3>
              {user.email && (
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              )}
            </div>

            <nav className="border-t border-gray-100 divide-y divide-gray-100 text-sm">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-6 py-3.5 font-semibold ${activeTab === 'dashboard' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FiHome className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('order')}
                className={`w-full flex items-center gap-3 px-6 py-3.5 ${activeTab === 'order' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FiShoppingBag className="w-4 h-4" />
                <span>Order</span>
              </button>
              <button
                onClick={() => navigate('/wishlist')}
                className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 text-gray-700"
              >
                <FiHeart className="w-4 h-4" />
                <span>Wishlist</span>
              </button>
              <button
                onClick={() => navigate('/address')}
                className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 text-gray-700"
              >
                <FiMapPin className="w-4 h-4" />
                <span>Address</span>
              </button>
              <button
                onClick={() => navigate('/info')}
                className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 text-gray-700"
              >
                <FiUser className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Right main panel */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {activeTab === 'dashboard' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">My Dashboard</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-2xl">
                  From your My Account Dashboard you have the ability to view a snapshot of your recent account activity and update your account information.
                </p>

                {/* Stats cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="border border-gray-100 rounded-xl px-4 py-4 flex items-center gap-4 bg-emerald-50/40">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg">
                      <FiShoppingBag />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Order</p>
                      <p className="mt-1 text-lg font-semibold text-gray-800">{stats.total}</p>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-xl px-4 py-4 flex items-center gap-4 bg-yellow-50/60">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Pending Order</p>
                      <p className="mt-1 text-lg font-semibold text-gray-800">{stats.pending}</p>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-xl px-4 py-4 flex items-center gap-4 bg-sky-50/60">
                    <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center text-lg">
                      <FiHeart />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Wishlist</p>
                      <p className="mt-1 text-lg font-semibold text-gray-800">{stats.wishlist}</p>
                    </div>
                  </div>
                </div>

                {/* Account information sections (static for now) */}
                <section className="space-y-6 text-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-800">Account Information</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Contact Information</h4>
                    <button
                      onClick={() => navigate('/dashboard/profile-setting')}
                      className="text-emerald-600 text-xs font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-gray-700 font-medium">{name}</p>
                  {user.email && <p className="text-gray-600 mt-0.5">{user.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Newsletters</h4>
                    <span className="text-emerald-600 text-xs font-semibold cursor-pointer">Edit</span>
                  </div>
                  <p className="text-gray-600">
                    You are currently not subscribed to any newsletter.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-gray-200">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Default Billing Address</h4>
                    <button
                      onClick={() => navigate('/address')}
                      className="text-emerald-600 text-xs font-semibold hover:underline"
                    >
                      Edit Address
                    </button>
                  </div>
                  <p className="text-gray-600">
                    You have not set a default billing address.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Default Shipping Address</h4>
                    <button
                      onClick={() => navigate('/address')}
                      className="text-emerald-600 text-xs font-semibold hover:underline"
                    >
                      Edit Address
                    </button>
                  </div>
                  <p className="text-gray-600">
                    You have not set a default shipping address.
                  </p>
                </div>
              </div>
                </section>
              </>
            )}

            {activeTab === 'order' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">My Orders History</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-2xl">
                  Xem lịch sử các đơn hàng của bạn cùng trạng thái giao hàng chi tiết.
                </p>

                {(!orders || orders.length === 0) && !loading && (
                  <p className="text-sm text-gray-500">Bạn chưa có đơn hàng nào.</p>
                )}

                {orders && orders.length > 0 && (
                  <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-[#F3F3F3] border-b border-gray-200">
                        <tr>
                          <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã đơn</th>
                          <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thanh toán</th>
                          <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái thanh toán</th>
                          <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Tổng tiền</th>
                          <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {paginatedOrders.map((order, index) => {
                          const badgeClass = getDeliveryStatusColor(order.order_status)
                          const statusText = getDeliveryStatusText(order.order_status)
                          return (
                            <tr key={order._id || index} className="hover:bg-gray-50">
                              <td className="p-3 text-sm text-teal-600 font-semibold">
                                #{order.orderId?.split('-')[1]?.slice(0, 5) || order._id?.slice(-5)}
                              </td>
                              <td className="p-3 text-sm text-gray-700 text-center">
                                {getPaymentMethod(order.payment_method)}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
                                  {statusText}
                                </span>
                              </td>
                              <td className="p-3 text-sm text-right font-semibold text-gray-800">
                                {(order.totalAmt || 0).toLocaleString()} đ
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => navigate(`/order-detail/${order._id}`)}
                                    className="px-3 py-1 text-xs font-semibold rounded-full border border-teal-500 text-teal-600 hover:bg-teal-50"
                                  >
                                    Chi tiết đơn hàng
                                  </button>
                                  <button
                                    onClick={() => navigate(`/order-tracking/${order._id}`)}
                                    className="px-3 py-1 text-xs font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                                  >
                                    Theo dõi
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {loading && (
                  <p className="mt-4 text-xs text-gray-400">Đang tải dữ liệu đơn hàng...</p>
                )}

                {/* Pagination */}
                {!loading && orders && orders.length > 0 && (
                  <div className="flex items-center justify-between pt-3">
                    <p className="text-xs text-gray-500">
                      Hiển thị {Math.min(orders.length, (page - 1) * pageSize + 1)}-
                      {Math.min(page * pageSize, orders.length)} trong {orders.length} đơn hàng
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-2.5 py-1 text-xs border rounded-lg text-gray-600 hover:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:bg-gray-50"
                      >
                        Trước
                      </button>
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const p = idx + 1
                        return (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-2.5 py-1 text-xs rounded-lg border ${
                              p === page
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'text-gray-600 hover:bg-gray-50 border-gray-200'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      })}
                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-2.5 py-1 text-xs border rounded-lg text-gray-600 hover:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:bg-gray-50"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserDashboard


