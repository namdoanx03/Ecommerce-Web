import React from 'react'
import { useForm } from "react-hook-form"
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
        // Parse address2 back to ward, district, province if needed
        // For now, keep the existing structure
        const submitData = {
            _id: formData._id,
            userId: formData.userId,
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            address_line: formData.address_line,
            province: formData.province || data.province,
            district: formData.district || data.district,
            ward: formData.ward || data.ward
        }
        
        const success = await updateAddress(submitData)
        if (success) {
            close()
            reset()
        }
    }
  
    return (
        <section className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] overflow-auto py-8'>
            <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 my-auto'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-200'>
                    <h2 className='text-xl font-semibold text-gray-800'>Edit Profile</h2>
                    <button 
                        onClick={close} 
                        className='text-emerald-600 hover:text-emerald-700 transition-colors'
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form className='p-6 space-y-4' onSubmit={handleSubmit(onSubmit)}>
                    {/* Full Name */}
                    <div className='space-y-2'>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                            Full Name
                        </label>
                        <input
                            type='text'
                            id='name' 
                            className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                            placeholder='Enter full name'
                            {...register("name", {required: true})}
                        />
                    </div>

                    {/* Email address */}
                    <div className='space-y-2'>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                            Email address
                        </label>
                        <input
                            type='email'
                            id='email' 
                            className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                            placeholder='Enter email address'
                            {...register("email", {required: true})}
                        />
                    </div>

                    {/* Phone */}
                    <div className='space-y-2'>
                        <label htmlFor='mobile' className='block text-sm font-medium text-gray-700'>
                            Phone
                        </label>
                        <input
                            type='text'
                            id='mobile' 
                            className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                            placeholder='Enter phone number'
                            {...register("mobile", {required: true})}
                        />
                    </div>

                    {/* Add Address */}
                    <div className='space-y-2'>
                        <label htmlFor='address_line' className='block text-sm font-medium text-gray-700'>
                            Add Address
                        </label>
                        <input
                            type='text'
                            id='address_line' 
                            className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                            placeholder='Enter street address'
                            {...register("address_line", {required: true})}
                        />
                    </div>

                    {/* Add Address 2 (Ward, District, Province combined) */}
                    <div className='space-y-2'>
                        <label htmlFor='address2' className='block text-sm font-medium text-gray-700'>
                            Add Address 2
                        </label>
                        <input
                            type='text'
                            id='address2' 
                            className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                            placeholder='Enter city, state, zip'
                            defaultValue={`${data.ward || ''}${data.district ? ', ' + data.district : ''}${data.province ? ', ' + data.province : ''}`}
                            {...register("address2")}
                        />
                    </div>

                    {/* Hidden fields for ward, district, province */}
                    <input type="hidden" {...register("ward")} defaultValue={data.ward} />
                    <input type="hidden" {...register("district")} defaultValue={data.district} />
                    <input type="hidden" {...register("province")} defaultValue={data.province} />

                    {/* Country and City in one row */}
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Country */}
                        <div className='space-y-2'>
                            <label htmlFor='country' className='block text-sm font-medium text-gray-700'>
                                Country
                            </label>
                            <select
                                id='country' 
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white'
                                {...register("country")}
                            >
                                <option value="">Choose Your Country</option>
                                <option value="VN">Vietnam</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                            </select>
                        </div>

                        {/* City */}
                        <div className='space-y-2'>
                            <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
                                City
                            </label>
                            <select
                                id='city' 
                                className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white'
                                {...register("city")}
                            >
                                <option value="">Choose Your City</option>
                                <option value="hanoi">Hanoi</option>
                                <option value="hochiminh">Ho Chi Minh City</option>
                                <option value="danang">Da Nang</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
                        <button 
                            type='button'
                            onClick={close}
                            className='px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
                        >
                            Close
                        </button>
                        <button 
                            type='submit' 
                            className='px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium'
                        >
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default EditAddressDetails
