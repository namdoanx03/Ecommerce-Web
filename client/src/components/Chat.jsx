import React, { useState, useEffect, useRef } from 'react'
import { IoClose, IoChatbubbleEllipses } from "react-icons/io5"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Load messages when chat opens
  useEffect(() => {
    if (isOpen) {
      loadMessages()
    }
  }, [isOpen])

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  const loadMessages = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.fetchChatMessages
      })

      if (response.data.success) {
        const msgs = response.data.data || []
        if (msgs.length === 0) {
          // Default bot message if no history
          setMessages([{
            sender: 'bot',
            message: 'Xin chào 👋, tôi có thể giúp gì cho bạn?'
          }])
        } else {
          setMessages(msgs)
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleSendMessage = async () => {
    const msg = inputMessage.trim()
    if (!msg || loading) return

    setLoading(true)
    setInputMessage('')

    try {
      const response = await Axios({
        ...SummaryApi.sendChatMessage,
        data: { message: msg }
      })

      if (response.data.success) {
        const { user, bot } = response.data.data
        // Append both user and bot messages
        setMessages(prev => [...prev, user, bot])
      }
    } catch (error) {
      AxiosToastError(error)
      // Show error message
      setMessages(prev => [...prev, {
        sender: 'bot',
        message: 'Xin lỗi, không thể gửi tin nhắn lúc này.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'hidden' : 'block'
        }`}
        aria-label="Toggle chat"
      >
        <IoChatbubbleEllipses className="w-6 h-6" />
      </button>

      {/* Chat Box */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-96 bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none h-0'
        }`}
        style={{
          height: isOpen ? '600px' : '0px',
          maxHeight: 'calc(100vh - 120px)'
        }}
      >
        {/* Header */}
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
          <h3 className="font-semibold text-lg">Hỗ trợ trực tuyến</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-emerald-700 rounded-full p-1 transition-colors"
            aria-label="Close chat"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
          style={{ maxHeight: 'calc(100% - 120px)' }}
        >
          {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-100 text-gray-800'
                      : 'bg-emerald-100 text-gray-800'
                  }`}
                  style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                >
                  {msg.message}
                </div>
              </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-emerald-100 text-gray-800 rounded-lg px-4 py-2">
                <span className="text-sm">Đang gửi...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat

