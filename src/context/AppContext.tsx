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
import { nextNumber, todayISO, uid } from '../lib/utils'
import type {
  AppData,
  BusinessProfile,
  Client,
  Document,
  DocumentStatus,
  DocumentType,
  LineItem,
} from '../types'

interface AppContextValue {
  data: AppData
  getClient: (id: string) => Client | undefined
  upsertClient: (client: Omit<Client, 'createdAt'> & { createdAt?: string }) => void
  deleteClient: (id: string) => void
  upsertDocument: (doc: Document) => void
  createDocument: (type: DocumentType, clientId?: string) => Document
  deleteDocument: (id: string) => void
  setDocumentStatus: (id: string, status: DocumentStatus) => void
  convertQuoteToInvoice: (quoteId: string) => Document | null
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const getClient = useCallback(
    (id: string) => data.clients.find((c) => c.id === id),
    [data.clients],
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setData((prev) => ({
        ...prev,
        documents: [
          invoice,
          ...prev.documents.map((d) =>
            d.id === quoteId
              ? { ...d, status: 'accepted' as DocumentStatus, updatedAt: new Date().toISOString() }
              : d,
          ),
        ],
        counters: { ...prev.counters, invoice: prev.counters.invoice + 1 },
      }))
      return invoice
    },
    [data.counters.invoice, data.documents],
  )

  const updateBusiness = useCallback((business: BusinessProfile) => {
    setData((prev) => ({ ...prev, business }))
  }, [])

  const resetDemoData = useCallback(() => {
    localStorage.removeItem('msa-app-data-v1')
    localStorage.removeItem('msa-app-data-v2')
    setData(loadData())
  }, [])

  const value = useMemo(
    () => ({
      data,
      getClient,
      upsertClient,
      deleteClient,
      upsertDocument,
      createDocument,
      deleteDocument,
      setDocumentStatus,
      convertQuoteToInvoice,
      updateBusiness,
      resetDemoData,
    }),
    [
      data,
      getClient,
      upsertClient,
      deleteClient,
      upsertDocument,
      createDocument,
      deleteDocument,
      setDocumentStatus,
      convertQuoteToInvoice,
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
