# Step 1: components/VerseCard.tsx — 화면용 말씀 카드

## 목표
화면에 표시될 말씀 카드 컴포넌트. 브라우저 API 없음, 'use client' 불필요.

## Props

```typescript
interface VerseCardProps {
  verse: Verse
}
```

## 디자인 스펙

```
┌────────────────────────────────┐  ← 라벤더 1px 테두리 (#C4B8F0)
│                                │     border-radius: 20px
│  [카테고리 뱃지]               │     background: #FFFFFF
│                                │     padding: 28px 24px
│  "말씀 본문 텍스트             │     max-width: 320px
│   여기에 표시됨"               │     box-shadow: 0 4px 24px rgba(196,184,240,0.15)
│                                │
│  — 성경책 장:절               │
└────────────────────────────────┘
```

### 카테고리 뱃지
- 해당 카테고리의 color를 배경색으로
- 해당 카테고리의 textColor를 글자색으로
- 텍스트: `verse.category.ko` (예: "너무 힘들 때")
- border-radius: 9999px, padding: 4px 12px, font-size: 12px, font-weight: 700

### 본문 텍스트
- `verse.text.ko`
- font-size: 17px, font-weight: 400, line-height: 1.75
- color: `var(--text-primary)`
- word-break: keep-all (한국어 자연스러운 줄바꿈)
- margin-top: 16px

### 출처
- `verse.book.ko` + ` ` + `verse.chapter` + `:` + `verse.verse`
- 예: "시편 34:18"
- font-size: 13px, color: `var(--text-secondary)`, font-weight: 700
- margin-top: 20px, text-align: right

### 페이드인 애니메이션
마운트 시 opacity 0 → 1 (CSS keyframe, 400ms ease-in):
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
인라인 스타일 또는 globals.css에 추가.

## 파일 작성

```typescript
// components/VerseCard.tsx
// ('use client' 없음 — HomeClient 내에서 렌더되므로 자동으로 client 번들 포함)

import type { Verse } from '@/types'
import { CATEGORIES } from '@/types'

interface VerseCardProps {
  verse: Verse
}

export default function VerseCard({ verse }: VerseCardProps) {
  const cat = CATEGORIES.find(c => c.id === verse.categoryId)

  return (
    <div style={{ /* 카드 스타일 */ }}>
      <span style={{ /* 뱃지 스타일 */ }}>
        {verse.category.ko}
      </span>
      <p style={{ /* 본문 스타일 */ }}>
        {verse.text.ko}
      </p>
      <p style={{ /* 출처 스타일 */ }}>
        {verse.book.ko} {verse.chapter}:{verse.verse}
      </p>
    </div>
  )
}
```

## Acceptance Criteria

```bash
# 파일 존재
test -f components/VerseCard.tsx && echo "PASS" || echo "FAIL"

# 'use client' 없는지 확인 (불필요)
grep "'use client'" components/VerseCard.tsx && echo "WARN: use client not needed but ok" || echo "PASS: no use client"

# verse.text.ko 렌더 확인
grep "text.ko\|text\.ko" components/VerseCard.tsx && echo "PASS" || echo "FAIL"

# TypeScript 컴파일
npx tsc --noEmit
```

AC 통과 후 step 1 status를 "completed"로 업데이트하라.
