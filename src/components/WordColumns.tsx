import { useEffect, useState } from 'react'
import type { SpellingWord } from '@/types'

interface WordColumnsProps {
  words: SpellingWord[]
  listKey: string
  revealedCount: number
  onNextWord: () => void
  onReset: () => void
}

function segmentFieldWidth(word: SpellingWord) {
  const slots = Math.max(word.segments.length, 4)
  return `${slots * 1.75 + 2}rem`
}

function SegmentField({
  word,
  value,
  onChange,
}: {
  word: SpellingWord
  value: string
  onChange: (value: string) => void
}) {
  return (
    <input
      type="text"
      className="segment-field"
      style={{ width: segmentFieldWidth(word) }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={`Segment ${word.word}`}
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
    />
  )
}

export function WordColumns({ words, listKey, revealedCount, onNextWord, onReset }: WordColumnsProps) {
  const [segmentText, setSegmentText] = useState<Record<string, string>>({})
  const revealed = words.slice(0, revealedCount)
  const currentWord = revealedCount > 0 ? revealed[revealedCount - 1] : null
  const allRevealed = revealedCount >= words.length

  useEffect(() => {
    setSegmentText({})
  }, [listKey])

  function setWordSegment(wordId: string, text: string) {
    setSegmentText((prev) => ({ ...prev, [wordId]: text }))
  }

  function handleReset() {
    setSegmentText({})
    onReset()
  }

  return (
    <section className="dashboard-panel p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold">Today&apos;s Words</h3>
          <p className="text-sm text-[var(--text-muted)]">
            {revealedCount} of {words.length} revealed — press Next Word to show one at a time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary px-6 py-3 text-lg"
            onClick={onNextWord}
            disabled={allRevealed}
          >
            Next Word →
          </button>
          {revealedCount > 0 && (
            <button type="button" className="btn-secondary py-3" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>
      </div>

      {currentWord && (
        <div className="current-word-card mb-5 animate-fade-in">
          <span className="current-word-card__num">Word {revealedCount}</span>
          <div className="current-word-card__layout">
            <div className="current-word-card__main">
              <p className="current-word-card__word">{currentWord.word}</p>
              {currentWord.definition && (
                <p className="current-word-card__def">{currentWord.definition}</p>
              )}
              {currentWord.isSnip && (
                <span className="current-word-card__snip">✂️ Snip word — handwriting focus</span>
              )}
            </div>
            <SegmentField
              word={currentWord}
              value={segmentText[currentWord.id] ?? ''}
              onChange={(text) => setWordSegment(currentWord.id, text)}
            />
          </div>
        </div>
      )}

      {revealedCount === 0 ? (
        <p className="word-list-empty">
          Words are hidden until you press <strong>Next Word</strong>.
        </p>
      ) : (
        <div className="word-list-single">
          {revealed.map((word, i) => (
            <div key={word.id} className="word-row word-row--revealed animate-fade-in">
              <span className="word-row__num">{i + 1}</span>
              <div className="word-row__content">
                <div className="word-row__main">
                  <p className="word-row__word">{word.word}</p>
                  {word.definition && <p className="word-row__def">{word.definition}</p>}
                </div>
                <SegmentField
                  word={word}
                  value={segmentText[word.id] ?? ''}
                  onChange={(text) => setWordSegment(word.id, text)}
                />
              </div>
              {word.isSnip && <span className="word-row__snip" title="Snip word">✂️</span>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
