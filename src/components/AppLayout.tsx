import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  ICON_ACTIVITIES,
  ICON_HOME,
  ICON_LEARN,
  ICON_SEGMENT,
  ICON_TEACHER,
  LOGO,
} from '@/assets'
import { TopBar } from '@/components/TopBar'

const NAV = [
  { to: '/', label: 'Home', icon: ICON_HOME, end: true },
  { to: '/learn', label: 'Learn', icon: ICON_LEARN },
  { to: '/segment', label: 'Segment', icon: ICON_SEGMENT },
  { to: '/activities', label: 'Activities', icon: ICON_ACTIVITIES },
  { to: '/teacher', label: 'Teacher', icon: ICON_TEACHER },
]

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/learn': 'Before You Begin',
  '/segment': 'Segmenting',
  '/activities': 'Activities',
  '/teacher': 'Teacher Dashboard',
}

export function AppLayout() {
  const { pathname } = useLocation()
  const pageTitle = PAGE_TITLES[pathname] ?? 'Spell It'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <img src={LOGO} alt="Spell It" className="sidebar__logo" draggable={false} />
        </div>

        <nav className="sidebar__nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <img src={item.icon} alt="" className="sidebar__icon-img" draggable={false} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <p className="sidebar__footer">Soundwaves · Spell It</p>
      </aside>

      <div className="app-main">
        <TopBar title={pageTitle} />
        <div className="app-content">
          <nav className="mobile-nav" aria-label="Main navigation">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
