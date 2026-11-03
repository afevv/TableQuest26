import { Routes, Route, Navigate } from 'react-router'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Physical from './pages/Physical'
import Social from './pages/Social'
import CustomReminders from './pages/CustomReminders'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

function App() {
  return (
    <>
      <Sidebar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/physical" element={<Physical />} />
          <Route path="/social" element={<Social />} />
          <Route path="/reminders" element={<CustomReminders />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
