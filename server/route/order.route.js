import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, createPaymentController, getOrderDetailsController, checkPaymentController, deleteOrderController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.post('/create-payment',auth,createPaymentController)
orderRouter.get('/check-payment',checkPaymentController)
orderRouter.delete('/delete-order', auth, deleteOrderController)

export default orderRouter