# AGENTS.md

## Cursor Cloud specific instructions

This is a static portfolio website with Vercel serverless functions for an AI chatbot (Google Gemini).

### Architecture
- **Frontend**: Static HTML/CSS/JS served from the repo root (`index.html`, `styles.css`, `script.js`, `chatbot.js`)
- **API**: Two Vercel serverless functions in `api/` — `chat.js` (POST, proxies to Gemini) and `health.js` (GET, health check)
- **External dependency**: `GEMINI_API_KEY` env var for Google Gemini API (chatbot won't work without it)

### Running locally
- The project uses `vercel dev` (see README), which requires Vercel CLI authentication. Without Vercel credentials, use the `dev-server.mjs` file in the repo root as a lightweight alternative: `node dev-server.mjs` (serves static files on port 3000 and routes `/api/*` to the serverless functions).
- Create `.env.local` with `GEMINI_API_KEY=<your-key>` — the dev server loads this file automatically.
- Node.js 20.x is required (`"engines"` in `package.json`). Use `nvm use 20`.

### Build / Lint / Test
- `npm run build` — no-op for this static site (prints a message).
- No ESLint, Prettier, or test framework is configured. Use `node --check <file>` for JS syntax validation.
- No automated tests exist.

### Gotchas
- The `api/chat.js` and `api/health.js` use ES module `export default` syntax. Node warns about missing `"type": "module"` in `package.json` — this is harmless and expected in the Vercel runtime.
- The chatbot UI returns "Failed to generate response" when `GEMINI_API_KEY` is missing or invalid — this is the expected error path, not a bug.
