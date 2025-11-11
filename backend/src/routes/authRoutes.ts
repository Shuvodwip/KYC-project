import express from 'express'
import { adminLogin, adminVerify } from '../controllers/authController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// POST /api/auth/login - Admin login
router.post('/login', adminLogin)

// GET /api/auth/verify - Verify token
router.get('/verify', verifyToken, adminVerify)

export default router
