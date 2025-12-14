import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt, FaTimes } from 'react-icons/fa'

const DateFilterCompact = ({ onDateChange }) => {
    const [selectedOption, setSelectedOption] = useState('today') // 'today', 'yesterday', 'range'
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [showRangePicker, setShowRangePicker] = useState(false)

    const handleOptionClick = (option) => {
        setSelectedOption(option)
        setShowRangePicker(false)
        setStartDate(null)
        setEndDate(null)

        if (option === 'today') {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const end = new Date()
            end.setHours(23, 59, 59, 999)
            onDateChange(today, end, 'today')
        } else if (option === 'yesterday') {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            yesterday.setHours(0, 0, 0, 0)
            const end = new Date(yesterday)
            end.setHours(23, 59, 59, 999)
            onDateChange(yesterday, end, 'yesterday')
        } else if (option === 'range') {
            setShowRangePicker(true)
        }
    }

    const handleRangeChange = (dates) => {
        const [start, end] = dates
        setStartDate(start)
        setEndDate(end)
        if (start && end) {
            const startTime = new Date(start)
            startTime.setHours(0, 0, 0, 0)
            const endTime = new Date(end)
            endTime.setHours(23, 59, 59, 999)
            onDateChange(startTime, endTime, 'range')
            setShowRangePicker(false)
        }
    }

    const clearFilter = () => {
        setStartDate(null)
        setEndDate(null)
        setSelectedOption('today')
        setShowRangePicker(false)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const end = new Date()
        end.setHours(23, 59, 59, 999)
        onDateChange(today, end, 'today')
    }

    const formatDate = (date) => {
        if (!date) return ''
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                {/* Hôm nay */}
                <button
                    onClick={() => handleOptionClick('today')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        selectedOption === 'today'
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Hôm nay
                </button>

                {/* Hôm qua */}
                <button
                    onClick={() => handleOptionClick('yesterday')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        selectedOption === 'yesterday'
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Hôm qua
                </button>

                {/* Khoảng thời gian */}
                <div className="relative">
                    <button
                        onClick={() => handleOptionClick('range')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                            selectedOption === 'range'
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <FaCalendarAlt size={14} />
                        Khoảng thời gian
                    </button>

                    {/* Date Range Picker - Hiển thị khi click vào "Khoảng thời gian" */}
                    {showRangePicker && (
                        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[300px]">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-800">Chọn khoảng thời gian</h3>
                                <button
                                    onClick={() => setShowRangePicker(false)}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="relative flex-1">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleRangeChange}
                                        startDate={startDate}
                                        endDate={endDate}
                                        selectsRange
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Từ ngày"
                                        className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full text-sm"
                                    />
                                    <FaCalendarAlt className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                                <span className="text-gray-500">-</span>
                                <div className="relative flex-1">
                                    <DatePicker
                                        selected={endDate}
                                        onChange={handleRangeChange}
                                        startDate={startDate}
                                        endDate={endDate}
                                        selectsRange
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Đến ngày"
                                        className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full text-sm"
                                    />
                                    <FaCalendarAlt className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                            </div>
                            {startDate && endDate && (
                                <div className="text-xs text-gray-600 mb-2">
                                    {formatDate(startDate)} - {formatDate(endDate)}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Clear Button - chỉ hiển thị khi đã chọn range */}
                {selectedOption === 'range' && (startDate || endDate) && (
                    <button
                        onClick={clearFilter}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xóa bộ lọc"
                    >
                        <FaTimes size={14} />
                    </button>
                )}
            </div>
        </div>
    )
}

export default DateFilterCompact

