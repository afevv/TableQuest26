import MilestoneBar from "../components/SpaceJourney/MilestoneBar"
import SpaceJourney_header from "../components/SpaceJourney/SpaceJourney_header"
import SpaceJourney_footer from "../components/SpaceJourney/SpaceJourney_footer"
import Sidebar from "../components/Sidebar"

function SpaceJourney() {

  // This variable is hardcoded right now, for visual representation
  // When connecting db to this app, map this!
  
  const traveled = 123

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <section className="min-h-screen min-w-0 flex-1 bg-[#262626] p-6 text-white">
        <SpaceJourney_header />
        <MilestoneBar traveled={traveled} />
        <SpaceJourney_footer traveled={traveled} />
      </section>
    </div>
  )
}

export default SpaceJourney
