import {
  ICON_ACTIVITY_HANDWRITING,
  ICON_ACTIVITY_SPELL_CHECK,
  ICON_ACTIVITY_SUFFIX_MATCH,
  ICON_ACTIVITY_TEST_MODE,
  ICON_ACTIVITY_WORD_BUILD,
} from '@/assets'
import type { Sound, Suffix, WordList } from '@/types'
import { weekPlanId } from '@/types'

export const DEFAULT_SOUNDS: Sound[] = [
  { id: 's1', grapheme: 'a', phoneme: '/a/', example: 'cat' },
  { id: 's2', grapheme: 'e', phoneme: '/e/', example: 'bed' },
  { id: 's3', grapheme: 'i', phoneme: '/i/', example: 'sit' },
  { id: 's4', grapheme: 'o', phoneme: '/o/', example: 'hot' },
  { id: 's5', grapheme: 'u', phoneme: '/u/', example: 'cup' },
  { id: 's6', grapheme: 'sh', phoneme: '/sh/', example: 'ship' },
  { id: 's7', grapheme: 'ch', phoneme: '/ch/', example: 'chip' },
  { id: 's8', grapheme: 'th', phoneme: '/th/', example: 'thin' },
  { id: 's9', grapheme: 'ai', phoneme: '/ay/', example: 'rain' },
  { id: 's10', grapheme: 'ee', phoneme: '/ee/', example: 'tree' },
  { id: 's11', grapheme: 'oa', phoneme: '/oh/', example: 'boat' },
  { id: 's12', grapheme: 'ou', phoneme: '/ow/', example: 'out' },
]

export const DEFAULT_SUFFIXES: Suffix[] = [
  { id: 'x0a', suffix: 'ance', meaning: 'action or state', exampleWords: ['guidance', 'balance', 'maintenance'] },
  { id: 'x0e', suffix: 'ence', meaning: 'state or quality', exampleWords: ['reference', 'silence', 'confidence'] },
  { id: 'x1', suffix: 'ing', meaning: 'doing something now', exampleWords: ['running', 'jumping', 'reading'] },
  { id: 'x2', suffix: 'ed', meaning: 'already happened', exampleWords: ['walked', 'jumped', 'played'] },
  { id: 'x3', suffix: 'er', meaning: 'person or thing that does', exampleWords: ['teacher', 'runner', 'baker'] },
  { id: 'x4', suffix: 'est', meaning: 'most of something', exampleWords: ['fastest', 'biggest', 'tallest'] },
  { id: 'x5', suffix: 'ful', meaning: 'full of', exampleWords: ['helpful', 'careful', 'beautiful'] },
  { id: 'x6', suffix: 'less', meaning: 'without', exampleWords: ['hopeless', 'careless', 'endless'] },
  { id: 'x7', suffix: 'ly', meaning: 'in a way', exampleWords: ['quickly', 'slowly', 'happily'] },
  { id: 'x8', suffix: 'tion', meaning: 'action or state', exampleWords: ['action', 'nation', 'creation'] },
]

const UNIT_18_SOUNDS = ['n', 'nn', 'kn']
const UNIT_18_SUFFIXES = ['ance', 'ence']

const simplerWords = [
  { word: 'can', segments: ['c', 'a', 'n'] },
  { word: 'ten', segments: ['t', 'e', 'n'] },
  { word: 'pen', segments: ['p', 'e', 'n'] },
  { word: 'ran', segments: ['r', 'a', 'n'] },
  { word: 'dance', segments: ['d', 'a', 'n', 'ce'], isSnip: true },
  { word: 'dinner', segments: ['d', 'i', 'nn', 'er'] },
  { word: 'banner', segments: ['b', 'a', 'nn', 'er'] },
  { word: 'sunny', segments: ['s', 'u', 'nn', 'y'] },
  { word: 'knee', segments: ['kn', 'ee'] },
  { word: 'know', segments: ['kn', 'ow'], isSnip: true },
  { word: 'fence', segments: ['f', 'e', 'n', 'ce'] },
  { word: 'since', segments: ['s', 'i', 'n', 'ce'] },
  { word: 'prince', segments: ['p', 'r', 'i', 'n', 'ce'] },
  { word: 'science', segments: ['s', 'ci', 'e', 'n', 'ce'] },
  { word: 'silence', segments: ['s', 'i', 'l', 'e', 'n', 'ce'], isSnip: true },
  { word: 'guidance', segments: ['g', 'ui', 'd', 'a', 'n', 'ce'] },
  { word: 'absence', segments: ['a', 'b', 's', 'e', 'n', 'ce'] },
  { word: 'entrance', segments: ['e', 'n', 'tr', 'a', 'n', 'ce'] },
  { word: 'sentence', segments: ['s', 'e', 'n', 't', 'e', 'n', 'ce'] },
  { word: 'reference', segments: ['r', 'e', 'f', 'e', 'r', 'e', 'n', 'ce'], isSnip: true },
  { word: 'inn', segments: ['i', 'nn'] },
  { word: 'knock', segments: ['kn', 'o', 'ck'] },
  { word: 'once', segments: ['o', 'n', 'ce'] },
  { word: 'balance', segments: ['b', 'a', 'l', 'a', 'n', 'ce'] },
  { word: 'confidence', segments: ['c', 'o', 'n', 'f', 'i', 'd', 'e', 'n', 'ce'], isSnip: true },
]

