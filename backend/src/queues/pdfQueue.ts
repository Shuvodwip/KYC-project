import { connect, type Channel, type ChannelModel, type ConsumeMessage } from 'amqplib'

export interface PdfJobPayload {
  readonly submissionId: string
  readonly customerEmail: string
  readonly firstName: string
  readonly lastName: string
}

let connection: ChannelModel | null = null
let channel: Channel | null = null

const QUEUE_NAME = process.env.PDF_QUEUE || 'kyc.pdf'

export async function initPdfQueue() {
  if (channel) {
    return channel
  }

  if (!process.env.RABBITMQ_URL) {
    throw new Error('RABBITMQ_URL is not set')
  }

  const conn = await connect(process.env.RABBITMQ_URL)
  const ch = await conn.createChannel()
  await ch.assertQueue(QUEUE_NAME, { durable: true })
  await ch.prefetch(Number(process.env.PDF_PREFETCH || 5))

  connection = conn
  channel = ch

  console.log(`🐇 Connected to RabbitMQ queue "${QUEUE_NAME}"`)

  return channel
}

export async function closePdfQueue() {
  if (channel) {
    await channel.close()
  }
  if (connection) {
    await connection.close()
  }
  channel = null
  connection = null
}

export async function enqueuePdfJob(job: PdfJobPayload) {
  if (!channel) {
    await initPdfQueue()
  }

  const ch = channel
  if (!ch) {
    throw new Error('RabbitMQ channel is not initialized')
  }

  ch.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(job)), {
    persistent: true,
  })
}

export async function consumePdfJobs(
  handler: (job: PdfJobPayload, rawMessage: ConsumeMessage) => Promise<void>
) {
  if (!channel) {
    await initPdfQueue()
  }

  const ch = channel
  if (!ch) {
    throw new Error('RabbitMQ channel is not initialized')
  }

  ch.consume(
    QUEUE_NAME,
    async (message: ConsumeMessage | null) => {
      if (!message) {
        return
      }

      try {
        const payload = JSON.parse(message.content.toString()) as PdfJobPayload
        await handler(payload, message)
        ch.ack(message)
      } catch (error) {
        console.error('❌ PDF job failed', error)
        ch.nack(message, false, false)
      }
    },
    { noAck: false }
  )
}
