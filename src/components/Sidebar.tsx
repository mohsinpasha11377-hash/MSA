import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Overview', end: true },
  { to: '/quotes', label: 'Quotes' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/bills', label: 'Bills' },
  { to: '/clients', label: 'Clients' },
  { to: '/settings', label: 'Settings' },
]

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {open ? <div className="backdrop" onClick={onClose} aria-hidden /> : null}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">MSA</div>
          <div className="brand-text">
            <strong>MSA</strong>
            <span>Quote · Bill · Invoice</span>
          </div>
        </div>

        <nav className="nav" onClick={onClose}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          Documents stay on this device. Export or print anytime —
          no account required.
        </div>
      </aside>
    </>
  )
}
