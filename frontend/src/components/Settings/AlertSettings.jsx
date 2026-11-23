import { useEffect, useState } from "react";
import { ALARM_MINUTES } from "../../data/questSettings";
import { useSavedState } from "../../hooks/useSavedState";
import ToggleSwitch from "../ToggleSwitch";
import Counter from "./Counter";
import SettingsCard from "./SettingsCard";

const ALERT_MODES = [
  {
    // Sound only: activate the Pico buzzer for each scheduled quest alert.
    mode: "sound",
    title: "Sound only",
    subtitle: "For people who can’t watch the LED",
    iconPath: "M11 5 6 9H3v6h3l5 4V5ZM15 9a5 5 0 010 6M17.5 6.5a9 9 0 010 11",
  },
  {
    // Light only: activate the Pico LED; obey the steadyLight preference below.
    mode: "light",
    title: "Light only",
    subtitle: "For hearing loss or quiet offices",
    iconPath:
      "M9 18h6M10 21h4M8.5 14.5a7 7 0 117 0c-.8.6-1.2 1.4-1.3 2.5h-4.4c-.1-1.1-.5-1.9-1.3-2.5Z",
  },
  {
    // Both: activate the buzzer and LED together for the same alert.
    mode: "both",
    title: "Both",
    subtitle: "Sound and light together",
    iconPath:
      "M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42M15 12a3 3 0 11-6 0 3 3 0 016 0Z",
  },
];

// Saved as plain text (not JSON) because the alarm and the Pico read it directly.
function getSavedAlertMode() {
  const saved = localStorage.getItem("tablequest-alert-mode");
  return ALERT_MODES.some(({ mode }) => mode === saved) ? saved : "both";
}

// Pico mapping: the desk listens for these events.
function sendToPico(name, detail) {
  window.dispatchEvent(new CustomEvent(`tablequest:${name}`, { detail }));
}

function AlertModeCard({ mode, title, subtitle, iconPath, isSelected, onSelect }) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      data-alert-mode={mode}
      onClick={() => onSelect(mode)}
      className={`flex min-h-[132px] flex-col items-start rounded-2xl border-2 p-5 text-left transition-colors last:col-span-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6fd6] ${
        isSelected
          ? "border-[#2d6fd6] bg-[#edf5ff] shadow-[0_4px_0_#2d6fd6]"
          : "border-slate-200 bg-white shadow-[0_4px_0_#e2e8f0] hover:border-slate-300"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`mb-2 size-7 fill-none stroke-current stroke-[2] ${isSelected ? "text-[#2d6fd6]" : "text-slate-500"}`}
      >
        <path d={iconPath} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[16px] font-black">{title}</span>
      <span className="mt-1 text-[13px] leading-relaxed text-[#46536a]">{subtitle}</span>
    </button>
  );
}

function QuestOutput({ title, text }) {
  return (
    <div>
      <h3 className="text-[13px] font-black">{title}</h3>
      <p className="mt-4 text-[13px] text-[#46536a]">{text}</p>
    </div>
  );
}

function AlertSettings({ questInterval, setQuestInterval }) {
  const [alertMode, setAlertMode] = useState(getSavedAlertMode);
  // When enabled, the Pico should keep the LED steady during light alerts instead of flashing.
  const [steadyLight, setSteadyLight] = useSavedState("tablequest-steady-light", true);

  useEffect(() => {
    localStorage.setItem("tablequest-alert-mode", alertMode);
    sendToPico("alert-mode-change", { mode: alertMode });
  }, [alertMode]);

  useEffect(() => {
    sendToPico("steady-light-change", { enabled: steadyLight });
  }, [steadyLight]);

  return (
    <SettingsCard title="How your desk alerts you">
      <p className="mt-2 text-[13px] text-[#46536a]">
        Alerts start after your first hour of work and stop by themselves after a few seconds.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {ALERT_MODES.map((option) => (
          <AlertModeCard
            key={option.mode}
            {...option}
            isSelected={alertMode === option.mode}
            onSelect={setAlertMode}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-semibold">Steady light, no flashing</h3>
          <p className="mt-1 text-[13px] text-[#46536a]">
            Recommended if you have epilepsy or are sensitive to light.
          </p>
        </div>
        <ToggleSwitch
          checked={steadyLight}
          label="Steady light, no flashing"
          onChange={setSteadyLight}
          color="#2d6fd6"
        />
      </div>

      <div className="mt-6 grid grid-cols-[1fr_1fr_1.15fr] gap-5 border-t border-slate-200 pt-5">
        <Counter
          title="Quest alert every"
          name="quest interval"
          unit="min"
          value={questInterval}
          onChange={setQuestInterval}
          step={ALARM_MINUTES.step}
          min={ALARM_MINUTES.min}
          max={ALARM_MINUTES.max}
        />
        <QuestOutput title="Physical quests" text="Sound 1 · blue LED pulse" />
        <QuestOutput title="Social quests" text="Sound 2 · orange LED pulse" />
      </div>
    </SettingsCard>
  );
}

export default AlertSettings;
