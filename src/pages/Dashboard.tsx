import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatDate, grandTotal } from '../lib/utils'
import type { Document, DocumentType } from '../types'

function DocActions({ doc }: { doc: Document }) {
  const navigate = useNavigate()
  return (
    <div className="actions">
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => navigate(`/documents/${doc.id}`)}
      >
        Edit
      </button>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => navigate(`/documents/${doc.id}?print=1`)}
      >
        Print
      </button>
      <button
        type="button"
        className="btn btn-whatsapp btn-sm"
        onClick={() => navigate(`/documents/${doc.id}?whatsapp=1`)}
        title="Generate A4 PDF and share on WhatsApp"
      >
        WhatsApp
      </button>
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const { data, createDocument, getClient } = useApp()
  const currency = data.business.currency

  const stats = useMemo(() => {
    const invoices = data.documents.filter((d) => d.type === 'invoice')
    const quotes = data.documents.filter((d) => d.type === 'quote')
    const outstanding = invoices
      .filter((d) => d.status === 'sent' || d.status === 'overdue')
      .reduce((s, d) => s + grandTotal(d.items, d.taxRate), 0)
    const paid = invoices
      .filter((d) => d.status === 'paid')
      .reduce((s, d) => s + grandTotal(d.items, d.taxRate), 0)
    return {
      clients: data.clients.length,
      quotes: quotes.length,
      outstanding,
      paid,
    }
  }, [data])

  const recent = useMemo(
    () =>
      [...data.documents]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 6),
    [data.documents],
  )

  function create(type: DocumentType) {
    const doc = createDocument(type)
    navigate(`/documents/${doc.id}`)
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>MSA</h1>
          <p>
            Quotes, bills, and invoices for {data.business.name} — interior &amp; exterior works.
          </p>
        </div>
        <div className="actions">
          <button type="button" className="btn btn-secondary" onClick={() => create('quote')}>
            New quote
          </button>
          <button type="button" className="btn btn-primary" onClick={() => create('invoice')}>
            New invoice
          </button>
        </div>
      </div>

      <div className="grid-stats">
        <div className="stat">
          <div className="label">Outstanding</div>
          <div className="value">{formatCurrency(stats.outstanding, currency)}</div>
        </div>
        <div className="stat">
          <div className="label">Collected</div>
          <div className="value">{formatCurrency(stats.paid, currency)}</div>
        </div>
        <div className="stat">
          <div className="label">Open quotes</div>
          <div className="value">{stats.quotes}</div>
        </div>
        <div className="stat">
          <div className="label">Clients</div>
          <div className="value">{stats.clients}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Recent documents</h2>
          <div className="actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => create('bill')}>
              New bill
            </button>
          </div>
        </div>
        {recent.length === 0 ? (
          <div className="empty">
            <h3>No documents yet</h3>
            <p>Create a quote or invoice to get started.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Type</th>
                  <th>Client</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((doc) => {
                  const client = getClient(doc.clientId)
                  return (
                    <tr key={doc.id}>
                      <td>
                        <Link to={`/documents/${doc.id}`}>{doc.number}</Link>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{doc.type}</td>
                      <td>{client?.company || client?.name || '—'}</td>
                      <td>{formatDate(doc.dueDate)}</td>
                      <td>
                        <StatusBadge status={doc.status} />
                      </td>
                      <td>{formatCurrency(grandTotal(doc.items, doc.taxRate), currency)}</td>
                      <td className="no-print">
                        <DocActions doc={doc} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export function DocumentListPage({ type }: { type: DocumentType }) {
  const navigate = useNavigate()
  const { data, createDocument, getClient } = useApp()
  const [status, setStatus] = useState('all')
  const title = type === 'quote' ? 'Quotes' : type === 'bill' ? 'Bills' : 'Invoices'

  const docs = useMemo(() => {
    return data.documents
      .filter((d) => d.type === type)
      .filter((d) => (status === 'all' ? true : d.status === status))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }, [data.documents, status, type])

  const statuses = ['all', 'draft', 'sent', 'partial', 'paid', 'accepted', 'overdue', 'declined', 'void']

  return (
    <>
      <div className="topbar">
        <div>
          <h1>{title}</h1>
          <p>
            {type === 'quote' && 'Propose interior & exterior work with measurements, then convert to invoices.'}
            {type === 'invoice' && 'Edit invoices anytime, track payment, and print branded PDFs.'}
            {type === 'bill' && 'Track payables for materials and vendor work with units of measurement.'}
          </p>
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const doc = createDocument(type)
              navigate(`/documents/${doc.id}`)
            }}
          >
            New {type}
          </button>
        </div>
      </div>

      <div className="filters no-print">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            className={`chip${status === s ? ' active' : ''}`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="panel">
        {docs.length === 0 ? (
          <div className="empty">
            <h3>No {title.toLowerCase()} found</h3>
            <p>Create one or clear the status filter.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Client</th>
                  <th>Issued</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => {
                  const client = getClient(doc.clientId)
                  return (
                    <tr key={doc.id}>
                      <td>
                        <Link to={`/documents/${doc.id}`}>{doc.number}</Link>
                      </td>
                      <td>{client?.company || client?.name || '—'}</td>
                      <td>{formatDate(doc.issueDate)}</td>
                      <td>{formatDate(doc.dueDate)}</td>
                      <td>
                        <StatusBadge status={doc.status} />
                      </td>
                      <td>
                        {formatCurrency(grandTotal(doc.items, doc.taxRate), data.business.currency)}
                      </td>
                      <td className="no-print">
                        <DocActions doc={doc} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
