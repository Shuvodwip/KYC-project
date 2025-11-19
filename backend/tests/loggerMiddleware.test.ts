import { EventEmitter } from 'node:events'
import { requestLogger } from '../src/utils/logger.js'
import logger from '../src/utils/logger.js'

const createResponse = () => {
  const res: any = new EventEmitter()
  res.statusCode = 200
  res.on = res.addListener
  return res
}

describe('requestLogger', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('logs request data when response finishes', () => {
    const req: any = { method: 'GET', originalUrl: '/health' }
    const res = createResponse()
    const next = jest.fn()
    const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => logger)

    requestLogger(req, res, next)
    res.emit('finish')

    expect(next).toHaveBeenCalled()
    expect(infoSpy).toHaveBeenCalledWith('GET /health', expect.objectContaining({
      statusCode: 200,
      duration: expect.any(Number),
    }))
  })
})
