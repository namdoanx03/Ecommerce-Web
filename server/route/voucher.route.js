import { Router } from 'express'
import auth from '../middleware/auth.js'
import optionalAuth from '../middleware/optionalAuth.js'
import {
    createVoucherController,
    getVouchersController,
    updateVoucherController,
    deleteVoucherController,
    validateVoucherController
} from '../controllers/voucher.controller.js'

const voucherRouter = Router()

voucherRouter.post("/create", auth, createVoucherController)
voucherRouter.get('/get', getVouchersController)
voucherRouter.put('/update', auth, updateVoucherController)
voucherRouter.post('/validate', optionalAuth, validateVoucherController) // optionalAuth để có thể validate trước khi login
voucherRouter.delete("/delete", auth, deleteVoucherController)

export default voucherRouter

