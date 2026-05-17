'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Category } from '@/types'
import { CATEGORIES } from '@/types'
import { WHEEL_RADIUS, CENTER_RADIUS, SVG_SIZE, SVG_CENTER } from '@/lib/wheel'

interface WheelProps {
  visible: boolean
  onCategorySelect: (categoryId: string) => void
}

const LABEL_LINES: Record<string, [string, string]> = {
  hard:     ['너무',    '힘들 때'],
  fear:     ['불안하고', '무서울 때'],
  relation: ['관계가',  '힘들 때'],
  grateful: ['뭔가',   '잘 됐을 때'],
  future:   ['앞이',   '안 보일 때'],
  decision: ['선택해야', '할 때'],
}

export default function Wheel({ visible, onCategorySelect }: WheelProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wheelGroupRef = useRef<SVGGElement | null>(null)
  const isSpinningRef = useRef(false)
  const rotationRef = useRef(0)
  const onCategorySelectRef = useRef(onCategorySelect)

  useEffect(() => {
    onCategorySelectRef.current = onCategorySelect
  })

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // D3 pie: equal slices, startAngle=0 means first slice starts at 12 o'clock
    const pie = d3.pie<Category>()
      .sort(null)
      .value(() => 1)

    const pieData = pie(CATEGORIES)

    const arcGen = d3.arc<d3.PieArcDatum<Category>>()
      .innerRadius(0)
      .outerRadius(WHEEL_RADIUS)

    const labelArcGen = d3.arc<d3.PieArcDatum<Category>>()
      .innerRadius(85)
      .outerRadius(85)

    // wheel-group: only this element rotates
    const wheelGroup = svg
      .append('g')
      .attr('class', 'wheel-group')
      .attr('transform', `rotate(0, ${SVG_CENTER}, ${SVG_CENTER})`)

    wheelGroupRef.current = wheelGroup.node()

    // Nested group translated to center for D3 arc coordinates (origin = SVG center)
    const arcGroup = wheelGroup.append('g')
      .attr('transform', `translate(${SVG_CENTER}, ${SVG_CENTER})`)

    // Segment fills
    arcGroup.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', d => arcGen(d))
      .attr('fill', d => d.data.color)
      .attr('fill-opacity', 0.08)
      .attr('stroke', 'none')

    // Radial divider lines at each segment boundary
    for (let i = 0; i < CATEGORIES.length; i++) {
      // D3 arc angle → local SVG coords: x = r*sin(θ), y = -r*cos(θ)
      const angle = i * (2 * Math.PI / CATEGORIES.length)
      const x2 = WHEEL_RADIUS * Math.sin(angle)
      const y2 = -WHEEL_RADIUS * Math.cos(angle)
      arcGroup.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', x2).attr('y2', y2)
        .attr('stroke', '#D4C9F5')
        .attr('stroke-width', 1)
    }

    // Outer circle
    arcGroup.append('circle')
      .attr('cx', 0).attr('cy', 0)
      .attr('r', WHEEL_RADIUS)
      .attr('fill', 'none')
      .attr('stroke', '#C4B8F0')
      .attr('stroke-width', 1)

    // Category labels (2-line tspan)
    pieData.forEach(d => {
      const [line1, line2] = LABEL_LINES[d.data.id]
      const [cx, cy] = labelArcGen.centroid(d)

      const textEl = arcGroup.append('text')
        .attr('x', cx)
        .attr('y', cy)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .attr('fill', d.data.textColor)
        .style('font-family', 'NanumSquareNeo, sans-serif')
        .style('pointer-events', 'none')
        .style('user-select', 'none')

      textEl.append('tspan')
        .attr('x', cx)
        .attr('dy', '-0.6em')
        .text(line1)

      textEl.append('tspan')
        .attr('x', cx)
        .attr('dy', '1.2em')
        .text(line2)
    })

    // center-group: never rotates, rendered above wheel-group
    const centerGroup = svg.append('g').attr('class', 'center-group')

    centerGroup.append('circle')
      .attr('cx', SVG_CENTER).attr('cy', SVG_CENTER)
      .attr('r', CENTER_RADIUS)
      .attr('fill', '#FAFAF8')
      .attr('stroke', '#C4B8F0')
      .attr('stroke-width', 1)

    const centerText = centerGroup.append('text')
      .attr('x', SVG_CENTER).attr('y', SVG_CENTER)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('fill', '#534AB7')
      .style('font-family', 'NanumSquareNeo, sans-serif')
      .style('pointer-events', 'none')
      .text('돌려')

    // Pointer ▼ fixed at 12 o'clock — never rotates
    svg.append('polygon')
      .attr('class', 'pointer')
      .attr('points', '150,8 145,18 155,18')
      .attr('fill', '#534AB7')

    const handleSpin = () => {
      if (isSpinningRef.current) return
      isSpinningRef.current = true
      centerText.text('···')

      const targetIdx = Math.floor(Math.random() * CATEGORIES.length)
      const targetCategoryId = CATEGORIES[targetIdx].id

      // Segment idx center is at (idx*60 + 30)° clockwise from 12 o'clock.
      // Rotating wheel by -(idx*60+30) brings that segment to the pointer.
      const segmentCenter = -(targetIdx * 60 + 30)
      const totalRotation =
        rotationRef.current + (5 * 360) + segmentCenter - (rotationRef.current % 360)
      const duration = motionOK ? 2800 + Math.random() * 700 : 0

      d3.select(wheelGroupRef.current)
        .transition()
        .duration(duration)
        .ease(d3.easeCubicOut)
        .attrTween('transform', () => {
          const start = rotationRef.current
          return (t: number) => {
            const angle = start + (totalRotation - start) * t
            return `rotate(${angle}, ${SVG_CENTER}, ${SVG_CENTER})`
          }
        })
        .on('end', () => {
          const normalizedAngle = ((totalRotation % 360) + 360) % 360
          d3.select(wheelGroupRef.current)
            .attr('transform', `rotate(${normalizedAngle}, ${SVG_CENTER}, ${SVG_CENTER})`)
          rotationRef.current = normalizedAngle
          isSpinningRef.current = false
          centerText.text('돌려')
          onCategorySelectRef.current(targetCategoryId)
        })
    }

    svg.on('click', handleSpin)

    return () => {
      svg.on('click', null)
    }
  }, [])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 300ms ease',
        width: '100%',
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        width="100%"
        style={{ cursor: 'pointer', display: 'block' }}
        role="img"
        aria-label="말씀 뽑기 휠"
      />
    </div>
  )
}
