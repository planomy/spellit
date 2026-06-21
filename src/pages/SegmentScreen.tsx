import { useCallback, useEffect, useState } from 'react'
import { MASCOT_THINKING } from '@/assets'
import { useNavigate } from 'react-router-dom'
import { useSpellIt } from '@/hooks/useSpellItStore'

export function SegmentScreen() {
  const navigate = useNavigate()
  const { activeList, progress, advanceWord, completeSegmenting, ensureLesson } = useSpellIt()

  useEffect(() => {
    ensureLesson()
  }, [ensureLesson])

  const words = activeList?.words ?? []
  const wordIndex = progress?.currentWordIndex ?? 0
  const currentWord = words[wordIndex]
  const total = words.length

  const [inputs, setInputs] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle')
  const [showAnswer, setShowAnswer] = useState(false)

  const segmentCount = currentWord?.segments.length ?? 0

  const resetInputs = useCallback(
    (count: number) => {
      setInputs(Array(count).fill(''))
      setFeedback('idle')
      setShowAnswer(false)
    },
    [],
  )

  useEffect(() => {
    if (currentWord) resetInputs(currentWord.segments.length)
  }, [currentWord, resetInputs])

  if (!activeList || !currentWord) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <p className="mb-4 text-[var(--text-muted)]">No word list loaded.</p>
        <button type="button" className="btn-primary" onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    )
  }

  function checkAnswer() {
    const normalized = inputs.map((s) => s.trim().toLowerCase())
    const expected = currentWord.segments.map((s) => s.toLowerCase())
    const correct = normalized.every((v, i) => v === expected[i])
    setFeedback(correct ? 'correct' : 'incorrect')
    if (!correct) setShowAnswer(true)
    return correct
  }

  function handleNext() {
    if (feedback !== 'correct' && !checkAnswer()) return

    if (wordIndex + 1 >= total) {
      completeSegmenting()
      navigate('/activities')
    } else {
      advanceWord()
    }
  }

  function handleInputChange(index: number, value: string) {
    setInputs((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
    setFeedback('idle')
  }

  const wordNumber = wordIndex + 1
  const isSnip = currentWord.isSnip

  return (
    <div className="page-panel animate-fade-in">
      <div className="mb-6 flex items-center justify-end">
        <span className="font-display text-sm font-semibold text-[var(--text-muted)]">
          Word {wordNumber} of {total}
        </span>
      </div>

      <div className="mb-4 flex justify-center gap-1.5">
        {words.map((_, i) => (
          <span
            key={i}
            className={`progress-dot ${i < wordIndex ? 'done' : i === wordIndex ? 'current' : ''}`}
          />
        ))}
      </div>

      <div className="card p-6 md:p-8">
        <div className="mb-6 flex items-start gap-4">
          <img src={MASCOT_THINKING} alt="" className="h-16 w-auto shrink-0" draggable={false} />
          <div>
            <p className="text-sm text-[var(--text-muted)]">Segment this word into sounds:</p>
            <h1 className="font-display text-4xl font-bold tracking-wide md:text-5xl">
              {currentWord.word}
            </h1>
            {isSnip && (
              <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-500">
                ✂️ Snip word — practise in handwriting
              </span>
            )}
          </div>
        </div>

        <p className="mb-4 text-sm text-[var(--text-secondary)]">
          Write one grapheme (letter or letter group) in each box. There are{' '}
          <strong>{segmentCount} sounds</strong> in this word.
        </p>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {inputs.map((val, i) => (
            <input
              key={i}
              type="text"
              value={val}
              onChange={(e) => handleInputChange(i, e.target.value)}
              className={`segment-box w-16 text-center uppercase ${
                feedback === 'correct'
                  ? 'correct'
                  : feedback === 'incorrect' && val.trim().toLowerCase() !== currentWord.segments[i]?.toLowerCase()
                    ? 'incorrect'
                    : val
                      ? 'filled'
                      : ''
              }`}
              maxLength={4}
              aria-label={`Sound ${i + 1}`}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          ))}
        </div>

        {feedback === 'correct' && (
          <p className="mb-4 text-center font-display font-semibold text-green-500 animate-fade-in">
            ✓ Correct! Great segmenting!
          </p>
        )}

        {feedback === 'incorrect' && showAnswer && (
          <div className="mb-4 rounded-xl bg-[var(--bg-secondary)] p-4 text-center animate-fade-in">
            <p className="text-sm text-[var(--text-muted)]">The correct segments are:</p>
            <p className="mt-1 font-display text-xl font-bold">
              {currentWord.segments.join(' · ')}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {feedback !== 'correct' && (
            <button type="button" className="btn-primary flex-1" onClick={checkAnswer}>
              Check
            </button>
          )}
          <button
            type="button"
            className={`btn-primary flex-1 ${feedback !== 'correct' ? 'opacity-50' : ''}`}
            onClick={handleNext}
            disabled={feedback !== 'correct'}
          >
            {wordIndex + 1 >= total ? 'Finish Segmenting →' : 'Next Word →'}
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
        Unit {activeList.unit}
      </p>
    </div>
  )
}
