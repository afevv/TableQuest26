import nodeCheck from "../../assets/icons/node-check.svg";
import nodeLock from "../../assets/icons/node-lock.svg";
import nodeStar from "../../assets/icons/node-star.svg";
import nodeTrophy from "../../assets/icons/node-trophy.svg";

const OFFSETS = [0, -35, -60, -35, 0];

// status is "completed", "current" or "locked"
function QuestNode({ node, index, status, onSelect }) {
  const isLocked = status === "locked";
  const icons = {
    completed: nodeCheck,
    current: node.kind === "trophy" ? nodeTrophy : nodeStar,
    locked: nodeLock,
  };

  return (
    <li
      className="relative flex min-h-[94px] flex-col items-center text-center"
      style={{ transform: `translateX(${OFFSETS[index % OFFSETS.length]}px)` }}
    >
      {status === "current" && (
        <span className="absolute right-1/2 top-4 mr-10 rounded-lg bg-white px-3 py-1 text-[10px] font-black uppercase text-(--accent-dark) shadow">
          Start
        </span>
      )}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => onSelect(node.id)}
        aria-label={`${status} quest: ${node.label}`}
        className={`grid size-[58px] place-items-center rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
          isLocked
            ? "cursor-not-allowed bg-[#e7edf5] opacity-55"
            : "cursor-pointer bg-(--accent) ring-4 ring-(--accent)/35 hover:scale-105"
        }`}
      >
        <img
          src={icons[status]}
          alt=""
          className={`size-6 ${isLocked ? "opacity-70" : "brightness-0 invert"}`}
        />
      </button>
      <span className="mt-2 max-w-36 text-[11px] font-medium leading-tight text-[#8492a8]">
        {node.label}
      </span>
    </li>
  );
}

export default QuestNode;
