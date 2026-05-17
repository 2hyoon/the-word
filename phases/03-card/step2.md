# Step 2: components/ExportCard.tsx — 이미지 저장용 숨겨진 카드

## 목표
html2canvas로 1080×1080px PNG를 생성하는 숨겨진 카드 컴포넌트.
저장 로직(lib/image.ts)과 저장 상태를 관리한다.

## 핵심 제약 (반드시 준수)
- `display: none` / `visibility: hidden` 사용 금지 — html2canvas가 캡처 불가
- 대신 `position: absolute; left: -9999px; top: 0` 으로 화면 밖 배치
- 카드 크기: **정확히 540×540px** (scale:2 → 1080×1080)
- `overflow: hidden` 필수 (블리드 방지)

## Props & Ref

```typescript
interface ExportCardProps {
  verse: Verse
  onSaveStart: () => void    // 저장 시작 시 호출
  onSaveSuccess: () => void  // 저장 완료 시 호출
  onSaveError: () => void    // 저장 실패 시 호출
}
```

**또는** `useImperativeHandle`로 `save()` 메서드를 노출하는 방식도 가능.
단순한 쪽을 선택하라. 추천: props 콜백 방식 + `ref.current` 직접 접근.

실제로 저장 버튼은 HomeClient에 있으므로, ExportCard는 `ref`를 외부로 노출하거나
HomeClient가 ExportCard의 `cardRef`에 접근할 수 있어야 한다.

**권장 구조**: ExportCard에서 `captureAndSave`를 직접 트리거하는 `save` 함수를
`forwardRef` + `useImperativeHandle`로 노출:

```typescript
export interface ExportCardHandle {
  save: () => Promise<void>
}

const ExportCard = forwardRef<ExportCardHandle, { verse: Verse }>(
  function ExportCard({ verse }, ref) {
    const cardRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      save: async () => {
        await captureAndSave(cardRef)
      }
    }))

    return (
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={cardRef} style={{ width: 540, height: 540, overflow: 'hidden', background: '#FFFFFF' }}>
          {/* 카드 내용 */}
        </div>
      </div>
    )
  }
)
```

## ExportCard 내부 디자인 (540×540px)

```
background: #FFFFFF
padding: 60px

레이아웃 (수직 중앙 정렬):
┌─────────────────────────────────────┐
│                                     │
│    [카테고리 뱃지]                  │
│                                     │
│    "말씀 본문"                      │
│    (font-size: 22px, weight 400)    │
│                                     │
│    — 성경책 장:절                   │
│    (font-size: 16px, weight 700)    │
│                                     │
│                      the Word       │  ← 워터마크 (우하단)
│                   #BFFFCC 밑줄     │     font-size: 13px, color: #6B6B8A
└─────────────────────────────────────┘

테두리: 2px solid #C4B8F0, border-radius: 0 (인스타 스토리 맞춤 정사각형)
```

워터마크 텍스트: `"the Word"`, font-weight 800, color `#6B6B8A`.
`"the"` 아래 또는 `"the Word"` 전체 아래에 `#BFFFCC` 2px 선.

## Acceptance Criteria

```bash
# 파일 존재
test -f components/ExportCard.tsx && echo "PASS" || echo "FAIL"

# 'use client' 확인 (html2canvas dynamic import 사용하므로 필수)
grep "'use client'" components/ExportCard.tsx && echo "PASS" || echo "FAIL"

# left: -9999px 확인 (display:none 금지)
grep "\-9999" components/ExportCard.tsx && echo "PASS" || echo "FAIL"
grep "display.*none\|visibility.*hidden" components/ExportCard.tsx && echo "FAIL: hidden method" || echo "PASS"

# TypeScript 컴파일
npx tsc --noEmit
```

AC 통과 후 step 2 status를 "completed"로 업데이트하라.
