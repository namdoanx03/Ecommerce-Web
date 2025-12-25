import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'

const Success = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { fetchCartItem } = useGlobalContext()

  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null)

  // Lấy lại giỏ hàng rỗng và fetch đơn hàng mới nhất để hiển thị
  useEffect(() => {
    // Chỉ chạy một lần khi mount để tránh gọi API lặp lại
    if (fetchCartItem) {
      fetchCartItem()
    }

    const fetchLatestOrder = async () => {
      try {
        setLoading(true)
        const response = await Axios({
          ...SummaryApi.getOrderItems
        })
        const { data: responseData } = response

        if (responseData?.success && Array.isArray(responseData.data) && responseData.data.length > 0) {
          // API đã sort createdAt: -1 nên phần tử đầu là đơn mới nhất
          setOrder(responseData.data[0])
        }
      } catch (error) {
        AxiosToastError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestOrder()
  }, [])

  const titleText = location?.state?.text === 'Order'
    ? 'Đặt hàng thành công'
    : 'Thanh toán thành công'

  const descriptionText = 'Thanh toán thành công, đơn hàng của bạn đang được xử lý.'

  const items = order?.product_details || []
  const address = order?.delivery_address
  const subTotal = Number(order?.subTotalAmt || 0)
  const total = Number(order?.totalAmt || 0)
  const couponDiscount = subTotal > total ? subTotal - total : 0
  const totalItems = items.reduce((sum, item) => sum + (item.qty || 1), 0)

  const getPaymentMethodText = (method) => {
    if (!method) return '—'
    const m = method.toUpperCase()
    if (m.includes('CASH')) return 'Thanh toán khi nhận hàng (COD)'
    if (m.includes('VNPAY')) return 'Thanh toán bằng VNPay'
    return method
  }

  if (loading && !order) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow rounded-2xl px-8 py-10 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
          <p className="text-gray-600 text-sm">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Success */}
        <div className="bg-white rounded-2xl shadow-sm px-6 sm:px-10 py-10 text-center mb-10">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-3xl">
                ✓
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {titleText}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-2">
            {descriptionText}
          </p>
          {order?.orderId && (
            <p className="text-xs sm:text-sm text-gray-400">
              Mã đơn hàng:&nbsp;
              <span className="font-medium text-gray-700">{order.orderId}</span>
            </p>
          )}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-[2fr,1fr] gap-6 items-start">
          {/* Order items table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Chi tiết đơn hàng
              </h2>
              <span className="text-sm text-gray-500">
                {totalItems} sản phẩm
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {items.length === 0 && (
                <div className="px-6 py-6 text-center text-gray-500 text-sm">
                  Không tìm thấy sản phẩm trong đơn hàng.
                </div>
              )}

              {items.map((item, index) => {
                // Lấy ảnh từ product_details hoặc productId đã populate
                let image = item.image || ''
                if (!image && Array.isArray(order?.productId) && order.productId[index]) {
                  const p = order.productId[index]
                  if (Array.isArray(p.image) && p.image.length > 0) {
                    image = p.image[0]
                  } else if (typeof p.image === 'string') {
                    image = p.image
                  }
                }

                const qty = item.qty || 1
                const price = Number(item.price || 0)
                const lineTotal = price * qty

                return (
                  <div key={index} className="px-6 py-4 flex items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      ) : (
                        <span className="text-xs text-gray-400 text-center px-2">
                          Không có ảnh
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Số lượng: <span className="font-medium text-gray-700">{qty}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-sm flex-shrink-0">
                      <span className="text-gray-500">Đơn giá</span>
                      <span className="font-semibold text-gray-900">
                        {DisplayPriceInVND(price)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Thành tiền: <span className="font-semibold text-emerald-600">{DisplayPriceInVND(lineTotal)}</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right side summary cards */}
          <div className="space-y-4">
            {/* Price details */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Chi tiết giá</h3>
                {items.length > 0 && (
                  <span className="text-xs text-gray-500">({items.length} mục)</span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="text-gray-800">{DisplayPriceInVND(subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Giảm giá</span>
                  <span className={couponDiscount > 0 ? 'text-emerald-600' : 'text-gray-800'}>
                    {couponDiscount > 0 ? `- ${DisplayPriceInVND(couponDiscount)}` : DisplayPriceInVND(0)}
                  </span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-3" />
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Tổng cộng</span>
                  <span>{DisplayPriceInVND(total || subTotal)}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Địa chỉ giao hàng</h3>
              {address ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-semibold">{address.name}</p>
                  <p>{address.address_line}</p>
                  <p>{[address.ward, address.district, address.province].filter(Boolean).join(', ')}</p>
                  {address.mobile && (
                    <p className="text-gray-500">SĐT: {address.mobile}</p>
                  )}
                  {address.email && (
                    <p className="text-gray-500">Email: {address.email}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Không tìm thấy thông tin địa chỉ.</p>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Phương thức thanh toán</h3>
              <p className="text-sm text-gray-700 mb-2">
                {getPaymentMethodText(order?.payment_method)}
              </p>
              <p className="text-xs text-gray-500">
                Thông tin chi tiết đơn hàng đã được gửi tới email của bạn. Nếu có bất kỳ thắc mắc nào,
                vui lòng liên hệ bộ phận hỗ trợ khách hàng.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => navigate('/product')}
                className="w-full py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
              <Link
                to="/myorders"
                className="w-full text-center py-2.5 text-sm font-semibold border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Xem lịch sử đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Success
