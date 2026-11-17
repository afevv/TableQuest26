import { Routes, Route, Navigate } from 'react-router'
import SidebarLayout from './components/SidebarLayout'
import Introduction from './pages/Introduction'
import Home from './pages/Home'
import DepartmentRace from './pages/DepartmentRace'
import Social from './pages/Social'
import CustomReminders from './pages/CustomReminders'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import Accessibility from './pages/Accessibility'
import AboutUs from './pages/AboutUs'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Introduction />} />
      <Route element={<SidebarLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/department-race" element={<DepartmentRace />} />
        <Route path="/exercise" element={<Navigate to="/department-race" replace />} />
        <Route path="/social" element={<Social />} />
        <Route path="/reminders" element={<CustomReminders />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
