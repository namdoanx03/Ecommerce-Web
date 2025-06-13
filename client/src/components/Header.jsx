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
import { BsFillLightningFill } from "react-icons/bs";
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
                                              ref={userMenuRef}
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
                <button className='flex items-center gap-3 bg-[rgb(218,41,28)] hover:bg-[#b8321a] text-white font-bold rounded-md py-[11px] px-[26px] mt-[21px]'>
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
            <ul className='navbar-nav flex items-center gap-12'>
              <li className='nav-item'>
                <a href="/product" className='nav-link text-black font-medium text-lg'>Đi Chợ Tại Nhà</a>
              </li>
              <li className='nav-item flex items-center gap-2'>
                <a href="/hot-offers" className='nav-link text-black font-medium text-lg'>Ưu Đãi Hot</a>
                <span className='bg-red-400 text-white text-xs font-bold px-2 py-0.5 rounded'>Hot</span>
              </li>
              <li className='nav-item'>
                <a href="/sale" className='nav-link text-black font-medium text-lg'>Khuyến mãi</a>
              </li>
              <li className='nav-item'>
                <a href="#" className='nav-link text-black font-medium text-lg'>Tin Tức</a>
              </li>
            </ul>
          </div>
          <div className='header-nav-right'>
            <button
                className='flex items-center gap-2 bg-red-50 hover:bg-red-100 text-[#C83C2B] font-bold rounded-lg py-2 px-6 text-lg mt-[20px]'
                onClick={handleOpenHotOffers}
            >
                <BsFillLightningFill size={24} className='text-[#C83C2B]' />
                <span>Giảm giá hôm nay</span>
            </button>
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
