import { Router } from 'express'
import auth from '../middleware/auth.js'
import {
    createVoucherController,
    getVouchersController,
    updateVoucherController,
    deleteVoucherController
} from '../controllers/voucher.controller.js'

const voucherRouter = Router()

voucherRouter.post("/create", auth, createVoucherController)
voucherRouter.get('/get', getVouchersController)
voucherRouter.put('/update', auth, updateVoucherController)
voucherRouter.delete("/delete", auth, deleteVoucherController)

export default voucherRouter

