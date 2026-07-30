# MSA — Quotes, Bills & Invoices

**MSA** is a lightweight web app for creating and managing quotes, bills, and invoices. Data stays in your browser (localStorage). Print any document to PDF.

## Live app

**https://eloquent-seahorse-a10d23.netlify.app**  
Password: `My-Drop-Site`

Claim this site (required within 60 minutes to keep it live):  
https://app.netlify.com/drop/eloquent-seahorse-a10d23#drop_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODU0MTczNzMsImV4cCI6MTc4NTQyMDk3MywiaXNzIjoiTmV0bGlmeSIsInNlc3Npb25faWQiOiJmMzM0ZjFiYi1mNTY0LTRhMGMtOTJlZi02MmM0ODhlYWNmZDYifQ.oBRp6EIOEx8H47mSSESwbKywfVk33EoYOgyz7PSmuvY

**Permanent hosting (GitHub Pages):** enable *Settings → Pages → Deploy from branch → `gh-pages` / root*, then visit:
https://mohsinpasha11377-hash.github.io/MSA/

## Features

- **Quotes** — draft proposals, track status, convert to invoices
- **Invoices** — bill clients, track sent / paid / overdue
- **Bills** — track payables to vendors
- **Clients** — contact directory
- **Business settings** — name, address, tax ID, currency, default tax
- **Print / PDF** — print-ready layout (browser → Save as PDF)

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
