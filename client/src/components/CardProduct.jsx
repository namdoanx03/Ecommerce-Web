import React from 'react'
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
  
  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-full'>
      <Link to={url} className='flex flex-col flex-1 p-4'>
        {/* Product Image */}
        <div className='w-full flex items-center justify-center mb-3' style={{ height: '140px' }}>
          <img 
            src={data.image?.[0]} 
            alt={data.name}
            className='object-contain'
            style={{ maxHeight: '130px', maxWidth: '130px' }}
          />
        </div>

        {/* Product Name */}
        <div className='font-semibold text-sm mb-1 leading-tight line-clamp-2' style={{ minHeight: '42px', lineHeight: '1.5' }}>
          {data.name}
        </div>

        {/* Price */}
        <div className='flex items-end gap-2 mb-1'>
          <span className='text-red-600 font-bold text-lg'>
            {DisplayPriceInVND(pricewithDiscount(data.price, data.discount))}
          </span>
          {Boolean(data.discount) && (
            <span className='text-gray-400 line-through text-sm'>
              {DisplayPriceInVND(data.price)}
            </span>
          )}
        </div>

        {/* Rating & Stock Status */}
        <div className='flex items-center gap-1 mb-2'>
          <div className='flex items-center'>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className='w-4 h-4 fill-current text-yellow-400'
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.973c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.389 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.037 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
              </svg>
            ))}
          </div>
          {data.stock === 0 ? (
            <span className='text-red-500 font-semibold text-base ml-2'>Hết hàng</span>
          ) : (
            <span className='text-red-500 font-semibold text-base ml-2'>Còn hàng</span>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      {data.stock !== 0 && (
        <div className='px-4 pb-4 flex justify-center items-center'>
          <AddToCartButton 
            data={data} 
            showFullWidth={true}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
          />
        </div>
      )}
    </div>
  )
}

export default CardProduct
