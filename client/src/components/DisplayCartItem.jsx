import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'
import InDeButton from './InDeButton'


const DisplayCartItem = ({ close }) => {
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const [isClosing, setIsClosing] = useState(false)

    const redirectToCheckoutPage = () => {
        if (user?._id) {
            navigate("/checkout")
            if (close) {
                handleClose()
            }
            return
        }
        toast("Please Login")
    }

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose()
        }
    }

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            close()
            setIsClosing(false)
        }, 300) // Match with transition duration
    }

    return (
        <section
            className={`bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            onClick={handleOutsideClick}
        >
            <div className={`bg-white w-full max-w-[28%] min-h-screen max-h-screen ml-auto transform transition-transform duration-300 ease-in-out ${isClosing ? 'translate-x-full' : 'translate-x-0'}`}>
                <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
                    <h2 className='font-semibold text-xl'>Giỏ hàng</h2>
                    <Link to={"/"} className='lg:hidden'>
                        <IoClose size={25} />
                    </Link>
                    <button onClick={handleClose} className='hidden lg:block'>
                        <IoClose size={25} />
                    </button>
                </div>

                <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
                    {/***display items */}
                    {
                        cartItem[0] ? (
                            <>
                                <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-red-500 rounded-full'>
                                    <p>Tổng số tiền tiết kiệm</p>
                                    <p>{DisplayPriceInVND(notDiscountTotalPrice - totalPrice)}</p>
                                </div>
                                <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item, index) => {
                                                return (
                                                    <div key={item?._id + "cartItemDisplay"} className='flex justify-between w-full gap-4'>
                                                        <div className='flex items-center gap-4'>
                                                            <div className='w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded'>
                                                                <img
                                                                    src={item?.productId?.image[0]}
                                                                    className='object-scale-down'
                                                                />
                                                            </div>
                                                            <div className='w-full max-w-40 text-xs'>
                                                                <p className='text-sm text-ellipsis truncate line-clamp-2'>{item?.productId?.name}</p>
                                                                <p className='text-sm my-1'>Số lượng: {item?.quantity}</p>
                                                                <p className='font-semibold'>{DisplayPriceInVND(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                                                            </div>

                                                        </div>
                                                        <div>
                                                            <InDeButton data={item?.productId}/>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                </div>
                                <div className='bg-white p-2'>
                                    <h3 className='font-semibold'>Hoá đơn chi tiết</h3>
                                    <div className='flex gap-4 justify-between ml-1 mb-1'>
                                        <p>Tổng</p>
                                        <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInVND(notDiscountTotalPrice)}</span><span>{DisplayPriceInVND(totalPrice)}</span></p>
                                    </div>
                                    <div className='flex gap-4 justify-between ml-1 mb-1'>
                                        <p>Số lượng</p>
                                        <p className='flex items-center gap-2'>{totalQty} sản phẩm</p>
                                    </div>
                                    <div className='flex gap-4 justify-between ml-1 mb-1' >
                                        <p>Phí vận chuyển</p>
                                        <p className='flex items-center gap-2'>Miễn phí</p>
                                    </div>
                                    <div className='font-semibold flex items-center justify-between gap-4'>
                                        <p >Grand total</p>
                                        <p>{DisplayPriceInVND(totalPrice)}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className='bg-white flex flex-col justify-center items-center py-10 '>
                                <img
                                    src={imageEmpty}
                                    className='w-full h-full object-scale-down'
                                />
                                <a onClick={handleClose} href={"/product"} className='block bg-green-600 px-4 py-2 text-white rounded'>Mua sắm ngay</a>
                            </div>
                        )
                    }

                </div>

                {
                    cartItem[0] && (
                        <div className='p-2'>
                            <div className='bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 static bottom-3 rounded flex items-center gap-4 justify-between'>
                                <div>
                                    {DisplayPriceInVND(totalPrice)}
                                </div>
                                <button onClick={redirectToCheckoutPage} className='flex items-center gap-1'>
                                    Thanh toán
                                    <span><FaCaretRight /></span>
                                </button>
                            </div>
                        </div>
                    )
                }

            </div>
        </section>
    )
}

export default DisplayCartItem
