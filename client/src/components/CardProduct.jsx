import React, { useState } from 'react'
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import AddToCartButton from './AddToCartButton'
import { CiHeart } from "react-icons/ci";
import { useSelector } from 'react-redux'

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading] = useState(false)
    const user = useSelector(state => state.user)

    const handleToggleFavorite = async (e) => {
      e.preventDefault()
      if (!user?._id) {
        toast.error('Vui lòng đăng nhập để thêm yêu thích')
        return
      }
      try {
        if (loading) return
        setLoading(true)
        const response = await Axios({
          ...SummaryApi.toggleFavorite,
          data: { productId: data._id }
        })
        const { data: res } = response
        if (res.success) {
          toast.success(res.message)
        }
      } catch (error) {
        AxiosToastError(error)
      } finally {
        setLoading(false)
      }
    }
  
  return (
    <Link to={url} className=' py-2 lg:p-4 grid gap-11 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-[#f8f8f8] relative' >
      <button
        onClick={handleToggleFavorite}
        className='absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white shadow hover:text-emerald-500'
        title='Favorite'
        disabled={loading}
      >
        <CiHeart className='w-5 h-5' />
      </button>
      <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
        <img 
          src={data.image[0]}
          className='w-full h-full object-scale-down lg:scale-125'
        />
      </div>
      <div className='flex items-center gap-1'>
        <div className='rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50'>
              10 min 
        </div>
        <div>
            {
              Boolean(data.discount) && (
                <p className='text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full'>{data.discount}% discount</p>
              )
            }
        </div>
      </div>
      <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
        {data.name}
      </div>
      <div className='px-2 lg:px-0 flex items-center gap-2'>
        <div className='flex items-center'>
          {[...Array(5)].map((_, i) => (
            <svg key={i} className='w-4 h-4  text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
              <polygon points='10,1 12.59,6.99 19,7.64 14,12.26 15.18,18.02 10,15.02 4.82,18.02 6,12.26 1,7.64 7.41,6.99' />
            </svg>
          ))}
        </div>
        {data.stock == 0 ? (
          <span className='text-red-500 text-sm ml-2'>Hết hàng</span>
        ) : (
          <span className='text-red-500 text-sm ml-2'>Còn hàng</span>
        )}
      </div>

      <div className='px-2 lg:px-0 flex flex-col  gap-1 lg:gap-3 text-sm lg:text-base'>
        <div className='flex items-center gap-2'>
          <div className='font-semibold text-red-500 text-lg'>
              {DisplayPriceInVND(pricewithDiscount(data.price,data.discount))}
          </div>
          {Boolean(data.discount) && (
            <div className='line-through text-gray-400 text-base'>
              {DisplayPriceInVND(data.price)}
            </div>
          )}
        </div>
        <div className='w-full flex justify-center'>
          {
            data.stock == 0 ? null : (
              <AddToCartButton data={data} />
            )
          }
        </div>
      </div>

    </Link>
  )
}

export default CardProduct
