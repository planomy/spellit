export const LEGACY_LESSON_LIST_ID = 'wl-lesson'

export function weekPlanId(term: number, week: number) {
  return `wl-t${term}-w${week}`
}

export function weekPlanLabel(plan: { week: number; unit: number; term?: number }) {
  const term = plan.term != null ? `Term ${plan.term} · ` : ''
  return `${term}Week ${plan.week} · Unit ${plan.unit}`
}

export interface Sound {
  id: string
  grapheme: string
  phoneme: string
  example: string
}

export interface Suffix {
  id: string
  suffix: string
  meaning?: string
  exampleWords: string[]
}

export interface SpellingWord {
  id: string
  word: string
  segments: string[]
  isSnip?: boolean
  definition?: string
}

export interface WordList {
  id: string
  name: string
  unit: number
  week: number
  term: number
  focusSounds: string[]
  focusSuffixes: string[]
  focusPrefixes?: string[]
  words: SpellingWord[]
  /** Paragraph for handwriting practice — text or pasted image, set in Teacher. */
  handwritingParagraphText?: string
  handwritingParagraphImage?: string
}

export interface LessonProgress {
  unitId: string
  segmentingComplete: boolean
  completedActivities: string[]
  currentWordIndex: number
}

export type AppScreen =
  | 'home'
  | 'learn'
  | 'lesson'
  | 'segment'
  | 'activities'
  | 'teacher'

export type ActivityId =
  | 'word-build'
  | 'spell-check'
  | 'suffix-match'
  | 'handwriting'
  | 'test-mode'

export interface Activity {
  id: ActivityId
  title: string
  description: string
  icon: string
}
