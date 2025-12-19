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
import { IoCartOutline, IoSearch, IoClose } from "react-icons/io5";
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
    const [openLocationDropdown, setOpenLocationDropdown] = useState(false);
    const [openSidebarMenu, setOpenSidebarMenu] = useState(false);
    const languageDropdownRef = useRef(null);
    const currencyDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);
    const sidebarMenuRef = useRef(null);

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
        function handleClickOutside(event) {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setOpenLanguageDropdown(false);
            }
            if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
                setOpenCurrencyDropdown(false);
            }
            if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
                setOpenLocationDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close sidebar when clicking outside and prevent body scroll
    useEffect(() => {
        if (openSidebarMenu) {
            // Prevent body scroll when sidebar is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [openSidebarMenu]);

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
          <div className="w-full bg-[#0da487] text-white text-xs sm:text-sm py-2 sm:py-3">
              <div className="container mx-auto px-3 sm:px-4 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
                  {/* Left: Location - Hiển thị từ 1280px (xl) trở lên */}
                  <div className="hidden xl:flex items-center gap-2 text-sm whitespace-nowrap">
                      <HiLocationMarker size={18} />
                      <span className='font-medium'>1418 Riverwood Drive, CA 96052, US</span>
                  </div>
                  {/* Center: Message - Responsive text */}
                  <div className="flex-1 flex items-center justify-center text-center text-xs sm:text-sm min-w-0 px-1 sm:px-2">
                      <span className="truncate">
                          <span className="font-semibold">Welcome to Fastkart !</span> 
                          <span className="hidden lg:inline"> Wrap new offers/gift every single day on Weekends.</span> 
                          <span className="font-semibold"> <span className="hidden sm:inline">New Coupon Code: </span><span className="underline">Fast024</span></span>
                      </span>
                  </div>
                  {/* Right: Lang/Currency - Luôn hiển thị */}
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm whitespace-nowrap ml-auto">
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
                              <span className="hidden md:inline">{selectedLanguage === 'English' ? 'US English' : 'Vietnamese'}</span>
                              <span className="md:hidden">{selectedLanguage === 'English' ? 'EN' : 'VN'}</span>
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
                      
                      <span className="opacity-70 hidden md:inline">|</span>
                      
                      {/* Currency Dropdown */}
                      <div className="relative" ref={currencyDropdownRef}>
                          <button 
                              onClick={() => {
                                  setOpenCurrencyDropdown(!openCurrencyDropdown);
                                  setOpenLanguageDropdown(false);
                              }}
                              className="hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                          >
                              <span className="text-sm">{selectedCurrency}</span>
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
                                              selectedCurrency === 'VND' ? 'bg-gray-50' : ''
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
          <div className='w-full bg-white '>
          {
              !(isSearchPage && isMobile) && (
                      <div className='container mx-auto px-3 sm:px-4 lg:px-16 py-2 sm:py-3'>
                          {/* Mobile Layout - Menu | Logo (center) | User */}
                          <div className='md:hidden flex items-center justify-between relative'>
                              {/* Left: Menu Button */}
                              <button 
                                  onClick={() => setOpenSidebarMenu(true)}
                                  className='flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors z-10'
                                  aria-label="Toggle menu"
                              >
                                  <FiMenu size={24} />
                              </button>
                              
                              {/* Center: Logo */}
                              <a href='/' className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' onClick={e => { e.preventDefault(); window.location.href = '/' }}>
                                  <img
                                      src={logo}
                                      width={140}
                                      height={50}
                                      alt='logo'
                                      className='w-auto h-10'
                                  />
                              </a>
                              
                              {/* Right: User Icon with Dropdown Menu */}
                              <div className="relative group z-10">
                                  <button className='text-neutral-600 p-2'>
                                      <FaRegCircleUser size={24} />
                                  </button>
                                  
                                  {/* Invisible bridge */}
                                  <div className="absolute top-full left-0 right-0 h-3 hidden group-hover:block"></div>
                                  
                                  {/* Dropdown Menu */}
                                  <div className="absolute right-0 top-full mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                      <div className="bg-white rounded-lg p-3 min-w-[160px] shadow-2xl border border-gray-100">
                                          {user?._id ? (
                                              <>
                                                  <button
                                                      onClick={() => navigate("/user")}
                                                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                                                  >
                                                      My Profile
                                                  </button>
                                                  <button
                                                      onClick={() => navigate("/myorders")}
                                                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                                                  >
                                                      My Orders
                                                  </button>
                                                  <button
                                                      onClick={() => {
                                                          // Logout logic here
                                                          navigate("/");
                                                      }}
                                                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-red-600"
                                                  >
                                                      Logout
                                                  </button>
                                              </>
                                          ) : (
                                              <>
                                                  <button
                                                      onClick={() => navigate("/login")}
                                                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                                                  >
                                                      Log In
                                                  </button>
                                                  <button
                                                      onClick={() => navigate("/register")}
                                                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                                                  >
                                                      Register
                                                  </button>
                                                  <button
                                                      onClick={() => navigate("/forgot-password")}
                                                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                                                  >
                                                      Forgot Password
                                                  </button>
                                              </>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Tablet & Desktop Layout */}
                          <div className='hidden md:flex items-center justify-between gap-2 md:gap-3 lg:gap-4'>
                          {/**Left side: Toggle button + Logo */}
                          <div className='flex items-center gap-3 lg:gap-4 flex-shrink-0'>
                              {/* Navbar Toggle Button - Chỉ hiển thị <= 1024px */}
                              <button 
                                  onClick={() => setOpenSidebarMenu(true)}
                                  className='lg:hidden flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors'
                                  aria-label="Toggle menu"
                              >
                                  <FiMenu size={24} />
                              </button>
                              
                              {/**logo */}
                              <a href='/' className='h-full flex justify-center items-center' onClick={e => { e.preventDefault(); window.location.href = '/' }}>
                                  <img
                                      src={logo}
                                      width={170}
                                      height={60}
                                      alt='logo'
                                      className='hidden lg:block w-auto h-10 lg:h-14'
                                  />
                                  <img
                                      src={logo}
                                      width={120}
                                      height={60}
                                      alt='logo'
                                      className='lg:hidden w-auto h-10'
                                  />
                              </a>
                          </div>

                          {/**Search - Hiển thị từ tablet */}
                          <div className='flex flex-1 max-w-xl lg:max-w-2xl mx-3 lg:mx-8'>
                              <Search />    
                          </div>

                          {/**Right side utilities */}
                          <div className='flex items-center gap-2 md:gap-3 lg:gap-4 flex-shrink-0'>
                              {/* Phone & Delivery - Ẩn dưới 1280px để tiết kiệm không gian */}
                              <div className="hidden xl:flex items-center gap-2 text-sm text-gray-600">
                                  <FiPhone size={18} className="text-gray-600 flex-shrink-0" />
                                  <div className="flex flex-col">
                                      <span className="text-xs text-gray-600">24/7 Delivery</span>
                                      <a href="tel:+918881042340" className="text-sm font-semibold text-black hover:text-emerald-600 transition-colors">+91 888 104 2340</a>
                                  </div>
                              </div>

                              {/* Vertical Divider */}
                              <div className="hidden xl:block w-px h-8 bg-gray-300"></div>

                              {/* Wishlist - Hiển thị từ tablet */}
                              <button
                                  onClick={() => {
                                      if (user?._id) {
                                          navigate('/wishlist')
                                      } else {
                                          redirectToLoginPage()
                                      }
                                  }}
                                  className="flex relative items-center px-1.5 md:px-2 lg:px-3 py-2 rounded text-gray-600 hover:text-red-500 transition-colors"
                              >
                                  <HiOutlineHeart size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
                              </button>

                              {/* Vertical Divider */}
                              <div className="block w-px h-8 bg-gray-300"></div>

                              {/* Cart */}
                              <button onClick={() => setOpenCartSection(true)} className="relative flex items-center px-1.5 md:px-2 lg:px-3 py-2 rounded text-gray-600 hover:text-red-500 transition-colors">
                                  <div className="relative">
                                      <IoCartOutline size={20} className="md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] md:text-xs font-bold rounded-full px-1.5 md:px-2 py-0.5 min-w-[18px] md:min-w-[22px] text-center">
                                          {cartItem.length || 0}
                                      </span>
                                  </div>
                              </button>

                              {/* Vertical Divider */}
                              <div className="block w-px h-8 bg-gray-300"></div>

                              {/* User Menu */}
                              {user?._id ? (
                                  <div 
                                      className="relative flex items-center gap-1 sm:gap-2 group"
                                  >
                                      <div className="flex items-center gap-1 sm:gap-2 cursor-pointer select-none">
                                          <FiUser size={20} className="text-gray-600 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                          <div className="hidden xl:flex flex-col">
                                              <span className="text-xs text-gray-600">Hello,</span>
                                              <span className="text-sm font-medium text-gray-700">My Account</span>
                                          </div>
                                      </div>
                                      {/* Invisible bridge để hover không bị ngắt */}
                                      <div className="absolute top-full left-0 right-0 h-3 hidden group-hover:block"></div>
                                      <div
                                          ref={userMenuRef}
                                          className="absolute right-0 top-full mt-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                                          style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}
                                      >
                                          <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                                              <UserMenu close={handleCloseUserMenu} />
                                          </div>
                                      </div>
                                  </div>
                              ) : (
                                  <div 
                                      className="relative group"
                                  >
                                      <div className="flex items-center gap-1 sm:gap-2 cursor-pointer select-none">
                                          <FiUser size={20} className="text-gray-600 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                          <div className="hidden xl:flex flex-col">
                                              <span className="text-xs text-gray-600">Hello,</span>
                                              <span className="text-sm font-medium text-gray-700">My Account</span>
                                          </div>
                                      </div>
                                      {/* Invisible bridge để hover không bị ngắt */}
                                      <div className="absolute top-full left-0 right-0 h-3 hidden group-hover:block"></div>
                                      <div className="absolute right-0 top-full mt-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                          <div className="bg-white rounded p-4 min-w-40 lg:shadow-lg shadow-2xl border border-gray-100">
                                              <button
                                                  onClick={redirectToLoginPage}
                                                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                                              >
                                                  Log In
                                              </button>
                                              <button
                                                  onClick={() => {
                                                      navigate("/register");
                                                  }}
                                                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                                              >
                                                  Register
                                              </button>
                                              <button
                                                  onClick={() => {
                                                      navigate("/forgot-password");
                                                  }}
                                                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                                              >
                                                  Forgot Password
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>
                          </div>
                      </div>
              )
          }

              {/* Mobile Search - Chỉ hiển thị trên mobile */}
              <div className='container mx-auto px-3 sm:px-4 md:hidden pb-3'>
                  <Search />
              </div>
          </div>

          {
              openCartSection && (
                  <DisplayCartItem close={() => setOpenCartSection(false)} />
              )
          }

          {/* Navigation Bar - Full Width */}
          <div className='w-full bg-white '>
              <div className='container mx-auto px-3 sm:px-4 lg:px-16 header-nav py-2 sm:py-3 flex justify-between items-center gap-2 sm:gap-3 lg:gap-4' >
          <div className='flex items-center justify-between header-nav-left flex-shrink-0'>
            <div className="relative">
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className='flex items-center gap-2 bg-[rgb(218,41,28)] hover:bg-[#b8321a] text-white font-bold rounded-md py-2 lg:py-[11px] px-3 lg:px-[26px]'>
                  <FiMenu size={18} className="lg:w-6 lg:h-6" />
                  <span className='text-sm lg:text-base xl:text-[18px] whitespace-nowrap'>Danh Mục</span>
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

          <div className='header-nav-middle flex-1 hidden lg:flex justify-center'>
            <ul className='navbar-nav flex items-center gap-4 lg:gap-6 xl:gap-12'>
              <li className='nav-item'>
                <a href="/product" className='nav-link text-black font-medium text-sm lg:text-base xl:text-lg hover:text-[#C83C2B] transition-colors whitespace-nowrap'>
                  Đi Chợ Tại Nhà
                </a>
              </li>
              <li className='nav-item flex items-center gap-1.5 lg:gap-2'>
                <a href="/hot-offers" className='nav-link text-black font-medium text-sm lg:text-base xl:text-lg hover:text-[#C83C2B] transition-colors whitespace-nowrap'>
                  Ưu Đãi Hot
                </a>
                <span className='bg-red-400 text-white text-[10px] lg:text-xs font-bold px-1.5 lg:px-2 py-0.5 rounded'>Hot</span>
              </li>
              <li className='nav-item'>
                <a href="/sale" className='nav-link text-black font-medium text-sm lg:text-base xl:text-lg hover:text-[#C83C2B] transition-colors whitespace-nowrap'>
                  Khuyến mãi
                </a>
              </li>
              <li className='nav-item'>
                <a href="#" className='nav-link text-black font-medium text-sm lg:text-base xl:text-lg hover:text-[#C83C2B] transition-colors whitespace-nowrap'>
                  Tin Tức
                </a>
              </li>
            </ul>
          </div>
          <div className='header-nav-right flex-shrink-0'>
            <button
                className='hidden lg:flex items-center gap-1.5 lg:gap-2 bg-pink-50 hover:bg-pink-100 text-[#C83C2B] font-bold rounded-lg py-2 px-3 lg:px-4 xl:px-6 text-sm lg:text-base xl:text-lg transition-colors whitespace-nowrap'
                onClick={handleOpenHotOffers}
            >
                <BsFillLightningFill size={18} className='lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-[#C83C2B]' />
                <span className="hidden xl:inline">Giảm giá hôm nay</span>
                <span className="lg:inline xl:hidden">Giảm giá</span>
            </button>
          </div>
          </div>
        </div>

        {/* Sidebar Menu - Chỉ hiển thị <= 1024px */}
        {openSidebarMenu && (
            <>
                {/* Overlay */}
                <div 
                    className='sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-[9998] lg:hidden transition-opacity duration-300'
                    onClick={() => setOpenSidebarMenu(false)}
                ></div>
                
                {/* Sidebar */}
                <div 
                    ref={sidebarMenuRef}
                    className={`fixed left-0 top-0 h-full w-80 bg-white z-[9999] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
                        openSidebarMenu ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {/* Sidebar Header */}
                    <div className='flex items-center justify-between p-4 border-b border-gray-200'>
                        <h2 className='text-lg font-bold text-gray-800'>Menu</h2>
                        <button
                            onClick={() => setOpenSidebarMenu(false)}
                            className='p-2 hover:bg-gray-100 rounded-md transition-colors'
                            aria-label="Close menu"
                        >
                            <IoClose size={24} className='text-gray-600' />
                        </button>
                    </div>
                    
                    {/* Sidebar Navigation */}
                    <nav className='flex flex-col py-4 overflow-y-auto h-[calc(100vh-73px)]'>
                        <Link
                            to="/product"
                            onClick={() => setOpenSidebarMenu(false)}
                            className='flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors'
                        >
                            <span className='text-base font-medium'>Đi Chợ Tại Nhà</span>
                            <FaAngleRight className='text-gray-400' size={16} />
                        </Link>
                        
                        <Link
                            to="/hot-offers"
                            onClick={() => setOpenSidebarMenu(false)}
                            className='flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors'
                        >
                            <div className='flex items-center gap-2'>
                                <span className='text-base font-medium'>Ưu Đãi Hot</span>
                                <span className='bg-red-400 text-white text-xs font-bold px-2 py-0.5 rounded'>Hot</span>
                            </div>
                            <FaAngleRight className='text-gray-400' size={16} />
                        </Link>
                        
                        <Link
                            to="/sale"
                            onClick={() => setOpenSidebarMenu(false)}
                            className='flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors'
                        >
                            <span className='text-base font-medium'>Khuyến mãi</span>
                            <FaAngleRight className='text-gray-400' size={16} />
                        </Link>
                        
                        <Link
                            to="#"
                            onClick={() => setOpenSidebarMenu(false)}
                            className='flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors'
                        >
                            <span className='text-base font-medium'>Tin Tức</span>
                            <FaAngleRight className='text-gray-400' size={16} />
                        </Link>
                    </nav>
                </div>
            </>
        )}

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
