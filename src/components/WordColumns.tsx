import { useEffect, useState } from 'react'
import type { SpellingWord } from '@/types'

export type HomeWordMode = 'list' | 'display'

interface WordColumnsProps {
  words: SpellingWord[]
  listKey: string
  mode: HomeWordMode
  onModeChange: (mode: HomeWordMode) => void
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
  variant = 'default',
}: {
  word: SpellingWord
  value: string
  onChange: (value: string) => void
  variant?: 'default' | 'display'
}) {
  return (
    <input
      type="text"
      className={`segment-field ${variant === 'display' ? 'segment-field--display' : ''}`}
      style={variant === 'display' ? undefined : { width: segmentFieldWidth(word) }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={`Segment ${word.word}`}
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
    />
  )
}

export function WordColumns({
  words,
  listKey,
  mode,
  onModeChange,
  revealedCount,
  onNextWord,
  onReset,
}: WordColumnsProps) {
  const [segmentText, setSegmentText] = useState<Record<string, string>>({})
  const isDisplayMode = mode === 'display'
  const revealed = isDisplayMode ? words : words.slice(0, revealedCount)
  const currentWord = !isDisplayMode && revealedCount > 0 ? revealed[revealedCount - 1] : null
  const allRevealed = isDisplayMode || revealedCount >= words.length

  useEffect(() => {
    setSegmentText({})
  }, [listKey])

  function setWordSegment(wordId: string, text: string) {
    setSegmentText((prev) => ({ ...prev, [wordId]: text }))
  }

  function handleReset() {
    setSegmentText({})
    if (!isDisplayMode) onReset()
  }

  function handleModeChange(next: HomeWordMode) {
    if (next === mode) return
    setSegmentText({})
    onModeChange(next)
  }

  return (
    <section className="dashboard-panel p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h3 className="font-display text-xl font-bold">Today&apos;s Words</h3>
            <div className="home-mode-tabs" role="tablist" aria-label="Word display mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'list'}
                className={`home-tab ${mode === 'list' ? 'home-tab--active' : ''}`}
                onClick={() => handleModeChange('list')}
              >
                List
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'display'}
                className={`home-tab ${mode === 'display' ? 'home-tab--active' : ''}`}
                onClick={() => handleModeChange('display')}
              >
                Display
              </button>
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {isDisplayMode
              ? `All ${words.length} words shown — type segments in each field to demonstrate`
              : `${revealedCount} of ${words.length} revealed — press Next Word to show one at a time`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isDisplayMode && (
            <button
              type="button"
              className="btn-primary px-6 py-3 text-lg"
              onClick={onNextWord}
              disabled={allRevealed}
            >
              Next Word →
            </button>
          )}
          {(isDisplayMode || revealedCount > 0) && (
            <button type="button" className="btn-secondary py-3" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>
      </div>

      {!isDisplayMode && currentWord && (
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

      {isDisplayMode ? (
        <div className="word-list-single word-list-single--display">
          {words.map((word, i) => (
            <div
              key={word.id}
              className={`word-row word-row--display word-row--revealed ${word.isSnip ? 'word-row--snip' : ''}`}
            >
              <span className="word-row__num">{i + 1}</span>
              <div className="word-row__label">
                <span className="word-row__word word-row__word--display" title={word.word}>
                  {word.word}
                </span>
                {word.isSnip && (
                  <span className="word-row__snip-icon" title="Snip word" aria-label="Snip word">
                    ✂️
                  </span>
                )}
              </div>
              <SegmentField
                word={word}
                variant="display"
                value={segmentText[word.id] ?? ''}
                onChange={(text) => setWordSegment(word.id, text)}
              />
            </div>
          ))}
        </div>
      ) : revealedCount === 0 ? (
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
