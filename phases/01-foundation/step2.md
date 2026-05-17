# Step 2: app/globals.css — @font-face + CSS 변수 + 전역 리셋

## 작업

`app/globals.css`를 **완전히 교체**하라. 기존 Tailwind/Geist 내용 전부 제거.

### 완성 파일 내용

```css
@import "tailwindcss";

/* ── NanumSquareNeo @font-face ─────────────────────── */
@font-face {
  font-family: 'NanumSquareNeo';
  src: url('/fonts/NanumSquareNeo-aLt.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'NanumSquareNeo';
  src: url('/fonts/NanumSquareNeo-bRg.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'NanumSquareNeo';
  src: url('/fonts/NanumSquareNeo-cBd.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'NanumSquareNeo';
  src: url('/fonts/NanumSquareNeo-dEb.ttf') format('truetype');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'NanumSquareNeo';
  src: url('/fonts/NanumSquareNeo-eHv.ttf') format('truetype');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* ── CSS 변수 ────────────────────────────────────────── */
:root {
  --bg: #FAFAF8;
  --purple-light: #C4B8F0;
  --purple-dark: #534AB7;
  --green-accent: #BFFFCC;
  --green-text: #1A5C35;
  --text-primary: #1A1A2E;
  --text-secondary: #6B6B8A;
  --card-border: #C4B8F0;
  --card-bg: #FFFFFF;
}

/* ── 전역 리셋 ────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  color-scheme: light;
}

body {
  font-family: 'NanumSquareNeo', sans-serif;
  font-weight: 400;
  background-color: var(--bg);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── 접근성: 모션 감소 ─────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**주의**: 실제 TTF 파일명은 step 1에서 확인한 파일명과 일치시켜야 한다.
`ls public/fonts/` 결과를 보고 정확한 파일명으로 `src: url(...)` 경로를 작성하라.

## Acceptance Criteria

```bash
# globals.css에 Geist 변수 없는지 확인
grep -i "geist\|--font-geist" app/globals.css && echo "FAIL" || echo "PASS"

# @font-face 존재 확인
grep "@font-face" app/globals.css | wc -l
# 출력이 3 이상이면 통과

# CSS 변수 확인
grep "var(--bg)" app/globals.css || grep "\-\-bg:" app/globals.css
# 둘 중 하나 존재하면 통과

# TypeScript 컴파일
npx tsc --noEmit
```

모든 AC 통과 후 step 2 status를 "completed"로 업데이트하라.
