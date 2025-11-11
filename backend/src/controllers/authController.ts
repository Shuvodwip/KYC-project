import express from 'express'
import { generateToken } from '../middleware/authMiddleware.js'

// Dummy admin credentials
const ADMIN_EMAIL = 'admin@kyc.com'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_ID = 'admin-001'

export async function adminLogin(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    // Check credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken({
        id: ADMIN_ID,
        email: ADMIN_EMAIL,
      })

      res.json({
        message: 'Login successful',
        token,
        admin: {
          id: ADMIN_ID,
          email: ADMIN_EMAIL,
        },
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export async function adminVerify(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    res.json({ message: 'Token is valid', authenticated: true })
  } catch (error) {
    res.status(500).json({
      message: 'Verification failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
