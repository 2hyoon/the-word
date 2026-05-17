'use client'

import { useState, useRef } from 'react'
import type { Verse } from '@/types'
import Wheel from '@/components/Wheel'
import VerseCard from '@/components/VerseCard'
import ExportCard from '@/components/ExportCard'
import type { ExportCardHandle } from '@/components/ExportCard'

interface HomeClientProps {
  verses: Verse[]
}

export default function HomeClient({ verses }: HomeClientProps) {
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const exportCardRef = useRef<ExportCardHandle>(null)

  const handleCategorySelect = (categoryId: string) => {
    const pool = verses.filter(v => v.categoryId === categoryId)
    const source = pool.length > 0 ? pool : verses
    const verse = source[Math.floor(Math.random() * source.length)]
    setSelectedVerse(verse)
  }

  const handleReset = () => {
    setSaveState('idle')
    setSelectedVerse(null)
  }

  const handleSave = async () => {
    if (saveState === 'saving' || !exportCardRef.current) return
    setSaveState('saving')
    try {
      await exportCardRef.current.save()
      setSaveState('success')
      setTimeout(() => setSaveState('idle'), 1500)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  const saveButtonLabel = {
    idle:    '저장하기',
    saving:  '저장 중...',
    success: '저장됐어요 ✓',
    error:   '저장에 실패했어요. 다시 시도해주세요',
  }[saveState]

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

        {/* VerseCard */}
        {selectedVerse && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <VerseCard verse={selectedVerse} />
          </div>
        )}
      </div>

      {/* ExportCard (화면 밖) */}
      {selectedVerse && (
        <ExportCard ref={exportCardRef} verse={selectedVerse} />
      )}

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
            disabled={saveState === 'saving'}
            style={{
              background: saveState === 'error' ? 'var(--green-accent)' : 'var(--purple-light)',
              color: saveState === 'error' ? 'var(--green-text)' : 'var(--purple-dark)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontFamily: 'NanumSquareNeo, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              cursor: saveState === 'saving' ? 'not-allowed' : 'pointer',
              width: '100%',
              opacity: saveState === 'saving' ? 0.5 : 1,
              transition: 'background 200ms, color 200ms',
            }}
          >
            {saveButtonLabel}
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
