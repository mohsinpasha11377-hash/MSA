import type { Document, DocumentType, LineItem, Payment, PaymentMethod } from '../types'
import { PAYMENT_METHODS } from '../types'

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysISO(days: number, from = todayISO()): string {
  const d = new Date(from)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function lineTotal(item: LineItem): number {
  return (Number(item.measurement) || 0) * (Number(item.unitPrice) || 0)
}

export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0)
}

export function taxAmount(items: LineItem[], taxRate: number): number {
  return subtotal(items) * ((Number(taxRate) || 0) / 100)
}

export function grandTotal(items: LineItem[], taxRate: number): number {
  return subtotal(items) + taxAmount(items, taxRate)
}

/** Gross total minus advance credit on final invoices */
export function amountDue(doc: Document): number {
  const gross = grandTotal(doc.items, doc.taxRate)
  const credit = Number(doc.advanceCredit) || 0
  return Math.max(0, gross - credit)
}

export function paymentsForDocument(payments: Payment[], documentId: string): Payment[] {
  return payments.filter((p) => p.documentId === documentId)
}

export function totalPaidForDocument(payments: Payment[], documentId: string): number {
  return paymentsForDocument(payments, documentId).reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
}

export function balanceForDocument(doc: Document, payments: Payment[]): number {
  if (doc.isFinalBalance) return amountDue(doc)
  const gross = grandTotal(doc.items, doc.taxRate)
  return Math.max(0, gross - totalPaidForDocument(payments, doc.id))
}

export function documentLabel(type: DocumentType): string {
  switch (type) {
    case 'quote':
      return 'Quote'
    case 'bill':
      return 'Bill'
    case 'invoice':
      return 'Invoice'
  }
}

export function nextNumber(type: DocumentType | 'receipt', counter: number): string {
  const prefix =
    type === 'quote' ? 'QT' : type === 'bill' ? 'BL' : type === 'receipt' ? 'RCP' : 'INV'
  return `${prefix}-${String(counter).padStart(4, '0')}`
}

export function paymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHODS.find((m) => m.value === method)?.label ?? method
}

export function statusTone(status: string): 'neutral' | 'info' | 'success' | 'warn' | 'danger' {
  switch (status) {
    case 'paid':
    case 'accepted':
      return 'success'
    case 'sent':
      return 'info'
    case 'partial':
      return 'warn'
    case 'overdue':
    case 'declined':
    case 'void':
      return 'danger'
    case 'draft':
    default:
      return 'neutral'
  }
}

/** Normalize legacy line items that used `quantity` instead of `measurement`. */
export function normalizeLineItem(raw: Partial<LineItem> & { quantity?: number; id?: string }): LineItem {
  const measurement =
    raw.measurement !== undefined && raw.measurement !== null
      ? Number(raw.measurement)
      : Number(raw.quantity ?? 0)

  return {
    id: raw.id || uid('li'),
    description: raw.description || '',
    measurement: Number.isFinite(measurement) ? measurement : 0,
    unit: raw.unit || 'Nos',
    unitPrice: Number(raw.unitPrice) || 0,
  }
}
