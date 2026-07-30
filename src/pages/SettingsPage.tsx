import { useState, type FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import type { BusinessProfile } from '../types'

export function SettingsPage() {
  const { data, updateBusiness, resetDemoData } = useApp()
  const [form, setForm] = useState<BusinessProfile>(data.business)
  const [saved, setSaved] = useState(false)

  function save(e: FormEvent) {
    e.preventDefault()
    updateBusiness(form)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1600)
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Settings</h1>
          <p>Your business details appear on every quote, bill, and invoice.</p>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 720 }}>
        <div className="panel-head">
          <h2>Business profile</h2>
          {saved ? <span className="badge badge-success">Saved</span> : null}
        </div>
        <form className="form-grid" onSubmit={save}>
          <label>
            Business name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Tax ID / GSTIN
            <input
              value={form.taxId}
              onChange={(e) => setForm({ ...form, taxId: e.target.value })}
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
          <label>
            Currency
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              <option value="INR">INR — Indian Rupee</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="AED">AED — UAE Dirham</option>
            </select>
          </label>
          <label>
            Default tax rate (%)
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.defaultTaxRate}
              onChange={(e) => setForm({ ...form, defaultTaxRate: Number(e.target.value) })}
            />
          </label>
          <div className="full actions">
            <button type="submit" className="btn btn-primary">
              Save settings
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (confirm('Reset all local data to demo sample?')) {
                  resetDemoData()
                  setForm(data.business)
                  window.location.reload()
                }
              }}
            >
              Reset demo data
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
