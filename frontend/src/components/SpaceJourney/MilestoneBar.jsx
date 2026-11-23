import rocket from "../../assets/space/rocket.svg"
import { MILESTONES, formatDistance } from "../../data/milestones"

function getLevelFromXp(traveled) {
  const n = MILESTONES.length
  const reached = MILESTONES.findLastIndex((m) => traveled >= m.distance)

  if (reached === -1) return (traveled / MILESTONES[0].distance) * (0.5 / n) * 100
  if (reached === n - 1) return 100

  const from = MILESTONES[reached].distance
  const to = MILESTONES[reached + 1].distance
  const fraction = Math.log(traveled / from) / Math.log(to / from)
  return ((reached + 0.5 + fraction) / n) * 100
}

function Planet({ icon, name }) {
  return <img src={icon} alt={name} className="w-12 h-12" />
}

function MilestoneBar({ traveled = 0.1 }) {
  const progress = getLevelFromXp(traveled)

  return (
    <div className="card bg-[#171717] w-full shadow-md mt-10 rounded-3xl">
      <div className="card-body">
        <h2 className="card-title text-2xl md:text-3xl lg:text-4xl text-white font-bold mb-8">Milestone bar</h2>

        <div className="overflow-x-auto">
          <div className="min-w-640px px-2 pt-4 pb-2">
            <div className="relative h-4 rounded-full bg-base-300 mb-8">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700"
                style={{ width: `${progress}%` }}
              />
              <img
                src={rocket}
                alt=""
                className="absolute top-1/2 w-13.5 h-13.5 -translate-x-1/2 -translate-y-1/2 rotate-90 transition-[left] duration-700"
                style={{ left: `${progress}%` }}
                aria-hidden="true"
              />
            </div>

            <ol
              className="grid"
              style={{ gridTemplateColumns: `repeat(${MILESTONES.length}, minmax(0, 1fr))` }}
            >
              {MILESTONES.map((m) => {
                const reached = traveled >= m.distance
                return (
                  <li
                    key={m.name}
                    className={`flex flex-col items-center gap-3 text-center ${reached ? "" : "opacity-50"}`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full ring-4 ${
                        reached ? "bg-primary ring-primary/30" : "bg-base-300 ring-base-300/50"
                      }`}
                    />

                    <div className="h-12 flex items-center justify-center">
                      <Planet {...m} />
                    </div>
                    <span className="font-bold text-white text-sm md:text-base lg:text-lg">{formatDistance(m.distance)}</span>
                    <span className="text-sm md:text-base lg:text-lg text-white">{m.name}</span>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MilestoneBar
