# UI 디자인 가이드

## 디자인 원칙
1. **말씀이 주인공** — 장식 없이 텍스트 자체가 읽혀야 한다
2. **감성 앱, 교회 앱 X** — 종교적 언어/아이콘 대신 감정/상황 언어로
3. **모바일 우선** — 한 손 조작, 390px 기준, 불필요한 스크롤 없음
4. **라이트 모드 고정** — `color-scheme: light`, 다크모드 대응 없음

## AI 슬롭 안티패턴 — 하지 마라
| 금지 | 이유 |
|------|------|
| `backdrop-filter: blur()` | glassmorphism = AI 템플릿 징후 1번 |
| gradient-text | AI SaaS 랜딩 클리셰 |
| box-shadow 글로우 애니메이션 | 네온 글로우 = AI 슬롭 |
| 배경 gradient orb (blur-3xl 원형) | 모든 AI 랜딩에 있는 장식 |
| 보라/인디고 브랜드 색상 과용 | 포인트로만 제한, #BFFFCC와 균형 유지 |
| 모든 카드에 동일한 rounded-2xl | 균일한 둥근 모서리는 템플릿 느낌 |

## 색상

### 기본 팔레트
| 요소 | Hex | 용도 |
|------|-----|------|
| 배경 | `#FAFAF8` | 따뜻한 오프화이트 |
| 퍼플 포인트 | `#C4B8F0` | 휠 외곽선, Primary 버튼 배경, 카드 테두리 |
| 퍼플 다크 | `#534AB7` | Primary 버튼 텍스트, 포인터, 중앙 텍스트 |
| 연두 포인트 | `#BFFFCC` | Secondary 버튼 배경, 저장 성공 피드백, 타이틀 accent |
| 연두 다크 | `#1A5C35` | #BFFFCC 위 텍스트 (대비비 ~5.7:1 ✓) |
| 텍스트 주 | `#1A1A1A` | 말씀 본문, 제목 |
| 텍스트 보조 | `#6B6B6B` | 성경 출처, 안내 문구 |
| 카드 배경 | `#FFFFFF` | 말씀 카드 |
| 카드 테두리 | `#E8E0FF` | 연한 라벤더 |

