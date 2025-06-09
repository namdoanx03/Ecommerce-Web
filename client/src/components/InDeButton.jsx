import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const InDeButton = ({ data }) => {
    const { updateCartItem, deleteCartItem } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const [qty, setQty] = useState(0)
    const [cartItemDetails,setCartItemsDetails] = useState()

    useEffect(() => {
        const product = cartItem.find(item => item.productId._id === data._id);
        setCartItemsDetails(product);
        setQty(product?.quantity || 1);
    }, [cartItem, data]);

    const increaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (cartItemDetails && qty < data.stock) {
            const response = await updateCartItem(cartItemDetails?._id, qty + 1)
            if (response.success) {
                setQty(qty + 1)
            }
        }
    }

    const decreaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (cartItemDetails && qty > 1) {
            const response = await updateCartItem(cartItemDetails?._id, qty - 1)
            if (response.success) {
                setQty(qty - 1)
                toast.success("Item removed")
            }
        }
    }
    return (
        <div className='w-full max-w-[150px]'>

            <div className='flex w-full h-full bg-gray-100 p-1 rounded'>
                <button onClick={decreaseQty} className='bg-white hover:bg-green-700 text-white flex-1 h-8 p-1 rounded flex items-center justify-center'><FaMinus  className='text-red-500'/></button>

                <p className='flex-1 w-full font-medium px-3 flex items-center justify-center'>{qty}</p>

                <button onClick={increaseQty} className='bg-white hover:bg-green-700 text-white flex-1 h-8 p-1 rounded flex  items-center justify-center'><FaPlus className='text-red-500' /></button>
            </div>


        </div>
    )
}

export default InDeButton  
