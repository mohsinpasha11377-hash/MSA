# MSA — Quotes, Bills & Invoices

**MSA** is a lightweight web app for creating and managing quotes, bills, and invoices. Data stays in your browser (localStorage). Print any document to PDF.

## Live app

**https://cozy-lokum-18385d.netlify.app**  
Password: `My-Drop-Site`

> Anonymous Netlify drops expire unless claimed. Open the claim link from the deploy output (or Settings → claim) within 60 minutes to keep it permanently.

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
