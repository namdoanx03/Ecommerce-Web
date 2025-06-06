import React, { useEffect, useState, useRef } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage,setIsSearchPage] = useState(false)
    const [ isMobile ] = useMobile()
    const params = useLocation()
    const searchText = params.search ? params.search.slice(3) : ""
    const [searchValue, setSearchValue] = useState(searchText)
    const [showDropdown, setShowDropdown] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const inputRef = useRef(null)
    const dropdownRef = useRef(null)

    useEffect(()=>{
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    },[location])

    // Fetch suggestions when input changes
    useEffect(() => {
        if (searchValue.trim().length > 0) {
            fetchSuggestions(searchValue)
        } else {
            setSuggestions([])
            setShowDropdown(false)
        }
    }, [searchValue])

    // Hide dropdown when click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const fetchSuggestions = async (keyword) => {
        try {
            const response = await Axios({
                ...SummaryApi.searchProduct,
                data: { search: keyword, page: 1, limit: 8 }
            })
            if (response.data && response.data.success) {
                setSuggestions(response.data.data)
                setShowDropdown(true)
            } else {
                setSuggestions([])
                setShowDropdown(false)
            }
        } catch (error) {
            setSuggestions([])
            setShowDropdown(false)
        }
    }

    const handleOnChange = (e)=>{
        const value = e.target.value
        setSearchValue(value)
        // setShowDropdown(true) // sẽ được bật khi fetchSuggestions thành công
    }

    const handleInputFocus = () => {
        if (searchValue.trim().length > 0 && suggestions.length > 0) {
            setShowDropdown(true)
        }
    }

    const handleSuggestionClick = (product) => {
        setShowDropdown(false)
        setSearchValue(product.name)
        navigate(`/product/${product.name.replace(/\s+/g, '-')}-${product._id}`)
    }

    const handleSearch = () => {
        if (searchValue.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`)
            setShowDropdown(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className='relative w-full  min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-visible flex items-center text-neutral-500 bg-slate-50 focus-within:border-primary-200'>
            <input
                ref={inputRef}
                type='text'
                placeholder='Tìm kiếm sản phẩm...'
                value={searchValue}
                className='bg-white w-full h-full outline-none px-4'
                onChange={handleOnChange}
                onFocus={handleInputFocus}
                autoComplete='off'
                onKeyDown={handleKeyDown}
            />
            {showDropdown && suggestions.length > 0 && (
                <div ref={dropdownRef} className='absolute left-0 right-0 top-12 bg-white shadow-lg z-50 max-h-80 overflow-y-auto rounded-b-lg border border-slate-200 '>
                    {suggestions.map(product => (
                        <div
                            key={product._id}
                            className='p-2 hover:bg-slate-100 cursor-pointer border-b last:border-b-0 flex items-center gap-2 '
                            onClick={() => handleSuggestionClick(product)}
                        >
                            {/* Nếu muốn có ảnh thì bỏ comment dòng dưới */}
                            {/* <img src={product.image?.[0]} alt={product.name} className='w-8 h-8 object-cover rounded'/> */}
                            <span className='truncate'>{product.name}</span>
                        </div>
                    ))}
                </div>
            )}
            <div>
                {
                    (isMobile && isSearchPage ) ? (
                        <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md '>
                            <FaArrowLeft size={20}/>
                        </Link>
                    ) :(
                        <button
                            className='flex justify-center items-center h-full rounded-r-lg p-3 group-focus-within:text-primary-200 bg-[#ffa53b] text-white '
                            type='button'
                            onClick={handleSearch}
                        >
                            <IoSearch size={24}/>
                        </button>
                    )
                }
            </div>
        </div>
    )
}

export default Search
