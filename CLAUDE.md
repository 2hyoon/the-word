# Project: the Word

## Tech Stack
- Next.js 16 (App Router)
- TypeScript strict mode (`"strict": true`, `"resolveJsonModule": true` in `tsconfig.json`)
- Tailwind CSS v4
- html2canvas (image export)
- NanumSquareNeo (local font, TTF — `public/fonts/`)

## Path Alias
- `@/*` → `./*` (project root) — configured in `tsconfig.json`
- e.g. `@/types`, `@/data/verses.json`, `@/lib/wheel`, `@/components/Wheel`

## Directory Structure
```
app/           # page.tsx (Server Component) + layout.tsx + globals.css
components/    # HomeClient.tsx, ParticleCanvas.tsx, VerseCard.tsx, ExportCard.tsx
data/          # verses.json (static Bible verse data)
lib/           # image.ts (html2canvas utils)
types/         # index.ts (Verse, Category types + CATEGORIES constant)
public/fonts/  # NanumSquareNeo TTF (5 weights)
assets/        # fonts/, reference/, design brainstorm PDF
docs/          # ADR.md, ARCHITECTURE.md, PRD.md, UI_GUIDE.md
phases/        # Harness phase/step definitions
```

## layout.tsx Rules
- CRITICAL: `<html lang="ko">` — Korean-language app
- CRITICAL: Add `color-scheme: light` meta to `<html>` or `<head>`
- Include OG meta tags: `og:title`, `og:description`, `og:image`, `og:type`

## Architecture Rules
- CRITICAL: Keep `page.tsx` as a Server Component. Delegate state and event logic to `HomeClient.tsx` (`'use client'`)
- CRITICAL: Use static imports for JSON — `import verses from '@/data/verses.json'` (`resolveJsonModule: true` is enabled)
- CRITICAL: Any component containing D3 code must declare `'use client'`
- CRITICAL: Use `dynamic(() => import('html2canvas'), { ssr: false })` for html2canvas
- Use `@/` alias — no relative paths like `../../`

## ParticleCanvas Rules
- Raw SVG + direct DOM manipulation — no D3 dependency
- At the start of `useEffect`, clear all SVG children before re-rendering — guards against React StrictMode double-invocation
- Always cancel `requestAnimationFrame` and remove pointer event listeners in `useEffect` cleanup
- `CANVAS_SCALE = 2`: internal canvas is 2× the viewport; particles pan within this larger space on drag
- Particle click: resolve the clicked verse via `data-index` attribute on the SVG element

## html2canvas Rules
- `await document.fonts.ready` before capture — prevents fallback font rendering when fonts aren't loaded
- 1080×1080 output: off-screen hidden `ExportCard` (540px fixed, `overflow: hidden`) + `scale: 2`
- Wrap in try/catch — show inline error message on capture failure
- Mobile Safari fallback for `<a download>`: use `navigator.share({ files: [File] })`

## Design Rules
- Background `#FAFAF8`, purple accent `#C4B8F0` / `#534AB7`, green accent `#BFFFCC`
- Font: NanumSquareNeo (weights 300/400/700/800/900)
- Force light mode: `color-scheme: light` (no dark mode support)
- No AI slop: no backdrop-filter blur, gradient orbs, glow animations, or gradient-text
- D3 wheel: thin stroke style 1–1.5px, fill opacity 0.05 or less

## Development Rules
- Commits: conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- Comments only when the WHY is non-obvious
- After completing a harness step, update `phases/<phase>/index.json` status → `"completed"` + add summary

## Commands
```
npm run dev      # dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
python3 scripts/execute.py <phase-dir>  # run harness
```
