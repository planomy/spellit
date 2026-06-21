import { useMemo } from 'react'
import { FlipClock } from '@/components/FlipClock'
import { ENCOURAGING_MESSAGES } from '@/data/defaults'
import { LOGO, MASCOT_IDEA, MASCOT_SPELLING, MASCOT_THINKING } from '@/assets'

const MASCOTS = [
  { src: MASCOT_THINKING, alt: 'Thinking mascot' },
  { src: MASCOT_IDEA, alt: 'Idea mascot' },
  { src: MASCOT_SPELLING, alt: 'Spelling mascot' },
]

export function HomeHeader() {
  const message = useMemo(
    () => ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)],
    [],
  )
  const mascot = useMemo(() => MASCOTS[Math.floor(Math.random() * MASCOTS.length)], [])

  return (
    <header className="header-bar px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-6">
          <img
            src={LOGO}
            alt="Spell It"
            className="h-40 w-auto max-w-[min(100%,28rem)] sm:h-44 md:h-52"
            draggable={false}
          />
          <FlipClock />
        </div>

        <div className="flex items-end gap-3 md:max-w-md">
          <div className="speech-bubble flex-1 animate-fade-in">
            <p className="font-display text-sm font-medium leading-snug md:text-base">{message}</p>
          </div>
          <img
            src={mascot.src}
            alt={mascot.alt}
            className="h-24 w-auto animate-float shrink-0 md:h-28"
            draggable={false}
          />
        </div>
      </div>
    </header>
  )
}
