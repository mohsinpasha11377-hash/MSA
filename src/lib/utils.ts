import type { DocumentType, LineItem } from '../types'

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
  return (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
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

export function nextNumber(type: DocumentType, counter: number): string {
  const prefix = type === 'quote' ? 'QT' : type === 'bill' ? 'BL' : 'INV'
  return `${prefix}-${String(counter).padStart(4, '0')}`
}

export function statusTone(status: string): 'neutral' | 'info' | 'success' | 'warn' | 'danger' {
  switch (status) {
    case 'paid':
    case 'accepted':
      return 'success'
    case 'sent':
      return 'info'
    case 'overdue':
    case 'declined':
    case 'void':
      return 'danger'
    case 'draft':
    default:
      return 'neutral'
  }
}
