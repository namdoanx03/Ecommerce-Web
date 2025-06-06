import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { useSelector } from 'react-redux';
import UserMenu from './UserMenu';
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import { FiUser } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { FaAngleRight } from "react-icons/fa6";
import { BsFillLightningFill } from "react-icons/bs";

const Header = () => {
    const [ isMobile ] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state)=> state?.user)
    const [openUserMenu,setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    // const [totalPrice,setTotalPrice] = useState(0)
    // const [totalQty,setTotalQty] = useState(0)
    const { totalPrice, totalQty} = useGlobalContext()
    const [openCartSection,setOpenCartSection] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false);
 
    const redirectToLoginPage = ()=>{
        navigate("/login")
    }

    const handleCloseUserMenu = ()=>{
        setOpenUserMenu(false)
    }

    const handleMobileUser = ()=>{
        if(!user._id){
            navigate("/login")
            return
        }

        navigate("/user")
    }

    //total item and total price
    // useEffect(()=>{
    //     const qty = cartItem.reduce((preve,curr)=>{
    //         return preve + curr.quantity
    //     },0)
    //     setTotalQty(qty)
        
    //     const tPrice = cartItem.reduce((preve,curr)=>{
    //         return preve + (curr.productId.price * curr.quantity)
    //     },0)
    //     setTotalPrice(tPrice)

    // },[cartItem])

  return (
      <header className='lg:h-20 lg:shadow-md  top-0 z-40 flex flex-col justify-center gap-1 bg-white px-28' style={{height: "180px"}}>
          {
              !(isSearchPage && isMobile) && (
                  <div className='container mx-auto flex items-center px-2 justify-between'>
                      {/**logo */}
                      <div className='h-full'>
                          <Link to={"/"} className='h-full flex justify-center items-center'>
                              <img
                                  src={logo}
                                  width={170}
                                  height={60}
                                  alt='logo'
                                  className='hidden lg:block'
                              />
                              <img
                                  src={logo}
                                  width={120}
                                  height={60}
                                  alt='logo'
                                  className='lg:hidden'
                              />
                          </Link>
                      </div>

                      {/**Search */}
                      <div className='hidden lg:block'>
                          <Search />
                      </div>


                      {/**login and my cart */}
                      <div className=''>
                          {/**user icons display in only mobile version**/}
                          <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
                              <FaRegCircleUser size={26} />
                          </button>

                          {/**Desktop**/}
                          <div className="hidden lg:flex items-center gap-3">
                              <button onClick={() => setOpenCartSection(true)} className="relative flex items-center px-3 py-2 rounded text-neutral-700 ">
                                  <div className="relative">
                                      <IoCartOutline size={28} />
                                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center">
                                          {cartItem.length || 0}
                                      </span>
                                  </div>
                              </button>

                              {/* Vertical Divider */}
                              <div className="w-px h-6 bg-gray-300 mr-[8px]"></div>

                              {user?._id ? (
                                  <div className="relative flex items-center gap-2" >
                                      <div onClick={() => setOpenUserMenu((preve) => !preve)} className="flex items-center gap-2 cursor-pointer select-none " >
                                          <FiUser size={32} />
                                      </div>
                                      {openUserMenu && (
                                          <div
                                              className="absolute right-0 top-12 mt-[10px] mr-[-30px]"
                                              style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}
                                          >
                                              <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                                                  <UserMenu close={handleCloseUserMenu} />
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              ) : (
                                  <div className="relative">
                                      <div
                                          onClick={() => setOpenUserMenu((preve) => !preve)}
                                          className="flex items-center gap-2 cursor-pointer select-none"
                                      >
                                          <FiUser size={35} />
                                      </div>
                                      {openUserMenu && (
                                          <div className="absolute right-0 top-12">
                                              <div className="bg-white rounded p-4 min-w-40 lg:shadow-lg">
                                                  <button
                                                      onClick={redirectToLoginPage}
                                                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                                                  >
                                                      Login
                                                  </button>
                                                  <button
                                                      onClick={() => {
                                                          setOpenUserMenu(false);
                                                          navigate("/register");
                                                      }}
                                                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                                                  >
                                                      Register
                                                  </button>
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              )}
                          </div>

                      </div>
                  </div>
              )
          }

          <div className='container mx-auto px-2 lg:hidden'>
              <Search />
          </div>

          {
              openCartSection && (
                  <DisplayCartItem close={() => setOpenCartSection(false)} />
              )
          }

        <div className='container mx-auto px-2 header-nav mt-[10px] mb-[10px] flex justify-between' >
          <div className='flex items-center justify-between header-nav-left'>
            <div className="relative">
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className='flex items-center gap-3 bg-[#C83C2B] hover:bg-[#b8321a] text-white font-bold rounded-md py-[12px] px-[26px] mt-[22px]'>
                  <FiMenu size={24} />
                  <span className='text-[18px]'>Danh Mục</span>
                </button>
                <div className="w-full" style={{ height: 12 }} />
                <div
                  className={
                    "absolute left-0 top-full z-[9999] transition-all duration-500 origin-bottom " +
                    (showDropdown
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-8 pointer-events-none")
                  }
                >
                  <div className='categories-dropdown bg-white rounded-xl p-2 w-80 flex flex-col gap-1 shadow-2xl' style={{boxShadow: "0 0 8px #ddd"}}>
                    <ul className='flex flex-col gap-1'>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/biscuit.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Bánh Quy & Đồ Ăn Nhẹ</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/breakfast.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Bữa Sáng & Sữa</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/drink.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Đồ Uống</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/vegetable.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Rau và Trái Cây</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/wine.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Rượu Vang & Đồ Uống Có Cồn</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/milk.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Sữa & Sản Phẩm Từ Sữa</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/grocery.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Tạp Hóa & Hàng Thiết Yếu</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/seafood.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Thịt & Hải Sản</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/pet-food.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Thức Ăn Cho Thú Cưng</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/dry-food.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Thực phẩm khô</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                      <li>
                        <a className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                          <img src="https://themes.pixelstrap.com/fastkart/assets/svg/1/frozen.svg" alt="logo" className='w-7 h-7 mr-3' />
                          <span className='flex-1 text-base font-medium text-gray-800'>Thực Thẩm Đông Lạnh</span>
                          <FaAngleRight className='text-gray-400' />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='header-nav-middle flex-1 flex justify-center'>
            <ul className='navbar-nav flex items-center gap-12'>
              <li className='nav-item'>
                <a href="#" className='nav-link text-black font-medium text-lg'>Đi Chợ Tại Nhà</a>
              </li>
              <li className='nav-item flex items-center gap-2'>
                <a href="#" className='nav-link text-black font-medium text-lg'>Ưu Đãi Hot</a>
                <span className='bg-red-400 text-white text-xs font-bold px-2 py-0.5 rounded'>Hot</span>
              </li>
              <li className='nav-item'>
                <a href="#" className='nav-link text-black font-medium text-lg'>Khuyến mãi</a>
              </li>
              <li className='nav-item'>
                <a href="#" className='nav-link text-black font-medium text-lg'>Tin Tức</a>
              </li>
            </ul>
          </div>
          <div className='header-nav-right'>
            <button className='flex items-center gap-2 bg-red-50 hover:bg-red-100 text-[#C83C2B] font-bold rounded-lg py-2 px-6 text-lg mt-[20px]'>
              <BsFillLightningFill size={24} className='text-[#C83C2B]' />
              <span>Giảm giá hôm nay</span>
            </button>
          </div>
        </div>
      </header>
  )
}

export default Header
