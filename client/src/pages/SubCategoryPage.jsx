import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { LuPencil } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import EditSubCategory from '../components/EditSubCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL, setImageURL] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [totalCount, setTotalCount] = useState(0);

  const [editData, setEditData] = useState({
    _id: ""
  })
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)


  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSubCategory,
        params: {
          page,
          limit: 10
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        setData(responseData.data)
        setTotalCount(responseData.totalCount)
        setTotalPageCount(responseData.totalNoPage)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }
  

  useEffect(() => {
    fetchSubCategory()
  }, [page])

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }


  const column = [
    columnHelper.display({
      id: 'stt',
      header: 'Sr.No',
      cell: ({ row }) => (page - 1) * 10 + row.index + 1
    }),
    
    columnHelper.accessor('name', {
      header: "Name"
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => {
        return <div className='flex justify-center items-center'>
          <img
            src={row.original.image}
            alt={row.original.name}
            className='w-8 h-8 cursor-pointer'
            onClick={() => {
              setImageURL(row.original.image)
            }}
          />
        </div>
      }
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {
              row.original.category.map((c, index) => {
                return (
                  <p key={c._id + "table"} className='shadow-md px-1 inline-block'>{c.name}</p>
                )
              })
            }
          </>
        )
      }
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-center gap-3'>
            <button onClick={() => {
              setOpenEdit(true)
              setEditData(row.original)
            }} className='p-2 bg-green-100 rounded-full hover:text-green-600'>
              <HiPencil size={20} />
            </button>
            <button onClick={() => {
              setOpenDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }} className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'>
              <MdDelete size={20} />
            </button>
          </div>
        )
      }
    })
  ]

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({ _id: "" })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='bg-[#F8F8F8] py-4'>
      <div>
        <div className='px-6 py-1 flex items-center justify-between '>
          <h1 className=" text-2xl font-semibold text-black ">Danh mục con</h1>
          <button onClick={() => setOpenAddSubCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'>Add Sub Category</button>
        </div>

        <div className='overflow-auto w-full px-4 max-w-[95vw]'>
          <DisplayTable
            data={data}
            column={column}
          />
        </div>
        {
          openAddSubCategory && (
            <UploadSubCategoryModel
              close={() => setOpenAddSubCategory(false)}
              fetchData={fetchSubCategory}
            />
          )
        }

        {
          ImageURL &&
          <ViewImage url={ImageURL} close={() => setImageURL("")} />
        }

        {
          openEdit &&
          <EditSubCategory
            data={editData}
            close={() => setOpenEdit(false)}
            fetchData={fetchSubCategory}
          />
        }

        {
          openDeleteConfirmBox && (
            <CofirmBox
              cancel={() => setOpenDeleteConfirmBox(false)}
              close={() => setOpenDeleteConfirmBox(false)}
              confirm={handleDeleteSubCategory}
            />
          )
        }
      </div>
      <div className='flex items-center justify-between px-10 '>
        <span className='text-gray-600 text-sm'>
          {`Showing ${(page - 1) * 10 + 1} to ${Math.min(page * 10, totalCount)} of ${totalCount} results`}
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
    </section>
  )
}

export default SubCategoryPage
