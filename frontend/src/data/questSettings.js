// Change the numbers here to tune quests, levels and alarms.

// XP per quest, one number for each stage.
export const STAGE_XP = [25, 35, 45, 60, 75];

// XP needed to leave each level: two quests per level,
// except the last level, which takes the whole last stage (four quests).
export const LEVEL_XP = [50, 50, 70, 70, 90, 90, 120, 120, 300];

// XP given by the "Add XP" test button.
export const TEST_XP = 25;

// Minutes between alarms until the player changes it in Settings.
export const ALARM_MINUTES = { start: 45, min: 5, max: 120, step: 5 };

// Seconds the alarm message stays on screen.
export const ALARM_MESSAGE_SECONDS = 10;

// Pitch of each alarm in hertz: Sound 1 for physical quests, Sound 2 for social.
export const ALARM_SOUNDS = { exercise: 660, social: 440 };
