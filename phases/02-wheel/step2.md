# Step 2: components/HomeClient.tsx — 전환 컨테이너 + Wheel 통합

## 목표
HomeClient를 완전 구현한다. 휠과 카드가 같은 위치에 나타나는 "Option B" 전환 구조.
이 step에서 VerseCard/ExportCard는 아직 없으므로 placeholder를 렌더한다.

## 레이아웃 구조

```
<main> (min-height: 100dvh, display:flex, flexDirection:column, alignItems:center, justifyContent:center, padding:32px)
  
  // 앱 타이틀
  <h1>"the Word"</h1>
  // 아래에 40px 연두 밑줄 accent (::after 또는 인라인)

  // 안내 문구 (휠 상태에서만 표시)
  <div style={{ opacity: selectedVerse ? 0 : 1, transition: 'opacity 300ms', pointerEvents: selectedVerse ? 'none' : 'auto' }}>
    <p>마음을 담아 돌려보세요</p>
    <p>오늘 당신에게 필요한 한 마디가 기다리고 있어요</p>
  </div>

  // [전환 컨테이너] — 핵심
  <div style={{
    position: 'relative',
    width: '100%',
    maxWidth: '320px',
    aspectRatio: '1',   // 정사각형 유지
  }}>
    // Wheel — position: absolute, inset: 0
    <div style={{ position: 'absolute', inset: 0 }}>
      <Wheel visible={!selectedVerse} onCategorySelect={handleCategorySelect} />
    </div>

    // VerseCard placeholder (selectedVerse 있을 때만)
    // position: absolute, inset: 0, opacity 0→1 transition
    {selectedVerse && (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>카드 placeholder: {selectedVerse.text.ko.slice(0, 20)}...</p>
      </div>
    )}
  </div>

  // 버튼 영역 (selectedVerse 있을 때만)
  {selectedVerse && (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px', marginTop: '24px' }}>
      <button onClick={handleSave}>저장하기</button>
      <button onClick={handleReset}>다시 뽑기</button>
    </div>
  )}

</main>
```

## 핵심 상태 및 핸들러

```typescript
'use client'

import { useState } from 'react'
import type { Verse } from '@/types'
import Wheel from '@/components/Wheel'

interface HomeClientProps {
  verses: Verse[]
}

export default function HomeClient({ verses }: HomeClientProps) {
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)

  const handleCategorySelect = (categoryId: string) => {
    const pool = verses.filter(v => v.categoryId === categoryId)
    const source = pool.length > 0 ? pool : verses
    const verse = source[Math.floor(Math.random() * source.length)]
    setSelectedVerse(verse)
  }

  const handleReset = () => {
    setSelectedVerse(null)
  }

  const handleSave = () => {
    // Phase 03에서 ExportCard와 연결
    alert('저장 기능은 Phase 03에서 구현됩니다')
  }

  return (
    // 위 레이아웃 구조 참조
  )
}
```

## 스타일 지침
- 배경: `var(--bg)` = `#FAFAF8`
- 타이틀: NanumSquareNeo weight 900, `var(--purple-dark)` 색상, 아래에 연두(`var(--green-accent)`) 짧은 밑줄
- 안내 문구: weight 400, `var(--text-secondary)`, text-align center, 두 줄
- 저장하기 버튼: background `var(--purple-light)`, color `var(--purple-dark)`, border-radius 12px, padding 14px
- 다시 뽑기 버튼: background `var(--green-accent)`, color `var(--green-text)`, border-radius 12px, padding 14px
- 버튼 font: NanumSquareNeo weight 700

## Acceptance Criteria

```bash
# HomeClient가 'use client' 인지 확인
grep "'use client'" components/HomeClient.tsx && echo "PASS" || echo "FAIL"

# Wheel import 확인
grep "import Wheel" components/HomeClient.tsx && echo "PASS" || echo "FAIL"

# selectedVerse useState 확인
grep "selectedVerse" components/HomeClient.tsx && echo "PASS" || echo "FAIL"

# TypeScript 컴파일
npx tsc --noEmit

# 빌드 성공
npm run build 2>&1 | tail -5
```

빌드 성공 후 step 2 status를 "completed"로 업데이트하라.
