import { useState } from "react"
import DepartmentRace_Header from "../components/DepartmentRace/DepartmentRace_Header"
import DepartmentRace_Toggle from "../components/DepartmentRace/DepartmentRace_Toggle"
import DepartmentRace_Leaderboard from "../components/DepartmentRace/DepartmentRace_Leaderboard"
import DepartmentRace_MemberLeaderBoard from "../components/DepartmentRace/DepartmentRace_MemberLeaderBoard"
import DepartmentRace_Footer from "../components/DepartmentRace/DepartmentRace_Footer"
import Sidebar from "../components/Sidebar"

function DepartmentRace() {
  const [view, setView] = useState("departments")

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <section className="min-h-screen min-w-0 flex-1 p-6 bg-[#262626]">
        <DepartmentRace_Header/>

        <DepartmentRace_Toggle value={view} onChange={setView} />
        {view === "departments" ? <DepartmentRace_Leaderboard /> : <DepartmentRace_MemberLeaderBoard />}

        <DepartmentRace_Footer/>

      </section>
    </div>
  )
}

export default DepartmentRace
