import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { FaEye } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast'
import Loading from '../components/Loading'

const ManageOrder = () => {
  const [orderData, setOrderData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")
  const [totalCount, setTotalCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    setSelectedOrder(order);
    setShowModal(true);
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const getStatusColor = (paymentStatus) => {
    if (!paymentStatus) return 'bg-gray-100 text-gray-700';
    
    const status = paymentStatus.toLowerCase();
    if (status.includes('pending') || status.includes('chờ')) {
      return 'bg-yellow-100 text-yellow-700';
    } else if (status.includes('processing') || status.includes('đang xử lý')) {
      return 'bg-blue-100 text-blue-700';
    } else if (status.includes('shipped') || status.includes('đang giao')) {
      return 'bg-purple-100 text-purple-700';
    } else if (status.includes('delivered') || status.includes('đã giao') || status.includes('paid') || status.includes('đã thanh toán')) {
      return 'bg-green-100 text-green-700';
    } else if (status.includes('cancelled') || status.includes('hủy')) {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-gray-100 text-gray-700';
  }

  const getStatusText = (paymentStatus) => {
    if (!paymentStatus) return 'N/A';
    
    const status = paymentStatus.toLowerCase();
    if (status.includes('pending') || status.includes('chờ')) {
      return 'Chờ xử lý';
    } else if (status.includes('processing') || status.includes('đang xử lý')) {
      return 'Đang xử lý';
    } else if (status.includes('shipped') || status.includes('đang giao')) {
      return 'Đang giao hàng';
    } else if (status.includes('delivered') || status.includes('đã giao')) {
      return 'Đã giao hàng';
    } else if (status.includes('paid') || status.includes('đã thanh toán')) {
      return 'Đã thanh toán';
    } else if (status.includes('cancelled') || status.includes('hủy')) {
      return 'Đã hủy';
    }
    return paymentStatus;
  }

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1)
  }, [search])

  return (
    <div className=' min-h-screen p-4 sm:p-6'>
      {/* Main Content Container - White Background */}
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6'>
        {/* Header Section */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className="text-2xl font-semibold text-gray-800">All Orders</h1>
          </div>
          {/* Search Bar - Below action buttons */}
          <div className='flex items-center gap-2 justify-end'>
            <label className='text-sm text-gray-700 font-medium'>Search:</label>
            <div className='max-w-md bg-white px-4 flex items-center gap-3 py-2 rounded-lg border border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200'>
              <IoSearchOutline size={20} className='text-gray-400' />
              <input
                type='text'
                placeholder='Search order...'
                className='h-full w-full outline-none bg-transparent text-sm'
                value={search}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-[#F3F3F3] border-b border-gray-200'>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Order ID</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Customer</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Phone</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Total Amount</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Status</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Date</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Option</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">Loading...</td>
                </tr>
              ) : orderData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">No orders found</td>
                </tr>
              ) : (
                orderData.map((order) => (
                  <tr
                    key={order._id}
                    className='hover:bg-gray-50 transition-colors'
                  >
                    <td className='p-4 text-center'>
                      <span className='font-medium text-gray-800'>
                        {order.orderId || 'N/A'}
                      </span>
                    </td>
                    <td className='p-4 text-center'>
                      <span className='text-gray-600'>
                        {order.delivery_address?.name || 'N/A'}
                      </span>
                    </td>
                    <td className='p-4 text-center'>
                      <span className='text-gray-600'>
                        {order.delivery_address?.mobile || 'N/A'}
                      </span>
                    </td>
                    <td className='p-4 text-center'>
                      <span className='font-medium text-gray-800'>
                        {order.totalAmt?.toLocaleString('vi-VN')} đ
                      </span>
                    </td>
                    <td className='p-4 text-center'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.payment_status)}`}>
                        {getStatusText(order.payment_status)}
                      </span>
                    </td>
                    <td className='p-4 text-center'>
                      <span className='text-gray-600'>
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className='p-4 text-center'>
                      <div className='flex items-center justify-center gap-3'>
                        <button
                          title='View'
                          className='text-gray-400 hover:text-blue-600 transition-colors'
                          onClick={() => handleViewOrder(order)}
                        >
                          <FaEye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
              {`Showing ${(page - 1) * 10 + 1} to ${Math.min(page * 10, totalCount)} of ${totalCount} results`}
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

        {/* Order Detail Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
            }
          }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">Chi tiết đơn hàng</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Mã đơn hàng</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                        {selectedOrder.orderId || 'N/A'}
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.payment_status)}`}>
                          {getStatusText(selectedOrder.payment_status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Ngày đặt hàng</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                        {formatDate(selectedOrder.createdAt)}
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                        {selectedOrder.payment_status || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Tên khách hàng</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                        {selectedOrder.delivery_address?.name || 'N/A'}
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                        {selectedOrder.delivery_address?.mobile || 'N/A'}
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                        {selectedOrder.delivery_address?.email || 'N/A'}
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Tổng tiền</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-semibold">
                        {selectedOrder.totalAmt?.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-6 grid gap-1">
                  <label className="text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                    {selectedOrder.delivery_address?.address_line && (
                      <p>{selectedOrder.delivery_address.address_line}</p>
                    )}
                    <p>
                      {[
                        selectedOrder.delivery_address?.ward,
                        selectedOrder.delivery_address?.district,
                        selectedOrder.delivery_address?.province
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-6 grid gap-1">
                  <label className="text-sm font-medium text-gray-700 mb-2">Sản phẩm</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      {selectedOrder.product_details && selectedOrder.product_details.length > 0 ? (
                        selectedOrder.product_details.map((product, index) => (
                          <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0">
                            <div className="flex items-center gap-3">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-800">{product.name}</p>
                                <p className="text-sm text-gray-600">Số lượng: {product.qty || 1}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-800">
                                {product.price?.toLocaleString('vi-VN')} đ
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Không có sản phẩm</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageOrder
