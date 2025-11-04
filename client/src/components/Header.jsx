import React, { useEffect, useState, useRef } from 'react'
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
import { FaChevronDown } from "react-icons/fa";
import { BsFillLightningFill } from "react-icons/bs";
import { HiOutlineHeart } from "react-icons/hi";
import { HiLocationMarker } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

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
    const [showHotOffersModal, setShowHotOffersModal] = useState(false);
    const [hotOffers, setHotOffers] = useState([]);
    const [loadingHotOffers, setLoadingHotOffers] = useState(false);
    const [modalAnimation, setModalAnimation] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const userMenuRef = useRef(null);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [selectedCurrency, setSelectedCurrency] = useState('VND');
    const [openLanguageDropdown, setOpenLanguageDropdown] = useState(false);
    const [openCurrencyDropdown, setOpenCurrencyDropdown] = useState(false);
    const languageDropdownRef = useRef(null);
    const currencyDropdownRef = useRef(null);

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
    const fetchCategory = async()=>{
        const response = await Axios({
            ...SummaryApi.getCategory,
        })
        if(response.data && response.data.success){
            setCategories(response.data.data)
        }
    }

    const fetchSubCategory = async()=>{
        const response = await Axios({
            ...SummaryApi.getSubCategory,
        })
        if(response.data && response.data.success){
            setSubCategories(response.data.data)
        }
    }
    // console.log("subCategories", subCategories)

    useEffect(() => {
        fetchCategory();
        fetchSubCategory();
    }, []);

    const fetchHotOffers = async () => {
        setLoadingHotOffers(true);
        try {
            const response = await Axios({
                ...SummaryApi.searchProduct,
                data: { search: '', page: 1, limit: 50 }
            });
            if (response.data && response.data.success) {
                // Lọc sản phẩm có discount > 0 và được tạo hôm nay
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                setHotOffers(
                    response.data.data.filter(p =>
                        p.discount > 0 &&
                        p.createdAt &&
                        new Date(p.createdAt) >= today &&
                        new Date(p.createdAt) < tomorrow
                    )
                );
            } else {
                setHotOffers([]);
            }
        } catch (error) {
            setHotOffers([]);
        } finally {
            setLoadingHotOffers(false);
        }
    };

    const handleOpenHotOffers = () => {
        setShowHotOffersModal(true);
        setTimeout(() => setModalAnimation(true), 10);
        fetchHotOffers();
    };
    const handleCloseHotOffers = () => {
        setModalAnimation(false);
        setTimeout(() => setShowHotOffersModal(false), 300);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseHotOffers();
        }
    };

    useEffect(() => {
        if (!openUserMenu) return;
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setOpenUserMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openUserMenu]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setOpenLanguageDropdown(false);
            }
            if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
                setOpenCurrencyDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
      <header className='top-0 z-40 flex flex-col bg-white w-full'>
          {/* Top Announcement Bar - Full Width */}
          <div className="w-full bg-[#0da487] text-white text-sm py-3">
              <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
                  {/* Left: Location */}
                  <div className="hidden md:flex items-center gap-2 text-sm lg:text-sm whitespace-nowrap">
                      <HiLocationMarker size={18} />
                      <span className='font-medium'>1418 Riverwood Drive, CA 96052, US</span>
                  </div>
                  {/* Center: Message */}
                  <div className="flex-1 hidden md:flex items-center justify-center text-center text-xs lg:text-sm min-w-0">
                      <span className="truncate">
                      <span className="font-semibold">Welcome to Fastkart !</span> Wrap new offers/gift every single day on Weekends. <span className="font-semibold">New Coupon Code: <span className="underline">Fast024</span></span>
                      </span>
                  </div>
                  {/* Right: Lang/Currency */}
                  <div className="flex items-center gap-3 text-xs lg:text-sm whitespace-nowrap">
                      {/* Language Dropdown */}
                      <div className="relative" ref={languageDropdownRef}>
                          <button 
                              onClick={() => {
                                  setOpenLanguageDropdown(!openLanguageDropdown);
                                  setOpenCurrencyDropdown(false);
                              }}
                              className="hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                          >
                              <img 
                                  src={selectedLanguage === 'English' 
                                      ? "https://themes.pixelstrap.com/fastkart/assets/images/country/united-states.png"
                                      : "https://media.loveitopcdn.com/3807/la-co-viet-nam-dongphusongphu2.png"
                                  } 
                                  alt={selectedLanguage === 'English' ? 'USA' : 'Vietnam'} 
                                  className='w-5 h-4 object-contain'
                              />
                              <span>{selectedLanguage === 'English' ? 'US English' : 'Vietnamese'}</span>
                              <FaChevronDown size={10} className={`transition-transform ${openLanguageDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          {openLanguageDropdown && (
                              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg min-w-[150px] z-50 border border-gray-200">
                                  <div className="py-1">
                                      <button
                                          onClick={() => {
                                              setSelectedLanguage('English');
                                              setOpenLanguageDropdown(false);
                                          }}
                                          className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 ${
                                              selectedLanguage === 'English' ? 'bg-gray-50' : ''
                                          }`}
                                      >
                                          <span className="text-lg">
                                            <img src="https://themes.pixelstrap.com/fastkart/assets/images/country/united-states.png" alt="USA" className='w-5 h-5' />
                                          </span>
                                          <span className="text-sm text-gray-700">English</span>
                                      </button>
                                      <button
                                          onClick={() => {
                                              setSelectedLanguage('Vietnamese');
                                              setOpenLanguageDropdown(false);
                                          }}
                                          className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 ${
                                              selectedLanguage === 'Vietnamese' ? 'bg-gray-50' : ''
                                          }`}
                                      >
                                          <span className="text-lg">
                                            <img src="https://media.loveitopcdn.com/3807/la-co-viet-nam-dongphusongphu2.png" alt="Vietnam" className='w-5 h-4' />
                                          </span>
                                          <span className="text-sm text-gray-700">Vietnamese</span>
                                      </button>
                                  </div>
                              </div>
                          )}
                      </div>
                      
                      <span className="opacity-70">|</span>
                      
                      {/* Currency Dropdown */}
                      <div className="relative" ref={currencyDropdownRef}>
                          <button 
                              onClick={() => {
                                  setOpenCurrencyDropdown(!openCurrencyDropdown);
                                  setOpenLanguageDropdown(false);
                              }}
                              className="hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                          >
                              <span>{selectedCurrency}</span>
                              <FaChevronDown size={10} className={`transition-transform ${openCurrencyDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          {openCurrencyDropdown && (
                              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg min-w-[120px] z-50 border border-gray-200">
                                  <div className="py-1">
                                      <button
                                          onClick={() => {
                                              setSelectedCurrency('USD');
                                              setOpenCurrencyDropdown(false);
                                          }}
                                          className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 ${
                                              selectedCurrency === 'USD' ? 'bg-gray-50' : ''
                                          }`}
                                      >
                                          <span className="text-sm text-gray-700">USD</span>
                                      </button>
                                      <button
                                          onClick={() => {
                                              setSelectedCurrency('VND');
                                              setOpenCurrencyDropdown(false);
                                          }}
                                          className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 ${
                                              selectedCurrency === 'CAD' ? 'bg-gray-50' : ''
                                          }`}
                                      >
                                          <span className="text-sm text-gray-700">VND</span>
                                      </button>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>

          {/* Main Header Bar - Full Width */}
          <div className='w-full bg-white border-b border-gray-200'>
              {
                  !(isSearchPage && isMobile) && (
                      <div className='container mx-auto px-4 lg:px-8 flex items-center justify-between py-3'>
                          {/**logo */}
                          <div className='flex items-center gap-4'>
                              <a href='/' className='h-full flex justify-center items-center' onClick={e => { e.preventDefault(); window.location.href = '/' }}>
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
                              </a>
                              {/* Location dropdown */}
                              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-emerald-600">
                                  <HiLocationMarker size={20} />
                                  <span>Your Location</span>
                                  <FaAngleRight size={12} />
                              </div>
                          </div>

                          {/**Search */}
                          <div className='hidden lg:flex flex-1 max-w-2xl mx-8'>
                              <Search />
                          </div>

                          {/**Right side utilities */}
                          <div className='flex items-center gap-4'>
                              {/* Phone & Delivery */}
                              <div className="hidden xl:flex items-center gap-2 text-sm text-gray-600">
                                  <FiPhone size={18} />
                                  <span>24/7 Delivery</span>
                                  <a href="tel:+918881042340" className="text-emerald-600 font-semibold">+91 888 104 2340</a>
                              </div>

                              {/* Wishlist */}
                              <button className="hidden lg:flex relative items-center px-3 py-2 rounded text-neutral-700 hover:text-red-500">
                                  <HiOutlineHeart size={24} />
                              </button>

                              {/* Cart */}
                              <button onClick={() => setOpenCartSection(true)} className="relative flex items-center px-3 py-2 rounded text-neutral-700 hover:text-red-500">
                                  <div className="relative">
                                      <IoCartOutline size={28} />
                                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center">
                                          {cartItem.length || 0}
                                      </span>
                                  </div>
                              </button>

                              {/* User Menu */}
                              {user?._id ? (
                                  <div className="relative flex items-center gap-2">
                                      <div onClick={() => setOpenUserMenu((preve) => !preve)} className="flex items-center gap-2 cursor-pointer select-none">
                                          <FiUser size={28} />
                                          <span className="hidden xl:block text-sm text-gray-700">Hello, My Account</span>
                                      </div>
                                      {openUserMenu && (
                                          <div
                                              ref={userMenuRef}
                                              className="absolute right-0 top-12 mt-[10px]"
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
                                          <FiUser size={28} />
                                          <span className="hidden xl:block text-sm text-gray-700">Hello, My Account</span>
                                      </div>
                                      {openUserMenu && (
                                          <div ref={userMenuRef} className="absolute right-0 top-12">
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

                              {/* Deal Today Button */}
                              <button className='hidden lg:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg py-2 px-4'>
                                  <BsFillLightningFill size={18} />
                                  <span>Deal Today</span>
                              </button>

                              {/* Mobile User Icon */}
                              <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
                                  <FaRegCircleUser size={26} />
                              </button>
                          </div>
                      </div>
                  )
              }

              {/* Mobile Search */}
              <div className='container mx-auto px-4 lg:hidden pb-3'>
                  <Search />
              </div>
          </div>

          {
              openCartSection && (
                  <DisplayCartItem close={() => setOpenCartSection(false)} />
              )
          }

          {/* Navigation Bar - Full Width */}
          <div className='w-full bg-white border-b border-gray-200'>
              <div className='container mx-auto px-4 lg:px-8 header-nav py-3 flex justify-between items-center' >
          <div className='flex items-center justify-between header-nav-left'>
            <div className="relative">
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className='flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md py-[11px] px-[26px]'>
                  <FiMenu size={24} />
                  <span className='text-[18px]'>All Categories</span>
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
                  <div className='categories-dropdown bg-white rounded-xl  w-80 flex flex-col gap-1 shadow-2xl' style={{boxShadow: "0 0 8px #ddd"}}>
                    <ul className='flex flex-col gap-1'>
                      {categories.map((cat, idx) => (
                        <li key={cat._id || idx} className="relative group">
                          <a className='flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer'>
                            <img src={cat.icon || cat.image } alt="logo" className='w-7 h-7 mr-3' />
                            <span className='flex-1 text-base font-medium text-gray-800'>{cat.name}</span>
                            <FaAngleRight className='text-gray-400' />
                          </a>
                          <div className="absolute top-0 left-full min-w-[300px] bg-white rounded-lg shadow z-50 hidden group-hover:block px-4 py-2 ">
                            <div className="font-bold text-sm text-left mb-2">{cat.name}</div>
                            {/* subcategory */}
                            <div className='flex flex-col gap-1'>
                              {subCategories
                                .filter(sub => sub.category.some(c => String(c._id) === String(cat._id)))
                                .map((subCat, idx) => (
                                  <a 
                                    key={subCat._id || idx} 
                                    className='flex items-center gap-2 px-4 rounded-lg hover:bg-gray-100 transition cursor-pointer'
                                    href={`/product?subcategory=${subCat._id}`}
                                  >
                                    <span className="text-lg">•</span>
                                    <span className='text-[#777b83]'>{subCat.name}</span>
                                  </a>
                              ))}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='header-nav-middle flex-1 flex justify-center'>
            <ul className='navbar-nav flex items-center gap-8'>
              <li className='nav-item'>
                <a href="/" className='nav-link text-black font-medium text-base hover:text-emerald-600 flex items-center gap-1'>
                  Home
                  <FaAngleRight size={12} className='text-gray-400' />
                </a>
              </li>
              <li className='nav-item'>
                <a href="/product" className='nav-link text-black font-medium text-base hover:text-emerald-600 flex items-center gap-1'>
                  Shop
                  <FaAngleRight size={12} className='text-gray-400' />
                </a>
              </li>
              <li className='nav-item'>
                <a href="/product" className='nav-link text-black font-medium text-base hover:text-emerald-600 flex items-center gap-1'>
                  Product
                  <FaAngleRight size={12} className='text-gray-400' />
                </a>
              </li>
              <li className='nav-item'>
                <a href="#" className='nav-link text-black font-medium text-base hover:text-emerald-600 flex items-center gap-1'>
                  Mega Menu
                  <FaAngleRight size={12} className='text-gray-400' />
                </a>
              </li>
              <li className='nav-item'>
                <a href="#" className='nav-link text-black font-medium text-base hover:text-emerald-600 flex items-center gap-1'>
                  Blog
                  <FaAngleRight size={12} className='text-gray-400' />
                </a>
              </li>
              <li className='nav-item flex items-center gap-2'>
                <a href="#" className='nav-link text-black font-medium text-base hover:text-emerald-600 flex items-center gap-1'>
                  Pages
                  <FaAngleRight size={12} className='text-gray-400' />
                </a>
                <span className='bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded'>New</span>
              </li>
              <li className='nav-item'>
                <a href="#" className='nav-link text-black font-medium text-base hover:text-emerald-600 flex items-center gap-1'>
                  Seller
                  <FaAngleRight size={12} className='text-gray-400' />
                </a>
              </li>
            </ul>
          </div>
          <div className='header-nav-right'>
            <button
                className='flex items-center gap-2 bg-red-50 hover:bg-red-100 text-[#C83C2B] font-bold rounded-lg py-2 px-6 text-lg'
                onClick={handleOpenHotOffers}
            >
                <BsFillLightningFill size={24} className='text-[#C83C2B]' />
                <span>Giảm giá hôm nay</span>
            </button>
          </div>
              </div>
          </div>

        {/* Modal Hot Offers */}
        {showHotOffersModal && (
            <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40' onClick={handleOverlayClick}>
                <div className={`bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative transform transition-all duration-300 ${modalAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <button
                        className='absolute top-3 right-3 bg-red-500 text-white rounded px-2 py-1 text-lg font-bold hover:bg-red-600'
                        onClick={handleCloseHotOffers}
                    >
                        ×
                    </button>
                    <h2 className='text-2xl font-bold mb-2'>Ưu đãi hôm nay</h2>
                    <p className='mb-4 text-gray-600'>Khuyến mại được đề xuất cho bạn.</p>
                    {loadingHotOffers ? (
                        <div className='text-center py-8'>Đang tải...</div>
                    ) : hotOffers.length === 0 ? (
                        <div className='text-center py-8'>Không có sản phẩm nào được giảm giá trong hôm nay</div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto'>
                            {hotOffers.map(product => (
                                <div key={product._id} className='flex gap-3 items-center border rounded p-2'>
                                    <img src={product.image?.[0]} alt={product.name} className='w-16 h-16 object-cover rounded'/>
                                    <div className='flex-1'>
                                        <div className='font-semibold'>{product.name}</div>
                                        <div className='text-sm text-gray-500 line-through'>Giá gốc: {product.price?.toLocaleString()} đ</div>
                                        <div className='text-base text-red-600 font-bold'>Giá KM: {(product.price - (product.price * product.discount / 100)).toLocaleString()} đ</div>
                                        <div className='text-xs text-green-600'>Giảm {product.discount}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}
      </header>
  )
}

export default Header
