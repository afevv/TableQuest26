import { useState } from "react";

function CounterButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-xl border border-red-200 bg-white text-lg font-bold text-[#dc2626] transition-colors hover:border-red-300 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]"
    >
      {children}
    </button>
  );
}

function WaterGlass({ fillPercent, index }) {
  const fillHeight = 28 * (fillPercent / 100);
  const clipId = `water-glass-interior-${index}`;

  return (
    <svg aria-hidden="true" height="40" viewBox="0 0 32 40" width="32">
      <defs>
        <clipPath id={clipId}>
          <path d="M6 5h20l-3 27q-7 3-14 0L6 5Z" />
        </clipPath>
      </defs>
      <rect
        clipPath={`url(#${clipId})`}
        fill="#fca5a5"
        height={fillHeight}
        width="22"
        x="5"
        y={33 - fillHeight}
      />
      <path d="M5 4h22l-3 29q-8 4-16 0L5 4Z" fill="none" stroke="#dc2626" strokeWidth="2" />
      <path d="M5 6h22" fill="none" stroke="#dc2626" strokeWidth="2" />
    </svg>
  );
}

function Settings() {
  const [dailyGoal, setDailyGoal] = useState(2500);
  const [perReminder, setPerReminder] = useState(350);
  const [shiftHours, setShiftHours] = useState(7);
  const [reminders, setReminders] = useState([]);

  const waterReminderCount = Math.ceil(dailyGoal / perReminder);
  const reminderInterval = Math.round((shiftHours * 60) / waterReminderCount);
  const plannedHourlyIntake = (waterReminderCount * perReminder) / shiftHours;
  const highPerReminder = perReminder > 1000;
  const highHourlyIntake = plannedHourlyIntake > 1000;
  const glassCount = Math.ceil(dailyGoal / 300);
  const fullGlasses = Math.floor(dailyGoal / 300);
  const partialGlassMl = dailyGoal % 300;
  const glassSummary =
    partialGlassMl === 0
      ? `${glassCount} full glasses`
      : fullGlasses === 0
        ? `${dailyGoal} ml in 1 glass`
        : `${fullGlasses} full + ${partialGlassMl} ml in a partial glass`;

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

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-10 text-slate-800">
      <div className="max-w-2xl space-y-4">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#dc2626]">
            Settings
          </p>
          <h1 className="mt-1 text-3xl font-bold">Reminders</h1>
        </header>

        <section className="rounded-2xl bg-[#dc2626] p-5 text-white shadow-lg shadow-red-200">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-100">
            Today's schedule
          </p>
          <p className="mt-2 text-xl font-bold">Your desk reminds you</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              [waterReminderCount, waterReminderCount === 1 ? "reminder today" : "reminders today", ""],
              [reminderInterval, "between reminders", "min"],
              [shiftHours, "shift length", "hr"],
            ].map(([value, label, unit]) => (
              <div key={label} className="rounded-xl bg-white p-3">
                <p className="text-3xl font-extrabold leading-none text-[#dc2626]">
                  {value} {unit && <span className="text-sm">{unit}</span>}
                </p>
                <p className="mt-1 text-xs font-semibold text-red-950">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="water-heading" className="rounded-2xl bg-[#dc2626] p-5 text-white shadow-lg shadow-red-200">
          <h2 id="water-heading" className="text-lg font-bold">Water schedule</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-700">Daily goal</h3>
                <div className="flex items-center gap-2">
                  <CounterButton label="Decrease daily water goal" onClick={() => setDailyGoal((goal) => Math.max(100, goal - 100))}>−</CounterButton>
                  <span className="text-sm font-bold text-slate-900">{dailyGoal} ml</span>
                  <CounterButton label="Increase daily water goal" onClick={() => setDailyGoal((goal) => goal + 100)}>+</CounterButton>
                </div>
              </div>
              <div role="img" aria-label={`Daily goal represented by ${fullGlasses} full 300 ml glasses${partialGlassMl ? ` and one partial glass with ${partialGlassMl} ml` : ""}`} className="mt-3 flex flex-wrap items-end gap-1.5">
                {Array.from({ length: glassCount }, (_, index) => {
                  const glassMl = Math.min(300, dailyGoal - index * 300);
                  return <WaterGlass key={index} index={index} fillPercent={(glassMl / 300) * 100} />;
                })}
              </div>
              <p className="mt-2 text-xs text-slate-500">{glassSummary} · 300 ml per glass</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex min-h-24 flex-col items-center justify-center rounded-xl bg-white p-3">
                <h3 className="text-sm font-semibold text-slate-700">Per reminder</h3>
                <div className="mt-2 flex items-center gap-3">
                  <CounterButton label="Decrease water per reminder" onClick={() => setPerReminder((amount) => Math.max(50, amount - 50))}>−</CounterButton>
                  <span className="text-base font-bold text-slate-900">{perReminder} ml</span>
                  <CounterButton label="Increase water per reminder" onClick={() => setPerReminder((amount) => amount + 50)}>+</CounterButton>
                </div>
              </div>
              <label className="flex min-h-24 items-center justify-between rounded-xl bg-white px-3 text-sm font-semibold text-slate-700">
                <span>Daily shift length</span>
                <span className="flex items-center gap-2">
                  <input
                    aria-label="Daily shift length in hours"
                    type="number"
                    min="1"
                    max="16"
                    step="0.5"
                    value={shiftHours}
                    onChange={(event) => setShiftHours(Math.min(16, Math.max(1, Number(event.target.value) || 1)))}
                    className="h-9 w-20 rounded-lg border border-red-200 px-2 text-center text-sm text-slate-900"
                  />
                  hours
                </span>
              </label>
            </div>
          </div>

          {(highPerReminder || highHourlyIntake) && (
            <div role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-950">
              <p className="font-bold">High planned water intake</p>
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

        <section aria-labelledby="my-reminders-heading" className="rounded-2xl bg-[#dc2626] p-5 text-white shadow-lg shadow-red-200">
          <h2 id="my-reminders-heading" className="text-lg font-bold">My reminders</h2>
          <div className="mt-4 rounded-xl bg-white p-4">
            <ul className="space-y-2">
              {reminders.length === 0 ? (
                <li className="rounded-xl border border-dashed border-red-200 bg-red-50/60 px-4 py-5 text-center text-sm text-slate-600">
                  No reminders yet. Add one below to get started.
                </li>
              ) : reminders.map((reminder) => (
                <li key={reminder.id} className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <time className="w-14 shrink-0 font-bold text-[#dc2626]">{reminder.time}</time>
                  <span className={`min-w-0 flex-1 text-sm font-semibold ${reminder.enabled ? "text-slate-800" : "text-slate-400 line-through"}`}>{reminder.text}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={reminder.enabled}
                    aria-label={`${reminder.enabled ? "Disable" : "Enable"} reminder: ${reminder.text}`}
                    onClick={() => setReminders((current) => current.map((item) => item.id === reminder.id ? { ...item, enabled: !item.enabled } : item))}
                    className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${reminder.enabled ? "bg-[#dc2626]" : "bg-slate-300"}`}
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
              <button type="submit" className="mt-3 h-11 w-full rounded-xl bg-[#dc2626] text-sm font-bold text-white shadow-[0_3px_0_#991b1b] hover:bg-red-700">
                Add reminder
              </button>
            </form>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Settings;
