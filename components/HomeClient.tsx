'use client'

import { useState, useRef } from 'react'
import type { Verse } from '@/types'
import ParticleCanvas from '@/components/ParticleCanvas'
import VerseCard from '@/components/VerseCard'
import ExportCard from '@/components/ExportCard'
import type { ExportCardHandle } from '@/components/ExportCard'

interface HomeClientProps {
  verses: Verse[]
}

export default function HomeClient({ verses }: HomeClientProps) {
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
  const [viewState, setViewState] = useState<'particles' | 'leaving' | 'card'>('particles')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [lang, setLang] = useState<'ko' | 'en'>('ko')
  const exportCardRef = useRef<ExportCardHandle>(null)

  const handleSelect = (verse: Verse) => {
    setSelectedVerse(verse)
    setViewState('leaving')
    setTimeout(() => setViewState('card'), 250)
  }

  const handleReset = () => {
    setSaveState('idle')
    setSelectedVerse(null)
    setViewState('particles')
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

  const ui = lang === 'ko'
    ? {
        subtitle: '마음이 머무는 곳을 터치해보세요',
        save:    { idle: '저장하기', saving: '저장 중...', success: '저장됐어요 ✓', error: '저장에 실패했어요. 다시 시도해주세요' },
        reset:   '다시 뽑기',
      }
    : {
        subtitle: 'Touch where your heart rests',
        save:    { idle: 'Save', saving: 'Saving...', success: 'Saved ✓', error: 'Failed to save. Please try again' },
        reset:   'Draw again',
      }

  const saveButtonLabel = ui.save[saveState]

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* 언어 토글 */}
      <button
        className="btn-toggle"
        onClick={() => setLang(l => l === 'ko' ? 'en' : 'ko')}
        style={{
          position: 'fixed',
          top: '22px',
          right: '20px',
          zIndex: 20,
          background: 'var(--purple-light)',
          color: 'var(--purple-dark)',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 12px',
          fontFamily: 'NanumSquareNeo, sans-serif',
          fontWeight: 700,
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        {lang === 'ko' ? 'EN' : '한'}
      </button>

      {/* 앱 타이틀 */}
      <div style={{ position: 'fixed', top: '28px', left: 0, right: 0, textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <h1
          style={{
            fontFamily: 'Lora, Georgia, serif',
            fontWeight: 700,
            fontSize: '32px',
            color: 'var(--text-primary)',
          }}
        >
          <span style={{fontSize: '20px'}}>the </span>Word
        </h1>
        <svg
          width="80"
          viewBox="0 0 120 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', margin: '2px auto 0' }}
        >
          <path
            d="M 0,10 C 5,4 15,4 20,10 C 25,16 35,16 40,10 C 45,4 55,4 60,10 C 65,16 75,16 80,10 C 85,4 95,4 100,10 C 105,16 115,16 120,10"
            stroke="var(--text-primary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {viewState !== 'card' && (
          <p
            style={{
              marginTop: '8px',
              fontFamily: 'NanumSquareNeo, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}
          >
            {ui.subtitle}
          </p>
        )}
      </div>

      {viewState !== 'card' ? (
        <>
          {/* 파티클 캔버스 */}
          <div
            className={viewState === 'leaving' ? 'particle-leaving' : undefined}
            style={{ flex: 1, overflow: 'hidden' }}
          >
            <ParticleCanvas verses={verses} onSelect={handleSelect} />
          </div>
        </>
      ) : selectedVerse ? (
        <div
          className="card-view"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
            gap: '24px',
            overflowY: 'auto',
          }}
        >
          <VerseCard verse={selectedVerse} lang={lang} />

          {/* ExportCard (화면 밖) */}
          <ExportCard ref={exportCardRef} verse={selectedVerse} lang={lang} />

          {/* 버튼 영역 */}
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
              className="btn-primary"
              onClick={handleSave}
              disabled={saveState === 'saving'}
              style={{
                background: saveState === 'error' ? 'var(--green-accent)' : 'var(--purple-light)',
                color: saveState === 'error' ? 'var(--green-text)' : 'var(--purple-dark)',
                border: 'none',
                borderRadius: '6px',
                padding: '14px 24px',
                fontFamily: 'NanumSquareNeo, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                width: '100%',
                transition: 'background 200ms, color 200ms, opacity 150ms, transform 100ms',
              }}
            >
              {saveButtonLabel}
            </button>
            <button
              className="btn-ghost"
              onClick={handleReset}
              style={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--card-border)',
                borderRadius: '6px',
                padding: '14px 24px',
                fontFamily: 'NanumSquareNeo, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                width: '100%',
                transition: 'background 150ms, transform 100ms',
              }}
            >
              {ui.reset}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )
}
