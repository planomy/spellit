import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MASCOT_SPELLING } from '@/assets'
import { LEARNING_INTENTIONS, SUCCESS_CRITERIA } from '@/data/defaults'
import { useSpellIt } from '@/hooks/useSpellItStore'

type LearnTab = 'intentions' | 'success' | 'concept' | 'job'

const LEARN_TABS: { id: LearnTab; label: string; title: string }[] = [
  { id: 'intentions', label: 'Intentions', title: 'Learning Intentions' },
  { id: 'success', label: 'Success', title: 'Success Criteria' },
  { id: 'concept', label: 'Phonemes', title: 'Phonemes & Graphemes' },
  { id: 'job', label: "Today's Job", title: 'Your Job Today' },
]

export function LearnScreen() {
  const navigate = useNavigate()
  const { activeList, startLesson } = useSpellIt()
  const [tab, setTab] = useState<LearnTab>('intentions')

  function beginLesson() {
    startLesson()
    navigate('/segment')
  }

  return (
    <div className="page-panel animate-fade-in">
      <div className="mb-6 flex items-center gap-4">
        <img src={MASCOT_SPELLING} alt="" className="h-20 w-auto" draggable={false} />
        <div>
          <p className="text-[var(--text-muted)]">
            Term {activeList?.term ?? 2} · Week {activeList?.week ?? 10} · Unit {activeList?.unit ?? 18}
          </p>
        </div>
      </div>

      <div className="learn-tabs" role="tablist" aria-label="Lesson information">
        {LEARN_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`learn-tabs__tab ${tab === item.id ? 'learn-tabs__tab--active' : ''}`}
            onClick={() => setTab(item.id)}
            title={item.title}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="card learn-tabs__panel animate-fade-in">
        {tab === 'intentions' && (
          <div role="tabpanel">
            <h2 className="font-display text-lg font-bold text-[var(--accent)]">Learning Intentions</h2>
            <p className="mb-3 text-sm text-[var(--text-muted)]">We are learning to:</p>
            <ul className="space-y-2">
              {LEARNING_INTENTIONS.map((item) => (
                <li key={item} className="flex gap-2 text-sm">
                  <span className="text-[var(--accent)]">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'success' && (
          <div role="tabpanel">
            <h2 className="font-display text-lg font-bold text-[var(--accent)]">Success Criteria</h2>
            <ul className="mt-3 space-y-2">
              {SUCCESS_CRITERIA.map((item) => (
                <li key={item} className="flex gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'concept' && (
          <div role="tabpanel">
            <h2 className="font-display text-lg font-bold">Key Concept: Phonemes & Graphemes</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-[var(--bg-secondary)] p-4 text-center">
                <p className="font-display text-sm font-semibold text-[var(--text-muted)]">What we hear</p>
                <p className="mt-1 font-display text-2xl font-bold">One phoneme</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">A single sound in a word</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-secondary)] p-4 text-center">
                <p className="font-display text-sm font-semibold text-[var(--text-muted)]">What we write</p>
                <p className="mt-1 font-display text-2xl font-bold">Graphemes</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Often several graphemes for one sound</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'job' && (
          <div role="tabpanel">
            <h2 className="font-display text-lg font-bold">Your Job Today</h2>
            <ol className="mt-3 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                  1
                </span>
                <span>
                  <strong>Segment</strong> all {activeList?.words.length ?? 25} words — break each word into its
                  sounds and write the graphemes.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                  2
                </span>
                <span>
                  <strong>Let your teacher know</strong> when you have finished segmenting.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                  3
                </span>
                <span>
                  <strong>Complete activities</strong> — word build, spell check, suffix match, and handwriting
                  focus.
                </span>
              </li>
            </ol>
            <p className="mt-4 rounded-lg bg-[var(--bg-secondary)] p-3 text-xs text-[var(--text-muted)]">
              💡 If you are unsure of what you are supposed to be doing, and when, you need to ask.
            </p>
          </div>
        )}
      </section>

      <button type="button" className="btn-primary mt-6 w-full py-4 text-lg" onClick={beginLesson}>
        I&apos;m Ready — Start Segmenting
      </button>
    </div>
  )
}
