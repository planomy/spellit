import { useEffect, useState } from 'react'
import { useSpellIt } from '@/hooks/useSpellItStore'
import { WelcomeBanner } from '@/components/WelcomeBanner'
import { LessonHero } from '@/components/LessonHero'
import { WordColumns, type HomeWordMode } from '@/components/WordColumns'
import { WeekSelector } from '@/components/WeekSelector'

export function HomeScreen() {
  const { activeList, wordLists, activeWeekId, setActiveWeek } = useSpellIt()
  const [revealedCount, setRevealedCount] = useState(0)
  const [wordMode, setWordMode] = useState<HomeWordMode>('list')

  useEffect(() => {
    setRevealedCount(0)
  }, [activeList?.id, activeList?.words.length])

  function handleModeChange(mode: HomeWordMode) {
    setWordMode(mode)
    if (mode === 'list') setRevealedCount(0)
  }

  if (!activeList) {
    return (
      <div className="dashboard-empty">
        <p>No word list loaded. Open Teacher to add one.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-grid animate-fade-in">
      <WelcomeBanner />

      <WeekSelector
        weeks={wordLists}
        value={activeWeekId}
        onChange={setActiveWeek}
        label="This week"
      />

      <LessonHero list={activeList} />

      <WordColumns
        words={activeList.words}
        listKey={`${activeList.id}-${activeList.words.length}`}
        mode={wordMode}
        onModeChange={handleModeChange}
        revealedCount={revealedCount}
        onNextWord={() => setRevealedCount((n) => Math.min(n + 1, activeList.words.length))}
        onReset={() => setRevealedCount(0)}
      />
    </div>
  )
}
