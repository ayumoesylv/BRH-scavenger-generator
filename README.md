# Campus Scavenger Generator (Next.js + Gemini)

A minimal Next.js (App Router, TypeScript) app that calls the Gemini API to generate location-specific scavenger hunt items.

## Folder structure
```
scavenger-gemini/
├─ app/
│  ├─ api/
│  │  └─ generate/
│  │     └─ route.ts         # Server route that calls Gemini
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx               # UI with dropdowns & results
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
├─ tsconfig.json
└─ README.md
```

## Setup
1. **Install deps**
   ```bash
   npm i
   ```
2. **Create `.env.local`** at project root:
   ```env
   GEMINI_API_KEY=YOUR_KEY_HERE
   GEMINI_MODEL=gemini-2.5-flash
   ```
   - Get a key from Google AI Studio.
3. **Run dev server**
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Notes
- The API key stays server-side (in the API route).
- Output is enforced with JSON Mode via `responseSchema`.
- Tailwind is set up for basic styling; tweak `app/globals.css` and `tailwind.config.ts` as you like.
