import React from 'react'
import { useForm } from "react-hook-form"
import { IoClose } from "react-icons/io5";
import { useAddress } from '../hooks/useAddress';

const EditAddressDetails = ({close, data}) => {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            _id: data._id,
            userId: data.userId,
            address_line: data.address_line,
            province: data.province,
            district: data.district,
            ward: data.ward,
            name: data.name,
            mobile: data.mobile,
            email: data.email
        }
    })
    const { updateAddress } = useAddress()

    const onSubmit = async(formData) => {
        console.log('Form data:', formData) // Debug log
        const success = await updateAddress(formData)
        if (success) {
            close()
            reset()
        }
    }
  
    return (
        <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto'>
            <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
                <div className='flex justify-between items-center gap-4'>
                    <h2 className='font-semibold'>Chỉnh sửa địa chỉ</h2>
                    <button onClick={close} className='hover:text-red-500'>
                        <IoClose size={25}/>
                    </button>
                </div>
                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                        <label htmlFor='name'>Họ và tên <span className="text-red-500">*</span></label>
                        <input
                            type='text'
                            id='name' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("name", {required: true})}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='email'>Email <span className="text-red-500">*</span></label>
                        <input
                            type='email'
                            id='email' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("email", {required: true})}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='mobile'>Số điện thoại <span className="text-red-500">*</span></label>
                        <input
                            type='text'
                            id='mobile' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("mobile", {required: true})}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='province'>Tỉnh / Thành phố <span className="text-red-500">*</span></label>
                        <input
                            type='text'
                            id='province' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("province", {required: true})}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='district'>Quận / Huyện <span className="text-red-500">*</span></label>
                        <input
                            type='text'
                            id='district' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("district", {required: true})}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='ward'>Phường / Xã <span className="text-red-500">*</span></label>
                        <input
                            type='text'
                            id='ward' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("ward", {required: true})}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='address_line'>Địa chỉ <span className="text-red-500">*</span></label>
                        <input
                            type='text'
                            id='address_line' 
                            className='border bg-blue-50 p-2 rounded'
                            {...register("address_line", {required: true})}
                        />
                    </div>

                    <button type='submit' className='bg-primary-200 w-full py-2 font-semibold mt-4 hover:bg-primary-100'>Cập nhật</button>
                </form>
            </div>
        </section>
    )
}

export default EditAddressDetails

