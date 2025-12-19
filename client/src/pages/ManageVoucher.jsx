import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'

const ManageVoucher = () => {
  const navigate = useNavigate()
  const [voucherData, setVoucherData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [totalCount, setTotalCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [voucherToDelete, setVoucherToDelete] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editVoucher, setEditVoucher] = useState(null)
  const [editData, setEditData] = useState({
    _id: "",
    code: "",
    name: "",
    description: "",
    discount_type: "PERCENTAGE",
    discount_value: "",
    min_purchase_amount: "",
    max_discount_amount: "",
    start_date: "",
    end_date: "",
    usage_limit: "",
    status: "ACTIVE"
  })

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
  }

  const fetchVoucherData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getVouchers
      })

      const { data: responseData } = response

      if (responseData.success) {
        let filteredData = responseData.data || []
        
        // Filter by search
        if (search) {
          filteredData = filteredData.filter(voucher => 
            voucher.code?.toLowerCase().includes(search.toLowerCase()) ||
            voucher.name?.toLowerCase().includes(search.toLowerCase()) ||
            voucher.description?.toLowerCase().includes(search.toLowerCase())
          )
        }
        
        // Filter by status
        if (statusFilter !== "ALL") {
          filteredData = filteredData.filter(voucher => {
            const expired = isExpired(voucher.end_date)
            const status = expired ? 'EXPIRED' : voucher.status
            return status === statusFilter
          })
        }
        
        const limit = 10
        const totalCount = filteredData.length
        const totalPageCount = Math.ceil(totalCount / limit) || 1
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedData = filteredData.slice(startIndex, endIndex)
        
        setTotalPageCount(totalPageCount)
        setVoucherData(paginatedData)
        setTotalCount(totalCount)
      } else {
        setVoucherData([])
        setTotalCount(0)
        setTotalPageCount(1)
      }

    } catch (error) {
      console.error('Error fetching vouchers:', error)
      AxiosToastError(error)
      setVoucherData([])
      setTotalCount(0)
      setTotalPageCount(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVoucherData()
  }, [page, search, statusFilter])

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage(preve => preve + 1)
    }
  }

  const handlePrevious = () => {
    if (page > 1) {
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  const handleStatusFilterChange = (e) => {
    const { value } = e.target
    setStatusFilter(value)
    setPage(1)
  }

  const handleDelete = async () => {
    if (!voucherToDelete) return

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.deleteVoucher,
        data: {
          _id: voucherToDelete._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success('Xóa voucher thành công')
        setShowDeleteModal(false)
        setVoucherToDelete(null)
        fetchVoucherData()
      } else {
        toast.error(responseData.message || 'Không thể xóa voucher')
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (voucher) => {
    // Format dates for datetime-local input
    const formatDateTimeLocal = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    setEditVoucher(voucher)
    setEditData({
      _id: voucher._id,
      code: voucher.code || "",
      name: voucher.name || "",
      description: voucher.description || "",
      discount_type: voucher.discount_type || "PERCENTAGE",
      discount_value: voucher.discount_value || "",
      min_purchase_amount: voucher.min_purchase_amount || "",
      max_discount_amount: voucher.max_discount_amount || "",
      start_date: formatDateTimeLocal(voucher.start_date),
      end_date: formatDateTimeLocal(voucher.end_date),
      usage_limit: voucher.usage_limit || "",
      status: voucher.status || "ACTIVE"
    })
    setShowEditModal(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    // Validation
    if (!editData.code || !editData.name || !editData.discount_value || !editData.start_date || !editData.end_date) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc')
      return
    }

    if (editData.discount_type === 'PERCENTAGE' && (editData.discount_value < 0 || editData.discount_value > 100)) {
      toast.error('Giá trị giảm giá phần trăm phải từ 0 đến 100')
      return
    }

    if (editData.discount_type === 'FIXED_AMOUNT' && editData.discount_value < 0) {
      toast.error('Giá trị giảm giá cố định phải lớn hơn 0')
      return
    }

    const startDate = new Date(editData.start_date)
    const endDate = new Date(editData.end_date)
    if (endDate <= startDate) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu')
      return
    }

    try {
      setLoading(true)
      const updateData = {
        _id: editData._id,
        code: editData.code,
        name: editData.name,
        description: editData.description || "",
        discount_type: editData.discount_type,
        discount_value: Number(editData.discount_value),
        min_purchase_amount: editData.min_purchase_amount ? Number(editData.min_purchase_amount) : 0,
        max_discount_amount: editData.max_discount_amount ? Number(editData.max_discount_amount) : null,
        start_date: editData.start_date,
        end_date: editData.end_date,
        usage_limit: editData.usage_limit ? Number(editData.usage_limit) : null,
        status: editData.status
      }

      const response = await Axios({
        ...SummaryApi.updateVoucher,
        data: updateData
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success('Cập nhật voucher thành công')
        setShowEditModal(false)
        setEditVoucher(null)
        fetchVoucherData()
      } else {
        toast.error(responseData.message || 'Không thể cập nhật voucher')
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700'
      case 'EXPIRED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động'
      case 'INACTIVE':
        return 'Không hoạt động'
      case 'EXPIRED':
        return 'Đã hết hạn'
      default:
        return status
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <div className='bg-white rounded-lg shadow-sm p-6 sm:p-8'>
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className="text-2xl font-semibold text-gray-800">Quản lý Voucher</h1>
            <div className='flex items-center gap-3'>
              <div className='max-w-md bg-white px-4 flex items-center gap-3 py-2 rounded-lg border border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200'>
                <IoSearchOutline size={20} className='text-gray-400' />
                <input
                  type='text'
                  placeholder='Tìm kiếm voucher...'
                  className='h-full w-full outline-none bg-transparent text-sm'
                  value={search}
                  onChange={handleOnChange}
                />
              </div>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className='px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-medium text-gray-700'
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
                <option value="EXPIRED">Đã hết hạn</option>
              </select>
              <button
                onClick={() => navigate('/dashboard/add-voucher')}
                className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium'
              >
                Thêm Voucher
              </button>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-[#F3F3F3] border-b border-gray-200'>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Mã Voucher</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Tên</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Loại giảm giá</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Giá trị</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Ngày bắt đầu</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Ngày kết thúc</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Đã sử dụng</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Trạng thái</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Tùy chọn</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : voucherData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">Không tìm thấy voucher</td>
                </tr>
              ) : (
                voucherData.map((voucher) => {
                  const expired = isExpired(voucher.end_date)
                  const status = expired ? 'EXPIRED' : voucher.status

                  return (
                    <tr
                      key={voucher._id}
                      className='hover:bg-gray-50 transition-colors'
                    >
                      <td className='p-4 text-center'>
                        <span className='font-medium text-gray-800'>
                          {voucher.code || 'N/A'}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-gray-600'>
                          {voucher.name || 'N/A'}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-gray-600'>
                          {voucher.discount_type === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định'}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='font-medium text-gray-800'>
                          {voucher.discount_type === 'PERCENTAGE' 
                            ? `${voucher.discount_value}%`
                            : DisplayPriceInVND(voucher.discount_value || 0)
                          }
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-gray-600'>
                          {formatDate(voucher.start_date)}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-gray-600'>
                          {formatDate(voucher.end_date)}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-gray-600'>
                          {voucher.used_count || 0} / {voucher.usage_limit || '∞'}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <div className='flex items-center justify-center gap-3'>
                          <button
                            title='Sửa'
                            className='text-gray-400 hover:text-yellow-600 transition-colors'
                            onClick={() => handleEdit(voucher)}
                          >
                            <TbEdit size={18} />
                          </button>
                          <button
                            title='Xóa'
                            className='text-gray-400 hover:text-red-600 transition-colors'
                            onClick={() => {
                              setVoucherToDelete(voucher)
                              setShowDeleteModal(true)
                            }}
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

        {loading && <Loading />}

        {totalCount > 10 && (
          <div className='flex items-center justify-between px-2 mt-8'>
            <span className='text-gray-600 text-sm'>
              {`Hiển thị ${(page - 1) * 10 + 1} đến ${Math.min(page * 10, totalCount)} trong tổng số ${totalCount} kết quả`}
            </span>
            <div className='flex items-center gap-1 rounded-lg border bg-white'>
              <button onClick={handlePrevious} disabled={page === 1} className={`px-2 py-1 rounded-l-lg ${page === 1 ? 'text-gray-300' : 'text-blue-500 hover:bg-blue-50'}`}>&lt;</button>
              {Array.from({ length: totalPageCount }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 ${page === i + 1 ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={handleNext} disabled={page === totalPageCount} className={`px-2 py-1 rounded-r-lg ${page === totalPageCount ? 'text-gray-300' : 'text-blue-500 hover:bg-blue-50'}`}>&gt;</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold mb-4'>Xác nhận xóa</h3>
            <p className='text-gray-600 mb-6'>
              Bạn có chắc chắn muốn xóa voucher <strong>{voucherToDelete?.code}</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setVoucherToDelete(null)
                }}
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editVoucher && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto py-8'>
          <div className='bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8'>
            <h3 className='text-2xl font-semibold mb-6 text-gray-800'>Chỉnh sửa Voucher</h3>
            
            <form className='space-y-6' onSubmit={handleUpdate}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='grid gap-1'>
                  <label htmlFor='edit_code' className='font-medium text-gray-700'>Mã Voucher <span className='text-red-500'>*</span></label>
                  <input
                    id='edit_code'
                    type='text'
                    placeholder='Nhập mã voucher'
                    name='code'
                    value={editData.code}
                    onChange={handleEditChange}
                    required
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='edit_name' className='font-medium text-gray-700'>Tên Voucher <span className='text-red-500'>*</span></label>
                  <input
                    id='edit_name'
                    type='text'
                    placeholder='Nhập tên voucher'
                    name='name'
                    value={editData.name}
                    onChange={handleEditChange}
                    required
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1 md:col-span-2'>
                  <label htmlFor='edit_description' className='font-medium text-gray-700'>Mô tả</label>
                  <textarea
                    id='edit_description'
                    placeholder='Nhập mô tả voucher'
                    name='description'
                    value={editData.description}
                    onChange={handleEditChange}
                    rows={3}
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='edit_discount_type' className='font-medium text-gray-700'>Loại giảm giá <span className='text-red-500'>*</span></label>
                  <select
                    id='edit_discount_type'
                    name='discount_type'
                    value={editData.discount_type}
                    onChange={handleEditChange}
                    required
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED_AMOUNT">Số tiền cố định (₫)</option>
                  </select>
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='edit_discount_value' className='font-medium text-gray-700'>Giá trị giảm giá <span className='text-red-500'>*</span></label>
                  <input
                    id='edit_discount_value'
                    type='number'
                    placeholder={editData.discount_type === 'PERCENTAGE' ? '0-100' : 'Nhập số tiền'}
                    name='discount_value'
                    value={editData.discount_value}
                    onChange={handleEditChange}
                    required
                    min={0}
                    max={editData.discount_type === 'PERCENTAGE' ? 100 : undefined}
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='edit_min_purchase_amount' className='font-medium text-gray-700'>Giá trị đơn hàng tối thiểu (₫)</label>
                  <input
                    id='edit_min_purchase_amount'
                    type='number'
                    placeholder='0'
                    name='min_purchase_amount'
                    value={editData.min_purchase_amount}
                    onChange={handleEditChange}
                    min={0}
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='edit_max_discount_amount' className='font-medium text-gray-700'>Giảm giá tối đa (₫)</label>
                  <input
                    id='edit_max_discount_amount'
                    type='number'
                    placeholder='Không giới hạn'
                    name='max_discount_amount'
                    value={editData.max_discount_amount}
                    onChange={handleEditChange}
                    min={0}
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='edit_start_date' className='font-medium text-gray-700'>Ngày bắt đầu <span className='text-red-500'>*</span></label>
                  <input
                    id='edit_start_date'
                    type='datetime-local'
                    name='start_date'
                    value={editData.start_date}
                    onChange={handleEditChange}
                    required
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='edit_end_date' className='font-medium text-gray-700'>Ngày kết thúc <span className='text-red-500'>*</span></label>
                  <input
                    id='edit_end_date'
                    type='datetime-local'
                    name='end_date'
                    value={editData.end_date}
                    onChange={handleEditChange}
                    required
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='edit_usage_limit' className='font-medium text-gray-700'>Giới hạn sử dụng</label>
                  <input
                    id='edit_usage_limit'
                    type='number'
                    placeholder='Không giới hạn'
                    name='usage_limit'
                    value={editData.usage_limit}
                    onChange={handleEditChange}
                    min={1}
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='edit_status' className='font-medium text-gray-700'>Trạng thái</label>
                  <select
                    id='edit_status'
                    name='status'
                    value={editData.status}
                    onChange={handleEditChange}
                    className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
                  >
                    <option value="ACTIVE">Đang hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </select>
                </div>
              </div>

              <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
                <button
                  type='button'
                  onClick={() => {
                    setShowEditModal(false)
                    setEditVoucher(null)
                  }}
                  className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
                >
                  Hủy
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className={`${
                    loading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700'
                  } text-white py-2 px-6 rounded-lg font-semibold transition-colors`}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageVoucher

