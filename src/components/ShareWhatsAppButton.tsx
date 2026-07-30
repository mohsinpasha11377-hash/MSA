import { useState, type RefObject } from 'react'
import { findDocumentPreviewElement, shareDocumentOnWhatsApp } from '../lib/sharePdf'
import type { Document } from '../types'

type ShareWhatsAppButtonProps = {
  doc: Pick<Document, 'number' | 'type'>
  businessName: string
  /** Ref to a container that holds .doc-sheet */
  previewRef?: RefObject<HTMLElement | null>
  className?: string
  size?: 'sm' | 'md'
  onBeforeShare?: () => void
}

export function ShareWhatsAppButton({
  doc,
  businessName,
  previewRef,
  className = '',
  size = 'md',
  onBeforeShare,
}: ShareWhatsAppButtonProps) {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  async function onShare() {
    onBeforeShare?.()
    const el = findDocumentPreviewElement(previewRef?.current ?? document)
    if (!el) {
      setStatus('Open the document to share')
      window.setTimeout(() => setStatus(null), 2200)
      return
    }

    setBusy(true)
    setStatus(null)
    try {
      const result = await shareDocumentOnWhatsApp(doc, el, businessName)
      if (result === 'shared') setStatus('Shared')
      else if (result === 'whatsapp-fallback') setStatus('PDF ready — attach in WhatsApp')
      else setStatus(null)
    } catch {
      setStatus('Could not create PDF')
    } finally {
      setBusy(false)
      window.setTimeout(() => setStatus(null), 2800)
    }
  }

  const sizeClass = size === 'sm' ? 'btn-sm' : ''

  return (
    <span className="share-wa-wrap">
      <button
        type="button"
        className={`btn btn-whatsapp ${sizeClass} ${className}`.trim()}
        onClick={() => void onShare()}
        disabled={busy}
        title="Generate A4 PDF and share on WhatsApp"
        data-share-whatsapp="true"
      >
        {busy ? 'Preparing PDF…' : 'Share on WhatsApp'}
      </button>
      {status ? <span className="share-wa-status">{status}</span> : null}
    </span>
  )
}
