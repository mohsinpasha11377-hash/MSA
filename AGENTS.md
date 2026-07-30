# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

**MSA** is a quote, bill, and invoice web application. It is a client-side Vite + React + TypeScript SPA. Document data is stored in `localStorage` (key `msa-app-data-v2`).

Live (Netlify drop): https://unrivaled-donut-9d84bb.netlify.app (password `My-Drop-Site`)

GitHub Pages (enable Pages → branch `gh-pages`): https://mohsinpasha11377-hash.github.io/MSA/

## Stack

- Vite 8 + React 19 + TypeScript
- React Router (`HashRouter`)
- Oxlint
- Deployed with `gh-pages` + optional Netlify drop

## Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| Preview | `npm run preview` |
| Deploy Pages | `npm run deploy` |

## Cursor Cloud notes

- After pulling changes, run `npm install`.
- No backend or Docker services are required.
- Vite uses relative `base: './'` so the same build works on GitHub Pages and root hosts.
- Routing uses `HashRouter` for static hosting compatibility (no server rewrite needed).
- SPA fallback for Pages: `predeploy` copies `dist/index.html` → `dist/404.html`.

## Source layout

```
src/
  components/   Sidebar, DocumentEditor, DocumentPreview, StatusBadge
  context/      AppProvider + useApp
  lib/          storage, utils
  pages/        Dashboard, lists, clients, settings, document editor
  types.ts
```
