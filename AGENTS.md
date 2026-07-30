# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

**MSA** is intended to be a quote, bill, and invoice application (per the GitHub repository description). As of the initial commit, the repository contains only `README.md` — no application source code, dependency manifests, or service definitions.

## Repository state

| Artifact | Status |
|---|---|
| Application code | Not present |
| `package.json` / lockfiles | Not present |
| `docker-compose.yml` | Not present |
| `.env.example` | Not present |
| Tests / lint config | Not present |
| CI workflows | Not present |

When application code is added, update this file with stack-specific setup, run, lint, and test commands.

## Cursor Cloud specific instructions

### Current environment

The workspace is ready for development once source code lands. There are no dependencies to install and no services to start.

### Services

| Service | Required | Notes |
|---|---|---|
| *(none)* | — | No runnable services are defined in the repository yet |

### Lint / test / run

Not applicable until dependency manifests and scripts are added. After code is committed, re-scan the repo for:

- `package.json` scripts (`lint`, `test`, `dev`, `build`)
- `Makefile` targets
- `docker-compose.yml` service definitions
- `README.md` or `CONTRIBUTING.md` setup instructions

### Git

- Default branch: `main`
- Remote: `origin` → `github.com/mohsinpasha11377-hash/MSA`

### VM update script

The update script is a no-op (`true`) because the repository has no installable dependencies. When manifests are added (e.g. `package.json`, `requirements.txt`), replace the update script with the appropriate install command (`npm install`, `pnpm install`, `uv sync`, etc.).
