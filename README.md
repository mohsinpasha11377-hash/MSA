# MSA — Quotes, Bills & Invoices

**MSA** is a lightweight web app for creating and managing quotes, bills, and invoices. Data stays in your browser (localStorage). Print any document to PDF.

## Live app

https://mohsinpasha11377-hash.github.io/MSA/

## Features

- **Quotes** — draft proposals, track status, convert accepted quotes into invoices
- **Invoices** — bill clients, track sent / paid / overdue
- **Bills** — track payables to vendors
- **Clients** — simple contact directory
- **Business settings** — name, address, tax ID, currency, default tax rate
- **Print / PDF** — print-ready document layout

## Develop

```bash
npm install
npm run dev
```

## Build & deploy (GitHub Pages)

```bash
npm run build
npm run deploy
```

The site is published from the `gh-pages` branch to `/MSA/`.

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
