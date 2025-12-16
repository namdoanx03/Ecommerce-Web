import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useNavigate } from 'react-router-dom';

const UploadCategory = () => {
  const [data, setData] = useState({
    name: "",
    image: ""
  })
  const [imageLoading, setImageLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }
    setImageLoading(true)
    try {
      const response = await uploadImage(file)
      const { data: ImageResponse } = response

      setData((preve) => {
        return {
          ...preve,
          image: ImageResponse.data.url
        }
      })
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setImageLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.addCategory,
        data: data
      })
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        setData({
          name: "",
          image: ""
        })
        navigate('/dashboard/category')
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className='min-h-screen p-4 sm:p-6'>
      {/* Main Content Container - White Background */}
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='mb-6'>
          <h1 className="text-2xl font-semibold text-gray-800">Add Category</h1>
        </div>

        {/* Form Section */}
        <div className='bg-white'>
          <form className='grid gap-4' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
              <label htmlFor='name' className='font-medium'>Tên danh mục</label>
              <input
                id='name'
                type='text'
                placeholder='Nhập tên danh mục'
                name='name'
                value={data.name}
                onChange={handleChange}
                required
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              />
            </div>

            <div>
              <p className='font-medium mb-1'>Ảnh danh mục</p>
              <div className='bg-gray-50 min-h-24 border border-gray-300 rounded-lg relative'>
                {data.image ? (
                  <div className='w-full p-2 flex flex-wrap gap-2'>
                    <div className='h-20 w-20 min-w-20 bg-white border border-gray-300 rounded-lg relative group'>
                      <img
                        src={data.image}
                        alt='category'
                        className='w-full h-full object-cover rounded-lg cursor-pointer'
                      />
                      <button
                        type='button'
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setData((preve) => ({ ...preve, image: "" }))
                        }}
                        className='absolute top-0 right-0 p-1 bg-red-600 hover:bg-red-700 rounded-full text-white cursor-pointer z-10'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <label htmlFor='categoryImage' className='h-20 w-20 min-w-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-200 transition-colors'>
                      {imageLoading ? (
                        <Loading />
                      ) : (
                        <>
                          <FaCloudUploadAlt size={24} className='text-gray-400' />
                          <p className='text-xs text-gray-500 mt-1'>Thêm</p>
                        </>
                      )}
                      <input
                        type='file'
                        id='categoryImage'
                        className='hidden'
                        accept='image/*'
                        onChange={handleUploadImage}
                      />
                    </label>
                  </div>
                ) : (
                  <label htmlFor='categoryImage' className='w-full h-full flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors py-4'>
                    <div className='text-center flex justify-center items-center flex-col'>
                      {imageLoading ? (
                        <Loading />
                      ) : (
                        <>
                          <FaCloudUploadAlt size={35} className='text-gray-400' />
                          <p className='text-gray-600 mt-2'>Tải ảnh danh mục</p>
                        </>
                      )}
                    </div>
                    <input
                      type='file'
                      id='categoryImage'
                      className='hidden'
                      accept='image/*'
                      onChange={handleUploadImage}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
              <button
                type='button'
                onClick={() => navigate('/dashboard/category')}
                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
              >
                Discard
              </button>
              <button
                type='submit'
                disabled={!data.name || !data.image || imageLoading}
                className={`${
                  data.name && data.image && !imageLoading
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-300 cursor-not-allowed'
                } text-white py-2 px-6 rounded-lg font-semibold transition-colors`}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadCategory

