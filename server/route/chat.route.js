import express from 'express'
import { fetchMessagesController, sendMessageController } from '../controllers/chat.controller.js'
import auth from '../middleware/auth.js'

const chatRouter = express.Router()

// Get chat messages (optional auth - supports both user and guest)
chatRouter.get('/messages', fetchMessagesController)

// Send message (optional auth - supports both user and guest)
chatRouter.post('/send', sendMessageController)

export default chatRouter
