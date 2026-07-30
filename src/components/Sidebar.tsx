import { NavLink } from 'react-router-dom'
import { MsaLogo } from './MsaLogo'

const links = [
  { to: '/', label: 'Overview', end: true },
  { to: '/quotes', label: 'Quotes' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/bills', label: 'Bills' },
  { to: '/payments', label: 'Payments' },
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
          <MsaLogo compact className="brand-logo" />
          <div className="brand-text">
            <strong>MSA</strong>
            <span>Interior &amp; Exterior</span>
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
          Quotes, bills &amp; invoices for MSA Interior and Exterior.
          Data stays on this device.
        </div>
      </aside>
    </>
  )
}
