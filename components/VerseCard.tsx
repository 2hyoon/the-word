import type { Verse } from '@/types'
import { CATEGORIES } from '@/types'

interface VerseCardProps {
  verse: Verse
}

export default function VerseCard({ verse }: VerseCardProps) {
  const cat = CATEGORIES.find(c => c.id === verse.categoryId)
  const badgeBg = cat ? cat.color + '26' : '#C4B8F026'   // opacity ~15%
  const badgeBorder = cat ? cat.color + '4D' : '#C4B8F04D' // opacity ~30%
  const badgeText = cat ? cat.textColor : '#534AB7'

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #C4B8F0',
      borderRadius: '20px',
      padding: '28px 24px',
      maxWidth: '320px',
      width: '100%',
      boxShadow: '0 4px 24px rgba(196,184,240,0.15)',
      animation: 'fadeIn 400ms ease-out both',
    }}>
      <span style={{
        display: 'inline-block',
        background: badgeBg,
        border: `1px solid ${badgeBorder}`,
        borderRadius: '9999px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 700,
        color: badgeText,
      }}>
        {verse.category.ko}
      </span>

      <p style={{
        marginTop: '16px',
        fontSize: '17px',
        fontWeight: 400,
        lineHeight: 1.75,
        color: 'var(--text-primary)',
        wordBreak: 'keep-all',
      }}>
        {verse.text.ko}
      </p>

      <p style={{
        marginTop: '20px',
        fontSize: '13px',
        fontWeight: 700,
        color: 'var(--text-secondary)',
        textAlign: 'right',
      }}>
        {verse.book.ko} {verse.chapter}:{verse.verse}
      </p>
    </div>
  )
}
