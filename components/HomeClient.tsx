'use client'

import { useState } from 'react'
import type { Verse } from '@/types'
import Wheel from '@/components/Wheel'

interface HomeClientProps {
  verses: Verse[]
}

export default function HomeClient({ verses }: HomeClientProps) {
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)

  const handleCategorySelect = (categoryId: string) => {
    const pool = verses.filter(v => v.categoryId === categoryId)
    const source = pool.length > 0 ? pool : verses
    const verse = source[Math.floor(Math.random() * source.length)]
    setSelectedVerse(verse)
  }

  const handleReset = () => {
    setSelectedVerse(null)
  }

  const handleSave = () => {
    alert('저장 기능은 Phase 03에서 구현됩니다')
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        padding: '32px 24px',
        gap: '24px',
        background: 'var(--bg)',
      }}
    >
      {/* 앱 타이틀 */}
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'NanumSquareNeo, sans-serif',
            fontWeight: 900,
            fontSize: '24px',
            color: 'var(--text-primary)',
          }}
        >
          the Word
        </h1>
        <div
          style={{
            width: '40px',
            height: '2px',
            background: 'var(--green-accent)',
            margin: '4px auto 0',
          }}
        />
      </div>

      {/* 안내 문구 */}
      <div
        style={{
          opacity: selectedVerse ? 0 : 1,
          transition: 'opacity 300ms ease',
          pointerEvents: selectedVerse ? 'none' : 'auto',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'NanumSquareNeo, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          마음을 담아 돌려보세요
        </p>
        <p
          style={{
            fontFamily: 'NanumSquareNeo, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          오늘 당신에게 필요한 한 마디가 기다리고 있어요
        </p>
      </div>

      {/* 전환 컨테이너 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '320px',
          aspectRatio: '1',
        }}
      >
        {/* 휠 */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Wheel visible={!selectedVerse} onCategorySelect={handleCategorySelect} />
        </div>

        {/* 카드 placeholder */}
        {selectedVerse && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 1,
              animation: 'fadeIn 400ms ease-out',
              padding: '24px',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'NanumSquareNeo, sans-serif',
                fontSize: '14px',
                color: 'var(--text-primary)',
                lineHeight: 1.8,
              }}
            >
              {selectedVerse.text.ko.slice(0, 20)}...
            </p>
          </div>
        )}
      </div>

      {/* 버튼 영역 */}
      {selectedVerse && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
            maxWidth: '320px',
          }}
        >
          <button
            onClick={handleSave}
            style={{
              background: 'var(--purple-light)',
              color: 'var(--purple-dark)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontFamily: 'NanumSquareNeo, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            저장하기
          </button>
          <button
            onClick={handleReset}
            style={{
              background: 'var(--green-accent)',
              color: 'var(--green-text)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontFamily: 'NanumSquareNeo, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            다시 뽑기
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </main>
  )
}
