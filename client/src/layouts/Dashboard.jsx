import React, { useState } from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RiMenu5Fill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { FiUser, FiCreditCard, FiShoppingCart, FiMessageCircle } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import LeftDashboard from '../pages/LeftDashboard'
import { FaHome } from "react-icons/fa";


const Dashboard = () => {
  const user = useSelector(state => state.user)
  const [showOptions, setShowOptions] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);

  console.log("user dashboard", user)
  return (
    <section className='bg-white '>
      <div className='container flex '>
        {/**left for menu */}
        <LeftDashboard />

        {/**right for content */}
        <div className='bg-white w-full border-l-2 border-dotted border-gray-300'>
          <header className="w-full bg-white py-5 px-8 flex items-center justify-between shadow-sm border-b-2 border-gray-200 sticky top-0 min-h-[10vh] z-20">
            <div className ='comback-home flex items-center gap-2'>
            <Link to="/">
              <span className='text-base font-medium text-gray-800'><FaHome className='text-2xl'/></span>
            </Link>
            </div>
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
          <Outlet />
          <div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Dashboard
