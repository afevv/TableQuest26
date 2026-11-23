import { useEffect, useState } from "react";
import { ringQuestAlarm } from "../utils/ringQuestAlarm";
import { useSavedState } from "./useSavedState";

const newAlarm = () => ({ startedAt: Date.now(), hasRung: false });

// Rings once, a number of minutes after it was started.
export function useQuestAlarm({ id, kind }, minutes, isActive) {
  const [alarm, setAlarm] = useSavedState(`${id}-alarm`, newAlarm);
  const [isRinging, setIsRinging] = useState(false);
  const { startedAt, hasRung } = alarm;
  const ringsAt = startedAt + minutes * 60_000;

  useEffect(() => {
    if (!isActive || hasRung) return undefined;

    const timer = setTimeout(() => {
      ringQuestAlarm(kind);
      setIsRinging(true);
      setAlarm({ startedAt, hasRung: true });
    }, Math.max(0, ringsAt - Date.now()));

    return () => clearTimeout(timer);
  }, [isActive, hasRung, startedAt, ringsAt, kind, setAlarm]);

  function restart() {
    setIsRinging(false);
    setAlarm(newAlarm());
  }

  return {
    hasRung,
    ringsAt,
    isRinging,
    restart,
    silence: () => setIsRinging(false),
    ringNow: () => setAlarm({ startedAt: 0, hasRung: false }),
  };
}
