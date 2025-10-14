# DevCompanion (Prototype)

DevCompanion — an AI-driven code mentor prototype.

## Project layout

- `client/` — Next.js (App Router) frontend with TailwindCSS and Monaco editor
- `server/` — Express backend (Mongoose, AI integration, snapshots API)

## Quick start

1. Copy `.env.example` to `.env` and fill in `OPENAI_API_KEY` and `MONGODB_URI`.
2. Install dependencies:
   ```bash
   npm install
   npm --workspace=client install
   npm --workspace=server install
