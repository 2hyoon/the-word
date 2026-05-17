# 프로젝트: the Word

## 기술 스택
- Next.js 16 (App Router)
- TypeScript strict mode (`tsconfig.json`에 `"strict": true`, `"resolveJsonModule": true` 설정됨)
- Tailwind CSS v4
- D3.js v7 (원형 휠 시각화)
- html2canvas (이미지 저장)
- NanumSquareNeo (로컬 폰트, TTF — `public/fonts/`)

## 경로 alias
- `@/*` → `./*` (루트 기준) — tsconfig.json에 설정됨
- 예: `@/types`, `@/data/verses.json`, `@/lib/wheel`, `@/components/Wheel`

## 디렉토리 구조
```
app/           # page.tsx (Server Component) + layout.tsx + globals.css
components/    # HomeClient.tsx, Wheel.tsx, VerseCard.tsx, ExportCard.tsx
data/          # verses.json (정적 성경 구절 데이터)
lib/           # wheel.ts (D3 설정), image.ts (html2canvas 유틸)
types/         # index.ts (Verse, Category 타입 + CATEGORIES 상수)
public/fonts/  # NanumSquareNeo TTF 5종
phases/        # 하네스 phase/step 정의
```

## layout.tsx 규칙
- CRITICAL: Geist 폰트 import 제거 (`next/font/google` 사용 금지)
- CRITICAL: `<html lang="ko">` — 한국어 앱
- CRITICAL: `<html>` 또는 `<head>`에 `color-scheme: light` 메타 추가
- OG 메타 태그 포함: `og:title`, `og:description`, `og:image`, `og:type`

## 아키텍처 규칙
- CRITICAL: `page.tsx`는 Server Component 유지. 상태·이벤트 로직은 `HomeClient.tsx`('use client')에 위임
- CRITICAL: JSON import는 정적 import 사용 — `import verses from '@/data/verses.json'` (`resolveJsonModule: true` 활성화됨)
- CRITICAL: D3 코드가 포함된 컴포넌트는 반드시 `'use client'` 선언
- CRITICAL: html2canvas는 `dynamic(() => import('html2canvas'), { ssr: false })` 사용
- `@/` alias 사용 (상대 경로 `../../` 금지)

## D3 구현 규칙
- useEffect 시작 시 `d3.select(svgRef.current).selectAll('*').remove()` — React StrictMode 이중 실행 방어
- useEffect cleanup에서 이벤트 리스너 반드시 제거: `return () => { d3.select(svgRef.current).on('click', null) }`
- 스핀 중 클릭 비활성화: `isSpinning === true`일 때 핸들러 early return
- 포인터(`▼`)는 회전 그룹 밖 별도 `<g>`에 배치 — 휠과 함께 돌면 안 됨
- SVG는 `viewBox="0 0 300 300"` + `width="100%"` 로 반응형 처리

## html2canvas 규칙
- 캡처 직전 `await document.fonts.ready` — 폰트 미로드 시 폴백 폰트 렌더 방지
- 1080×1080 출력: 화면 밖 숨겨진 `ExportCard`(540px 고정, `overflow: hidden`) + `scale: 2`
- try/catch 필수 — 캡처 실패 시 인라인 에러 메시지 표시
- 모바일 Safari `<a download>` 미지원 대비: `navigator.share({ files: [File] })` fallback

## 디자인 규칙
- 배경 `#FAFAF8`, 퍼플 포인트 `#C4B8F0` / `#534AB7`, 연두 포인트 `#BFFFCC`
- 폰트: NanumSquareNeo (weight 300/400/700/800/900)
- 강제 라이트 모드: `color-scheme: light` (다크모드 대응 없음)
- AI 슬롭 금지: backdrop-filter blur, gradient orb, glow animation, gradient-text 사용 금지
- D3 휠: stroke 1~1.5px 얇은 선 스타일, fill opacity 0.05 이하

## 개발 규칙
- 커밋: conventional commits (feat:, fix:, docs:, refactor:)
- 주석은 WHY가 비명확한 경우에만 작성
- 하네스 step 완료 시 반드시 `phases/<phase>/index.json` status → "completed" + summary 업데이트

## 명령어
```
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
python3 scripts/execute.py <phase-dir>  # 하네스 실행
```
