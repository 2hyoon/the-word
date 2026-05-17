import type { RefObject } from 'react'

export async function captureAndSave(cardRef: RefObject<HTMLDivElement | null>): Promise<void> {
  if (!cardRef.current) throw new Error('cardRef is null')

  await document.fonts.ready

  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(cardRef.current, {
    scale: 2,
    width: 540,
    height: 540,
    useCORS: true,
    backgroundColor: '#FFFFFF',
  })

  const dataUrl = canvas.toDataURL('image/png')

  // iOS Safari: navigator.share with File API
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], 'theword.png', { type: 'image/png' })
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] })
      return
    }
  }

  // Desktop fallback
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = 'theword.png'
  a.click()
}
