import { useEffect, useState } from 'react'
import { HandwritingParagraphField } from '@/components/HandwritingParagraphField'
import { WeekSelector } from '@/components/WeekSelector'
import { useSpellIt } from '@/hooks/useSpellItStore'
import { parseWordListText, splitTokens, wordsToText } from '@/utils/parseWordList'

function listToForm(list: {
  term: number
  week: number
  unit: number
  focusSounds: string[]
  focusSuffixes: string[]
  focusPrefixes?: string[]
  words: { word: string; definition?: string }[]
  handwritingParagraphText?: string
  handwritingParagraphImage?: string
}) {
  return {
    term: String(list.term),
    week: String(list.week),
    unit: String(list.unit),
    sounds: list.focusSounds.join(' '),
    suffixes: list.focusSuffixes.join(' '),
    prefixes: list.focusPrefixes?.join(' ') ?? '',
    wordsText: wordsToText(list.words),
    paragraphText: list.handwritingParagraphText ?? '',
    paragraphImage: list.handwritingParagraphImage ?? null,
  }
}

export function TeacherScreen() {
  const { activeList, wordLists, activeWeekId, setActiveWeek, addWeekPlan, updateWordList, addWordsToList } =
    useSpellIt()

  const [term, setTerm] = useState('2')
  const [week, setWeek] = useState('10')
  const [unit, setUnit] = useState('18')
  const [sounds, setSounds] = useState('')
  const [suffixes, setSuffixes] = useState('')
  const [prefixes, setPrefixes] = useState('')
  const [wordsText, setWordsText] = useState('')
  const [paragraphText, setParagraphText] = useState('')
  const [paragraphImage, setParagraphImage] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!activeList) return
    const form = listToForm(activeList)
    setTerm(form.term)
    setWeek(form.week)
    setUnit(form.unit)
    setSounds(form.sounds)
    setSuffixes(form.suffixes)
    setPrefixes(form.prefixes)
    setWordsText(form.wordsText)
    setParagraphText(form.paragraphText)
    setParagraphImage(form.paragraphImage)
    setFeedback('')
  }, [activeList])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!activeList) return

    const parsed = parseWordListText(wordsText)
    if (!parsed.length) {
      setFeedback('Add at least one word — one per line, e.g. knee: the part of the leg that bends')
      return
    }

    const termNum = Number(term) || activeList.term
    const weekNum = Number(week) || activeList.week
    const unitNum = Number(unit) || activeList.unit

    updateWordList(activeList.id, {
      term: termNum,
      week: weekNum,
      unit: unitNum,
      focusSounds: splitTokens(sounds),
      focusSuffixes: splitTokens(suffixes),
      focusPrefixes: splitTokens(prefixes),
      handwritingParagraphText: paragraphImage ? undefined : paragraphText.trim() || undefined,
      handwritingParagraphImage: paragraphImage ?? undefined,
    })
    addWordsToList(activeList.id, parsed, 'replace')
    setFeedback('Saved!')
    setTimeout(() => setFeedback(''), 2500)
  }

  return (
    <div className="teacher-editor animate-fade-in">
      <p className="teacher-editor__intro">
        Choose a week, set sounds and suffixes, paste words and a handwriting paragraph, then save.
        Each week is stored for the whole term.
      </p>

      <WeekSelector
        weeks={wordLists}
        value={activeWeekId}
        onChange={setActiveWeek}
        label="Edit week"
        showAdd
        onAdd={addWeekPlan}
      />

      <form onSubmit={handleSave} className="dashboard-panel teacher-editor__form">
        <div className="teacher-editor__meta">
          <label className="teacher-editor__label">
            Term
            <input
              type="number"
              min={1}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </label>
          <label className="teacher-editor__label">
            Week
            <input
              type="number"
              min={1}
              value={week}
              onChange={(e) => setWeek(e.target.value)}
            />
          </label>
          <label className="teacher-editor__label">
            Unit
            <input
              type="number"
              min={1}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </label>
        </div>

        <div className="teacher-editor__focus">
          <label className="teacher-editor__label">
            Sounds
            <input
              type="text"
              placeholder="e.g. n nn kn"
              value={sounds}
              onChange={(e) => setSounds(e.target.value)}
            />
          </label>
          <label className="teacher-editor__label">
            Suffixes
            <input
              type="text"
              placeholder="e.g. ance ence"
              value={suffixes}
              onChange={(e) => setSuffixes(e.target.value)}
            />
          </label>
          <label className="teacher-editor__label">
            Prefixes
            <input
              type="text"
              value={prefixes}
              onChange={(e) => setPrefixes(e.target.value)}
            />
          </label>
        </div>

        <label className="teacher-editor__label teacher-editor__label--words">
          Words &amp; definitions
          <textarea
            rows={14}
            className="teacher-editor__textarea"
            placeholder={`One word per line:\n\nknee: the part of the leg that bends\nknow: to have learned something\ndance: move to music\n\nPlain words work too:\ncan\nten`}
            value={wordsText}
            onChange={(e) => {
              setWordsText(e.target.value)
              setFeedback('')
            }}
          />
        </label>

        <label className="teacher-editor__label teacher-editor__label--words">
          Handwriting paragraph
          <HandwritingParagraphField
            text={paragraphText}
            imageDataUrl={paragraphImage}
            onTextChange={(value) => {
              setParagraphText(value)
              setFeedback('')
            }}
            onImageChange={(dataUrl) => {
              setParagraphImage(dataUrl)
              setFeedback('')
            }}
          />
        </label>

        <div className="teacher-editor__actions">
          <button type="submit" className="btn-primary px-8 py-3">
            Save week
          </button>
          {feedback && <p className="teacher-editor__feedback">{feedback}</p>}
        </div>
      </form>
    </div>
  )
}
