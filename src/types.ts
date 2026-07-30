export type DocumentType = 'quote' | 'bill' | 'invoice'

export type DocumentStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'declined'
  | 'paid'
  | 'overdue'
  | 'void'

export interface LineItem {
  id: string
  description: string
  quantity: number
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
  business: BusinessProfile
  counters: Record<DocumentType, number>
}
