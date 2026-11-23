import { useState } from "react";

function PlayerLevelHud({ progress: { level, xp, needed }, levels, onAddXp }) {
  const [firstLevel] = useState(level);
  const hasLeveledUp = level > firstLevel;

  return (
    <section
      aria-label="Player level"
      className="flex min-h-[156px] items-center gap-3 self-start rounded-2xl border border-[#d8dee8] bg-white p-3 text-[#19253a] shadow-md"
    >
      <div
        key={level}
        className={`relative grid size-12 shrink-0 place-items-center rounded-xl bg-(--accent) text-xl font-extrabold text-white shadow-sm ${
          hasLeveledUp ? "level-up-badge" : ""
        }`}
      >
        {hasLeveledUp && (
          <span role="status" className="level-up-label">
            LEVEL UP!
          </span>
        )}
        {level}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#718096]">
              Level {level}
            </p>
            <h2 className="text-xs font-bold leading-tight">
              {levels[level - 1] ?? `Level ${level} Adventurer`}
            </h2>
            <p className="mt-1 text-[10px] text-[#718096]">
              {needed - xp} XP to level {level + 1}
            </p>
          </div>
          <button
            type="button"
            onClick={onAddXp}
            className="shrink-0 rounded-lg bg-(--accent-soft) px-2.5 py-1.5 text-[11px] font-bold text-(--accent-dark) transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-(--accent)"
          >
            + Add XP
          </button>
        </div>
        <progress
          aria-label="XP to next level"
          className="progress mt-2 h-2 w-full text-(--accent)"
          value={xp}
          max={needed}
        />
      </div>
    </section>
  );
}

export default PlayerLevelHud;
