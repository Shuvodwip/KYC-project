import 'dotenv/config'
import { consumePdfJobs, closePdfQueue } from '../queues/pdfQueue.js'
import { connectDB, disconnectDB } from '../utils/db.js'
import { KYCService } from '../services/kycService.js'
import { generateCustomerPDFBuffer } from '../services/pdfService.js'
import { sendCustomerPdfEmail } from '../services/emailService.js'
import type { PdfJobPayload } from '../queues/pdfQueue.js'

async function startWorker() {
  await connectDB()

  await consumePdfJobs(async (job: PdfJobPayload) => {
    console.log(`📄 Processing PDF job for ${job.submissionId}`)

    const submission = await KYCService.getSubmission(job.submissionId)

    if (!submission) {
      throw new Error(`Submission ${job.submissionId} not found`)
    }

    const customerData = {
      id: submission.id,
      firstName: submission.data?.firstName || '',
      lastName: submission.data?.lastName || '',
      email: submission.data?.email || '',
      phone: submission.data?.phone || '',
      dateOfBirth: submission.data?.dateOfBirth || '',
      nationality: submission.data?.nationality || '',
      address: submission.data?.address || '',
      city: submission.data?.city || '',
      summary: submission.summary || undefined,
      createdAt: submission.timestamp,
    }

    const pdfBuffer = await generateCustomerPDFBuffer(customerData)

    await sendCustomerPdfEmail({
      to: job.customerEmail,
      subject: 'Your KYC Verification PDF',
      text: `Hello ${customerData.firstName},\n\nYour KYC verification document is attached. Please keep it for your records.\n\nThank you,\nKYC Compliance Team`,
      attachmentName: `customer-${customerData.firstName}-${customerData.lastName}.pdf`,
      attachmentBuffer: pdfBuffer,
    })

    console.log(`✅ PDF emailed to ${job.customerEmail} for submission ${job.submissionId}`)
  })
}

process.on('SIGINT', async () => {
  console.log('Shutting down PDF worker...')
  await closePdfQueue()
  await disconnectDB()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down PDF worker...')
  await closePdfQueue()
  await disconnectDB()
  process.exit(0)
})

await startWorker().catch(async (error) => {
  console.error('PDF worker failed to start', error)
  await closePdfQueue()
  await disconnectDB()
  process.exit(1)
})
