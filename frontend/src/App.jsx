import { Routes, Route, Navigate } from 'react-router'
import SidebarLayout from './components/SidebarLayout'
import Home from './pages/Home'
import Exercise from './pages/Exercise'
import Social from './pages/Social'
import CustomReminders from './pages/CustomReminders'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<SidebarLayout />}>
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/social" element={<Social />} />
        <Route path="/reminders" element={<CustomReminders />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
