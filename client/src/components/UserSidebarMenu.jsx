import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiShoppingBag, FiHeart, FiMapPin, FiUser } from 'react-icons/fi'
import { useSelector } from 'react-redux'

const UserSidebarMenu = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const name = user.name || 'Người dùng'

  const menuItems = [
    {
      path: '/profile',
      label: 'Tổng quan',
      icon: FiHome
    },
    {
      path: '/myorders',
      label: 'Đơn hàng',
      icon: FiShoppingBag
    },
    {
      path: '/wishlist',
      label: 'Yêu thích',
      icon: FiHeart
    },
    {
      path: '/address',
      label: 'Địa chỉ của tôi',
      icon: FiMapPin
    },
    {
      path: '/info',
      label: 'Thông tin tài khoản',
      icon: FiUser
    }
  ]

  const isActive = (path) => {
    // Both /profile and /myorders render UserDashboard, so we need to check the pathname directly
    if (path === '/profile') {
      // Active when on /profile (dashboard tab)
      return location.pathname === '/profile'
    }
    if (path === '/myorders') {
      // Active when on /myorders (order tab)
      return location.pathname === '/myorders' || location.pathname.startsWith('/myorders/')
    }
    // For other paths, check exact match or if pathname starts with path
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
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
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-6 py-3.5 ${
                  active 
                    ? 'text-emerald-600 bg-emerald-50 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default UserSidebarMenu

