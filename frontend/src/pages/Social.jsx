import QuestPath from "../components/QuestPath/QuestPath";
import { SOCIAL_PAGE_DATA as data } from "../data/socialPage";

function getButtonText(node, isUnlocked) {
  if (!isUnlocked) return "Waiting for the alarm";
  return node.kind === "trophy" ? "Claim stage trophy" : `I did it · +${node.xpReward} XP`;
}

function DailyQuest({ quests: { nextNode, isUnlocked, completeNext } }) {
  return (
    <section className="rounded-2xl border border-[#f1c38f] bg-[#fff6ec] p-4 text-[#19253a] shadow-md">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-(--accent-dark)">
        Today&apos;s social quest
      </p>
      <h2 className="mb-3 mt-2 text-sm font-extrabold">{nextNode?.label ?? "All done"}</h2>
      {nextNode && (
        <button
          type="button"
          disabled={!isUnlocked}
          onClick={completeNext}
          className="quest-button"
        >
          {getButtonText(nextNode, isUnlocked)}
        </button>
      )}
    </section>
  );
}

function PeopleThisWeek() {
  const bubble =
    "-ml-1 grid size-7 place-items-center rounded-full border-2 border-white text-[9px] font-extrabold text-white first:ml-0";

  return (
    <section className="rounded-2xl border border-[#d8dee8] bg-white p-4 text-[#19253a] shadow-md">
      <h2 className="text-xs font-extrabold">People you talked to this week</h2>
      <div className="mt-3 flex">
        {data.people.map(({ initials, name, color }) => (
          <span key={initials} title={name} className={bubble} style={{ backgroundColor: color }}>
            {initials}
          </span>
        ))}
        <span className={`${bubble} bg-[#9aa4b2]`}>+{data.morePeopleCount}</span>
      </div>
      <p className="mt-2 text-[10px] font-medium text-[#68758a]">
        {data.peopleCount} colleagues · {data.weeklyDifference} more than last week
      </p>
    </section>
  );
}

function Social({ quests }) {
  return (
    <QuestPath quests={quests}>
      <DailyQuest quests={quests} />
      <PeopleThisWeek />
    </QuestPath>
  );
}

export default Social;
