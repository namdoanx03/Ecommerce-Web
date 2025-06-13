import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, createPaymentController, getOrderDetailsController, paymentController, webhookStripe, checkPaymentController, deleteOrderController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.post('/create-payment',auth,createPaymentController)
orderRouter.get('/check-payment',checkPaymentController)
orderRouter.delete('/delete-order', auth, deleteOrderController)

export default orderRouter