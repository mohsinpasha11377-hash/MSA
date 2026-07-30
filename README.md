# MSA — Quotes, Bills & Invoices

**MSA** is a lightweight web app for creating and managing quotes, bills, and invoices. Data stays in your browser (localStorage). Print any document to PDF.

## Live app

**https://unrivaled-donut-9d84bb.netlify.app**  
Password: `My-Drop-Site`

Claim this site (required within 60 minutes to keep it live):  
https://app.netlify.com/drop/unrivaled-donut-9d84bb#drop_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODU0MTc5MjYsImV4cCI6MTc4NTQyMTUyNiwiaXNzIjoiTmV0bGlmeSIsInNlc3Npb25faWQiOiI2NzM4NzVkMC1hZjA3LTQwY2MtOGU0Ny01ZmJiNGU4ZjJhNGEifQ.eWd_DkYjhThmjwkIoDad66GztxFMq6QaH5dHOjLzPcM

**Permanent hosting (GitHub Pages):** enable *Settings → Pages → Deploy from branch → `gh-pages` / root*, then visit:
https://mohsinpasha11377-hash.github.io/MSA/

## Features

- **Quotes** — draft proposals, track status, convert to invoices
- **Invoices** — bill clients, track sent / paid / overdue
- **Bills** — track payables to vendors
- **Clients** — contact directory
- **Business settings** — name, address, tax ID, currency, default tax
- **Print / PDF** — A4 print-ready layout (browser → Save as PDF)
- **Share on WhatsApp** — generates an A4 PDF and shares via WhatsApp (all document types)

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

Vite · React 19 · TypeScript · React Router
