import { getLevelTitle, getXpThreshold } from "../utils/progression";

const themes = {
  blue: {
    tile: "bg-[#2e6fdb]",
    button:
      "bg-[#eef4ff] text-[#2163cd] hover:bg-[#dce9ff] focus-visible:outline-[#2e6fdb]",
    track: "bg-[#e8edf4]",
    progress: "bg-[#2e6fdb]",
  },
  orange: {
    tile: "bg-[#e8790c]",
    button:
      "bg-[#fff1e2] text-[#a85300] hover:bg-[#fbe2c8] focus-visible:outline-[#d96c07]",
    track: "bg-[#f3e5d7]",
    progress: "bg-[#e8790c]",
  },
  purple: {
    tile: "bg-[#6b4bd4]",
    button:
      "bg-[#f0ecfc] text-[#5b43ae] hover:bg-[#e3dcf8] focus-visible:outline-[#6b4bd4]",
    track: "bg-[#e8e3f6]",
    progress: "bg-[#6b4bd4]",
  },
};

function PlayerLevelHud({
  progress,
  levels,
  onAddXp,
  levelUpCount,
  accent = "blue",
}) {
  const theme = themes[accent];

  return (
    <section
      aria-label="Player level"
      className="min-h-[156px] self-start flex items-center gap-3 rounded-2xl border border-[#d8dee8] bg-white p-3 text-[#19253a] shadow-md"
    >
      <div
        key={levelUpCount}
        className={`relative grid size-12 shrink-0 place-items-center rounded-xl ${theme.tile} text-xl font-extrabold text-white shadow-sm ${
          levelUpCount > 0 ? "level-up-badge" : ""
        }`}
      >
        {levelUpCount > 0 && (
          <span key={levelUpCount} role="status" className="level-up-label">
            LEVEL UP!
          </span>
        )}
        {progress.level}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#718096]">
              Level {progress.level}
            </p>
            <h2 className="text-xs font-bold leading-tight">
              {getLevelTitle(progress.level, levels)}
            </h2>
            <p className="mt-1 text-[10px] text-[#718096]">
              {getXpThreshold(progress.level) - progress.xp} XP to level{" "}
              {progress.level + 1}
            </p>
          </div>
          <button
            type="button"
            onClick={onAddXp}
            className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${theme.button}`}
          >
            <span aria-hidden="true" className="text-sm leading-none">
              +
            </span>
            Add XP
          </button>
        </div>
        <div
          className={`mt-2 h-2 overflow-hidden rounded-full ${theme.track}`}
          role="progressbar"
          aria-label="XP to next level"
          aria-valuemin={0}
          aria-valuemax={getXpThreshold(progress.level)}
          aria-valuenow={progress.xp}
        >
          <div
            className={`h-full rounded-full transition-[width] ${theme.progress}`}
            style={{
              width: `${(progress.xp / getXpThreshold(progress.level)) * 100}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default PlayerLevelHud;
