import { getLevelFromXp } from "../utils/getLevelFromXp";
import { useQuestAlarm } from "./useQuestAlarm";
import { useSavedState } from "./useSavedState";

// All the progress logic for one path. Quests are done in order,
// so the next node is simply the first one that is not completed.
export function useQuestProgress(data, alarmMinutes) {
  const nodes = data.units.flatMap((unit) => unit.nodes);
  const [completedIds, setCompletedIds] = useSavedState(`${data.id}-completed`, []);
  const [totalXp, setTotalXp] = useSavedState(`${data.id}-xp`, () =>
    nodes
      .filter((node) => completedIds.includes(node.id))
      .reduce((sum, node) => sum + (node.xpReward ?? 0), 0)
  );

  const nextNode = nodes.find((node) => !completedIds.includes(node.id));
  const alarm = useQuestAlarm(data, alarmMinutes, Boolean(nextNode));

  // A quest waits for the alarm. A trophy can always be claimed.
  const isTrophy = nextNode?.kind === "trophy";
  const isUnlocked = isTrophy || alarm.hasRung;

  function addXp(amount) {
    setTotalXp(totalXp + amount);
  }

  function completeNext() {
    if (!nextNode || !isUnlocked) return;
    setCompletedIds([...completedIds, nextNode.id]);
    if (isTrophy) return;
    addXp(nextNode.xpReward);
    alarm.restart();
  }

  return {
    data,
    nodes,
    nextNode,
    isUnlocked,
    completedIds,
    alarm,
    progress: getLevelFromXp(totalXp),
    addXp,
    completeNext,
  };
}
