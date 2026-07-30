import { Link, useParams } from 'react-router-dom'
import { DocumentEditor } from '../components/DocumentEditor'
import { useApp } from '../context/AppContext'

export function DocumentPage() {
  const { id } = useParams()
  const { data } = useApp()
  const doc = data.documents.find((d) => d.id === id)

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

  return (
    <>
      <div className="topbar no-print">
        <div>
          <h1>
            {doc.type[0].toUpperCase() + doc.type.slice(1)} {doc.number}
          </h1>
          <p>Edit details on the left. Preview updates live on the right.</p>
        </div>
      </div>
      <DocumentEditor key={doc.id} doc={doc} />
    </>
  )
}
