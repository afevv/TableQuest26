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
  const clipId = `water-glass-interior-${index}`;
  const fillHeight = 28 * (fillPercent / 100);

  return (
    <svg
      aria-hidden="true"
      height="40"
      viewBox="0 0 32 40"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M6 5h20l-3 27q-7 3-14 0L6 5Z" />
        </clipPath>
      </defs>
      <rect
        clipPath={`url(#${clipId})`}
        fill="#fca5a5"
        height={fillHeight}
        style={{ transition: "y 350ms ease, height 350ms ease" }}
        width="22"
        x="5"
        y={33 - fillHeight}
      />
      <path
        d="M5 4h22l-3 29q-8 4-16 0L5 4Z"
        fill="none"
        stroke="#dc2626"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M5 6h22"
        fill="none"
        stroke="#dc2626"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CustomReminders() {
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
      {
        id: Date.now(),
        time: fields.get("time"),
        text,
        enabled: true,
      },
    ]);
    form.reset();
  }

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-10 text-slate-800">
      <div className="max-w-2xl space-y-4">
        <header className="pb-1">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#dc2626]">
            Daily routine
          </p>
        </header>

        <section
          aria-label="Today's reminder schedule"
          style={{
            backgroundColor: "#dc2626",
            borderRadius: "16px",
            padding: "20px 24px",
          }}
          className="rounded-2xl p-5 text-white shadow-lg shadow-red-200"
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-100">
            Today's schedule
          </p>
          <p className="mt-2 text-xl font-bold">Your desk reminds you</p>
          <div
            style={{
              display: "grid",
              gap: "12px",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "10px 12px",
              }}
            >
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "32px",
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                {waterReminderCount}
              </p>
              <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: 600 }}>
                {waterReminderCount === 1 ? "reminder today" : "reminders today"}
              </p>
            </div>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "10px 12px",
              }}
            >
              <p style={{ alignItems: "baseline", display: "flex", gap: "5px" }}>
                <span
                  style={{
                    color: "#dc2626",
                    fontSize: "32px",
                    fontWeight: 800,
                    lineHeight: 1.1,
                  }}
                >
                  {reminderInterval}
                </span>
                <span style={{ color: "#b91c1c", fontSize: "14px", fontWeight: 700 }}>
                  min
                </span>
              </p>
              <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: 600 }}>
                between reminders
              </p>
            </div>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "10px 12px",
              }}
            >
              <p style={{ alignItems: "baseline", display: "flex", gap: "5px" }}>
                <span
                  style={{
                    color: "#dc2626",
                    fontSize: "32px",
                    fontWeight: 800,
                    lineHeight: 1.1,
                  }}
                >
                  {shiftHours}
                </span>
                <span style={{ color: "#b91c1c", fontSize: "14px", fontWeight: 700 }}>
                  hr
                </span>
              </p>
              <p style={{ color: "#7f1d1d", fontSize: "12px", fontWeight: 600 }}>
                shift length
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="water-heading"
          style={{
            backgroundColor: "#dc2626",
            borderRadius: "16px",
            marginTop: "16px",
            padding: "20px 24px",
          }}
          className="rounded-2xl text-white shadow-lg shadow-red-200"
        >
          <h2 id="water-heading" className="text-lg font-bold text-white">
            Water schedule
          </h2>
          <div style={{ marginTop: "16px" }}>
            <div
              style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "12px" }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  justifyContent: "space-between",
                }}
              >
                <h3 style={{ color: "#334155", fontSize: "14px", fontWeight: 600 }}>
                  Daily goal
                </h3>
                <div style={{ alignItems: "center", display: "flex", gap: "8px" }}>
                  <CounterButton
                    label="Decrease daily water goal"
                    onClick={() => setDailyGoal((goal) => Math.max(100, goal - 100))}
                  >
                    −
                  </CounterButton>
                  <span style={{ color: "#0f172a", fontSize: "14px", fontWeight: 700 }}>
                    {dailyGoal} ml
                  </span>
                  <CounterButton
                    label="Increase daily water goal"
                    onClick={() => setDailyGoal((goal) => goal + 100)}
                  >
                    +
                  </CounterButton>
                </div>
              </div>
              <div
                role="img"
                aria-label={`Daily goal represented by ${fullGlasses} full 300 ml glasses${partialGlassMl ? ` and one partial glass with ${partialGlassMl} ml` : ""}`}
                style={{
                  alignItems: "flex-end",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginTop: "14px",
                }}
              >
                {Array.from({ length: glassCount }, (_, index) => {
                  const glassMl = Math.min(300, dailyGoal - index * 300);
                  return (
                    <WaterGlass
                      key={index}
                      index={index}
                      fillPercent={(glassMl / 300) * 100}
                    />
                  );
                })}
              </div>
              <p style={{ color: "#64748b", fontSize: "11px", marginTop: "8px" }}>
                {glassSummary} · 300 ml per glass
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                marginTop: "12px",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: "96px",
                  padding: "12px",
                }}
              >
                <h3 style={{ color: "#334155", fontSize: "14px", fontWeight: 600 }}>
                  Per reminder
                </h3>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    gap: "12px",
                    marginTop: "8px",
                  }}
                >
                  <CounterButton
                    label="Decrease water per reminder"
                    onClick={() =>
                      setPerReminder((amount) => Math.max(50, amount - 50))
                    }
                  >
                    −
                  </CounterButton>
                  <span
                    style={{ color: "#0f172a" }}
                    className="text-base font-bold text-slate-900"
                  >
                    {perReminder} ml
                  </span>
                  <CounterButton
                    label="Increase water per reminder"
                    onClick={() => setPerReminder((amount) => amount + 50)}
                  >
                    +
                  </CounterButton>
                </div>
              </div>
              <label
                style={{
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  color: "#334155",
                  display: "flex",
                  justifyContent: "space-between",
                  minHeight: "96px",
                  padding: "12px",
                }}
              >
                <span>Daily shift length</span>
                <span style={{ alignItems: "center", display: "flex", gap: "8px" }}>
                  <input
                    aria-label="Daily shift length in hours"
                    type="number"
                    min="1"
                    max="16"
                    step="0.5"
                    value={shiftHours}
                    onChange={(event) =>
                      setShiftHours(
                        Math.min(16, Math.max(1, Number(event.target.value) || 1)),
                      )
                    }
                    className="h-9 w-20 rounded-lg border border-red-200 bg-white px-2 text-center text-sm focus:border-[#dc2626] focus:outline-none focus:ring-2 focus:ring-red-100"
                    style={{ color: "#0f172a" }}
                  />
                  hours
                </span>
              </label>
            </div>
          </div>

          {(highPerReminder || highHourlyIntake) && (
            <div
              role="alert"
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                color: "#7f1d1d",
                marginTop: "12px",
                padding: "12px",
              }}
              className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-950"
            >
              <p className="font-bold">High planned water intake</p>
              <p className="mt-1">
                {highPerReminder && (
                  <>Each reminder is {perReminder} ml. </>
                )}
                {highHourlyIntake && (
                  <>
                    The plan averages {Math.round(plannedHourlyIntake)} ml per
                    hour over your {shiftHours}-hour shift.{" "}
                  </>
                )}
                The National Academies estimates maximum kidney water excretion
                at about 0.7–1.0 L per hour; drinking large amounts rapidly can
                cause water toxicity. Consider smaller amounts or a lower
                hourly rate. Needs vary, and this is not a personal medical
                limit.
              </p>
              <p className="mt-2">
                Sources:{" "}
                <a
                  href="https://nap.nationalacademies.org/read/10925/chapter/6"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#dc2626] underline"
                >
                  National Academies
                </a>
                {" · "}
                <a
                  href="https://www.cdc.gov/niosh/heat-stress/recommendations/index.html"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#dc2626] underline"
                >
                  NIOSH workplace hydration guidance
                </a>
              </p>
            </div>
          )}
        </section>

        <section
          aria-labelledby="my-reminders-heading"
          style={{
            backgroundColor: "#dc2626",
            borderRadius: "16px",
            marginTop: "16px",
            padding: "20px 24px",
          }}
          className="rounded-2xl text-white shadow-lg shadow-red-200"
        >
          <h2 id="my-reminders-heading" className="text-lg font-bold text-white">
            My reminders
          </h2>

          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              marginTop: "16px",
              padding: "16px",
            }}
            className="rounded-xl p-4"
          >
          <ul className="space-y-2">
            {reminders.length === 0 ? (
              <li className="rounded-xl border border-dashed border-red-200 bg-red-50/60 px-4 py-5 text-center text-sm text-slate-600">
                <span style={{ color: "#475569" }}>
                No reminders yet. Add one below to get started.
                </span>
              </li>
            ) : (
              reminders.map((reminder) => (
              <li
                key={reminder.id}
                className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <time
                  style={{ color: "#dc2626" }}
                  className="w-14 shrink-0 font-bold text-[#dc2626]"
                >
                  {reminder.time}
                </time>
                <span
                  style={{
                    color: reminder.enabled ? "#1f2937" : "#94a3b8",
                  }}
                  className={`min-w-0 flex-1 text-sm font-semibold ${
                    reminder.enabled ? "" : "text-slate-400 line-through"
                  }`}
                >
                  {reminder.text}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reminder.enabled}
                  aria-label={`${reminder.enabled ? "Disable" : "Enable"} reminder: ${reminder.text}`}
                  onClick={() =>
                    setReminders((current) =>
                      current.map((item) =>
                        item.id === reminder.id
                          ? { ...item, enabled: !item.enabled }
                          : item,
                      ),
                    )
                  }
                  className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
                    reminder.enabled ? "bg-[#dc2626]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 size-4 rounded-full bg-white transition-transform ${
                      reminder.enabled ? "translate-x-4" : ""
                    }`}
                  />
                </button>
              </li>
              ))
            )}
          </ul>

          <form onSubmit={addReminder} className="mt-4 border-t border-slate-100 pt-4">
            <h3
              style={{ color: "#1f2937" }}
              className="mb-3 text-sm font-semibold text-slate-800"
            >
              Add a reminder
            </h3>
            <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
              <label
                style={{ color: "#475569" }}
                className="text-xs font-semibold text-slate-600"
              >
                Time
                <input
                  aria-label="Reminder time"
                  name="time"
                  type="time"
                  required
                  className="mt-1 h-10 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-[#dc2626] focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </label>
              <label
                style={{ color: "#475569" }}
                className="text-xs font-semibold text-slate-600"
              >
                Reminder
                <input
                  aria-label="Reminder message"
                  name="text"
                  type="text"
                  required
                  onInput={(event) => event.currentTarget.setCustomValidity("")}
                  placeholder="e.g. Take a short break"
                  className="mt-1 h-10 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-[#dc2626] focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </label>
            </div>
            <button
              type="submit"
              style={{ backgroundColor: "#dc2626", height: 44 }}
              className="mt-3 flex w-full items-center justify-center rounded-xl px-4 text-sm font-bold text-white shadow-[0_3px_0_#991b1b] transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]"
            >
              Add reminder
            </button>
          </form>
          </div>
        </section>
      </div>
    </section>
  );
}

export default CustomReminders;
