import type { AppData, BusinessProfile, Client, Document, LineItem, Payment } from '../types'
import { addDaysISO, normalizeLineItem, todayISO, uid } from './utils'

const STORAGE_KEY = 'msa-app-data-v3'

export const defaultBusiness: BusinessProfile = {
  name: 'MSA Interior and Exterior',
  email: 'mohsin@intercorpservices.in',
  phone: '+91 00000 00000',
  address: 'India',
  taxId: '',
  currency: 'INR',
  defaultTaxRate: 18,
}

function seedData(): AppData {
  const clientA: Client = {
    id: uid('cli'),
    name: 'Aisha Khan',
    email: 'aisha@northwind.co',
    phone: '+91 98765 43210',
    company: 'Northwind Retail',
    address: '12 MG Road, Bengaluru',
    createdAt: todayISO(),
  }
  const clientB: Client = {
    id: uid('cli'),
    name: 'Rohan Mehta',
    email: 'rohan@harbortech.io',
    phone: '+91 99887 66554',
    company: 'Harbor Tech',
    address: '88 Marine Drive, Mumbai',
    createdAt: todayISO(),
  }

  const quote: Document = {
    id: uid('doc'),
    number: 'QT-0001',
    type: 'quote',
    status: 'sent',
    clientId: clientA.id,
    issueDate: todayISO(),
    dueDate: addDaysISO(14),
    items: [
      {
        id: uid('li'),
        description: 'Living room false ceiling',
        measurement: 420,
        unit: 'Sq.Ft',
        unitPrice: 180,
      },
      {
        id: uid('li'),
        description: 'Wall panelling — teak finish',
        measurement: 180,
        unit: 'Sq.Ft',
        unitPrice: 320,
      },
      {
        id: uid('li'),
        description: 'Skirting installation',
        measurement: 64,
        unit: 'R.Ft',
        unitPrice: 95,
      },
    ],
    taxRate: 18,
    notes: 'Valid for 14 days. 40% advance to schedule kickoff.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const invoice: Document = {
    id: uid('doc'),
    number: 'INV-0001',
    type: 'invoice',
    status: 'partial',
    clientId: clientB.id,
    issueDate: addDaysISO(-20),
    dueDate: addDaysISO(-5),
    items: [
      {
        id: uid('li'),
        description: 'Exterior facade painting',
        measurement: 1250,
        unit: 'Sq.Ft',
        unitPrice: 45,
      },
      {
        id: uid('li'),
        description: 'Waterproofing — terrace',
        measurement: 680,
        unit: 'Sq.Ft',
        unitPrice: 65,
      },
    ],
    taxRate: 18,
    notes: 'Thank you for your business.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const bill: Document = {
    id: uid('doc'),
    number: 'BL-0001',
    type: 'bill',
    status: 'sent',
    clientId: clientA.id,
    issueDate: todayISO(),
    dueDate: addDaysISO(7),
    items: [
      {
        id: uid('li'),
        description: 'Premium plywood supply',
        measurement: 48,
        unit: 'Nos',
        unitPrice: 1850,
      },
    ],
    taxRate: 18,
    notes: 'Vendor payable — material supply.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const payment: Payment = {
    id: uid('pay'),
    number: 'RCP-0001',
    documentId: invoice.id,
    clientId: clientB.id,
    amount: 40000,
    method: 'upi',
    receivedDate: addDaysISO(-10),
    notes: 'Advance against facade painting.',
    createdAt: new Date().toISOString(),
  }

  return {
    clients: [clientA, clientB],
    documents: [quote, invoice, bill],
    payments: [payment],
    business: defaultBusiness,
    counters: { quote: 2, bill: 2, invoice: 2, receipt: 2 },
  }
}

function migrateDocuments(docs: Document[]): Document[] {
  return docs.map((doc) => ({
    ...doc,
    items: (doc.items || []).map((item) =>
      normalizeLineItem(item as LineItem & { quantity?: number }),
    ),
  }))
}

export function loadData(): AppData {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem('msa-app-data-v2') ??
      localStorage.getItem('msa-app-data-v1')
    if (!raw) {
      const seeded = seedData()
      saveData(seeded)
      return seeded
    }
    const parsed = JSON.parse(raw) as Partial<AppData>
    const migrated: AppData = {
      clients: parsed.clients ?? [],
      documents: migrateDocuments(parsed.documents ?? []),
      payments: parsed.payments ?? [],
      business: { ...defaultBusiness, ...parsed.business },
      counters: {
        quote: parsed.counters?.quote ?? 1,
        bill: parsed.counters?.bill ?? 1,
        invoice: parsed.counters?.invoice ?? 1,
        receipt: parsed.counters?.receipt ?? 1,
      },
    }
    if (migrated.business.name === 'Intercorp Services') {
      migrated.business.name = defaultBusiness.name
    }
    saveData(migrated)
    return migrated
  } catch {
    return seedData()
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
