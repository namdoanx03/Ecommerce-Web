import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiShoppingBag, FiHeart, FiCreditCard, FiMapPin, FiUser, FiDownload, FiShield } from 'react-icons/fi'
import AddAddress from '../components/AddAddress'
import { MdDelete, MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import { useAddress } from '../hooks/useAddress';
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'

const Address = () => {
  const user = useSelector(state => state.user)
  const addressList = useSelector(state => state.addresses.addressList)
  const navigate = useNavigate()
  const { fetchAddress, deleteAddress } = useAddress()
  
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)

  useEffect(() => {
    fetchAddress()
  }, [])

  const handleDeleteClick = (id) => {
    setAddressToDelete(id)
    setShowDeleteConfirm(true)
  }

  const handleDisableAddress = async () => {
    const success = await deleteAddress(addressToDelete)
    if (success) {
      setShowDeleteConfirm(false)
      setAddressToDelete(null)
    }
  }

  const handleEditClick = (address) => {
    setEditData(address)
    setOpenEdit(true)
  }

  const name = user.name || 'User'

  // Get address label (Home, Office, etc.) - can be enhanced with a label field in the future
  const getAddressLabel = (index) => {
    const labels = ['Home', 'Office', 'Neighbour', 'Home 2']
    return labels[index % labels.length]
  }

  const getLabelColor = (label) => {
    const colors = {
      'Home': 'bg-emerald-500',
      'Office': 'bg-emerald-400',
      'Neighbour': 'bg-emerald-600',
      'Home 2': 'bg-emerald-500'
    }
    return colors[label] || 'bg-emerald-500'
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header / Breadcrumb */}
      <div className="bg-[#F8F8F8] border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-5 sm:py-7 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700">User Dashboard</h2>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 hover:text-emerald-600">
              <FiHome className="w-4 h-4" />
              <span>Home</span>
            </button>
            <span className="text-gray-400">&gt;</span>
            <span className="font-medium">Address Book</span>
          </div>
        </div>
      </div>

      {/* Main content */}
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
                className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 text-gray-700"
              >
                <FiHeart className="w-4 h-4" />
                <span>Wishlist</span>
              </button>
              <button
                onClick={() => navigate('/address')}
                className="w-full flex items-center gap-3 px-6 py-3.5 text-emerald-600 bg-emerald-50 font-semibold"
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

        {/* Right main panel - Address Book */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">My Address Book</h2>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-0.5 bg-emerald-600"></div>
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setOpenAddress(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>+ Add New Address</span>
              </button>
            </div>

            {/* Address Grid */}
            {addressList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào.</p>
                <button
                  onClick={() => setOpenAddress(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Thêm địa chỉ đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addressList.filter(addr => addr.status).map((address, index) => {
                  const label = getAddressLabel(index)
                  const isSelected = selectedAddress === address._id
                  
                  return (
                    <div
                      key={address._id}
                      className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                    >
                      {/* Radio button, Name, and Label in one row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="address"
                            checked={isSelected}
                            onChange={() => setSelectedAddress(address._id)}
                            className={`w-4 h-4 ${isSelected ? 'text-emerald-600 border-emerald-600' : 'text-gray-400 border-gray-300'} focus:ring-emerald-500`}
                          />
                          <h3 className="font-semibold text-gray-800 text-base">{address.name || 'N/A'}</h3>
                        </div>
                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium text-white ${getLabelColor(label)}`}>
                          {label}
                        </span>
                      </div>

                      {/* Address - Full address on one line */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {address.address_line}
                          {address.ward && `, ${address.ward}`}
                          {address.district && `, ${address.district}`}
                          {address.province && `, ${address.province}`}
                        </p>
                      </div>

                      {/* Email and Phone */}
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        {address.email && (
                          <p>
                            <span className="font-medium">Email:</span> {address.email}
                          </p>
                        )}
                        {address.mobile && (
                          <p>
                            <span className="font-medium">Phone:</span> +{address.mobile}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleEditClick(address)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          <MdEdit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(address._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <MdDelete className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {openAddress && (
        <AddAddress close={() => setOpenAddress(false)} />
      )}

      {OpenEdit && (
        <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md mx-4">
            <div className="p-4 pb-2 flex justify-between items-center">
              <h1 className="text-lg text-gray-800 font-semibold">Xác nhận xóa</h1>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 pt-2 text-gray-600">
              Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác.
            </div>
            <div className="p-4 flex justify-end gap-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDisableAddress}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Address
