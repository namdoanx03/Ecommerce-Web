import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NoData from '../components/NoData'
import { setOrder } from '../store/orderSlice'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { FaHome } from "react-icons/fa";
const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const dispatch = useDispatch()
  const allProducts = useSelector(state => state.product.data || state.product.allProducts || []);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderIdToCancel, setOrderIdToCancel] = useState(null);
  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getOrderItems })
      if (response.data && response.data.success) {
        dispatch(setOrder(response.data.data))
      }
    } catch (error) {
      // Có thể thêm thông báo lỗi nếu cần
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [dispatch])
  // console.log("order Items",orders)

  function getProductImage(productId) {
    const prod = allProducts.find(p => p._id === productId);
    return prod && prod.image && prod.image[0] ? prod.image[0] : "/no-image.png";
  }

  const handleCancelOrder = async () => {
    if (!orderIdToCancel) return;
    try {
      const response = await Axios({
        ...SummaryApi.deleteOrder,
        data: { _id: orderIdToCancel }
      });
      if (response.data && response.data.success) {
        toast.success("Đã hủy đơn hàng!");
        fetchOrders();
      } else {
        toast.error(response.data.message || "Hủy đơn thất bại!");
      }
    } catch (error) {
      toast.error("Hủy đơn thất bại!");
    } finally {
      setShowCancelModal(false);
      setOrderIdToCancel(null);
    }
  };

  return (
    <div>
      <div className='bg-white shadow-md p-5 text-lg font-semibold flex items-center gap-6'>
        <button onClick={() => navigate('/')}><FaHome className='text-2xl' /></button>
        <h2>Đơn hàng của tôi</h2>
      </div>
      {
        (!orders || orders.length === 0) && (
          <NoData />
        )
      }
      {
        orders && orders.map((order, index) => (
          <div key={order._id + index + "order"} className='order rounded p-4 text-sm border mb-4'>
            <div className='flex justify-between items-center mb-2  '>
              <p className='font-semibold'>Mã đơn: {order?.orderId}</p>
              <div>
              <span className='text-xs px-2 py-1 rounded bg-blue-100 text-blue-700'>{order.order_status || 'Chờ xử lý'}</span>  
              </div>
              <div>
                <span className='text-xs text-gray-500'>Thời gian đặt hàng: {new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div>
              <button
                onClick={() => { setShowCancelModal(true); setOrderIdToCancel(order._id); }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 ml-2"
              >
                Hủy đơn
              </button>
              </div>
            </div>
            <div className='mb-2'>Tổng tiền: <span className='font-bold text-red-600 text-lg'>{order.totalAmt?.toLocaleString()} đ</span></div>
            <div className='flex flex-wrap gap-4'>
              {order.product_details && order.product_details.map((prod, idx) => (
                <div key={prod._id || idx} className='flex gap-3 items-center border p-2 rounded'>
                  <img
                    src={getProductImage(prod.productId || prod._id)}
                    className='w-14 h-14 object-cover rounded'
                    alt={prod.name}
                  />
                  <div>
                    <p className='font-medium'>{prod.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      }
      {/* Modal xác nhận hủy đơn */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
            <h2 className="text-lg font-semibold mb-4">Xác nhận hủy đơn hàng</h2>
            <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowCancelModal(false); setOrderIdToCancel(null); }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Không
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrders
