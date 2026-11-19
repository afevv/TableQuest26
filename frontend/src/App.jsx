import { Routes, Route, Navigate } from 'react-router'
import Introduction from './pages/Introduction'
import Exercise from './pages/Exercise'
import DepartmentRace from './pages/DepartmentRace'
import Social from './pages/Social'
import SpaceJourney from './pages/SpaceJourney'
import Settings from './pages/Settings'
import Accessibility from './pages/Accessibility'
import AboutUs from './pages/AboutUs'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Introduction />} />
      <Route path="/exercise" element={<Exercise />} />
      <Route path="/home" element={<Navigate to="/exercise" replace />} />
      <Route path="/department-race" element={<DepartmentRace />} />
      <Route path="/social" element={<Social />} />
      <Route path="/reminders" element={<Navigate to="/settings" replace />} />
      <Route path="/space-journey" element={<SpaceJourney />} />
      <Route path="/progress" element={<Navigate to="/space-journey" replace />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/accessibility" element={<Accessibility />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
