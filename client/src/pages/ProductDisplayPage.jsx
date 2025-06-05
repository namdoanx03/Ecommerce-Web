import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft, FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import { IoIosHome } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import InDeButton from '../components/InDeButton'
import pr5 from '../assets/pr5.jpg'
import pr4 from '../assets/pr4.jpg'
import pr3 from '../assets/pr3.jpg'
import pr2 from '../assets/pr2.jpg'
import pr1 from '../assets/pr1.jpg'


const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }
  console.log("data", data.createdAt)

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  useEffect(() => {
    let timer;
    if (data.createdAt) {
      const endDate = new Date(data.createdAt);
      endDate.setDate(endDate.getDate() + 30);
      const updateCountdown = () => {
        const now = new Date();
        const diff = endDate - now;
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          setCountdown({ days, hours, minutes, seconds });
        } else {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };
      updateCountdown();
      timer = setInterval(updateCountdown, 1000);
    }
    return () => clearInterval(timer);
  }, [data.createdAt]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }
  console.log("product data", data)
  return (
    <section className='container bg-white '>
      <div className='breadcrumb-section h-24 bg-[#f8f8f8] flex items-center justify-between py-7 px-32'>
        <h2 className='text-2xl font-bold '>Chi tiết sản phẩm</h2>
        <div className='breadcrumb flex items-center gap-2 h-10'>
          <a href='/'><IoIosHome className='text-gray-500 text-xl' /></a>
          <FaAngleRight className='text-gray-500 text-base' />
          <span className=' text-black-500 font-medium'>Chi tiết sản phẩm</span>
        </div>
      </div>
      <div className='product-section flex gap-3 py-10 bg-transparent px-32'>
        {/* Ảnh sản phẩm */}
        <div className='image-section flex flex-row items-start'>
          {/* Thumbnails bên trái với nút lên/xuống */}
          {(() => {
            const thumbnailRef = useRef();
            const scrollThumbnails = useCallback((direction) => {
              if (thumbnailRef.current) {
                const scrollAmount = 70; // chiều cao 1 ảnh + gap
                thumbnailRef.current.scrollBy({
                  top: direction === "up" ? -scrollAmount : scrollAmount,
                  behavior: "smooth"
                });
              }
            }, []);
            const handleAngleUp = () => {
              if (image > 0) {
                setImage(image - 1);
                scrollThumbnails('up');
              }
            };
            const handleAngleDown = () => {
              if (image < data.image.length - 1) {
                setImage(image + 1);
                scrollThumbnails('down');
              }
            };
            return (
              <div className='flex flex-col items-center'>
                <button
                  className="mb-2 rounded "
                  onClick={handleAngleUp}
                  type="button"
                  disabled={image === 0}
                >
                  <FaAngleUp size={20} className='text-gray-300 mr-4' />
                </button>
                <div
                  ref={thumbnailRef}
                  className='flex flex-col gap-2 max-h-[220px] overflow-y-auto w-20 border-1 rounded-lg thumbnail-scroll-hide'
                >
                  {data.image.map((img, index) => (
                    <div
                      key={img + index}
                      className={`w-16 h-16 min-w-16 min-h-16  cursor-pointer rounded-lg border-2 ${image === index ? 'border-green-500' : 'border-gray-100'} bg-white flex items-center justify-center`}
                      onClick={() => setImage(index)}
                    >
                      <img
                        src={img}
                        alt='min-product'
                        className='w-14 h-14 object-contain rounded-lg'
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="mt-2 rounded "
                  onClick={handleAngleDown}
                  type="button"
                  disabled={image === data.image.length - 1}
                >
                  <FaAngleDown size={20} className='text-gray-300 mr-4' />
                </button>
              </div>
            );
          })()}
          {/* Ảnh lớn bên phải */}
          <div className='bg-white rounded-lg flex flex-col items-center p-2'>
            <img
              src={data.image[image]}
              className='w-full max-w-[370px] h-[370px] object-contain rounded-lg border mb-4 bg-white'
              alt={data.name}
            />
          </div>
        </div>
        {/* Thông tin sản phẩm */}
        <div className='flex flex-col gap-3 w-[40%]'>
          <div className='bg-white rounded-lg  flex flex-col gap-4'>
            <div className='flex items-center gap-3 mb-2'>
              <span className='bg-red-100 text-red-500 px-3 py-1 rounded-md text-lg font-semibold'>
                {data.discount ? `Giảm ${data.discount}%` : 'Không giảm giá'}
              </span>
            </div>
            <h2 className='text-2xl font-bold mb-1 pl-1'>{data.name}</h2>
            <div className='flex items-center justify-between px-2'>
              <div className='flex items-center gap-3 mb-2'>
                <span className='text-red-500 text-2xl font-bold'>{DisplayPriceInVND(pricewithDiscount(data.price, data.discount))}</span>
                {data.discount && (
                  <span className='line-through text-gray-400 text-lg'>{DisplayPriceInVND(data.price)}</span>
                )}
              </div>
              <div className='flex items-center gap-2 pr-2 '>
                {/* Đánh giá sao */}
                <span className='text-yellow-400 text-xl'>★★★★★</span>
                <span className='text-gray-500 text-sm'>(0 Đánh giá)</span>
              </div>
            </div>
            <div className='description-section px-1 pr-44'>
              <span className='font-semibold'>Mô tả: </span>
              <span>{data.description}</span>
            </div>
            <span className={`ml-4 text-sm font-semibold ${data.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>{data.stock === 0 ? 'Hết hàng' : 'Còn hàng'}</span>
            <Divider />
            <div className='time-countdown'>
              <div className='flex flex-col items-start gap-2'>
                <div className='text-base font-semibold mb-1'>Nhanh lên! khuyến mại sẽ kết thúc trong</div>
                <ul className="flex gap-3 rounded-xl px-1  ">
                  <li>
                    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-4 py-2 shadow text-2xl font-medium text-black min-w-[60px]">
                      {String(countdown.days).padStart(2, '0')}
                      <div className="text-xs text-gray-500 font-medium mt-1">Ngày</div>
                    </div>
                  </li>
                  <li>
                    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-4 py-2 shadow text-2xl font-medium text-black min-w-[60px]">
                      {String(countdown.hours).padStart(2, '0')}
                      <div className="text-xs text-gray-500 font-medium mt-1">Giờ</div>
                    </div>
                  </li>
                  <li>
                    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-4 py-2 shadow text-2xl font-medium text-black min-w-[60px]">
                      {String(countdown.minutes).padStart(2, '0')}
                      <div className="text-xs text-gray-500 font-medium mt-1">Phút</div>
                    </div>
                  </li>
                  <li>
                    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-4 py-2 shadow text-2xl font-medium text-black min-w-[60px]">
                      {String(countdown.seconds).padStart(2, '0')}
                      <div className="text-xs text-gray-500 font-medium mt-1">Giây</div>
                    </div>
                  </li>
                </ul>

              </div>
              <div className='note-box mt-6 px-1'>
                <div className='my-2 flex items-center justify-between gap-2'>
                  <InDeButton data={data} />
                  <AddToCartButton data={data} showAddToCartButton={true} className='h-12 text-lg font-bold rounded-lg bg-black text-white hover:bg-gray-900 transition disabled:bg-gray-300 disabled:text-gray-500'>Mua ngay</AddToCartButton>
                </div>
              </div>
              <div className='progress-sec my-6'>
                <h6 className='mb-1 font-medium'>Nhanh lên! Chỉ còn {data.stock} sản phẩm trong kho</h6>
                <div className='w-full h-3 bg-gray-200 rounded-full overflow-hidden my-4'>
                  <div
                    className='h-full progress-striped'
                    style={{ width: `${data.maxStock ? Math.round((data.stock / data.maxStock) * 100) : 30}%`, transition: 'width 0.3s' }}
                  ></div>
                </div>
              </div>
              <Divider />
              {/* Box thông tin sản phẩm */}
              <div className=' flex flex-col gap-2 py-2'>
                <h3 className='font-semibold text-lg mb-2'>Thông tin sản phẩm</h3>
                <div className='bg-[#f8f8f8] rounded-lg p-2 w-[70%] flex flex-col gap-2'>
                <div className='flex items-center gap-2 mt-1 font-semibold'>
                  <span className='font-medium'>Đơn vị:</span>
                  <span>{data.unit} (cái / kg)</span>
                </div>
                <div className='flex items-center gap-2 font-semibold'>
                  <span className='font-medium'>Mã sản phẩm:</span>
                  <span>{data._id || '--'}</span>
                </div>
                <div className='flex items-center gap-2 font-semibold'>
                  <span className='font-medium'>Còn hàng:</span>
                  <span>{data.stock}</span>
                </div>
                </div>
                {/* <div>
                  <span className='font-semibold'>Mô tả: </span>
                  <span>{data.description}</span>
                </div> */}
                {data?.more_details && Object.keys(data?.more_details).map((element, index) => (
                  <div key={element + index}>
                    <span className='font-semibold'>{element}: </span>
                    <span>{data?.more_details[element]}</span>
                  </div>
                ))}
              </div>
              <Divider />
              <div className=' flex flex-col gap-2 py-2'>
                <h3 className='font-semibold text-lg mb-2'>Đảm bảo thanh toán an toàn</h3>
                <div className='flex items-center gap-2'>
                  <ul className='flex items-center gap-2'>
                    <li>
                      <a href="javascript:void(0)" bis_skin_checked="1">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/images/product/payment/1.svg" class="blur-up lazyloaded" alt="" />
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" bis_skin_checked="1">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/images/product/payment/2.svg" class="blur-up lazyloaded" alt="" />
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" bis_skin_checked="1">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/images/product/payment/3.svg" class="blur-up lazyloaded" alt="" />
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" bis_skin_checked="1">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/images/product/payment/4.svg" class="blur-up lazyloaded" alt="" />
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" bis_skin_checked="1">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/images/product/payment/5.svg" class="blur-up lazyloaded" alt="" />
                      </a>
                    </li>
                  </ul>
                </div>
                {/* <div>
                  <span className='font-semibold'>Mô tả: </span>
                  <span>{data.description}</span>
                </div> */}
                {data?.more_details && Object.keys(data?.more_details).map((element, index) => (
                  <div key={element + index}>
                    <span className='font-semibold'>{element}: </span>
                    <span>{data?.more_details[element]}</span>
                  </div>
                ))}
              </div>

            </div>


          </div>

        </div>
        {/* Sidebar phải */}
        <aside className='right-sidebar-section'>
          <div className=' rounded-lg bg-[#f8f8f8] py-5 mb-6'>
            <div className='flex items-center mb-4 px-4'>
              <div className='w-1 h-6 bg-red-500 rounded mr-2'></div>
              <h3 className='font-bold text-lg'>Sản phẩm gợi ý</h3>
            </div>
            <ul className='product-list product-right-sidebar border-0 p-0 flex flex-col'>
              {/* Ví dụ, bạn có thể map từ API nếu có */}
              {[ // Dữ liệu mẫu, thay bằng map nếu có API
                {
                  img: pr5,
                  name: 'Cà Chua Beef 365...',
                  stock: 'Còn hàng',
                  price: '90,000 đ',
                  oldPrice: '99,000 đ',
                },
                {
                  img: pr4,
                  name: 'Ớt Chuông Đỏ 180g',
                  stock: 'Còn hàng',
                  price: '18,900 đ',
                },
                {
                  img: pr3,
                  name: 'Bí Ngòi Xanh 365...',
                  stock: 'Còn hàng',
                  price: '44,900 đ',
                },
                {
                  img: pr2,
                  name: 'Xà Lách Frise 300G',
                  stock: 'Còn hàng',
                  price: '25,900 đ',
                  oldPrice: '25,900 đ',
                },
                {
                  img: pr1,
                  name: 'Dẻ sườn bò Canada...',
                  stock: 'Còn hàng',
                  price: '155,000 đ',
                },
                {
                  img: pr5,
                  name: 'Kẹo Dẻo Top Fruit ...',
                  stock: 'Còn hàng',
                  price: '36,900 đ',
                  oldPrice: '36,900 đ',
                },
                {
                  img: pr4,
                  name: 'Kẹo Dẻo Top Fruit ...',
                  stock: 'Còn hàng',
                  price: '36,900 đ',
                  oldPrice: '36,900 đ',
                },
                {
                  img: pr3,
                  name: 'Kẹo Dẻo Top Fruit ...',
                  stock: 'Còn hàng',
                  price: '36,900 đ',
                  oldPrice: '36,900 đ',
                },
                {
                  img: pr2,
                  name: 'Kẹo Dẻo Top Fruit ...',
                  stock: 'Còn hàng',
                  price: '36,900 đ',
                  oldPrice: '36,900 đ',
                },
                {
                  img: pr1,
                  name: 'Kẹo Dẻo Top Fruit ...',
                  stock: 'Còn hàng',
                  price: '36,900 đ',
                  oldPrice: '36,900 đ',
                }
              ].map((item, idx) => (
                <li key={item.name + idx} className={`flex gap-3 items-center px-4 py-2 ${idx !== 0 ? 'border-t border-gray-100' : ''}`} style={{ minHeight: 70 }}>
                  <a href='#' className='block w-16 h-16 rounded overflow-hidden border flex-shrink-0 bg-white'>
                    <img src={item.img} alt={item.name} className='w-full h-full object-cover'/>
                  </a>
                  <div className='flex-1 min-w-0'>
                    <a href='#' className='font-semibold text-base leading-tight truncate block'>{item.name}</a>
                    <div className='text-xs text-gray-500'>{item.stock}</div>
                    <div className='flex items-center gap-2'>
                      <span className='text-red-500 font-bold text-base'>{item.price}</span>
                      {item.oldPrice && (
                        <span className='line-through text-gray-400 text-sm'>{item.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default ProductDisplayPage
