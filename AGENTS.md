# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

**MSA** is a quote, bill, and invoice web application. It is a client-side Vite + React + TypeScript SPA. Document data is stored in `localStorage` (key `msa-app-data-v1`).

Live URL (GitHub Pages): https://mohsinpasha11377-hash.github.io/MSA/

## Stack

- Vite 8 + React 19 + TypeScript
- React Router (`basename="/MSA"`)
- Oxlint
- Deployed with `gh-pages` to branch `gh-pages`

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
- Vite `base` is `/MSA/` for GitHub Pages — keep router basename in sync (`src/main.tsx`).
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