function makeWords(words: { word: string; segments: string[]; isSnip?: boolean }[]) {
  return words.map((w, i) => ({
    id: `w${i}`,
    word: w.word,
    segments: w.segments,
    isSnip: w.isSnip,
  }))
}

export const DEFAULT_WORD_LISTS: WordList[] = [
  {
    id: weekPlanId(2, 10),
    name: 'Week 10 · Unit 18',
    unit: 18,
    week: 10,
    term: 2,
    focusSounds: UNIT_18_SOUNDS,
    focusSuffixes: UNIT_18_SUFFIXES,
    words: makeWords(simplerWords),
  },
]

export const ENCOURAGING_MESSAGES = [
  "You've got this — one sound at a time!",
  'Every great speller started exactly where you are.',
  "Segment, think, spell — you're building a superpower!",
  "Mistakes mean you're learning. Keep going!",
  'Your brain is getting stronger with every word.',
  "Break it into sounds — you've totally got this!",
  'Spelling stars are made one phoneme at a time.',
  'Take your time. Think it through. You can do it!',
  "Sound it out — you're doing brilliantly!",
  "Progress, not perfection — that's the goal!",
  "You're becoming a spelling champion!",
  'Listen carefully, segment carefully, spell carefully!',
  'Believe in yourself — your teacher does!',
  'Each word you segment makes the next one easier.',
  'Focus on the sounds — the letters will follow!',
]

export const LEARNING_INTENTIONS = [
  'Improve handwriting, specifically cursive writing',
  'Use segmenting skills to spell words accurately during Soundwaves lessons',
  'Follow the routine and expectations for spelling, reading, and handwriting sessions',
  'Work independently and responsibly during online and written activities',
]

export const SUCCESS_CRITERIA = [
  'I write neatly in cursive, forming letters correctly with consistent size and spacing',
  'I segment words into sounds to help me spell them correctly during Soundwaves lessons',
  'I follow the routine and expectations for spelling, reading, and handwriting sessions',
  'I work independently and responsibly during online and written activities',
]

export const TEST_MODE_POINTS_PER_WORD = 10
export const TEST_MODE_LETTER_HINT_COST = 5
export const TEST_MODE_STARTING_POINTS = 20

export const ACTIVITIES = [
  {
    id: 'word-build' as const,
    title: 'Word Build',
    description: 'Drag letter tiles to rebuild segmented words',
    icon: ICON_ACTIVITY_WORD_BUILD,
  },
  {
    id: 'spell-check' as const,
    title: 'Spell Check',
    description: 'Type each word from its segmented sounds',
    icon: ICON_ACTIVITY_SPELL_CHECK,
  },
  {
    id: 'suffix-match' as const,
    title: 'Suffix Match',
    description: 'Pick the suffix that completes each word',
    icon: ICON_ACTIVITY_SUFFIX_MATCH,
  },
  {
    id: 'handwriting' as const,
    title: 'Handwriting Focus',
    description: 'Practice cursive writing with snip words (5, 10, 15, 20, 25)',
    icon: ICON_ACTIVITY_HANDWRITING,
  },
  {
    id: 'test-mode' as const,
    title: 'Test Mode',
    description: 'Spell words from their definitions — earn points and buy letter hints',
    icon: ICON_ACTIVITY_TEST_MODE,
  },
]
