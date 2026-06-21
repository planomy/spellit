import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createWeekPlan, sortWeekPlans } from '@/utils/weekPlans'
import type { LessonProgress, Sound, Suffix, WordList } from '@/types'
import { LEGACY_LESSON_LIST_ID, weekPlanId, weekPlanLabel } from '@/types'
import {
  DEFAULT_SOUNDS,
  DEFAULT_SUFFIXES,
  DEFAULT_WORD_LISTS,
} from '@/data/defaults'

const STORAGE_KEY = 'spell-it-data'

interface StoredData {
  sounds: Sound[]
  suffixes: Suffix[]
  wordLists: WordList[]
  activeWeekId?: string
}

interface LoadedData extends StoredData {
  activeWeekId: string
}

interface SpellItContextValue {
  sounds: Sound[]
  suffixes: Suffix[]
  wordLists: WordList[]
  activeWeekId: string
  progress: LessonProgress | null
  activeList: WordList | null
  currentList: WordList | null
  setCurrentList: (list: WordList | null) => void
  setActiveWeek: (weekId: string) => void
  addWeekPlan: () => void
  addSound: (sound: Omit<Sound, 'id'>) => void
  updateSound: (id: string, sound: Partial<Sound>) => void
  deleteSound: (id: string) => void
  addSuffix: (suffix: Omit<Suffix, 'id'>) => void
  updateSuffix: (id: string, suffix: Partial<Suffix>) => void
  deleteSuffix: (id: string) => void
  updateWordList: (id: string, list: Partial<WordList>) => void
  addWordToList: (
    listId: string,
    word: { word: string; segments: string[]; isSnip?: boolean; definition?: string },
  ) => void
  addWordsToList: (
    listId: string,
    words: { word: string; segments: string[]; isSnip?: boolean; definition?: string }[],
    mode?: 'append' | 'replace',
  ) => void
  deleteWordFromList: (listId: string, wordId: string) => void
  startLesson: (listId?: string) => void
  completeSegmenting: () => void
  completeActivity: (activityId: string) => void
  advanceWord: () => void
  resetProgress: () => void
  ensureLesson: () => void
}

const SpellItContext = createContext<SpellItContextValue | null>(null)

function normalizeWeekList(raw: Partial<WordList>, def: WordList): WordList {
  const term = raw.term ?? def.term
  const week = raw.week ?? def.week
  const unit = raw.unit ?? def.unit
  return {
    ...def,
    ...raw,
    id: raw.id?.startsWith('wl-t') ? raw.id : weekPlanId(term, week),
    name: raw.name ?? weekPlanLabel({ term, week, unit }),
    term,
    week,
    unit,
    focusSounds: raw.focusSounds?.length ? raw.focusSounds : def.focusSounds,
    focusSuffixes: raw.focusSuffixes?.length ? raw.focusSuffixes : def.focusSuffixes,
    focusPrefixes: raw.focusPrefixes ?? def.focusPrefixes ?? [],
    words: raw.words?.length ? raw.words : def.words,
  }
}

function loadWordLists(parsed: Partial<StoredData>): { wordLists: WordList[]; activeWeekId: string } {
  const def = DEFAULT_WORD_LISTS[0]
  const saved = parsed.wordLists ?? []

  if (parsed.activeWeekId && saved.some((l) => l.id === parsed.activeWeekId)) {
    const wordLists = sortWeekPlans(saved.map((l) => normalizeWeekList(l, def)))
    return { wordLists, activeWeekId: parsed.activeWeekId }
  }

  if (saved.length && saved.every((l) => l.id.startsWith('wl-t'))) {
    const wordLists = sortWeekPlans(saved.map((l) => normalizeWeekList(l, def)))
    return { wordLists, activeWeekId: wordLists[0]?.id ?? def.id }
  }

  const legacy =
    saved.find((l) => l.id === LEGACY_LESSON_LIST_ID) ??
    saved.find((l) => l.id === 'wl-simpler-18') ??
    saved.find((l) => l.id === 'wl-difficult-18')

  const source = legacy ?? def
  const plan = normalizeWeekList(source, def)
  return { wordLists: [plan], activeWeekId: plan.id }
}

