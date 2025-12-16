import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditSubCategory from '../components/EditSubCategory'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import Loading from '../components/Loading'

const SubCategoryPage = () => {
  const navigate = useNavigate()
  const [allData, setAllData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({
    _id: ""
  })
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
  const [search, setSearch] = useState("")
  const [viewSubCategory, setViewSubCategory] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  const fetchAllSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      const { data: responseData } = response
      if (responseData.success) {
        setAllData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllSubCategory()
  }, [])

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchAllSubCategory()
        setOpenConfirmBoxDelete(false)
        setDeleteSubCategory({ _id: "" })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Filter subcategories by search
  const filteredSubCategories = allData.filter(subCat =>
    subCat.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleOnChange = (e) => {
    setSearch(e.target.value)
  }

  const handleView = (subCategory) => {
    setViewSubCategory(subCategory)
    setShowViewModal(true)
  }

  const openDeleteModal = (subCategory) => {
    setDeleteSubCategory(subCategory)
    setOpenConfirmBoxDelete(true)
  }

  const handleDelete = async () => {
    await handleDeleteSubCategory()
  }

  return (
    <div className=' min-h-screen p-4 sm:p-6'>
      {/* Main Content Container - White Background */}
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6'>
        {/* Header Section */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className="text-2xl font-semibold text-gray-800">All Sub Category</h1>
            <button 
              onClick={() => navigate('/dashboard/upload-subcategory')} 
              className='px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2'
            >
              <span className='text-lg font-bold'>+</span>
              <span>Add New</span>
            </button>
          </div>
          {/* Search Bar - Below action buttons */}
          <div className='flex items-center gap-2 justify-end'>
            <label className='text-sm text-gray-700 font-medium'>Search:</label>
            <div className='max-w-md bg-white px-4 flex items-center gap-3 py-2 rounded-lg border border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200'>
              <IoSearchOutline size={20} className='text-gray-400' />
              <input
                type='text'
                placeholder='Search subcategory...'
                className='h-full w-full outline-none bg-transparent text-sm'
                value={search}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-[#F3F3F3] border-b border-gray-200'>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Product Name</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Date</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Product Image</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Category</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Option</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">Loading...</td>
                </tr>
              ) : filteredSubCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">No subcategories found</td>
                </tr>
              ) : (
                filteredSubCategories.map((subCategory) => {
                  return (
                    <tr 
                      key={subCategory._id} 
                      className='hover:bg-gray-50 transition-colors'
                    >
                      <td className='p-4 text-center'>
                        <span className='font-medium text-gray-800'>
                          {subCategory.name || 'N/A'}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-gray-600'>
                          {formatDate(subCategory.createdAt)}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <div className='flex justify-center'>
                          <img 
                            src={subCategory.image || '/default.png'} 
                            alt={subCategory.name} 
                            className='w-12 h-12 object-cover rounded'
                          />
                        </div>
                      </td>
                      <td className='p-4 text-center'>
                        {subCategory.category && subCategory.category.length > 0 ? (
                          <div className='flex flex-wrap gap-2 justify-center'>
                            {subCategory.category.map((cat, index) => (
                              <span key={index} className='bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm'>
                                {typeof cat === 'object' ? cat.name : cat}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className='text-gray-500'>N/A</span>
                        )}
                      </td>
                      <td className='p-4 text-center'>
                        <div className='flex items-center justify-center gap-3'>
                          <button 
                            title='View' 
                            className='text-gray-400 hover:text-blue-600 transition-colors'
                            onClick={() => handleView(subCategory)}
                          >
                            <FaEye size={18} />
                          </button>
                          <button 
                            title='Edit' 
                            className='text-gray-400 hover:text-green-600 transition-colors'
                            onClick={() => {
                              setOpenEdit(true)
                              setEditData(subCategory)
                            }}
                          >
                            <TbEdit size={18} />
                          </button>
                          <button 
                            title='Delete' 
                            className='text-gray-400 hover:text-red-600 transition-colors'
                            onClick={() => openDeleteModal(subCategory)}
                          >
                            <FaRegTrashCan size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {
          loading && (
            <Loading/>
          )
        }

        {/* View SubCategory Modal */}
        {showViewModal && viewSubCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowViewModal(false)
            }
          }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">Chi tiết danh mục con</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh danh mục con</label>
                    <div className="flex justify-center">
                      {viewSubCategory.image ? (
                        <img
                          src={viewSubCategory.image}
                          alt={viewSubCategory.name}
                          className="w-full max-w-md h-auto object-contain rounded-lg border-2 border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Không có ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - SubCategory Info */}
                  <div className="space-y-4">
                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Tên danh mục con</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                        {viewSubCategory.name || 'N/A'}
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Danh mục</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                        {viewSubCategory.category && viewSubCategory.category.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {viewSubCategory.category.map((cat, index) => (
                              <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm">
                                {typeof cat === 'object' ? cat.name : cat}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Ngày tạo</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                        {formatDate(viewSubCategory.createdAt)}
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Ngày cập nhật</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                        {formatDate(viewSubCategory.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setShowViewModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {openConfirmBoxDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-lg font-semibold mb-4 text-red-600">Xác nhận xóa danh mục con</h2>
              <p className="text-gray-700 mb-2">Bạn có chắc chắn muốn xóa danh mục con này không?</p>
              {deleteSubCategory.name && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Danh mục con:</span> {deleteSubCategory.name}
                </p>
              )}
              <div className="flex gap-2 mt-6 justify-end">
                <button 
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg transition-colors font-medium" 
                  onClick={() => {
                    setOpenConfirmBoxDelete(false)
                    setDeleteSubCategory({ _id: "" })
                  }}
                >
                  Hủy
                </button>
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium" 
                  onClick={handleDelete}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {
          openEdit && (
            <EditSubCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchAllSubCategory}/>
          )
        }
      </div>
    </div>
  )
}

export default SubCategoryPage
