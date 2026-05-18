export interface Verse {
  id: number
  book: { ko: string; en: string }
  chapter: number
  verse: number
  text: { ko: string }
}
