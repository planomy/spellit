import { useEffect, useMemo, useState } from 'react'
import { MASCOT_IDEA } from '@/assets'
import { useNavigate } from 'react-router-dom'
import { ACTIVITIES } from '@/data/defaults'
import { useSpellIt } from '@/hooks/useSpellItStore'
import { TestModeActivity } from '@/components/TestModeActivity'
import type { ActivityId, Suffix } from '@/types'

interface SuffixQuestion {
  word: string
  stem: string
  correctSuffix: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function matchSuffix(word: string, suffixes: Suffix[]): { stem: string; suffix: string } | null {
  const ordered = [...suffixes].sort((a, b) => b.suffix.length - a.suffix.length)
  const lower = word.toLowerCase()
  for (const s of ordered) {
    const suf = s.suffix.toLowerCase()
    if (lower.endsWith(suf) && word.length > s.suffix.length) {
      return { stem: word.slice(0, -s.suffix.length), suffix: s.suffix }
    }
  }
  return null
}

function buildSuffixQuestions(words: { word: string }[], lessonSuffixes: Suffix[]): SuffixQuestion[] {
  const questions: SuffixQuestion[] = []
  const seen = new Set<string>()

  for (const w of words) {
    const match = matchSuffix(w.word, lessonSuffixes)
    if (match && !seen.has(w.word.toLowerCase())) {
      seen.add(w.word.toLowerCase())
      questions.push({ word: w.word, stem: match.stem, correctSuffix: match.suffix })
    }
  }

  if (!questions.length) {
    for (const s of lessonSuffixes) {
      for (const example of s.exampleWords) {
        const match = matchSuffix(example, lessonSuffixes)
        if (match && !seen.has(example.toLowerCase())) {
          seen.add(example.toLowerCase())
          questions.push({ word: example, stem: match.stem, correctSuffix: match.suffix })
        }
      }
    }
  }

  return shuffle(questions)
}

function WordBuildActivity() {
  const { activeList } = useSpellIt()
  const words = activeList?.words ?? []
  const [wordIdx, setWordIdx] = useState(0)
  const [placed, setPlaced] = useState<string[]>([])
  const [bank, setBank] = useState<string[]>([])

  const word = words[wordIdx]

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  function resetForWord(idx: number) {
    const w = words[idx]
    if (!w) return
    setPlaced([])
    setBank(shuffle([...w.segments]))
  }

  useEffect(() => {
    if (!words.length) {
      setWordIdx(0)
      setPlaced([])
      setBank([])
      return
    }
    setWordIdx(0)
    resetForWord(0)
  }, [activeList?.id, words.length])

  if (!word) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        No words in the list yet. Ask your teacher to add words in Teacher.
      </p>
    )
  }

  function placeTile(tile: string, bankIndex: number) {
    if (placed.length >= word.segments.length) return
    setPlaced((p) => [...p, tile])
    setBank((b) => b.filter((_, i) => i !== bankIndex))
  }

  function removePlaced(index: number) {
    const tile = placed[index]
    setPlaced((p) => p.filter((_, i) => i !== index))
    setBank((b) => [...b, tile])
  }

  const isCorrect =
    placed.length === word.segments.length &&
    placed.every((s, i) => s.toLowerCase() === word.segments[i].toLowerCase())

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--text-muted)]">
        Drag tiles to rebuild: <strong className="text-[var(--text-primary)]">{word.word}</strong>
      </p>
      <div className="mb-4 flex min-h-[3.5rem] flex-wrap justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)] p-3">
        {placed.length === 0 && (
          <span className="text-sm text-[var(--text-muted)]">Tap tiles below to build the word</span>
        )}
        {placed.map((tile, i) => (
          <button key={i} type="button" className="tile" onClick={() => removePlaced(i)}>
            {tile}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {bank.map((tile, i) => (
          <button key={`${tile}-${i}`} type="button" className="tile" onClick={() => placeTile(tile, i)}>
            {tile}
          </button>
        ))}
      </div>
      {isCorrect && (
        <p className="mb-3 text-center font-display font-semibold text-green-500">✓ Word built correctly!</p>
      )}
      {isCorrect && wordIdx + 1 < words.length && (
        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => {
            setWordIdx((i) => i + 1)
            resetForWord(wordIdx + 1)
          }}
        >
          Next Word
        </button>
      )}
    </div>
  )
}

