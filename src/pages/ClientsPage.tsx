import { useState, type FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import { todayISO, uid } from '../lib/utils'
import type { Client } from '../types'

const emptyClient = (): Omit<Client, 'createdAt'> => ({
  id: uid('cli'),
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
})

export function ClientsPage() {
  const { data, upsertClient, deleteClient } = useApp()
  const [form, setForm] = useState(emptyClient())
  const [editing, setEditing] = useState(false)

  function startEdit(client: Client) {
    setForm(client)
    setEditing(true)
  }

  function reset() {
    setForm(emptyClient())
    setEditing(false)
  }

  function save(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() && !form.company.trim()) return
    upsertClient({
      ...form,
      createdAt: editing
        ? data.clients.find((c) => c.id === form.id)?.createdAt
        : todayISO(),
    })
    reset()
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Clients</h1>
          <p>People and companies you quote, invoice, or pay.</p>
        </div>
      </div>

      <div className="split">
        <div className="panel">
          <div className="panel-head">
            <h2>{editing ? 'Edit client' : 'Add client'}</h2>
            {editing ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
                Cancel
              </button>
            ) : null}
          </div>
          <form className="form-grid" onSubmit={save}>
            <label>
              Company
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Acme Pvt Ltd"
              />
            </label>
            <label>
              Contact name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Primary contact"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="full">
              Address
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>
            <div className="full actions">
              <button type="submit" className="btn btn-primary">
                {editing ? 'Update client' : 'Save client'}
              </button>
            </div>
          </form>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Directory ({data.clients.length})</h2>
          </div>
          {data.clients.length === 0 ? (
            <div className="empty">
              <h3>No clients yet</h3>
              <p>Add your first client to start quoting.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.clients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <strong>{client.company || client.name}</strong>
                        <div style={{ color: 'var(--ink-soft)', fontSize: '0.86rem' }}>
                          {client.email || client.phone || '—'}
                        </div>
                      </td>
                      <td>{client.name || '—'}</td>
                      <td>
                        <div className="actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => startEdit(client)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteClient(client.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
