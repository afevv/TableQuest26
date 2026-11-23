import { LEVEL_XP } from "../data/questSettings";

// Levels after the list ends cost the same as the last one.
const getNeededXp = (level) => LEVEL_XP[level - 1] ?? LEVEL_XP.at(-1);

// Turns a total amount of XP into a level and the XP inside that level.
export function getLevelFromXp(totalXp) {
  let level = 1;
  let xp = totalXp;

  while (xp >= getNeededXp(level)) {
    xp -= getNeededXp(level);
    level += 1;
  }

  return { level, xp, needed: getNeededXp(level) };
}
