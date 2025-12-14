import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
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
            <h1 className="text-2xl font-semibold text-gray-800">Products List</h1>
            <div className='flex items-center gap-3'>
              <button className='px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors'>
                Import
              </button>
              <button className='px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors'>
                Export
              </button>
              <Link to="/dashboard/upload-product">
                <button className='px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
                  Add Product
                </button>
              </Link>
            </div>
          </div>
          {/* Search Bar - Below action buttons */}
          <div className='flex items-center gap-2 justify-end'>
            <label className='text-sm text-gray-700 font-medium'>Search:</label>
            <div className='max-w-md bg-white px-4 flex items-center gap-3 py-2 rounded-lg border border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200'>
              <IoSearchOutline size={20} className='text-gray-400' />
              <input
                type='text'
                placeholder='Search product...'
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
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Product Image</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider max-w-[200px]'>Product Name</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Category</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Current Qty</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Price</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Price After Discount</th>
                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Option</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">Loading...</td>
                </tr>
              ) : productData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">No products found</td>
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
                        <span className='text-gray-700'>{p.stock || 0}</span>
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
                            title='View' 
                            className='text-gray-400 hover:text-blue-600 transition-colors'
                            onClick={() => navigate(`/product/${p._id}`)}
                          >
                            <FaEye size={18} />
                          </button>
                          <button 
                            title='Edit' 
                            className='text-gray-400 hover:text-green-600 transition-colors'
                            onClick={() => handleEdit(p)}
                          >
                            <TbEdit size={18} />
                          </button>
                          <button 
                            title='Delete' 
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
            {`Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, filteredProducts.length)} of ${filteredProducts.length} results`}
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Sửa sản phẩm</h2>
            <div className="mb-2 flex flex-col items-center">
              <img
                src={editProduct.image && editProduct.image[0] ? editProduct.image[0] : '/default.png'}
                alt="Ảnh sản phẩm"
                className="w-24 h-24 object-contain rounded mb-2 border"
              />
              <label className="block">
                <span className="sr-only">Chọn ảnh mới</span>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                />
              </label>
              {uploadingImage && <span className="text-xs text-blue-500 mt-1">Đang tải ảnh...</span>}
            </div>
            <input
              className="border p-2 w-full mb-2"
              value={editProduct.name}
              onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
              placeholder="Tên sản phẩm"
            />
            <input
              className="border p-2 w-full mb-2"
              value={editProduct.price}
              type="number"
              onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
              placeholder="Giá bán"
            />
            <input
              className="border p-2 w-full mb-2"
              value={editProduct.discount}
              type="number"
              onChange={e => setEditProduct({ ...editProduct, discount: Number(e.target.value) })}
              placeholder="Giảm giá (%)"
            />
            <input
              className="border p-2 w-full mb-2"
              value={editProduct.stock}
              type="number"
              onChange={e => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
              placeholder="Số lượng trong kho"
            />
            <div className="flex gap-2 mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleUpdateProduct(editProduct)} disabled={uploadingImage}>Lưu</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowEditModal(false)}>Hủy</button>
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
