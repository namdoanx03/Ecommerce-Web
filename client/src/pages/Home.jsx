import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { FaRegHandPointRight } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CiHeart } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AddToCartButton from '../components/AddToCartButton'

import banner1 from '../assets/1.jpg'
import banner2 from '../assets/2.jpg'
import banner3 from '../assets/3.jpg'
import banner4 from '../assets/4.jpg'
import banner5 from '../assets/5.jpg'
import banner6 from '../assets/6.jpg'
import banner7 from '../assets/7.jpg'
import banner8 from '../assets/8.jpg'
import banner9 from '../assets/9.jpg'
import banner10 from '../assets/10.jpg'
import banner11 from '../assets/11.jpg'
import banner12 from '../assets/12.jpg'
import banner13 from '../assets/13.jpg'


const Home = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  // Hàm tính giá sau khi giảm giá
  const pricewithDiscount = (price, discount) => {
    return Math.round(price - (price * discount) / 100);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const start = Date.now();
      try {
        const response = await Axios({
          ...SummaryApi.getProduct,
          data: { }
        });
        const { data: responseData } = response;
        if (responseData.success) {
          // Lọc sản phẩm có discount > 0
          const discountedProducts = responseData.data.filter(p => p.discount > 0);
          setProducts(discountedProducts);
        }
      } catch (error) {
        AxiosToastError(error)
      } finally {
        const elapsed = Date.now() - start;
        if (elapsed < 1300) {
          setTimeout(() => setLoading(false), 1300 - elapsed);
        } else {
          setLoading(false);
        }
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat)
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

    navigate(url)
    console.log(url)
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    cssEase: 'ease-in-out',
    lazyLoad: 'ondemand',
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1800,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const settings3 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Hàm chia mảng thành các nhóm 3 phần tử
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      let chunk = array.slice(i, i + size);
      while (chunk.length < size) {
        chunk.push(null);
      }
      result.push(chunk);
    }
    return result;
  };

  const productChunks = chunkArray(products, 3);

  // Spinner hiệu ứng chấm tròn động
  const BubbleSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
      <div className="bubble-spinner">
        <div></div><div></div><div></div><div></div><div></div>
      </div>
      <style>{`
        .bubble-spinner {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 60px;
        }
        .bubble-spinner div {
          width: 20px;
          height: 20px;
          background: #d84315;
          border-radius: 50%;
          opacity: 0.7;
          animation: bubble-bounce 1s infinite ease-in-out;
        }
        .bubble-spinner div:nth-child(2) {
          animation-delay: 0.15s;
          background: #e57373;
        }
        .bubble-spinner div:nth-child(3) {
          animation-delay: 0.3s;
          background: #ef9a9a;
        }
        .bubble-spinner div:nth-child(4) {
          animation-delay: 0.45s;
          background: #ffc1c1;
        }
        .bubble-spinner div:nth-child(5) {
          animation-delay: 0.6s;
          background: #ffebee;
        }
        @keyframes bubble-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-24px); opacity: 1; }
        }
      `}</style>
    </div>
  );

  return (
    <>
      {loading ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#fff',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <BubbleSpinner />
        </div>
      ) : (
        // Toàn bộ nội dung trang Home bên dưới
        <>
          {/* --- BẮT ĐẦU NỘI DUNG TRANG HOME --- */}
          <section className='bg-white home-section'>
            <div className="container mx-auto px-3 sm:px-4 lg:px-16 font-sans antialiased py-3 sm:py-4 md:py-3 lg:py-3">
              {/* Layout cho Desktop (>= 1024px): Banner lớn trái + 2 banner nhỏ phải */}
              <div className="hidden lg:flex gap-4 xl:gap-6 items-stretch">
                {/* Banner lớn bên trái */}
                <div className="bg-white rounded-2xl overflow-hidden flex relative flex-1" style={{
                  backgroundImage: `url(${banner1})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '450px',
                  height: '554px',
                }}>
                  <div className="relative z-10 flex flex-col justify-center h-full p-8 xl:p-12 max-w-[65%]">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-gray-600 font-medium text-sm xl:text-base">Ưu đãi độc quyền</span>
                      <span className="bg-red-100 text-[#C83C2B] font-bold px-2 py-2 text-xs xl:text-sm rounded-full">Giảm giá 30%</span>
                    </div>
                    <h1 className="text-2xl xl:text-3xl font-medium tracking-tight mb-2 text-black leading-tight">
                      Ở NHÀ VÀ NHẬN HÀNG   <br />
                      <span className="text-[#C83C2B] text-3xl xl:text-4xl font-bold block mt-1">NHU CẦU HÀNG NGÀY</span>
                    </h1>
                    <p className="text-gray-600 mb-6 xl:mb-7 text-sm xl:text-base font-medium">
                      Rau chứa nhiều vitamin và khoáng chất tốt cho sức khỏe.
                    </p>
                    <button onClick={() => window.location.href = '/product'} className="bg-[#C83C2B] hover:bg-[#b8321a] text-white font-bold px-6 xl:px-8 py-2.5 xl:py-3 rounded-xl text-base xl:text-lg flex items-center gap-2 w-fit shadow transition-all duration-200">
                      Mua ngay <FaRegHandPointRight size={18} />
                    </button>
                  </div>
                </div>
                {/* Banner nhỏ bên phải - vertical stack */}
                <div className="flex flex-col gap-4 xl:gap-5 w-[380px] xl:w-[450px]">
                  {/* Banner 1 */}
                  <div className="bg-white rounded-2xl overflow-hidden flex items-center transition flex-1" style={{
                    backgroundImage: `url(${banner2})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '265px',
                  }}>
                    <div className="flex flex-col justify-center flex-1 p-5 xl:p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-100 text-[#C83C2B] px-2 py-0.5 text-xs rounded-full font-bold">Giảm giá</span>
                        <span className="text-[#C83C2B] text-2xl font-extrabold">45%</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#C83C2B] mb-1">Bộ sưu tập hạt</h3>
                      <p className="text-gray-600 text-base font-medium mb-2">Chúng tôi cung cấp rau và trái cây hữu cơ</p>
                      <a href="/product" className="text-[#C83C2B] text-base font-bold flex items-center gap-1 hover:underline transition-all duration-200">
                        Mua ngay <FaRegHandPointRight size={18} />
                      </a>
                    </div>
                  </div>
                  {/* Banner 2 */}
                  <div className="bg-white rounded-2xl overflow-hidden flex items-center transition flex-1" style={{
                    backgroundImage: `url(${banner3})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '265px',
                  }}>
                    <div className="flex flex-col justify-center flex-1 p-5 xl:p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-100 text-[#C83C2B] px-2 py-0.5 text-xs rounded-full font-bold">Thực phẩm</span>
                        <span className="text-[#C83C2B] text-2xl font-extrabold">lành mạnh</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#C83C2B] mb-1">Chợ hữu cơ</h3>
                      <p className="text-gray-600 text-base font-medium mb-2">Bắt đầu mua sắm hàng <br /> ngày của bạn với một số...</p>
                      <a href="/product" className="text-[#C83C2B] text-base font-bold flex items-center gap-1 hover:underline transition-all duration-200">
                        Mua ngay <FaRegHandPointRight size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout cho Tablet (768px - 1023px): Banner full width + 2 banner horizontal */}
              <div className="hidden md:block lg:hidden">
                {/* Banner chính full width */}
                <div className="bg-white rounded-xl overflow-hidden flex relative mb-4" style={{
                  backgroundImage: `url(${banner1})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  height: '400px',
                }}>
                  <div className="relative z-10 flex flex-col justify-center h-full p-6 md:p-8 max-w-[60%]">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-gray-600 font-medium text-sm">Ưu đãi độc quyền</span>
                      <span className="bg-red-100 text-[#C83C2B] font-bold px-2 py-1 text-xs rounded-full">Giảm giá 30%</span>
                    </div>
                    <h1 className="text-2xl font-medium tracking-tight mb-2 text-black leading-tight">
                      Ở NHÀ VÀ NHẬN HÀNG   <br />
                      <span className="text-[#C83C2B] text-3xl font-bold block mt-1">NHU CẦU HÀNG NGÀY</span>
                    </h1>
                    <p className="text-gray-600 mb-5 text-sm font-medium">
                      Rau chứa nhiều vitamin và khoáng chất tốt cho sức khỏe.
                    </p>
                    <button onClick={() => window.location.href = '/product'} className="bg-[#C83C2B] hover:bg-[#b8321a] text-white font-bold px-6 py-2.5 rounded-lg text-base flex items-center gap-2 w-fit shadow transition-all duration-200">
                      Mua ngay <FaRegHandPointRight size={16} />
                    </button>
                  </div>
                </div>
                {/* 2 Banner horizontal */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl overflow-hidden flex items-center transition" style={{
                    backgroundImage: `url(${banner2})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    height: '250px',
                  }}>
                    <div className="flex flex-col justify-center flex-1 p-5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-red-100 text-[#C83C2B] px-2 py-0.5 text-xs rounded-full font-bold">Giảm giá</span>
                        <span className="text-[#C83C2B] text-xl font-extrabold">45%</span>
                      </div>
                      <h3 className="text-base font-bold text-[#C83C2B] mb-1">Bộ sưu tập hạt</h3>
                      <p className="text-gray-600 text-sm font-medium mb-2">Chúng tôi cung cấp rau và trái cây hữu cơ</p>
                      <a href="/product" className="text-[#C83C2B] text-sm font-bold flex items-center gap-1 hover:underline transition-all duration-200">
                        Mua ngay <FaRegHandPointRight size={14} />
                      </a>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden flex items-center transition" style={{
                    backgroundImage: `url(${banner3})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    height: '250px',
                  }}>
                    <div className="flex flex-col justify-center flex-1 p-5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-red-100 text-[#C83C2B] px-2 py-0.5 text-xs rounded-full font-bold">Thực phẩm</span>
                        <span className="text-[#C83C2B] text-xl font-extrabold">lành mạnh</span>
                      </div>
                      <h3 className="text-base font-bold text-[#C83C2B] mb-1">Chợ hữu cơ</h3>
                      <p className="text-gray-600 text-sm font-medium mb-2">Bắt đầu mua sắm hàng ngày...</p>
                      <a href="/product" className="text-[#C83C2B] text-sm font-bold flex items-center gap-1 hover:underline transition-all duration-200">
                        Mua ngay <FaRegHandPointRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout cho Mobile (< 768px): Stack vertical */}
              <div className="block md:hidden space-y-3">
                {/* Banner chính */}
                <div className="bg-white rounded-xl overflow-hidden flex relative" style={{
                  backgroundImage: `url(${banner1})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '320px',
                }}>
                  <div className="relative z-10 flex flex-col justify-center h-full p-4 sm:p-5 max-w-full">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-gray-600 font-medium text-xs">Ưu đãi độc quyền</span>
                      <span className="bg-red-100 text-[#C83C2B] font-bold px-2 py-1 text-xs rounded-full">Giảm giá 30%</span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-medium tracking-tight mb-2 text-black leading-tight">
                      Ở NHÀ VÀ NHẬN HÀNG   <br />
                      <span className="text-[#C83C2B] text-xl sm:text-2xl font-bold block mt-1">NHU CẦU HÀNG NGÀY</span>
                    </h1>
                    <p className="text-gray-600 mb-4 text-xs sm:text-sm font-medium">
                      Rau chứa nhiều vitamin và khoáng chất tốt cho sức khỏe.
                    </p>
                    <button onClick={() => window.location.href = '/product'} className="bg-[#C83C2B] hover:bg-[#b8321a] text-white font-bold px-4 sm:px-5 py-2 rounded-lg text-sm flex items-center gap-2 w-fit shadow transition-all duration-200">
                      Mua ngay <FaRegHandPointRight size={14} />
                    </button>
                  </div>
                </div>
                {/* Banner 1 */}
                <div className="bg-white rounded-xl overflow-hidden flex items-center transition" style={{
                  backgroundImage: `url(${banner2})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '200px',
                }}>
                  <div className="flex flex-col justify-center flex-1 p-4 sm:p-5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="bg-red-100 text-[#C83C2B] px-1.5 py-0.5 text-[10px] rounded-full font-bold">Giảm giá</span>
                      <span className="text-[#C83C2B] text-lg sm:text-xl font-extrabold">45%</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#C83C2B] mb-1">Bộ sưu tập hạt</h3>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Chúng tôi cung cấp rau và trái cây hữu cơ</p>
                    <a href="/product" className="text-[#C83C2B] text-xs sm:text-sm font-bold flex items-center gap-1 hover:underline transition-all duration-200">
                      Mua ngay <FaRegHandPointRight size={14} />
                    </a>
                  </div>
                </div>
                {/* Banner 2 */}
                <div className="bg-white rounded-xl overflow-hidden flex items-center transition" style={{
                  backgroundImage: `url(${banner3})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '200px',
                }}>
                  <div className="flex flex-col justify-center flex-1 p-4 sm:p-5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="bg-red-100 text-[#C83C2B] px-1.5 py-0.5 text-[10px] rounded-full font-bold">Thực phẩm</span>
                      <span className="text-[#C83C2B] text-lg sm:text-xl font-extrabold">lành mạnh</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#C83C2B] mb-1">Chợ hữu cơ</h3>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Bắt đầu mua sắm hàng ngày...</p>
                    <a href="/product" className="text-[#C83C2B] text-xs sm:text-sm font-bold flex items-center gap-1 hover:underline transition-all duration-200">
                      Mua ngay <FaRegHandPointRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='container mx-auto'>
              <div className={`w-full h-full min-h-48 bg-blue-100 rounded ${!banner && "animate-pulse my-2" } `}>
                  <img
                    src={banner}
                    className='w-full h-full hidden lg:block'
                    alt='banner' 
                  />
                  <img
                    src={bannerMobile}
                    className='w-full h-full lg:hidden'
                    alt='banner' 
                  />
              </div>
          </div> */}
            <section className='banner-section pt-6 md:pt-8'>
              {/* Banner khuyến mãi nhỏ dạng card chuẩn mẫu */}
              <div className="container mx-auto px-3 sm:px-4 lg:px-16">
              
              {/* Slider cho màn hình < 1280px */}
              <div className="block xl:hidden">
                <Slider
                  dots={false}
                  infinite={true}
                  speed={500}
                  slidesToShow={3}
                  slidesToScroll={1}
                  autoplay={true}
                  autoplaySpeed={3000}
                  pauseOnHover={true}
                  swipe={false}
                  draggable={false}
                  touchMove={false}
                  arrows={false}
                  responsive={[
                    {
                      breakpoint: 960,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        swipe: false,
                        draggable: false,
                      }
                    },
                    {
                      breakpoint: 640,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        swipe: false,
                        draggable: false,
                      }
                    }
                  ]}
                >
                {/* Card 1 */}
                <div className="px-2">
                <div
                  className="relative rounded-xl md:rounded-2xl overflow-hidden shadow w-full"
                  style={{
                    minHeight: '160px',
                    height: 'clamp(160px, 20vw, 180px)',
                    backgroundImage: `url(${banner4})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay chỉ cho text phía trên */}
                  <div
                    className="absolute top-4 sm:top-6 md:top-8 left-0 right-0 rounded-t-xl md:rounded-t-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-white bg-opacity-80 backdrop-blur-[5px]"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '0px 40px 40px 0px',
                      maxWidth: 420,
                      maxHeight: 105
                    }}
                  >
                    <h6 className="text-red-500 font-medium text-xs sm:text-sm mt-[-4px] sm:mt-[-7px]">Giảm giá 5%</h6>
                    <h5 className="font-semibold mb-1 text-xs sm:text-sm md:text-base line-clamp-2">Khuyến mãi hấp dẫn cho các mặt hàng mới</h5>
                    <div className="text-gray-500 text-xs sm:text-sm line-clamp-1">Trứng và sữa thiết yếu hàng ngày</div>
                  </div>
                  {/* Nút mua ngay */}
                  <a
                    href="/product"
                    className="absolute left-3 sm:left-4 bottom-1 px-2 sm:px-3 py-1 sm:py-2 text-white font-bold text-xs sm:text-sm"
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
                </div>
                {/* Card 2 */}
                <div className="px-2">
                <div
                  className="relative rounded-xl md:rounded-2xl overflow-hidden shadow w-full"
                  style={{
                    minHeight: '160px',
                    height: 'clamp(160px, 20vw, 180px)',
                    backgroundImage: `url(${banner5})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute top-4 sm:top-6 md:top-8 left-0 right-0 rounded-t-xl md:rounded-t-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-white bg-opacity-80 backdrop-blur-md"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '0px 40px 40px 0px',
                      maxWidth: 420,
                      maxHeight: 105
                    }}
                  >
                    <h6 className="text-red-500 font-medium text-xs sm:text-sm mt-[-4px] sm:mt-[-7px]">Giảm giá 5%</h6>
                    <h5 className="font-semibold mb-1 text-xs sm:text-sm md:text-base line-clamp-2">Mua nhiều hơn tiết kiệm nhiều hơn</h5>
                    <div className="text-gray-500 text-xs sm:text-sm line-clamp-1">Rau tươi</div>
                  </div>
                  <a
                    href="/product"
                    className="absolute left-3 sm:left-4 bottom-1 px-2 sm:px-3 py-1 sm:py-2 text-white font-bold text-xs sm:text-sm"
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
                </div>
                {/* Card 3 */}
                <div className="px-2">
                <div
                  className="relative rounded-xl md:rounded-2xl overflow-hidden shadow w-full"
                  style={{
                    minHeight: '160px',
                    height: 'clamp(160px, 20vw, 180px)',
                    backgroundImage: `url(${banner6})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute top-4 sm:top-6 md:top-8 left-0 right-0 rounded-t-xl md:rounded-t-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-white bg-opacity-80 backdrop-blur-md"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '0px 40px 40px 0px',
                      maxWidth: 420,
                      maxHeight: 105
                    }}>
                    <h6 className="text-red-500 font-medium text-xs sm:text-sm mt-[-4px] sm:mt-[-7px]">Giảm giá 5%</h6>
                    <h5 className="font-semibold mb-1 text-xs sm:text-sm md:text-base line-clamp-2">Thịt hữu cơ chế biến</h5>
                    <div className="text-gray-500 text-xs sm:text-sm line-clamp-1">Giao đến tận nhà bạn</div>
                  </div>
                  <a
                    href="/product"
                    className="absolute left-3 sm:left-4 bottom-1 px-2 sm:px-3 py-1 sm:py-2 text-white font-bold text-xs sm:text-sm"
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
                </div>
                {/* Card 4 */}
                <div className="px-2">
                <div
                  className="relative rounded-xl md:rounded-2xl overflow-hidden shadow w-full"
                  style={{
                    minHeight: '160px',
                    height: 'clamp(160px, 20vw, 180px)',
                    backgroundImage: `url(${banner7})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute top-4 sm:top-6 md:top-8 left-0 right-0 rounded-t-xl md:rounded-t-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-white bg-opacity-80 backdrop-blur-md"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '0px 40px 40px 0px',
                      maxWidth: 420,
                      maxHeight: 105
                    }}>
                    <h6 className="text-red-500 font-medium text-xs sm:text-sm mt-[-4px] sm:mt-[-7px]">Giảm giá 5%</h6>
                    <h5 className="font-semibold mb-1 text-xs sm:text-sm md:text-base line-clamp-2">Mua nhiều hơn tiết kiệm nhiều hơn</h5>
                    <div className="text-gray-500 text-xs sm:text-sm line-clamp-1">Các loại hạt và đồ ăn nhẹ</div>
                  </div>
                  <a
                    href="/product"
                    className="absolute left-3 sm:left-4 bottom-1 px-2 sm:px-3 py-1 sm:py-2 text-white font-bold text-xs sm:text-sm"
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
                </div>
                </Slider>
              </div>

              {/* Grid cho màn hình >= 1280px */}
              <div className="hidden xl:grid xl:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow w-full"
                  style={{
                    height: '180px',
                    backgroundImage: `url(${banner4})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div
                    className="absolute top-8 left-0 right-0 rounded-t-2xl px-5 py-4 bg-white bg-opacity-80 backdrop-blur-[5px]"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '0px 60px 60px 0px',
                      maxWidth: 420,
                      maxHeight: 105
                    }}
                  >
                    <h6 className="text-red-500 font-medium text-sm mt-[-7px]">Giảm giá 5%</h6>
                    <h5 className="font-semibold mb-1 text-base">Khuyến mãi hấp dẫn cho các mặt hàng mới</h5>
                    <div className="text-gray-500 text-sm">Trứng và sữa thiết yếu hàng ngày</div>
                  </div>
                  <a
                    href="/product"
                    className="absolute left-4 bottom-1 px-3 py-2 text-white font-bold text-sm"
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
                {/* Card 2 */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow w-full"
                  style={{
                    height: '180px',
                    backgroundImage: `url(${banner5})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute top-8 left-0 right-0 rounded-t-2xl px-5 py-4 bg-white bg-opacity-80 backdrop-blur-md"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '0px 60px 60px 0px',
                      maxWidth: 420,
                      maxHeight: 105
                    }}
                  >
                    <h6 className="text-red-500 font-medium text-sm mt-[-7px]">Giảm giá 5%</h6>
                    <h5 className="font-semibold mb-1 text-base">Mua nhiều hơn tiết kiệm nhiều hơn</h5>
                    <div className="text-gray-500 text-sm">Rau tươi</div>
                  </div>
                  <a
                    href="/product"
                    className="absolute left-4 bottom-1 px-3 py-2 text-white font-bold text-sm"
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
                {/* Card 3 */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow w-full"
                  style={{
                    height: '180px',
                    backgroundImage: `url(${banner6})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute top-8 left-0 right-0 rounded-t-2xl px-5 py-4 bg-white bg-opacity-80 backdrop-blur-md"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '0px 60px 60px 0px',
                      maxWidth: 420,
                      maxHeight: 105
                    }}>
                    <h6 className="text-red-500 font-medium text-sm mt-[-7px]">Giảm giá 5%</h6>
                    <h5 className="font-semibold mb-1 text-base">Thịt hữu cơ chế biến</h5>
                    <div className="text-gray-500 text-sm">Giao đến tận nhà bạn</div>
                  </div>
                  <a
                    href="/product"
                    className="absolute left-4 bottom-1 px-3 py-2 text-white font-bold text-sm"
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
                {/* Card 4 */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow w-full"
                  style={{
                    height: '180px',
                    backgroundImage: `url(${banner7})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute top-8 left-0 right-0 rounded-t-2xl px-5 py-4 bg-white bg-opacity-80 backdrop-blur-md"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '0px 60px 60px 0px',
                      maxWidth: 420,
                      maxHeight: 105
                    }}>
                    <h6 className="text-red-500 font-medium text-sm mt-[-7px]">Giảm giá 5%</h6>
                    <h5 className="font-semibold mb-1 text-base">Mua nhiều hơn tiết kiệm nhiều hơn</h5>
                    <div className="text-gray-500 text-sm">Các loại hạt và đồ ăn nhẹ</div>
                  </div>
                  <a
                    href="/product"
                    className="absolute left-4 bottom-1 px-3 py-2 text-white font-bold text-sm"
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
              </div>
              </div>
            </section>

            {/* Banner ngang 2 card giống mẫu */}
            

          </section>

          <section className="product-section bg-white py-8 md:pt-12">
            <div className="container mx-auto px-3 sm:px-4 lg:px-16">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
                <div className="hidden xl:block xl:col-span-4 2xl:col-span-3">
                  <div className="sticky top-[10px] self-start">
                    <div className="category-menu bg-[#F8F8F8] rounded-xl shadow flex flex-col p-4 lg:p-6">
                      <h3 className="font-bold text-lg lg:text-xl mb-3 lg:mb-4 border-b-2 border-red-500 w-fit pb-1">Danh Mục</h3>
                      <ul className="flex flex-col gap-1">
                        {categoryData.map((cat) => (
                          <a
                            key={cat._id}
                            className="relative group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                            href={`/product?category=${cat._id}`}
                          >
                            <img src={cat.icon || cat.image} className="w-7 h-7 object-contain" />
                            <span className="text-base font-medium truncate">{cat.name}</span>
                          </a>
                        ))}
                      </ul>
                      <div className="border-t my-4"></div>
                      <ul className="flex flex-col gap-2">
                        <li className="px-3 py-2 text-gray-600 hover:text-red-500 cursor-pointer">50 Ưu đãi hàng đầu</li>
                        <li className="px-3 py-2 text-gray-600 hover:text-red-500 cursor-pointer">Hàng mới về</li>
                      </ul>
                    </div>
                    <div className="relative aspect-w-16 aspect-h-9 section-t-space mt-10">
                      <div className="home-container">
                        <div
                          className="bg-white rounded-2xl shadow p-6 flex flex-col items-start w-full max-w-xs mx-auto"
                          style={{
                            minHeight: 470,
                            backgroundImage: `url(${banner8})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          <span className="text-yellow-500 text-sm font-semibold mb-1">Các sản phẩm</span>
                          <h3 className="text-2xl font-bold uppercase mb-1">
                            HẢI SẢN TƯƠI MỚI <span className="text-[#d94c3a]">MỖI GIỜ</span>
                          </h3>
                          <div className="text-gray-700 text-lg mb-4">mỗi ngày</div>
                          <button  onClick={() => window.location.href = '/product'} className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition mb-4">
                            Mua ngay <span className="ml-1">→</span>
                          </button>
                          
                        </div>
                      </div>
                    </div>
                    <div className="relative aspect-w-16 aspect-h-9 section-t-space mt-10">
                      <div className="home-container">
                        <div
                          className="bg-white rounded-2xl shadow p-6 flex flex-col items-start w-full max-w-xs mx-auto"
                          style={{
                            minHeight: 780,
                            backgroundImage: `url(${banner11})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          <span className="text-yellow-500 text-lg font-bold mb-1 ">Rau</span>
                          <h3 className="text-4xl text-[#d94c3a] font-bold uppercase mb-1">
                            TƯƠI   <br />
                            <span className="text-gray-700 font-medium">HỮU CƠ</span>
                          </h3>
                          <div className="text-gray-700 text-base mb-4">Siêu khuyến mại giảm giá tới 50%</div>
                          <button  onClick={() => window.location.href = '/product'} className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition mb-4">
                            Mua ngay <span className="ml-1">→</span>
                          </button>
                          
                        </div>
                      </div>
                    </div>
                    <div className="category-menu bg-[#F8F8F8] rounded-xl shadow flex flex-col p-6 mt-10 mb-10">
                      <h3 className="font-bold text-xl mb-4 border-b-2 border-red-500 w-fit pb-1">Sản phẩm thịnh hành</h3>
                      
                      {products.slice(0, 4).map((p, index) => (
                        <a
                          key={p._id}
                          href={`/product/${p._id}`}
                          className="flex items-center gap-4 py-4 hover:bg-gray-100 transition-colors rounded-lg px-2"
                          style={{ borderBottom: index < 3 ? '2px dotted #e5e7eb' : 'none' }}
                        >
                          <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden">
                            <img 
                              src={p.image[0]} 
                              alt={p.name} 
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1 leading-tight">
                              {p.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">
                              {p.unit || '450 G'}
                            </p>
                            <p className="text-emerald-600 font-bold text-base">
                              ${pricewithDiscount(p.price, p.discount).toLocaleString("en-US")}
                            </p>
                          </div>
                        </a>
                      ))}
                      
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-8 2xl:col-span-9">
                  <div className="title flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3 md:gap-4">
                    <div className="text-left w-full sm:w-auto">
                      <h2 className="font-bold text-xl md:text-2xl text-black mb-1 pb-1">Các Sản Phẩm Đang Giảm Giá</h2>
                      <div className="flex gap-3 md:gap-4 mt-2 mb-2">
                        <div className="h-0.5 w-16 md:w-20 bg-red-300 rounded"></div>
                        <div className="h-0.5 w-16 md:w-20 bg-red-300 rounded"></div>
                      </div>
                      <p className="text-sm md:text-base text-gray-500 my-2 md:my-4">Đừng bỏ lỡ cơ hội giảm giá đặc biệt chỉ có trong tuần này.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 bg-red-500 text-white px-3 md:px-5 py-2 rounded-lg font-semibold shadow text-xs md:text-sm whitespace-nowrap">
                      <FaRegClock className="mr-1 md:mr-2 text-sm md:text-lg" />
                      <span className="hidden sm:inline">hết hạn vào :</span>
                      <span className="sm:hidden">còn:</span>
                      <span className="font-mono font-bold ml-1 md:ml-2">6 Ngày</span>
                      <span className="font-mono font-bold">:</span>
                      <span className="font-mono font-bold">06</span>
                      <span className="font-mono font-bold">:</span>
                      <span className="font-mono font-bold">41</span>
                      <span className="font-mono font-bold">:</span>
                      <span className="font-mono font-bold">58</span>
                    </div>
                  </div>
                   {/* Slider cho Mobile - 2 hàng x 2 cột */}
                   <div className="block md:hidden">
                     {loading ? (
                       <div className="flex justify-center py-20">
                         <BubbleSpinner />
                       </div>
                     ) : (
                       <Slider
                         dots={false}
                         infinite={false}
                         speed={500}
                         slidesToShow={1}
                         slidesToScroll={1}
                         swipe={true}
                         draggable={true}
                         arrows={false}
                       >
                         {/* Chia products thành các nhóm 4 (2x2) */}
                         {Array.from({ length: Math.ceil(products.length / 4) }, (_, slideIndex) => (
                           <div key={slideIndex} className="px-1">
                             <div className="grid grid-cols-2 gap-0">
                               {products.slice(slideIndex * 4, slideIndex * 4 + 4).map((p, index) => {
                                 const actualIndex = slideIndex * 4 + index;
                                 return (
                                   <div
                                     key={p._id}
                                     className="relative bg-white border border-gray-200 overflow-hidden group"
                                   >
                                     {/* NEW Badge */}
                                     {actualIndex % 3 === 1 && (
                                       <div className="absolute top-2 right-2 z-10">
                                         <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-md">NEW</span>
                                       </div>
                                     )}
                                     
                                     <a href={`/product/${p._id}`} className="block p-2">
                                       <div className="flex justify-center items-center mb-2 bg-gray-50 rounded-lg overflow-hidden" style={{ height: '140px' }}>
                                         <img 
                                           src={p.image[0]} 
                                           alt={p.name} 
                                           className="object-contain w-full h-full p-2" 
                                         />
                                       </div>
                                       
                                       <div className="space-y-1">
                                         <h3 className="text-[11px] font-semibold text-gray-800 line-clamp-2 min-h-[32px] leading-tight">
                                           {p.name}
                                         </h3>
                                         
                                         <div className="flex items-baseline gap-1">
                                           <span className="text-emerald-600 font-bold text-sm">
                                             ${pricewithDiscount(p.price, p.discount).toLocaleString("en-US")}
                                           </span>
                                           <span className="text-gray-400 line-through text-[10px]">
                                             ${p.price.toLocaleString("en-US")}
                                           </span>
                                         </div>
                                         
                                         <div className="flex items-center gap-1 mb-1">
                                           <div className="flex items-center gap-0.5">
                                             {[...Array(5)].map((_, i) => (
                                               <svg
                                                 key={i}
                                                 className={`w-2.5 h-2.5 fill-current ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                                 xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 20 20"
                                                 fill="currentColor"
                                               >
                                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.973c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.389 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.037 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
                                               </svg>
                                             ))}
                                           </div>
                                           <span className="text-emerald-600 text-[10px] font-semibold">
                                             {p.stock === 0 ? 'Hết hàng' : 'Còn hàng'}
                                           </span>
                                         </div>
                                       </div>
                                     </a>
                                     
                                     <div className="px-2 pb-2 flex justify-center">
                                       <button 
                                         onClick={(e) => {
                                           e.preventDefault();
                                         }}
                                         className="w-[90%] px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-colors shadow-md text-xs font-semibold"
                                       >
                                         Thêm vào giỏ
                                       </button>
                                     </div>
                                   </div>
                                 );
                               })}
                             </div>
                           </div>
                         ))}
                       </Slider>
                     )}
                   </div>

                   {/* Grid cho Tablet & Desktop */}
                   <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-0">
                     {loading ? (
                       <div className="col-span-full flex justify-center py-20">
                         <BubbleSpinner />
                       </div>
                     ) : (
                       (() => {
                         // Tính số sản phẩm hiển thị: 2 hàng x số cột tương ứng
                         // md: 3 cột x 2 = 6, lg: 4 cột x 2 = 8, xl: 4 cột x 2 = 8, 2xl: 5 cột x 2 = 10
                         const displayProducts = products.slice(0, 10);
                         return displayProducts.map((p, index) => {
                           // Logic bo góc động theo breakpoint
                           const getRoundedClass = () => {
                             // Cho 2xl: 5 cột
                             if (index === 0) return '2xl:rounded-tl-xl xl:rounded-tl-xl lg:rounded-tl-xl md:rounded-tl-xl';
                             if (index === 4) return '2xl:rounded-tr-xl';
                             if (index === 5) return '2xl:rounded-bl-xl';
                             if (index === 9) return '2xl:rounded-br-xl';
                             
                             // Cho xl: 4 cột (chỉ hiển thị 8 sản phẩm)
                             if (index === 3) return 'xl:rounded-tr-xl 2xl:rounded-none lg:rounded-tr-xl';
                             if (index === 4) return 'xl:rounded-bl-xl 2xl:rounded-none lg:rounded-bl-xl';
                             if (index === 7) return 'xl:rounded-br-xl 2xl:rounded-none lg:rounded-br-xl';
                             
                             // Cho md: 3 cột (chỉ hiển thị 6 sản phẩm)
                             if (index === 2) return 'md:rounded-tr-xl lg:rounded-none xl:rounded-none';
                             if (index === 3) return 'md:rounded-bl-xl lg:rounded-none xl:rounded-none';
                             if (index === 5) return 'md:rounded-br-xl lg:rounded-none xl:rounded-none';
                             
                             return '';
                           };
                           
                           // Ẩn sản phẩm thừa ở các breakpoint nhỏ hơn
                           let hideClass = '';
                           if (index >= 8) hideClass += ' hidden 2xl:block'; // Ẩn sản phẩm 9-10 ở màn XL trở xuống
                           else if (index >= 6) hideClass += ' hidden lg:block'; // Ẩn sản phẩm 7-8 ở màn md
                           
                           const roundedClass = getRoundedClass();
                         
                         return (
                         <div
                           key={p._id}
                           className={`relative bg-white border border-gray-200 overflow-hidden group ${roundedClass}${hideClass}`}
                         >
                           {/* NEW Badge */}
                           {index % 3 === 1 && (
                             <div className="absolute top-3 xl:top-4 right-3 xl:right-4 z-10">
                               <span className="bg-yellow-500 text-white text-xs xl:text-sm font-bold px-3 xl:px-4 py-1 xl:py-1.5 rounded-sm shadow-md">NEW</span>
                             </div>
                           )}
                           
                           {/* Product Link */}
                           <a href={`/product/${p._id}`} className="block p-3 md:p-4 xl:p-5">
                             {/* Product Image - Chỉ phóng to ảnh khi hover */}
                             <div className="relative flex flex-col justify-center items-center mb-3 md:mb-4">
                               <div className="bg-gray-50 rounded-lg overflow-hidden w-full h-[160px] md:h-[180px] xl:h-[200px]">
                                 <img 
                                   src={p.image[0]} 
                                   alt={p.name} 
                                   className="object-contain w-full h-full p-2 xl:p-3 group-hover:scale-110 transition-transform duration-300" 
                                 />
                               </div>
                               
                               {/* Hover Icons - xuất hiện ở dưới ảnh khi hover - Ẩn trên mobile */}
                               <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-0 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 z-20">
                                 <div className="flex items-center gap-2 xl:gap-2.5 bg-white rounded-md shadow-lg px-2 xl:px-3 py-1 xl:py-1.5">
                                   <button 
                                     onClick={(e) => { e.preventDefault(); }}
                                     className="p-1 xl:p-1.5 hover:text-emerald-500 transition-colors"
                                     title="Quick View"
                                   >
                                     <IoEyeOutline className="w-5 h-5 xl:w-6 xl:h-6" />
                                   </button>
                                   <div className="w-px h-5 xl:h-6 bg-gray-300"></div>
                                   <button 
                                     onClick={(e) => { e.preventDefault(); }}
                                     className="p-1 xl:p-1.5 hover:text-emerald-500 transition-colors"
                                     title="Compare"
                                   >
                                     <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                     </svg>
                                   </button>
                                   <div className="w-px h-5 xl:h-6 bg-gray-300"></div>
                                   <button 
                                     onClick={(e) => { e.preventDefault(); }}
                                     className="p-1 xl:p-1.5 hover:text-emerald-500 transition-colors"
                                     title="Add to Wishlist"
                                   >
                                     <CiHeart className="w-5 h-5 xl:w-6 xl:h-6" />
                                   </button>
                                 </div>
                               </div>
                             </div>
                             
                             {/* Product Info */}
                             <div className="space-y-1.5 md:space-y-2 xl:space-y-2.5">
                               {/* Product Name */}
                               <h3 className="text-xs md:text-sm xl:text-base font-semibold text-gray-800 line-clamp-2 min-h-[36px] md:min-h-[40px] xl:min-h-[44px] leading-tight">
                                 {p.name}
                               </h3>
                               
                               {/* Price */}
                               <div className="flex items-baseline gap-1.5 xl:gap-2">
                                 <span className="text-emerald-600 font-bold text-base md:text-lg xl:text-xl">
                                   ${pricewithDiscount(p.price, p.discount).toLocaleString("en-US")}
                                 </span>
                                 <span className="text-gray-400 line-through text-[11px] md:text-xs xl:text-sm">
                                   ${p.price.toLocaleString("en-US")}
                                 </span>
                               </div>
                               
                               {/* Rating & Stock */}
                               <div className="flex items-center gap-1.5 xl:gap-2 mb-2">
                                 <div className="flex items-center gap-0.5">
                                   {[...Array(5)].map((_, i) => (
                                     <svg
                                       key={i}
                                       className={`w-3 h-3 md:w-3.5 md:h-3.5 xl:w-4 xl:h-4 fill-current ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                       xmlns="http://www.w3.org/2000/svg"
                                       viewBox="0 0 20 20"
                                       fill="currentColor"
                                     >
                                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.973c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.389 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.037 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
                                     </svg>
                                   ))}
                                 </div>
                                 <span className="text-emerald-600 text-[11px] md:text-xs xl:text-sm font-semibold">
                                   {p.stock === 0 ? 'Hết hàng' : 'Còn hàng'}
                                 </span>
                               </div>
                             </div>
                           </a>
                           
                           {/* Add to Cart Button */}
                           <div className="px-3 md:px-4 xl:px-5 pb-3 md:pb-4 xl:pb-5 flex justify-center">
                             <button 
                               onClick={(e) => {
                                 e.preventDefault();
                                 // Add to cart logic
                               }}
                               className="w-[90%] px-4 py-2.5 md:py-3 xl:py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-colors shadow-md text-sm md:text-base xl:text-base font-semibold"
                             >
                               Thêm vào giỏ
                             </button>
                           </div>
                         </div>
                         );
                       });
                       })()
                     )}
                   </div>
                  <div className="title flex flex-col sm:flex-row justify-between items-center my-8 gap-4">
                    <div className="text-left">
                      <h2 className="font-bold text-2xl text-black mb-1 pb-1">Danh mục nổi bật</h2>
                      <div className="flex  gap-4 mt-2 mb-2">
                        <div className="h-0.5 w-20 bg-red-300 rounded"></div>
                        <div className="h-0.5 w-20 bg-red-300 rounded"></div>
                      </div>
                      <p className="text-base text-gray-500 my-4">Các danh mục hàng đầu của tuần </p>
                    </div>

                  </div>
                  <div className="display-categories" style={{ borderRadius: '10px', marginBottom: '60px' }}>
                    <Slider {...settings2}>
                      {categoryData.map((cat) => (
                        <div
                        key={cat._id}
                        className="group flex flex-col text-left px-4 py-4 bg-gray-100 border-x-8 border-white w-full h-full rounded-xl
                        hover:bg-[url('https://devidai.io.vn/assets/images/vegetable/shape.png')] hover:bg-cover hover:bg-center hover:bg-[rgba(218,41,28,1)] "
                        style={{ minWidth: 170, minHeight: 134, background: '#fff' }}
                      >
                        <div className="flex flex-col justify-center items-center mb-2">
                          <img
                            src={cat.icon || cat.image}
                            alt={cat.name}
                            className="object-contain h-32 group-hover:brightness-0 group-hover:invert "
                            style={{ maxHeight: 43, maxWidth: 43 }}
                          />
                          <div className="font-medium text-base my-2 line-clamp-2 truncate max-w-[170px] px-4 group-hover:text-white ">
                            {cat.name}
                          </div>
                        </div>
                      </div>
                      
                      ))}
                    </Slider>
                  </div>
                  {/* Banner khuyến mãi 2 cột giống mẫu */}
                  <div className="banner-discount flex gap-6 w-full my-8">
                    {/* Card 1 */}
                    <div
                      className="flex flex-1 bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden items-center p-6 min-h-[180px]"
                      style={{ backgroundImage: `url(${banner9})` }}
                    >
                      <div className="flex-1">
                        <div className="text-3xl font-semibold mb-2">Giảm giá 50%</div>
                        <div className="text-2xl font-bold text-[#d94c3a] mb-4">Thịt tươi</div>
                        <button  onClick={() => window.location.href = '/product'} className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition">
                          Mua ngay <span className="ml-1">→</span>
                        </button>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div
                      className="flex flex-1 bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden items-center p-6 min-h-[180px]"
                      style={{ backgroundImage: `url(${banner10})` }}
                    >
                      <div className="flex-1">
                        <div className="text-3xl font-semibold mb-2">Giảm giá 50%</div>
                        <div className="text-2xl font-bold text-[#d94c3a] mb-4">Nấm Testy</div>
                        <button  onClick={() => window.location.href = '/product'} className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition">
                          Mua ngay <span className="ml-1">→</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="title flex flex-col sm:flex-row justify-between items-center my-8 gap-4">
                    <div className="text-left">
                      <h2 className="font-bold text-2xl text-black mb-1 pb-1">Đồ khô & Đóng gói</h2>
                      <div className="flex  gap-4 mt-2 mb-2">
                        <div className="h-0.5 w-20 bg-red-300 rounded"></div>
                        <div className="h-0.5 w-20 bg-red-300 rounded"></div>
                      </div>
                      <p className="text-base text-gray-500 my-4">Lựa chọn đa dạng các sản phẩm thực phẩm khô, đóng gói tiện dụng – chất lượng đảm bảo, giá cả hợp lý, giao hàng nhanh chóng.</p>
                    </div>

                  </div>
                  <div className="display-product" style={{ borderRadius: '10px', border: '1px solid #ccc', overflow: 'hidden' }}>
                    <Slider {...settings}>
                      {loading ? (
                        <BubbleSpinner />
                      ) : (
                        [...products].reverse().map((p, idx) => (
                          <a
                            href={`/product/${p._id}`}
                            key={p._id}
                            className={
                              `flex flex-col items-stretch text-left px-4 py-4` +
                              (idx !== products.length - 1 ? ' border-x border-gray-200' : '')
                            }
                            style={{ width: 240, minHeight: 370, background: '#fff' }}
                          >
                            <div className="flex justify-center items-center mb-2" style={{ height: 140 }}>
                              <img src={p.image[0]} alt={p.name} className="object-contain h-32" style={{ maxHeight: 130, maxWidth: 130 }} />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="font-semibold text-sm mb-1 leading-tight line-clamp-2 trumcate" style={{ minHeight: 42, lineHeight: '1.5' }}>{p.name}</div>
                                <div className="flex items-end gap-2 mb-1">
                                  <span className="text-red-600 font-bold text-lg">{pricewithDiscount(p.price, p.discount).toLocaleString("vi-VN")} đ</span>
                                  <span className="text-gray-400 line-through text-sm">{p.price.toLocaleString("vi-VN")} đ</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className="w-4 h-4 fill-current text-yellow-400"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.973c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.389 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.037 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
                                    </svg>
                                  ))}
                                  <span className="text-red-500 font-semibold text-base ml-2">{p.stock === 0 ? 'Hết hàng' : 'Còn hàng'}</span>
                                </div>
                              </div>
                              <div className='flex justify-center items-center mt-5'>
                                <AddToCartButton data={p} />
                              </div>
                            </div>
                          </a>
                        ))
                      )}
                    </Slider>
                  </div>
                  {/* Banner khuyến mãi */}
                  <div className="banner-discount2 flex w-full my-8 gap-6 min-h-[240px]">
                    {/* Card 1 bên trái (8 phần) */}
                    <div
                      className="flex flex-col bg-cover bg-center bg-no-repeat rounded-md overflow-hidden p-6 "
                      style={{ backgroundImage: `url(${banner12})`, flexBasis: '66.6667%' }}
                    >
                      <div className="flex-1 flex flex-col justify-center">
                        <div
                          className="text-3xl font-semibold mb-2"
                          style={{ fontFamily: "'Dancing Script', cursive", color: '#d94c3a' }}
                        >
                          Sẵn Sàng Để Mua Sắm
                        </div>
                        <div className="text-2xl font-semibold mb-4">cho ngày hôm nay!</div>
                        <div className="text-xs font-semibold mb-4 " style={{ color: '#4C5566', lineHeight: '1.5' }}>Bắt đầu ngày mới đầy năng lượng – tìm <br/>hàng nhanh, mua sắm gọn!</div>
                        <button  onClick={() => window.location.href = '/product'} className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition w-max">
                          Mua ngay <span className="ml-1">→</span>
                        </button>
                      </div>
                    </div>

                    {/* Card 2 bên phải (4 phần) */}
                    <div
                      className="flex flex-col bg-cover bg-center bg-no-repeat rounded-md overflow-hidden p-6 "
                      style={{ backgroundImage: `url(${banner13})`, flexBasis: '33.3333%' }}
                    >
                      <div className="flex-1 flex flex-col justify-center">
                        <div
                          className="text-3xl font-semibold mb-2"
                          style={{ fontFamily: "'Dancing Script', cursive", color: '#d94c3a' }}
                        >
                          Giảm Giá 20%
                        </div>
                        <div className="text-2xl font-bold text-[#d94c3a] mb-4">Tất cả <br/> <span className="text-black">Đồ uống</span></div>
                        <button  onClick={() => window.location.href = '/product'} className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition w-max">
                          Mua ngay <span className="ml-1">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="title flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-3 md:gap-4">
                    <div className="text-left w-full sm:w-auto">
                      <h2 className="font-bold text-xl md:text-2xl text-black mb-1 pb-1">Sản phẩm bán chạy</h2>
                      <div className="flex gap-3 md:gap-4 mt-2 mb-2">
                        <div className="h-0.5 w-16 md:w-20 bg-red-300 rounded"></div>
                        <div className="h-0.5 w-16 md:w-20 bg-red-300 rounded"></div>
                      </div>
                      <p className="text-sm md:text-base text-gray-500 my-2 md:my-4">Trợ lý ảo thu thập các sản phẩm từ danh sách của bạn</p>
                    </div>
                  </div>
                  
                  {/* Grid 3 cột cho Best Seller - Giống mẫu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                    {/* Chia products thành 3 nhóm (mỗi cột 4 sản phẩm) */}
                    {[0, 1, 2].map((colIndex) => (
                      <div 
                        key={colIndex}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {products.slice(colIndex * 4, colIndex * 4 + 4).map((p, itemIndex) => (
                          <a
                            key={p._id}
                            href={`/product/${p._id}`}
                            className="block p-4 hover:bg-gray-50 transition-colors"
                            style={{ 
                              borderBottom: itemIndex < 3 ? '1px dotted #d1d5db' : 'none' 
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                                <img 
                                  src={p.image[0]} 
                                  alt={p.name} 
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2 leading-tight">
                                  {p.name}
                                </h4>
                                <p className="text-xs text-gray-500 mb-2">
                                  {p.unit || '500 G'}
                                </p>
                                <p className="text-emerald-600 font-bold text-base">
                                  $ {pricewithDiscount(p.price, p.discount).toLocaleString("en-US")}
                                </p>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Banner Rau Củ Mùa Hè */}
                  <div 
                    className="relative rounded-2xl overflow-hidden mb-12 flex items-center justify-center" 
                    style={{ 
                      // minHeight: '350px',
                      // height: '350px',
                      backgroundImage: "url('https://themes.pixelstrap.com/fastkart/assets/images/vegetable/banner/14.jpg')",
                      backgroundSize: 'cover',
                      // backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div className="relative z-10 text-center px-6 py-8">
                      <p className="text-emerald-600 font-semibold text-xs md:text-sm mb-2 tracking-[0.3em] uppercase">M Ù A HÈ</p>
                      <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-3">
                        RAU CỦ
                      </h2>
                      <p className="text-gray-600 text-base md:text-lg mb-6">Tiết kiệm tới 5%</p>
                      <button 
                        onClick={() => window.location.href = '/product'} 
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 transition text-sm md:text-base shadow-lg"
                      >
                        Mua Ngay <span className="ml-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="newsletter-section bg-white pb-12">
            <div className="container mx-auto px-3 sm:px-4 lg:px-16">
              <div 
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                  minHeight: '180px',
                }}
              >
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-8 w-16 h-16 border-2 border-white rounded-lg transform rotate-12"></div>
                  <div className="absolute top-8 right-12 w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <div className="absolute bottom-6 left-1/4 w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white rounded-full"></div>
                  <div className="absolute bottom-8 right-16">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-sm"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-sm"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 py-8 md:py-10 gap-6">
                  {/* Left side - Text & Form */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                    Đăng ký nhận Bản tin của chúng tôi và nhận...
                    </h3>
                    <p className="text-orange-400 text-base md:text-lg font-semibold mb-4">
                    Giảm giá $20 cho đơn hàng đầu tiên của bạn
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                      <div className="flex-1 relative">
                        <input 
                          type="email" 
                          placeholder="Nhập Email của bạn"
                          className="w-full px-4 py-3 rounded-lg border-none outline-none text-gray-700 placeholder-gray-400 pr-10"
                        />
                        <svg 
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center justify-center gap-2 transition whitespace-nowrap">
                      Đăng ký <span>→</span>
                      </button>
                    </div>
                  </div>

                  {/* Right side - Illustration */}
                  <div className="hidden lg:block flex-shrink-0">
                    <div className="w-48 h-48 relative">
                      {/* Newsletter illustration placeholder */}
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl">💌</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default Home


