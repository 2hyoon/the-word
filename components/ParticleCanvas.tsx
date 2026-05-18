'use client'

import { useEffect, useRef } from 'react'
import type { Verse } from '@/types'

interface ParticleCanvasProps {
  verses: Verse[]
  onSelect: (verse: Verse) => void
}

const SPEED = 0.3
const CANVAS_SCALE = 4

type ShapeType = 'circle' | 'diamond' | 'star'
const SHAPES: ShapeType[] = ['circle', 'diamond', 'star']

interface BookColor { fill: string; stroke: string }

const BOOK_COLORS: Record<string, BookColor> = {
  // 구약 시/지혜서
  '시편':           { fill: '#F5E6C0', stroke: '#C49A3C' },
  '잠언':           { fill: '#F5E6C0', stroke: '#C49A3C' },
  // 구약 예언서 + 역사서
  '여호수아':       { fill: '#F0C4B8', stroke: '#C47060' },
  '이사야':         { fill: '#F0C4B8', stroke: '#C47060' },
  '예레미야':       { fill: '#F0C4B8', stroke: '#C47060' },
  '예레미야 애가':  { fill: '#F0C4B8', stroke: '#C47060' },
  '다니엘':         { fill: '#F0C4B8', stroke: '#C47060' },
  '미가':           { fill: '#F0C4B8', stroke: '#C47060' },
  '하박국':         { fill: '#F0C4B8', stroke: '#C47060' },
  '스가랴':         { fill: '#F0C4B8', stroke: '#C47060' },
  '말라기':         { fill: '#F0C4B8', stroke: '#C47060' },
  // 복음서
  '마태복음':       { fill: '#C4B8F0', stroke: '#534AB7' },
  '마가복음':       { fill: '#C4B8F0', stroke: '#534AB7' },
  '누가복음':       { fill: '#C4B8F0', stroke: '#534AB7' },
  '요한복음':       { fill: '#C4B8F0', stroke: '#534AB7' },
  // 서신서 + 계시록
  '로마서':         { fill: '#BFFFCC', stroke: '#1A5C35' },
  '고린도전서':     { fill: '#BFFFCC', stroke: '#1A5C35' },
  '고린도후서':     { fill: '#BFFFCC', stroke: '#1A5C35' },
  '갈라디아서':     { fill: '#BFFFCC', stroke: '#1A5C35' },
  '에베소서':       { fill: '#BFFFCC', stroke: '#1A5C35' },
  '빌립보서':       { fill: '#BFFFCC', stroke: '#1A5C35' },
  '골로새서':       { fill: '#BFFFCC', stroke: '#1A5C35' },
  '데살로니가전서': { fill: '#BFFFCC', stroke: '#1A5C35' },
  '디모데후서':     { fill: '#BFFFCC', stroke: '#1A5C35' },
  '히브리서':       { fill: '#BFFFCC', stroke: '#1A5C35' },
  '야고보서':       { fill: '#BFFFCC', stroke: '#1A5C35' },
  '베드로전서':     { fill: '#BFFFCC', stroke: '#1A5C35' },
  '요한일서':       { fill: '#BFFFCC', stroke: '#1A5C35' },
  '요한계시록':     { fill: '#BFFFCC', stroke: '#1A5C35' },
}

const DEFAULT_COLOR: BookColor = { fill: '#C4B8F0', stroke: '#534AB7' }

function getBookColor(bookKo: string): BookColor {
  return BOOK_COLORS[bookKo] ?? DEFAULT_COLOR
}

// SVG path data centered at origin, ~10px outer radius
const SHAPE_PATH: Record<ShapeType, string> = {
  circle:  '', // uses <circle> element
  diamond: 'M 0 -10 L 10 0 L 0 10 L -10 0 Z',
  star:    'M 0 -10 L 2.4 -3.2 L 9.5 -3.1 L 3.8 1.2 L 5.9 8.1 L 0 4 L -5.9 8.1 L -3.8 1.2 L -9.5 -3.1 L -2.4 -3.2 Z',
}

interface Particle {
  verse: Verse
  x: number
  y: number
  angle: number
  targetAngle: number
  turnTimer: number
  paused: boolean
  shape: ShapeType
  color: BookColor
}

