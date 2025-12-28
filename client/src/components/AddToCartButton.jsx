import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data, quantity = 1, showFullWidth = false, className = '', children }) => {
    const { fetchCartItem} = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()
    const user = useSelector(state => state.user)

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user?._id) {
            toast.error("Vui lòng đăng nhập")
            return
        }

        try {
            setLoading(true)

            // Gọi API quantity lần để thêm với số lượng đúng
            let successCount = 0
            for (let i = 0; i < quantity; i++) {
                try {
                    const response = await Axios({
                        ...SummaryApi.addTocart,
                        data: {
                            productId: data?._id
                        }
                    })

                    const { data: responseData } = response
                    if (responseData.success) {
                        successCount++
                    }
                } catch (error) {
                    // Continue even if one request fails
                }
            }

            if (successCount > 0) {
                toast.success(`Đã thêm ${successCount} sản phẩm vào giỏ hàng`)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            } else {
                toast.error("Không thể thêm sản phẩm vào giỏ hàng")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    //checking this item in cart or not
    useEffect(() => {
        if (!data?._id || !cartItem || cartItem.length === 0) {
            setIsAvailableCart(false)
            setQty(0)
            setCartItemsDetails(null)
            return
        }

        const checkingitem = cartItem.some(item => item?.productId?._id === data._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item?.productId?._id === data._id)
        setQty(product?.quantity || 0)
        setCartItemsDetails(product || null)
    }, [data, cartItem])

    const defaultClassName = 'bg-green-600 hover:bg-green-700 text-white px-2 lg:px-3 py-2 rounded-full w-full font-medium'
    const finalClassName = className || defaultClassName

    if (showFullWidth) {
        return (
            <button onClick={handleADDTocart} className={finalClassName} disabled={loading}>
                {loading ? <Loading /> : (children || "Thêm vào giỏ")}
            </button>
        )
    }

    return (
        <div className='w-full max-w-[180px]'>
            <button onClick={handleADDTocart} className={finalClassName} disabled={loading}>
                {loading ? <Loading /> : (children || "Thêm vào giỏ")}
            </button>
        </div>
    )
}

export default AddToCartButton
// w-full rounded-full py-3 text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 transition mt-2"