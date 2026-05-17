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
