# Step 1: 패키지 설치 + layout.tsx 정리 + 폰트 설정

## 작업 목록

### 1-A. 패키지 설치
```bash
npm install d3 html2canvas
npm install --save-dev @types/d3
```

### 1-B. public/fonts/ 폰트 파일 확인
`public/fonts/` 디렉토리에 NanumSquareNeo TTF 파일이 있는지 확인하라.
없다면 `assets/` 디렉토리를 탐색해 TTF 파일을 찾아 `public/fonts/`로 복사하라.
필요한 웨이트: Light(300), Regular(400), Bold(700), ExtraBold(800), Heavy(900)
파일명 패턴: `NanumSquareNeo-*Light.ttf`, `NanumSquareNeo-*Regular.ttf` 등

### 1-C. app/layout.tsx 교체
아래 규칙을 **모두** 적용하라:
- `next/font/google`의 Geist import 완전 제거 (import 문 + className 적용 전부)
- `<html lang="ko">`
- `<head>` 안에 `<meta name="color-scheme" content="light" />`
- OG 메타 태그 (Next.js Metadata API 사용):
  ```typescript
  export const metadata: Metadata = {
    title: 'the Word — 오늘의 말씀',
    description: '지금 이 순간 당신에게 필요한 말씀을 뽑아보세요',
    openGraph: {
      title: 'the Word — 오늘의 말씀',
      description: '지금 이 순간 당신에게 필요한 말씀을 뽑아보세요',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
      type: 'website',
      url: 'https://theword.app',
    },
    twitter: { card: 'summary_large_image' },
  }
  ```
- `<body>` className에서 Geist 폰트 변수 제거. 대신 빈 문자열 또는 단순 클래스만.

## Acceptance Criteria

```bash
# 1. 패키지 설치 확인
node -e "require('d3'); console.log('d3 ok')"
node -e "require('html2canvas'); console.log('html2canvas ok')"

# 2. 폰트 파일 존재 확인
ls public/fonts/*.ttf | wc -l
# 출력이 1 이상이면 통과 (최소 1개 이상의 TTF)

# 3. layout.tsx에 Geist 없는지 확인
grep -n "Geist\|next/font" app/layout.tsx && echo "FAIL: Geist 남아있음" || echo "PASS: Geist 없음"

# 4. lang="ko" 확인
grep 'lang="ko"' app/layout.tsx && echo "PASS" || echo "FAIL"

# 5. TypeScript 컴파일 확인
npx tsc --noEmit
```

모든 AC 통과 후 `phases/01-foundation/index.json`의 step 1 status를 "completed"로 업데이트하고 summary를 한 줄로 작성하라.
