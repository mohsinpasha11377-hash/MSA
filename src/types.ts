export type DocumentType = 'quote' | 'bill' | 'invoice'

export type DocumentStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'declined'
  | 'paid'
  | 'partial'
  | 'overdue'
  | 'void'

export type PaymentMethod =
  | 'cash'
  | 'upi'
  | 'bank_transfer'
  | 'cheque'
  | 'card'
  | 'other'

export interface LineItem {
  id: string
  description: string
  /** Numeric measurement / quantity of work */
  measurement: number
  /** Unit of measurement, e.g. Sq.Ft, R.Ft, Nos */
  unit: string
  unitPrice: number
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  createdAt: string
}

export interface Document {
  id: string
  number: string
  type: DocumentType
  status: DocumentStatus
  clientId: string
  issueDate: string
  dueDate: string
  items: LineItem[]
  taxRate: number
  notes: string
  createdAt: string
  updatedAt: string
  /** Original quote/invoice this final balance invoice is based on */
  parentDocumentId?: string
  /** True when this invoice is a final bill after advances */
  isFinalBalance?: boolean
  /** Amount already received that is deducted on this final invoice */
  advanceCredit?: number
}

export interface Payment {
  id: string
  number: string
  /** Quote or invoice this payment applies to */
  documentId: string
  clientId: string
  amount: number
  method: PaymentMethod
  receivedDate: string
  notes: string
  createdAt: string
}

export interface BusinessProfile {
  name: string
  email: string
  phone: string
  address: string
  taxId: string
  currency: string
  defaultTaxRate: number
}

export interface AppData {
  clients: Client[]
  documents: Document[]
  payments: Payment[]
  business: BusinessProfile
  counters: Record<DocumentType | 'receipt', number>
}

/** Common units for interior / exterior works */
export const MEASUREMENT_UNITS = [
  'Sq.Ft',
  'Sq.M',
  'R.Ft',
  'R.M',
  'Nos',
  'Cu.Ft',
  'Cu.M',
  'Job',
  'Lumpsum',
] as const

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
]
