import React, { useState } from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import {Link, useNavigate } from 'react-router-dom'
import { RiMenu5Fill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { logout } from '../store/userSlice'
import toast, { Toaster } from 'react-hot-toast';

const LeftDashboard = () => {
    const user = useSelector(state => state.user)
    const [showOptions, setShowOptions] = useState(false);
    const [productMenuOpen, setProductMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleLogout = async()=>{
        try {
          const response = await Axios({
             ...SummaryApi.logout
          })
          console.log("logout",response)
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/login")
          }
        } catch (error) {
          console.log(error)
          AxiosToastError(error)
        }
   }

    return (
        <div className='sticky top-0'>
            <div className='left-dashboard   px-4 bg-white py-20 w-[300px] sticky top-0'>
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
                            <Link to="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">
                                <FiUser size={20} />
                                <span>Tài khoản của tôi</span>
                            </Link>
                            {user._id ? (
                                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">
                                    <CiLogout size={20} />
                                    <span>Đăng xuất</span>
                                </button>
                            ) : (
                                <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">
                                    <FiUser size={20} />
                                    <span>Đăng nhập</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className='navbar-card mt-6'>
                    <ul className="space-y-1">
                        <li className="mb-2"><span className="uppercase text-xs font-bold text-gray-600">ĐIỀU HƯỚNG</span></li>
                        <li>
                            <Link to="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium hover:bg-gray-100 focus:bg-blue-300 focus:text-white">Thống kê</Link>
                        </li>
                        <li>
                            <Link to="/dashboard/manage-order" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium hover:bg-gray-100 focus:bg-blue-300 focus:text-white">Quản lý đơn hàng</Link>
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
                                    <Link to="/dashboard/product" className="flex items-center gap-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:bg-blue-300 focus:text-white">
                                        <span className="text-2xl">•</span>
                                        <span>Danh sách sản phẩm</span>
                                    </Link>
                                    <Link to="/dashboard/upload-product" className="flex items-center gap-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:bg-blue-300 focus:text-white">
                                        <span className="text-2xl">•</span>
                                        <span>Thêm sản phẩm</span>
                                    </Link>
                                </div>
                            </div>
                        </li>
                        
                        <li>
                            <Link to="/dashboard/category" className="block px-3 py-2 rounded-lg  text-gray-700 font-medium hover:bg-gray-100 focus:bg-blue-300 focus:text-white">Danh mục sản phẩm</Link>
                        </li>
                        <li>
                            <Link to="/dashboard/subcategory" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium focus:bg-blue-300 focus:text-white">Danh mục con</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default LeftDashboard