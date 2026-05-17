# Step 3: types/index.ts + data/verses.json + lib/wheel.ts + lib/image.ts

## 3-A. types/index.ts

`types/index.ts` 파일을 생성하라:

```typescript
export interface Verse {
  id: number
  book: { ko: string; en: string }
  chapter: number
  verse: number
  categoryId: 'hard' | 'fear' | 'relation' | 'grateful' | 'future' | 'decision'
  category: { ko: string; en: string }
  text: { ko: string }
}

export interface Category {
  id: 'hard' | 'fear' | 'relation' | 'grateful' | 'future' | 'decision'
  label: { ko: string }
  color: string
  textColor: string
}

export const CATEGORIES: Category[] = [
  { id: 'hard',     label: { ko: '너무\n힘들 때' },      color: '#F59E0B', textColor: '#7C2D12' },
  { id: 'fear',     label: { ko: '불안하고\n무서울 때' }, color: '#A78BFA', textColor: '#3B0764' },
  { id: 'relation', label: { ko: '관계가\n힘들 때' },     color: '#F87171', textColor: '#7F1D1D' },
  { id: 'grateful', label: { ko: '뭔가\n잘 됐을 때' },   color: '#34D399', textColor: '#064E3B' },
  { id: 'future',   label: { ko: '앞이\n안 보일 때' },    color: '#2DD4BF', textColor: '#134E4A' },
  { id: 'decision', label: { ko: '선택해야\n할 때' },     color: '#60A5FA', textColor: '#1E3A5F' },
]
```

## 3-B. data/verses.json

`data/verses.json`을 생성하라. **48개 구절** (카테고리별 8개):

