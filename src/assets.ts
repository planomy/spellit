/** Bump when public/*.png assets are re-processed (cache bust for browser preview). */
export const ASSETS_VERSION = '25'

export function asset(path: string) {
  const file = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${file}?v=${ASSETS_VERSION}`
}

export const LOGO = asset('/logo.png')
export const MASCOT_THINKING = asset('/mascot-thinking.png')
export const MASCOT_IDEA = asset('/mascot-idea.png')
export const MASCOT_SPELLING = asset('/mascot-spelling.png')

export const ICON_HOME = asset('/icon-home.png')
export const ICON_LEARN = asset('/icon-learn.png')
export const ICON_SEGMENT = asset('/icon-segment.png')
export const ICON_ACTIVITIES = asset('/icon-activities.png')
export const ICON_TEACHER = asset('/icon-teacher.png')

export const ICON_STAT_SOUNDS = asset('/icon-stat-sounds.png')
export const ICON_STAT_SUFFIXES = asset('/icon-stat-suffixes.png')
export const ICON_STAT_PREFIXES = asset('/icon-stat-prefixes.png')

export const ICON_ACTIVITY_WORD_BUILD = asset('/icon-activity-word-build.png')
export const ICON_ACTIVITY_SPELL_CHECK = asset('/icon-activity-spell-check.png')
export const ICON_ACTIVITY_SUFFIX_MATCH = asset('/icon-activity-suffix-match.png')
export const ICON_ACTIVITY_HANDWRITING = asset('/icon-activity-handwriting.png')
export const ICON_ACTIVITY_TEST_MODE = asset('/icon-activity-test-mode.png')

export const QLD_CURSIVE_REFERENCE = asset('/qld-cursive-reference.png')
