import React, { useState } from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RiMenu5Fill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { FiUser, FiCreditCard, FiShoppingCart, FiMessageCircle } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import UserAnalyticsChart from '../components/RevenueAnalyticsChart';
import TopProductsDoughnutChart from '../components/TopProductsDoughnutChart';

const Dashboard = () => {
  const user = useSelector(state => state.user)
  const [showOptions, setShowOptions] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);

  console.log("user dashboard", user)
  return (
    <section className='bg-white'>
      <div className='container grid lg:grid-cols-[300px,1fr] max-h-[100vh]'>
        {/**left for menu */}
        <div className='left-dashboard py-32 sticky  overflow-y-auto hidden lg:block border-r-2 border-dotted border-gray-300 px-4'>
          <div className="user-card bg-[#F8F8F8] rounded-xl  p-4 border border-gray-200">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <img src={user.avatar} alt="user-avatar" className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div className='flex flex-col  '>
                  <h3 className="font-semibold text-lg text-gray-800 ">{user.name}</h3>
                  <span className="text-sm text-gray-500">Vai trò : Admin</span>
                </div>
              </div>
              <div className="text-gray-400 cursor-pointer" onClick={() => setShowOptions(v => !v)}>
                <button><RiMenu5Fill size={26} /></button>
              </div>
            </div>
            {showOptions && (
              <div
                className={`flex flex-col gap-1 mt-3 transition-all duration-300 overflow-hidden ${showOptions ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">
                  <FiUser size={20} />
                  <span>Tài khoản của tôi</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">
                  <CiLogout size={20} />
                  <span>Đăng xuất</span>
                </a>
              </div>
            )}
          </div>
          <div className='navbar-card mt-6'>
            <ul className="space-y-1">
              <li className="mb-2"><span className="uppercase text-xs font-bold text-gray-600">ĐIỀU HƯỚNG</span></li>
              <li>
                <a href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Thống kê</a>
              </li>
              <li>
                <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Quản lý đơn hàng</a>
              </li>
              <li>
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium focus:outline-none"
                    onClick={() => setProductMenuOpen(v => !v)}
                  >
                    <span>Quản lý sản phẩm</span>
                    <svg className={`ml-2 w-4 h-4 transition-transform duration-200 ${productMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className={`pl-6 transition-all duration-300 overflow-hidden ${productMenuOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <a href="#" className="flex items-center gap-2 py-1 text-gray-600 hover:text-blue-600">
                      <span className="text-2xl">•</span>
                      <span>Danh sách sản phẩm</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 py-1 text-gray-600 hover:text-blue-600">
                      <span className="text-2xl">•</span>
                      <span>Đánh giá sản phẩm</span>
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <a href="#" className="block px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">Danh mục sản phẩm</a>
              </li>
              <li>
                <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">Quản lý bài viết</a>
              </li>
            </ul>
          </div>
        </div>

        {/**right for content */}
        <div className='bg-white left-dashboard'>
          <header className="w-full bg-white py-5 px-8 flex items-center justify-between shadow-sm border-b-2 border-gray-200 sticky top-0 min-h-[10vh] ">
            {/* Search box */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-xl">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
                  <IoSearch size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Search for projects"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white text-gray-700 shadow-sm"
                />
              </div>
            </div>
            {/* Right icons */}
            <div className="flex items-center gap-4 ml-8">
              {/* Giao diện (theme) icon */}
              <button className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-purple-500"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"></path></svg>
              </button>
              {/* Thông báo icon */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-purple-500"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 01-3.46 0"></path></svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {/* Avatar user */}
              <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow" />
            </div>
          </header>
          <div className='dashboard px-2 bg-[#F8F8F8] min-h-[88vh]'>
            <h1 className="pt-3 pl-4 text-2xl font-semibold text-black sticky top-0">Dashboard</h1>
            <div className="card-item flex flex-wrap gap-6 mt-3 px-4">
              {/* Total customers */}
              <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow p-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-50">
                  <HiUserGroup className="text-2xl text-orange-500" />
                </span>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Total customers</div>
                  <div className="text-2xl font-semibold text-gray-800">765</div>
                </div>
              </div>
              {/* Total income */}
              <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow p-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50">
                  <FiCreditCard className="text-2xl text-green-600" />
                </span>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Total income</div>
                  <div className="text-2xl font-semibold text-gray-800">$ 6,760.89</div>
                </div>
              </div>
              {/* New Orders */}
              <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow p-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50">
                  <FiShoppingCart className="text-2xl text-blue-500" />
                </span>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">New Orders</div>
                  <div className="text-2xl font-semibold text-gray-800">150</div>
                </div>
              </div>
              {/* Unread Chats */}
              <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow p-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-50">
                  <FiMessageCircle className="text-2xl text-cyan-600" />
                </span>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Unread Chats</div>
                  <div className="text-2xl font-semibold text-gray-800">15</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6  px-4">
              <UserAnalyticsChart />
              <TopProductsDoughnutChart />
            </div>
          </div>
          <div>

          </div>
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default Dashboard
