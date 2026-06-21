import type { WordList } from '@/types'
import { weekPlanLabel } from '@/types'

interface WeekSelectorProps {
  weeks: WordList[]
  value: string
  onChange: (id: string) => void
  label?: string
  showAdd?: boolean
  onAdd?: () => void
}

export function WeekSelector({
  weeks,
  value,
  onChange,
  label = 'Week',
  showAdd,
  onAdd,
}: WeekSelectorProps) {
  if (!weeks.length) return null

  return (
    <div className="week-selector">
      <label className="week-selector__label">
        {label}
        <select
          className="week-selector__select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {weeks.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name || weekPlanLabel(w)}
            </option>
          ))}
        </select>
      </label>
      {showAdd && onAdd && (
        <button type="button" className="btn-secondary week-selector__add" onClick={onAdd}>
          + Add week
        </button>
      )}
    </div>
  )
}