```json
[
  { "id": 1,  "book": { "ko": "시편", "en": "Psalms" },          "chapter": 34, "verse": 18, "categoryId": "hard",     "category": { "ko": "너무 힘들 때" },      "text": { "ko": "여호와는 마음이 상한 자를 가까이 하시고 충심으로 통회하는 자를 구원하시는도다" } },
  { "id": 2,  "book": { "ko": "마태복음", "en": "Matthew" },      "chapter": 11, "verse": 28, "categoryId": "hard",     "category": { "ko": "너무 힘들 때" },      "text": { "ko": "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라" } },
  { "id": 3,  "book": { "ko": "이사야", "en": "Isaiah" },         "chapter": 41, "verse": 10, "categoryId": "hard",     "category": { "ko": "너무 힘들 때" },      "text": { "ko": "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라" } },
  { "id": 4,  "book": { "ko": "시편", "en": "Psalms" },           "chapter": 46,  "verse": 1, "categoryId": "hard",     "category": { "ko": "너무 힘들 때" },      "text": { "ko": "하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라" } },
  { "id": 5,  "book": { "ko": "고린도후서", "en": "2 Corinthians" }, "chapter": 4, "verse": 17, "categoryId": "hard",  "category": { "ko": "너무 힘들 때" },      "text": { "ko": "우리가 잠시 받는 환난의 경한 것이 지극히 크고 영원한 영광의 중한 것을 우리에게 이루게 함이니" } },
  { "id": 6,  "book": { "ko": "로마서", "en": "Romans" },         "chapter": 8,  "verse": 18, "categoryId": "hard",     "category": { "ko": "너무 힘들 때" },      "text": { "ko": "현재의 고난은 장차 우리에게 나타날 영광과 비교할 수 없도다" } },
  { "id": 7,  "book": { "ko": "시편", "en": "Psalms" },           "chapter": 121, "verse": 2, "categoryId": "hard",     "category": { "ko": "너무 힘들 때" },      "text": { "ko": "나의 도움은 천지를 만드신 여호와에게서로다" } },
  { "id": 8,  "book": { "ko": "이사야", "en": "Isaiah" },         "chapter": 40, "verse": 31, "categoryId": "hard",     "category": { "ko": "너무 힘들 때" },      "text": { "ko": "오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요" } },

  { "id": 9,  "book": { "ko": "빌립보서", "en": "Philippians" },  "chapter": 4,  "verse": 6, "categoryId": "fear",      "category": { "ko": "불안하고 무서울 때" }, "text": { "ko": "아무것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라" } },
  { "id": 10, "book": { "ko": "요한복음", "en": "John" },         "chapter": 14, "verse": 27, "categoryId": "fear",      "category": { "ko": "불안하고 무서울 때" }, "text": { "ko": "평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라" } },
  { "id": 11, "book": { "ko": "시편", "en": "Psalms" },           "chapter": 23,  "verse": 4, "categoryId": "fear",      "category": { "ko": "불안하고 무서울 때" }, "text": { "ko": "내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라" } },
  { "id": 12, "book": { "ko": "디모데후서", "en": "2 Timothy" },  "chapter": 1,   "verse": 7, "categoryId": "fear",      "category": { "ko": "불안하고 무서울 때" }, "text": { "ko": "하나님이 우리에게 주신 것은 두려워하는 마음이 아니요 오직 능력과 사랑과 절제하는 마음이니" } },
  { "id": 13, "book": { "ko": "이사야", "en": "Isaiah" },         "chapter": 43,  "verse": 1, "categoryId": "fear",      "category": { "ko": "불안하고 무서울 때" }, "text": { "ko": "두려워하지 말라 내가 너를 구속하였고 내가 너를 지명하여 불렀나니 너는 내 것이라" } },
  { "id": 14, "book": { "ko": "시편", "en": "Psalms" },           "chapter": 56,  "verse": 3, "categoryId": "fear",      "category": { "ko": "불안하고 무서울 때" }, "text": { "ko": "내가 두려워하는 날에는 주를 의지하리이다" } },
  { "id": 15, "book": { "ko": "로마서", "en": "Romans" },         "chapter": 8,  "verse": 38, "categoryId": "fear",      "category": { "ko": "불안하고 무서울 때" }, "text": { "ko": "사망이나 생명이나 천사들이나 권세자들이나 현재 일이나 장래 일이나 능력이나 우리를 하나님의 사랑에서 끊을 수 없으리라" } },
  { "id": 16, "book": { "ko": "마태복음", "en": "Matthew" },      "chapter": 6,  "verse": 34, "categoryId": "fear",      "category": { "ko": "불안하고 무서울 때" }, "text": { "ko": "내일 일을 위하여 염려하지 말라 내일 일은 내일이 염려할 것이요 한 날의 괴로움은 그 날로 족하니라" } },

  { "id": 17, "book": { "ko": "고린도전서", "en": "1 Corinthians" }, "chapter": 13, "verse": 4, "categoryId": "relation", "category": { "ko": "관계가 힘들 때" },    "text": { "ko": "사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며" } },
  { "id": 18, "book": { "ko": "에베소서", "en": "Ephesians" },    "chapter": 4,  "verse": 32, "categoryId": "relation", "category": { "ko": "관계가 힘들 때" },    "text": { "ko": "서로 친절하게 하며 불쌍히 여기며 서로 용서하기를 하나님이 그리스도 안에서 너희를 용서하심과 같이 하라" } },
  { "id": 19, "book": { "ko": "로마서", "en": "Romans" },         "chapter": 12, "verse": 18, "categoryId": "relation", "category": { "ko": "관계가 힘들 때" },    "text": { "ko": "할 수 있거든 너희로서는 모든 사람과 더불어 화목하라" } },
  { "id": 20, "book": { "ko": "마태복음", "en": "Matthew" },      "chapter": 6,  "verse": 14, "categoryId": "relation", "category": { "ko": "관계가 힘들 때" },    "text": { "ko": "너희가 사람의 잘못을 용서하면 너희 하늘 아버지께서도 너희 잘못을 용서하시려니와" } },
  { "id": 21, "book": { "ko": "요한복음", "en": "John" },         "chapter": 13, "verse": 34, "categoryId": "relation", "category": { "ko": "관계가 힘들 때" },    "text": { "ko": "새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라" } },
  { "id": 22, "book": { "ko": "잠언", "en": "Proverbs" },         "chapter": 17, "verse": 17, "categoryId": "relation", "category": { "ko": "관계가 힘들 때" },    "text": { "ko": "친구는 사랑이 끊이지 아니하고 형제는 위급한 때를 위하여 났느니라" } },
  { "id": 23, "book": { "ko": "골로새서", "en": "Colossians" },   "chapter": 3,  "verse": 13, "categoryId": "relation", "category": { "ko": "관계가 힘들 때" },    "text": { "ko": "주께서 너희를 용서하신 것과 같이 너희도 그리하고" } },
  { "id": 24, "book": { "ko": "베드로전서", "en": "1 Peter" },    "chapter": 4,   "verse": 8, "categoryId": "relation", "category": { "ko": "관계가 힘들 때" },    "text": { "ko": "무엇보다도 뜨겁게 서로 사랑할지니 사랑은 허다한 죄를 덮느니라" } },

  { "id": 25, "book": { "ko": "시편", "en": "Psalms" },           "chapter": 100, "verse": 4, "categoryId": "grateful", "category": { "ko": "뭔가 잘 됐을 때" },   "text": { "ko": "감사함으로 그의 문에 들어가며 찬송함으로 그의 궁정에 들어가서 그에게 감사하며 그의 이름을 송축할지어다" } },
  { "id": 26, "book": { "ko": "데살로니가전서", "en": "1 Thessalonians" }, "chapter": 5, "verse": 18, "categoryId": "grateful", "category": { "ko": "뭔가 잘 됐을 때" }, "text": { "ko": "범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라" } },
  { "id": 27, "book": { "ko": "야고보서", "en": "James" },        "chapter": 1,  "verse": 17, "categoryId": "grateful", "category": { "ko": "뭔가 잘 됐을 때" },   "text": { "ko": "온갖 좋은 은사와 온전한 선물이 다 위로부터 빛들의 아버지께로부터 내려오나니" } },
  { "id": 28, "book": { "ko": "시편", "en": "Psalms" },           "chapter": 107, "verse": 1, "categoryId": "grateful", "category": { "ko": "뭔가 잘 됐을 때" },   "text": { "ko": "여호와께 감사하라 그는 선하시며 그 인자하심이 영원함이로다" } },
  { "id": 29, "book": { "ko": "빌립보서", "en": "Philippians" },  "chapter": 4,   "verse": 4, "categoryId": "grateful", "category": { "ko": "뭔가 잘 됐을 때" },   "text": { "ko": "주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라" } },
  { "id": 30, "book": { "ko": "시편", "en": "Psalms" },           "chapter": 118, "verse": 24, "categoryId": "grateful", "category": { "ko": "뭔가 잘 됐을 때" },  "text": { "ko": "이 날은 여호와께서 정하신 것이라 이 날에 우리가 기뻐하고 즐거워하리로다" } },
  { "id": 31, "book": { "ko": "시편", "en": "Psalms" },           "chapter": 28,  "verse": 7, "categoryId": "grateful", "category": { "ko": "뭔가 잘 됐을 때" },   "text": { "ko": "여호와는 나의 힘과 나의 방패이시니 내 마음이 그를 의지하여 도움을 얻었도다" } },
  { "id": 32, "book": { "ko": "에베소서", "en": "Ephesians" },    "chapter": 5,  "verse": 20, "categoryId": "grateful", "category": { "ko": "뭔가 잘 됐을 때" },   "text": { "ko": "범사에 우리 주 예수 그리스도의 이름으로 항상 아버지 하나님께 감사하며" } },

  { "id": 33, "book": { "ko": "예레미야", "en": "Jeremiah" },     "chapter": 29, "verse": 11, "categoryId": "future",   "category": { "ko": "앞이 안 보일 때" },    "text": { "ko": "너희를 향한 나의 생각을 내가 아나니 평안이요 재앙이 아니니라 너희에게 미래와 희망을 주는 것이니라" } },
  { "id": 34, "book": { "ko": "잠언", "en": "Proverbs" },         "chapter": 3,   "verse": 5, "categoryId": "future",   "category": { "ko": "앞이 안 보일 때" },    "text": { "ko": "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라" } },
  { "id": 35, "book": { "ko": "로마서", "en": "Romans" },         "chapter": 8,  "verse": 28, "categoryId": "future",   "category": { "ko": "앞이 안 보일 때" },    "text": { "ko": "하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라" } },
  { "id": 36, "book": { "ko": "시편", "en": "Psalms" },           "chapter": 37,  "verse": 4, "categoryId": "future",   "category": { "ko": "앞이 안 보일 때" },    "text": { "ko": "여호와를 기뻐하라 그가 네 마음의 소원을 네게 이루어 주시리로다" } },
  { "id": 37, "book": { "ko": "히브리서", "en": "Hebrews" },      "chapter": 11,  "verse": 1, "categoryId": "future",   "category": { "ko": "앞이 안 보일 때" },    "text": { "ko": "믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니" } },
  { "id": 38, "book": { "ko": "이사야", "en": "Isaiah" },         "chapter": 41, "verse": 13, "categoryId": "future",   "category": { "ko": "앞이 안 보일 때" },    "text": { "ko": "나 여호와 너의 하나님이 네 오른손을 붙들고 네게 이르기를 두려워하지 말라 내가 너를 도우리라" } },
  { "id": 39, "book": { "ko": "시편", "en": "Psalms" },           "chapter": 23,  "verse": 1, "categoryId": "future",   "category": { "ko": "앞이 안 보일 때" },    "text": { "ko": "여호와는 나의 목자시니 내게 부족함이 없으리로다" } },
  { "id": 40, "book": { "ko": "요한계시록", "en": "Revelation" }, "chapter": 21,  "verse": 4, "categoryId": "future",   "category": { "ko": "앞이 안 보일 때" },    "text": { "ko": "모든 눈물을 그 눈에서 닦아 주시니 다시는 사망이 없고 애통하는 것이나 곡하는 것이나 아픈 것이 다시 있지 아니하리니" } },

  { "id": 41, "book": { "ko": "잠언", "en": "Proverbs" },         "chapter": 16,  "verse": 9, "categoryId": "decision", "category": { "ko": "선택해야 할 때" },     "text": { "ko": "사람이 마음으로 자기의 길을 계획할지라도 그의 걸음을 인도하시는 이는 여호와시니라" } },
  { "id": 42, "book": { "ko": "야고보서", "en": "James" },        "chapter": 1,   "verse": 5, "categoryId": "decision", "category": { "ko": "선택해야 할 때" },     "text": { "ko": "너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라" } },
  { "id": 43, "book": { "ko": "이사야", "en": "Isaiah" },         "chapter": 30, "verse": 21, "categoryId": "decision", "category": { "ko": "선택해야 할 때" },     "text": { "ko": "너희가 오른쪽으로 치우치든지 왼쪽으로 치우치든지 네 뒤에서 말소리가 들려 이르기를 이것이 바른 길이니 너희는 이리로 가라 할 것이며" } },
  { "id": 44, "book": { "ko": "시편", "en": "Psalms" },           "chapter": 32,  "verse": 8, "categoryId": "decision", "category": { "ko": "선택해야 할 때" },     "text": { "ko": "내가 네 갈 길을 가르쳐 보이고 너를 주목하여 훈계하리로다" } },
  { "id": 45, "book": { "ko": "요한복음", "en": "John" },         "chapter": 16, "verse": 13, "categoryId": "decision", "category": { "ko": "선택해야 할 때" },     "text": { "ko": "진리의 성령이 오시면 그가 너희를 모든 진리 가운데로 인도하시리니" } },
  { "id": 46, "book": { "ko": "잠언", "en": "Proverbs" },         "chapter": 3,   "verse": 6, "categoryId": "decision", "category": { "ko": "선택해야 할 때" },     "text": { "ko": "너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라" } },
  { "id": 47, "book": { "ko": "시편", "en": "Psalms" },           "chapter": 25,  "verse": 4, "categoryId": "decision", "category": { "ko": "선택해야 할 때" },     "text": { "ko": "여호와여 주의 도를 내게 보이시고 주의 길을 내게 가르치소서" } },
  { "id": 48, "book": { "ko": "골로새서", "en": "Colossians" },   "chapter": 3,  "verse": 15, "categoryId": "decision", "category": { "ko": "선택해야 할 때" },     "text": { "ko": "그리스도의 평강이 너희 마음을 주장하게 하라" } }
]
```

