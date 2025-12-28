import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const InDeButton = ({ data, quantity, setQuantity }) => {
    const { updateCartItem, deleteCartItem } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const [cartItemDetails, setCartItemsDetails] = useState(null)

    // Nếu không có quantity/setQuantity từ props, sử dụng state local
    const [localQty, setLocalQty] = useState(1)
    const qty = quantity !== undefined ? quantity : localQty
    const setQty = setQuantity || setLocalQty

    useEffect(() => {
        if (!data?._id) {
            setCartItemsDetails(null);
            if (!quantity && setQty) setQty(1);
            return;
        }

        if (!cartItem || cartItem.length === 0) {
            setCartItemsDetails(null);
            if (!quantity && setQty) setQty(1);
            return;
        }

        const product = cartItem.find(item => item?.productId?._id === data._id);
        if (product) {
            setCartItemsDetails(product);
            if (!quantity && setQty) setQty(product?.quantity || 1);
        } else {
            setCartItemsDetails(null);
            if (!quantity && setQty) setQty(1);
        }
    }, [cartItem, data, quantity, setQty]);

    const increaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        
        // Kiểm tra stock
        const maxQty = data?.stock || 999;
        if (qty >= maxQty) {
            toast.error(`Chỉ còn ${maxQty} sản phẩm trong kho`);
            return;
        }

        if (cartItemDetails) {
            // Nếu đã có trong giỏ, cập nhật giỏ hàng
            const response = await updateCartItem(cartItemDetails?._id, qty + 1)
            if (response.success && setQty) {
                setQty(qty + 1)
            }
        } else {
            // Nếu chưa có trong giỏ, chỉ tăng quantity local
            if (setQty) setQty(qty + 1)
        }
    }

    const decreaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (qty <= 1) {
            return; // Không cho phép giảm dưới 1
        }

        if (cartItemDetails) {
            // Nếu đã có trong giỏ, cập nhật giỏ hàng
            const response = await updateCartItem(cartItemDetails._id, qty - 1)
            if (response?.success && setQty) {
                setQty(qty - 1)
            }
        } else {
            // Nếu chưa có trong giỏ, chỉ giảm quantity local
            if (setQty) setQty(qty - 1)
        }
    }
    return (
        <div className='flex-shrink-0'>
            <div className='flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200'>
                <button 
                    onClick={decreaseQty} 
                    className='bg-white hover:bg-gray-50 w-8 h-8 rounded flex items-center justify-center transition-colors border border-gray-200'
                    disabled={qty <= 1}
                >
                    <FaMinus className='text-red-500 text-sm'/>
                </button>

                <p className='w-12 text-center font-medium text-gray-800 mx-2'>{qty}</p>

                <button 
                    onClick={increaseQty} 
                    className='bg-white hover:bg-gray-50 w-8 h-8 rounded flex items-center justify-center transition-colors border border-gray-200'
                    disabled={qty >= (data?.stock || 999)}
                >
                    <FaPlus className='text-red-500 text-sm' />
                </button>
            </div>
        </div>
    )
}

export default InDeButton  
