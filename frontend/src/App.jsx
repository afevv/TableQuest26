import { Routes, Route, Navigate } from 'react-router'
import Introduction from './pages/Introduction'
import Home from './pages/Home'
import DepartmentRace from './pages/DepartmentRace'
import SpaceJourney from './pages/SpaceJourney'
import Settings from './pages/Settings'
import AboutUs from './pages/AboutUs'
import AlarmToast from './components/AlarmToast'
import { EXERCISE_PAGE_DATA } from './data/exercisePage'
import { SOCIAL_PAGE_DATA } from './data/socialPage'
import { ALARM_MINUTES } from './data/questSettings'
import { useQuestProgress } from './hooks/useQuestProgress'
import { useSavedNumber } from './hooks/useSavedState'

function App() {
  // Minutes between quest alarms, changed in Settings. The Pico quest scheduler should use it too.
  const [questInterval, setQuestInterval] = useSavedNumber(
    'tablequest-quest-interval', ALARM_MINUTES.start, ALARM_MINUTES.min, ALARM_MINUTES.max,
  )

  // Kept here so the alarms ring on every page.
  const exercise = useQuestProgress(EXERCISE_PAGE_DATA, questInterval)
  const social = useQuestProgress(SOCIAL_PAGE_DATA, questInterval)
  const ringing = [exercise, social].filter(({ alarm }) => alarm.isRinging)

  return (
    <>
      <div className="fixed left-1/2 top-4 z-60 -translate-x-1/2 space-y-2">
        {ringing.map((quests) => <AlarmToast key={quests.data.id} quests={quests} />)}
      </div>
      <Routes>
        <Route path="/" element={<Introduction />} />
        <Route path="/home" element={<Home exercise={exercise} social={social} />} />
        <Route path="/exercise" element={<Navigate to="/home?mode=exercise" replace />} />
        <Route path="/social" element={<Navigate to="/home?mode=social" replace />} />
        <Route path="/department-race" element={<DepartmentRace />} />
        <Route path="/space-journey" element={<SpaceJourney />} />
        <Route path="/progress" element={<Navigate to="/space-journey" replace />} />
        <Route
          path="/settings"
          element={
            <Settings questInterval={questInterval} setQuestInterval={setQuestInterval} />
          }
        />
        <Route path="/reminders" element={<Navigate to="/settings" replace />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
