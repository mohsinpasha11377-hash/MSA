import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { DocumentEditor } from '../components/DocumentEditor'
import { ShareWhatsAppButton } from '../components/ShareWhatsAppButton'
import { useApp } from '../context/AppContext'

export function DocumentPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { data } = useApp()
  const doc = data.documents.find((d) => d.id === id)
  const autoPrint = params.get('print') === '1'
  const autoWhatsApp = params.get('whatsapp') === '1'

  useEffect(() => {
    if (autoPrint && doc) {
      const timer = window.setTimeout(() => window.print(), 350)
      return () => window.clearTimeout(timer)
    }
  }, [autoPrint, doc])

  if (!doc) {
    return (
      <div className="panel">
        <div className="empty">
          <h3>Document not found</h3>
          <p>It may have been deleted.</p>
          <Link className="btn btn-primary" to="/">
            Back to overview
          </Link>
        </div>
      </div>
    )
  }

  const typeLabel = doc.type[0].toUpperCase() + doc.type.slice(1)

  return (
    <>
      <div className="topbar no-print">
        <div>
          <h1>
            Edit {typeLabel} {doc.number}
          </h1>
          <p>
            Update measurements, rates, and details on the left. Live preview with the MSA logo on the
            right — then print, save as PDF, or share on WhatsApp.
          </p>
        </div>
        <div className="actions">
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            Print / PDF
          </button>
          <ShareWhatsAppButton doc={doc} businessName={data.business.name} />
        </div>
      </div>
      <DocumentEditor key={doc.id} doc={doc} autoWhatsApp={autoWhatsApp} />
    </>
  )
}
