import type { Category } from '@/types'
import { CATEGORIES } from '@/types'

export const WHEEL_RADIUS = 130
export const CENTER_RADIUS = 38
export const SVG_SIZE = 300
export const SVG_CENTER = SVG_SIZE / 2

export function getCategoryColor(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.color ?? '#C4B8F0'
}

export function getCategoryTextColor(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.textColor ?? '#1A1A2E'
}

// 포인터(12시)가 세그먼트 중앙을 가리키도록 착지 각도 계산
// D3 pie 기본은 12시에서 시작하므로, idx번째 세그먼트 중앙 = idx * 60 + 30도
// 휠을 역으로 회전시켜 해당 각도가 12시에 오게 함
export function getCategoryLandingAngle(categoryId: string): number {
  const idx = CATEGORIES.findIndex(c => c.id === categoryId)
  if (idx === -1) return 0
  return -(idx * 60 + 30)
}

export { CATEGORIES }
export type { Category }
