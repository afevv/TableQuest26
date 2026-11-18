import MilestoneBar from "../components/MilestoneBar"
import SpaceJourney_header from "../components/SpaceJourney_header"
import SpaceJourney_footer from "../components/SpaceJourney_footer"

function SpaceJourney() {

  const traveled = 123

  return (
    <section className="min-h-screen bg-[#262626] p-6 text-white">
      <SpaceJourney_header />
      <MilestoneBar traveled={traveled} />
      <SpaceJourney_footer traveled={traveled} />
    </section>
  )
}

export default SpaceJourney
