import { documentLabel } from './utils'
import type { Document } from '../types'

type ShareableDoc = Pick<Document, 'number' | 'type'>

export function pdfFilename(doc: ShareableDoc): string {
  return `MSA-${doc.number}.pdf`
}

function shareLabel(doc: ShareableDoc): string {
  if (doc.number.startsWith('RCP')) return 'Payment Receipt'
  return documentLabel(doc.type)
}

export async function generateDocumentPdf(
  element: HTMLElement,
  doc: ShareableDoc,
): Promise<File> {
  const html2pdf = (await import('html2pdf.js')).default
  const filename = pdfFilename(doc)
  const options = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  }

  const blob = (await html2pdf().set(options).from(element).outputPdf('blob')) as Blob
  return new File([blob], filename, { type: 'application/pdf' })
}

function downloadFile(file: File): void {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}

function openWhatsAppWithMessage(message: string): void {
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export async function shareDocumentOnWhatsApp(
  doc: ShareableDoc,
  element: HTMLElement,
  businessName: string,
): Promise<'shared' | 'whatsapp-fallback' | 'cancelled'> {
  const label = shareLabel(doc)
  const file = await generateDocumentPdf(element, doc)
  const message = `${label} ${doc.number} from ${businessName}. Please find the PDF attached.`

  const canShareFiles =
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })

  if (canShareFiles) {
    try {
      await navigator.share({
        files: [file],
        title: `${label} ${doc.number}`,
        text: message,
      })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'cancelled'
      }
    }
  }

  downloadFile(file)
  openWhatsAppWithMessage(
    `${message}\n\nThe PDF "${file.name}" has been downloaded — please attach it in this WhatsApp chat.`,
  )
  return 'whatsapp-fallback'
}

export function findDocumentPreviewElement(root?: ParentNode | null): HTMLElement | null {
  const scope = root ?? document
  return scope.querySelector('.doc-sheet') as HTMLElement | null
}
