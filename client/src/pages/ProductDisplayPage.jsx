import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'
import Divider from '../components/Divider'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import { IoIosHome } from "react-icons/io";
import InDeButton from '../components/InDeButton'
import pr5 from '../assets/pr5.jpg'
import pr4 from '../assets/pr4.jpg'
import pr3 from '../assets/pr3.jpg'
import pr2 from '../assets/pr2.jpg'
import pr1 from '../assets/pr1.jpg'

const suggestedProducts = [
  { img: pr5, name: 'Cà Chua Beef 365...', stock: 'Còn hàng', price: '90,000 đ', oldPrice: '99,000 đ' },
  { img: pr4, name: 'Ớt Chuông Đỏ 180g', stock: 'Còn hàng', price: '18,900 đ' },
  { img: pr3, name: 'Bí Ngòi Xanh 365...', stock: 'Còn hàng', price: '44,900 đ' },
  { img: pr2, name: 'Xà Lách Frise 300G', stock: 'Còn hàng', price: '25,900 đ', oldPrice: '25,900 đ' },
  { img: pr1, name: 'Dẻ sườn bò Canada...', stock: 'Còn hàng', price: '155,000 đ' },
  { img: pr5, name: 'Kẹo Dẻo Top Fruit ...', stock: 'Còn hàng', price: '36,900 đ', oldPrice: '36,900 đ' },
  { img: pr4, name: 'Kẹo Dẻo Top Fruit ...', stock: 'Còn hàng', price: '36,900 đ', oldPrice: '36,900 đ' },
  { img: pr3, name: 'Kẹo Dẻo Top Fruit ...', stock: 'Còn hàng', price: '36,900 đ', oldPrice: '36,900 đ' },
  { img: pr2, name: 'Kẹo Dẻo Top Fruit ...', stock: 'Còn hàng', price: '36,900 đ', oldPrice: '36,900 đ' },
  { img: pr1, name: 'Kẹo Dẻo Top Fruit ...', stock: 'Còn hàng', price: '36,900 đ', oldPrice: '36,900 đ' },
]

