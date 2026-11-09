import { Routes, Route, Navigate } from 'react-router'
import SidebarLayout from './components/SidebarLayout'
import Home from './pages/Home'
import Exercise from './pages/Exercise'
import Social from './pages/Social'
import CustomReminders from './pages/CustomReminders'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import AboutUs from './pages/AboutUs'

function App() {
  return (
    <Routes>
      <Route element={<SidebarLayout />}>
        <Route index element={<Home />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/social" element={<Social />} />
        <Route path="/reminders" element={<CustomReminders />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