function SpellCheckActivity() {
  const { activeList } = useSpellIt()
  const words = activeList?.words ?? []
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle')

  useEffect(() => {
    setIdx(0)
    setInput('')
    setResult('idle')
  }, [activeList?.id, words.length])

  const word = words[idx]

  if (!word) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        No words in the list yet. Ask your teacher to add words in Teacher.
      </p>
    )
  }

  function check() {
    setResult(input.trim().toLowerCase() === word.word.toLowerCase() ? 'correct' : 'wrong')
  }

  return (
    <div>
      <p className="mb-2 text-sm text-[var(--text-muted)]">Spell this word from its segments:</p>
      <p className="mb-4 font-display text-2xl font-bold">{word.segments.join(' · ')}</p>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setResult('idle')
        }}
        className="mb-4 w-full text-center text-2xl font-bold uppercase"
        placeholder="Type the word"
        autoComplete="off"
        spellCheck={false}
      />
      {result === 'correct' && (
        <p className="mb-3 text-center font-display text-green-500">✓ Correct!</p>
      )}
      {result === 'wrong' && (
        <p className="mb-3 text-center text-red-500">The word is: {word.word}</p>
      )}
      <div className="flex gap-3">
        <button type="button" className="btn-primary flex-1" onClick={check}>
          Check
        </button>
        {result === 'correct' && idx + 1 < words.length && (
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={() => {
              setIdx((i) => i + 1)
              setInput('')
              setResult('idle')
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}

function SuffixMatchActivity() {
  const { suffixes, activeList } = useSpellIt()
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [options, setOptions] = useState<string[]>([])

  const lessonSuffixes = useMemo(() => {
    const focusSet = new Set(activeList?.focusSuffixes ?? [])
    return focusSet.size > 0
      ? suffixes.filter((s) => focusSet.has(s.suffix))
      : suffixes
  }, [suffixes, activeList?.focusSuffixes])

  const questions = useMemo(
    () => buildSuffixQuestions(activeList?.words ?? [], lessonSuffixes),
    [activeList?.words, lessonSuffixes],
  )

  const question = questions[idx]

  useEffect(() => {
    setIdx(0)
    setSelected(null)
    setDone(false)
  }, [activeList?.id, questions.length])

  useEffect(() => {
    if (!question) return
    setSelected(null)
    setDone(false)
    const wrong = lessonSuffixes
      .map((s) => s.suffix)
      .filter((s) => s !== question.correctSuffix)
    const choices = [question.correctSuffix, ...wrong.slice(0, 3)]
    setOptions(shuffle(choices))
  }, [idx, question, lessonSuffixes])

  if (!lessonSuffixes.length) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        No suffixes set for this week. Ask your teacher to add suffixes in Teacher.
      </p>
    )
  }

  if (!question) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        No words with this week&apos;s suffixes yet. Add words ending in{' '}
        {lessonSuffixes.map((s) => s.suffix).join(' or ')} in Teacher.
      </p>
    )
  }

  return (
    <div>
      <p className="mb-2 text-sm text-[var(--text-muted)]">
        Click the suffix that completes the word:
      </p>
      <p className="suffix-match-word mb-4">
        <span className="suffix-match-word__stem">{question.stem}</span>
        {selected ? (
          <span
            className={`suffix-match-word__filled ${
              selected === question.correctSuffix
                ? 'suffix-match-word__filled--correct'
                : 'suffix-match-word__filled--wrong'
            }`}
          >
            {selected}
          </span>
        ) : (
          <span className="suffix-match-word__blank" aria-hidden="true">
            {Array.from({ length: question.correctSuffix.length }, (_, i) => (
              <span key={i} className="suffix-match-word__dash">
                _
              </span>
            ))}
          </span>
        )}
      </p>

      {done && (
        <p className="mb-3 text-center text-sm">
          {selected === question.correctSuffix ? (
            <span className="font-display font-semibold text-green-500">✓ Correct!</span>
          ) : (
            <span className="text-red-500">
              Not quite — the word is{' '}
              <strong>
                {question.stem}
                <span className="suffix-match-word__filled suffix-match-word__filled--correct">
                  {question.correctSuffix}
                </span>
              </strong>
            </span>
          )}
        </p>
      )}

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`card p-4 text-center font-display text-lg font-bold transition ${
              selected === opt
                ? opt === question.correctSuffix
                  ? 'border-green-500 bg-green-500/10 text-green-600'
                  : 'border-red-500 bg-red-500/10 text-red-600'
                : 'text-[var(--accent)]'
            }`}
            onClick={() => {
              setSelected(opt)
              setDone(true)
            }}
            disabled={done}
          >
            -{opt}
          </button>
        ))}
      </div>

      {done && idx + 1 < questions.length && (
        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => setIdx((i) => i + 1)}
        >
          Next Word
        </button>
      )}
    </div>
  )
}

