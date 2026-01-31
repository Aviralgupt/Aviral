# Voice Bot & Google Vertex AI / Cloud Setup Guide

## How it works now (no extra backend)

- **Chatbot**: Text chat using your existing **Vercel** `/api/chat` (Gemini API).
- **Voice bot**: Same backend. Flow: **browser mic (Web Speech API)** → text → **POST /api/chat** → text reply → **browser speaker (speechSynthesis)**. No server-side voice APIs yet.

To make the AI assistant work, set **`GEMINI_API_KEY`** in Vercel:

1. [Google AI Studio](https://makersuite.google.com/app/apikey) → Create API key.
2. Vercel → Your project → **Settings** → **Environment Variables** → Add `GEMINI_API_KEY` = your key.
3. **Redeploy** the project.

---

## Using Google Vertex AI & Google Cloud (for free tier)

If you want to move to **Vertex AI** (e.g. Gemini on Vertex, or full voice with Cloud STT/TTS), use a **GCP project** and stay within free tier where possible.

### 1. Create a GCP project and enable APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or pick one).
3. Enable these APIs (APIs & Services → Enable APIs and Services):
   - **Vertex AI API** – for Gemini on Vertex.
   - (Optional) **Cloud Speech-to-Text API** – server-side STT (free: 60 min/month).
   - (Optional) **Cloud Text-to-Speech API** – server-side TTS (free: 0–4M chars/month).

### 2. Free tier (typical limits)

| Service | Free tier |
|--------|-----------|
| Vertex AI (Gemini) | Free tier available; check [Vertex AI pricing](https://cloud.google.com/vertex-ai/pricing). |
| Speech-to-Text | 60 minutes/month. |
| Text-to-Speech | 4M characters/month (standard voices). |

Billing must be enabled on the project, but you can set a budget and alerts so you don’t exceed free usage.

### 3. Option A: Keep current setup (recommended for now)

- Keep using **Gemini API** via **Vercel** (`GEMINI_API_KEY`).
- Voice bot stays: **browser STT → /api/chat → browser TTS**.
- No Vertex or Cloud setup required.

### 4. Option B: Use Vertex AI for the “brain” (same voice flow)

Use **Vertex AI Gemini** instead of the Gemini API for the text reply, while still using browser mic/speaker:

1. In GCP: enable **Vertex AI API** and create a **service account** with “Vertex AI User” (or similar).
2. Create a **JSON key** for that service account.
3. In **Vercel** → Environment Variables, add:
   - `GOOGLE_CLOUD_PROJECT` = your GCP project ID  
   - `GOOGLE_APPLICATION_CREDENTIALS` = contents of the JSON key (or use a secret manager).

4. Add a serverless function (e.g. `/api/vertex-chat`) that:
   - Uses `@google-cloud/vertexai` (or REST) to call **Vertex AI Gemini** with your portfolio context.
   - Same request/response shape as `/api/chat` (message in, text out).

5. In the frontend, point the voice bot (and optionally chatbot) to `/api/vertex-chat` instead of `/api/chat` when you want to use Vertex.

### 5. Option C: Full Cloud voice (STT + Vertex + TTS)

For **server-side** speech:

1. **Backend** (e.g. Cloud Functions or Cloud Run):
   - Receives **audio** (or uses a client that sends audio).
   - Calls **Speech-to-Text** → text.
   - Calls **Vertex AI Gemini** with that text and your context → reply text.
   - Calls **Text-to-Speech** → audio.
   - Returns **audio** (or stream) to the client.

2. **Frontend**:
   - Record microphone (e.g. MediaRecorder or Web Audio).
   - Send audio to that backend; play returned audio.

This requires more code (recording, streaming, CORS, auth) and is optional; the current browser STT + Gemini API + browser TTS is enough for the portfolio voice bot.

---

## Quick checklist (current site)

- [ ] Set **`GEMINI_API_KEY`** in Vercel (Project → Settings → Environment Variables).
- [ ] Redeploy so the new env var is used.
- [ ] Test **Chatbot**: open assistant → “Chatbot” → type and send.
- [ ] Test **Voice bot**: open assistant → “Voice bot” → click mic, speak, hear reply.

If you see “Gemini API key not configured” or connection errors, the key is missing or not applied to the deployment (redeploy after adding it).