export default function ParticleCanvas({ verses, onSelect }: ParticleCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  })

  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    const { width: vpW, height: vpH } = svgEl.getBoundingClientRect()
    if (!vpW || !vpH) return

    const canvasW = vpW * CANVAS_SCALE
    const canvasH = vpH * CANVAS_SCALE
    const NS = 'http://www.w3.org/2000/svg'

    let tx = -(canvasW - vpW) / 2
    let ty = -(canvasH - vpH) / 2

    const gEl = document.createElementNS(NS, 'g')
    gEl.setAttribute('transform', `translate(${tx},${ty})`)
    svgEl.appendChild(gEl)

    const particles: Particle[] = verses.map(v => ({
      verse: v,
      x: 30 + Math.random() * (canvasW - 60),
      y: 30 + Math.random() * (canvasH - 60),
      angle: Math.random() * Math.PI * 2,
      targetAngle: Math.random() * Math.PI * 2,
      turnTimer: 60 + Math.random() * 180,
      paused: false,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: getBookColor(v.book.ko),
    }))

    // Each particle is a <g> containing the shape element
    const groupEls = particles.map((p, i) => {
      const group = document.createElementNS(NS, 'g')
      group.style.cursor = 'pointer'
      group.dataset.index = String(i)

      let shapeEl: SVGElement
      if (p.shape === 'circle') {
        const el = document.createElementNS(NS, 'circle')
        el.setAttribute('r', '10')
        shapeEl = el
      } else {
        const el = document.createElementNS(NS, 'path')
        el.setAttribute('d', SHAPE_PATH[p.shape])
        shapeEl = el
      }

      shapeEl.setAttribute('fill', p.color.fill)
      shapeEl.setAttribute('stroke', p.color.stroke)
      shapeEl.setAttribute('stroke-width', '0.8')
      shapeEl.setAttribute('fill-opacity', '0.8')
      group.appendChild(shapeEl)

      group.addEventListener('pointerenter', () => {
        particles[i].paused = true
        group.setAttribute('transform', `translate(${p.x},${p.y}) scale(1.3)`)
        shapeEl.setAttribute('fill', p.color.stroke)
        shapeEl.setAttribute('fill-opacity', '1')
      })
      group.addEventListener('pointerleave', () => {
        particles[i].paused = false
        shapeEl.setAttribute('fill', p.color.fill)
        shapeEl.setAttribute('fill-opacity', '0.8')
      })

      gEl.appendChild(group)
      return { group, shapeEl }
    })

    let rafId: number

    const animate = () => {
      const PAD = 15
      particles.forEach((p, i) => {
        if (p.paused) return

        p.turnTimer--
        if (p.turnTimer <= 0) {
          p.targetAngle = Math.random() * Math.PI * 2
          p.turnTimer = 80 + Math.random() * 160
        }

        let diff = p.targetAngle - p.angle
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        p.angle += diff * 0.015

        p.x += Math.cos(p.angle) * SPEED
        p.y += Math.sin(p.angle) * SPEED

        if (p.x < PAD) { p.x = PAD; p.angle = Math.PI - p.angle; p.targetAngle = p.angle + (Math.random() - 0.5) }
        if (p.x > canvasW - PAD) { p.x = canvasW - PAD; p.angle = Math.PI - p.angle; p.targetAngle = p.angle + (Math.random() - 0.5) }
        if (p.y < PAD) { p.y = PAD; p.angle = -p.angle; p.targetAngle = p.angle + (Math.random() - 0.5) }
        if (p.y > canvasH - PAD) { p.y = canvasH - PAD; p.angle = -p.angle; p.targetAngle = p.angle + (Math.random() - 0.5) }

        groupEls[i].group.setAttribute('transform', `translate(${p.x},${p.y})`)
      })

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    let isPanning = false
    let hasMoved = false
    let tapTarget: Element | null = null
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastY = 0

    const onPointerDown = (e: PointerEvent) => {
      isPanning = true
      hasMoved = false
      // Walk up from target to find particle group
      let el = e.target as Element | null
      while (el && el !== svgEl) {
        if ((el as HTMLElement).dataset?.index !== undefined) { tapTarget = el; break }
        el = el.parentElement
      }
      startX = lastX = e.clientX
      startY = lastY = e.clientY
      svgEl.setPointerCapture(e.pointerId)
      svgEl.style.cursor = 'grabbing'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isPanning) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (Math.sqrt(dx * dx + dy * dy) > 5) hasMoved = true
      tx = Math.min(0, Math.max(-(canvasW - vpW), tx + (e.clientX - lastX)))
      ty = Math.min(0, Math.max(-(canvasH - vpH), ty + (e.clientY - lastY)))
      lastX = e.clientX
      lastY = e.clientY
      gEl.setAttribute('transform', `translate(${tx},${ty})`)
    }

    const onPointerUp = () => {
      if (!isPanning) return
      isPanning = false
      svgEl.style.cursor = 'grab'
      if (!hasMoved && tapTarget) {
        const idx = parseInt((tapTarget as HTMLElement).dataset.index ?? '-1')
        if (idx >= 0) onSelectRef.current(particles[idx].verse)
      }
      tapTarget = null
    }

    svgEl.addEventListener('pointerdown', onPointerDown)
    svgEl.addEventListener('pointermove', onPointerMove)
    svgEl.addEventListener('pointerup', onPointerUp)
    svgEl.addEventListener('pointercancel', onPointerUp)

    return () => {
      cancelAnimationFrame(rafId)
      svgEl.removeEventListener('pointerdown', onPointerDown)
      svgEl.removeEventListener('pointermove', onPointerMove)
      svgEl.removeEventListener('pointerup', onPointerUp)
      svgEl.removeEventListener('pointercancel', onPointerUp)
      while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild)
    }
  }, [verses])

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{ display: 'block', cursor: 'grab', touchAction: 'none' }}
    />
  )
}