function HandwritingActivity() {
  const { activeList } = useSpellIt()
  const snipWords = activeList?.words.filter((w) => w.isSnip) ?? []
  const paragraphText = activeList?.handwritingParagraphText?.trim()
  const paragraphImage = activeList?.handwritingParagraphImage
  const hasParagraph = Boolean(paragraphText || paragraphImage)

  if (!snipWords.length && !hasParagraph) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        No handwriting content yet. Ask your teacher to add snip words and a paragraph in Teacher.
      </p>
    )
  }

  return (
    <div>
      {hasParagraph && (
        <section className="handwriting-paragraph-display mb-5">
          <h3 className="handwriting-paragraph-display__title">Copy this paragraph</h3>
          {paragraphImage ? (
            <img
              src={paragraphImage}
              alt="Handwriting paragraph to copy"
              className="handwriting-paragraph-display__image"
            />
          ) : (
            <p className="handwriting-paragraph-display__text">{paragraphText}</p>
          )}
        </section>
      )}

      {snipWords.length > 0 && (
        <>
          <p className="mb-4 text-sm text-[var(--text-muted)]">
            For handwriting: write each snip word neatly in cursive. You have 10 minutes. Cross out
            mistakes — no eraser needed!
          </p>
          <ul className="space-y-3">
            {snipWords.map((w, i) => (
              <li key={w.id} className="card flex items-center gap-4 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
                  {i * 5 + 5}
                </span>
                <div>
                  <p className="font-display text-xl font-bold">{w.word}</p>
                  <p className="text-xs text-[var(--text-muted)]">{w.segments.join(' · ')}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-4 rounded-lg bg-[var(--bg-secondary)] p-3 text-xs text-[var(--text-muted)]">
        📸 Photograph your writing and paste it onto OneNote when finished.
      </p>
    </div>
  )
}

const ACTIVITY_COMPONENTS: Record<ActivityId, () => React.JSX.Element | null> = {
  'word-build': WordBuildActivity,
  'spell-check': SpellCheckActivity,
  'suffix-match': SuffixMatchActivity,
  handwriting: HandwritingActivity,
  'test-mode': TestModeActivity,
}

export function ActivitiesScreen() {
  const navigate = useNavigate()
  const { activeList, progress, completeActivity, resetProgress, ensureLesson } = useSpellIt()
  const [active, setActive] = useState<ActivityId | null>(null)

  useEffect(() => {
    ensureLesson()
  }, [ensureLesson])

  const completed = progress?.completedActivities ?? []
  const allDone = ACTIVITIES.every((a) => completed.includes(a.id))
  const wordCount = activeList?.words.length ?? 0

  const ActiveComponent = active ? ACTIVITY_COMPONENTS[active] : null
  const activityKey = active && activeList ? `${active}-${activeList.id}-${wordCount}` : active

  if (!activeList || wordCount === 0) {
    return (
      <div className="page-panel animate-fade-in dashboard-empty">
        <p>No word list loaded yet.</p>
        <button type="button" className="btn-primary mt-4" onClick={() => navigate('/teacher')}>
          Open Teacher
        </button>
      </div>
    )
  }

  return (
    <div className="page-panel animate-fade-in">
      {progress?.segmentingComplete && (
        <div className="mb-4 flex justify-end">
          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-500">
            ✓ Segmenting complete
          </span>
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <img src={MASCOT_IDEA} alt="" className="h-16 w-auto" draggable={false} />
        <p className="text-sm text-[var(--text-muted)]">
          Unit {activeList.unit} · {wordCount} words — complete these after segmenting.
        </p>
      </div>

      {!active ? (
        <div className="grid gap-3">
          {ACTIVITIES.map((activity) => {
            const isDone = completed.includes(activity.id)
            return (
              <button
                key={activity.id}
                type="button"
                className="card flex items-center gap-4 p-4 text-left"
                onClick={() => setActive(activity.id)}
              >
                <img
                  src={activity.icon}
                  alt=""
                  className="activity-card__icon"
                  draggable={false}
                />
                <div className="flex-1">
                  <h3 className="font-display font-bold">{activity.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{activity.description}</p>
                </div>
                {isDone ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-[var(--accent)]">→</span>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="card p-6">
          <button
            type="button"
            className="btn-secondary mb-4 text-sm"
            onClick={() => setActive(null)}
          >
            ← All Activities
          </button>
          <h2 className="mb-4 font-display text-xl font-bold">
            {ACTIVITIES.find((a) => a.id === active)?.title}
          </h2>
          {ActiveComponent && activityKey && <ActiveComponent key={activityKey} />}
          <button
            type="button"
            className="btn-primary mt-6 w-full"
            onClick={() => {
              completeActivity(active)
              setActive(null)
            }}
          >
            Mark as Complete
          </button>
        </div>
      )}

      {allDone && (
        <div className="card mt-6 p-6 text-center animate-fade-in">
          <img src={MASCOT_IDEA} alt="" className="mx-auto mb-4 h-24 w-auto animate-float" draggable={false} />
          <h2 className="font-display text-xl font-bold">All Done! 🎉</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            You've completed segmenting and all activities. Great work!
          </p>
          <button
            type="button"
            className="btn-primary mt-4"
            onClick={() => {
              resetProgress()
              navigate('/')
            }}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  )
}
