import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaChevronDown, FaBars, FaChevronLeft } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import LeftDashboard from '../pages/LeftDashboard'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })
      if (response.data.success) {
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/login")
      }
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <div className='bg-[#F8F8F8] min-h-screen overflow-x-hidden'>
      <div className='flex w-full max-w-full'>
        {/**left for menu */}
        <LeftDashboard isCollapsed={isSidebarCollapsed} />

        {/**right for content */}
        <div className='flex-1 flex flex-col min-w-0 overflow-x-hidden'>
          {/* Header */}
          <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
              {/* Logo with Toggle Button */}
              <div className="flex items-center gap-3">
                {/* Toggle Sidebar Button */}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-teal-600"
                  aria-label="Toggle sidebar"
                  title={isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                >
                  {isSidebarCollapsed ? (
                    <FaBars size={20} />
                  ) : (
                    <FaChevronLeft size={20} />
                  )}
                </button>
                {/* Logo */}
                
              </div>

              {/* Search box */}
              <div className="flex-1 flex justify-center max-w-2xl mx-2 sm:mx-4 min-w-0">
                <div className="flex items-center w-full gap-0">
                  <input
                    type="text"
                    placeholder="Tìm kiếm Binkeyit.."
                    className="flex-1 px-4 py-2.5 rounded-l-lg border-none focus:outline-none bg-[#f9f9f6] text-gray-700 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-r-lg transition-colors flex items-center justify-center"
                    aria-label="Search"
                  >
                    <IoSearch className="text-white" size={24} />
                  </button>
                </div>
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <IoMdNotificationsOutline className="text-gray-600" size={22} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">4</span>
                </button>

                {/* Dark mode toggle */}
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MdOutlineDarkMode className="text-gray-600" size={22} />
                </button>

                {/* User profile */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img 
                      src={user.avatar || "https://via.placeholder.com/40"} 
                      alt="avatar" 
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-200" 
                    />
                    <div className="text-left hidden md:block">
                      <div className="text-sm font-semibold text-gray-800">{user.name || "Admin"}</div>
                      <div className="text-xs text-gray-500">Admin</div>
                    </div>
                    <FaChevronDown className="text-gray-500 text-xs" />
                  </button>

                  {/* User dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link 
                        to="/dashboard/profile-setting" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FiSettings className="w-4 h-4 mr-3" />
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button 
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          setShowUserMenu(false)
                          handleLogout()
                        }}
                      >
                        <FiLogOut className="w-4 h-4 mr-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
