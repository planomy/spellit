import { ICON_STAT_PREFIXES, ICON_STAT_SOUNDS, ICON_STAT_SUFFIXES } from '@/assets'
import type { WordList } from '@/types'

interface LessonHeroProps {
  list: WordList
}

export function LessonHero({ list }: LessonHeroProps) {
  return (
    <section className="overview-section">
      <div className="section-header">
        <h3 className="section-title">Today&apos;s Focus</h3>
        <span className="section-meta">
          Term {list.term} · Week {list.week} · Unit {list.unit}
        </span>
      </div>

      <div className="overview-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--img">
            <img src={ICON_STAT_SOUNDS} alt="" className="stat-card__icon-img" draggable={false} />
          </div>
          <div>
            <p className="stat-card__label">Sounds</p>
            <p className="stat-card__value stat-card__value--sm">
              {list.focusSounds.join(' · ') || '—'}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--img">
            <img src={ICON_STAT_SUFFIXES} alt="" className="stat-card__icon-img" draggable={false} />
          </div>
          <div>
            <p className="stat-card__label">Suffixes</p>
            <p className="stat-card__value stat-card__value--sm">
              {list.focusSuffixes.join(' · ') || '—'}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--img">
            <img src={ICON_STAT_PREFIXES} alt="" className="stat-card__icon-img" draggable={false} />
          </div>
          <div>
            <p className="stat-card__label">Prefixes</p>
            <p className="stat-card__value stat-card__value--sm">
              {list.focusPrefixes?.join(' · ') || '—'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
