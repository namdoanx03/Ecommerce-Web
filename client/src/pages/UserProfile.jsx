import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiHome } from 'react-icons/fi'
import { MdEdit } from "react-icons/md"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { setUserDetails } from '../store/userSlice'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useAddress } from '../hooks/useAddress'
import UserSidebarMenu from '../components/UserSidebarMenu'

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
  const [editGender, setEditGender] = useState('Nữ')
  const [editBirthday, setEditBirthday] = useState('21/05/1997')

  const name = user.name || 'Người dùng'
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700">Tài khoản của tôi</h2>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 hover:text-emerald-600">
              <FiHome className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>
            <span className="text-gray-400">&gt;</span>
            <span className="font-medium">Hồ sơ của tôi</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-[#ffffff] min-h-[calc(100vh-100px)]">
        <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-8 lg:py-10 flex flex-col lg:flex-row gap-8">
        {/* Left sidebar card */}
        <UserSidebarMenu />

        {/* Right main panel - My Profile */}
        <main className="flex-1">
          <div className="bg-[#F8F8F8] rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-800">Hồ sơ của tôi</h2>
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <button
                onClick={() => setShowEditAbout(true)}
                className="flex items-center gap-1 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <MdEdit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
            </div>

            {/* Profile About Section */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Thông tin hồ sơ</h3>
                {!showEditAbout && (
                  <button
                    onClick={() => setShowEditAbout(true)}
                    className="flex items-center gap-1 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm"
                  >
                    <MdEdit className="w-4 h-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>
              {!showEditAbout ? (
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Tên:</span> <span className="ml-2">{name}</span>
                  </div>
                  <div>
                    <span className="font-medium">Giới tính:</span> <span className="ml-2">{editGender}</span>
                  </div>
                  <div>
                    <span className="font-medium">Ngày sinh:</span> <span className="ml-2">{editBirthday}</span>
                  </div>
                  <div>
                    <span className="font-medium">Số điện thoại:</span> <span className="ml-2 text-emerald-600">{user.mobile || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Địa chỉ:</span> <span className="ml-2">
                      {defaultAddress 
                        ? `${defaultAddress.address_line || ''}, ${defaultAddress.ward || ''}, ${defaultAddress.district || ''}, ${defaultAddress.province || ''}`
                        : 'Chưa có địa chỉ'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Nữ">Nữ</option>
                      <option value="Nam">Nam</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                    <input
                      type="text"
                      value={editBirthday}
                      onChange={(e) => setEditBirthday(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={handleUpdateAbout}
                      disabled={loading}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setShowEditAbout(false)
                        setEditMobile(user.mobile || '')
                        setEditName(user.name || '')
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Login Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đăng nhập</h3>
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
                          placeholder="Nhập email"
                        />
                        <button
                          onClick={handleUpdateEmail}
                          disabled={loading}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => {
                            setShowEditEmail(false)
                            setEditEmail(user.email || '')
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                  </div>
                  {!showEditEmail && (
                    <button
                      onClick={() => setShowEditEmail(true)}
                      className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {/* Password */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {!showEditPassword ? (
                      <>
                        <span className="text-sm font-medium text-gray-700">Mật khẩu:</span>
                        <span className="ml-2 text-sm text-gray-600">••••••</span>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Mật khẩu hiện tại"
                        />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Mật khẩu mới"
                        />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Xác nhận mật khẩu"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={handleUpdatePassword}
                            disabled={loading}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm"
                          >
                            Lưu
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
                            Hủy
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
                      Chỉnh sửa
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

