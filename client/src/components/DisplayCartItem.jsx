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
import { IoCloseSharp } from "react-icons/io5";


const DisplayCartItem = ({close}) => {
    const { notDiscountTotalPrice, totalPrice, totalQty, deleteCartItem } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)

    const handleDeleteClick = (item) => {
        setItemToDelete(item)
        setShowDeleteConfirm(true)
    }

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            await deleteCartItem(itemToDelete._id)
            setShowDeleteConfirm(false)
            setItemToDelete(null)
        }
    }

    const handleOutsideClick = (e) => {
        // Kiểm tra nếu click vào phần overlay (phần nền tối)
        if (e.target === e.currentTarget) {
            close()
        }
    }

    const redirectToCheckoutPage = () => {
        if(user?._id){
            navigate("/checkout")
            if(close){
                close()
            }
            return
        }
        toast("Please Login")
    }

    return (
        <section 
            className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50'
            onClick={handleOutsideClick}
        >
            <div className='bg-white w-full max-w-[28%] min-h-screen max-h-screen ml-auto'>
                <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
                    <h2 className='font-semibold text-xl'>Giỏ hàng</h2>
                    <Link to={"/"} className='lg:hidden'>
                        <IoClose size={25}/>
                    </Link>
                    <button onClick={close} className='hidden lg:block'>
                        <IoClose size={25}/>
                    </button>
                </div>

                <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
                    {/***display items */}
                    {
                        cartItem[0] ? (
                            <>
                                <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-red-500 rounded-full'>
                                        <p>Tổng số tiền tiết kiệm</p>
                                        <p>{DisplayPriceInVND(notDiscountTotalPrice - totalPrice )}</p>
                                </div>
                                <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                                        {
                                            cartItem[0] && (
                                                cartItem.map((item,index)=>{
                                                    return(
                                                        <div key={item?._id+"cartItemDisplay"} className='flex justify-between w-full gap-4'>
                                                            <div className='flex items-center gap-4'>
                                                                <div className='w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded'>
                                                                    <img
                                                                        src={item?.productId?.image[0]}
                                                                        className='object-scale-down'
                                                                    />
                                                                </div>
                                                                <div className='w-full max-w-40 text-xs'>
                                                                    <p className='text-sm text-ellipsis truncate line-clamp-2'>{item?.productId?.name}</p>
                                                                    <p className='text-sm my-1'>Số lượng : {item?.productId?.unit}</p>
                                                                    <p className='font-semibold'>{DisplayPriceInVND(pricewithDiscount(item?.productId?.price,item?.productId?.discount))}</p>
                                                                </div>
                                                                </div>
                                                            <div className='flex flex-col gap-2'>
                                                                
                                                                <button 
                                                                    onClick={() => handleDeleteClick(item)}
                                                                    className='py-5 rounded '
                                                                >
                                                                    <IoCloseSharp size={20}/> 
                                                                </button>
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
                            <div className='bg-white flex flex-col justify-center items-center'>
                                <img
                                    src={imageEmpty}
                                    className='w-full h-full object-scale-down' 
                                />
                                <Link onClick={close} to={"/"} className='block bg-green-600 px-4 py-2 text-white rounded'>Shop Now</Link>
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
                                    <span><FaCaretRight/></span>
                                </button>
                            </div>
                        </div>
                    )
                }
                
            </div>

            {/* Delete Confirmation Modal */}
            <div className={`fixed inset-0 bg-slate-950/50 flex justify-center items-center transition-opacity duration-300 ease-out z-[9999] ${showDeleteConfirm ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-white rounded-xl shadow-2xl shadow-slate-950/5 border border-slate-200 w-1/3 scale-95">
                    <div className="p-4 border-b border-slate-200">
                        <h1 className="text-lg text-slate-800 font-semibold">Xác nhận xóa</h1>
                        <button 
                            type="button" 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none data-[shape=circular]:rounded-full text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent border-transparent text-slate-200-foreground hover:bg-slate-200/10 hover:border-slate-200/10 shadow-none hover:shadow-none outline-none absolute right-2 top-2"
                        >
                            <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="h-5 w-5">
                                <path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 pt-2 text-slate-600">
                        Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
                    </div>
                    <div className="p-4 flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 bg-transparent border-transparent text-red-500 hover:bg-red-500/10 hover:border-red-500/10 shadow-none hover:shadow-none outline-none"
                        >
                            Hủy
                        </button>
                        <button 
                            type="button"
                            onClick={handleConfirmDelete}
                            className="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md bg-slate-800 border-slate-800 text-slate-50 hover:bg-slate-700 hover:border-slate-700"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DisplayCartItem
