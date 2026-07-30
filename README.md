# MSA — Quotes, Bills & Invoices

**MSA** is a lightweight web app for creating and managing quotes, bills, and invoices. Data stays in your browser (localStorage). Print any document to PDF.

## Live app

**https://funny-ganache-114e12.netlify.app**  
Password: `My-Drop-Site`

Claim this site (required within 60 minutes to keep it live):  
https://app.netlify.com/drop/funny-ganache-114e12#drop_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODU0MTQ1OTUsImV4cCI6MTc4NTQxODE5NSwiaXNzIjoiTmV0bGlmeSIsInNlc3Npb25faWQiOiI5M2Y0MTUwMS05NDE4LTRhODctOTQ1ZS0wNDIzZmJiNmU3ZjEifQ.UlZrttiQ4Amm7sN4ZhqFqDhDlNj5xVb435Ram8l1PHs

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
