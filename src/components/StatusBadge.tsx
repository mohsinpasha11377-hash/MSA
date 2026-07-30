import { statusTone } from '../lib/utils'

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${statusTone(status)}`}>{status}</span>
}
