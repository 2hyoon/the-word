import verses from '@/data/verses.json'
import HomeClient from '@/components/HomeClient'
import type { Verse } from '@/types'

export default function Page() {
  return <HomeClient verses={verses as Verse[]} />
}
