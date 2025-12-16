import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditSubCategory = ({close,data,fetchData}) => {
    const [subCategoryData,setSubCategoryData] = useState({
        _id : data._id,
        name : data.name,
        image : data.image,
        category : data.category || []
    })
    const allCategory = useSelector(state => state.product.allCategory)
    const [loading, setLoading] = useState(false)

    const handleChange = (e)=>{
        const { name, value} = e.target 

        setSubCategoryData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleUploadSubCategoryImage = async(e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }

        setLoading(true)
        try {
            const response = await uploadImage(file)
            const { data : ImageResponse } = response

            setSubCategoryData((preve)=>{
                return{
                    ...preve,
                    image : ImageResponse.data.url
                }
            })
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveCategorySelected = (categoryId)=>{
        setSubCategoryData((preve)=>{
            return{
                ...preve,
                category: preve.category.filter(cat => cat._id !== categoryId)
            }
        })
    }

    const handleSelectCategory = (e) => {
        const value = e.target.value
        if (!value) return

        const categoryDetails = allCategory.find(el => el._id === value)
        if (!categoryDetails) return

        // Check if category is already selected
        const isAlreadySelected = subCategoryData.category.some(cat => cat._id === categoryDetails._id)
        if (isAlreadySelected) {
            toast.error('Danh mục này đã được chọn')
            e.target.value = ""
            return
        }

        setSubCategoryData((preve)=>{
            return{
                ...preve,
                category : [...preve.category, categoryDetails]
            }
        })
        e.target.value = ""
    }

    const handleSubmitSubCategory = async(e)=>{
        e.preventDefault()

        if (!subCategoryData.name || !subCategoryData.image || subCategoryData.category.length === 0) {
            toast.error('Vui lòng điền đầy đủ thông tin')
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateSubCategory,
                data : subCategoryData
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                }
                if(fetchData){
                    fetchData()
                }
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
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
          <h1 className='text-2xl font-semibold text-gray-800'>Update Sub Category</h1>
          <button 
            onClick={close} 
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <IoClose size={24}/>
          </button>
        </div>
        <form className='p-6 grid gap-4' onSubmit={handleSubmitSubCategory}>
          <div className='grid gap-1'>
            <label htmlFor='subCategoryName' className='text-sm font-medium text-gray-700'>Name</label>
            <input
              type='text'
              id='subCategoryName'
              placeholder='Enter subcategory name'
              value={subCategoryData.name}
              name='name'
              onChange={handleChange}
              className='bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors'
              required
            />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm font-medium text-gray-700'>Image</label>
            <div className='flex gap-4 flex-col lg:flex-row items-start'>
              <div className='border-2 border-gray-200 bg-gray-50 h-40 w-full lg:w-40 flex items-center justify-center rounded-lg'>
                {
                  subCategoryData.image ? (
                    <img
                      alt='subCategory'
                      src={subCategoryData.image}
                      className='w-full h-full object-contain rounded-lg'
                    />
                  ) : (
                    <p className='text-sm text-gray-400'>No Image</p>
                  )
                }
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='uploadSubCategoryImage'>
                  <div className={`
                    ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-50 hover:bg-blue-100 cursor-pointer"}  
                    px-4 py-2 rounded-lg border border-blue-200 text-blue-700 font-medium transition-colors
                  `}>
                    {loading ? "Loading..." : "Upload Image"}
                  </div>
                  <input 
                    disabled={loading} 
                    onChange={handleUploadSubCategoryImage} 
                    type='file' 
                    id='uploadSubCategoryImage' 
                    className='hidden'
                    accept='image/*'
                  />
                </label>
              </div>
            </div>
          </div>
          <div className='grid gap-1'>
            <label className='text-sm font-medium text-gray-700'>Select Category</label>
            <div className='bg-white border border-gray-300 rounded-lg p-2 min-h-[60px] focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200'>
              {/* Display selected categories */}
              {subCategoryData.category.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-2'>
                  {subCategoryData.category.map((cat) => (
                    <div
                      key={cat._id}
                      className='bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2'
                    >
                      <span className='text-sm text-gray-700'>{cat.name}</span>
                      <button
                        type='button'
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemoveCategorySelected(cat._id)
                        }}
                        className='text-red-600 hover:text-red-700 transition-colors'
                      >
                        <IoClose size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Select dropdown */}
              <select
                className='w-full p-2 bg-transparent outline-none border-0 focus:ring-0'
                onChange={handleSelectCategory}
                defaultValue=""
              >
                <option value="">Select Category</option>
                {allCategory && allCategory.map((category) => (
                  <option value={category._id} key={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
              disabled={!subCategoryData.name || !subCategoryData.image || subCategoryData.category.length === 0 || loading}
              className={`
                ${subCategoryData.name && subCategoryData.image && subCategoryData.category.length > 0 && !loading ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-300 cursor-not-allowed"}
                px-6 py-2.5 text-white rounded-lg transition-colors font-medium
              `}
            >
              Update Sub Category
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default EditSubCategory
