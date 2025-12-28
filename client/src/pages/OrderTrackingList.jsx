import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'
import { IoSearchOutline } from "react-icons/io5";

const OrderTrackingList = () => {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchOrderData()
  }, [])

  useEffect(() => {
    // Filter orders by search
    if (search) {
      const filtered = orderData.filter(order => 
        order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
        order.delivery_address?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.delivery_address?.mobile?.toString().includes(search) ||
        order.delivery_address?.email?.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orderData)
    }
  }, [search, orderData])

  const fetchOrderData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getOrderItems
      })

      const { data: responseData } = response

      if (responseData.success) {
        setOrderData(responseData.data || [])
        setFilteredOrders(responseData.data || [])
      } else {
        setOrderData([])
        setFilteredOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      AxiosToastError(error)
      setOrderData([])
      setFilteredOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setSearch(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
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
      return 'Đang xử lý';
    } else if (status.includes('FAILED') || status.includes('CANCELLED') || status.includes('CANCEL')) {
      return 'Đã hủy';
    }
    return 'Đang xử lý';
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <div className='bg-white rounded-lg shadow-sm p-6 sm:p-8'>
        {/* Header Section */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className="text-2xl font-semibold text-gray-800">Theo dõi đơn hàng</h1>
            {/* Search Bar */}
            <div className='flex items-center gap-2'>
              <label className='text-sm text-gray-700 font-medium'>Tìm kiếm:</label>
              <div className='max-w-md bg-white px-4 flex items-center gap-3 py-2 rounded-lg border border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200'>
                <IoSearchOutline size={20} className='text-gray-400' />
                <input
                  type='text'
                  placeholder='Tìm kiếm đơn hàng...'
                  className='h-full w-full outline-none bg-transparent text-sm'
                  value={search}
                  onChange={handleOnChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <Loading />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Không tìm thấy đơn hàng
            </div>
          ) : (
            filteredOrders.map((order) => {
              // Get first product image
              let firstProductImage = null;
              
              if (order.product_details && order.product_details.length > 0) {
                const productDetail = order.product_details[0];
                if (productDetail.image && productDetail.image.trim() !== '') {
                  firstProductImage = productDetail.image;
                }
              }
              
              if (!firstProductImage && order.productId && order.productId.length > 0) {
                const firstProduct = order.productId[0];
                if (firstProduct.image && Array.isArray(firstProduct.image) && firstProduct.image.length > 0) {
                  firstProductImage = firstProduct.image[0];
                } else if (firstProduct.image && typeof firstProduct.image === 'string') {
                  firstProductImage = firstProduct.image;
                }
              }

              return (
                <div
                  key={order._id}
                  className='bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all cursor-pointer'
                  onClick={() => navigate(`/dashboard/order-tracking/${order._id}`)}
                >
                  <div className='flex items-start gap-4 mb-4'>
                    {firstProductImage ? (
                      <img
                        src={firstProductImage}
                        alt="Order"
                        className='w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0'
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80"
                        }}
                      />
                    ) : (
                      <div className='w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0'>
                        <span className='text-gray-400 text-xs'>N/A</span>
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-gray-800 mb-1 truncate'>
                        {order.orderId || 'N/A'}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {formatDate(order.createdAt)}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(order.order_status)}`}>
                        {getDeliveryStatusText(order.order_status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className='space-y-2 border-t border-gray-200 pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs text-gray-500'>Số lượng sản phẩm:</span>
                      <span className='text-sm font-medium text-gray-800'>
                        {order.product_details?.length || order.productId?.length || 0}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs text-gray-500'>Tổng tiền:</span>
                      <span className='text-sm font-semibold text-teal-600'>
                        {DisplayPriceInVND(order.totalAmt || 0)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    className='w-full mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors'
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/dashboard/order-tracking/${order._id}`)
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingList

