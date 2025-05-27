import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { FaRegHandPointRight } from "react-icons/fa";
import banner1 from '../assets/1.jpg'
import banner2 from '../assets/2.jpg'
import banner3 from '../assets/3.jpg'
import banner4 from '../assets/4.jpg'
import banner5 from '../assets/5.jpg'
import banner6 from '../assets/6.jpg'
import banner7 from '../assets/7.jpg'




const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id,cat)=>{
      console.log(id,cat)
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

      navigate(url)
      console.log(url)
  }


  return (
   <section className='bg-white home-section'>
    <div className="container mx-auto px-28 font-sans antialiased">
      <div className="flex flex-row gap-8 items-stretch" style={{paddingLeft: '8px'}}>
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
              <span className="bg-red-100 text-[#C83C2B] font-bold px-2 py-0.5 text-xs rounded-full">Giảm giá 30%</span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight mb-2 text-black leading-tight">
              Ở NHÀ VÀ NHẬN HÀNG   <br />
              <span className="text-[#C83C2B] text-4xl font-bold block mt-1">NHU CẦU HÀNG NGÀY</span>
            </h1>
            <p className="text-gray-600 mb-7 text-base font-medium">
              Rau chứa nhiều vitamin và khoáng chất tốt cho sức khỏe.
            </p>
            <button className="bg-[#C83C2B] hover:bg-[#b8321a] text-white font-bold px-8 py-3 rounded-xl text-lg flex items-center gap-2 w-fit shadow transition-all duration-200">
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
              <a href="https://devidai.io.vn/san-pham" className="text-[#C83C2B] font-bold flex items-center gap-1 hover:underline transition-all duration-200">
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
              <a href="https://devidai.io.vn/san-pham" className="text-[#C83C2B] font-bold flex items-center gap-1 hover:underline transition-all duration-200">
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

      {/* Banner khuyến mãi nhỏ dạng card chuẩn mẫu */}
      <div className="flex flex-row gap-6 justify-center items-start my-8">
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
            href="https://devidai.io.vn/san-pham"
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
            href="https://devidai.io.vn/san-pham"
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
            href="https://devidai.io.vn/san-pham"
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
            href="https://devidai.io.vn/san-pham"
            className="absolute left-4 bottom-1 px-3 py-2  text-white font-bold"
          >
            Mua ngay &rarr;
          </a>
        </div>
      </div>

      <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c,index)=>{
                return(
                  <div key={index+"loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 min-h-24 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat,index)=>{
                return(
                  <div key={cat._id+"displayCategory"} className='w-full h-full' onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}>
                    <div>
                        <img 
                          src={cat.image}
                          className='w-full h-full object-scale-down'
                        />
                    </div>
                  </div>
                )
              })
              
            )
          }
      </div>

      {/***display category product */}
      {
        categoryData?.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay 
              key={c?._id+"CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name}
            />
          )
        })
      }



   </section>
  )
}

export default Home
