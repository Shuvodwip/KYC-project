import { generateCustomerPDFBuffer } from '../src/services/pdfService.js'

describe('generateCustomerPDFBuffer', () => {
  it('creates a PDF buffer for provided customer data', async () => {
    const buffer = await generateCustomerPDFBuffer({
      id: 'KYC-TEST',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '+1-555-1234',
      dateOfBirth: '1990-01-01',
      nationality: 'United States',
      address: '123 Main Street',
      city: 'New York',
      summary: 'Sample summary',
      createdAt: new Date().toISOString(),
    })

    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })
})
