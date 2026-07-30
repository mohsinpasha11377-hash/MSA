import { useApp } from '../context/AppContext'
import {
  amountDue,
  documentLabel,
  formatCurrency,
  formatDate,
  grandTotal,
  lineTotal,
  paymentMethodLabel,
  subtotal,
  totalPaidForDocument,
} from '../lib/utils'
import type { Document } from '../types'
import { MsaLogo } from './MsaLogo'
import { StatusBadge } from './StatusBadge'

export function DocumentPreview({ doc }: { doc: Document }) {
  const { data, getClient, getDocument } = useApp()
  const client = getClient(doc.clientId)
  const parent = doc.parentDocumentId ? getDocument(doc.parentDocumentId) : undefined
  const currency = data.business.currency
  const sub = subtotal(doc.items)
  const total = grandTotal(doc.items, doc.taxRate)
  const credit = Number(doc.advanceCredit) || 0
  const due = amountDue(doc)
  const paidOnThis = totalPaidForDocument(data.payments, doc.id)

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
          <strong>
            {doc.isFinalBalance ? 'Final Invoice' : documentLabel(doc.type)}
          </strong>
          <div>{doc.number}</div>
          {parent ? <div className="meta-sub">Against {parent.number}</div> : null}
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
        <div>
          <span>Gross total</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
        {doc.isFinalBalance && credit > 0 ? (
          <div className="credit-line">
            <span>Less: Amount received earlier</span>
            <span>− {formatCurrency(credit, currency)}</span>
          </div>
        ) : null}
        {!doc.isFinalBalance && paidOnThis > 0 ? (
          <div className="credit-line">
            <span>Payments received</span>
            <span>− {formatCurrency(paidOnThis, currency)}</span>
          </div>
        ) : null}
        <div className="grand">
          <span>{doc.isFinalBalance || paidOnThis > 0 ? 'Balance due' : 'Total'}</span>
          <span>
            {formatCurrency(
              doc.isFinalBalance ? due : Math.max(0, total - paidOnThis),
              currency,
            )}
          </span>
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

export function PaymentReceiptPreview({ paymentId }: { paymentId: string }) {
  const { data, getClient, getDocument, getPayment } = useApp()
  const payment = getPayment(paymentId)
  if (!payment) return null

  const client = getClient(payment.clientId)
  const doc = getDocument(payment.documentId)
  const currency = data.business.currency

  return (
    <article className="doc-sheet receipt-sheet">
      <div className="doc-header">
        <div className="doc-brand">
          <MsaLogo className="doc-logo" />
          <p className="doc-business">
            <strong>{data.business.name}</strong>
            {'\n'}
            {data.business.address}
            {data.business.email ? `\n${data.business.email}` : ''}
            {data.business.phone ? `\n${data.business.phone}` : ''}
          </p>
        </div>
        <div className="meta">
          <strong>Payment Receipt</strong>
          <div>{payment.number}</div>
          <div className="meta-sub">Received {formatDate(payment.receivedDate)}</div>
        </div>
      </div>

      <div className="parties">
        <div>
          <h4>Received from</h4>
          <p>
            <strong>{client?.company || client?.name || '—'}</strong>
            {client?.name && client.company ? `\n${client.name}` : ''}
            {client?.address ? `\n${client.address}` : ''}
            {client?.email ? `\n${client.email}` : ''}
            {client?.phone ? `\n${client.phone}` : ''}
          </p>
        </div>
        <div>
          <h4>Against</h4>
          <p>
            {doc ? `${documentLabel(doc.type)} ${doc.number}` : '—'}
            {doc ? `\nStatus: ${doc.status}` : ''}
          </p>
        </div>
      </div>

      <div className="receipt-amount">
        <div className="label">Amount received</div>
        <div className="value">{formatCurrency(payment.amount, currency)}</div>
        <div className="method">via {paymentMethodLabel(payment.method)}</div>
      </div>

      {payment.notes ? (
        <div className="doc-notes">
          <strong>Notes</strong>
          <div>{payment.notes}</div>
        </div>
      ) : null}

      <p className="receipt-thanks">
        Thank you. This receipt acknowledges payment received by {data.business.name}.
      </p>
    </article>
  )
}
