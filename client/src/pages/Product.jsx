import React, { useEffect, useState, useRef } from 'react'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { IoIosHome } from "react-icons/io";
import { FaAngleRight, FaAngleDown, FaAngleUp, FaAngleLeft } from "react-icons/fa6";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CiStar } from "react-icons/ci";
import { FaThLarge, FaTh } from "react-icons/fa";
import CardProduct from '../components/CardProduct';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { GoArrowRight } from "react-icons/go";
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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Số sản phẩm mỗi trang
  const [totalPage, setTotalPage] = useState(1);
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openRating, setOpenRating] = useState(true);
  const [gridCols, setGridCols] = useState(3); // 3 hoặc 4 cột
  const [loading, setLoading] = useState(false);
  const productListRef = useRef();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryCount, setCategoryCount] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchValue, setSearchValue] = useState("");
  const [searchFilteredProducts, setSearchFilteredProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  
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
        setTotalPage(Math.ceil(response.data.data.length / productsPerPage));
        setCurrentPage(1); // reset về trang 1 khi đổi filter
      } else {
        console.log('No success in response:', response?.data); // Debug
        setAllProducts([]);
        setTotalPage(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Fetch product error:', error);
      setAllProducts([]);
      setTotalPage(1);
      setCurrentPage(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line
  }, [category, subcategory]); // Bỏ page khỏi dependencies vì không cần fetch lại khi đổi trang

  // Reset về trang 1 khi filter
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, minPrice, maxPrice]);

  // Phân trang ở frontend cho tất cả trường hợp
  const productsToShow = allProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handleNext = () => {
    if (currentPage < totalPage) setCurrentPage(currentPage + 1);
  };
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage, openCategory, openPrice, openRating, gridCols]);

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

useEffect(() => {
  // Đếm số lượng sản phẩm theo danh mục
  const count = {};
  console.log("All products:", allProducts);
  allProducts.forEach(product => {
    if (Array.isArray(product.category)) {
      product.category.forEach(cat => {
        const catId = typeof cat === 'object' ? cat._id : cat;
        if (!count[catId]) count[catId] = 0;
        count[catId]++;
      });
    } else if (product.category) {
      const catId = typeof product.category === 'object' ? product.category._id : product.category;
      if (!count[catId]) count[catId] = 0;
      count[catId]++;
    }
  });
  setCategoryCount(count);
  console.log("Category count:", count);
}, [allProducts]);

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

  function getPageNumbers(totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const handleCategoryChange = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId)
        ? prev.filter(id => id !== catId)
        : [...prev, catId]
    );
  };

  // Hàm xử lý tiếng Việt
  const removeVietnameseTones = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Lọc sản phẩm theo danh mục
  useEffect(() => {
    const filtered = selectedCategories.length === 0
      ? allProducts
      : allProducts.filter(product =>
          Array.isArray(product.category)
            ? product.category.some(cat => (typeof cat === 'object' ? cat._id : cat) && selectedCategories.includes(typeof cat === 'object' ? cat._id : cat))
            : selectedCategories.includes(typeof product.category === 'object' ? product.category._id : product.category)
        );
    setFilteredProducts(filtered);
  }, [selectedCategories, allProducts]);

  // Lọc sản phẩm theo giá
  useEffect(() => {
    const priceFiltered = filteredProducts.filter(product => {
      const price = product.price || 0;
      const min = minPrice ? parseInt(minPrice, 10) : 0;
      const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;
      return price >= min && price <= max;
    });
    setPaginatedProducts(priceFiltered);
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  }, [filteredProducts, minPrice, maxPrice]);

  // Phân trang sản phẩm
  useEffect(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginated = paginatedProducts.slice(startIndex, endIndex);
    setSearchFilteredProducts(paginated);
  }, [currentPage, paginatedProducts]);

  // Tìm kiếm sản phẩm
  useEffect(() => {
    const keyword = removeVietnameseTones(searchValue);
    if (!keyword) {
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      setSearchFilteredProducts(paginatedProducts.slice(startIndex, endIndex));
    } else {
      const filtered = paginatedProducts.filter(p => 
        removeVietnameseTones(p.name).includes(keyword)
      );
      setSearchFilteredProducts(filtered);
    }
  }, [searchValue, paginatedProducts, currentPage]);

  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  // Component Pagination
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = getPageNumbers(totalPages);
    return (
      <div className="flex items-center justify-center gap-1 mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
        >
          <FaAngleLeft />
        </button>
        {pageNumbers.map(num => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-1 rounded ${currentPage === num ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
        >
          <FaAngleRight />
        </button>
      </div>
    );
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
                  <img src={p.image} alt={p.name} className="object-contain h-32" style={{ maxHeight: 43, maxWidth: 43 }} />
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
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder=" "
                    className="block px-2.5 pb-2.5 pt-3 w-[80%] text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer mb-4"
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
                      {categories.map((cat, idx) => (
                        <li className="flex items-center mb-3" key={cat._id || cat.id || idx}>
                          <input
                            className="checkbox_animated w-4 h-4"
                            type="checkbox"
                            checked={selectedCategories.includes(cat._id)}
                            onChange={() => handleCategoryChange(cat._id)}
                          />
                          <label className="ml-3 text-base font-medium flex-1 cursor-pointer trumcate tr">{cat.name}</label>
                          <span className="text-gray-500 text-sm">
                            ({categoryCount[cat._id] || 0})
                          </span>
                        </li>
                      ))}
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
                      <div className="flex gap-2 mb-4 items-center">
                        <input
                          type="number"
                          placeholder="Giá từ"
                          value={minPrice}
                          onChange={handleMinPriceChange}
                          className="border rounded px-2 py-1 w-24"
                        />
                        <GoArrowRight className='text-gray-500 text-lg' />
                        <input
                          type="number"
                          placeholder="Đến"
                          value={maxPrice}
                          onChange={handleMaxPriceChange}
                          className="border rounded px-2 py-1 w-24"
                        />
                      </div>
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
              <div className={`grid gap-4 ${gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`} >
                {loading ? (
                  <LoadingSkeleton />
                ) : (
                  searchFilteredProducts.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 font-semibold text-lg">Không có sản phẩm phù hợp</div>
                  ) : (
                    searchFilteredProducts.map((p, idx) => (
                      <CardProduct data={p} key={p._id || idx} />
                    ))
                  )
                )}
              </div>
              {/* Render tổng số sản phẩm đang xem */}
              <div className="text-sm text-gray-700 mb-2 mt-6">
                Showing {paginatedProducts.length === 0 ? 0 : ((currentPage - 1) * productsPerPage + 1)} to {Math.min(currentPage * productsPerPage, paginatedProducts.length)} of {paginatedProducts.length} results
              </div>
              {/* Render phân trang */}
              {paginatedProducts.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(paginatedProducts.length / productsPerPage)}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    if (productListRef.current) {
                      productListRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Product