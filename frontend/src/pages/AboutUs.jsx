import Sidebar from "../components/Sidebar"

function AboutUs() {
  const steps = [
    "Your desk alerts you",
    "You do a quick quest",
    "You and your team level up",
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <section className="min-h-screen min-w-0 flex-1 bg-[#171717] px-6 py-8 text-slate-100 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-[#8b5cf6]">About TableQuest</h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-300">
            Your LINAK desk reminds you to move, drink water and talk to colleagues.
            Every quest earns XP, and every centimetre your desk moves counts for
            your team.
          </p>

          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step}
                className="min-h-24 rounded-2xl bg-slate-50 p-4 text-slate-800"
              >
                <span className="mb-2 flex size-9 items-center justify-center rounded-full bg-[#8b5cf6] font-bold text-white">
                  {index + 1}
                </span>
                <p className="font-semibold">{step}</p>
              </li>
            ))}
          </ol>

          <section aria-labelledby="team-heading" className="mt-7">
            <h2 id="team-heading" className="text-xl font-bold text-[#8b5cf6]">
              The team
            </h2>
            <p className="mt-2 leading-relaxed text-slate-300">
              Andrei Ungurianu · Alvaro Vilar Revueltas · Danils Migunovs · David
              Coll Sánchez · Diego Chamorro Segura · Santiago Matzkin Aleva
            </p>
            <p className="mt-1 leading-relaxed text-slate-300">
              Supervisor: Pauls Odins Smits · SDU semester project, E26
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
