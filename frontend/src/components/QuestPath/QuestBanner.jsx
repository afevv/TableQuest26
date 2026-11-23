import guideBook from "../../assets/icons/guide-book.svg";
import Countdown from "./Countdown";

// The colored box at the top: current quest, countdown and Guide button.
function QuestBanner({ quests, stage, canOpenGuide, onOpenGuide }) {
  const { data, nextNode, isUnlocked, alarm } = quests;

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border-b-4 border-(--accent-dark) bg-(--accent) p-5 shadow-lg sm:p-6">
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/90">
          {nextNode ? `Current quest · ${stage.title}` : data.title}
        </p>
        <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
          {nextNode?.label ?? "All quests complete"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/90">{nextNode?.description}</p>
        {nextNode && !isUnlocked && (
          <p className="mt-3 flex flex-wrap items-center gap-3 text-sm font-bold">
            <span>
              ⏰ Unlocks in <Countdown until={alarm.ringsAt} />
            </span>
            <button
              type="button"
              onClick={alarm.ringNow}
              className="rounded-lg border border-white/60 px-2 py-1 text-xs hover:bg-white/15"
            >
              Ring now (test)
            </button>
          </p>
        )}
      </div>
      <button
        type="button"
        disabled={!canOpenGuide}
        onClick={onOpenGuide}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/60 px-3 py-2 text-xs font-bold uppercase tracking-wide transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50"
      >
        <img src={guideBook} alt="" className="size-4 brightness-0 invert" />
        Guide
      </button>
    </div>
  );
}

export default QuestBanner;
