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
        if (elapsed < 3000) {
          setTimeout(() => setLoading(false), 3000 - elapsed);
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
            <div className="container mx-auto px-28 font-sans antialiased">
              <div className="flex flex-row gap-8 items-stretch" style={{ paddingLeft: '8px' }}>
                {/* Banner lớn bên trái */}
                <div className="bg-white rounded-2xl overflow-hidden flex relative" style={{
                  backgroundImage: `url(${banner1})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  width: '840px',
                  height: '554px',
                }}>
                  <div className="relative z-10 flex flex-col justify-center h-full p-12 max-w-[60%]">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-gray-600 font-medium text-base">Ưu đãi độc quyền</span>
                      <span className="bg-red-100 text-[#C83C2B] font-bold px-2 py-2 text-sm rounded-full">Giảm giá 30%</span>
                    </div>
                    <h1 className="text-3xl font-medium tracking-tight mb-2 text-black leading-tight">
                      Ở NHÀ VÀ NHẬN HÀNG   <br />
                      <span className="text-[#C83C2B] text-4xl font-bold block mt-1">NHU CẦU HÀNG NGÀY</span>
                    </h1>
                    <p className="text-gray-600 mb-7 text-base font-medium">
                      Rau chứa nhiều vitamin và khoáng chất tốt cho sức khỏe.
                    </p>
                    <button onClick={() => window.location.href = '/product'} className="bg-[#C83C2B] hover:bg-[#b8321a] text-white font-bold px-8 py-3 rounded-xl text-lg flex items-center gap-2 w-fit shadow transition-all duration-200">
                      Mua ngay <FaRegHandPointRight size={18} />
                    </button>
                  </div>
                </div>
                {/* Banner nhỏ bên phải */}
                <div className="flex flex-col gap-4 w-full lg:w-[408px]">
                  {/* Banner 1 */}
                  <div className="bg-white rounded-2xl overflow-hidden flex items-center transition" style={{
                    backgroundImage: `url(${banner2})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    width: '408px',
                    height: '270px'
                  }}>
                    <div className="flex flex-col justify-center flex-1 p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-100 text-[#C83C2B] px-2 py-0.5 text-xs rounded-full font-bold">Giảm giá</span>
                        <span className="text-[#C83C2B] text-2xl font-extrabold">45%</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#C83C2B] mb-1">Bộ sưu tập hạt</h3>
                      <p className="text-gray-600 text-base font-medium mb-2">Chúng tôi cung cấp rau và trái cây hữu cơ</p>
                      <a href="/product" className="text-[#C83C2B] font-bold flex items-center gap-1 hover:underline transition-all duration-200">
                        Mua ngay <FaRegHandPointRight size={18} />
                      </a>
                    </div>
                  </div>
                  {/* Banner 2 */}
                  <div className="bg-white rounded-2xl overflow-hidden flex items-center  transition" style={{
                    backgroundImage: `url(${banner3})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    width: '408px',
                    height: '270px'
                  }}>
                    <div className="flex flex-col justify-center flex-1 p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-100 text-[#C83C2B] px-2 py-0.5 text-xs rounded-full font-bold">Thực phẩm</span>
                        <span className="text-[#C83C2B] text-2xl font-extrabold">lành mạnh</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#C83C2B] mb-1">Chợ hữu cơ</h3>
                      <p className="text-gray-600 text-base font-medium mb-2">Bắt đầu mua sắm hàng <br /> ngày của bạn với một số...</p>
                      <a href="/product" className="text-[#C83C2B] font-bold flex items-center gap-1 hover:underline transition-all duration-200">
                        Mua ngay <FaRegHandPointRight size={18} />
                      </a>
                    </div>
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
            <section className='banner-section pt-8'>
              {/* Banner khuyến mãi nhỏ dạng card chuẩn mẫu */}
              <div className="flex flex-row gap-6 justify-center items-start ">
                {/* Card 1 */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow"
                  style={{
                    width: 302,
                    height: 180,
                    backgroundImage: `url(${banner4})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay chỉ cho text phía trên */}
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
                    <h5 className="font-semibold mb-1">Khuyến mãi hấp dẫn cho các mặt hàng mới</h5>
                    <div className="text-gray-500 text-sm">Trứng và sữa thiết yếu hàng ngày</div>
                  </div>
                  {/* Nút mua ngay */}
                  <a
                    href="/product"
                    className="absolute left-4 bottom-1 px-3 py-2  text-white font-bold "
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
                {/* Card 2 */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow"
                  style={{
                    width: 302,
                    height: 180,
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
                    <h5 className="font-semibold mb-1">Mua nhiều hơn tiết kiệm nhiều hơn</h5>
                    <div className="text-gray-500 text-sm">Rau tươi</div>
                  </div>
                  <a
                    href="/product"
                    className="absolute left-4 bottom-1 px-3 py-2 text-white font-bold"
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
                {/* Card 3 */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow"
                  style={{
                    width: 302,
                    height: 180,
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
                    <h5 className="font-semibold mb-1">Thịt hữu cơ chế biến</h5>
                    <div className="text-gray-500 text-sm">Giao đến tận nhà bạn</div>
                  </div>
                  <a
                    href="/product"
                    className="absolute left-4 bottom-1 px-3 py-2 text-white font-bold "
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
                {/* Card 4 */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow"
                  style={{
                    width: 302,
                    height: 180,
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
                    <h5 className="font-semibold mb-1">Mua nhiều hơn tiết kiệm nhiều hơn</h5>
                    <div className="text-gray-500 text-sm">Các loại hạt và đồ ăn nhẹ</div>
                  </div>
                  <a
                    href="/product"
                    className="absolute left-4 bottom-1 px-3 py-2  text-white font-bold"
                  >
                    Mua ngay &rarr;
                  </a>
                </div>
              </div>
            </section>

            {/* Banner ngang 2 card giống mẫu */}
            

          </section>

          <section className="product-section bg-white pt-12 px-24">
            <div className="container-fluid lg:px-8 px-4 ">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">
                <div className="hidden xl:block xl:col-span-4 2xl:col-span-3">
                  <div className="category-menu bg-[#F8F8F8] rounded-xl shadow flex flex-col p-6 ">
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-red-500 w-fit pb-1">Danh Mục</h3>
                    <ul className="flex flex-col gap-1">
                      {categoryData.map((cat) => (
                        <li
                          key={cat._id}
                          className="relative group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                          onClick={() => navigate(`/product?category=${cat._id}`)}
                        >
                          <img src={cat.icon || cat.image} className="w-7 h-7 object-contain" />
                          <span className="text-base font-medium truncate">{cat.name}</span>
                        </li>
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
                        <button className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition mb-4">
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
                        <button className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition mb-4">
                          Mua ngay <span className="ml-1">→</span>
                        </button>
                        
                      </div>
                    </div>
                  </div>
                  <div className="category-menu bg-[#F8F8F8] rounded-xl shadow flex flex-col p-6 mt-10 mb-40">
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-red-500 w-fit pb-1">Sản phẩm thịnh hành</h3>
                    
                    <div className="my-4">Không có sản phẩm nào</div>
                    
                  </div>

                </div>
                <div className="xl:col-span-8 2xl:col-span-9">
                  <div className="title flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="text-left">
                      <h2 className="font-bold text-2xl text-black mb-1 pb-1">Các Sản Phẩm Đang Giảm Giá</h2>
                      <div className="flex  gap-4 mt-2 mb-2">
                        <div className="h-0.5 w-20 bg-red-300 rounded"></div>
                        <div className="h-0.5 w-20 bg-red-300 rounded"></div>
                      </div>
                      <p className="text-base text-gray-500 my-4">Đừng bỏ lỡ cơ hội giảm giá đặc biệt chỉ có trong tuần này.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg font-semibold shadow text-sm">
                      <FaRegClock className="mr-2 text-lg" />
                      <span>hết hạn vào :</span>
                      <span className="font-mono font-bold ml-2">6 Ngày</span>
                      <span className="font-mono font-bold">:</span>
                      <span className="font-mono font-bold">06</span>
                      <span className="font-mono font-bold">:</span>
                      <span className="font-mono font-bold">41</span>
                      <span className="font-mono font-bold">:</span>
                      <span className="font-mono font-bold">58</span>
                    </div>
                  </div>
                  <div className="display-product" style={{ borderRadius: '10px', border: '1px solid #ccc', overflow: 'hidden' }}>
                    <Slider {...settings}>
                      {loading ? (
                        <BubbleSpinner />
                      ) : (
                        products.map((p, idx) => (
                          <div
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
                                <div className="font-semibold text-base mb-1 leading-tight line-clamp-2 trumcate" style={{ minHeight: 48, lineHeight: '1.5' }}>{p.name}</div>
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
                          </div>
                        ))
                      )}
                    </Slider>
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
                        <button className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition">
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
                        <button className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition">
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
                        products.map((p, idx) => (
                          <div
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
                                <div className="font-semibold text-sm mb-1 leading-tight line-clamp-2" style={{ minHeight: 48, lineHeight: '1.5' }}>{p.name}</div>
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
                              <button
                                className="w-full rounded-full py-3 text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 transition mt-2"
                                style={{ fontSize: 18, marginTop: 16 }}
                              >
                                Thêm vào giỏ
                              </button>
                            </div>
                          </div>
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
                        <button className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition w-max">
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
                        <button className="bg-[#e76a5b] hover:bg-[#d94c3a] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition w-max">
                          Mua ngay <span className="ml-1">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="title flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="text-left">
                      <h2 className="font-bold text-2xl text-black mb-1 pb-1">Sản phẩm bán chạy</h2>
                      <div className="flex  gap-4 mt-2 mb-2">
                        <div className="h-0.5 w-20 bg-red-300 rounded"></div>
                        <div className="h-0.5 w-20 bg-red-300 rounded"></div>
                      </div>
                      <p className="text-base text-gray-500 my-4">Bạn không thể bỏ lỡ những sản phẩm đang được săn đón nhất tại siêu thị – xem ngay trước khi hết hàng!</p>
                    </div>
                    
                  </div>
                  {/* <div className="best-selling-slider"
                    style={{  background: '#fff',  }}>
                    <Slider
                      infinite={true}
                      speed={500}
                      slidesToShow={3}
                      slidesToScroll={1}
                    >
                      {productChunks.map((group, idx) => (
                        <div
                          key={idx}
                          className="bg-white border-2 border-gray-200 flex flex-col justify-between rounded-lg "
                        >
                          {group.map((p, i) => (
                            <React.Fragment key={p ? p.id : `empty-${i}`}> 
                              {p ? (
                                <div className="flex flex-row items-center justify-center gap-3 p-4" style={{ minHeight: 80, minWidth: 250 }}>
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="object-contain w-26 h-20"
                                    style={{ background: '#fafafa' }}
                                    onError={e => (e.currentTarget.src = '/images/placeholder.png')}
                                  />
                                  <div
                                    className={
                                      "flex-1 min-w-0 ml-2" +
                                      (i !== group.length - 1 ? " border-b-2 border-dashed border-gray-300" : "")
                                    }
                                  >
                                    <div className="font-semibold text-sm truncate max-w-[140px]">{p.name}</div>
                                    <div className="text-xs text-gray-500 my-1">{p.stockStatus}</div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-red-600 font-bold text-base truncate">{p.price.toLocaleString('vi-VN')} đ</span>
                                      {p.oldPrice && p.oldPrice !== p.price && (
                                        <span className="text-xs line-through text-gray-400 truncate">{p.oldPrice.toLocaleString('vi-VN')} đ</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ minHeight: 80, minWidth: 250 }} className="p-4"></div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      ))}
                    </Slider>
                  </div> */}
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


