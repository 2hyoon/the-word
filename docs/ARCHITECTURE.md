# 아키텍처

## 디렉토리 구조
```
app/
  layout.tsx         # lang="ko", OG 메타, color-scheme: light, Geist 제거
  page.tsx           # Server Component — verses.json 정적 import 후 HomeClient에 전달
  globals.css        # @font-face, CSS 변수, 전역 리셋

components/
  HomeClient.tsx     # 'use client' — selectedVerse 상태, 컴포넌트 조합
  Wheel.tsx          # 'use client' — D3 원형 휠, 스핀 애니메이션
  VerseCard.tsx      # 화면용 말씀 카드 (props만 렌더, 브라우저 API 없음)
  ExportCard.tsx     # 'use client' — 이미지 저장용 숨겨진 카드 (540px 고정)

data/
  verses.json        # 성경 구절 48개 (한영 병렬, categoryId 포함)

lib/
  wheel.ts           # WHEEL_CONFIG 상수, 카테고리 색상 헬퍼
  image.ts           # html2canvas 캡처 유틸 (fonts.ready 대기 + try/catch)

types/
  index.ts           # Verse, Category 타입, CATEGORIES 상수

public/
  fonts/             # NanumSquareNeo TTF 5종
  og-image.png       # OG 소셜 미리보기 이미지 (1200×630px)

phases/
  index.json         # 전체 phase 목록
  01-foundation/     # 설치 + 폰트 + 데이터
  02-wheel/          # D3 휠 구현
  03-card/           # 말씀 카드 + 이미지 저장
```

## Server / Client Component 분리
| 컴포넌트 | 종류 | 이유 |
|----------|------|------|
| `page.tsx` | Server | verses.json 정적 import, 상태 없음 |
| `HomeClient.tsx` | Client (`'use client'`) | useState(selectedVerse), 이벤트 핸들러 |
| `Wheel.tsx` | Client (`'use client'`) | D3 useEffect, DOM 직접 조작 |
| `VerseCard.tsx` | (Client 경계 내) | 브라우저 API 없음, 'use client' 불필요 |
| `ExportCard.tsx` | Client (`'use client'`) | html2canvas dynamic import, useRef |

> `VerseCard.tsx`는 `HomeClient.tsx` 안에서 렌더되므로 자동으로 Client 번들에 포함됨.
> 명시적 `'use client'` 불필요, 단 Server Component 기능(async, fetch 등) 사용 불가.

## 데이터 흐름
```
app/page.tsx (Server Component)
  ├─ import verses from '@/data/verses.json'  // 정적 import (resolveJsonModule: true)
  └─ <HomeClient verses={verses} />

HomeClient.tsx ('use client')
  ├─ selectedVerse: Verse | null  (useState)
  │
  ├─ 안내 문구 (두 줄)
  │    opacity: selectedVerse ? 0 : 1  (CSS transition)
  │
  ├─ [전환 컨테이너 — position: relative, min-height: min(85vw, 320px)]
  │    ├─ <Wheel
  │    │    visible={!selectedVerse}          // true: opacity 1, false: opacity 0 (300ms)
  │    │    onCategorySelect={handleCategorySelect}
  │    │  />
  │    │    └─ D3 SVG 전체 클릭 핸들러 (center-group 뿐 아니라 svg 전체)
  │    │         → 스핀 → 착지 → onCategorySelect(categoryId)
  │    │              → verses.filter(v => v.categoryId === id)
  │    │              → 빈 배열 fallback: 전체 verses 사용
  │    │              → Math.random() 선택 → setSelectedVerse(verse)
  │    │
  │    └─ {selectedVerse && (
  │         <VerseCard verse={selectedVerse} />   // opacity 0→1 (400ms)
  │       )}
  │
  ├─ {selectedVerse && (
  │    버튼 세로 배치:
  │    <button>저장하기</button>   ← 클릭 시 ExportCard 캡처, "저장됐어요 ✓" 1.5초
  │    <button onClick={() => setSelectedVerse(null)}>다시 뽑기</button>
  │  )}
  │
  └─ <ExportCard verse={selectedVerse} />   // 화면 밖 left:-9999px, 540px 고정
```

**레이아웃 전환 원리 (Option B)**
- 전환 컨테이너: `position: relative`, 휠 높이 고정 (`min(85vw, 320px)`)
- Wheel + VerseCard: 둘 다 `position: absolute; inset: 0`
- Wheel `visible` prop: `opacity: visible ? 1 : 0; pointer-events: visible ? auto : none; transition: opacity 300ms`
- VerseCard: mount 시 `opacity: 0 → 1` (CSS keyframe 또는 transition, 400ms)
- 스크롤 없음 — 컨테이너 높이가 고정되어 카드가 같은 영역에 나타남

