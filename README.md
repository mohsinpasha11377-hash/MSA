# MSA — Quotes, Bills & Invoices

**MSA Interior and Exterior** — create quotes, bills, and invoices with measurements, payments, and receipts. Data stays in your browser. Print or share PDFs on WhatsApp.

## Live app

**https://inquisitive-entremet-54d70c.netlify.app**  
Password: `My-Drop-Site`

Claim this site (required within 60 minutes to keep it live):  
https://app.netlify.com/drop/inquisitive-entremet-54d70c#drop_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODU0MTkxNTIsImV4cCI6MTc4NTQyMjc1MiwiaXNzIjoiTmV0bGlmeSIsInNlc3Npb25faWQiOiI0NmYzMjMzZC1kZmVjLTQwYjMtYWU2OS0zZTNjNmI5ZTc4YTcifQ.q-2CdawaYTQQv6C4C_Wtl25TkgefxK0ilfpXnET8Ahg

**Permanent hosting (GitHub Pages):** enable *Settings → Pages → Deploy from branch → `gh-pages` / root*, then visit:
https://mohsinpasha11377-hash.github.io/MSA/

## Features

- **Quotes / Invoices / Bills** — line items with measurement & unit
- **Payments** — record amounts received against quotes or invoices
- **Payment receipts** — printable / WhatsApp receipts for customers
- **Final invoice** — deduct prior advances and bill the balance due
- **MSA logo** on documents and receipts
- **Print / PDF** — A4 layout
- **Share on WhatsApp** — A4 PDF share for documents and receipts

## Develop

```bash
npm install
npm run dev
```

## Build & deploy

```bash
npm run build
npm run deploy   # publishes dist/ to the gh-pages branch
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Oxlint |
| `npm run deploy` | Build and publish to GitHub Pages |

## Stack

Vite · React 19 · TypeScript · React Router · html2pdf.js