const ProductDisplayPage = () => {
  const params = useParams()
  const productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({ name: "", image: [] })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const thumbnailRef = useRef(null)

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId }
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

  useEffect(() => {
    fetchProductDetails()
    // eslint-disable-next-line
  }, [params])

  useEffect(() => {
    let timer
    if (data.createdAt) {
      const endDate = new Date(data.createdAt)
      endDate.setDate(endDate.getDate() + 30)
      const updateCountdown = () => {
        const now = new Date()
        const diff = endDate - now
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
          const minutes = Math.floor((diff / (1000 * 60)) % 60)
          const seconds = Math.floor((diff / 1000) % 60)
          setCountdown({ days, hours, minutes, seconds })
        } else {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        }
      }
      updateCountdown()
      timer = setInterval(updateCountdown, 1000)
    }
    return () => clearInterval(timer)
  }, [data.createdAt])

  const scrollThumbnails = (direction) => {
    if (!thumbnailRef.current) return
    const scrollAmount = 70
    thumbnailRef.current.scrollBy({
      top: direction === "up" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    })
  }

  const handleAngleUp = () => {
    if (image > 0) {
      setImage(prev => prev - 1)
      scrollThumbnails('up')
    }
  }

  const handleAngleDown = () => {
    if (image < data.image.length - 1) {
      setImage(prev => prev + 1)
      scrollThumbnails('down')
    }
  }

  return (
    <div className='bg-white min-h-screen'>
      {/* Breadcrumb */}
      <div className='bg-[#f8f8f8]'>
        <div className='container mx-auto flex items-center justify-between h-24 py-7 px-4 sm:px-6 lg:px-16'>
          <h2 className='text-2xl font-bold'>Chi tiết sản phẩm</h2>
          <div className='flex items-center gap-2 h-10'>
            <a href='/'><IoIosHome className='text-gray-500 text-xl' /></a>
            <FaAngleRight className='text-gray-500 text-base' />
            <span className='text-gray-700 font-medium'>Chi tiết sản phẩm</span>
          </div>
        </div>
      </div>

      {/* Nội dung */}
      <div className='container mx-auto py-8 px-4 sm:px-6 lg:px-16 flex gap-6 lg:gap-10'>
        {/* Khối trái: ảnh + thông tin */}
        <div className='flex-1 flex flex-col lg:flex-row gap-8'>
          {/* Ảnh sản phẩm */}
          <div className='flex items-start gap-4'>
            {/* Thumbnails */}
            <div className='flex flex-col items-center'>
              <button
                className='mb-2 rounded disabled:opacity-40'
                onClick={handleAngleUp}
                type='button'
                disabled={image === 0}
              >
                <FaAngleUp size={20} className='text-gray-300' />
              </button>
              <div
                ref={thumbnailRef}
                className='flex flex-col gap-2 max-h-[260px] overflow-y-auto w-20 rounded-lg thumbnail-scroll-hide'
              >
                {data.image?.map((img, index) => (
                  <button
                    type='button'
                    key={img + index}
                    className={`w-16 h-16 min-w-16 min-h-16 cursor-pointer rounded-lg border-2 ${image === index ? 'border-green-500' : 'border-gray-100'} bg-white flex items-center justify-center`}
                    onClick={() => setImage(index)}
                  >
                    <img
                      src={img}
                      alt='min-product'
                      className='w-14 h-14 object-contain rounded-lg'
                    />
                  </button>
                ))}
              </div>
              <button
                className='mt-2 rounded disabled:opacity-40'
                onClick={handleAngleDown}
                type='button'
                disabled={image === data.image.length - 1}
              >
                <FaAngleDown size={20} className='text-gray-300' />
              </button>
            </div>

            {/* Ảnh lớn */}
            <div className='bg-white rounded-lg flex items-center justify-center p-3 shadow-sm border w-[320px] lg:w-[380px] h-[380px]'>
              {data.image.length > 0 && (
                <img
                  src={data.image[image]}
                  className='max-h-full max-w-full object-contain rounded-lg'
                  alt={data.name}
                />
              )}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className='flex-1'>
            <div className='bg-white rounded-lg p-5 shadow-sm border flex flex-col gap-4'>
              <div className='flex items-center gap-3'>
                {data.discount ? (
                  <span className='bg-red-100 text-red-500 px-3 py-1 rounded-md text-lg font-semibold'>
                    Giảm {data.discount}%
                  </span>
                ) : (
                  <span className='bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-semibold'>
                    Không giảm giá
                  </span>
                )}
              </div>

              <h1 className='text-2xl font-bold leading-snug'>{data.name}</h1>

              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                  <span className='text-red-500 text-2xl font-bold'>
                    {DisplayPriceInVND(pricewithDiscount(data.price, data.discount))}
                  </span>
                  {data.discount && (
                    <span className='line-through text-gray-400 text-lg'>
                      {DisplayPriceInVND(data.price)}
                    </span>
                  )}
                </div>
                <div className='text-sm text-gray-600'>
                  <span className='text-yellow-400 text-lg mr-1'>★★★★★</span>
                  <span>(0 Đánh giá)</span>
                </div>
              </div>

              <div className='text-sm text-gray-700'>
                <span className='font-semibold'>Mô tả: </span>
                <span>{data.description}</span>
              </div>

              <span className={`text-sm font-semibold ${data.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>
                {data.stock === 0 ? 'Hết hàng' : 'Còn hàng'}
              </span>

              <Divider />

              {/* Countdown + nút mua */}
              <div className='space-y-4'>
                <div>
                  <p className='text-base font-semibold mb-2'>
                    Nhanh lên! khuyến mại sẽ kết thúc trong
                  </p>
                  <ul className='flex gap-3'>
                    <li>
                      <div className='flex flex-col items-center justify-center bg-gray-100 rounded-lg px-4 py-2 text-2xl font-medium text-black min-w-[60px]'>
                        {String(countdown.days).padStart(2, '0')}
                        <div className='text-xs text-gray-500 font-medium mt-1'>Ngày</div>
                      </div>
                    </li>
                    <li>
                      <div className='flex flex-col items-center justify-center bg-gray-100 rounded-lg px-4 py-2 text-2xl font-medium text-black min-w-[60px]'>
                        {String(countdown.hours).padStart(2, '0')}
                        <div className='text-xs text-gray-500 font-medium mt-1'>Giờ</div>
                      </div>
                    </li>
                    <li>
                      <div className='flex flex-col items-center justify-center bg-gray-100 rounded-lg px-4 py-2 text-2xl font-medium text-black min-w-[60px]'>
                        {String(countdown.minutes).padStart(2, '0')}
                        <div className='text-xs text-gray-500 font-medium mt-1'>Phút</div>
                      </div>
                    </li>
                    <li>
                      <div className='flex flex-col items-center justify-center bg-gray-100 rounded-lg px-4 py-2 text-2xl font-medium text-black min-w-[60px]'>
                        {String(countdown.seconds).padStart(2, '0')}
                        <div className='text-xs text-gray-500 font-medium mt-1'>Giây</div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className='flex flex-wrap items-center justify-between gap-4'>
                  <InDeButton data={data} />
                  <AddToCartButton
                    data={data}
                    showAddToCartButton={true}
                    className='h-12 px-8 text-lg font-bold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:bg-gray-300 disabled:text-gray-500'
                  >
                    Thêm vào giỏ
                  </AddToCartButton>
                </div>

                <div className='mt-4'>
                  <h6 className='mb-1 font-medium'>
                    Nhanh lên! Chỉ còn {data.stock} sản phẩm trong kho
                  </h6>
                  <div className='w-full h-3 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-emerald-500'
                      style={{
                        width: `${data.maxStock ? Math.round((data.stock / data.maxStock) * 100) : 30}%`,
                        transition: 'width 0.3s'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Thông tin sản phẩm */}
              <div className='space-y-3'>
                <h3 className='font-semibold text-lg'>Thông tin sản phẩm</h3>
                <div className='bg-[#f8f8f8] rounded-lg p-3 max-w-md space-y-2 text-sm'>
                  <div className='flex gap-2'>
                    <span className='font-medium w-28'>Đơn vị:</span>
                    <span>{data.unit} (cái / kg)</span>
                  </div>
                  <div className='flex gap-2'>
                    <span className='font-medium w-28'>Mã sản phẩm:</span>
                    <span>{data._id || '--'}</span>
                  </div>
                  <div className='flex gap-2'>
                    <span className='font-medium w-28'>Còn hàng:</span>
                    <span>{data.stock}</span>
                  </div>
                </div>

                {data?.more_details && Object.keys(data.more_details).map((key, idx) => (
                  <div key={key + idx} className='text-sm'>
                    <span className='font-semibold'>{key}: </span>
                    <span>{data.more_details[key]}</span>
                  </div>
                ))}
              </div>

              <Divider />

              {/* Thanh toán an toàn */}
              <div className='space-y-3'>
                <h3 className='font-semibold text-lg'>Đảm bảo thanh toán an toàn</h3>
                <ul className='flex items-center gap-2'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i}>
                      <img
                        src={`https://themes.pixelstrap.com/fastkart/assets/images/product/payment/${i}.svg`}
                        className='h-6'
                        alt={`payment-${i}`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar phải */}
        <aside className='w-[320px] hidden lg:block'>
          <div className='rounded-lg bg-white py-5 mb-6 shadow-sm border'>
            <div className='flex items-center mb-4 px-4'>
              <div className='w-1 h-6 bg-red-500 rounded mr-2'></div>
              <h3 className='font-bold text-lg'>Sản phẩm gợi ý</h3>
            </div>
            <ul className='flex flex-col'>
              {suggestedProducts.map((item, idx) => (
                <li
                  key={item.name + idx}
                  className={`flex gap-3 items-center px-4 py-2 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
                  style={{ minHeight: 70 }}
                >
                  <div className='block w-16 h-16 rounded overflow-hidden border flex-shrink-0 bg-white'>
                    <img src={item.img} alt={item.name} className='w-full h-full object-cover' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='font-semibold text-sm leading-tight truncate'>{item.name}</div>
                    <div className='text-xs text-gray-500 mb-1'>{item.stock}</div>
                    <div className='flex items-center gap-2'>
                      <span className='text-red-500 font-bold text-sm'>{item.price}</span>
                      {item.oldPrice && (
                        <span className='line-through text-gray-400 text-xs'>{item.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ProductDisplayPage
