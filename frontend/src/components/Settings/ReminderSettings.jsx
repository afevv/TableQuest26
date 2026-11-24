import { useSavedState } from "../../hooks/useSavedState";
import ToggleSwitch from "../ToggleSwitch";
import SettingsCard from "./SettingsCard";

const FIELD_CLASS = "mt-1 h-10 w-full rounded-xl border border-white/10 bg-[#171717] px-3 text-sm text-white [color-scheme:dark] placeholder:text-slate-500";

function ReminderItem({ reminder: { time, text, enabled }, onToggle }) {
  return (
    <li className="flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-[#171717] px-3 py-2">
      <time className="w-14 shrink-0 font-bold text-[#60a5fa]">{time}</time>
      <span
        className={`min-w-0 flex-1 text-sm font-semibold ${enabled ? "text-slate-100" : "text-slate-500 line-through"}`}
      >
        {text}
      </span>
      <ToggleSwitch
        checked={enabled}
        label={`${enabled ? "Disable" : "Enable"} reminder: ${text}`}
        onChange={onToggle}
        color="#2d6fd6"
      />
    </li>
  );
}

function ReminderSettings() {
  // Pico OLED mapping: display each enabled reminder's custom text at its scheduled time.
  const [reminders, setReminders] = useSavedState("tablequest-reminders", [], (saved) =>
    Array.isArray(saved) ? saved : []
  );

  function addReminder(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const { time, text } = Object.fromEntries(new FormData(form));

    if (!text.trim()) {
      form.elements.text.setCustomValidity("Please enter a reminder message.");
      form.elements.text.reportValidity();
      return;
    }

    setReminders([...reminders, { id: Date.now(), time, text: text.trim(), enabled: true }]);
    form.reset();
  }

  function toggleReminder(id) {
    setReminders(
      reminders.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  }

  return (
    <SettingsCard title="My reminders">
      <ul className="mt-4 space-y-2">
        {reminders.length === 0 && (
          <li className="rounded-xl border border-dashed border-white/15 bg-[#171717] px-4 py-5 text-center text-sm text-slate-400">
            No reminders yet. Add one below to get started.
          </li>
        )}
        {reminders.map((reminder) => (
          <ReminderItem
            key={reminder.id}
            reminder={reminder}
            onToggle={() => toggleReminder(reminder.id)}
          />
        ))}
      </ul>

      <form onSubmit={addReminder} className="mt-4 border-t border-white/10 pt-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-100">Add a reminder</h3>
        <div className="grid gap-3 text-xs font-semibold text-slate-400 sm:grid-cols-[180px_minmax(0,1fr)]">
          <label>
            Time
            <input
              aria-label="Reminder time"
              name="time"
              type="time"
              required
              className={FIELD_CLASS}
            />
          </label>
          <label>
            Reminder
            <input
              aria-label="Reminder message"
              name="text"
              type="text"
              required
              onInput={(event) => event.currentTarget.setCustomValidity("")}
              placeholder="e.g. Take a short break"
              className={FIELD_CLASS}
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-3 h-11 w-full rounded-xl bg-[#2d6fd6] text-sm font-bold text-white shadow-[0_3px_0_#1e4fa3] hover:bg-[#235fb8]"
        >
          Add reminder
        </button>
      </form>
    </SettingsCard>
  );
}

export default ReminderSettings;
