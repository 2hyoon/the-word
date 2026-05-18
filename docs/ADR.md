# Architecture Decision Records

## Philosophy
MVP speed first. No external APIs or databases. A static app that runs entirely in the browser.
Choose the minimum viable implementation, extend in Phase 2.

---

### ADR-001: Next.js App Router
**Decision**: Next.js 16 App Router  
**Reason**: Project was already initialized with Next.js. Tight integration with Vercel deployment. SSR itself isn't needed, but the cost of switching frameworks outweighs the benefit.  
**Trade-off**: Browser-only libraries (D3, html2canvas) require `'use client'` + dynamic import.

---

### ADR-002: D3.js for Particle Animation
**Decision**: D3.js v7 — SVG-based particle system with `requestAnimationFrame`  
**Reason**: Fine-grained control over particle position, shape, and per-frame updates. D3's DOM manipulation API integrates cleanly with SVG.  
**Trade-off**: Bundle size ~70KB gzip. Mitigated with tree-shaking.  
**D3 + React conflict resolution**:
- D3 directly manipulates the DOM, which conflicts with React's virtual DOM
- Solution: `useRef<SVGSVGElement>` + D3 runs exclusively inside `useEffect`
- SVG internals are fully owned by D3 — no React state for SVG manipulation
- `useEffect` begins with `selectAll('*').remove()` to guard against StrictMode double-invocation
- Event listeners removed in cleanup

---

### ADR-003: NanumSquareNeo Local Font
**Decision**: NanumSquareNeo TTF, self-hosted via `@font-face` in `public/fonts/`  
**Reason**: A Korean typeface suited to the app's aesthetic, already available locally. No external CDN dependency. Faster load than fetching from a remote source.  
**Trade-off**: TTF files add ~2MB to the repo. `font-display: swap` minimizes FOUT.  
**Note**: Default Geist font import in `layout.tsx` must be removed entirely.

---

### ADR-004: Static JSON Bible Data
**Decision**: `data/verses.json` — static import, no API  
**Reason**: 120 verses. No DB or CMS needed. Zero API latency at build time.  
**Import**: `import verses from '@/data/verses.json'` (tsconfig `resolveJsonModule: true`)  
**Trade-off**: Adding or editing verses requires a redeployment.  
**Copyright**: Using Korean Bible text (개역개정 style) for non-commercial use. Formal permission from the Korean Bible Society to be sought if traffic grows.

---

### ADR-005: html2canvas + Off-screen ExportCard for 1080×1080 Output
**Decision**: Off-screen `ExportCard` (540×540px, `left: -9999px`) + html2canvas `scale: 2`  
**Reason**:
- Screen card (~340px) × scale 2 = 680px — falls short of the 1080px target
- ExportCard 540px × scale 2 = exactly 1080×1080
- `display: none` / `visibility: hidden` prevents html2canvas from capturing — use `position: absolute; left: -9999px` instead  
**Trade-off**: The same verse renders twice (screen card + ExportCard). Performance impact is negligible.  
**Font issue**: `await document.fonts.ready` is required before capture to prevent fallback font rendering.  
**Mobile save**: iOS Safari doesn't support `<a download>` — use `navigator.share({ files: [File] })` as fallback (iOS only; desktop uses direct download).  
**Error handling**: Wrap in try/catch. Show inline error message for 3 seconds on failure.

---

### ADR-006: Server/Client Component Split (HomeClient Pattern)
**Decision**: `page.tsx` as Server Component + `HomeClient.tsx` as Client Component  
**Reason**:
- Marking `page.tsx` as `'use client'` would pull the entire subtree into the client bundle
- Recommended pattern for Next.js App Router
- `verses.json` import is handled on the server  
**Trade-off**: Adds `HomeClient.tsx` as a wrapper file and requires passing `verses` as props.

---

### ADR-007: #BFFFCC Mint Green as Secondary Accent
**Decision**: `#BFFFCC` (mint green) added as a secondary accent color  
**Reason**: The purple palette (`#C4B8F0` / `#534AB7`) alone felt monotonous. Purple and mint green provide a near-complementary contrast that adds visual energy without clashing.  
**Usage**: Secondary button background, save success feedback, title accent underline  
**Text on green**: `#1A5C35` (contrast ratio ~5.7:1, WCAG AA compliant)  
**Rule**: Purple is primary; green is accent. Never use them at equal visual weight.

---

### ADR-008: Particle Color-Coding by Biblical Section
**Decision**: Map each Bible book to one of four color groups based on its section  
**Reason**: 120 verses from 29 books across the canvas looked visually monotonous. Color grouping adds meaning and visual variety without cluttering the design.  
**Groups**:
| Group | Books | Fill |
|---|---|---|
| OT Wisdom | Psalms, Proverbs | `#F5E6C0` |
| OT Prophets & History | Isaiah, Jeremiah, Daniel, Minor Prophets, Joshua | `#F0C4B8` |
| Gospels | Matthew, Mark, Luke, John | `#C4B8F0` |
| Epistles & Revelation | Romans → Revelation | `#BFFFCC` |

---

### ADR-009: Harness Engineering Methodology
**Decision**: Structured phase/step development using `scripts/execute.py`  
**Reason**: Breaks implementation into clearly scoped units. Each step has explicit acceptance criteria verifiable via terminal commands. Enables AI-assisted development with Claude CLI while maintaining predictable, reviewable output.  
**Trade-off**: Requires upfront step file authoring. Inter-step dependencies must be explicitly defined.  
**Step authoring principle**: Each step must be independently executable. Acceptance criteria are written as shell commands. On completion, `index.json` status is updated to `"completed"` with a one-line summary.
