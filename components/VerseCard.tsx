import type { Verse } from '@/types'

interface VerseCardProps {
  verse: Verse
}

export default function VerseCard({ verse }: VerseCardProps) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #C4B8F0',
      borderRadius: '6px',
      padding: '28px 24px',
      maxWidth: '320px',
      width: '100%',
      boxShadow: '0 4px 24px rgba(196,184,240,0.15)',
      animation: 'fadeIn 400ms ease-out both',
    }}>
      <span style={{
        display: 'inline-block',
        background: '#C4B8F026',
        border: '1px solid #C4B8F04D',
        borderRadius: '9999px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 700,
        color: '#534AB7',
        marginBottom: '16px',
      }}>
        the Word
      </span>

      <p style={{
        fontSize: '17px',
        fontWeight: 400,
        lineHeight: 1.75,
        color: 'var(--text-primary)',
        wordBreak: 'keep-all',
        margin: 0,
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
