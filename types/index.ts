export interface Verse {
  id: number
  book: { ko: string; en: string }
  chapter: number
  verse: number
  categoryId: 'hard' | 'fear' | 'relation' | 'grateful' | 'future' | 'decision'
  category: { ko: string }
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
