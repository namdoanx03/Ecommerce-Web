import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
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
        setAllProducts(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

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
    <div className=''>
      <div className='dashboard px-2 bg-[#F8F8F8] min-h-[88vh] sticky top-0'>
        <div className='flex items-center justify-between pt-3 p-4'>
          <h1 className=" text-2xl font-semibold text-black ">Danh sách sản phẩm</h1>
          <div className=' bg-blue-50 px-4 flex items-center gap-3 py-2 rounded  border focus-within:border-primary-200'>
            <IoSearchOutline size={25} className='text-primary-200 ' />
            <input
              type='text'
              placeholder='Search product here ...'
              className='h-full w-full  outline-none bg-transparent'
              value={search}
              onChange={handleOnChange}
            />
          </div>
        </div>
        <div className="card-item flex flex-wrap gap-6 px-6 mt-2 pb-14">
          <div className=''>
            <div className='bg-white rounded-xl shadow'>

              <table className=' text-sm w-[75vw] '>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='p-2'>ID</th>
                    <th className='p-2'>TÊN</th>
                    <th className='p-2'>ẢNH</th>
                    <th className='p-2'>GIÁ BÁN</th>
                    <th className='p-2'>GIÁ SAU KHI GIẢM</th>
                    <th className='p-2'>SỐ LƯỢNG TRONG KHO</th>
                    <th className='p-2'>ĐÃ BÁN</th>
                    <th className='p-2'>CHỨC NĂNG</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500">Không có sản phẩm nào</td>
                    </tr>
                  ) : (
                    productData.map((p, index) => (
                      <tr key={p._id} className='bg-white border-b hover:bg-gray-50'>
                        <td className='py-2 px-4 truncate'>{p._id}</td>
                        <td className='py-2 px-4 max-w-[200px] truncate'>{p.name}</td>
                        <td className='py-2 px-2'>
                          <img src={p.image && p.image[0] ? p.image[0] : '/default.png'} alt={p.name} className='w-14 h-14 object-contain rounded' />
                        </td>
                        <td className='py-2 px-2'>{p.price?.toLocaleString()} đ</td>
                        <td className='py-2 px-10'>
                          {p.price
                            ? (p.discount
                              ? (p.price - (p.price * p.discount / 100)).toLocaleString()
                              : p.price.toLocaleString())
                            : 0} đ
                        </td>
                        <td className='py-2 px-2 items-center justify-center flex'>{p.stock}</td>
                        <td className='py-2 px-8'>{p.sold || 0}</td>
                        <td className='px-2 flex gap-4 items-center justify-center py-6 text-base'>
                          <button title='Sửa' className='text-green-400 hover:text-green-600' onClick={() => handleEdit(p)}><TbEdit /></button>
                          <button title='Xóa' className='text-red-400 hover:text-red-600' onClick={() => openDeleteModal(p._id)}><FaRegTrashCan /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

            </div>
            <div className='flex items-center justify-between px-2  mt-8'>
              <span className='text-gray-600 text-sm'>
                {`Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, filteredProducts.length)} of ${filteredProducts.length} results`}
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
