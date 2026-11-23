import { useState } from "react";
import { useSearchParams } from "react-router";
import Sidebar from "../components/Sidebar";
import exerciseIcon from "../assets/icons/exercise-icon.png";
import socialIcon from "../assets/icons/nav-social.svg";
import Exercise from "./Exercise";
import Social from "./Social";

function Home({ creativeMode, creativeTasks }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMode, setActiveMode] = useState(() =>
    searchParams.get("mode") === "social" ? "social" : "exercise"
  );
  const isSocial = activeMode === "social";

  function toggleMode() {
    const nextMode = isSocial ? "exercise" : "social";
    setActiveMode(nextMode);
    setSearchParams(nextMode === "social" ? { mode: nextMode } : {}, { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar homeMode={activeMode} />
      <main className="min-h-screen min-w-0 flex-1 bg-[#171717] text-white">
        <header className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <div>
            <h1 className="text-2xl font-bold leading-tight">Home</h1>
            <p className="mt-1 text-sm text-slate-300">Choose a quest path.</p>
          </div>
          <div role="group" aria-label="Choose a quest path" className="flex items-center gap-3">
            <span className={`flex items-center gap-2 text-sm font-bold ${!isSocial ? "text-white" : "text-slate-400"}`}>
              <span
                aria-hidden="true"
                className={`size-5 bg-current mask-contain mask-no-repeat mask-center ${
                  !isSocial ? "text-[#2f6fdb]" : "text-slate-500"
                }`}
                style={{
                  maskImage: `url("${exerciseIcon}")`,
                  WebkitMaskImage: `url("${exerciseIcon}")`,
                }}
              />
              Exercise
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isSocial}
              aria-label="Social quests"
              onClick={toggleMode}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                isSocial ? "bg-[#d96c07]" : "bg-[#2f6fdb]"
              }`}
            >
              <span
                className={`absolute left-1 top-1 size-5 rounded-full bg-white transition-transform ${
                  isSocial ? "translate-x-5" : ""
                }`}
              />
            </button>
            <span className={`flex items-center gap-2 text-sm font-bold ${isSocial ? "text-white" : "text-slate-400"}`}>
              <span
                aria-hidden="true"
                className={`size-5 bg-current mask-contain mask-no-repeat mask-center ${
                  isSocial ? "text-[#d96c07]" : "text-slate-500"
                }`}
                style={{
                  maskImage: `url("${socialIcon}")`,
                  WebkitMaskImage: `url("${socialIcon}")`,
                }}
              />
              Social
            </span>
          </div>
        </header>

        {isSocial ? (
          <Social showSidebar={false} />
        ) : (
          <Exercise
            creativeMode={creativeMode}
            creativeTasks={creativeTasks}
            showSidebar={false}
          />
        )}
      </main>
    </div>
  );
}

export default Home;
