import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { PaymentReceiptPreview } from '../components/DocumentPreview'
import { ShareWhatsAppButton } from '../components/ShareWhatsAppButton'
import { useApp } from '../context/AppContext'
import {
  balanceForDocument,
  formatCurrency,
  formatDate,
  grandTotal,
  paymentMethodLabel,
  todayISO,
} from '../lib/utils'
import { PAYMENT_METHODS, type PaymentMethod } from '../types'

export function PaymentsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { data, getClient, getDocument, recordPayment } = useApp()
  const currency = data.business.currency

  const payableDocs = useMemo(
    () =>
      data.documents
        .filter((d) => d.type === 'quote' || d.type === 'invoice')
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [data.documents],
  )

  const preselect = params.get('doc') || payableDocs[0]?.id || ''
  const [documentId, setDocumentId] = useState(preselect)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('upi')
  const [receivedDate, setReceivedDate] = useState(todayISO())
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (preselect && preselect !== documentId) {
      onDocChange(preselect)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselect])

  useEffect(() => {
    if (documentId) {
      const doc = getDocument(documentId)
      if (doc) {
        const bal = balanceForDocument(doc, data.payments)
        setAmount(bal > 0 ? String(Number(bal.toFixed(2))) : '')
      }
    }
    // only on mount / doc list ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selected = getDocument(documentId)
  const balance = selected ? balanceForDocument(selected, data.payments) : 0

  function onDocChange(id: string) {
    setDocumentId(id)
    const doc = getDocument(id)
    if (doc) {
      const bal = balanceForDocument(doc, data.payments)
      setAmount(bal > 0 ? String(Number(bal.toFixed(2))) : '')
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const value = Number(amount)
    if (!documentId) {
      setError('Select a quote or invoice')
      return
    }
    if (!(value > 0)) {
      setError('Enter a valid amount')
      return
    }
    const payment = recordPayment({
      documentId,
      amount: value,
      method,
      receivedDate,
      notes,
    })
    if (!payment) {
      setError('Could not record payment')
      return
    }
    navigate(`/payments/${payment.id}`)
  }

  const payments = useMemo(
    () => [...data.payments].sort((a, b) => b.receivedDate.localeCompare(a.receivedDate)),
    [data.payments],
  )

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Payments</h1>
          <p>Record amounts received against quotes or invoices and send payment receipts.</p>
        </div>
      </div>

      <div className="split">
        <div className="panel">
          <div className="panel-head">
            <h2>Record payment received</h2>
          </div>
          <form className="form-grid" onSubmit={onSubmit}>
            <label className="full">
              Against quote / invoice
              <select value={documentId} onChange={(e) => onDocChange(e.target.value)} required>
                <option value="">Select document</option>
                {payableDocs.map((doc) => {
                  const client = getClient(doc.clientId)
                  const bal = balanceForDocument(doc, data.payments)
                  return (
                    <option key={doc.id} value={doc.id}>
                      {doc.number} · {client?.company || client?.name || '—'} · due{' '}
                      {formatCurrency(bal, currency)}
                    </option>
                  )
                })}
              </select>
            </label>
            {selected ? (
              <div className="full payment-summary">
                <span>
                  Gross {formatCurrency(grandTotal(selected.items, selected.taxRate), currency)}
                </span>
                <span>Balance {formatCurrency(balance, currency)}</span>
              </div>
            ) : null}
            <label>
              Amount received
              <input
                type="number"
                min={0}
                step={0.01}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>
            <label>
              Payment method
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Received date
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                required
              />
            </label>
            <label className="full">
              Notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="UPI ref, cheque no., advance, etc."
              />
            </label>
            {error ? <div className="full form-error">{error}</div> : null}
            <div className="full actions">
              <button type="submit" className="btn btn-primary">
                Save &amp; open receipt
              </button>
            </div>
          </form>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Payment receipts ({payments.length})</h2>
          </div>
          {payments.length === 0 ? (
            <div className="empty">
              <h3>No receipts yet</h3>
              <p>Record a payment against a quote or invoice to generate a receipt.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Receipt</th>
                    <th>Against</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th className="no-print">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const client = getClient(p.clientId)
                    const doc = getDocument(p.documentId)
                    return (
                      <tr key={p.id}>
                        <td>
                          <Link to={`/payments/${p.id}`}>{p.number}</Link>
                        </td>
                        <td>{doc?.number || '—'}</td>
                        <td>{client?.company || client?.name || '—'}</td>
                        <td>{formatDate(p.receivedDate)}</td>
                        <td>{paymentMethodLabel(p.method)}</td>
                        <td>{formatCurrency(p.amount, currency)}</td>
                        <td className="no-print">
                          <div className="actions">
                            <Link className="btn btn-secondary btn-sm" to={`/payments/${p.id}`}>
                              Receipt
                            </Link>
                            <Link
                              className="btn btn-whatsapp btn-sm"
                              to={`/payments/${p.id}?whatsapp=1`}
                            >
                              WhatsApp
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function PaymentReceiptPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { data, getPayment, getDocument, deletePayment } = useApp()
  const payment = id ? getPayment(id) : undefined
  const previewRef = useRef<HTMLDivElement>(null)
  const autoWhatsApp = params.get('whatsapp') === '1'

  useEffect(() => {
    if (!autoWhatsApp || !payment) return
    const timer = window.setTimeout(() => {
      document.querySelector<HTMLButtonElement>('[data-share-whatsapp="true"]')?.click()
    }, 500)
    return () => window.clearTimeout(timer)
  }, [autoWhatsApp, payment])

  if (!payment) {
    return (
      <div className="panel">
        <div className="empty">
          <h3>Receipt not found</h3>
          <Link className="btn btn-primary" to="/payments">
            Back to payments
          </Link>
        </div>
      </div>
    )
  }

  const doc = getDocument(payment.documentId)
  const shareDoc = {
    number: payment.number,
    type: 'invoice' as const,
  }

  return (
    <>
      <div className="topbar no-print">
        <div>
          <h1>Receipt {payment.number}</h1>
          <p>
            Payment receipt for customer
            {doc ? ` against ${doc.number}` : ''}. Print or share on WhatsApp.
          </p>
        </div>
        <div className="actions">
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            Print / PDF
          </button>
          <ShareWhatsAppButton
            doc={shareDoc}
            businessName={data.business.name}
            previewRef={previewRef}
          />
        </div>
      </div>

      <div className="split">
        <div className="panel no-print">
          <div className="panel-head">
            <h2>Receipt actions</h2>
          </div>
          <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>
            Send this receipt to the customer after recording the payment. From the related
            quote/invoice you can also generate a final invoice that deducts amounts already
            received.
          </p>
          <div className="actions">
            <Link className="btn btn-secondary" to="/payments">
              All payments
            </Link>
            {doc ? (
              <Link className="btn btn-primary" to={`/documents/${doc.id}`}>
                Open {doc.number}
              </Link>
            ) : null}
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              Print / PDF
            </button>
            <ShareWhatsAppButton
              doc={shareDoc}
              businessName={data.business.name}
              previewRef={previewRef}
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                deletePayment(payment.id)
                navigate('/payments')
              }}
            >
              Delete receipt
            </button>
          </div>
        </div>
        <div ref={previewRef}>
          <PaymentReceiptPreview paymentId={payment.id} />
        </div>
      </div>
    </>
  )
}
