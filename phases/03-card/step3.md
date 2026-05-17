# Step 3: 전체 통합 — HomeClient 완성

## 목표
HomeClient에 VerseCard, ExportCard를 통합한다. 저장 피드백, 다시 뽑기 전환, 버튼 상태를 완성한다.

## HomeClient 최종 구조

### 상태
```typescript
const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
const exportCardRef = useRef<ExportCardHandle>(null)
```

### 저장 핸들러
```typescript
const handleSave = async () => {
  if (saveState === 'saving' || !exportCardRef.current) return
  setSaveState('saving')
  try {
    await exportCardRef.current.save()
    setSaveState('success')
    setTimeout(() => setSaveState('idle'), 1500)
  } catch {
    setSaveState('error')
    setTimeout(() => setSaveState('idle'), 3000)
  }
}
```

### 저장 버튼 텍스트
```typescript
const saveButtonLabel = {
  idle:    '저장하기',
  saving:  '저장 중...',
  success: '저장됐어요 ✓',
  error:   '저장에 실패했어요. 다시 시도해주세요',
}[saveState]
```

### 다시 뽑기 핸들러
```typescript
const handleReset = () => {
  setSaveState('idle')
  setSelectedVerse(null)
}
```

## 전환 컨테이너 최종 구현

```tsx
{/* 전환 컨테이너 */}
<div style={{
  position: 'relative',
  width: '100%',
  maxWidth: '320px',
  aspectRatio: '1',
}}>
  {/* Wheel */}
  <div style={{ position: 'absolute', inset: 0 }}>
    <Wheel visible={!selectedVerse} onCategorySelect={handleCategorySelect} />
  </div>

  {/* VerseCard */}
  {selectedVerse && (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <VerseCard verse={selectedVerse} />
    </div>
  )}
</div>

{/* ExportCard (화면 밖) — selectedVerse 있을 때만 렌더 */}
{selectedVerse && (
  <ExportCard ref={exportCardRef} verse={selectedVerse} />
)}

{/* 버튼 세로 배치 */}
{selectedVerse && (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '320px',
    marginTop: '24px',
  }}>
    <button
      onClick={handleSave}
      disabled={saveState === 'saving'}
      style={{
        background: saveState === 'error' ? '#BFFFCC' : 'var(--purple-light)',
        color: saveState === 'error' ? 'var(--green-text)' : 'var(--purple-dark)',
        border: 'none',
        borderRadius: '12px',
        padding: '14px',
        fontFamily: 'NanumSquareNeo, sans-serif',
        fontWeight: 700,
        fontSize: '15px',
        cursor: saveState === 'saving' ? 'not-allowed' : 'pointer',
        transition: 'background 200ms',
      }}
    >
      {saveButtonLabel}
    </button>
    <button
      onClick={handleReset}
      style={{
        background: 'var(--green-accent)',
        color: 'var(--green-text)',
        border: 'none',
        borderRadius: '12px',
        padding: '14px',
        fontFamily: 'NanumSquareNeo, sans-serif',
        fontWeight: 700,
        fontSize: '15px',
        cursor: 'pointer',
      }}
    >
      다시 뽑기
    </button>
  </div>
)}
```

## 에러 상태 UX
- `saveState === 'error'`: 저장 버튼이 `#BFFFCC` 배경으로 바뀌고 "저장에 실패했어요. 다시 시도해주세요" 표시. 3초 후 idle로 복귀.

## 최종 빌드 검증

```bash
# TypeScript 컴파일 (오류 0개)
npx tsc --noEmit

# 프로덕션 빌드 성공
npm run build

# ESLint
npm run lint
```

## 수동 검증 체크리스트 (하네스 실행 후 사람이 확인)
- [ ] 모바일(390px) 뷰포트에서 휠 + 안내 문구가 한 화면에 들어옴
- [ ] 휠 클릭 → 스핀 → 카드 등장 시 스크롤 없음
- [ ] 다시 뽑기 → 휠 복귀 + 안내 문구 복귀
- [ ] 저장하기 → 1.5초 "저장됐어요 ✓" 후 버튼 원래 텍스트 복귀
- [ ] NanumSquareNeo 폰트 적용됨 (Network 탭에서 TTF 로드 확인)

## Acceptance Criteria

```bash
# VerseCard import 확인
grep "import VerseCard" components/HomeClient.tsx && echo "PASS" || echo "FAIL"

# ExportCard import 확인
grep "import ExportCard" components/HomeClient.tsx && echo "PASS" || echo "FAIL"

# saveState 존재 확인
grep "saveState" components/HomeClient.tsx && echo "PASS" || echo "FAIL"

# TypeScript 컴파일
npx tsc --noEmit

# 프로덕션 빌드
npm run build
```

모든 AC 통과 후 step 3 status를 "completed"로 업데이트하라.
이것이 마지막 step이므로 `phases/03-card/index.json` 전체 phase도 completed로 표시하라.
