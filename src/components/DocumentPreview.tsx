import { useApp } from '../context/AppContext'
import { documentLabel, formatCurrency, formatDate, grandTotal, lineTotal, subtotal } from '../lib/utils'
import type { Document } from '../types'
import { StatusBadge } from './StatusBadge'
import { MsaLogo } from './MsaLogo'

export function DocumentPreview({ doc }: { doc: Document }) {
  const { data, getClient } = useApp()
  const client = getClient(doc.clientId)
  const currency = data.business.currency
  const sub = subtotal(doc.items)
  const total = grandTotal(doc.items, doc.taxRate)

  return (
    <article className="doc-sheet">
      <div className="doc-header">
        <div className="doc-brand">
          <MsaLogo className="doc-logo" />
          <p className="doc-business">
            <strong>{data.business.name}</strong>
            {'\n'}
            {data.business.address}
            {data.business.email ? `\n${data.business.email}` : ''}
            {data.business.phone ? `\n${data.business.phone}` : ''}
            {data.business.taxId ? `\nTax ID: ${data.business.taxId}` : ''}
          </p>
        </div>
        <div className="meta">
          <strong>{documentLabel(doc.type)}</strong>
          <div>{doc.number}</div>
          <div style={{ marginTop: '0.5rem' }}>
            <StatusBadge status={doc.status} />
          </div>
        </div>
      </div>

      <div className="parties">
        <div>
          <h4>{doc.type === 'bill' ? 'Vendor / party' : 'Bill to'}</h4>
          <p>
            <strong>{client?.company || client?.name || 'Select a client'}</strong>
            {client?.name && client.company ? `\n${client.name}` : ''}
            {client?.address ? `\n${client.address}` : ''}
            {client?.email ? `\n${client.email}` : ''}
            {client?.phone ? `\n${client.phone}` : ''}
          </p>
        </div>
        <div>
          <h4>Dates</h4>
          <p>
            Issued: {formatDate(doc.issueDate)}
            {'\n'}
            Due: {formatDate(doc.dueDate)}
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Measurement</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((item) => (
              <tr key={item.id}>
                <td>{item.description || '—'}</td>
                <td>{item.measurement || 0}</td>
                <td>{item.unit || '—'}</td>
                <td>{formatCurrency(item.unitPrice, currency)}</td>
                <td>{formatCurrency(lineTotal(item), currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="totals">
        <div>
          <span>Subtotal</span>
          <span>{formatCurrency(sub, currency)}</span>
        </div>
        <div>
          <span>Tax ({doc.taxRate}%)</span>
          <span>{formatCurrency(total - sub, currency)}</span>
        </div>
        <div className="grand">
          <span>Total</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
      </div>

      {doc.notes ? (
        <div className="doc-notes">
          <strong>Notes</strong>
          <div>{doc.notes}</div>
        </div>
      ) : null}
    </article>
  )
}
