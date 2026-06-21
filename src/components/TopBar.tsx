import { FlipClock } from '@/components/FlipClock'
import { ThemeToggle } from '@/components/ThemeToggle'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="top-bar">
      <div>
        <h1 className="top-bar__title">{title}</h1>
      </div>
      <div className="top-bar__actions">
        <FlipClock />
        <ThemeToggle />
      </div>
    </header>
  )
}
