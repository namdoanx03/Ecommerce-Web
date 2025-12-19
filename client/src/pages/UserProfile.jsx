import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiShoppingBag, FiHeart, FiCreditCard, FiMapPin, FiUser, FiDownload, FiShield } from 'react-icons/fi'
import { MdEdit } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi"
import { IoCheckmarkCircle } from "react-icons/io5"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { setUserDetails } from '../store/userSlice'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useAddress } from '../hooks/useAddress'

const UserProfile = () => {
  const user = useSelector(state => state.user)
  const addressList = useSelector(state => state.addresses.addressList)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { fetchAddress } = useAddress()
  const [showEditName, setShowEditName] = useState(false)
  const [showEditEmail, setShowEditEmail] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [editName, setEditName] = useState(user.name || '')
  const [editEmail, setEditEmail] = useState(user.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEditAbout, setShowEditAbout] = useState(false)
  const [editMobile, setEditMobile] = useState(user.mobile || '')
  const [editGender, setEditGender] = useState('Female')
  const [editBirthday, setEditBirthday] = useState('21/05/1997')

  const name = user.name || 'User'
  const nameParts = name.split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  // Get default address for display
  const defaultAddress = addressList && addressList.length > 0
    ? addressList.find(addr => addr.status === true) || addressList[0]
    : null

  useEffect(() => {
    fetchAddress()
    setEditMobile(user.mobile || '')
  }, [user])

  const handleUpdateName = async () => {
    if (!editName.trim()) {
      toast.error('Vui lòng nhập tên')
      return
    }
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: { name: editName }
      })
      if (response.data.success) {
        toast.success('Cập nhật tên thành công')
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
        setShowEditName(false)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEmail = async () => {
    if (!editEmail.trim()) {
      toast.error('Vui lòng nhập email')
      return
    }
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: { email: editEmail }
      })
      if (response.data.success) {
        toast.success('Cập nhật email thành công')
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
        setShowEditEmail(false)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không khớp')
      return
    }
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: { password: newPassword }
      })
      if (response.data.success) {
        toast.success('Cập nhật mật khẩu thành công')
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setShowEditPassword(false)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAbout = async () => {
    try {
      setLoading(true)
      const updateData = {
        mobile: editMobile
      }
      if (editName && editName !== user.name) {
        updateData.name = editName
      }
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: updateData
      })
      if (response.data.success) {
        toast.success('Cập nhật thông tin thành công')
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
        setShowEditAbout(false)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
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
            <span className="font-medium">My Profile</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-[#ffffff] min-h-[calc(100vh-100px)]">
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
                className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 text-gray-700"
              >
                <FiMapPin className="w-4 h-4" />
                <span>Address</span>
              </button>
              <button
                onClick={() => navigate('/info')}
                className="w-full flex items-center gap-3 px-6 py-3.5 text-emerald-600 bg-emerald-50 font-semibold"
              >
                <FiUser className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Right main panel - My Profile */}
        <main className="flex-1">
          <div className="bg-[#F8F8F8] rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <button
                onClick={() => setShowEditAbout(true)}
                className="flex items-center gap-1 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <MdEdit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>

            {/* Profile About Section */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Profile About</h3>
                {!showEditAbout && (
                  <button
                    onClick={() => setShowEditAbout(true)}
                    className="flex items-center gap-1 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm"
                  >
                    <MdEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
              {!showEditAbout ? (
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Name:</span> <span className="ml-2">{name}</span>
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span> <span className="ml-2">{editGender}</span>
                  </div>
                  <div>
                    <span className="font-medium">Birthday:</span> <span className="ml-2">{editBirthday}</span>
                  </div>
                  <div>
                    <span className="font-medium">Phone Number:</span> <span className="ml-2 text-emerald-600">+{user.mobile || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Address:</span> <span className="ml-2">
                      {defaultAddress 
                        ? `${defaultAddress.address_line || ''}, ${defaultAddress.ward || ''}, ${defaultAddress.district || ''}, ${defaultAddress.province || ''}`
                        : 'Chưa có địa chỉ'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                    <input
                      type="text"
                      value={editBirthday}
                      onChange={(e) => setEditBirthday(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={handleUpdateAbout}
                      disabled={loading}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowEditAbout(false)
                        setEditMobile(user.mobile || '')
                        setEditName(user.name || '')
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Login Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Login Details</h3>
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center justify-between  border-b border-gray-100">
                  <div className="flex-1">
                    {!showEditEmail ? (
                      <>
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-sm text-gray-600">{user.email || 'N/A'}</span>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter email"
                        />
                        <button
                          onClick={handleUpdateEmail}
                          disabled={loading}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setShowEditEmail(false)
                            setEditEmail(user.email || '')
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {!showEditEmail && (
                    <button
                      onClick={() => setShowEditEmail(true)}
                      className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {/* Password */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {!showEditPassword ? (
                      <>
                        <span className="text-sm font-medium text-gray-700">Password:</span>
                        <span className="ml-2 text-sm text-gray-600">••••••</span>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Current password"
                        />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="New password"
                        />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Confirm password"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={handleUpdatePassword}
                            disabled={loading}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setShowEditPassword(false)
                              setCurrentPassword('')
                              setNewPassword('')
                              setConfirmPassword('')
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {!showEditPassword && (
                    <button
                      onClick={() => setShowEditPassword(true)}
                      className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
    </div>
  )
}

export default UserProfile

