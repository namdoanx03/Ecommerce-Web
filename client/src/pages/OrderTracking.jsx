import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'

const OrderTracking = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await Axios({ ...SummaryApi.getOrderItems })
        const { data: responseData } = response
        if (responseData.success && Array.isArray(responseData.data)) {
          const found = responseData.data.find(
            (o) => o._id === orderId || o.orderId === orderId
          )
          setOrder(found || null)
        } else {
          setOrder(null)
        }
      } catch (error) {
        AxiosToastError(error)
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const firstProduct = useMemo(
    () => order?.product_details?.[0] || null,
    [order]
  )

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const steps = [
    { key: 'PLACED', label: 'Đã đặt hàng' },
    { key: 'PROCESSING', label: 'Đang chuẩn bị' },
    { key: 'SHIPPED', label: 'Đang giao hàng' },
    { key: 'DELIVERED', label: 'Đã giao hàng' }
  ]

  const currentStepIndex = useMemo(() => {
    const status = (order?.order_status || '').toUpperCase()
    if (status.includes('SUCCESS')) return 3
    if (status.includes('PENDING')) return 1
    if (status.includes('FAILED') || status.includes('CANCEL')) return 1
    return 0
  }, [order])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50">
        <Loading />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow p-8 text-center max-w-md">
          <p className="text-gray-700 font-semibold mb-2">
            Không tìm thấy đơn hàng
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            Quay lại trang tài khoản
          </button>
        </div>
      </div>
    )
  }

  const createdDate = formatDate(order.createdAt)
  const createdTime = formatTime(order.createdAt)

  return (
    <div className="min-h-[calc(100vh-200px)] bg-white">
      {/* Header breadcrumb */}
      <div className="bg-[#F8F8F8] border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-5 sm:py-7 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
            Theo dõi đơn hàng
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <button
              onClick={() => navigate('/')}
              className="hover:text-emerald-600"
            >
              Home
            </button>
            <span className="text-gray-400">&gt;</span>
            <span className="font-medium">Theo dõi đơn hàng</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Product image */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-6">
            <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              {firstProduct?.image ? (
                <img
                  src={firstProduct.image}
                  alt={firstProduct.name}
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
                  {order.orderId}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Ngày đặt
                </p>
                <p className="text-sm text-gray-700">
                  {createdDate} {createdTime}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Trạng thái hiện tại
                </p>
                <p className="text-sm font-semibold text-emerald-600">
                  {steps[currentStepIndex]?.label || 'Processing'}
                </p>
              </div>
            </div>

            {/* Timeline bar */}
            <div className="mt-6">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-4 right-4 top-1/2 h-[2px] bg-gray-200 -z-10" />
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex
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
                  <td className="px-6 py-3 text-gray-700">{createdDate}</td>
                  <td className="px-6 py-3 text-gray-700">{createdTime}</td>
                  <td className="px-6 py-3 text-gray-500">
                    Đơn hàng đã được tạo thành công.
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-gray-800">Đang chuẩn bị</td>
                  <td className="px-6 py-3 text-gray-700">{createdDate}</td>
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
      </div>
    </div>
  )
}

export default OrderTracking


