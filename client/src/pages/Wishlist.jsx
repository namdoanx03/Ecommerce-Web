import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiShoppingBag, FiHeart, FiCreditCard, FiMapPin, FiUser, FiDownload, FiShield } from 'react-icons/fi'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'

const Wishlist = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await Axios({ ...SummaryApi.getFavoriteList })
      const { data: responseData } = response
      if (responseData.success) {
        setItems(responseData.data || [])
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user?._id) {
      navigate('/login')
      return
    }
    fetchWishlist()
  }, [user?._id])

  const name = user.name || 'User'

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      {/* Header Section - Title and Breadcrumb */}
      <div className="bg-[#F8F8F8] border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-5 sm:py-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
              User Dashboard
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                <FiHome className="w-4 h-4" />
                <span>Home</span>
              </button>
              <span className="text-gray-400">&gt;</span>
              <span className="font-medium">Wishlist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white min-h-[calc(100vh-100px)]">
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
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 text-gray-700"
                >
                  <FiHome className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => navigate('/myorders')}
                  className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 text-gray-700"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  <span>Order</span>
                </button>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="w-full flex items-center gap-3 px-6 py-3.5 text-emerald-600 bg-emerald-50 font-semibold"
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

          {/* Right main content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Favorite Products</h2>
              
              {loading && (
                <p className="text-sm text-gray-500">Đang tải danh sách yêu thích...</p>
              )}

              {!loading && items.length === 0 && (
                <p className="text-sm text-gray-500">
                  Bạn chưa có sản phẩm yêu thích nào.
                </p>
              )}

              {!loading && items.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 ">
                  {items.map((p) => (
                    <CardProduct key={p._id} data={p} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Wishlist