### 이색 대비 원칙
퍼플(#C4B8F0 / #534AB7)과 연두(#BFFFCC / #1A5C35)는 보색에 가까운 대비.
둘을 동시에 과하게 쓰지 않는다 — 퍼플이 주(휠, 카드), 연두는 보조(버튼, 피드백).

### 카테고리 색상 (휠 6구역)
| 구역 | Hex |
|------|-----|
| 너무 힘들 때 | `#F59E0B` (Amber) |
| 불안하고 무서울 때 | `#8B5CF6` (Purple) |
| 관계가 힘들 때 | `#F87171` (Coral) |
| 뭔가 잘 됐을 때 | `#34D399` (Green) |
| 앞이 안 보일 때 | `#2DD4BF` (Teal) |
| 선택해야 할 때 | `#60A5FA` (Blue) |

구역 채우기: 각 Hex + opacity 0.05 (hint만, 파이차트처럼 진하게 채우지 않음).

## 타이포그래피 — NanumSquareNeo
| 용도 | weight | size | color |
|------|--------|------|-------|
| 앱 타이틀 | 900 (eHv) | 24px | `#1A1A1A` |
| 말씀 본문 | 700 (cBd) | 18–20px | `#1A1A1A` |
| 성경 출처 | 400 (bRg) | 13px | `#6B6B6B` |
| 카테고리 뱃지 텍스트 | 700 (cBd) | 11px | 카테고리 Hex (진한 버전) |
| 휠 카테고리 레이블 | 700 (cBd) | 10px | `#1A1A1A` |
| 버튼 | 800 (dEb) | 14px | — |
| 중앙 "돌려" / "···" | 700 (cBd) | 11px | `#534AB7` |
| 안내 문구 | 400 (bRg) | 14px | `#6B6B6B` |

## 앱 타이틀 스타일
```
텍스트:  "the Word"
폰트:    NanumSquareNeo 900, 24px, #1A1A1A
accent:  타이틀 아래 2px 밑줄, 색상 #BFFFCC, width: 40px (전체 너비 아님, 짧은 포인트)
위치:    페이지 상단 중앙 정렬
```

## D3 휠 시각화 — 선형 스타일

### 레퍼런스 이미지 분석
- **d3-1 (동심원 차트)**: 1–2px 얇은 원호, 텍스트 레이블이 방사형 배치. 색상은 작은 포인트로만, pencil sketch 느낌.
- **d3-3 (계통수)**: 텍스트가 원형 배열, 중심에서 바깥으로 얇은 방사선, 흑백 위주.
- **web-1 (throxy)**: 오프화이트 배경, 명확한 sans-serif, 포인트 컬러 제한 사용, 넉넉한 여백.

### 휠 구현 스펙
```
SVG:            viewBox="0 0 300 300", width="100%" (반응형)
외부 원:        r=130px, stroke 1.5px #C4B8F0, fill none
구역 구분선:    방사형 center→r=130, stroke 1px #D4C9F5
구역 채우기:    카테고리 Hex + opacity 0.05
중앙 원:        r=38px, fill #FAFAF8, stroke 1.5px #C4B8F0
                클릭 영역: r=38 이상 (최소 터치 44×44px 확보)
포인터(▼):      12시 고정, wheel-group 밖 별도 <g>, fill #534AB7
카테고리 텍스트: 각 구역 중앙각, r=85px 위치, 10px, NanumSquareNeo 700
```

### SVG 그룹 구조 — 핵심 구현 규칙
```
<svg viewBox="0 0 300 300" width="100%" role="img" aria-label="말씀 뽑기 휠">
  <g class="wheel-group" transform="rotate(R, 150, 150)">
    <!-- 이 그룹만 회전 -->
    <path × 6>    세그먼트 fill (opacity 0.05)
    <line × 6>    방사형 구분선
    <circle>      외부 원 (r=130)
    <text × 6>    카테고리 레이블 (<tspan> 2행)
  </g>

  <!-- 아래는 절대 회전하면 안 됨 -->
  <g class="center-group" style="cursor: pointer">
    <circle r=38 />
    <text>"돌려" | "···"</text>
  </g>
  <polygon class="pointer" />   ▼ 12시 방향
</svg>
```

### 카테고리 텍스트 2행 분리 규칙
60° 구역 r=85 호 길이 ≈ 89px. 10px 한글 기준 1행 최대 8자.

| 카테고리 | 1행 (`<tspan>`) | 2행 (`<tspan dy="1.2em">`) |
|----------|-----------------|---------------------------|
| 너무 힘들 때 | 너무 | 힘들 때 |
| 불안하고 무서울 때 | 불안하고 | 무서울 때 |
| 관계가 힘들 때 | 관계가 | 힘들 때 |
| 뭔가 잘 됐을 때 | 뭔가 잘 | 됐을 때 |
| 앞이 안 보일 때 | 앞이 안 | 보일 때 |
| 선택해야 할 때 | 선택해야 | 할 때 |

### 스핀 애니메이션
```
트리거:    SVG 전체 클릭 (center-group + wheel-group 모두 포함)
           isSpinning === true 또는 카드 표시 중이면 무시
회전량:    현재 누적각 + (5 × 360°) + 목표 카테고리 중앙각 보정
duration:  2800–3500ms (Math.random 랜덤)
easing:    d3.easeCubicOut (처음 빠르게 → 천천히 감속 착지)
중앙 텍스트: 스핀 중 "돌려" → "···", 완료 시 "돌려" 복귀
착지 후:   착지 구역 구분선 stroke 1px → 2px #C4B8F0 강조 (0.3s transition)
```

### 휠 ↔ 카드 전환 (핵심 레이아웃 규칙)
```
[휠 상태]
  - 안내 문구: 표시 (opacity 1)
  - 휠 컨테이너: 표시 (opacity 1)
  - 카드: 숨김 (display none 또는 opacity 0)
  - 버튼: 숨김

[착지 후 → 카드 상태]
  1. 휠 fade out: opacity 1 → 0, 300ms ease-out
  2. 카드 fade in: opacity 0 → 1, 400ms ease-out (휠과 같은 컨테이너 위치)
  3. 안내 문구: opacity 0 (숨김)
  4. 버튼 등장: 카드 아래, 세로 배치

[다시 뽑기 클릭]
  1. 카드 fade out: opacity 1 → 0, 300ms
  2. 휠 fade in: opacity 0 → 1, 400ms
  3. 안내 문구: opacity 1 복귀
  4. 버튼: 숨김

구현: 휠과 카드를 동일한 컨테이너(같은 min-height)에 배치.
      CSS position relative + absolute 또는 조건부 렌더링 + CSS transition.
      스크롤 없이 한 화면 안에서 전환.
```

### prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  /* D3 transition duration을 0으로 override */
  /* 즉시 목표 카테고리로 착지 */
}
```
D3 transition duration을 `motionOK ? 2800~3500 : 0`으로 조건부 설정.

### 카드 표시 중 휠 상태
카드가 나타나면 휠은 사라지지 않고 `opacity: 0.3`으로 dim 처리.
"다시 뽑기" 클릭 시 opacity 1로 복귀, 카드 사라짐.

## 컴포넌트 스펙

### 말씀 카드 (VerseCard — 화면용)
```
width:          100%, max-width: 340px
배경:           #FFFFFF
테두리:         1px solid #E8E0FF
border-radius:  12px
padding:        28px 24px

