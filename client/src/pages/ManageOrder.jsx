import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { FaEye } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import toast from 'react-hot-toast'

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
        ...SummaryApi.getOrderItems,
        data: {
          page: page,
          limit: 10,
          search: search
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage)
        setOrderData(responseData.data)
        setTotalCount(responseData.totalCount)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [page])

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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: {
          orderId,
          status: newStatus
        }
      });

      if (response.data.success) {
        toast.success("Cập nhật trạng thái đơn hàng thành công");
        fetchOrderData(); // Refresh order list
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  useEffect(() => {
    let flag = true

    const interval = setTimeout(() => {
      if (flag) {
        fetchOrderData()
        flag = false
      }
    }, 300);

    return () => {
      clearTimeout(interval)
    }
  }, [search])

  return (
    <div className=''>
      <div className='dashboard px-2 bg-[#F8F8F8] min-h-[88vh] sticky top-0'>
        <div className='flex items-center justify-between pt-3 p-4'>
          <h1 className="text-2xl font-semibold text-black">Quản lí đơn hàng</h1>
          <div className='bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-primary-200'>
            <IoSearchOutline size={25} className='text-primary-200' />
            <input
              type='text'
              placeholder='Tìm kiếm đơn hàng...'
              className='h-full w-full outline-none bg-transparent'
              value={search}
              onChange={handleOnChange}
            />
          </div>
        </div>
        <div className="card-item flex gap-6 mt-2 pb-14 justify-center items-center">
          <div className=''>
            <div className='bg-white rounded-xl shadow'>
              <table className='w-[75vw] text-sm'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='p-2'>MÃ ĐƠN HÀNG</th>
                    <th className='p-2'>KHÁCH HÀNG</th>
                    <th className='p-2'>SỐ ĐIỆN THOẠI</th>
                    <th className='p-2'>ĐỊA CHỈ</th>
                    <th className='p-2'>TỔNG TIỀN</th>
                    <th className='p-2'>Hoá đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500 w-full">Không có đơn hàng nào</td>
                    </tr>
                  ) : (
                    orderData.map((order) => (
                      <tr key={order._id} className='bg-white border-b hover:bg-gray-50'>
                        <td className='py-2 px-4 truncate'>{order.orderId}</td>
                        <td className='py-2 px-4 max-w-[200px] truncate'>{order.delivery_address?.name || 'N/A'}</td>
                        <td className='py-2 px-4'>{order.delivery_address?.mobile || 'N/A'}</td>
                        <td className='py-2 px-4 max-w-[200px] truncate'>
                          {order.delivery_address?.address_line}, {order.delivery_address?.ward}, {order.delivery_address?.district}, {order.delivery_address?.province}
                        </td>
                        <td className='py-2 px-4'>{order.totalAmt?.toLocaleString()} đ</td>
                        
                        <td className='py-2 px-4 flex gap-2 items-center justify-center'>
                          <button 
                            onClick={() => handleViewOrder(order)}
                            title='Xem chi tiết' 
                            className='text-gray-500 hover:text-blue-600'
                          >
                            <FaEye />
                          </button>
                          {/* <select
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            value={order.status}
                            className='text-sm border rounded px-2 py-1'
                          >
                            <option value="PENDING">Chờ xử lý</option>
                            <option value="PROCESSING">Đang xử lý</option>
                            <option value="SHIPPED">Đang giao hàng</option>
                            <option value="DELIVERED">Đã giao hàng</option>
                            <option value="CANCELLED">Đã hủy</option>
                          </select> */}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalCount > 10 && (
              <div className='flex items-center justify-between px-2 mt-8'>
                <span className='text-gray-600 text-sm'>
                  {`Hiển thị ${(page - 1) * 10 + 1} đến ${Math.min(page * 10, totalCount)} của ${totalCount} kết quả`}
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
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Thông tin đơn hàng</h3>
                <p>Mã đơn hàng: {selectedOrder.orderId}</p>
                <p>Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p>Trạng thái: {selectedOrder.status}</p>
              </div>
              <div>
                <h3 className="font-medium">Thông tin khách hàng</h3>
                <p>Tên: {selectedOrder.delivery_address?.name || 'N/A'}</p>
                <p>Số điện thoại: {selectedOrder.delivery_address?.mobile || 'N/A'}</p>
                <p>Email: {selectedOrder.delivery_address?.email || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-medium">Địa chỉ giao hàng</h3>
                <p>{selectedOrder.delivery_address?.address_line}</p>
                <p>{selectedOrder.delivery_address?.ward}, {selectedOrder.delivery_address?.district}, {selectedOrder.delivery_address?.province}</p>
              </div>
              <div>
                <h3 className="font-medium">Sản phẩm</h3>
                <div className="space-y-2">
                  {selectedOrder.product_details.map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{product.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Thanh toán</h3>
                <p>Phương thức: {selectedOrder.payment_status}</p>
                <p>Tổng tiền: {selectedOrder.totalAmt?.toLocaleString()} đ</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageOrder
