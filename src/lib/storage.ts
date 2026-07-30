import type { AppData, BusinessProfile, Client, Document } from '../types'
import { addDaysISO, todayISO, uid } from './utils'

const STORAGE_KEY = 'msa-app-data-v1'

export const defaultBusiness: BusinessProfile = {
  name: 'Intercorp Services',
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
        description: 'Brand website redesign',
        quantity: 1,
        unitPrice: 85000,
      },
      {
        id: uid('li'),
        description: 'Content migration & QA',
        quantity: 1,
        unitPrice: 18000,
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
    status: 'paid',
    clientId: clientB.id,
    issueDate: addDaysISO(-20),
    dueDate: addDaysISO(-5),
    items: [
      {
        id: uid('li'),
        description: 'Monthly retainer — July',
        quantity: 1,
        unitPrice: 45000,
      },
      {
        id: uid('li'),
        description: 'Priority support hours',
        quantity: 8,
        unitPrice: 1500,
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
        description: 'Cloud hosting — Q3',
        quantity: 1,
        unitPrice: 12500,
      },
    ],
    taxRate: 18,
    notes: 'Vendor payable — cloud infrastructure.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return {
    clients: [clientA, clientB],
    documents: [quote, invoice, bill],
    business: defaultBusiness,
    counters: { quote: 2, bill: 2, invoice: 2 },
  }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedData()
      saveData(seeded)
      return seeded
    }
    const parsed = JSON.parse(raw) as AppData
    return {
      ...seedData(),
      ...parsed,
      business: { ...defaultBusiness, ...parsed.business },
      counters: {
        quote: parsed.counters?.quote ?? 1,
        bill: parsed.counters?.bill ?? 1,
        invoice: parsed.counters?.invoice ?? 1,
      },
    }
  } catch {
    return seedData()
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
