import { useEffect, useState } from 'react'
import {
  formatAccessibleDateTime,
  formatFlipWeekday,
  getFlipDayDigits,
  getFlipTimeDigits,
} from '@/utils/dateTime'

type FlipUnitSize = 'time' | 'meridiem' | 'weekday' | 'day'

interface FlipUnitProps {
  value: string
  size: FlipUnitSize
}

function FlipColon() {
  return (
    <span className="flip-clock__colon" aria-hidden="true">
      <span className="flip-clock__colon-dot" />
      <span className="flip-clock__colon-dot" />
    </span>
  )
}

function FlipUnit({ value, size }: FlipUnitProps) {
  const [shown, setShown] = useState(value)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    if (value === shown) return
    setFlipping(true)
    const id = window.setTimeout(() => {
      setShown(value)
      setFlipping(false)
    }, 320)
    return () => window.clearTimeout(id)
  }, [value, shown])

  return (
    <span
      className={`flip-unit flip-unit--${size} ${flipping ? 'flip-unit--active' : ''}`}
      aria-hidden="true"
    >
      <span className="flip-unit__live">{value}</span>
      <span className="flip-unit__half flip-unit__half--top">
        <span className="flip-unit__char">{flipping ? shown : value}</span>
      </span>
      <span className="flip-unit__half flip-unit__half--bottom">
        <span className="flip-unit__char">{value}</span>
      </span>
    </span>
  )
}

interface FlipClockProps {
  now?: Date
  compact?: boolean
}

export function FlipClock({ now: externalNow, compact = false }: FlipClockProps) {
  const [now, setNow] = useState(() => externalNow ?? new Date())

  useEffect(() => {
    if (externalNow) {
      setNow(externalNow)
      return
    }
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [externalNow])

  const { hourTens, hourOnes, minuteTens, minuteOnes, meridiem } = getFlipTimeDigits(now)
  const { dayTens, dayOnes } = getFlipDayDigits(now)
  const weekday = formatFlipWeekday(now)
  const accessible = formatAccessibleDateTime(now)

  return (
    <div className={`flip-clock ${compact ? 'flip-clock--compact' : ''}`}>
      <p className="sr-only" aria-live="polite">
        {accessible}
      </p>

      <div className="flip-panel" aria-hidden="true">
        <div className="flip-panel__shell">
          <div className="flip-panel__live">
            <div className="flip-panel__clock-side">
              <div className="flip-panel__time-group">
                <FlipUnit value={hourTens} size="time" />
                <FlipUnit value={hourOnes} size="time" />
                <FlipColon />
                <FlipUnit value={minuteTens} size="time" />
                <FlipUnit value={minuteOnes} size="time" />
              </div>
              <FlipUnit value={meridiem} size="meridiem" />
            </div>
            <div className="flip-panel__date-stack">
              <FlipUnit value={weekday} size="weekday" />
              <span className="flip-panel__day-group">
                <FlipUnit value={dayTens} size="day" />
                <FlipUnit value={dayOnes} size="day" />
              </span>
            </div>
          </div>
          <span className="flip-panel__hinge" />
          <span className="flip-panel__pin flip-panel__pin--left" />
          <span className="flip-panel__pin flip-panel__pin--right" />
        </div>
      </div>
    </div>
  )
}
