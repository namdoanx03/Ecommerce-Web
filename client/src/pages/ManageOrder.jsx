import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'

const ManageOrder = () => {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrderData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getOrderItems
      })

      console.log('Order API Response:', response)
      const { data: responseData } = response
      console.log('Order Data:', responseData)

      if (responseData.success) {
        // Filter by search
        let filteredData = responseData.data || []
        console.log('Filtered Data Length:', filteredData.length)
        // Debug: Log first order to check data structure
        if (filteredData.length > 0) {
          console.log('First Order Data:', {
            product_details: filteredData[0].product_details,
            productId: filteredData[0].productId,
            hasImage: filteredData[0].product_details?.[0]?.image
          })
        }
        
        if (search) {
          filteredData = filteredData.filter(order => 
            order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
            order.delivery_address?.name?.toLowerCase().includes(search.toLowerCase()) ||
            order.delivery_address?.mobile?.toString().includes(search) ||
            order.delivery_address?.email?.toLowerCase().includes(search.toLowerCase())
          )
        }
        
        // Calculate pagination
        const limit = 10
        const totalCount = filteredData.length
        const totalPageCount = Math.ceil(totalCount / limit) || 1
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedData = filteredData.slice(startIndex, endIndex)
        
        console.log('Setting order data:', paginatedData)
        setTotalPageCount(totalPageCount)
        setOrderData(paginatedData)
        setTotalCount(totalCount)
      } else {
        console.error('API returned success: false', responseData)
        setOrderData([])
        setTotalCount(0)
        setTotalPageCount(1)
      }

    } catch (error) {
      console.error('Error fetching orders:', error)
      AxiosToastError(error)
      setOrderData([])
      setTotalCount(0)
      setTotalPageCount(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [page, search])

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = () => {
    if (page > 1) {
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  const handleViewOrder = (order) => {
    navigate(`/dashboard/order-detail/${order._id}`)
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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12
    return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`
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

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1)
  }, [search])

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      {/* Main Content Container - White Background */}
      <div className='bg-white rounded-lg shadow-sm p-6 sm:p-8'>
        {/* Header Section */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className="text-2xl font-semibold text-gray-800">Tất cả đơn hàng</h1>
            {/* Search Bar - Top right */}
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

        {/* Table Section */}
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-[#F3F3F3] border-b border-gray-200'>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Ảnh đơn hàng</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Mã đơn hàng</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Ngày</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Phương thức thanh toán</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Trạng thái giao hàng</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Tổng tiền</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Tùy chọn</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : orderData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">Không tìm thấy đơn hàng</td>
                </tr>
              ) : (
                orderData.map((order) => {
                  // Try to get image from product_details first, then from populated productId
                  let firstProductImage = null;
                  
                  if (order.product_details && order.product_details.length > 0) {
                    const productDetail = order.product_details[0];
                    // Check if image exists and is not empty string
                    if (productDetail.image && productDetail.image.trim() !== '') {
                      firstProductImage = productDetail.image;
                    }
                  }
                  
                  // Fallback to populated productId if product_details image is not available
                  if (!firstProductImage && order.productId && order.productId.length > 0) {
                    const firstProduct = order.productId[0];
                    if (firstProduct.image && Array.isArray(firstProduct.image) && firstProduct.image.length > 0) {
                      firstProductImage = firstProduct.image[0];
                    } else if (firstProduct.image && typeof firstProduct.image === 'string') {
                      firstProductImage = firstProduct.image;
                    }
                  }
                  
                  return (
                    <tr
                      key={order._id}
                      className='hover:bg-gray-50 transition-colors'
                    >
                      <td className='p-4 text-center'>
                        <div className='flex items-center justify-center'>
                          {firstProductImage ? (
                            <img
                              src={firstProductImage}
                              alt="Order"
                              className='w-16 h-16 object-cover rounded border border-gray-200'
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center ${firstProductImage ? 'hidden' : ''}`}
                          >
                            <span className='text-gray-400 text-xs'>Không có ảnh</span>
                          </div>
                        </div>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='font-medium text-gray-800'>
                          {order.orderId || 'N/A'}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-gray-600'>
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-gray-600'>
                          {getPaymentMethod(order.payment_status)}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getDeliveryStatusColor(order.payment_status)}`}>
                          {getDeliveryStatusText(order.payment_status)}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='font-medium text-gray-800'>
                          {DisplayPriceInVND(order.totalAmt || 0)}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <div className='flex items-center justify-center gap-3'>
                          <button
                            title='Xem'
                            className='text-gray-400 hover:text-blue-600 transition-colors'
                            onClick={() => handleViewOrder(order)}
                          >
                            <FaEye size={18} />
                          </button>
                          <button
                            title='Sửa'
                            className='text-gray-400 hover:text-yellow-600 transition-colors'
                            onClick={() => {
                              // TODO: Implement edit order
                              toast.info('Chức năng sửa đơn hàng sắp có')
                            }}
                          >
                            <TbEdit size={18} />
                          </button>
                          <button
                            title='Xóa'
                            className='text-gray-400 hover:text-red-600 transition-colors'
                            onClick={() => {
                              // TODO: Implement delete order
                              toast.info('Chức năng xóa đơn hàng sắp có')
                            }}
                          >
                            <FaRegTrashCan size={18} />
                          </button>
                          <button
                            className='px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors'
                            onClick={() => {
                              // TODO: Implement tracking
                              toast.info('Chức năng theo dõi đơn hàng sắp có')
                            }}
                          >
                            Theo dõi
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {loading && (
          <Loading />
        )}

        {/* Pagination */}
        {totalCount > 10 && (
          <div className='flex items-center justify-between px-2 mt-8'>
            <span className='text-gray-600 text-sm'>
              {`Hiển thị ${(page - 1) * 10 + 1} đến ${Math.min(page * 10, totalCount)} trong tổng số ${totalCount} kết quả`}
            </span>
            <div className='flex items-center gap-1 rounded-lg border bg-white'>
              <button onClick={handlePrevious} disabled={page === 1} className={`px-2 py-1 rounded-l-lg ${page === 1 ? 'text-gray-300' : 'text-blue-500 hover:bg-blue-50'}`}>&lt;</button>
              {Array.from({ length: totalPageCount }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 ${page === i + 1 ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={handleNext} disabled={page === totalPageCount} className={`px-2 py-1 rounded-r-lg ${page === totalPageCount ? 'text-gray-300' : 'text-blue-500 hover:bg-blue-50'}`}>&gt;</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ManageOrder
