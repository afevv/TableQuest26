import { useState } from "react";
import { useSavedNumber } from "../../hooks/useSavedState";
import Counter from "./Counter";
import SettingsCard from "./SettingsCard";
import WaterGlass from "./WaterGlass";

// Amounts above this (in ml) show the hydration warning.
const SAFE_LIMIT_ML = 1000;

function getGlassSummary(dailyGoal, glassSize) {
  const fullGlasses = Math.floor(dailyGoal / glassSize);
  const partialGlassMl = dailyGoal % glassSize;

  if (partialGlassMl === 0) return `${fullGlasses} full glasses`;
  if (fullGlasses === 0) return `${dailyGoal} ml in 1 glass`;
  return `${fullGlasses} full + ${partialGlassMl} ml in a partial glass`;
}

function GlassSizeField({ glassSize, onChange }) {
  const [isEditing, setIsEditing] = useState(false);

  function changeSize(event) {
    const size = Number(event.target.value);
    if (size >= 50 && size <= 1000) onChange(size);
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="h-8 w-[178px] rounded-md border border-slate-300 bg-white px-2 text-xs font-bold text-[#2d6fd6] hover:border-[#2d6fd6] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6fd6]"
        aria-label={`Change glass size, currently ${glassSize} ml`}
      >
        Glass size: {glassSize} ml
      </button>
    );
  }

  return (
    <label className="flex h-8 w-[178px] items-center justify-end gap-1.5">
      <span className="font-semibold">Glass size</span>
      <input
        aria-label="Glass size in millilitres"
        type="number"
        min="50"
        max="1000"
        step="50"
        value={glassSize}
        onChange={changeSize}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(event) => ["Enter", "Escape"].includes(event.key) && setIsEditing(false)}
        autoFocus
        className="h-8 w-16 rounded-lg border border-slate-300 px-2 text-sm text-[#1d2a44] outline-none focus:border-[#2d6fd6]"
      />
      <span>ml</span>
    </label>
  );
}

function HydrationWarning({ perReminder, hourlyIntake, shiftHours }) {
  if (perReminder <= SAFE_LIMIT_ML && hourlyIntake <= SAFE_LIMIT_ML) return null;

  return (
    <div
      role="alert"
      className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] leading-relaxed text-amber-950"
    >
      <p className="font-black">Scientific hydration reminder</p>
      <p className="mt-1">
        {perReminder > SAFE_LIMIT_ML && <>Each reminder is {perReminder} ml. </>}
        {hourlyIntake > SAFE_LIMIT_ML && (
          <>
            The plan averages {Math.round(hourlyIntake)} ml per hour over your {shiftHours}-hour
            shift.{" "}
          </>
        )}
        The National Academies estimates maximum kidney water excretion at about 0.7–1.0 L per
        hour. Consider smaller amounts or a lower hourly rate.
      </p>
      <p className="mt-2">
        Sources:{" "}
        <a href="https://nap.nationalacademies.org/read/10925/chapter/6" target="_blank" rel="noreferrer" className="font-semibold underline">
          National Academies
        </a>
        {" · "}
        <a href="https://www.cdc.gov/niosh/heat-stress/recommendations/index.html" target="_blank" rel="noreferrer" className="font-semibold underline">
          NIOSH workplace hydration guidance
        </a>
      </p>
    </div>
  );
}

function WaterSettings() {
  const [dailyGoal, setDailyGoal] = useSavedNumber("tablequest-daily-goal", 2500, 100, 10000);
  const [perReminder, setPerReminder] = useSavedNumber("tablequest-per-reminder", 350, 50, 1000);
  const [shiftHours, setShiftHours] = useSavedNumber("tablequest-working-hours", 8, 1, 16);
  const [glassSize, setGlassSize] = useSavedNumber("tablequest-glass-size", 300, 50, 1000);

  // Pico water alarm mapping: use this calculated schedule to trigger water alerts on the OLED.
  const alertCount = Math.ceil(dailyGoal / perReminder);
  const alertMinutes = Math.round((shiftHours * 60) / alertCount);
  const hourlyIntake = (alertCount * perReminder) / shiftHours;

  const glassCount = Math.ceil(dailyGoal / glassSize);
  const glassSummary = getGlassSummary(dailyGoal, glassSize);

  return (
    <SettingsCard title="Water">
      <div className="mt-5 grid grid-cols-3 gap-5">
        <Counter
          title="Daily goal"
          name="daily water goal"
          unit="ml"
          value={dailyGoal}
          onChange={setDailyGoal}
          step={100}
          min={100}
        />
        <Counter
          title="Per alert"
          name="water per reminder"
          unit="ml"
          value={perReminder}
          onChange={setPerReminder}
          step={50}
          min={50}
        />
        <Counter
          title="Working hours today"
          name="working hours"
          unit="h"
          value={shiftHours}
          onChange={setShiftHours}
          step={1}
          min={1}
          max={16}
        />
      </div>

      <div
        role="img"
        aria-label={`Daily goal represented by ${glassSummary}`}
        className="mt-4 flex min-h-12 flex-wrap items-end gap-1.5"
      >
        {Array.from({ length: glassCount }, (_, index) => (
          <WaterGlass
            key={index}
            index={index}
            fillPercent={(Math.min(glassSize, dailyGoal - index * glassSize) / glassSize) * 100}
          />
        ))}
      </div>
      <div className="mt-1 grid h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs text-[#46536a]">
        <p className="min-w-0 truncate" title={glassSummary}>
          {glassSummary}
        </p>
        <GlassSizeField glassSize={glassSize} onChange={setGlassSize} />
      </div>

      <div className="mt-5 flex items-start gap-3 text-[14px]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 fill-none stroke-[#1687df] stroke-[2]">
          <path d="M12 3S6.5 10.1 6.5 15a5.5 5.5 0 0011 0C17.5 10.1 12 3 12 3z" />
        </svg>
        <p>
          <strong>{alertCount} water alerts</strong>, one every {alertMinutes} min
          <span className="text-[#46536a]">
            {" "}
            ({dailyGoal} ÷ {perReminder} rounded up, spread over {shiftHours} h after your first
            hour)
          </span>
        </p>
      </div>

      <HydrationWarning
        perReminder={perReminder}
        hourlyIntake={hourlyIntake}
        shiftHours={shiftHours}
      />
    </SettingsCard>
  );
}

export default WaterSettings;
