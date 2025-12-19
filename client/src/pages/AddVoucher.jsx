import React, { useState } from 'react'
import Loading from '../components/Loading';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate } from 'react-router-dom';

const AddVoucher = () => {
  const [data, setData] = useState({
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
  const [loading, setLoading] = useState(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!data.code || !data.name || !data.discount_value || !data.start_date || !data.end_date) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc')
      return
    }

    if (data.discount_type === 'PERCENTAGE' && (data.discount_value < 0 || data.discount_value > 100)) {
      toast.error('Giá trị giảm giá phần trăm phải từ 0 đến 100')
      return
    }

    if (data.discount_type === 'FIXED_AMOUNT' && data.discount_value < 0) {
      toast.error('Giá trị giảm giá cố định phải lớn hơn 0')
      return
    }

    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)
    if (endDate <= startDate) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu')
      return
    }

    try {
      setLoading(true)
      const submitData = {
        ...data,
        discount_value: Number(data.discount_value),
        min_purchase_amount: data.min_purchase_amount ? Number(data.min_purchase_amount) : 0,
        max_discount_amount: data.max_discount_amount ? Number(data.max_discount_amount) : null,
        usage_limit: data.usage_limit ? Number(data.usage_limit) : null
      }

      const response = await Axios({
        ...SummaryApi.createVoucher,
        data: submitData
      })
      const { data: responseData } = response

      if (responseData.success) {
        toast.success('Tạo voucher thành công')
        navigate('/dashboard/voucher')
      } else {
        toast.error(responseData.message || 'Không thể tạo voucher')
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <div className='bg-white rounded-lg shadow-sm p-6 sm:p-8 max-w-4xl mx-auto'>
        <div className='mb-6'>
          <h1 className="text-2xl font-semibold text-gray-800">Thêm Voucher Mới</h1>
        </div>

        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='grid gap-1'>
              <label htmlFor='code' className='font-medium text-gray-700'>Mã Voucher <span className='text-red-500'>*</span></label>
              <input
                id='code'
                type='text'
                placeholder='Nhập mã voucher'
                name='code'
                value={data.code}
                onChange={handleChange}
                required
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              />
            </div>

            <div className='grid gap-1'>
              <label htmlFor='name' className='font-medium text-gray-700'>Tên Voucher <span className='text-red-500'>*</span></label>
              <input
                id='name'
                type='text'
                placeholder='Nhập tên voucher'
                name='name'
                value={data.name}
                onChange={handleChange}
                required
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              />
            </div>

            <div className='grid gap-1 md:col-span-2'>
              <label htmlFor='description' className='font-medium text-gray-700'>Mô tả</label>
              <textarea
                id='description'
                placeholder='Nhập mô tả voucher'
                name='description'
                value={data.description}
                onChange={handleChange}
                rows={3}
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              />
            </div>

            <div className='grid gap-1'>
              <label htmlFor='discount_type' className='font-medium text-gray-700'>Loại giảm giá <span className='text-red-500'>*</span></label>
              <select
                id='discount_type'
                name='discount_type'
                value={data.discount_type}
                onChange={handleChange}
                required
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              >
                <option value="PERCENTAGE">Phần trăm (%)</option>
                <option value="FIXED_AMOUNT">Số tiền cố định (₫)</option>
              </select>
            </div>

            <div className='grid gap-1'>
              <label htmlFor='discount_value' className='font-medium text-gray-700'>Giá trị giảm giá <span className='text-red-500'>*</span></label>
              <input
                id='discount_value'
                type='number'
                placeholder={data.discount_type === 'PERCENTAGE' ? '0-100' : 'Nhập số tiền'}
                name='discount_value'
                value={data.discount_value}
                onChange={handleChange}
                required
                min={0}
                max={data.discount_type === 'PERCENTAGE' ? 100 : undefined}
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              />
            </div>

            <div className='grid gap-1'>
              <label htmlFor='min_purchase_amount' className='font-medium text-gray-700'>Giá trị đơn hàng tối thiểu (₫)</label>
              <input
                id='min_purchase_amount'
                type='number'
                placeholder='0'
                name='min_purchase_amount'
                value={data.min_purchase_amount}
                onChange={handleChange}
                min={0}
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              />
            </div>

            <div className='grid gap-1'>
              <label htmlFor='max_discount_amount' className='font-medium text-gray-700'>Giảm giá tối đa (₫)</label>
              <input
                id='max_discount_amount'
                type='number'
                placeholder='Không giới hạn'
                name='max_discount_amount'
                value={data.max_discount_amount}
                onChange={handleChange}
                min={0}
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              />
            </div>

            <div className='grid gap-1'>
              <label htmlFor='start_date' className='font-medium text-gray-700'>Ngày bắt đầu <span className='text-red-500'>*</span></label>
              <input
                id='start_date'
                type='datetime-local'
                name='start_date'
                value={data.start_date}
                onChange={handleChange}
                required
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              />
            </div>

            <div className='grid gap-1'>
              <label htmlFor='end_date' className='font-medium text-gray-700'>Ngày kết thúc <span className='text-red-500'>*</span></label>
              <input
                id='end_date'
                type='datetime-local'
                name='end_date'
                value={data.end_date}
                onChange={handleChange}
                required
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              />
            </div>

            <div className='grid gap-1'>
              <label htmlFor='usage_limit' className='font-medium text-gray-700'>Giới hạn sử dụng</label>
              <input
                id='usage_limit'
                type='number'
                placeholder='Không giới hạn'
                name='usage_limit'
                value={data.usage_limit}
                onChange={handleChange}
                min={1}
                className='bg-white p-2 outline-none border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg'
              />
            </div>

            <div className='grid gap-1'>
              <label htmlFor='status' className='font-medium text-gray-700'>Trạng thái</label>
              <select
                id='status'
                name='status'
                value={data.status}
                onChange={handleChange}
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
              onClick={() => navigate('/dashboard/voucher')}
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
              {loading ? 'Đang tạo...' : 'Tạo Voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddVoucher

