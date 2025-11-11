import jwt from 'jsonwebtoken'
import express from 'express'

const JWT_SECRET = process.env.JWT_SECRET || 'kyc_super_secret_key_2024'

export interface AuthRequest extends express.Request {
  admin?: { id: string; email: string }
}

export function verifyToken(
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction
): void {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' })
      return
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string }
    req.admin = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function generateToken(admin: { id: string; email: string }): string {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: '24h' })
}
