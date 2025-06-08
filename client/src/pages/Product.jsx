import React, { useEffect, useState, useRef } from 'react'
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
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-64 w-full" />
    ))}
  </div>
);

const Product = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category');
  const subcategory = params.get('subcategory');
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPage, setTotalPage] = useState(1);
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openRating, setOpenRating] = useState(true);
  const [gridCols, setGridCols] = useState(3); // 3 hoặc 4 cột
  const [loading, setLoading] = useState(false);
  const productListRef = useRef();
  
  const fetchProductData = async () => {
    setLoading(true);
    let response;
    console.log('Query params:', { category, subcategory }); // Debug
    try {
      if (subcategory) {
        console.log('Fetching products by subcategory:', subcategory); // Debug
        response = await Axios({ 
          ...SummaryApi.getProductBySubCategory, 
          data: { id: subcategory } 
        });
        console.log('Subcategory response:', response?.data); // Debug
      } else if (category) {
        console.log('Fetching products by category:', category); // Debug
        response = await Axios({ 
          ...SummaryApi.getProductByCategory, 
          data: { id: category } 
        });
        console.log('Category response:', response?.data); // Debug
      } else {
        // Lấy tất cả sản phẩm
        console.log('Fetching all products'); // Debug
        response = await Axios({ 
          ...SummaryApi.getProduct, 
          data: {} 
        });
        console.log('All products response:', response?.data); // Debug
      }
      
      if (response?.data?.success) {
        console.log('Setting products:', response.data.data); // Debug
        setAllProducts(response.data.data);
        setTotalPage(Math.ceil(response.data.data.length / limit));
        setPage(1); // reset về trang 1 khi đổi filter
      } else {
        console.log('No success in response:', response?.data); // Debug
        setAllProducts([]);
        setTotalPage(1);
        setPage(1);
      }
    } catch (error) {
      console.error('Fetch product error:', error);
      setAllProducts([]);
      setTotalPage(1);
      setPage(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line
  }, [category, subcategory]); // Bỏ page khỏi dependencies vì không cần fetch lại khi đổi trang

  // Phân trang ở frontend cho tất cả trường hợp
  const productsToShow = allProducts.slice((page - 1) * limit, page * limit);

  const handleNext = () => {
    if (page < totalPage) setPage(page + 1);
  };
  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [page, openCategory, openPrice, openRating, gridCols]);

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

  // Hàm tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Số trang tối đa hiển thị
    
    if (totalPage <= maxVisiblePages) {
      // Nếu tổng số trang <= maxVisiblePages, hiển thị tất cả
      for (let i = 1; i <= totalPage; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Nếu tổng số trang > maxVisiblePages
      if (page <= 3) {
        // Nếu đang ở trang đầu
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPage);
      } else if (page >= totalPage - 2) {
        // Nếu đang ở trang cuối
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPage - 3; i <= totalPage; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Nếu đang ở giữa
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPage);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className='product-page '>
      <div className='container min-h-screen bg-white px-28'>
        <div className='breadcrumb-section h-24 bg-[#f8f8f8] flex items-center justify-between py-7 px-2'>
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
        <div className='product-list' ref={productListRef}>
          {/* Hiển thị thông báo nếu không có sản phẩm */}
          {!loading && allProducts.length === 0 && (
            <div className="text-center text-gray-500 py-8 ">Không có sản phẩm nào phù hợp.</div>
          )}
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
                {loading ? (
                  <LoadingSkeleton />
                ) : (
                  productsToShow.map((p, idx) => (
                    <CardProduct data={p} key={p._id || idx} />
                  ))
                )}
              </div>
              {/* Thêm pagination mới */}
              {allProducts.length > 0 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={handlePrevious}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={page === totalPage}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(page * limit, allProducts.length)}</span> of{' '}
                        <span className="font-medium">{allProducts.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                        <button
                          onClick={handlePrevious}
                          disabled={page === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
                        </button>
                        {getPageNumbers().map((pageNum, index) => (
                          pageNum === '...' ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                page === pageNum
                                  ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        ))}
                        <button
                          onClick={handleNext}
                          disabled={page === totalPage}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Product
