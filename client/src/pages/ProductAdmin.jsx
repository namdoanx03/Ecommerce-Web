import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { valideURLConvert } from '../utils/valideURLConvert'
import { DisplayPriceInVND } from '../utils/DisplayPriceInVND'

const ProductAdmin = () => {
  const [allProducts, setAllProducts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const limit = 10;
  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const navigate = useNavigate();

  // Lọc sản phẩm theo search (nếu có)
  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Tính số trang
  const totalPageCount = Math.ceil(filteredProducts.length / limit) || 1;

  // Lấy sản phẩm cho trang hiện tại
  const productData = filteredProducts.slice((page - 1) * limit, page * limit);

  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {} // Không truyền page/limit
      })
      if (response.data.success) {
        // Populate category nếu chưa có
        const productsWithCategory = response.data.data.map(p => ({
          ...p,
          categoryName: p.category && p.category[0] 
            ? (typeof p.category[0] === 'object' ? p.category[0].name : 'N/A')
            : 'N/A'
        }))
        setAllProducts(productsWithCategory)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return DisplayPriceInVND(amount || 0);
  };

  useEffect(() => {
    fetchAllProducts();
  }, [])

  const handleNext = () => {
    if (page < totalPageCount) {
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = () => {
    if (page > 1) {
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleDelete = async () => {
    if (!productIdToDelete) return;
    try {
      const res = await Axios({
        ...SummaryApi.deleteProduct,
        data: { _id: productIdToDelete }
      });
      if (res.data.success) {
        setAllProducts(prev => prev.filter(p => p._id !== productIdToDelete));
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setShowDeleteModal(false);
      setProductIdToDelete(null);
    }
  };

  const openDeleteModal = (productId) => {
    setProductIdToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const handleView = (product) => {
    setViewProduct(product);
    setShowViewModal(true);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const res = await Axios({
        ...SummaryApi.updateProductDetails,
        data: updatedProduct
      });
      if (res.data.success) {
        setAllProducts(prev =>
          prev.map(p => (p._id === updatedProduct._id ? { ...p, ...updatedProduct } : p))
        );
        setShowEditModal(false);
        setEditProduct(null);
      }
    } catch (err) {
      AxiosToastError(err);
    }
  };

// Upload ảnh lên Cloudinary trước
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await Axios({
        ...SummaryApi.uploadImage, // POST /api/file/upload
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Nếu upload thành công, lấy URL ảnh và cập nhật vào state
      if (res.data && res.data.data && res.data.data.url) {
        setEditProduct(prev => ({
          ...prev,
          image: [res.data.data.url] // chỉ lấy 1 ảnh đầu tiên
        }));
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className=' min-h-screen p-4 sm:p-6'>
      {/* Main Content Container - White Background */}
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6'>
        {/* Header Section */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className="text-2xl font-semibold text-gray-800">Danh sách sản phẩm</h1>
            <div className='flex items-center gap-3'>
              <button className='px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors'>
                Nhập
              </button>
              <button className='px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors'>
                Xuất
              </button>
              <Link to="/dashboard/upload-product">
                <button className='px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
                  Thêm sản phẩm
                </button>
              </Link>
            </div>
          </div>
          {/* Search Bar - Below action buttons */}
          <div className='flex items-center gap-2 justify-end'>
            <label className='text-sm text-gray-700 font-medium'>Tìm kiếm:</label>
            <div className='max-w-md bg-white px-4 flex items-center gap-3 py-2 rounded-lg border border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200'>
              <IoSearchOutline size={20} className='text-gray-400' />
              <input
                type='text'
                placeholder='Tìm kiếm sản phẩm...'
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
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Ảnh sản phẩm</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider max-w-[200px]'>Tên sản phẩm</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Danh mục</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Số lượng</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Giá</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Giá sau giảm</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Tùy chọn</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : productData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">Không tìm thấy sản phẩm</td>
                </tr>
              ) : (
                productData.map((p) => {
                  const originalPrice = p.price || 0;
                  const discountPrice = p.price && p.discount 
                    ? p.price - (p.price * p.discount / 100)
                    : p.price || 0;
                  
                  return (
                    <tr key={p._id} className='hover:bg-gray-50 transition-colors'>
                      <td className='p-4 text-center'>
                        <div className='flex justify-center'>
                          <img 
                            src={p.image && p.image[0] ? p.image[0] : '/default.png'} 
                            alt={p.name} 
                            className='w-12 h-12 object-cover rounded'
                          />
                        </div>
                      </td>
                      <td className='p-4 max-w-[200px] text-center'>
                        <span className='font-medium text-gray-800 truncate block' title={p.name || 'N/A'}>
                          {p.name || 'N/A'}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-blue-600 hover:text-blue-800 cursor-pointer font-medium'>
                          {p.categoryName || 'N/A'}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className={`font-medium ${(p.stock || 0) < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                          {p.stock || 0}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-gray-700 font-medium'>{formatCurrency(originalPrice)}</span>
                      </td>
                      <td className='p-4 text-center'>
                        <span className='text-gray-700 font-medium text-teal-600'>{formatCurrency(discountPrice)}</span>
                      </td>
                      <td className='p-4 text-center'>
                        <div className='flex items-center justify-center gap-3'>
                          <button 
                            title='Xem' 
                            className='text-gray-400 hover:text-blue-600 transition-colors'
                            onClick={() => handleView(p)}
                          >
                            <FaEye size={18} />
                          </button>
                          <button 
                            title='Sửa' 
                            className='text-gray-400 hover:text-green-600 transition-colors'
                            onClick={() => handleEdit(p)}
                          >
                            <TbEdit size={18} />
                          </button>
                          <button 
                            title='Xóa' 
                            className='text-gray-400 hover:text-red-600 transition-colors'
                            onClick={() => openDeleteModal(p._id)}
                          >
                            <FaRegTrashCan size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-4 border-t border-gray-200 mt-4'>
          <span className='text-gray-600 text-sm'>
            {`Hiển thị ${(page - 1) * limit + 1} đến ${Math.min(page * limit, filteredProducts.length)} trong tổng số ${filteredProducts.length} kết quả`}
          </span>
          <div className='flex items-center gap-1 rounded-lg border border-gray-300 bg-white'>
            <button 
              onClick={handlePrevious} 
              disabled={page === 1} 
              className={`px-3 py-1.5 rounded-l-lg transition-colors ${
                page === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              &lt;
            </button>
            {Array.from({ length: totalPageCount }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1.5 transition-colors ${
                  page === i + 1 
                    ? 'bg-teal-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={handleNext} 
              disabled={page === totalPageCount} 
              className={`px-3 py-1.5 rounded-r-lg transition-colors ${
                page === totalPageCount 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      {showEditModal && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEditModal(false)
          }
        }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">Sửa sản phẩm</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh sản phẩm</label>
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    <img
                      src={editProduct.image && editProduct.image[0] ? editProduct.image[0] : '/default.png'}
                      alt="Ảnh sản phẩm"
                      className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                    />
                  </div>
                  <label className="cursor-pointer">
                    <div className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium inline-flex items-center gap-2">
                      <span>Chọn tệp</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                    />
                  </label>
                  {uploadingImage && (
                    <span className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                      <span className="animate-spin">⏳</span>
                      Đang tải ảnh...
                    </span>
                  )}
                  {editProduct.image && editProduct.image[0] && (
                    <span className="text-xs text-gray-500 mt-2 truncate max-w-xs">
                      {editProduct.image[0].split('/').pop()}
                    </span>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <label htmlFor="edit-name" className="text-sm font-medium text-gray-700">Tên sản phẩm</label>
                  <input
                    id="edit-name"
                    type="text"
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors"
                    value={editProduct.name || ''}
                    onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="grid gap-1">
                    <label htmlFor="edit-price" className="text-sm font-medium text-gray-700">Giá bán</label>
                    <input
                      id="edit-price"
                      type="number"
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors"
                      value={editProduct.price || 0}
                      onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="edit-discount" className="text-sm font-medium text-gray-700">Giảm giá (%)</label>
                    <input
                      id="edit-discount"
                      type="number"
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors"
                      value={editProduct.discount || 0}
                      onChange={e => setEditProduct({ ...editProduct, discount: Number(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="edit-stock" className="text-sm font-medium text-gray-700">Số lượng trong kho</label>
                    <input
                      id="edit-stock"
                      type="number"
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors"
                      value={editProduct.stock || 0}
                      onChange={e => setEditProduct({ ...editProduct, stock: Number(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={() => setShowEditModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                onClick={() => handleUpdateProduct(editProduct)}
                disabled={uploadingImage}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
      {showViewModal && viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowViewModal(false)
          }
        }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">Chi tiết sản phẩm</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh sản phẩm</label>
                  <div className="flex justify-center">
                    {viewProduct.image && viewProduct.image[0] ? (
                      <img
                        src={viewProduct.image[0]}
                        alt={viewProduct.name}
                        className="w-full max-w-md h-auto object-contain rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Không có ảnh</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Product Info */}
                <div className="space-y-4">
                  <div className="grid gap-1">
                    <label className="text-sm font-medium text-gray-700">Tên sản phẩm</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                      {viewProduct.name || 'N/A'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Giá bán</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium">
                        {formatCurrency(viewProduct.price || 0)}
                      </div>
                    </div>
                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-gray-700">Giảm giá (%)</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 font-medium">
                        {viewProduct.discount || 0}%
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-medium text-gray-700">Giá sau khi giảm giá</label>
                    <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-2.5 text-teal-700 font-semibold text-lg">
                      {formatCurrency(
                        viewProduct.price && viewProduct.discount
                          ? viewProduct.price - (viewProduct.price * viewProduct.discount / 100)
                          : viewProduct.price || 0
                      )}
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-medium text-gray-700">Số lượng tồn kho</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                      {viewProduct.stock || 0}
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-medium text-gray-700">Danh mục</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                      {viewProduct.category && viewProduct.category.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {viewProduct.category.map((cat, index) => (
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
                    <label className="text-sm font-medium text-gray-700">Danh mục con</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                      {viewProduct.subCategory && viewProduct.subCategory.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {viewProduct.subCategory.map((subCat, index) => (
                            <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">
                              {typeof subCat === 'object' ? subCat.name : subCat}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 grid gap-1">
                <label className="text-sm font-medium text-gray-700">Mô tả</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 whitespace-pre-wrap min-h-[100px]">
                  {viewProduct.description || 'Không có mô tả'}
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

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-[350px]">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Xác nhận xóa sản phẩm</h2>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            <div className="flex gap-2 mt-6 justify-end">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowDeleteModal(false)}>Hủy</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductAdmin
