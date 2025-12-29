import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt, FaTimes } from 'react-icons/fa'

const DatePickerFilter = ({ onDateChange, className = '' }) => {
    const [filterType, setFilterType] = useState('range') // 'day', 'month', 'range'
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState(null)

    const handleFilterTypeChange = (type) => {
        setFilterType(type)
        // Reset dates when changing filter type
        setStartDate(null)
        setEndDate(null)
        setSelectedDate(null)
        setSelectedMonth(null)
        onDateChange(null, null, type)
    }

    const handleDateChange = (date) => {
        setSelectedDate(date)
        if (date) {
            const start = new Date(date)
            start.setHours(0, 0, 0, 0)
            const end = new Date(date)
            end.setHours(23, 59, 59, 999)
            onDateChange(start, end, 'day')
        } else {
            onDateChange(null, null, 'day')
        }
    }

    const handleMonthChange = (date) => {
        setSelectedMonth(date)
        if (date) {
            const start = new Date(date.getFullYear(), date.getMonth(), 1)
            start.setHours(0, 0, 0, 0)
            const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            end.setHours(23, 59, 59, 999)
            onDateChange(start, end, 'month')
        } else {
            onDateChange(null, null, 'month')
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
        } else if (start) {
            const startTime = new Date(start)
            startTime.setHours(0, 0, 0, 0)
            onDateChange(startTime, null, 'range')
        } else {
            onDateChange(null, null, 'range')
        }
    }

    const clearFilter = () => {
        setStartDate(null)
        setEndDate(null)
        setSelectedDate(null)
        setSelectedMonth(null)
        onDateChange(null, null, filterType)
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
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 ${className}`}>
            {/* Filter Type Buttons */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => handleFilterTypeChange('day')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        filterType === 'day'
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Theo ngày
                </button>
                <button
                    onClick={() => handleFilterTypeChange('month')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        filterType === 'month'
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Theo tháng
                </button>
                <button
                    onClick={() => handleFilterTypeChange('range')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        filterType === 'range'
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Khoảng thời gian
                </button>
            </div>

            {/* Date Pickers */}
            <div className="flex items-center gap-2 flex-wrap">
                {filterType === 'day' && (
                    <div className="relative">
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày"
                            className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full sm:w-auto"
                            calendarClassName="react-datepicker-custom"
                        />
                        <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                )}

                {filterType === 'month' && (
                    <div className="relative">
                        <DatePicker
                            selected={selectedMonth}
                            onChange={handleMonthChange}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText="Chọn tháng"
                            className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full sm:w-auto"
                        />
                        <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                )}

                {filterType === 'range' && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <DatePicker
                                selected={startDate}
                                onChange={handleRangeChange}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Từ ngày"
                                className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full sm:w-40"
                            />
                            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                        <span className="text-gray-500">-</span>
                        <div className="relative">
                            <DatePicker
                                selected={endDate}
                                onChange={handleRangeChange}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Đến ngày"
                                className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full sm:w-40"
                            />
                            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                )}

                {/* Clear Button */}
                {(selectedDate || selectedMonth || startDate || endDate) && (
                    <button
                        onClick={clearFilter}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xóa bộ lọc"
                    >
                        <FaTimes size={16} />
                    </button>
                )}

                {/* Display selected range */}
                {filterType === 'range' && startDate && endDate && (
                    <span className="text-sm text-gray-600">
                        {formatDate(startDate)} - {formatDate(endDate)}
                    </span>
                )}
            </div>
        </div>
    )
}

export default DatePickerFilter

