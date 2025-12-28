import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';

const EditCategory = ({close, fetchData,data : CategoryData}) => {
    const [data,setData] = useState({
        _id : CategoryData._id,
        name : CategoryData.name,
        image : CategoryData.image
    })
    const [loading,setLoading] = useState(false)

    const handleOnChange = (e)=>{
        const { name, value} = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }
    const handleSubmit = async(e)=>{
        e.preventDefault()


        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateCategory,
                data : data
            })
            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }
    const handleUploadCategoryImage = async(e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }
        setLoading(true)
        const response = await uploadImage(file)
        const { data : ImageResponse } = response
        setLoading(false)
        
        setData((preve)=>{
            return{
                ...preve,
                image : ImageResponse.data.url
            }
        })
    }
  return (
    <section 
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          close()
        }
      }}
    >
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h1 className='text-2xl font-semibold text-gray-800'>Cập nhật danh mục</h1>
          <button 
            onClick={close} 
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <IoClose size={24}/>
          </button>
        </div>
        <form className='p-6 grid gap-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='categoryName' className='text-sm font-medium text-gray-700'>Name</label>
            <input
              type='text'
              id='categoryName'
              placeholder='Enter category name'
              value={data.name}
              name='name'
              onChange={handleOnChange}
              className='bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors'
              required
            />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm font-medium text-gray-700'>Image</label>
            <div className='flex gap-4 flex-col lg:flex-row items-start'>
              <div className='border-2 border-gray-200 bg-gray-50 h-40 w-full lg:w-40 flex items-center justify-center rounded-lg'>
                {
                  data.image ? (
                    <img
                      alt='category'
                      src={data.image}
                      className='w-full h-full object-contain rounded-lg'
                    />
                  ) : (
                    <p className='text-sm text-gray-400'>No Image</p>
                  )
                }
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='uploadCategoryImage'>
                  <div className={`
                    ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-50 hover:bg-blue-100 cursor-pointer"}  
                    px-4 py-2 rounded-lg border border-blue-200 text-blue-700 font-medium transition-colors
                  `}>
                    {loading ? "Loading..." : "Tải ảnh"}
                  </div>
                  <input 
                    disabled={loading} 
                    onChange={handleUploadCategoryImage} 
                    type='file' 
                    id='uploadCategoryImage' 
                    className='hidden'
                    accept='image/*'
                  />
                </label>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
            <button
              type='button'
              className='px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium'
              onClick={close}
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={!data.name || loading}
              className={`
                ${data.name && !loading ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-300 cursor-not-allowed"}
                px-6 py-2.5 text-white rounded-lg transition-colors font-medium
              `}
            >
              Cập nhật danh mục
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default EditCategory
