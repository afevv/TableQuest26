import { useSavedState } from "../../hooks/useSavedState";
import SettingsCard from "./SettingsCard";

const MAX_TABLE_LEVEL = 4;
const START = { level: 0, lastMovement: null };

// Ignores a saved value that is not a valid table position.
function cleanTable(saved) {
  const isValid =
    Number.isInteger(saved.level) && [null, "up", "down"].includes(saved.lastMovement);
  if (!isValid) return START;
  return { ...saved, level: Math.min(MAX_TABLE_LEVEL, Math.max(0, saved.level)) };
}

function MoveButton({ direction, label, onMove, disabled }) {
  return (
    <button
      type="button"
      aria-label={`Move table ${direction} one level`}
      onClick={() => onMove(direction)}
      disabled={disabled}
      className="rounded-xl bg-[#2d6fd6] px-5 py-3 text-sm font-bold text-white shadow-[0_3px_0_#1e4fa3] hover:bg-[#235fb8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6fd6] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}

// Temporary simulator: level 0 is the lowest position and level 4 is the highest.
// Replace the saved state with the table level and storage from SimulatorAPI.
function TableSimulator() {
  const [{ level, lastMovement }, setTable] = useSavedState(
    "tablequest-simulator-table-test",
    START,
    cleanTable
  );

  // Map "up"/"down" to SimulatorAPI commands and update the level from its response.
  function moveTable(direction) {
    setTable({ level: level + (direction === "up" ? 1 : -1), lastMovement: direction });
  }

  return (
    <SettingsCard title="SimulatorAPI">
      <div className="mt-4 flex flex-wrap gap-3">
        <MoveButton
          direction="up"
          label="↑ Up"
          onMove={moveTable}
          disabled={level >= MAX_TABLE_LEVEL}
        />
        <MoveButton direction="down" label="↓ Down" onMove={moveTable} disabled={level <= 0} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div
          role="img"
          aria-label={`Current table height: level ${level} of ${MAX_TABLE_LEVEL}`}
          className="flex h-24 w-8 flex-col-reverse gap-1 rounded-lg bg-slate-100 p-1"
        >
          {Array.from({ length: MAX_TABLE_LEVEL }, (_, index) => (
            <span
              key={index}
              className={`flex-1 rounded-sm transition-colors ${
                level > index ? "bg-[#2d6fd6]" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <div>
          <p className="text-xs font-semibold text-[#46536a]">Current table height</p>
          <p className="text-sm font-black text-[#1d2a44]">
            Level {level} of {MAX_TABLE_LEVEL}
          </p>
        </div>
      </div>
      <p aria-live="polite" className="mt-3 text-sm text-[#46536a]">
        {lastMovement
          ? `The table has moved ${lastMovement} 1 level.`
          : "No table movement recorded yet."}
      </p>
    </SettingsCard>
  );
}

export default TableSimulator;
