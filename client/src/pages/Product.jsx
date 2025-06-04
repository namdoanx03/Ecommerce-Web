import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { IoIosHome } from "react-icons/io";
import { FaAngleRight, FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CiStar } from "react-icons/ci";
import { FaThLarge, FaTh } from "react-icons/fa";
import CardProduct from '../components/CardProduct';


const Product = () => {
  const [productData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1);
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openRating, setOpenRating] = useState(true);
  const [gridCols, setGridCols] = useState(3); // 3 hoặc 4 cột
  
  const fetchProductData = async()=>{
    try {
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
              limit: 15
           }
        })

        const { data : responseData } = response 

        console.log("product page ",responseData)
        if(responseData.success){
          
          setProductData(responseData.data)
          setTotalPage(responseData.totalNoPage || 1)
        }

    } catch (error) {
      AxiosToastError(error)
    }
  }
  
  console.log("product page")
  useEffect(()=>{
    fetchProductData()
  },[page])

  const categories = [
    {
      id: 1,
      name: "Tạp Hóa & Hàng Thiết Yếu",
      img: "https://themes.pixelstrap.com/fastkart/assets/svg/1/grocery.svg",
      link: "https://devidai.io.vn/san-pham?category=T%E1%BA%A1p%20H%C3%B3a%20%26%20H%C3%A0ng%20Thi%E1%BA%BFt%20Y%E1%BA%BFu",
    },
    {
      id: 2,
      name: "Thịt & Hải Sản",
      img: "https://themes.pixelstrap.com/fastkart/assets/svg/1/meats.svg",
      link: "https://devidai.io.vn/san-pham?category=Th%E1%BB%8Bt%20%26%20H%E1%BA%A3i%20S%E1%BA%A3n",
    },
    ,
    {
      id: 3,
      name: "Thịt & Hải Sản",
      img: "https://themes.pixelstrap.com/fastkart/assets/svg/1/meats.svg",
      link: "https://devidai.io.vn/san-pham?category=Th%E1%BB%8Bt%20%26%20H%E1%BA%A3i%20S%E1%BA%A3n",
    }
    ,
    {
      id: 4,
      name: "Thịt & Hải Sản",
      img: "https://themes.pixelstrap.com/fastkart/assets/svg/1/meats.svg",
      link: "https://devidai.io.vn/san-pham?category=Th%E1%BB%8Bt%20%26%20H%E1%BA%A3i%20S%E1%BA%A3n",
    }
    ,
    {
      id: 5,
      name: "Thịt & Hải Sản",
      img: "https://themes.pixelstrap.com/fastkart/assets/svg/1/meats.svg",
      link: "https://devidai.io.vn/san-pham?category=Th%E1%BB%8Bt%20%26%20H%E1%BA%A3i%20S%E1%BA%A3n",
    }
    ,
    {
      id: 6,
      name: "Thịt & Hải Sản",
      img: "https://themes.pixelstrap.com/fastkart/assets/svg/1/meats.svg",
      link: "https://devidai.io.vn/san-pham?category=Th%E1%BB%8Bt%20%26%20H%E1%BA%A3i%20S%E1%BA%A3n",
    }
    ,
    {
      id: 7,
      name: "Thịt & Hải Sản",
      img: "https://themes.pixelstrap.com/fastkart/assets/svg/1/meats.svg",
      link: "https://devidai.io.vn/san-pham?category=Th%E1%BB%8Bt%20%26%20H%E1%BA%A3i%20S%E1%BA%A3n",
    },
    {
      id: 8,
      name: "Thịt & Hải Sản",
      img: "https://themes.pixelstrap.com/fastkart/assets/svg/1/meats.svg",
      link: "https://devidai.io.vn/san-pham?category=Th%E1%BB%8Bt%20%26%20H%E1%BA%A3i%20S%E1%BA%A3n",
    }
  ];
  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2200,
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
  return (
    <div className='product-page '>
      <div className='container min-h-screen bg-white px-28'>
        <div className='breadcrumb-section h-24 bg-gray-50 flex items-center justify-between py-7 px-2'>
          <h2 className='text-2xl font-bold '>Tất cả sản phẩm</h2>
          <div className='breadcrumb flex items-center gap-2 h-10'>
            <a  href='/'><IoIosHome className='text-gray-500 text-xl'/></a>
            <FaAngleRight className='text-gray-500 text-base' />
            <span className=' text-black-500 font-medium'>Đi chợ tại nhà</span>
          </div>
        </div>
        <div className="display-categories my-10 overflow-hidden">
          <Slider {...settings2}>
            {categories.map((p) => (
              <div
                key={p.id}
                className="flex flex-col text-left px-4 py-4 bg-gray-50 border-white w-full h-full border-x-2 border-gray-200"
                style={{ minWidth: 170, minHeight: 134, background: '#fff' }}
              >
                <div className="flex flex-col justify-center items-center mb-2" style={{}}>
                  <img src={p.img} alt={p.name} className="object-contain h-32" style={{ maxHeight: 43, maxWidth: 43 }} />
                  <div className="font-medium text-base mt-4 line-clamp-2 truncate max-w-[170px] px-4"> {p.name} </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className='product-list'>
          <div className='container mx-auto flex justify-between'>
            <div className='section-left w-full md:w-1/5 pb-16'>
              <div className='left-box-sidebar border-r-2 border-gray-200 p-2 sticky top-1'>
                {/* Tìm kiếm */}
                <div className="relative mb-12">
                  <input
                    type="text"
                    id="search"
                    className="block px-2.5 pb-2.5 pt-3 w-[80%] text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="search"
                    className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                  >
                    Tìm kiếm
                  </label>
                  <div className="absolute inset-y-0 right-16 flex items-center pointer-events-none">
                    <div className="w-px h-6 bg-gray-200 mx-2"></div>
                    <svg className="w-5 h-5 text-gray-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                </div>

                {/* Danh mục */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-lg">Danh mục</span>
                    <span className="bg-gray-100 rounded-full p-1 mr-4 cursor-pointer" onClick={() => setOpenCategory(v => !v)}>
                      {openCategory ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                  </div>
                  <div className="w-20 h-0.5 bg-red-500 mb-2"></div>
                  {openCategory && (
                    <ul className="max-h-[180px] overflow-y-auto pr-2 mt-8 sidebar-scroll">
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <label className="ml-3 text-base font-medium flex-1 text-primary-600 cursor-pointer trumcate tr">Bánh Kẹo</label>
                        <span className="text-gray-500 text-sm">(3)</span>
                      </li>
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <label className="ml-3 text-base font-medium flex-1 cursor-pointer trumcate tr">Bắp Cải & Súp Lơ</label>
                        <span className="text-gray-500 text-sm">(4)</span>
                      </li>
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <label className="ml-3 text-base font-medium flex-1 cursor-pointer trumcate tr">Cá Biển</label>
                        <span className="text-gray-500 text-sm">(0)</span>
                      </li>
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <label className="ml-3 text-base font-medium flex-1 cursor-pointer trumcate tr">Cá Đóng hộp</label>
                        <span className="text-gray-500 text-sm">(0)</span>
                      </li>
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <label className="ml-3 text-base font-medium flex-1 cursor-pointer trumcate tr">Cá Đông lạnh</label>
                        <span className="text-gray-500 text-sm">(0)</span>
                      </li>
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <label className="ml-3 text-base font-medium flex-1 cursor-pointer trumcate tr">Cá Đông lạnh</label>
                        <span className="text-gray-500 text-sm">(0)</span>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Giá */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-lg">Giá</span>
                    <span className="bg-gray-100 rounded-full p-1 mr-4 cursor-pointer" onClick={() => setOpenPrice(v => !v)}>
                      {openPrice ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                  </div>
                  <div className="w-8 h-0.5 bg-red-500 mb-2"></div>
                  {openPrice && (
                    <div className='my-8'>
                      <input
                        type="text"
                        id="search"
                        className="block px-2 pb-2.5 pt-3 w-[80%] text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 "
                        placeholder="Nhập giá cần tìm ?"
                      />
                    </div>
                  )}
                </div>

                {/* Đánh giá */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-lg">Đánh giá</span>
                    <span className="bg-gray-100 rounded-full p-1 mr-4 cursor-pointer" onClick={() => setOpenRating(v => !v)}>
                      {openRating ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                  </div>
                  <div className="w-20 h-0.5 bg-red-500 mb-8"></div>
                  {openRating && (
                    <ul className='pr-4'>
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <div className="ml-3 flex items-center flex-1">
                          {[...Array(5)].map((_, i) => (
                            <CiStar className='text-yellow-500 w-4 h-4' fill="currentColor"/>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">(5 sao)</span>
                      </li>
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <div className="ml-3 flex items-center flex-1">
                          {[...Array(5)].map((_, i) => (
                            <CiStar className='text-yellow-500 w-4 h-4' fill="currentColor"/>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">(5 sao)</span>
                      </li>
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <div className="ml-3 flex items-center flex-1">
                          {[...Array(5)].map((_, i) => (
                            <CiStar className='text-yellow-500 w-4 h-4' fill="currentColor"/>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">(5 sao)</span>
                      </li>
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <div className="ml-3 flex items-center flex-1">
                          {[...Array(5)].map((_, i) => (
                            <CiStar className='text-yellow-500 w-4 h-4' fill="currentColor"/>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">(5 sao)</span>
                      </li>
                      <li className="flex items-center mb-3">
                        <input className="checkbox_animated w-4 h-4" type="checkbox" />
                        <div className="ml-3 flex items-center flex-1">
                          {[...Array(5)].map((_, i) => (
                            <CiStar className='text-yellow-500 w-4 h-4' />
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">(5 sao)</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className='section-right w-full md:w-4/5 p-4'>
              <div className=' flex justify-end items-center mb-4'>
                <div className='flex gap-2'>
                  <button onClick={() => setGridCols(3)} className={`p-2 rounded ${gridCols === 3 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`} title="Hiển thị 3 cột">
                    <img src="https://themes.pixelstrap.com/fastkart/assets/svg/grid-3.svg" />
                  </button>
                  <button onClick={() => setGridCols(4)} className={`p-2 rounded ${gridCols === 4 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`} title="Hiển thị 4 cột">
                    <img src="https://themes.pixelstrap.com/fastkart/assets/svg/grid-4.svg" />
                  </button>
                </div>
              </div>
              <div className={`grid gap-4 ${gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                {productData.map((p, idx) => (
                  <CardProduct data={p} key={p._id || idx} />
                ))}
              </div>
              {/* Pagination */}
              <div className="flex justify-center items-center mt-12 mb-10 gap-2">
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded border ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPage }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(page < totalPage ? page + 1 : totalPage)}
                  disabled={page === totalPage}
                  className={`px-3 py-1 rounded border ${page === totalPage ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Product
