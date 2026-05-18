'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { Verse } from '@/types'
import { captureAndSave } from '@/lib/image'

export interface ExportCardHandle {
  save: () => Promise<void>
}

const ExportCard = forwardRef<ExportCardHandle, { verse: Verse; lang: 'ko' | 'en' }>(
  function ExportCard({ verse, lang }, ref) {
    const cardRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      save: async () => {
        await captureAndSave(cardRef)
      },
    }))

    return (
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={cardRef}
          style={{
            width: 540,
            height: 540,
            overflow: 'hidden',
            background: '#FFFFFF',
            border: '2px solid #C4B8F0',
            borderRadius: 0,
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          <span style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            background: '#C4B8F026',
            border: '1px solid #C4B8F04D',
            borderRadius: '9999px',
            padding: '4px 12px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#534AB7',
            marginBottom: '24px',
          }}>
            the Word
          </span>

          <p style={{
            fontSize: '22px',
            fontWeight: 400,
            lineHeight: 1.8,
            color: '#1A1A1A',
            wordBreak: lang === 'ko' ? 'keep-all' : 'normal',
            margin: 0,
            marginBottom: '24px',
          }}>
            {lang === 'en' && verse.text.en ? verse.text.en : verse.text.ko}
          </p>

          <p style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#6B6B6B',
            textAlign: 'right',
            margin: 0,
          }}>
            — {lang === 'en' ? `${verse.book.en} ${verse.chapter}:${verse.verse}` : `${verse.book.ko} ${verse.chapter}:${verse.verse}`}
          </p>

          <div style={{
            position: 'absolute',
            bottom: '60px',
            right: '60px',
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 800,
              color: '#6B6B8A',
              borderBottom: '2px solid #BFFFCC',
              paddingBottom: '2px',
            }}>
              the Word
            </span>
          </div>
        </div>
      </div>
    )
  }
)

export default ExportCard
