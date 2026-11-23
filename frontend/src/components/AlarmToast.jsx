import { useEffect } from "react";
import { Link } from "react-router";
import { ALARM_MESSAGE_SECONDS } from "../data/questSettings";

// The message shown on any page when a quest alarm rings.
function AlarmToast({ quests: { data, alarm } }) {
  const { silence } = alarm;

  useEffect(() => {
    const timer = setTimeout(silence, ALARM_MESSAGE_SECONDS * 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div
      role="alert"
      className={`${data.theme} rounded-xl bg-(--accent) text-sm font-bold text-white shadow-xl`}
    >
      <Link
        to={`/home?mode=${data.kind}`}
        onClick={silence}
        className="block px-5 py-3"
      >
        ⏰ Time for your {data.kind} quest!
      </Link>
    </div>
  );
}

export default AlarmToast;
