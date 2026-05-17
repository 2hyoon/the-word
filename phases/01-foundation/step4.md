# Step 4: app/page.tsx — Server Component

## 작업

`app/page.tsx`를 Server Component로 작성하라.
verses.json을 정적으로 import하고 HomeClient에 전달한다.
이 시점에서 HomeClient는 아직 없으므로 placeholder를 함께 생성한다.

### app/page.tsx

```typescript
import verses from '@/data/verses.json'
import HomeClient from '@/components/HomeClient'
import type { Verse } from '@/types'

export default function Page() {
  return <HomeClient verses={verses as Verse[]} />
}
```

### components/HomeClient.tsx (placeholder)

Phase 02에서 완전 구현하지만, 빌드 오류 방지를 위해 최소 skeleton을 만든다:

```typescript
'use client'

import type { Verse } from '@/types'

interface HomeClientProps {
  verses: Verse[]
}

export default function HomeClient({ verses }: HomeClientProps) {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh', background: 'var(--bg)' }}>
      <p style={{ fontFamily: 'NanumSquareNeo, sans-serif', color: 'var(--text-secondary)' }}>
        구절 수: {verses.length}
      </p>
    </main>
  )
}
```

## Acceptance Criteria

```bash
# 파일 존재 확인
test -f app/page.tsx && test -f components/HomeClient.tsx && echo "PASS" || echo "FAIL"

# page.tsx가 'use client' 없는지 확인 (Server Component 유지)
grep "'use client'" app/page.tsx && echo "FAIL: page.tsx must be Server Component" || echo "PASS"

# 빌드 성공 확인
npm run build 2>&1 | tail -5
```

빌드가 성공(exit 0)하면 step 4 status를 "completed"로 업데이트하라.
빌드 실패 시 오류를 수정하고 재시도하라.
