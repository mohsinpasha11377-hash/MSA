import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatDate, grandTotal, lineTotal, uid } from '../lib/utils'
import type { Document, DocumentStatus, DocumentType, LineItem } from '../types'
import { MEASUREMENT_UNITS } from '../types'
import { DocumentPreview } from './DocumentPreview'

const statusOptions: Record<DocumentType, DocumentStatus[]> = {
  quote: ['draft', 'sent', 'accepted', 'declined', 'void'],
  invoice: ['draft', 'sent', 'paid', 'overdue', 'void'],
  bill: ['draft', 'sent', 'paid', 'overdue', 'void'],
}

export function DocumentEditor({ doc }: { doc: Document }) {
  const navigate = useNavigate()
  const {
    data,
    upsertDocument,
    deleteDocument,
    convertQuoteToInvoice,
    setDocumentStatus,
  } = useApp()
  const [draft, setDraft] = useState<Document>(doc)
  const [savedFlash, setSavedFlash] = useState(false)

  const total = useMemo(
    () => grandTotal(draft.items, draft.taxRate),
    [draft.items, draft.taxRate],
  )

  function updateItem(id: string, patch: Partial<LineItem>) {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  function addItem() {
    setDraft((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: uid('li'),
          description: '',
          measurement: 1,
          unit: 'Sq.Ft',
          unitPrice: 0,
        },
      ],
    }))
  }

  function removeItem(id: string) {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.length <= 1 ? prev.items : prev.items.filter((i) => i.id !== id),
    }))
  }

  function save() {
    upsertDocument(draft)
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1600)
  }

  function onConvert() {
    const invoice = convertQuoteToInvoice(draft.id)
    if (invoice) navigate(`/documents/${invoice.id}`)
  }

  const typeLabel = draft.type[0].toUpperCase() + draft.type.slice(1)

  return (
    <div className="split">
      <div className="panel no-print">
        <div className="panel-head">
          <h2>
            Edit {typeLabel} · {draft.number}
          </h2>
          <div className="actions">
            {savedFlash ? <span className="badge badge-success">Saved</span> : null}
            <button type="button" className="btn btn-secondary btn-sm" onClick={save}>
              Save edits
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()}>
              Print
            </button>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Client
            <select
              value={draft.clientId}
              onChange={(e) => setDraft({ ...draft, clientId: e.target.value })}
            >
              <option value="">Select client</option>
              {data.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company || c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              value={draft.status}
              onChange={(e) => {
                const status = e.target.value as DocumentStatus
                setDraft({ ...draft, status })
                setDocumentStatus(draft.id, status)
              }}
            >
              {statusOptions[draft.type].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Issue date
            <input
              type="date"
              value={draft.issueDate}
              onChange={(e) => setDraft({ ...draft, issueDate: e.target.value })}
            />
          </label>
          <label>
            Due date
            <input
              type="date"
              value={draft.dueDate}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
            />
          </label>
          <label>
            Tax rate (%)
            <input
              type="number"
              min={0}
              step={0.01}
              value={draft.taxRate}
              onChange={(e) => setDraft({ ...draft, taxRate: Number(e.target.value) })}
            />
          </label>
          <label className="full">
            Notes
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              placeholder="Payment terms, validity, bank details…"
            />
          </label>
        </div>

        <div style={{ marginTop: '1.1rem' }}>
          <div className="panel-head">
            <h2>Line items</h2>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
              Add line
            </button>
          </div>
          <div className="items-editor">
            {draft.items.map((item) => (
              <div className="item-row item-row-meas" key={item.id}>
                <label className="item-desc">
                  Description
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    placeholder="Work / material description"
                  />
                </label>
                <label>
                  Measurement
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={item.measurement}
                    onChange={(e) => updateItem(item.id, { measurement: Number(e.target.value) })}
                  />
                </label>
                <label>
                  Unit of measurement
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                  >
                    {MEASUREMENT_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                    {!MEASUREMENT_UNITS.includes(item.unit as (typeof MEASUREMENT_UNITS)[number]) &&
                    item.unit ? (
                      <option value={item.unit}>{item.unit}</option>
                    ) : null}
                  </select>
                </label>
                <label>
                  Rate
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                  />
                </label>
                <label>
                  Amount
                  <input
                    readOnly
                    value={formatCurrency(lineTotal(item), data.business.currency)}
                  />
                </label>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm item-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove line"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="totals">
            <div className="grand">
              <span>Total</span>
              <span>{formatCurrency(total, data.business.currency)}</span>
            </div>
            <div style={{ fontSize: '0.85rem' }}>Updated {formatDate(draft.updatedAt)}</div>
          </div>
        </div>

        <div className="actions" style={{ marginTop: '1.25rem' }}>
          <Link className="btn btn-secondary" to={`/${draft.type}s`}>
            Back
          </Link>
          <button type="button" className="btn btn-secondary" onClick={save}>
            Save edits
          </button>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Print / PDF
          </button>
          {draft.type === 'quote' ? (
            <button type="button" className="btn btn-primary" onClick={onConvert}>
              Convert to invoice
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              deleteDocument(draft.id)
              navigate(`/${draft.type}s`)
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <DocumentPreview doc={draft} />
    </div>
  )
}
