import type { NextFunction, Response } from 'express'
import { generateToken, verifyToken } from '../src/middleware/authMiddleware.js'

const createResponse = () => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res as Response & {
    status: jest.Mock
    json: jest.Mock
  }
}

const createNext = () => jest.fn() as unknown as NextFunction

describe('auth middleware', () => {
  it('attaches admin info when token is valid', () => {
    const token = generateToken({ id: 'admin', email: 'admin@example.com' })
    const req: any = { headers: { authorization: `Bearer ${token}` } }
    const res = createResponse()
    const next = createNext()

    verifyToken(req, res, next)

    expect(req.admin).toMatchObject({ id: 'admin', email: 'admin@example.com' })
    expect(next).toHaveBeenCalled()
  })

  it('returns 401 when token is missing', () => {
    const req: any = { headers: {} }
    const res = createResponse()

    verifyToken(req, res, createNext())

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' })
  })
})