구조 (위→아래):
  [카테고리 뱃지]   — 카드 상단 왼쪽 정렬
  [말씀 본문]       — 중앙 정렬, line-height: 1.8, word-break: keep-all, margin-top: 16px
  [성경 출처]       — 우측 하단 정렬, margin-top: 20px
```

### 카테고리 뱃지
```
위치:          카드 상단 왼쪽
배경:          카테고리 Hex + opacity 0.15 (구역 색상 계열 유지)
border:        1px solid 카테고리 Hex + opacity 0.3
border-radius: 20px (pill)
padding:       4px 10px
font:          NanumSquareNeo 700, 11px
color:         카테고리 Hex (진한 원색)
텍스트:        카테고리명 (예: "너무 힘들 때")
```

### 저장용 카드 (ExportCard — 화면 밖 540px)
```
position:       absolute, left: -9999px, top: 0
width:          540px, height: 540px, overflow: hidden
배경:           #FFFFFF
padding:        60px 56px

구조:
  [the Word 로고 텍스트]  — 상단 중앙, 16px weight 900
  [카테고리 뱃지]         — 로고 아래 중앙 정렬
  [말씀 본문]             — 중앙 정렬, 24px, line-height: 1.8
  [성경 출처]             — 우측 하단, 16px
  [theword.app 워터마크]  — 최하단 중앙, 12px, #BFFFCC 색상  ← 연두 사용
```

### 버튼 (세로 배치, full width)
```
배치: flex-direction: column, gap: 10px, width: 100%, max-width: 340px

Primary (저장하기):
  bg: #C4B8F0, color: #534AB7
  border: none, border-radius: 8px
  padding: 14px 24px, font-weight: 800, font-size: 14px, width: 100%
  hover: bg #B0A2E8
  active: transform: scale(0.98)
  disabled: opacity 0.5, cursor: not-allowed
  저장 중: 텍스트 "저장 중..." + disabled
  저장 완료: 텍스트 "저장됐어요 ✓" (1.5초 후 "저장하기" 복귀)  ← Phase 1 구현

Secondary (다시 뽑기):
  bg: #BFFFCC, color: #1A5C35        ← 연두 사용
  border: none, border-radius: 8px
  padding: 14px 24px, font-weight: 700, font-size: 14px, width: 100%
  hover: bg #A8F0BA
  active: transform: scale(0.98)
```

### 저장 피드백
```
성공 (Phase 1):
  버튼 텍스트 → "저장됐어요 ✓"
  1.5초 후 "저장하기"로 복귀
  토스트/팝업 없음 — 버튼 자체가 피드백

실패 인라인 메시지:
  위치: 버튼 아래 (margin-top: 8px)
  color: #DC2626
  font-size: 13px
  3초 후 자동 사라짐
```

## 레이아웃
```
페이지:
  display: flex, flex-direction: column, align-items: center
  min-height: 100dvh, padding: 32px 24px, gap: 32px
  background: #FAFAF8

순서 (위→아래):
  1. 앱 타이틀 "the Word" + #BFFFCC 밑줄 accent
  2. 안내 문구 2줄 (14px, #6B6B6B, 중앙 정렬):
       "마음을 담아 돌려보세요"
       "오늘 당신에게 필요한 한 마디가 기다리고 있어요"
  3. [전환 영역] 휠 ↔ 카드 (같은 공간 공유)
       position: relative, min-height: min(85vw, 320px), width: 100%
       휠:  position absolute, opacity transition
       카드: position absolute, opacity transition, max-width: 340px
  4. [카드 상태 시만 표시] 버튼 세로 배치 (max-width: 340px)

안내 문구:
  휠 상태: opacity 1, pointer-events: auto
  카드 상태: opacity 0, pointer-events: none
  다시 뽑기 후: opacity 1 복귀
```

## 버튼 focus 상태 (키보드 접근성)
```
:focus-visible {
  outline: 2px solid #534AB7
  outline-offset: 2px
}
```
`outline: none`으로 focus 제거 금지.

## 애니메이션
- **허용**: 휠 D3 rotation transition, 카드 fade-in (opacity 0→1, 400ms ease-out)
- **금지**: 그 외 모든 애니메이션 (bounce, pulse, glow 등)
- **reduced-motion**: `prefers-reduced-motion: reduce` 시 모든 transition 즉시
