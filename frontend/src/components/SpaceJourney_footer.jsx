import { formatDistance, getLastStop, getNextStop } from "../data/milestones"

function SpaceJourney_footer({ traveled = 0 }) {
    const lastStop = getLastStop(traveled)
    const nextStop = getNextStop(traveled)

    return (
      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="card w-full bg-[#171717] shadow-md rounded-3xl">
          <div className="card-body">
            <h2 className="card-title text-[#D9A86C] text-base md:text-lg lg:text-xl">JUST UNLOCKED</h2>
            <h1 className="text-4xl xl:text-5xl font-bold">
              {lastStop ? lastStop.name : "Nothing yet"}
            </h1>
            {lastStop && <p className="text-base md:text-lg lg:text-xl">Reached at {formatDistance(lastStop.distance)}</p>}
            <div className="justify-end card-actions">
            </div>
          </div>
        </div>

        <div className="card w-full bg-[#171717] shadow-md rounded-3xl">
          <div className="card-body">
            <h2 className="card-title text-primary/75 text-base md:text-lg lg:text-xl">DISTANCE TRAVELLED</h2>
            <h1 className="text-4xl xl:text-5xl font-bold break-words">{formatDistance(traveled)}</h1>
            <p className="text-base md:text-lg lg:text-xl">
              {nextStop
                ? `Next stop: ${nextStop.name} (${formatDistance(nextStop.distance - traveled)} to go)`
                : "All milestones reached!"}
            </p>
            <div className="justify-end card-actions">
            </div>
          </div>
        </div>

        <div className="card w-full bg-[#171717] shadow-md rounded-3xl">
          <div className="card-body">
            <h2 className="card-title text-primary/75 text-base md:text-lg lg:text-xl">CREW</h2>
            <h1 className="text-4xl xl:text-5xl font-bold">
            </h1>
            <div className="justify-end card-actions">
            </div>
          </div>
        </div>

      </section>
    )
  }

  export default SpaceJourney_footer