function loadData(): LoadedData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as StoredData
      const { wordLists, activeWeekId } = loadWordLists(parsed)
      return {
        sounds: parsed.sounds?.length ? parsed.sounds : DEFAULT_SOUNDS,
        suffixes: parsed.suffixes?.length ? parsed.suffixes : DEFAULT_SUFFIXES,
        wordLists,
        activeWeekId,
      }
    }
  } catch {
    /* use defaults */
  }
  return {
    sounds: DEFAULT_SOUNDS,
    suffixes: DEFAULT_SUFFIXES,
    wordLists: DEFAULT_WORD_LISTS,
    activeWeekId: DEFAULT_WORD_LISTS[0].id,
  }
}

function saveData(data: LoadedData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function SpellItProvider({ children }: { children: ReactNode }) {
  const initial = loadData()
  const [sounds, setSounds] = useState<Sound[]>(initial.sounds)
  const [suffixes, setSuffixes] = useState<Suffix[]>(initial.suffixes)
  const [wordLists, setWordLists] = useState<WordList[]>(initial.wordLists)
  const [activeWeekId, setActiveWeekId] = useState(initial.activeWeekId)
  const [currentList, setCurrentList] = useState<WordList | null>(null)
  const [progress, setProgress] = useState<LessonProgress | null>(null)

  useEffect(() => {
    saveData({ sounds, suffixes, wordLists, activeWeekId })
  }, [sounds, suffixes, wordLists, activeWeekId])

  const activeList = useMemo(
    () => wordLists.find((l) => l.id === activeWeekId) ?? wordLists[0] ?? null,
    [wordLists, activeWeekId],
  )

  const setActiveWeek = useCallback((weekId: string) => {
    setActiveWeekId(weekId)
    setProgress(null)
    setCurrentList(null)
  }, [])

  const addWeekPlan = useCallback(() => {
    const term = wordLists.find((p) => p.id === activeWeekId)?.term ?? wordLists[0]?.term ?? 2
    const template = wordLists.find((p) => p.id === activeWeekId) ?? wordLists[wordLists.length - 1]
    const plan = createWeekPlan(wordLists, term, template)
    setWordLists((prev) => sortWeekPlans([...prev, plan]))
    setActiveWeekId(plan.id)
    setProgress(null)
    setCurrentList(null)
  }, [wordLists, activeWeekId])

  const addSound = useCallback((sound: Omit<Sound, 'id'>) => {
    setSounds((prev) => [...prev, { ...sound, id: `s${Date.now()}` }])
  }, [])

  const updateSound = useCallback((id: string, patch: Partial<Sound>) => {
    setSounds((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }, [])

  const deleteSound = useCallback((id: string) => {
    setSounds((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const addSuffix = useCallback((suffix: Omit<Suffix, 'id'>) => {
    setSuffixes((prev) => [...prev, { ...suffix, id: `x${Date.now()}` }])
  }, [])

  const updateSuffix = useCallback((id: string, patch: Partial<Suffix>) => {
    setSuffixes((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }, [])

  const deleteSuffix = useCallback((id: string) => {
    setSuffixes((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const updateWordList = useCallback((id: string, patch: Partial<WordList>) => {
    setWordLists((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l
        const next = { ...l, ...patch }
        if (patch.term != null || patch.week != null || patch.unit != null) {
          next.name = weekPlanLabel(next)
        }
        return next
      }),
    )
  }, [])

  const addWordToList = useCallback(
    (listId: string, word: { word: string; segments: string[]; isSnip?: boolean; definition?: string }) => {
      setWordLists((prev) =>
        prev.map((l) =>
          l.id === listId
            ? {
                ...l,
                words: [
                  ...l.words,
                  { ...word, id: `w${Date.now()}`, isSnip: word.isSnip ?? l.words.length % 5 === 4 },
                ],
              }
            : l,
        ),
      )
    },
    [],
  )

  const addWordsToList = useCallback(
    (
      listId: string,
      words: { word: string; segments: string[]; isSnip?: boolean; definition?: string }[],
      mode: 'append' | 'replace' = 'append',
    ) => {
      if (!words.length) return
      setWordLists((prev) =>
        prev.map((l) => {
          if (l.id !== listId) return l
          const base = mode === 'replace' ? [] : l.words
          const next = words.map((word, i) => ({
            ...word,
            id: `w${Date.now()}-${i}`,
            isSnip: word.isSnip ?? (base.length + i + 1) % 5 === 0,
          }))
          return { ...l, words: [...base, ...next] }
        }),
      )
    },
    [],
  )

  const deleteWordFromList = useCallback((listId: string, wordId: string) => {
    setWordLists((prev) =>
      prev.map((l) =>
        l.id === listId ? { ...l, words: l.words.filter((w) => w.id !== wordId) } : l,
      ),
    )
  }, [])

  const startLesson = useCallback(
    (listId?: string) => {
      const id = listId ?? activeWeekId
      const list = wordLists.find((l) => l.id === id) ?? null
      setCurrentList(list)
      setProgress({
        unitId: id,
        segmentingComplete: false,
        completedActivities: [],
        currentWordIndex: 0,
      })
    },
    [wordLists, activeWeekId],
  )

  const completeSegmenting = useCallback(() => {
    setProgress((p) => (p ? { ...p, segmentingComplete: true } : p))
  }, [])

  const completeActivity = useCallback((activityId: string) => {
    setProgress((p) =>
      p && !p.completedActivities.includes(activityId)
        ? { ...p, completedActivities: [...p.completedActivities, activityId] }
        : p,
    )
  }, [])

  const advanceWord = useCallback(() => {
    setProgress((p) => (p ? { ...p, currentWordIndex: p.currentWordIndex + 1 } : p))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(null)
    setCurrentList(null)
  }, [])

  const ensureLesson = useCallback(() => {
    if (!activeList) return
    setCurrentList(activeList)
    if (progress?.unitId === activeList.id) return
    setProgress({
      unitId: activeList.id,
      segmentingComplete: false,
      completedActivities: [],
      currentWordIndex: 0,
    })
  }, [activeList, progress?.unitId])

  const value = useMemo(
    () => ({
      sounds,
      suffixes,
      wordLists,
      activeWeekId,
      progress,
      activeList,
      currentList,
      setCurrentList,
      setActiveWeek,
      addWeekPlan,
      addSound,
      updateSound,
      deleteSound,
      addSuffix,
      updateSuffix,
      deleteSuffix,
      updateWordList,
      addWordToList,
      addWordsToList,
      deleteWordFromList,
      startLesson,
      completeSegmenting,
      completeActivity,
      advanceWord,
      resetProgress,
      ensureLesson,
    }),
    [
      sounds,
      suffixes,
      wordLists,
      activeWeekId,
      progress,
      activeList,
      currentList,
      setActiveWeek,
      addWeekPlan,
      addSound,
      updateSound,
      deleteSound,
      addSuffix,
      updateSuffix,
      deleteSuffix,
      updateWordList,
      addWordToList,
      addWordsToList,
      deleteWordFromList,
      startLesson,
      completeSegmenting,
      completeActivity,
      advanceWord,
      resetProgress,
      ensureLesson,
    ],
  )

  return <SpellItContext.Provider value={value}>{children}</SpellItContext.Provider>
}

export function useSpellIt() {
  const ctx = useContext(SpellItContext)
  if (!ctx) throw new Error('useSpellIt must be used within SpellItProvider')
  return ctx
}