## D3 구현 패턴 (Wheel.tsx)
```typescript
interface WheelProps {
  onCategorySelect: (categoryId: string) => void
  visible: boolean  // false → opacity 0 + pointer-events none (카드 표시 중)
}

useEffect(() => {
  if (!svgRef.current) return;

  // StrictMode 이중 실행 방어
  d3.select(svgRef.current).selectAll('*').remove();

  // SVG 그룹 구조:
  // <svg viewBox="0 0 300 300" width="100%">
  //   <g class="wheel-group" transform="rotate(R, 150, 150)">  ← 이것만 회전
  //     <path> × 6   (세그먼트 fill)
  //     <line> × 6   (방사형 구분선)
  //     <circle>     (외부 원)
  //     <text> × 6   (카테고리 레이블, <tspan> 2행)
  //   </g>
  //   <g class="center-group">  ← 절대 회전하면 안 됨
  //     <circle r=38 />
  //     <text>"돌려" or "···"</text>
  //   </g>
  //   <polygon class="pointer" />  ← 12시 고정, 절대 회전하면 안 됨
  // </svg>

  // 클릭 핸들러: SVG 전체에 등록 (center-group 외 휠 세그먼트 탭도 동작해야 함)
  d3.select(svgRef.current).on('click', handleSpin);

  // 스핀 핸들러
  const handleSpin = () => {
    if (isSpinningRef.current) return;  // 연타 방어
    isSpinningRef.current = true;
    // centerText → "···"
    const targetCategoryId = pickRandomCategory();
    const targetAngle = getCategoryAngle(targetCategoryId);
    const totalRotation = rotationRef.current + (5 * 360) + targetAngle;

    d3.select(wheelGroupRef.current)
      .transition()
      .duration(2800 + Math.random() * 700)
      .ease(d3.easeCubicOut)
      .attrTween('transform', interpolateRotation(rotationRef.current, totalRotation))
      .on('end', () => {
        rotationRef.current = totalRotation % 360;
        isSpinningRef.current = false;
        // centerText → "돌려"
        onCategorySelect(targetCategoryId);
      });
  };

  return () => {
    d3.select(svgRef.current).on('click', null);
  };
}, []);
```

**상태를 ref로 관리하는 이유**: `isSpinning`, `rotationRef`를 useState 대신 useRef로 관리하면 D3 transition 중 리렌더가 발생하지 않아 애니메이션이 끊기지 않음.

## 이미지 저장 플로우 (ExportCard.tsx)
```
ExportCard 렌더:
  position: absolute, left: -9999px, top: 0   (화면 밖 — display:none/visibility:hidden 불가)
  width: 540px, height: 540px, overflow: hidden  (블리드 방지)
  cardRef = useRef<HTMLDivElement>(null)

"저장하기" 클릭:
  1. setIsExporting(true)
  2. await document.fonts.ready
  3. try {
       const canvas = await html2canvas(cardRef.current, {
         scale: 2,         // 540 × 2 = 1080px
         width: 540,
         height: 540,
         useCORS: true,
         backgroundColor: '#FFFFFF'
       })
       const dataUrl = canvas.toDataURL('image/png')

       // 모바일 (iOS Safari share 지원 여부 확인)
       if (navigator.share && navigator.canShare) {
         const blob = await (await fetch(dataUrl)).blob()
         const file = new File([blob], 'theword.png', { type: 'image/png' })
         if (navigator.canShare({ files: [file] })) {
           await navigator.share({ files: [file] }); return
         }
       }
       // 데스크탑 fallback
       const a = document.createElement('a')
       a.href = dataUrl; a.download = 'theword.png'; a.click()
     } catch {
       setExportError(true)
       setTimeout(() => setExportError(false), 3000)
     } finally {
       setIsExporting(false)
     }
```

## 상태 목록
| 상태 | 위치 | 타입 | 초기값 |
|------|------|------|--------|
| `selectedVerse` | `HomeClient` | `Verse \| null` | `null` |
| `isSpinningRef` | `Wheel` 내부 | `React.MutableRefObject<boolean>` | `false` |
| `rotationRef` | `Wheel` 내부 | `React.MutableRefObject<number>` | `0` |
| `isExporting` | `ExportCard` 내부 | `boolean` | `false` |
| `exportError` | `ExportCard` 내부 | `boolean` | `false` |
| `exportSuccess` | `ExportCard` 내부 | `boolean` | `false` |

## verses.json 스키마
```typescript
interface Verse {
  id: number
  book: { ko: string; en: string }
  chapter: number
  verse: number
  categoryId: 'hard' | 'fear' | 'relation' | 'grateful' | 'future' | 'decision'
  category: { ko: string; en: string }
  text: { ko: string; en: string }
}
```

## HomeClient props 인터페이스
```typescript
interface HomeClientProps {
  verses: Verse[]
}
```
