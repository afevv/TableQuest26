const BASE_XP_PER_LEVEL = 100;

export function getXpThreshold(level) {
  return level * BASE_XP_PER_LEVEL;
}

export function addExperience(progress, amount) {
  let level = progress.level;
  let xp = progress.xp + amount;
  let threshold = getXpThreshold(level);

  while (xp >= threshold) {
    xp -= threshold;
    level += 1;
    threshold = getXpThreshold(level);
  }

  return { level, xp };
}

export function getLevelTitle(level, levels) {
  return (
    levels?.find((entity) => Number(entity.number) === level)?.title ??
    `Level ${level} Adventurer`
  );
}
