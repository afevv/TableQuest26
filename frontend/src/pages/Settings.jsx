import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const MAX_TABLE_LEVEL = 4;

function readSavedNumber(key, fallback, minimum, maximum) {
  const storedValue = window.localStorage.getItem(key);
  if (storedValue === null || storedValue.trim() === "") return fallback;
  const saved = Number(storedValue);
  if (!Number.isFinite(saved)) return fallback;
  return Math.min(maximum, Math.max(minimum, saved));
}

function readSavedReminders() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("tablequest-reminders") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Replace this local loader with the table level reported by SimulatorAPI.
function readSavedTableTest() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("tablequest-simulator-table-test") || "null");
    if (
      !saved ||
      !Number.isInteger(saved.level) ||
      ![null, "up", "down"].includes(saved.lastMovement)
    ) {
      return { level: 0, lastMovement: null };
    }
    return {
      level: Math.min(MAX_TABLE_LEVEL, Math.max(0, saved.level)),
      lastMovement: saved.lastMovement,
    };
  } catch {
    return { level: 0, lastMovement: null };
  }
}

function CounterButton({ label, onClick, children, disabled = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-12 shrink-0 place-items-center rounded-xl border border-slate-300 bg-white text-xl font-bold text-[#2d6fd6] shadow-sm transition-colors hover:border-[#2d6fd6] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6fd6] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function WaterGlass({ fillPercent, index }) {
  const fillHeight = 28 * (fillPercent / 100);
  const clipId = `water-glass-interior-${index}`;

  return (
    <svg aria-hidden="true" height="44" viewBox="0 0 32 40" width="36">
      <defs>
        <clipPath id={clipId}>
          <path d="M6 5h20l-3 27q-7 3-14 0L6 5Z" />
        </clipPath>
      </defs>
      <rect
        clipPath={`url(#${clipId})`}
        fill="#6ebbf0"
        height={fillHeight}
        width="22"
        x="5"
        y={33 - fillHeight}
      />
      <path d="M5 4h22l-3 29q-8 4-16 0L5 4Z" fill="none" stroke="#1687df" strokeWidth="2" />
      <path d="M5 6h22" fill="none" stroke="#1687df" strokeWidth="2" />
    </svg>
  );
}

function Settings() {
  const [dailyGoal, setDailyGoal] = useState(() => readSavedNumber("tablequest-daily-goal", 2500, 100, 10000));
  const [perReminder, setPerReminder] = useState(() => readSavedNumber("tablequest-per-reminder", 350, 50, 1000));
  const [shiftHours, setShiftHours] = useState(() => readSavedNumber("tablequest-working-hours", 8, 1, 16));
  // Quest alert +/- buttons change the Pico schedule in 5-minute steps, from 5 to 120 minutes.
  const [questInterval, setQuestInterval] = useState(() => readSavedNumber("tablequest-quest-interval", 45, 5, 120));
  // Alert cards select the output mode; the saved mode is also emitted as a change event below.
  const [alertMode, setAlertMode] = useState(() => {
    const savedAlertMode = window.localStorage.getItem("tablequest-alert-mode");
    return ["sound", "light", "both"].includes(savedAlertMode) ? savedAlertMode : "both";
  });
  // When enabled, the Pico should keep the LED steady during light alerts instead of flashing.
  const [steadyLight, setSteadyLight] = useState(() => {
    const savedSteadyLight = window.localStorage.getItem("tablequest-steady-light");
    return savedSteadyLight === null ? true : savedSteadyLight === "true";
  });
  // Pico OLED mapping: display each enabled reminder's custom text at its scheduled time.
  const [reminders, setReminders] = useState(readSavedReminders);
  const [glassSize, setGlassSize] = useState(() => readSavedNumber("tablequest-glass-size", 300, 50, 1000));
  const [editingGlassSize, setEditingGlassSize] = useState(false);
  // Temporary simulator state: level 0 is the lowest position and level 4 is the highest.
  const [tableTest, setTableTest] = useState(readSavedTableTest);

  // Pico water alarm mapping: use this calculated schedule to trigger water alerts on the OLED.
  const waterReminderCount = Math.ceil(dailyGoal / perReminder);
  const reminderInterval = shiftHours > 0
    ? Math.round((shiftHours * 60) / waterReminderCount)
    : 0;
  const plannedHourlyIntake = (waterReminderCount * perReminder) / shiftHours;
  const highPerReminder = perReminder > 1000;
  const highHourlyIntake = plannedHourlyIntake > 1000;
  const glassCount = Math.ceil(dailyGoal / glassSize);
  const fullGlasses = Math.floor(dailyGoal / glassSize);
  const partialGlassMl = dailyGoal % glassSize;
  const glassSummary =
    partialGlassMl === 0
      ? `${glassCount} full glasses`
      : fullGlasses === 0
        ? `${dailyGoal} ml in 1 glass`
        : `${fullGlasses} full + ${partialGlassMl} ml in a partial glass`;

  useEffect(() => {
    window.localStorage.setItem("tablequest-alert-mode", alertMode);
    // Pico mapping: listen for this event and activate the selected sound, light, or combined output.
    window.dispatchEvent(
      new CustomEvent("tablequest:alert-mode-change", {
        detail: { mode: alertMode },
      }),
    );
  }, [alertMode]);

  useEffect(() => {
    window.localStorage.setItem("tablequest-steady-light", String(steadyLight));
    // Pico mapping: use enabled=true for a steady LED; false allows the normal light pulse.
    window.dispatchEvent(
      new CustomEvent("tablequest:steady-light-change", {
        detail: { enabled: steadyLight },
      }),
    );
  }, [steadyLight]);

  useEffect(() => {
    window.localStorage.setItem("tablequest-daily-goal", String(dailyGoal));
  }, [dailyGoal]);

  useEffect(() => {
    window.localStorage.setItem("tablequest-per-reminder", String(perReminder));
  }, [perReminder]);

  useEffect(() => {
    window.localStorage.setItem("tablequest-working-hours", String(shiftHours));
  }, [shiftHours]);

  // The Pico quest scheduler should use this saved interval after either +/- button changes it.
  useEffect(() => {
    window.localStorage.setItem("tablequest-quest-interval", String(questInterval));
  }, [questInterval]);

  useEffect(() => {
    window.localStorage.setItem("tablequest-glass-size", String(glassSize));
  }, [glassSize]);

  useEffect(() => {
    window.localStorage.setItem("tablequest-reminders", JSON.stringify(reminders));
  }, [reminders]);

  // Replace localStorage with SimulatorAPI persistence when the API is ready.
  useEffect(() => {
    window.localStorage.setItem("tablequest-simulator-table-test", JSON.stringify(tableTest));
  }, [tableTest]);

  function selectAlertMode(mode) {
    setAlertMode(mode);
  }

  // Map "up"/"down" to SimulatorAPI commands and update the level from its response.
  function moveSimulatedTable(direction) {
    setTableTest((current) => {
      const level = Math.min(
        MAX_TABLE_LEVEL,
        Math.max(0, current.level + (direction === "up" ? 1 : -1)),
      );
      return level === current.level
        ? current
        : { level, lastMovement: direction };
    });
  }

  function addReminder(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const textInput = form.elements.namedItem("text");
    const text = String(fields.get("text") || "").trim();

    if (!text) {
      textInput.setCustomValidity("Please enter a reminder message.");
      textInput.reportValidity();
      return;
    }

    textInput.setCustomValidity("");
    setReminders((current) => [
      ...current,
      { id: Date.now(), time: fields.get("time"), text, enabled: true },
    ]);
    form.reset();
  }

  // Pico quest outputs: physical quests use Sound 1 + a blue LED pulse; social quests use Sound 2 + an orange pulse.
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <section className="min-h-screen min-w-0 flex-1 bg-[#f7f9fc] px-8 py-4 text-[#1d2a44]">
        <div className="mx-auto max-w-[1000px] space-y-5">
          <header className="pt-0">
            <h1 className="text-[32px] font-black leading-tight text-[#1d2a44]">Settings</h1>
          </header>

          <section aria-labelledby="simulator-api-heading" className="rounded-2xl border border-slate-300 bg-white px-6 py-5 shadow-sm">
            <h2 id="simulator-api-heading" className="text-[18px] font-black">SimulatorAPI</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                aria-label="Move table up one level"
                onClick={() => moveSimulatedTable("up")}
                disabled={tableTest.level >= MAX_TABLE_LEVEL}
                className="rounded-xl bg-[#2d6fd6] px-5 py-3 text-sm font-bold text-white shadow-[0_3px_0_#1e4fa3] hover:bg-[#235fb8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6fd6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                ↑ Up
              </button>
              <button
                type="button"
                aria-label="Move table down one level"
                onClick={() => moveSimulatedTable("down")}
                disabled={tableTest.level <= 0}
                className="rounded-xl bg-[#2d6fd6] px-5 py-3 text-sm font-bold text-white shadow-[0_3px_0_#1e4fa3] hover:bg-[#235fb8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6fd6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                ↓ Down
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div
                role="img"
                aria-label={`Current table height: level ${tableTest.level} of ${MAX_TABLE_LEVEL}`}
                className="flex h-24 w-8 flex-col-reverse gap-1 rounded-lg bg-slate-100 p-1"
              >
                {Array.from({ length: MAX_TABLE_LEVEL }, (_, index) => {
                  const level = index + 1;
                  return (
                    <span
                      key={level}
                      aria-hidden="true"
                      className={`flex-1 rounded-sm transition-colors ${
                        tableTest.level >= level ? "bg-[#2d6fd6]" : "bg-slate-200"
                      }`}
                    />
                  );
                })}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#46536a]">Current table height</p>
                <p className="text-sm font-black text-[#1d2a44]">
                  Level {tableTest.level} of {MAX_TABLE_LEVEL}
                </p>
              </div>
            </div>
            <p aria-live="polite" className="mt-3 text-sm text-[#46536a]">
              {tableTest.lastMovement
                ? `The table has moved ${tableTest.lastMovement} 1 level.`
                : "No table movement recorded yet."}
            </p>
          </section>

          <section aria-labelledby="alerts-heading" className="rounded-2xl border border-slate-300 bg-white px-6 py-5 shadow-sm">
            <h2 id="alerts-heading" className="text-[18px] font-black">How your desk alerts you</h2>
            <p className="mt-2 text-[13px] text-[#46536a]">
              Alerts start after your first hour of work and stop by themselves after a few seconds.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                // Sound only: activate the Pico buzzer for each scheduled quest alert.
                { mode: "sound", title: "Sound only", subtitle: "For people who can’t watch the LED" },
                // Light only: activate the Pico LED; obey the steadyLight preference above.
                { mode: "light", title: "Light only", subtitle: "For hearing loss or quiet offices" },
                // Both: activate the buzzer and LED together for the same alert.
                { mode: "both", title: "Both", subtitle: "Sound and light together" },
              ].map(({ mode, title, subtitle }) => {
                const selected = alertMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={selected}
                    data-alert-mode={mode}
                    onClick={() => selectAlertMode(mode)}
                    className={`${mode === "both" ? "col-span-2" : ""} flex min-h-[132px] flex-col items-start rounded-2xl border-2 p-5 text-left shadow-[0_4px_0_#e2e8f0] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6fd6] ${
                      selected
                        ? "border-[#2d6fd6] bg-[#edf5ff] shadow-[0_4px_0_#2d6fd6]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className={`mb-2 size-7 fill-none stroke-current stroke-[2] ${selected ? "text-[#2d6fd6]" : "text-slate-500"}`}>
                      {mode === "sound" ? (
                        <>
                          <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M15 9a5 5 0 010 6M17.5 6.5a9 9 0 010 11" strokeLinecap="round" />
                        </>
                      ) : mode === "light" ? (
                        <>
                          <path d="M9 18h6M10 21h4M8.5 14.5a7 7 0 117 0c-.8.6-1.2 1.4-1.3 2.5h-4.4c-.1-1.1-.5-1.9-1.3-2.5Z" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      ) : (
                        <>
                          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42" strokeLinecap="round" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                    <span className="text-[16px] font-black">{title}</span>
                    <span className="mt-1 text-[13px] leading-relaxed text-[#46536a]">{subtitle}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-semibold">Steady light, no flashing</h3>
                <p className="mt-1 text-[13px] text-[#46536a]">
                  Recommended if you have epilepsy or are sensitive to light.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={steadyLight}
                aria-label="Steady light, no flashing"
                onClick={() => setSteadyLight((enabled) => !enabled)}
                className={`relative h-9 w-[66px] shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6fd6] ${
                  steadyLight ? "bg-[#2d6fd6]" : "bg-slate-300"
                }`}
              >
                <span className={`absolute left-1 top-1 size-7 rounded-full bg-white shadow-sm transition-transform ${steadyLight ? "translate-x-7" : ""}`} />
              </button>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="grid grid-cols-[1fr_1fr_1.15fr] gap-5">
              <div>
                <h3 className="text-[13px] font-black">Quest alert every</h3>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <CounterButton
                    label="Decrease quest interval"
                    onClick={() => setQuestInterval((value) => Math.max(5, value - 5))}
                    disabled={questInterval <= 5}
                  >
                    −
                  </CounterButton>
                  <span className="text-[18px] font-black">{questInterval} min</span>
                  <CounterButton label="Increase quest interval" onClick={() => setQuestInterval((value) => Math.min(120, value + 5))}>+</CounterButton>
                </div>
              </div>
              <div>
                <h3 className="text-[13px] font-black">Physical quests</h3>
                <p className="mt-4 text-[13px] text-[#46536a]">Sound 1 · blue LED pulse</p>
              </div>
              <div>
                <h3 className="text-[13px] font-black">Social quests</h3>
                <p className="mt-4 text-[13px] text-[#46536a]">Sound 2 · orange LED pulse</p>
              </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="water-heading" className="rounded-2xl border border-slate-300 bg-white px-6 py-5 shadow-sm">
            <h2 id="water-heading" className="text-[18px] font-black">Water</h2>

            <div className="mt-5 grid grid-cols-3 gap-5">
              <div>
                <h3 className="text-[13px] font-black">Daily goal</h3>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <CounterButton label="Decrease daily water goal" onClick={() => setDailyGoal((goal) => Math.max(100, goal - 100))} disabled={dailyGoal <= 100}>−</CounterButton>
                  <span className="text-[18px] font-black">{dailyGoal} ml</span>
                  <CounterButton label="Increase daily water goal" onClick={() => setDailyGoal((goal) => goal + 100)}>+</CounterButton>
                </div>
              </div>
              <div>
                <h3 className="text-[13px] font-black">Per alert</h3>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <CounterButton label="Decrease water per reminder" onClick={() => setPerReminder((amount) => Math.max(50, amount - 50))} disabled={perReminder <= 50}>−</CounterButton>
                  <span className="text-[18px] font-black">{perReminder} ml</span>
                  <CounterButton label="Increase water per reminder" onClick={() => setPerReminder((amount) => amount + 50)}>+</CounterButton>
                </div>
              </div>
              <div>
                <h3 className="text-[13px] font-black">Working hours today</h3>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <CounterButton
                    label="Decrease working hours"
                    onClick={() => setShiftHours((hours) => Math.max(1, hours - 1))}
                    disabled={shiftHours <= 1}
                  >
                    −
                  </CounterButton>
                  <span className="text-[18px] font-black">{shiftHours} h</span>
                  <CounterButton label="Increase working hours" onClick={() => setShiftHours((hours) => Math.min(16, hours + 1))}>+</CounterButton>
                </div>
              </div>
            </div>

            <div
              role="img"
              aria-label={`Daily goal represented by ${glassSummary}`}
              className="mt-4 flex min-h-12 flex-wrap items-end gap-1.5"
            >
              {Array.from({ length: glassCount }, (_, index) => {
                const glassMl = Math.min(glassSize, dailyGoal - index * glassSize);
                return (
                  <WaterGlass
                    key={index}
                    index={index}
                    fillPercent={(glassMl / glassSize) * 100}
                  />
                );
              })}
            </div>
            <div className="mt-1 grid h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs text-[#46536a]">
              <p className="min-w-0 truncate" title={glassSummary}>{glassSummary}</p>
              {editingGlassSize ? (
                <label className="flex h-8 w-[178px] items-center justify-end gap-1.5">
                  <span className="font-semibold">Glass size</span>
                  <input
                    aria-label="Glass size in millilitres"
                    type="number"
                    min="50"
                    max="1000"
                    step="50"
                    value={glassSize}
                    onChange={(event) => {
                      const nextSize = Number(event.target.value);
                      if (nextSize >= 50 && nextSize <= 1000) {
                        setGlassSize(nextSize);
                      }
                    }}
                    onBlur={() => setEditingGlassSize(false)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === "Escape") {
                        setEditingGlassSize(false);
                      }
                    }}
                    autoFocus
                    className="h-8 w-16 rounded-lg border border-slate-300 px-2 text-sm text-[#1d2a44] outline-none focus:border-[#2d6fd6]"
                  />
                  <span>ml</span>
                </label>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingGlassSize(true)}
                  className="h-8 w-[178px] rounded-md border border-slate-300 bg-white px-2 text-xs font-bold text-[#2d6fd6] hover:border-[#2d6fd6] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6fd6]"
                  aria-label={`Change glass size, currently ${glassSize} ml`}
                >
                  Glass size: {glassSize} ml
                </button>
              )}
            </div>

            <div className="mt-5 flex items-start gap-3 text-[14px]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 fill-none stroke-[#1687df] stroke-[2]">
                <path d="M12 3S6.5 10.1 6.5 15a5.5 5.5 0 0011 0C17.5 10.1 12 3 12 3z" />
              </svg>
              <p>
                <strong>{waterReminderCount} water alerts</strong>, one every {reminderInterval} min
                <span className="text-[#46536a]"> ({dailyGoal} ÷ {perReminder} rounded up, spread over {shiftHours} h after your first hour)</span>
              </p>
            </div>

            {(highPerReminder || highHourlyIntake) && (
              <div role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] leading-relaxed text-amber-950">
                <p className="font-black">Scientific hydration reminder</p>
                <p className="mt-1">
                  {highPerReminder && <>Each reminder is {perReminder} ml. </>}
                  {highHourlyIntake && <>The plan averages {Math.round(plannedHourlyIntake)} ml per hour over your {shiftHours}-hour shift. </>}
                  The National Academies estimates maximum kidney water excretion at about 0.7–1.0 L per hour. Consider smaller amounts or a lower hourly rate.
                </p>
                <p className="mt-2">
                  Sources:{" "}
                  <a href="https://nap.nationalacademies.org/read/10925/chapter/6" target="_blank" rel="noreferrer" className="font-semibold underline">National Academies</a>
                  {" · "}
                  <a href="https://www.cdc.gov/niosh/heat-stress/recommendations/index.html" target="_blank" rel="noreferrer" className="font-semibold underline">NIOSH workplace hydration guidance</a>
                </p>
              </div>
            )}
          </section>

          <section aria-labelledby="my-reminders-heading" className="rounded-2xl border border-slate-300 bg-white px-6 py-5 shadow-sm">
            <h2 id="my-reminders-heading" className="text-[18px] font-black">My reminders</h2>
            <div className="mt-4">
              <ul className="space-y-2">
                {reminders.length === 0 ? (
                  <li className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-600">
                    No reminders yet. Add one below to get started.
                  </li>
                ) : reminders.map((reminder) => (
                  <li key={reminder.id} className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <time className="w-14 shrink-0 font-bold text-[#2d6fd6]">{reminder.time}</time>
                    <span className={`min-w-0 flex-1 text-sm font-semibold ${reminder.enabled ? "text-slate-800" : "text-slate-400 line-through"}`}>{reminder.text}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={reminder.enabled}
                      aria-label={`${reminder.enabled ? "Disable" : "Enable"} reminder: ${reminder.text}`}
                      onClick={() => setReminders((current) => current.map((item) => item.id === reminder.id ? { ...item, enabled: !item.enabled } : item))}
                      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${reminder.enabled ? "bg-[#2d6fd6]" : "bg-slate-300"}`}
                    >
                      <span className={`absolute left-1 top-1 size-4 rounded-full bg-white transition-transform ${reminder.enabled ? "translate-x-4" : ""}`} />
                    </button>
                  </li>
                ))}
              </ul>

              <form onSubmit={addReminder} className="mt-4 border-t border-slate-100 pt-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-800">Add a reminder</h3>
                <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
                  <label className="text-xs font-semibold text-slate-600">
                    Time
                    <input aria-label="Reminder time" name="time" type="time" required className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm" />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    Reminder
                    <input aria-label="Reminder message" name="text" type="text" required onInput={(event) => event.currentTarget.setCustomValidity("")} placeholder="e.g. Take a short break" className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm" />
                  </label>
                </div>
                <button type="submit" className="mt-3 h-11 w-full rounded-xl bg-[#2d6fd6] text-sm font-bold text-white shadow-[0_3px_0_#1e4fa3] hover:bg-[#235fb8]">
                  Add reminder
                </button>
              </form>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default Settings;
