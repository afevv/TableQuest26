import { STAGE_XP } from "../data/questSettings";

// Turns stages into path units: the stage's quests, then a trophy.
export function buildQuestPath(kind, stages) {
  return stages.map(({ id, name, emoji, quests }, index) => ({
    id,
    emoji,
    title: `Stage ${index + 1} · ${name}`,
    nodes: [
      ...quests.map((quest) => ({ ...quest, kind, xpReward: STAGE_XP[index] })),
      {
        id: `${kind}-${id}-trophy`,
        kind: "trophy",
        label: `${name} trophy`,
        description: `You finished the ${name} stage.`,
        guideSteps: ["Claim the trophy to complete this stage."],
        duration: "Milestone",
      },
    ],
  }));
}
