import { useEffect, useMemo, useState } from 'react'
import {
  TEST_MODE_LETTER_HINT_COST,
  TEST_MODE_POINTS_PER_WORD,
  TEST_MODE_STARTING_POINTS,
} from '@/data/defaults'
import { useSpellIt } from '@/hooks/useSpellItStore'
import type { SpellingWord } from '@/types'

function shuffleIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

function TestSummary({
  points,
  correctCount,
  total,
  onRetry,
}: {
  points: number
  correctCount: number
  total: number
  onRetry: () => void
}) {
  return (
    <div className="test-mode-summary">
      <p className="test-mode-summary__title">Test complete!</p>
      <p className="test-mode-summary__score">{points} points</p>
      <p className="test-mode-summary__meta">
        {correctCount} of {total} words spelled correctly
      </p>
      <button type="button" className="btn-primary mt-4 w-full" onClick={onRetry}>
        Try Again
      </button>
    </div>
  )
}

function LetterHints({ word, revealedCount }: { word: string; revealedCount: number }) {
  if (revealedCount === 0) return null

  return (
    <div className="test-mode-letters" aria-label="Letters revealed by hints">
      {word.split('').map((char, i) => (
        <span
          key={i}
          className={`test-mode-letters__slot ${
            i < revealedCount ? 'test-mode-letters__slot--revealed' : ''
          }`}
        >
          {i < revealedCount ? char : '·'}
        </span>
      ))}
    </div>
  )
}

function TestWord({
  word,
  wordNum,
  total,
  points,
  input,
  result,
  revealedLetters,
  onInput,
  onCheck,
  onBuyLetter,
  onNext,
  isLast,
}: {
  word: SpellingWord
  wordNum: number
  total: number
  points: number
  input: string
  result: 'idle' | 'correct' | 'wrong'
  revealedLetters: number
  onInput: (value: string) => void
  onCheck: () => void
  onBuyLetter: () => void
  onNext: () => void
  isLast: boolean
}) {
  const canAffordLetter = points >= TEST_MODE_LETTER_HINT_COST
  const lettersRemaining = word.word.length - revealedLetters
  const canBuyLetter = lettersRemaining > 0 && result !== 'correct'

  return (
    <>
      <div className="test-mode-header">
        <span className="test-mode-header__progress">
          Word {wordNum} of {total}
        </span>
        <span className="test-mode-header__points">{points} pts</span>
      </div>

      <div className="test-mode-prompt mb-4">
        <p className="test-mode-prompt__label">Definition</p>
        <p className="test-mode-prompt__text">{word.definition}</p>
      </div>

      <LetterHints word={word.word} revealedCount={revealedLetters} />

      <input
        type="text"
        value={input}
        onChange={(e) => onInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && result !== 'correct') onCheck()
        }}
        className="mb-4 mt-4 w-full text-center text-2xl font-bold uppercase"
        placeholder="Type the word"
        autoComplete="off"
        spellCheck={false}
        disabled={result === 'correct'}
      />

      {result === 'correct' && (
        <p className="mb-3 text-center font-display font-semibold text-green-500">
          ✓ Correct! +{TEST_MODE_POINTS_PER_WORD} points
        </p>
      )}
      {result === 'wrong' && (
        <p className="mb-3 text-center text-red-500">Not quite — use the definition and try again.</p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {canBuyLetter && (
          <button
            type="button"
            className="btn-secondary flex-1 text-sm"
            onClick={onBuyLetter}
            disabled={!canAffordLetter}
            title={
              canAffordLetter
                ? `Reveal the next letter (${TEST_MODE_LETTER_HINT_COST} pts)`
                : `Need ${TEST_MODE_LETTER_HINT_COST} points for a letter`
            }
          >
            Buy a letter ({TEST_MODE_LETTER_HINT_COST} pts)
          </button>
        )}
        {result !== 'correct' && (
          <button type="button" className="btn-primary flex-1" onClick={onCheck}>
            Check
          </button>
        )}
        {result === 'correct' && (
          <button type="button" className="btn-primary flex-1" onClick={onNext}>
            {isLast ? 'See Results' : 'Next Word →'}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-[var(--text-muted)]">
        +{TEST_MODE_POINTS_PER_WORD} pts per correct word · each letter costs{' '}
        {TEST_MODE_LETTER_HINT_COST} pts
      </p>
    </>
  )
}

export function TestModeActivity() {
  const { activeList } = useSpellIt()
  const allWords = activeList?.words ?? []
  const words = useMemo(
    () => allWords.filter((w) => w.definition?.trim()),
    [allWords],
  )
  const [order, setOrder] = useState<number[]>([])
  const [idx, setIdx] = useState(0)
  const [points, setPoints] = useState(TEST_MODE_STARTING_POINTS)
  const [correctCount, setCorrectCount] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [revealedLetters, setRevealedLetters] = useState(0)
  const [finished, setFinished] = useState(false)
  const [session, setSession] = useState(0)

  function beginSession() {
    setOrder(shuffleIndices(words.length))
    setIdx(0)
    setPoints(TEST_MODE_STARTING_POINTS)
    setCorrectCount(0)
    setInput('')
    setResult('idle')
    setRevealedLetters(0)
    setFinished(false)
    setSession((s) => s + 1)
  }

  useEffect(() => {
    if (!words.length) {
      setOrder([])
      setIdx(0)
      setPoints(TEST_MODE_STARTING_POINTS)
      setCorrectCount(0)
      setInput('')
      setResult('idle')
      setRevealedLetters(0)
      setFinished(false)
      return
    }
    beginSession()
  }, [activeList?.id, words.length])

  if (!allWords.length) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        No words in the list yet. Ask your teacher to add words in Teacher.
      </p>
    )
  }

  if (!words.length) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Test mode needs definitions. Ask your teacher to add definitions in Teacher (e.g.{' '}
        <strong>knee: the part of the leg that bends</strong>).
      </p>
    )
  }

  const word = words[order[idx]]

  if (finished) {
    return (
      <TestSummary
        points={points}
        correctCount={correctCount}
        total={words.length}
        onRetry={beginSession}
      />
    )
  }

  if (!word) return null

  function handleInput(value: string) {
    setInput(value)
    setResult('idle')
  }

  function handleCheck() {
    if (input.trim().toLowerCase() === word.word.toLowerCase()) {
      setResult('correct')
      setPoints((p) => p + TEST_MODE_POINTS_PER_WORD)
      setCorrectCount((c) => c + 1)
    } else {
      setResult('wrong')
    }
  }

  function handleBuyLetter() {
    if (revealedLetters >= word.word.length || points < TEST_MODE_LETTER_HINT_COST) return
    setPoints((p) => p - TEST_MODE_LETTER_HINT_COST)
    setRevealedLetters((n) => n + 1)
  }

  function handleNext() {
    if (idx + 1 >= order.length) {
      setFinished(true)
      return
    }
    setIdx((i) => i + 1)
    setInput('')
    setResult('idle')
    setRevealedLetters(0)
  }

  return (
    <div key={session}>
      <TestWord
        word={word}
        wordNum={idx + 1}
        total={words.length}
        points={points}
        input={input}
        result={result}
        revealedLetters={revealedLetters}
        onInput={handleInput}
        onCheck={handleCheck}
        onBuyLetter={handleBuyLetter}
        onNext={handleNext}
        isLast={idx + 1 >= order.length}
      />
    </div>
  )
}
