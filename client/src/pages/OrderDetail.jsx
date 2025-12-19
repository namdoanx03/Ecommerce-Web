import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { IoArrowBack } from "react-icons/io5";
import toast from 'react-hot-toast'
import Loading from '../components/Loading'
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getOrderItems
      })

      const { data: responseData } = response

      if (responseData.success) {
        // Find order by orderId
        const foundOrder = responseData.data?.find(o => o._id === orderId || o.orderId === orderId)
        
        if (foundOrder) {
          // Debug: Log order data to check image structure
          console.log('Order Detail Data:', {
            product_details: foundOrder.product_details,
            productId: foundOrder.productId,
            firstProductImage: foundOrder.product_details?.[0]?.image
          })
          setOrder(foundOrder)
        } else {
          toast.error('Không tìm thấy đơn hàng')
          navigate('/dashboard/manage-order')
        }
      } else {
        toast.error('Không thể tải chi tiết đơn hàng')
        navigate('/dashboard/manage-order')
      }
    } catch (error) {
      AxiosToastError(error)
      navigate('/dashboard/manage-order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail()
    }
  }, [orderId])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day} ${month}, ${year} lúc ${hours}:${minutes}`
  }

  const getPaymentMethod = (paymentStatus) => {
    if (!paymentStatus) return 'N/A';
    const status = paymentStatus.toUpperCase();
    if (status.includes('VNPAY')) {
      return 'VNPay';
    } else if (status.includes('STRIPE')) {
      return 'Stripe';
    } else if (status.includes('CASH ON DELIVERY') || status.includes('COD')) {
      return 'Thanh toán khi nhận hàng';
    } else if (status.includes('PAYPAL')) {
      return 'Paypal';
    }
    return paymentStatus;
  }

  const getDeliveryStatusColor = (paymentStatus) => {
    if (!paymentStatus) return 'bg-gray-100 text-gray-700';
    
    const status = paymentStatus.toUpperCase();
    if (status.includes('VNPAY') || status.includes('STRIPE') || status.includes('CASH ON DELIVERY')) {
      return 'bg-green-100 text-green-700';
    } else if (status.includes('PENDING')) {
      return 'bg-gray-100 text-gray-700';
    } else if (status.includes('FAILED') || status.includes('CANCELLED') || status.includes('CANCEL')) {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-gray-100 text-gray-700';
  }

  const getDeliveryStatusText = (paymentStatus) => {
    if (!paymentStatus) return 'Đang xử lý';
    
    const status = paymentStatus.toUpperCase();
    if (status.includes('VNPAY') || status.includes('STRIPE') || status.includes('CASH ON DELIVERY')) {
      return 'Thành công';
    } else if (status.includes('PENDING')) {
      return 'Đang xử lý';
    } else if (status.includes('FAILED') || status.includes('CANCELLED') || status.includes('CANCEL')) {
      return 'Đã hủy';
    }
    return 'Đang xử lý';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!order) {
    return null
  }

  const totalItems = order.product_details?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0
  const subtotal = order.subTotalAmt || 0
  const shipping = (order.totalAmt || 0) - subtotal - (subtotal * 0.1)
  const tax = subtotal * 0.1
  const total = order.totalAmt || 0

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => {
              if (location.pathname.startsWith('/dashboard')) {
                navigate('/dashboard/manage-order')
              } else {
                navigate(-1)
              }
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <IoArrowBack size={20} />
            <span>Quay lại danh sách đơn hàng</span>
          </button>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Đơn hàng #{order.orderId?.split('-')[1]?.slice(0, 5) || order._id?.slice(-5) || 'N/A'}</h2>
          <p className="text-sm text-gray-600">
            {formatDateTime(order.createdAt)} / {totalItems} sản phẩm / Tổng {DisplayPriceInVND(total)}
          </p>
        </div>

        {/* Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Items */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* ITEMS Header */}
            <div className="bg-teal-600 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-sm uppercase">Sản phẩm</span>
              <button className="text-white text-sm font-medium hover:underline">
                SỬA SẢN PHẨM
              </button>
            </div>

            {/* Products List */}
            <div className="border-t-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sản phẩm</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Số lượng</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.product_details && order.product_details.length > 0 
                      ? order.product_details.map((product, index) => {
                          // Try to get image from product_details, then from populated productId
                          let productImage = null;
                          
                          if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
                            productImage = product.image;
                          } else if (order.productId && order.productId[index]) {
                            const populatedProduct = order.productId[index];
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
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div 
                                    className={`w-12 h-12 bg-gray-100 rounded flex items-center justify-center ${productImage ? 'hidden' : ''}`}
                                  ></div>
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

              {/* Financial Breakdown */}
              <div className="px-4 py-4 border-t border-gray-200 space-y-2 bg-white">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tổng phụ</span>
                  <span>{DisplayPriceInVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Vận chuyển</span>
                  <span>{DisplayPriceInVND(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Thuế (VAT)</span>
                  <span>{DisplayPriceInVND(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-teal-600 pt-2 border-t border-gray-200">
                  <span>Tổng tiền</span>
                  <span>{DisplayPriceInVND(total)}</span>
                </div>
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
                  <span className="font-medium text-gray-800">{order.orderId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt hàng:</span>
                  <span className="font-medium text-gray-800">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng đơn hàng:</span>
                  <span className="font-medium text-gray-800">{DisplayPriceInVND(total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Địa chỉ giao hàng</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-800">{order.delivery_address?.name || 'N/A'}</p>
                {order.delivery_address?.address_line && (
                  <p>{order.delivery_address.address_line}</p>
                )}
                <p>
                  {[
                    order.delivery_address?.ward,
                    order.delivery_address?.district,
                    order.delivery_address?.province
                  ].filter(Boolean).join(', ') || 'N/A'}
                </p>
                <p>Số điện thoại: {order.delivery_address?.mobile || 'N/A'}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Phương thức thanh toán</h3>
              <p className="text-sm text-gray-600">
                {getPaymentMethod(order.payment_status) === 'Thanh toán khi nhận hàng' 
                  ? 'Thanh toán khi nhận hàng (Tiền mặt/Thẻ). Chấp nhận thanh toán bằng thẻ/Internet banking tùy thuộc vào thiết bị có sẵn.'
                  : `Phương thức thanh toán ${getPaymentMethod(order.payment_status)}.`
                }
              </p>
            </div>

            {/* Expected Date Of Delivery */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Ngày giao hàng dự kiến</h3>
              <p className="text-sm text-gray-600 mb-2">
                {(() => {
                  const deliveryDate = new Date(order.createdAt)
                  deliveryDate.setDate(deliveryDate.getDate() + 3)
                  return formatDate(deliveryDate.toISOString())
                })()}
              </p>
              <button
                className="text-teal-600 hover:text-teal-700 text-sm font-medium underline"
                onClick={() => {
                  toast.info('Chức năng theo dõi đơn hàng sắp có')
                }}
              >
                Theo dõi đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail

