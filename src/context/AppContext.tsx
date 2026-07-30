import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadData, saveData } from '../lib/storage'
import {
  balanceForDocument,
  grandTotal,
  nextNumber,
  todayISO,
  totalPaidForDocument,
  uid,
} from '../lib/utils'
import type {
  AppData,
  BusinessProfile,
  Client,
  Document,
  DocumentStatus,
  DocumentType,
  LineItem,
  Payment,
  PaymentMethod,
} from '../types'

interface AppContextValue {
  data: AppData
  getClient: (id: string) => Client | undefined
  getDocument: (id: string) => Document | undefined
  getPayment: (id: string) => Payment | undefined
  upsertClient: (client: Omit<Client, 'createdAt'> & { createdAt?: string }) => void
  deleteClient: (id: string) => void
  upsertDocument: (doc: Document) => void
  createDocument: (type: DocumentType, clientId?: string) => Document
  deleteDocument: (id: string) => void
  setDocumentStatus: (id: string, status: DocumentStatus) => void
  convertQuoteToInvoice: (quoteId: string) => Document | null
  recordPayment: (input: {
    documentId: string
    amount: number
    method: PaymentMethod
    receivedDate: string
    notes?: string
  }) => Payment | null
  deletePayment: (id: string) => void
  createFinalInvoice: (sourceDocumentId: string) => Document | null
  updateBusiness: (business: BusinessProfile) => void
  resetDemoData: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function blankItem(): LineItem {
  return {
    id: uid('li'),
    description: '',
    measurement: 1,
    unit: 'Sq.Ft',
    unitPrice: 0,
  }
}

function refreshPaymentStatus(
  docs: Document[],
  payments: Payment[],
  documentId: string,
): Document[] {
  return docs.map((d) => {
    if (d.id !== documentId) return d
    if (d.type === 'bill' || d.status === 'void' || d.status === 'declined') return d
    if (d.isFinalBalance) {
      const due = Math.max(0, grandTotal(d.items, d.taxRate) - (d.advanceCredit || 0))
      if (due <= 0.009) return { ...d, status: 'paid' as DocumentStatus, updatedAt: new Date().toISOString() }
      return d
    }
    const gross = grandTotal(d.items, d.taxRate)
    const paid = totalPaidForDocument(payments, d.id)
    let status: DocumentStatus = d.status
    if (paid <= 0) {
      status = d.status === 'paid' || d.status === 'partial' ? 'sent' : d.status
    } else if (paid + 0.009 >= gross) {
      status = 'paid'
    } else {
      status = 'partial'
    }
    return { ...d, status, updatedAt: new Date().toISOString() }
  })
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const getClient = useCallback(
    (id: string) => data.clients.find((c) => c.id === id),
    [data.clients],
  )

  const getDocument = useCallback(
    (id: string) => data.documents.find((d) => d.id === id),
    [data.documents],
  )

  const getPayment = useCallback(
    (id: string) => data.payments.find((p) => p.id === id),
    [data.payments],
  )

  const upsertClient = useCallback(
    (client: Omit<Client, 'createdAt'> & { createdAt?: string }) => {
      setData((prev) => {
        const exists = prev.clients.some((c) => c.id === client.id)
        const next: Client = {
          ...client,
          createdAt: client.createdAt ?? todayISO(),
        }
        return {
          ...prev,
          clients: exists
            ? prev.clients.map((c) => (c.id === client.id ? next : c))
            : [next, ...prev.clients],
        }
      })
    },
    [],
  )

  const deleteClient = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      clients: prev.clients.filter((c) => c.id !== id),
    }))
  }, [])

  const upsertDocument = useCallback((doc: Document) => {
    setData((prev) => {
      const exists = prev.documents.some((d) => d.id === doc.id)
      const next = { ...doc, updatedAt: new Date().toISOString() }
      return {
        ...prev,
        documents: exists
          ? prev.documents.map((d) => (d.id === doc.id ? next : d))
          : [next, ...prev.documents],
      }
    })
  }, [])

  const createDocument = useCallback(
    (type: DocumentType, clientId = '') => {
      const counter = data.counters[type]
      const doc: Document = {
        id: uid('doc'),
        number: nextNumber(type, counter),
        type,
        status: 'draft',
        clientId: clientId || data.clients[0]?.id || '',
        issueDate: todayISO(),
        dueDate: todayISO(),
        items: [blankItem()],
        taxRate: data.business.defaultTaxRate,
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setData((prev) => ({
        ...prev,
        documents: [doc, ...prev.documents],
        counters: { ...prev.counters, [type]: prev.counters[type] + 1 },
      }))
      return doc
    },
    [data.business.defaultTaxRate, data.clients, data.counters],
  )

  const deleteDocument = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
      payments: prev.payments.filter((p) => p.documentId !== id),
    }))
  }, [])

  const setDocumentStatus = useCallback((id: string, status: DocumentStatus) => {
    setData((prev) => ({
      ...prev,
      documents: prev.documents.map((d) =>
        d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d,
      ),
    }))
  }, [])

  const convertQuoteToInvoice = useCallback(
    (quoteId: string) => {
      const quote = data.documents.find((d) => d.id === quoteId && d.type === 'quote')
      if (!quote) return null
      const counter = data.counters.invoice
      const invoice: Document = {
        ...quote,
        id: uid('doc'),
        number: nextNumber('invoice', counter),
        type: 'invoice',
        status: 'draft',
        items: quote.items.map((i) => ({ ...i, id: uid('li') })),
        parentDocumentId: quote.id,
        isFinalBalance: false,
        advanceCredit: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setData((prev) => {
        // Move quote payments onto the new invoice so advances carry forward
        const payments = prev.payments.map((p) =>
          p.documentId === quoteId ? { ...p, documentId: invoice.id } : p,
        )
        const documents = refreshPaymentStatus(
          [
            invoice,
            ...prev.documents.map((d) =>
              d.id === quoteId
                ? {
                    ...d,
                    status: 'accepted' as DocumentStatus,
                    updatedAt: new Date().toISOString(),
                  }
                : d,
            ),
          ],
          payments,
          invoice.id,
        )
        return {
          ...prev,
          documents,
          payments,
          counters: { ...prev.counters, invoice: prev.counters.invoice + 1 },
        }
      })
      return invoice
    },
    [data.counters.invoice, data.documents],
  )

  const recordPayment = useCallback(
    (input: {
      documentId: string
      amount: number
      method: PaymentMethod
      receivedDate: string
      notes?: string
    }) => {
      const doc = data.documents.find((d) => d.id === input.documentId)
      if (!doc || doc.type === 'bill') return null
      if (!(input.amount > 0)) return null

      const payment: Payment = {
        id: uid('pay'),
        number: nextNumber('receipt', data.counters.receipt),
        documentId: doc.id,
        clientId: doc.clientId,
        amount: Number(input.amount),
        method: input.method,
        receivedDate: input.receivedDate || todayISO(),
        notes: input.notes || '',
        createdAt: new Date().toISOString(),
      }

      setData((prev) => {
        const payments = [payment, ...prev.payments]
        return {
          ...prev,
          payments,
          documents: refreshPaymentStatus(prev.documents, payments, doc.id),
          counters: { ...prev.counters, receipt: prev.counters.receipt + 1 },
        }
      })
      return payment
    },
    [data.counters.receipt, data.documents],
  )

  const deletePayment = useCallback((id: string) => {
    setData((prev) => {
      const target = prev.payments.find((p) => p.id === id)
      const payments = prev.payments.filter((p) => p.id !== id)
      const documents = target
        ? refreshPaymentStatus(prev.documents, payments, target.documentId)
        : prev.documents
      return { ...prev, payments, documents }
    })
  }, [])

  const createFinalInvoice = useCallback(
    (sourceDocumentId: string) => {
      const source = data.documents.find((d) => d.id === sourceDocumentId)
      if (!source || (source.type !== 'quote' && source.type !== 'invoice')) return null

      const paid = totalPaidForDocument(data.payments, source.id)
      if (paid <= 0) return null

      const gross = grandTotal(source.items, source.taxRate)
      const balance = balanceForDocument(source, data.payments)
      const counter = data.counters.invoice

      const finalInvoice: Document = {
        id: uid('doc'),
        number: nextNumber('invoice', counter),
        type: 'invoice',
        status: balance <= 0.009 ? 'paid' : 'sent',
        clientId: source.clientId,
        issueDate: todayISO(),
        dueDate: todayISO(),
        items: source.items.map((i) => ({ ...i, id: uid('li') })),
        taxRate: source.taxRate,
        notes: [
          `Final invoice against ${source.number}.`,
          `Gross ${gross.toFixed(2)} less advances received ${paid.toFixed(2)}.`,
          source.notes ? `Ref notes: ${source.notes}` : '',
        ]
          .filter(Boolean)
          .join(' '),
        parentDocumentId: source.id,
        isFinalBalance: true,
        advanceCredit: paid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setData((prev) => ({
        ...prev,
        documents: [finalInvoice, ...prev.documents],
        counters: { ...prev.counters, invoice: prev.counters.invoice + 1 },
      }))
      return finalInvoice
    },
    [data.counters.invoice, data.documents, data.payments],
  )

  const updateBusiness = useCallback((business: BusinessProfile) => {
    setData((prev) => ({ ...prev, business }))
  }, [])

  const resetDemoData = useCallback(() => {
    localStorage.removeItem('msa-app-data-v1')
    localStorage.removeItem('msa-app-data-v2')
    localStorage.removeItem('msa-app-data-v3')
    setData(loadData())
  }, [])

  const value = useMemo(
    () => ({
      data,
      getClient,
      getDocument,
      getPayment,
      upsertClient,
      deleteClient,
      upsertDocument,
      createDocument,
      deleteDocument,
      setDocumentStatus,
      convertQuoteToInvoice,
      recordPayment,
      deletePayment,
      createFinalInvoice,
      updateBusiness,
      resetDemoData,
    }),
    [
      data,
      getClient,
      getDocument,
      getPayment,
      upsertClient,
      deleteClient,
      upsertDocument,
      createDocument,
      deleteDocument,
      setDocumentStatus,
      convertQuoteToInvoice,
      recordPayment,
      deletePayment,
      createFinalInvoice,
      updateBusiness,
      resetDemoData,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
