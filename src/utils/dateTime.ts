export function formatFlipWeekday(now: Date): string {
  return now.toLocaleDateString('en-AU', { weekday: 'short' }).toUpperCase()
}

export function formatFlipDay(now: Date): string {
  return String(now.getDate()).padStart(2, '0')
}

export function getFlipTimeDigits(now: Date) {
  const hours24 = now.getHours()
  const h12 = hours24 % 12 || 12
  const hours = String(h12).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return {
    hourTens: hours[0]!,
    hourOnes: hours[1]!,
    minuteTens: minutes[0]!,
    minuteOnes: minutes[1]!,
    meridiem: hours24 >= 12 ? 'PM' : 'AM',
  }
}

export function getFlipDayDigits(now: Date) {
  const day = formatFlipDay(now)
  return { dayTens: day[0]!, dayOnes: day[1]! }
}

export function formatAccessibleDateTime(now: Date): string {
  return now.toLocaleString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
