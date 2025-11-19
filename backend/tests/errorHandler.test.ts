import type { Request, Response, NextFunction } from 'express'
import { errorHandler, validationErrorHandler } from '../src/middleware/errorHandler.js'
import logger from '../src/utils/logger.js'

const createResponse = () => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res as Response & { status: jest.Mock; json: jest.Mock }
}

describe('error handlers', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'error').mockImplementation(() => logger)
    jest.spyOn(logger, 'warn').mockImplementation(() => logger)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('formats errors consistently', () => {
    const err = new Error('boom')
    const req = {} as Request
    const res = createResponse()
    const next = jest.fn() as unknown as NextFunction

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      status: 500,
      message: 'boom',
    }))
  })

  it('handles validation errors', () => {
    const err = new Error('validation failed in controller')
    const req = {} as Request
    const res = createResponse()
    const next = jest.fn() as unknown as NextFunction

    validationErrorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 400,
      message: 'Validation failed',
    }))
  })
})
