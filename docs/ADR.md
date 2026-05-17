# Architecture Decision Records

## 철학
MVP 속도 최우선. 외부 API·DB 없음. 브라우저에서 바로 작동하는 정적 앱.
작동하는 최소 구현을 선택하고, Phase 2에서 확장.

---

### ADR-001: Next.js App Router 유지 (React 단독 대신)
**결정**: Next.js 16 App Router
**이유**: 프로젝트가 이미 Next.js로 초기화됨. Vercel 배포와의 궁합. SSR 자체는 불필요하지만 프레임워크 교체 비용이 더 큼.
**트레이드오프**: D3·html2canvas 등 브라우저 전용 라이브러리는 `'use client'` + dynamic import 필요.

---

### ADR-002: D3.js 휠 시각화
**결정**: D3.js v7 (d3.pie, d3.arc, d3.select, d3.transition)
**이유**: 얇은 선 원형 SVG + cubic-out 스핀 애니메이션을 CSS 단독으로 구현하기 어려움. D3 transition API가 타이밍 제어와 arc 계산에 최적.
**트레이드오프**: 번들 사이즈 ~70KB gzip. Tree-shaking으로 완화.
**D3 + React 충돌 해결**:
- D3는 DOM을 직접 조작하므로 React virtual DOM과 충돌
- 해결: `useRef<SVGSVGElement>` + `useEffect`에서만 D3 실행 (mount 1회)
- SVG 내부는 D3가 전적으로 관리 — React state로 SVG 내부 조작 금지
- `isSpinning`, `rotation`은 useRef로 관리 (state 사용 시 transition 중 리렌더로 애니메이션 끊김)
- useEffect 시작 시 `selectAll('*').remove()` (StrictMode 이중 실행 방어)
- cleanup에서 이벤트 리스너 제거

---

### ADR-003: NanumSquareNeo 로컬 폰트
**결정**: NanumSquareNeo TTF, `@font-face`로 `public/fonts/`에 자체 호스팅
**이유**: 한글 감성에 맞는 폰트가 이미 확보됨. 외부 CDN 없이 빠른 로딩. Pretendard(브레인스톰 원안)보다 로컬 파일이 이미 있으므로 이것을 사용.
**트레이드오프**: `public/fonts/`에 TTF 파일 복사 필요. 약 2MB 추가.
**주의**: `layout.tsx`의 기본 Geist 폰트 import 반드시 제거. `font-display: swap`으로 FOUT 최소화.

---

### ADR-004: 성경 데이터 정적 JSON
**결정**: `data/verses.json` 정적 import (API 없음)
**이유**: Phase 1 구절 수 ~48개. DB·CMS 불필요. 빌드타임 포함으로 API 레이턴시 0.
**import 방식**: `import verses from '@/data/verses.json'` (tsconfig `resolveJsonModule: true` 확인됨)
**트레이드오프**: 구절 추가·수정 시 재배포 필요.
**저작권**: Phase 1은 개역개정 스타일 사용. 트래픽 증가 시 대한성서공회 비상업적 허가 문의.
**엣지케이스**: 카테고리 필터 결과 빈 배열 → 전체 구절 풀로 fallback (정적 데이터지만 방어 코드 포함).

---

### ADR-005: html2canvas + 숨겨진 ExportCard로 1080×1080 출력
**결정**: 화면 밖(`left: -9999px`) 540×540px 고정 `ExportCard` + html2canvas `scale: 2`
**이유**:
- 화면 카드(~340px) + `scale: 2` = 680px — 목표 1080px 미달
- `ExportCard` 540px + `scale: 2` = 정확히 1080×1080
- `display: none` / `visibility: hidden`은 html2canvas가 캡처 불가 → `position: absolute; left: -9999px` 사용
**트레이드오프**: 동일 verse가 화면 카드 + ExportCard 두 곳에 렌더됨. 성능 영향 미미.
**폰트 이슈**: 캡처 직전 `await document.fonts.ready` 필수.
**모바일 저장**: iOS Safari `<a download>` 미지원 → `navigator.share({ files: [File] })` fallback.
**오류 처리**: try/catch 필수. 실패 시 3초 인라인 에러 메시지.

---

### ADR-006: HomeClient.tsx 패턴 (Server/Client 분리)
**결정**: `page.tsx` Server Component + `HomeClient.tsx` Client Component 분리
**이유**:
- `page.tsx`를 `'use client'`로 만들면 하위 트리 전체가 Client Bundle 포함
- Next.js App Router 권장 패턴
- `verses.json` import가 서버에서 처리됨
**트레이드오프**: `HomeClient.tsx` 파일 추가. `verses`를 props로 전달하는 보일러플레이트 생김.

---

### ADR-007: #BFFFCC 연두색을 Secondary Accent로 도입
**결정**: `#BFFFCC` (민트 연두)를 Secondary Accent 색상으로 팔레트에 추가
**이유**: 퍼플(`#C4B8F0` / `#534AB7`)만으로는 단조로움. 연두와 퍼플은 보색에 가까운 대비로 시각적 활기.
**사용 위치**: Secondary 버튼(다시 뽑기) 배경, 저장 성공 피드백, 앱 타이틀 accent 밑줄, ExportCard 워터마크
**텍스트 색**: `#BFFFCC` 위에는 `#1A5C35` (대비비 ~5.7:1, WCAG AA 통과)
**주의**: 퍼플이 주, 연두는 보조. 둘을 같은 비중으로 쓰지 않는다.

---

### ADR-008: 하네스 방식 개발 (phases/steps)
**결정**: `scripts/execute.py` 하네스로 phase 단위 자동 구현
**이유**: 구현 단계를 명확히 분리하고, Claude CLI가 각 step을 순차 실행. 실패 시 자동 재시도(최대 3회). 커밋 자동.
**트레이드오프**: step 파일 사전 작성 필요. step 간 의존성 명확히 정의해야 함.
**step 작성 원칙**: 각 step은 독립 실행 가능. AC(Acceptance Criteria)는 터미널 명령으로 검증 가능하게 작성. 완료 시 index.json status → "completed" + 한 줄 summary 업데이트.
