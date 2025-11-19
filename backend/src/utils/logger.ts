import { createLogger, format, transports } from 'winston'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { Request, Response, NextFunction } from 'express'

const logDir = join(process.cwd(), 'logs')
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true })
}

const logFormat = format.printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
  return `${timestamp as string} ${level}: ${message}${metaString}`
})

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(format.timestamp(), logFormat),
  transports: [
    new transports.File({ filename: join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: join(logDir, 'combined.log') }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.timestamp(), logFormat),
    })
  )
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      duration,
    })
  })
  next()
}

export default logger
