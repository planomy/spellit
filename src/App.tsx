import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { SpellItProvider } from '@/hooks/useSpellItStore'
import { ThemeProvider } from '@/hooks/useTheme'
import { HomeScreen } from '@/pages/HomeScreen'
import { LearnScreen } from '@/pages/LearnScreen'
import { SegmentScreen } from '@/pages/SegmentScreen'
import { ActivitiesScreen } from '@/pages/ActivitiesScreen'
import { TeacherScreen } from '@/pages/TeacherScreen'

export default function App() {
  return (
    <ThemeProvider>
      <SpellItProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/learn" element={<LearnScreen />} />
              <Route path="/segment" element={<SegmentScreen />} />
              <Route path="/activities" element={<ActivitiesScreen />} />
              <Route path="/teacher" element={<TeacherScreen />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SpellItProvider>
    </ThemeProvider>
  )
}
