import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  })
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")


  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) {
      return
    }
    setImageLoading(true)
    const uploadedImages = []
    for (const file of files) {
      const response = await uploadImage(file)
      const { data: ImageResponse } = response
      uploadedImages.push(ImageResponse.data.url)
    }
    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, ...uploadedImages]
      }
    })
    setImageLoading(false)
  }

  const handleDeleteImage = (index) => {
    setData((preve) => {
      const newImages = [...preve.image]
      newImages.splice(index, 1)
      return {
        ...preve,
        image: newImages
      }
    })
  }

  const handleRemoveCategory = (index) => {
    setData((preve) => {
      const newCategory = [...preve.category]
      newCategory.splice(index, 1)
      return {
        ...preve,
        category: newCategory
      }
    })
  }
  const handleRemoveSubCategory = (index) => {
    setData((preve) => {
      const newSubCategory = [...preve.subCategory]
      newSubCategory.splice(index, 1)
      return {
        ...preve,
        subCategory: newSubCategory
      }
    })
  }

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("data", data)

    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data
      })
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })

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
          <h1 className="text-2xl font-semibold text-gray-800">Thêm sản phẩm</h1>
        </div>

        {/* Form Section */}
        <div className='bg-white'>
          <form className='grid gap-4' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                  <label htmlFor='name' className='font-medium'>Tên sản phẩm</label>
                  <input
                    id='name'
                    type='text'
                    placeholder='Nhập tên sản phẩm'
                    name='name'
                    value={data.name}
                    onChange={handleChange}
                    required
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>
                <div className='grid gap-1'>
                  <label htmlFor='description' className='font-medium'>Mô tả</label>
                  <textarea
                    id='description'
                    type='text'
                    placeholder='Nhập mô tả sản phẩm'
                    name='description'
                    value={data.description}
                    onChange={handleChange}
                    required
                    multiple
                    rows={3}
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg resize-none'
                  />
                </div>
                <div>
                  <p className='font-medium mb-1'>Ảnh sản phẩm</p>
                  <div className='bg-gray-50 min-h-24 border border-gray-300 rounded-lg relative'>
                    {data.image.length > 0 ? (
                      <div className='w-full p-2 flex flex-wrap gap-2'>
                        {data.image.map((img, index) => {
                          return (
                            <div key={img + index} className='h-20 w-20 min-w-20 bg-white border border-gray-300 rounded-lg relative group'>
                              <img
                                src={img}
                                alt={img}
                                className='w-full h-full object-cover rounded-lg cursor-pointer'
                                onClick={() => setViewImageURL(img)}
                              />
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDeleteImage(index)
                                }}
                                className='absolute top-0 right-0 p-1 bg-red-600 hover:bg-red-700 rounded-full text-white cursor-pointer z-10'
                              >
                                <IoClose size={14} />
                              </button>
                            </div>
                          )
                        })}
                        <label htmlFor='productImage' className='h-20 w-20 min-w-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-200 transition-colors'>
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
                            id='productImage'
                            className='hidden'
                            accept='image/*'
                            multiple
                            onChange={handleUploadImages}
                          />
                        </label>
                      </div>
                    ) : (
                      <label htmlFor='productImage' className='w-full h-full flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors py-4'>
                        <div className='text-center flex justify-center items-center flex-col'>
                          {imageLoading ? (
                            <Loading />
                          ) : (
                            <>
                              <FaCloudUploadAlt size={35} className='text-gray-400' />
                              <p className='text-gray-600 mt-2'>Tải ảnh sản phẩm</p>
                            </>
                          )}
                        </div>
                        <input
                          type='file'
                          id='productImage'
                          className='hidden'
                          accept='image/*'
                          multiple
                          onChange={handleUploadImages}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className='grid gap-1'>
                  <label className='font-medium'>Danh mục</label>
                  <div className='relative'>
                    <div className='bg-white border border-gray-300 w-full min-h-[42px] p-2 rounded-lg focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200 flex flex-wrap gap-2 items-center'>
                      {data.category.length > 0 ? (
                        data.category.map((c, index) => {
                          return (
                            <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 relative z-10'>
                              <p className='text-gray-700'>{c.name}</p>
                              <button
                                type='button'
                                className='hover:text-red-500 cursor-pointer transition-colors'
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleRemoveCategory(index)
                                }}
                              >
                                <IoClose size={16} />
                              </button>
                            </div>
                          )
                        })
                      ) : (
                        <span className='text-gray-400 text-sm'>Chọn danh mục</span>
                      )}
                    </div>
                    <select
                      className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-0'
                      value={selectCategory}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value) {
                          const category = allCategory.find(el => el._id === value)
                          if (category && !data.category.find(c => c._id === category._id)) {
                            setData((preve) => {
                              return {
                                ...preve,
                                category: [...preve.category, category],
                              }
                            })
                          }
                          setSelectCategory("")
                        }
                      }}
                    >
                      <option value={""}>Chọn danh mục</option>
                      {
                        allCategory.map((c, index) => {
                          return (
                            <option key={c._id || index} value={c?._id}>{c.name}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                </div>
                <div className='grid gap-1'>
                  <label className='font-medium'>Danh mục con</label>
                  <div className='relative'>
                    <div className='bg-white border border-gray-300 w-full min-h-[42px] p-2 rounded-lg focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200 flex flex-wrap gap-2 items-center'>
                      {data.subCategory.length > 0 ? (
                        data.subCategory.map((c, index) => {
                          return (
                            <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 relative z-10'>
                              <p className='text-gray-700'>{c.name}</p>
                              <button
                                type='button'
                                className='hover:text-red-500 cursor-pointer transition-colors'
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleRemoveSubCategory(index)
                                }}
                              >
                                <IoClose size={16} />
                              </button>
                            </div>
                          )
                        })
                      ) : (
                        <span className='text-gray-400 text-sm'>Chọn danh mục con</span>
                      )}
                    </div>
                    <select
                      className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-0'
                      value={selectSubCategory}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value) {
                          const subCategory = allSubCategory.find(el => el._id === value)
                          if (subCategory && !data.subCategory.find(c => c._id === subCategory._id)) {
                            setData((preve) => {
                              return {
                                ...preve,
                                subCategory: [...preve.subCategory, subCategory]
                              }
                            })
                          }
                          setSelectSubCategory("")
                        }
                      }}
                    >
                      <option value={""} className='text-neutral-600'>Chọn danh mục con</option>
                      {
                        allSubCategory.map((c, index) => {
                          return (
                            <option key={c._id || index} value={c?._id}>{c.name}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='unit' className='font-medium'>Đơn vị</label>
                  <input
                    id='unit'
                    type='text'
                    placeholder='Nhập đơn vị sản phẩm'
                    name='unit'
                    value={data.unit}
                    onChange={handleChange}
                    required
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='stock' className='font-medium'>Số lượng tồn kho</label>
                  <input
                    id='stock'
                    type='number'
                    placeholder='Nhập số lượng tồn kho'
                    name='stock'
                    value={data.stock}
                    onChange={handleChange}
                    required
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='price' className='font-medium'>Giá</label>
                  <input
                    id='price'
                    type='number'
                    placeholder='Nhập giá sản phẩm'
                    name='price'
                    value={data.price}
                    onChange={handleChange}
                    required
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='discount' className='font-medium'>Giảm giá</label>
                  <input
                    id='discount'
                    type='number'
                    placeholder='Nhập giảm giá sản phẩm'
                    name='discount'
                    value={data.discount}
                    onChange={handleChange}
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>


                {/**add more field**/}
                {
                  Object?.keys(data?.more_details)?.map((k, index) => {
                    return (
                      <div key={k + index} className='grid gap-1'>
                        <label htmlFor={k} className='font-medium'>{k}</label>
                        <input
                          id={k}
                          type='text'
                          value={data?.more_details[k]}
                          onChange={(e) => {
                            const value = e.target.value
                            setData((preve) => {
                              return {
                                ...preve,
                                more_details: {
                                  ...preve.more_details,
                                  [k]: value
                                }
                              }
                            })
                          }}
                          required
                          className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                        />
                      </div>
                    )
                  })
                }

                <button
                  type='submit'
                  className='bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors'
                >
                  Lưu
                </button>
              </form>
        </div>
      </div>

      {/* Modals */}
      {
        ViewImageURL && (
          <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
        )
      }

      {
        openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )
      }
    </div>
  )
}

export default UploadProduct
