import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiShoppingBag, FiHeart } from 'react-icons/fi'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { setOrder } from '../store/orderSlice'
import UserSidebarMenu from '../components/UserSidebarMenu'
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'

const UserDashboard = () => {
  const user = useSelector(state => state.user)
  const orders = useSelector(state => state.orders.order)
  const allProducts = useSelector(state => state.product.data || state.product.allProducts || [])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(location.pathname === '/myorders' ? 'order' : 'dashboard')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [trackingOrder, setTrackingOrder] = useState(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [orderDetail, setOrderDetail] = useState(null)
  const [orderDetailLoading, setOrderDetailLoading] = useState(false)
  const [reviews, setReviews] = useState({}) // { productId: { rating: number, comment: string } }
  const [reviewLoading, setReviewLoading] = useState(false)
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

  const loadTrackingOrder = async (orderId) => {
    try {
      setTrackingLoading(true)
      const response = await Axios({ ...SummaryApi.getOrderItems })
      const { data: responseData } = response
      if (responseData.success && Array.isArray(responseData.data)) {
        const found = responseData.data.find(
          (o) => o._id === orderId || o.orderId === orderId
        )
        setTrackingOrder(found || null)
      } else {
        setTrackingOrder(null)
      }
    } catch (error) {
      setTrackingOrder(null)
    } finally {
      setTrackingLoading(false)
    }
  }

  const loadOrderDetail = async (orderId) => {
    try {
      setOrderDetailLoading(true)
      const response = await Axios({ ...SummaryApi.getOrderItems })
      const { data: responseData } = response
      if (responseData.success && Array.isArray(responseData.data)) {
        const found = responseData.data.find(
          (o) => o._id === orderId || o.orderId === orderId
        )
        setOrderDetail(found || null)
      } else {
        setOrderDetail(null)
      }
    } catch (error) {
      setOrderDetail(null)
    } finally {
      setOrderDetailLoading(false)
    }
  }

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

  const name = user.name || 'Người dùng'

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
    if (!orderStatus) return 'bg-gray-100 text-gray-700';
    
    const status = orderStatus.toUpperCase();
    if (status.includes('SUCCESS')) {
      return 'bg-green-100 text-green-700';
    } else if (status.includes('PENDING')) {
      return 'bg-gray-100 text-gray-700';
    } else if (status.includes('FAILED') || status.includes('CANCELLED') || status.includes('CANCEL')) {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-gray-100 text-gray-700';
  }

  const getDeliveryStatusText = (orderStatus) => {
    if (!orderStatus) return 'Đang xử lý';
    
    const status = orderStatus.toUpperCase();
    if (status.includes('SUCCESS')) {
      return 'Thành công';
    } else if (status.includes('PENDING')) {
      return 'Chờ thanh toán';
    } else if (status.includes('FAILED') || status.includes('CANCELLED') || status.includes('CANCEL')) {
      return 'Đã hủy';
    }
    return 'Đang xử lý';
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header / Breadcrumb */}
      <div className="bg-[#F8F8F8] border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-5 sm:py-7 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700">Tài khoản của tôi</h2>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 hover:text-emerald-600">
              <FiHome className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>
            <span className="text-gray-400">&gt;</span>
            <span className="font-medium">Tài khoản của tôi</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-8 lg:py-10 flex flex-col lg:flex-row gap-8">
        {/* Left sidebar card */}
        <UserSidebarMenu />

        {/* Right main panel */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {activeTab === 'dashboard' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Tổng quan</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-4xl">
                  Từ tài khoản của bạn, bạn có thể xem tổng quan về hoạt động gần đây của tài khoản và cập nhật thông tin tài khoản của bạn.
                </p>

                {/* Stats cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="border border-gray-100 rounded-xl px-4 py-4 flex items-center gap-4 bg-emerald-50/40">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg">
                      <FiShoppingBag />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Tổng đơn hàng</p>
                      <p className="mt-1 text-lg font-semibold text-gray-800">{stats.total}</p>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-xl px-4 py-4 flex items-center gap-4 bg-yellow-50/60">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Tổng đơn hàng chờ</p>
                      <p className="mt-1 text-lg font-semibold text-gray-800">{stats.pending}</p>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-xl px-4 py-4 flex items-center gap-4 bg-sky-50/60">
                    <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center text-lg">
                      <FiHeart />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Tổng yêu thích</p>
                      <p className="mt-1 text-lg font-semibold text-gray-800">{stats.wishlist}</p>
                    </div>
                  </div>
                </div>

                {/* Account information sections (static for now) */}
                <section className="space-y-6 text-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-800">Thông tin tài khoản</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Thông tin liên hệ</h4>
                    <button
                      onClick={() => navigate('/dashboard/profile-setting')}
                      className="text-emerald-600 text-xs font-semibold hover:underline"
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                  <p className="text-gray-700 font-medium">{name}</p>
                  {user.email && <p className="text-gray-600 mt-0.5">{user.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Bản tin</h4>
                    <span className="text-emerald-600 text-xs font-semibold cursor-pointer">Chỉnh sửa</span>
                  </div>
                  <p className="text-gray-600">
                    Bạn hiện không đăng ký bản tin.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-gray-200">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Địa chỉ thanh toán mặc định</h4>
                    <button
                      onClick={() => navigate('/address')}
                      className="text-emerald-600 text-xs font-semibold hover:underline"
                    >
                      Chỉnh sửa địa chỉ
                    </button>
                  </div>
                  <p className="text-gray-600">
                    Bạn chưa có địa chỉ thanh toán mặc định.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Địa chỉ giao hàng mặc định</h4>
                    <button
                      onClick={() => navigate('/address')}
                      className="text-emerald-600 text-xs font-semibold hover:underline"
                    >
                      Chỉnh sửa địa chỉ
                    </button>
                  </div>
                  <p className="text-gray-600">
                    Bạn chưa có địa chỉ giao hàng mặc định.
                  </p>
                </div>
              </div>
                </section>
              </>
            )}

            {activeTab === 'order' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Lịch sử đơn hàng</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-2xl">
                  Xem lịch sử các đơn hàng của bạn cùng trạng thái thanh toán và giao hàng chi tiết.
                </p>

                {(!orders || orders.length === 0) && !loading && (
                  <p className="text-sm text-gray-500">Bạn hiện không có đơn hàng nào.</p>
                )}

                {orders && orders.length > 0 && (
                  <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-[#F3F3F3] border-b border-gray-200">
                        <tr>
                          <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã đơn</th>
                          <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thanh toán</th>
                          <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái đơn hàng</th>
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
                                    onClick={() => {
                                      setSelectedOrderId(order._id)
                                      setActiveTab('detail')
                                      loadOrderDetail(order._id)
                                    }}
                                    className="px-3 py-1 text-xs font-semibold rounded-full border border-teal-500 text-teal-600 hover:bg-teal-50"
                                  >
                                    Chi tiết đơn hàng
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedOrderId(order._id)
                                      setActiveTab('tracking')
                                      loadTrackingOrder(order._id)
                                    }}
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

            {activeTab === 'tracking' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Theo dõi đơn hàng</h2>
                    <p className="text-sm text-gray-500">
                      Xem chi tiết trạng thái đơn hàng của bạn
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('order')
                      setTrackingOrder(null)
                      setSelectedOrderId(null)
                    }}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    ← Quay lại
                  </button>
                </div>

                {trackingLoading && (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-gray-500">Đang tải...</p>
                  </div>
                )}

                {!trackingLoading && !trackingOrder && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <p className="text-gray-700 font-semibold mb-2">
                      Không tìm thấy đơn hàng
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('order')
                        setTrackingOrder(null)
                        setSelectedOrderId(null)
                      }}
                      className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                    >
                      Quay lại danh sách đơn hàng
                    </button>
                  </div>
                )}

                {!trackingLoading && trackingOrder && (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                      {/* Product image */}
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-6">
                        <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                          {trackingOrder.product_details?.[0]?.image ? (
                            <img
                              src={trackingOrder.product_details[0].image}
                              alt={trackingOrder.product_details[0].name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <span className="text-xs text-gray-400">Không có ảnh</span>
                          )}
                        </div>
                      </div>

                      {/* Tracking info */}
                      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Mã đơn hàng
                            </p>
                            <p className="text-lg font-semibold text-teal-600">
                              {trackingOrder.orderId}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Ngày đặt
                            </p>
                            <p className="text-sm text-gray-700">
                              {trackingOrder.createdAt ? (
                                <>
                                  {new Date(trackingOrder.createdAt).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}{' '}
                                  {new Date(trackingOrder.createdAt).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </>
                              ) : 'N/A'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Trạng thái hiện tại
                            </p>
                            <p className={`text-sm font-semibold ${
                              (() => {
                                const status = (trackingOrder.order_status || '').toUpperCase()
                                if (status.includes('SUCCESS')) return 'text-green-600'
                                if (status.includes('PENDING')) return 'text-gray-600'
                                if (status.includes('FAILED') || status.includes('CANCELLED') || status.includes('CANCEL')) return 'text-red-600'
                                return 'text-gray-600'
                              })()
                            }`}>
                              {getDeliveryStatusText(trackingOrder.order_status)}
                            </p>
                          </div>
                        </div>

                        {/* Timeline bar */}
                        <div className="mt-6">
                          <div className="relative flex items-center justify-between">
                            <div className="absolute left-4 right-4 top-1/2 h-[2px] bg-gray-200 -z-10" />
                            {[
                              { key: 'PLACED', label: 'Đã đặt hàng' },
                              { key: 'PROCESSING', label: 'Đang chuẩn bị' },
                              { key: 'SHIPPED', label: 'Đang giao hàng' },
                              { key: 'DELIVERED', label: 'Đã giao hàng' }
                            ].map((step, index) => {
                              const status = (trackingOrder.order_status || '').toUpperCase()
                              let currentStepIndex = 0
                              if (status.includes('SUCCESS')) currentStepIndex = 3
                              else if (status.includes('PENDING')) currentStepIndex = 1
                              else if (status.includes('FAILED') || status.includes('CANCELLED') || status.includes('CANCEL')) currentStepIndex = -1 // Không hoàn thành bước nào nếu đã hủy
                              
                              const isCompleted = index <= currentStepIndex && currentStepIndex >= 0
                              return (
                                <div
                                  key={step.key}
                                  className="flex flex-col items-center flex-1"
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                      isCompleted
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'bg-white border-gray-300 text-gray-400'
                                    }`}
                                  >
                                    {index + 1}
                                  </div>
                                  <p className="mt-2 text-xs font-medium text-gray-700 text-center">
                                    {step.label}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Lịch sử trạng thái đơn hàng
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-[#F3F3F3]">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Mô tả
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Ngày
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Thời gian
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Ghi chú
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr>
                              <td className="px-6 py-3 text-gray-800">Đã đặt hàng</td>
                              <td className="px-6 py-3 text-gray-700">
                                {trackingOrder.createdAt ? new Date(trackingOrder.createdAt).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                }) : 'N/A'}
                              </td>
                              <td className="px-6 py-3 text-gray-700">
                                {trackingOrder.createdAt ? new Date(trackingOrder.createdAt).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'N/A'}
                              </td>
                              <td className="px-6 py-3 text-gray-500">
                                Đơn hàng đã được tạo thành công.
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-3 text-gray-800">Đang chuẩn bị</td>
                              <td className="px-6 py-3 text-gray-700">
                                {trackingOrder.createdAt ? new Date(trackingOrder.createdAt).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                }) : 'N/A'}
                              </td>
                              <td className="px-6 py-3 text-gray-700">—</td>
                              <td className="px-6 py-3 text-gray-500">
                                Đơn hàng đang được chuẩn bị.
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-3 text-gray-800">Đang giao hàng</td>
                              <td className="px-6 py-3 text-gray-700">—</td>
                              <td className="px-6 py-3 text-gray-700">—</td>
                              <td className="px-6 py-3 text-gray-500">
                                Sẽ được cập nhật khi đơn giao cho đơn vị vận chuyển.
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-3 text-gray-800">Đã giao hàng</td>
                              <td className="px-6 py-3 text-gray-700">—</td>
                              <td className="px-6 py-3 text-gray-700">—</td>
                              <td className="px-6 py-3 text-gray-500">
                                Sẽ được cập nhật khi đơn được giao thành công.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === 'detail' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Chi tiết đơn hàng</h2>
                    <p className="text-sm text-gray-500">
                      Xem thông tin chi tiết về đơn hàng của bạn
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('order')
                      setOrderDetail(null)
                      setSelectedOrderId(null)
                    }}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    ← Quay lại
                  </button>
                </div>

                {orderDetailLoading && (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-gray-500">Đang tải...</p>
                  </div>
                )}

                {!orderDetailLoading && !orderDetail && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <p className="text-gray-700 font-semibold mb-2">
                      Không tìm thấy đơn hàng
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('order')
                        setOrderDetail(null)
                        setSelectedOrderId(null)
                      }}
                      className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                    >
                      Quay lại danh sách đơn hàng
                    </button>
                  </div>
                )}

                {!orderDetailLoading && orderDetail && (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Đơn hàng #{orderDetail.orderId?.split('-')[1]?.slice(0, 5) || orderDetail._id?.slice(-5) || 'N/A'}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {(() => {
                          const date = orderDetail.createdAt ? new Date(orderDetail.createdAt) : null
                          if (!date) return 'N/A'
                          const day = String(date.getDate()).padStart(2, '0')
                          const month = String(date.getMonth() + 1).padStart(2, '0')
                          const year = date.getFullYear()
                          const hours = String(date.getHours()).padStart(2, '0')
                          const minutes = String(date.getMinutes()).padStart(2, '0')
                          return `${day}/${month}/${year} ${hours}:${minutes}`
                        })()}
                        {' / '}
                        {orderDetail.product_details?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0} sản phẩm
                        {' / Tổng '}
                        {DisplayPriceInVND(orderDetail.totalAmt || 0)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column - Items */}
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                        <div className="bg-teal-600 text-white px-4 py-3">
                          <span className="font-semibold text-sm uppercase">Sản phẩm</span>
                        </div>

                        <div className="overflow-x-auto">
                          <div className="max-h-[400px] overflow-y-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sản phẩm</th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Số lượng</th>
                                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Giá</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {orderDetail.product_details && orderDetail.product_details.length > 0 
                                  ? orderDetail.product_details.map((product, index) => {
                                    let productImage = null;
                                    
                                    if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
                                      productImage = product.image;
                                    } else if (orderDetail.productId && orderDetail.productId[index]) {
                                      const populatedProduct = orderDetail.productId[index];
                                      if (populatedProduct.image) {
                                        if (Array.isArray(populatedProduct.image) && populatedProduct.image.length > 0) {
                                          productImage = populatedProduct.image[0];
                                        } else if (typeof populatedProduct.image === 'string') {
                                          productImage = populatedProduct.image;
                                        }
                                      }
                                    }

                                    return (
                                      <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                          <div className="flex items-center gap-3">
                                            {productImage ? (
                                              <img
                                                src={productImage}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded"
                                                onError={(e) => {
                                                  e.target.style.display = 'none';
                                                }}
                                              />
                                            ) : (
                                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center"></div>
                                            )}
                                            <span className="text-sm font-medium text-gray-800">{product.name || 'N/A'}</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                                          {product.qty || 1}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-800">
                                          {DisplayPriceInVND(product.price || 0)}
                                        </td>
                                      </tr>
                                    );
                                  })
                                  : (
                                    <tr>
                                      <td colSpan="3" className="px-4 py-8 text-center text-gray-500">Không có sản phẩm</td>
                                    </tr>
                                  )
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="px-4 py-4 border-t border-gray-200 space-y-2 bg-white">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Tổng phụ</span>
                            <span>{DisplayPriceInVND(orderDetail.subTotalAmt || 0)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Vận chuyển</span>
                            <span>{DisplayPriceInVND((orderDetail.totalAmt || 0) - (orderDetail.subTotalAmt || 0))}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-teal-600 pt-2 border-t border-gray-200">
                            <span>Tổng tiền</span>
                            <span>{DisplayPriceInVND(orderDetail.totalAmt || 0)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Summary, Shipping, Payment */}
                      <div className="space-y-4">
                        {/* Order Summary Box */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">Tóm tắt</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Mã đơn hàng:</span>
                              <span className="font-medium text-gray-800">{orderDetail.orderId || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ngày đặt hàng:</span>
                              <span className="font-medium text-gray-800">
                                {orderDetail.createdAt ? new Date(orderDetail.createdAt).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                }) : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Trạng thái:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(orderDetail.order_status)}`}>
                                {getDeliveryStatusText(orderDetail.order_status)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tổng đơn hàng:</span>
                              <span className="font-medium text-gray-800">{DisplayPriceInVND(orderDetail.totalAmt || 0)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">Địa chỉ giao hàng</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="font-medium text-gray-800">{orderDetail.delivery_address?.name || 'N/A'}</p>
                            {orderDetail.delivery_address?.address_line && (
                              <p>{orderDetail.delivery_address.address_line}</p>
                            )}
                            <p>
                              {[
                                orderDetail.delivery_address?.ward,
                                orderDetail.delivery_address?.district,
                                orderDetail.delivery_address?.province
                              ].filter(Boolean).join(', ') || 'N/A'}
                            </p>
                            <p>Số điện thoại: {orderDetail.delivery_address?.mobile || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Expected Date Of Delivery */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">Ngày giao hàng dự kiến</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {(() => {
                              if (!orderDetail.createdAt) return 'N/A'
                              const deliveryDate = new Date(orderDetail.createdAt)
                              deliveryDate.setDate(deliveryDate.getDate() + 3)
                              return deliveryDate.toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })
                            })()}
                          </p>
                          <button
                            className="text-teal-600 hover:text-teal-700 text-sm font-medium underline"
                            onClick={() => {
                              setActiveTab('tracking')
                              setTrackingOrder(orderDetail)
                              loadTrackingOrder(orderDetail._id)
                            }}
                          >
                            Theo dõi đơn hàng
                          </button>
                        </div>

                        {/* Review Button - Only show if status is SUCCESS */}
                        {getDeliveryStatusText(orderDetail.order_status) === 'Thành công' && (
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Đánh giá sản phẩm</h3>
                            <p className="text-sm text-gray-600 mb-3">
                              Chia sẻ trải nghiệm của bạn về các sản phẩm trong đơn hàng này
                            </p>
                            <button
                              className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                              onClick={() => {
                                setActiveTab('review')
                              }}
                            >
                              Đánh giá sản phẩm
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === 'review' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Đánh giá sản phẩm</h2>
                    <p className="text-sm text-gray-500">
                      Hãy chia sẻ trải nghiệm của bạn về các sản phẩm trong đơn hàng
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('order')
                      setOrderDetail(null)
                      setSelectedOrderId(null)
                      setReviews({})
                    }}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    ← Quay lại
                  </button>
                </div>

                {orderDetailLoading && (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-gray-500">Đang tải...</p>
                  </div>
                )}

                {!orderDetailLoading && !orderDetail && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <p className="text-gray-700 font-semibold mb-2">
                      Không tìm thấy đơn hàng
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('order')
                        setOrderDetail(null)
                        setSelectedOrderId(null)
                        setReviews({})
                      }}
                      className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                    >
                      Quay lại danh sách đơn hàng
                    </button>
                  </div>
                )}

                {!orderDetailLoading && orderDetail && orderDetail.product_details && orderDetail.product_details.length > 0 && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Đơn hàng #{orderDetail.orderId?.split('-')[1]?.slice(0, 5) || orderDetail._id?.slice(-5) || 'N/A'}
                      </h3>
                      <div className="space-y-6">
                        {orderDetail.product_details.map((product, index) => {
                          const productId = product.productId
                          const currentReview = reviews[productId] || { rating: 0, comment: '' }

                          return (
                            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                              <div className="flex items-start gap-4 mb-4">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded border border-gray-200"
                                    onError={(e) => {
                                      e.target.src = '/no-image.png'
                                    }}
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">Không có ảnh</span>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800 mb-1">{product.name || 'N/A'}</h4>
                                  <p className="text-sm text-gray-600">Số lượng: {product.qty || 1}</p>
                                  <p className="text-sm font-medium text-teal-600 mt-1">
                                    {DisplayPriceInVND(product.price || 0)}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đánh giá sản phẩm
                                  </label>
                                  <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => {
                                          setReviews({
                                            ...reviews,
                                            [productId]: {
                                              ...currentReview,
                                              rating: star
                                            }
                                          })
                                        }}
                                        className={`text-2xl transition-colors ${
                                          star <= currentReview.rating
                                            ? 'text-yellow-400'
                                            : 'text-gray-300 hover:text-yellow-300'
                                        }`}
                                      >
                                        ★
                                      </button>
                                    ))}
                                    {currentReview.rating > 0 && (
                                      <span className="text-sm text-gray-600 ml-2">
                                        ({currentReview.rating}/5)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nhận xét (tùy chọn)
                                  </label>
                                  <textarea
                                    value={currentReview.comment}
                                    onChange={(e) => {
                                      setReviews({
                                        ...reviews,
                                        [productId]: {
                                          ...currentReview,
                                          comment: e.target.value
                                        }
                                      })
                                    }}
                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                                    rows={3}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setActiveTab('order')
                            setReviews({})
                          }}
                          className="px-6 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              setReviewLoading(true)
                              // TODO: Call API to submit reviews
                              // For now, just show success message
                              alert('Cảm ơn bạn đã đánh giá sản phẩm!')
                              setReviews({})
                              setActiveTab('order')
                            } catch (error) {
                              alert('Có lỗi xảy ra khi gửi đánh giá')
                            } finally {
                              setReviewLoading(false)
                            }
                          }}
                          disabled={reviewLoading || Object.values(reviews).every(r => r.rating === 0)}
                          className="px-6 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {reviewLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!orderDetailLoading && orderDetail && (!orderDetail.product_details || orderDetail.product_details.length === 0) && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <p className="text-gray-700 font-semibold">
                      Đơn hàng không có sản phẩm để đánh giá
                    </p>
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


