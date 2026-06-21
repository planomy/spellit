import type { WordList } from '@/types'
import { weekPlanId, weekPlanLabel } from '@/types'

export function sortWeekPlans(plans: WordList[]): WordList[] {
  return [...plans].sort((a, b) => a.term - b.term || a.week - b.week)
}

export function nextWeekMeta(plans: WordList[], term: number) {
  const termPlans = plans.filter((p) => p.term === term)
  const week = termPlans.length ? Math.max(...termPlans.map((p) => p.week)) + 1 : 1
  const unit = termPlans.length ? Math.max(...termPlans.map((p) => p.unit)) + 1 : 1
  return { term, week, unit, id: weekPlanId(term, week) }
}

export function createWeekPlan(
  plans: WordList[],
  term: number,
  template?: WordList | null,
): WordList {
  const meta = nextWeekMeta(plans, term)
  return {
    id: meta.id,
    name: weekPlanLabel(meta),
    term: meta.term,
    week: meta.week,
    unit: meta.unit,
    focusSounds: [...(template?.focusSounds ?? [])],
    focusSuffixes: [...(template?.focusSuffixes ?? [])],
    focusPrefixes: template?.focusPrefixes ? [...template.focusPrefixes] : [],
    words: [],
  }
}
