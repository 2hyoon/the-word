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
  const [showAbout, setShowAbout] = useState(false)
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
      {/* 우상단 버튼 그룹 */}
      <div style={{ position: 'fixed', top: '22px', right: '20px', zIndex: 20, display: 'flex', gap: '8px' }}>
        <button
          className="btn-toggle"
          onClick={() => setShowAbout(true)}
          style={{
            background: 'var(--purple-light)',
            color: 'var(--purple-dark)',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 10px',
            fontFamily: 'NanumSquareNeo, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          ?
        </button>
        <button
          className="btn-toggle"
          onClick={() => setLang(l => l === 'ko' ? 'en' : 'ko')}
          style={{
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
      </div>

      {/* About 모달 */}
      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(26,26,46,0.3)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              padding: '36px 32px',
              maxWidth: '320px',
              width: 'calc(100% - 48px)',
              textAlign: 'center',
              fontFamily: 'NanumSquareNeo, sans-serif',
            }}
          >
            <p style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>
              {lang === 'ko'
                ? <>&ldquo;태초에 말씀이 계시니라&rdquo;<br />— 요한복음 1:1</>
                : <>&ldquo;In the beginning was the Word&rdquo;<br />— John 1:1</>}
            </p>
            <p style={{ fontSize: '15px', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.8 }}>
              {lang === 'ko'
                ? <>당신이 말씀을 선택한 것이 아니라,<br />말씀이 당신을 선택하였습니다.</>
                : <>You did not choose the Word.<br />The Word chose you.</>}
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowAbout(false)}
              style={{
                marginTop: '28px',
                background: 'var(--purple-light)',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 28px',
                fontFamily: 'NanumSquareNeo, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                color: 'var(--purple-dark)',
                cursor: 'pointer',
              }}
            >
              {lang === 'ko' ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      )}

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
          width="150"
          viewBox="0 0 360 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', margin: '2px auto 0' }}
        >
          <path
            d="M 0,10 C 5,4 15,4 20,10 C 25,16 35,16 40,10 C 45,4 55,4 60,10 C 65,16 75,16 80,10 C 85,4 95,4 100,10 C 105,16 115,16 120,10 C 125,4 135,4 140,10 C 145,16 155,16 160,10 C 165,4 175,4 180,10 C 185,16 195,16 200,10 C 205,4 215,4 220,10 C 225,16 235,16 240,10 C 245,4 255,4 260,10 C 265,16 275,16 280,10 C 285,4 295,4 300,10 C 305,16 315,16 320,10 C 325,4 335,4 340,10 C 345,16 355,16 360,10"
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