## 3-C. lib/wheel.ts

```typescript
import type { Category } from '@/types'
import { CATEGORIES } from '@/types'

export const WHEEL_RADIUS = 130
export const CENTER_RADIUS = 38
export const SVG_SIZE = 300
export const SVG_CENTER = SVG_SIZE / 2

export function getCategoryColor(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.color ?? '#C4B8F0'
}

export function getCategoryTextColor(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.textColor ?? '#1A1A2E'
}

// 카테고리별 휠 착지 각도 계산 (12시 기준 포인터 위치)
// 카테고리 순서: hard(0), fear(1), relation(2), grateful(3), future(4), decision(5)
// 각 세그먼트 = 60도, 포인터가 세그먼트 중앙을 가리키도록
export function getCategoryLandingAngle(categoryId: string): number {
  const idx = CATEGORIES.findIndex(c => c.id === categoryId)
  if (idx === -1) return 0
  // 각 세그먼트 시작각도 = idx * 60, 중앙 = idx * 60 + 30
  // D3 기본 시작이 3시(90도)이므로 오프셋 조정: 12시가 0도가 되려면 -90도
  return -(idx * 60 + 30)
}

export { CATEGORIES }
export type { Category }
```

## 3-D. lib/image.ts

```typescript
import type { RefObject } from 'react'

export async function captureAndSave(cardRef: RefObject<HTMLDivElement | null>): Promise<void> {
  if (!cardRef.current) throw new Error('cardRef is null')

  await document.fonts.ready

  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(cardRef.current, {
    scale: 2,
    width: 540,
    height: 540,
    useCORS: true,
    backgroundColor: '#FFFFFF',
  })

  const dataUrl = canvas.toDataURL('image/png')

  // iOS Safari: navigator.share with File API
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], 'theword.png', { type: 'image/png' })
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] })
      return
    }
  }

  // Desktop fallback
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = 'theword.png'
  a.click()
}
```

## Acceptance Criteria

```bash
# types/index.ts 존재 확인
test -f types/index.ts && echo "PASS" || echo "FAIL"

# verses.json 존재 + 48개 항목 확인
node -e "const v = require('./data/verses.json'); console.log(v.length === 48 ? 'PASS: 48 verses' : 'FAIL: ' + v.length)"

# lib 파일 존재 확인
test -f lib/wheel.ts && test -f lib/image.ts && echo "PASS" || echo "FAIL"

# TypeScript 컴파일
npx tsc --noEmit
```

모든 AC 통과 후 step 3 status를 "completed"로 업데이트하라.
