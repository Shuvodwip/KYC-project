import PDFDocument from 'pdfkit'

export interface CustomerData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  address: string
  city: string
  summary?: string
  createdAt?: string
}

export function generateCustomerPDF(customer: CustomerData) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
  })

  // Title
  doc
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('KYC CUSTOMER INFORMATION', { align: 'center' })
    .moveDown(0.5)

  // Separator line
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
  doc.moveDown(1)

  // AI SUMMARY SECTION (NEW)
  if (customer.summary) {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('AI SUMMARY', { align: 'center' })
      .moveDown(0.3)

    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#2C5AA0')
      .text(customer.summary, {
        align: 'center',
        width: 500,
      })
      .fillColor('black')
      .moveDown(1)

    // Separator line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(1)
  }

  // Document info
  doc
    .fontSize(9)
    .font('Helvetica')
    .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' })
  doc.moveDown(0.5)
  doc.text(`Document ID: ${customer.id}`, { align: 'right' })
  doc.moveDown(1.5)

  // Section 1: Personal Information
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('1. PERSONAL INFORMATION')
    .moveDown(0.5)

  drawInfoRow(doc, 'Full Name:', `${customer.firstName} ${customer.lastName}`)
  drawInfoRow(doc, 'Date of Birth:', customer.dateOfBirth)
  drawInfoRow(doc, 'Nationality:', customer.nationality)

  doc.moveDown(1)

  // Section 2: Contact Information
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('2. CONTACT INFORMATION')
    .moveDown(0.5)

  drawInfoRow(doc, 'Email Address:', customer.email)
  drawInfoRow(doc, 'Phone Number:', customer.phone)

  doc.moveDown(1)

  // Section 3: Address Information
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('3. ADDRESS INFORMATION')
    .moveDown(0.5)

  drawInfoRow(doc, 'Street Address:', customer.address)
  drawInfoRow(doc, 'City:', customer.city)

  doc.moveDown(1.5)

  // Section 4: Document Details
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('4. DOCUMENT DETAILS')
    .moveDown(0.5)

  if (customer.createdAt) {
    drawInfoRow(doc, 'Registration Date:', new Date(customer.createdAt).toLocaleDateString())
  }
  drawInfoRow(doc, 'Customer ID:', customer.id)
  drawInfoRow(doc, 'Document Type:', 'KYC Submission Report')

  doc.moveDown(2)

  // Footer
  doc
    .fontSize(9)
    .font('Helvetica')
    .text('This is an official KYC customer information document.', { align: 'center' })
  doc.text('Confidential - For authorized personnel only', { align: 'center' })

  doc.end()

  return doc
}

function drawInfoRow(doc: any, label: string, value: string): void {
  const labelX = 50
  const valueX = 200

  doc.font('Helvetica-Bold').fontSize(10).text(label, labelX, doc.y, { width: 150 })

  doc.font('Helvetica').fontSize(10).text(value, valueX, doc.y - 15, { width: 350 })

  doc.moveDown(0.8)
}
