import { useMemo } from 'react'
import { MASCOT_IDEA, MASCOT_SPELLING, MASCOT_THINKING } from '@/assets'
import { ENCOURAGING_MESSAGES } from '@/data/defaults'

const MASCOTS = [MASCOT_THINKING, MASCOT_IDEA, MASCOT_SPELLING]

export function WelcomeBanner() {
  const message = useMemo(
    () => ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)],
    [],
  )
  const mascot = useMemo(() => MASCOTS[Math.floor(Math.random() * MASCOTS.length)], [])

  return (
    <section className="welcome-banner animate-fade-in">
      <div className="welcome-banner__text">
        <p className="welcome-banner__eyebrow">Welcome back!</p>
        <h2 className="welcome-banner__heading">Ready to Spell It?</h2>
        <p className="welcome-banner__message">{message}</p>
      </div>
      <img
        src={mascot}
        alt=""
        className="welcome-banner__mascot animate-float"
        draggable={false}
      />
    </section>
  )
}
