import { ALARM_SOUNDS } from "../data/questSettings";

export function ringQuestAlarm(kind) {
  // Pico mapping: listen for this event to ring the desk's own alarm.
  window.dispatchEvent(new CustomEvent("tablequest:quest-alarm", { detail: { kind } }));

  try {
    if (localStorage.getItem("tablequest-alert-mode") === "light") return;

    const audio = new AudioContext();
    const tone = audio.createOscillator();
    const volume = audio.createGain();
    tone.frequency.value = ALARM_SOUNDS[kind];
    volume.gain.value = 0.1;
    tone.connect(volume).connect(audio.destination);
    tone.onended = () => audio.close();
    tone.start();
    tone.stop(audio.currentTime + 0.6);
  } catch {
    // Sound is unavailable; the message on screen still shows.
  }
}
