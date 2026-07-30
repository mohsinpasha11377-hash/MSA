import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { AppProvider } from './context/AppContext'
import { ClientsPage } from './pages/ClientsPage'
import { Dashboard, DocumentListPage } from './pages/Dashboard'
import { DocumentPage } from './pages/DocumentPage'
import { SettingsPage } from './pages/SettingsPage'

function Shell() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="main">
        <button
          type="button"
          className="btn btn-secondary mobile-toggle no-print"
          style={{ marginBottom: '0.85rem' }}
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quotes" element={<DocumentListPage type="quote" />} />
          <Route path="/invoices" element={<DocumentListPage type="invoice" />} />
          <Route path="/bills" element={<DocumentListPage type="bill" />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/documents/:id" element={<DocumentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
