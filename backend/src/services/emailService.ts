import nodemailer from 'nodemailer'

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
} = process.env

if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS || !MAIL_FROM) {
  console.warn('⚠️ Email environment variables are not fully configured. PDF emails will fail.')
}

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT ? Number(MAIL_PORT) : 465,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
})

export interface PdfEmailPayload {
  readonly to: string
  readonly subject: string
  readonly text: string
  readonly attachmentName: string
  readonly attachmentBuffer: Buffer
}

export async function sendCustomerPdfEmail(payload: PdfEmailPayload) {
  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
    throw new Error('Email transport is not configured. Please set MAIL_* environment variables.')
  }

  await transporter.sendMail({
    from: MAIL_FROM,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    attachments: [
      {
        filename: payload.attachmentName,
        content: payload.attachmentBuffer,
      },
    ],
  })
}
