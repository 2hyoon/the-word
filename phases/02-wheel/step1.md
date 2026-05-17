# Step 1: components/Wheel.tsx — D3 원형 휠

## 목표
D3.js v7로 6구역 원형 휠을 구현한다. 얇은 선 스타일, 스핀 애니메이션, 12시 포인터.

## 스펙

### Props
```typescript
interface WheelProps {
  visible: boolean                              // false → opacity 0 + pointer-events none
  onCategorySelect: (categoryId: string) => void
}
```

### SVG 구조 (반드시 준수)
```
<svg viewBox="0 0 300 300" width="100%" style="cursor:pointer">
  <g class="wheel-group" transform="rotate(R, 150, 150)">   ← 회전하는 그룹
    <path> × 6    세그먼트 fill (opacity 0.08, stroke 1px)
    <line> × 6    방사형 구분선 (stroke: 색상, strokeWidth: 1)
    <circle>      외곽 원 (r=130, fill:none, stroke: #C4B8F0, strokeWidth:1)
    <text> × 6    카테고리 레이블 (<tspan> 2행 분리)
  </g>
  <g class="center-group">                      ← 절대 회전하면 안 됨
    <circle r=38, fill:#FAFAF8, stroke:#C4B8F0, strokeWidth:1 />
    <text>"돌려" | "···"</text>
  </g>
  <polygon class="pointer" />                   ← 12시 위치 ▼, 절대 회전하면 안 됨
</svg>
```

### 카테고리 배치 (CATEGORIES 배열 순서 그대로)
CATEGORIES: `['hard', 'fear', 'relation', 'grateful', 'future', 'decision']`
인덱스 0부터 반시계/시계 방향으로 60도씩 배치.
`d3.pie().sort(null)` 사용, 모든 세그먼트 동일 value(1).

### 레이블 텍스트
각 카테고리 레이블은 두 줄로 표시. UI_GUIDE.md의 "카테고리 레이블 2행 분리" 표를 참조하라:
- hard: "너무" / "힘들 때"
- fear: "불안하고" / "무서울 때"  
- relation: "관계가" / "힘들 때"
- grateful: "뭔가" / "잘 됐을 때"
- future: "앞이" / "안 보일 때"
- decision: "선택해야" / "할 때"

`<text>` 위치: arc centroid 기준, `dy`로 두 줄 오프셋.
`font-size: 9px`, `font-weight: 700`, `text-anchor: middle`, `fill: categoryTextColor`.

### 포인터
12시 방향 `<polygon>` (삼각형 ▼):
```javascript
// 12시 = (150, 150 - 130 - 8) 위쪽. 작고 날카로운 삼각형.
points="150,8 145,18 155,18"
fill="#534AB7"
```

### 스핀 로직
```typescript
// isSpinning, rotation → useRef (useState 사용 금지 — 리렌더 방지)
// 클릭 핸들러: d3.select(svgRef.current).on('click', handleSpin)
// SVG 전체 클릭 → 스핀 트리거 (center-group만 아님)

const handleSpin = () => {
  if (isSpinningRef.current) return
  isSpinningRef.current = true
  // centerText.text('···')
  
  const targetIdx = Math.floor(Math.random() * 6)
  const targetCategoryId = CATEGORIES[targetIdx].id
  
  // 포인터(12시)가 해당 세그먼트 중앙을 가리키는 최종 각도 계산
  // 세그먼트 idx의 중앙각 = -(idx * 60 + 30) 도 (D3 기본 시작 보정)
  const segmentCenter = -(targetIdx * 60 + 30)
  const totalRotation = rotationRef.current + (5 * 360) + segmentCenter - (rotationRef.current % 360)
  
  d3.select(wheelGroupRef.current)
    .transition()
    .duration(2800 + Math.random() * 700)
    .ease(d3.easeCubicOut)
    .attrTween('transform', () => {
      const start = rotationRef.current
      return (t: number) => {
        const angle = start + (totalRotation - start) * t
        return `rotate(${angle}, 150, 150)`
      }
    })
    .on('end', () => {
      rotationRef.current = totalRotation % 360
      isSpinningRef.current = false
      // centerText.text('돌려')
      onCategorySelect(targetCategoryId)
    })
}
```

**prefers-reduced-motion 대응**: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`가 true이면 duration을 0으로 설정.

### visible prop 처리
Wheel 컴포넌트의 wrapper `<div>`에 CSS 인라인 스타일로 처리:
```
opacity: visible ? 1 : 0
pointerEvents: visible ? 'auto' : 'none'
transition: 'opacity 300ms ease'
```

### useEffect 규칙
- 시작 시 `d3.select(svgRef.current).selectAll('*').remove()` (StrictMode 방어)
- cleanup: `d3.select(svgRef.current).on('click', null)`
- deps: `[]` (mount 1회만 실행)
- `visible` prop 변화는 D3가 아니라 CSS로 처리 → useEffect 재실행 없음

## Acceptance Criteria

```bash
# 파일 존재
test -f components/Wheel.tsx && echo "PASS" || echo "FAIL"

# 'use client' 선언 확인
grep "'use client'" components/Wheel.tsx && echo "PASS" || echo "FAIL"

# useState 없는지 확인 (isSpinning, rotation은 ref여야 함)
grep "useState" components/Wheel.tsx | grep -v "//\|import" && echo "WARN: useState found, check if needed" || echo "PASS: no useState"

# TypeScript 컴파일
npx tsc --noEmit

# 빌드 성공
npm run build 2>&1 | tail -5
```

TypeScript 오류 없이 빌드 성공하면 step 1 status를 "completed"로 업데이트하라.
