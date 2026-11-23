import { useEffect } from "react";
import { useSearchParams } from "react-router";
import Sidebar from "../components/Sidebar";
import ToggleSwitch from "../components/ToggleSwitch";
import { HOME_TABS } from "../data/homeTabs";
import { getSavedHomeTab, saveHomeTab } from "../utils/savedHomeTab";
import Exercise from "./Exercise";
import Social from "./Social";

function TabLabel({ tab: { label, icon, theme }, isActive }) {
  return (
    <span
      className={`${theme} flex items-center gap-2 text-sm font-bold ${isActive ? "text-white" : "text-slate-400"}`}
    >
      <span
        aria-hidden="true"
        className={`size-5 mask-contain mask-center mask-no-repeat ${isActive ? "bg-(--accent)" : "bg-slate-400"}`}
        style={{ maskImage: `url("${icon}")` }}
      />
      {label}
    </span>
  );
}

function Home({ exercise, social }) {
  const [searchParams, setSearchParams] = useSearchParams();
  // A link can ask for a tab; otherwise the last open tab is kept.
  const isSocial = (searchParams.get("mode") ?? getSavedHomeTab()) === "social";
  const mode = isSocial ? "social" : "exercise";

  useEffect(() => saveHomeTab(mode), [mode]);

  function toggleMode() {
    setSearchParams({ mode: isSocial ? "exercise" : "social" }, { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar homeMode={mode} />
      <main className="min-h-screen min-w-0 flex-1 bg-[#171717] text-white">
        <header className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <div>
            <h1 className="text-2xl font-bold leading-tight">Home</h1>
            <p className="mt-1 text-sm text-slate-300">Choose a quest path.</p>
          </div>
          <div
            role="group"
            aria-label="Choose a quest path"
            className={`${HOME_TABS[mode].theme} flex items-center gap-3`}
          >
            <TabLabel tab={HOME_TABS.exercise} isActive={!isSocial} />
            <ToggleSwitch
              checked={isSocial}
              label="Social quests"
              onChange={toggleMode}
              color="var(--accent)"
              offColor="var(--accent)"
            />
            <TabLabel tab={HOME_TABS.social} isActive={isSocial} />
          </div>
        </header>

        {isSocial ? <Social quests={social} /> : <Exercise quests={exercise} />}
      </main>
    </div>
  );
}

export default Home;
