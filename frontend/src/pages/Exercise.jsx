import { useEffect, useState } from "react";
import PlayerLevelHud from "../components/PlayerLevelHud";
import Sidebar from "../components/Sidebar";
import guideBook from "../assets/icons/guide-book.svg";
import nodeCheck from "../assets/icons/node-check.svg";
import nodeChest from "../assets/icons/node-chest.svg";
import nodeLock from "../assets/icons/node-lock.svg";
import nodeStar from "../assets/icons/node-star.svg";
import nodeTrophy from "../assets/icons/node-trophy.svg";
import exerciseMascot from "../assets/illustrations/mascot-exercise.svg";
import creativeMascot from "../assets/illustrations/mascot-creative.svg";
import { CREATIVE_PAGE_DATA } from "../data/creativePage";
import { EXERCISE_PAGE_DATA } from "../data/exercisePage";
import {
  addExperience,
} from "../utils/progression";

const nodeIcons = {
  exercise: nodeStar,
  locked: nodeLock,
  reward: nodeChest,
  trophy: nodeTrophy,
};

function getQuestPositions(units) {
  let top = 0;
  const positions = [];

  units.forEach((unit) => {
    if (unit.showDivider) top += 46;

    unit.nodes.forEach((node) => {
      if (node.kind === "exercise") positions.push({ id: node.id, top });
      top += 94;
    });
  });

  return positions;
}

const XP_PER_CLICK = 25;

function QuestNode({ node, isSelected, isCompleted, isLocked, onSelect, accent }) {
  const icon = isLocked
    ? nodeIcons.locked
    : isCompleted && node.kind === "exercise"
      ? nodeCheck
      : nodeIcons[node.kind];
  const isHighlighted = isSelected || isCompleted;
  const activeColorClass =
    accent === "purple"
      ? "bg-[#6b4bd4] text-white ring-[#6b4bd4]/35 hover:scale-105 focus-visible:outline-[#6b4bd4]"
      : "bg-[#2e6fdb] text-white ring-[#2e6fdb]/35 hover:scale-105 focus-visible:outline-[#2e6fdb]";
  const isCreativeQuest =
    accent === "purple" && node.kind === "exercise" && !isLocked && !isCompleted && !isSelected;

  return (
    <li
      className="relative flex min-h-[94px] flex-col items-center text-center"
      style={{ transform: `translateX(${node.offset ?? 0}px)` }}
    >
      <button
        type="button"
        disabled={isLocked}
        onClick={() => onSelect(node)}
        aria-label={`${isLocked ? "Locked" : isCompleted ? "Completed" : "Open"} ${node.label} task details`}
        aria-expanded={isSelected}
        className={`grid size-[58px] place-items-center rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] transition ${
          isHighlighted
            ? `${activeColorClass} ring-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`
            : isLocked
              ? "cursor-not-allowed bg-[#e7edf5] text-[#93a1b5] opacity-55"
              : "cursor-pointer bg-[#e7edf5] text-[#93a1b5] hover:bg-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        }`}
      >
        {isCreativeQuest ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-6"
            fill="#6b4bd4"
          >
            <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />
          </svg>
        ) : (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className={`size-6 ${isHighlighted ? "brightness-0 invert" : "opacity-70"}`}
          />
        )}
      </button>
      <span className="mt-2 max-w-36 text-[11px] font-medium leading-tight text-[#8492a8]">
        {node.label}
      </span>
    </li>
  );
}

function ExercisePage({
  data = EXERCISE_PAGE_DATA,
  level = data.level.number,
  xp = 0,
  onStartExercise,
  onOpenGuide,
  onProgressChange,
  onCompleteQuest,
  accent = "blue",
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [testProgress, setTestProgress] = useState(null);
  const [levelUpCount, setLevelUpCount] = useState(0);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const progress =
    testProgress?.baseLevel === level && testProgress?.baseXp === xp
      ? testProgress
      : { level: Number(level), xp: Number(xp) };
  const theme =
    accent === "purple"
      ? {
          banner: "border-[#4c369e] bg-[#6b4bd4]",
          bannerText: "text-purple-100",
          guide: "border-white/60 text-white hover:bg-white/15 focus-visible:outline-white",
          accentText: "text-[#6b4bd4]",
          accentButton: "bg-[#6b4bd4] hover:bg-[#5b40bb] focus-visible:outline-[#6b4bd4]",
          accentSoft: "bg-[#f0ecfc] text-[#5b43ae]",
        }
      : {
          banner: "border-[#194fa8] bg-[#2e6fdb]",
          bannerText: "text-blue-100",
          guide: "border-white/60 text-white hover:bg-white/15 focus-visible:outline-white",
          accentText: "text-[#2163cd]",
          accentButton: "bg-[#2e6fdb] hover:bg-[#245fc3] focus-visible:outline-[#2e6fdb]",
          accentSoft: "bg-[#eef4ff] text-[#2163cd]",
        };
  const mascot = accent === "purple" ? creativeMascot : exerciseMascot;

  useEffect(() => {
    if (!isGuideOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsGuideOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isGuideOpen]);

  const addXp = (amount) => {
    const nextProgress = addExperience(progress, amount);
    setTestProgress({ ...nextProgress, baseLevel: level, baseXp: xp });
    if (nextProgress.level > progress.level) {
      setLevelUpCount((count) => count + 1);
    }
    onProgressChange?.(nextProgress);
  };

  const addTestXp = () => addXp(XP_PER_CLICK);

  const questPositions = getQuestPositions(data.units);
  const completedQuestCount = questPositions.filter(({ id }) =>
    completedTaskIds.includes(id)
  ).length;
  const mascotPosition =
    questPositions[Math.min(completedQuestCount, questPositions.length - 1)]?.top ?? 0;
  const selectedTaskCompleted =
    selectedTask && completedTaskIds.includes(selectedTask.id);
  const nextQuest = data.units
    .flatMap((unit) => unit.nodes)
    .find(
      (node) =>
        node.kind === "exercise" &&
        !completedTaskIds.includes(node.id) &&
        (!node.prerequisiteId || completedTaskIds.includes(node.prerequisiteId))
    );
  const currentQuest =
    selectedTask && !selectedTaskCompleted ? selectedTask : nextQuest;
  const currentQuestUnit = data.units.find((unit) =>
    unit.nodes.some((node) => node.id === currentQuest?.id)
  );
  const guideTask = currentQuest;

  const completeTask = (taskId) => {
    const task = data.units.flatMap((unit) => unit.nodes).find((node) => node.id === taskId);
    if (
      !task ||
      task.kind !== "exercise" ||
      completedTaskIds.includes(taskId) ||
      (task.prerequisiteId && !completedTaskIds.includes(task.prerequisiteId))
    ) {
      return;
    }
    if (!Number.isFinite(task.xpReward) || task.xpReward <= 0) {
      throw new Error(`Exercise quest "${task.id}" must define a positive xpReward.`);
    }

    setCompletedTaskIds((currentIds) => [...currentIds, taskId]);
    addXp(task.xpReward);
    onCompleteQuest?.(taskId, task.xpReward);
  };

  return (
    <section className="min-h-screen min-w-0 flex-1 bg-[#171717] px-5 py-5 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1160px]">
        <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className={`rounded-2xl border-b-4 p-5 shadow-lg sm:p-6 ${theme.banner}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className={`text-[11px] font-extrabold uppercase tracking-[0.14em] ${theme.bannerText}`}>
                  {currentQuest
                    ? `Current quest · ${currentQuestUnit?.title ?? data.lesson.eyebrow}`
                    : questPositions.length
                      ? "All quests complete"
                      : data.lesson.eyebrow}
                </p>
                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  {currentQuest?.label ?? data.lesson.title}
                </h1>
                <p className={`mt-2 text-sm leading-relaxed ${theme.bannerText}`}>
                  {currentQuest?.description ??
                    (questPositions.length
                      ? "You have completed every available quest."
                      : data.lesson.emptyMessage ?? "No quests are available.")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onOpenGuide?.(data.lesson.id, guideTask?.id);
                  setIsGuideOpen(true);
                }}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 ${theme.guide}`}
              >
                <img src={guideBook} alt="" aria-hidden="true" className="size-4 brightness-0 invert" />
                {data.lesson.guideLabel}
              </button>
            </div>
          </div>

          <PlayerLevelHud
            progress={progress}
            levels={data.levels}
            onAddXp={addTestXp}
            levelUpCount={levelUpCount}
            accent={accent}
          />
        </header>

        <div className="relative mt-5 min-h-[930px]">
          {selectedTask && (
            <div className="mb-6 flex justify-center lg:absolute lg:right-0 lg:top-0 lg:z-20 lg:mb-0 lg:justify-end">
              <section
                role="dialog"
                aria-modal="false"
                aria-labelledby="selected-task-title"
                className="w-full max-w-[340px] rounded-2xl border border-[#d8dee8] bg-white p-5 text-[#19253a] shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className={`text-[10px] font-extrabold uppercase tracking-[0.14em] ${data.lesson.taskTypeLabel ? theme.accentText : "text-[#2e6fdb]"}`}>
                    {data.lesson.taskTypeLabel ?? selectedTask.kind}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedTask(null)}
                    className={`rounded-md px-2 py-1 text-sm font-bold text-[#69758a] hover:bg-[#eef2f8] focus-visible:outline-2 ${accent === "purple" ? "focus-visible:outline-[#6b4bd4]" : "focus-visible:outline-[#2e6fdb]"}`}
                    aria-label="Close task details"
                  >
                    Close
                  </button>
                </div>
                <h2 id="selected-task-title" className="mt-1 text-lg font-bold">
                  {selectedTask.label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#566276]">
                  {selectedTask.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#566276]">
                  <span>{selectedTask.duration}</span>
                  {selectedTask.kind === "exercise" && (
                    <span className={theme.accentText}>+{selectedTask.xpReward} XP</span>
                  )}
                </div>
                {selectedTask.kind === "exercise" && (
                  <button
                    type="button"
                    disabled={selectedTaskCompleted}
                    onClick={() => completeTask(selectedTask.id)}
                    className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 ${theme.accentButton} disabled:cursor-default disabled:bg-[#e8edf4] disabled:text-[#566276]`}
                  >
                    {selectedTaskCompleted
                      ? `Quest completed · +${selectedTask.xpReward} XP`
                      : `Complete quest · +${selectedTask.xpReward} XP`}
                  </button>
                )}
                {onStartExercise && (
                  <button
                    type="button"
                    disabled={selectedTaskCompleted}
                    onClick={() => onStartExercise(selectedTask.id)}
                    className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 ${theme.accentButton} disabled:cursor-default disabled:opacity-60`}
                  >
                    Start task
                  </button>
                )}
              </section>
            </div>
          )}
          <div
            className="absolute left-[3%] hidden w-24 transition-[top] duration-700 ease-in-out sm:block lg:left-[7%]"
            style={{ top: `${mascotPosition}px` }}
          >
            <img src={mascot} alt="" aria-hidden="true" className="block h-auto w-full" />
          </div>
          <div className="mx-auto max-w-[520px] pb-10">
            {data.units.map((unit) => (
              <section key={unit.id} aria-labelledby={`unit-${unit.id}`}>
                {unit.showDivider && (
                  <div className="mb-6 mt-2 flex items-center gap-4">
                    <span className="h-px flex-1 bg-[#d5d9df]" />
                    <h2
                      id={`unit-${unit.id}`}
                      className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.14em] text-[#8492a8]"
                    >
                      {unit.title}
                    </h2>
                    <span className="h-px flex-1 bg-[#d5d9df]" />
                  </div>
                )}
                {!unit.showDivider && <h2 id={`unit-${unit.id}`} className="sr-only">{unit.title}</h2>}
                <ol className="flex flex-col items-center">
                  {unit.nodes.map((node) => (
                    <QuestNode
                      key={node.id}
                      node={node}
                      isSelected={selectedTask?.id === node.id}
                      isCompleted={completedTaskIds.includes(node.id)}
                      isLocked={Boolean(
                        node.prerequisiteId && !completedTaskIds.includes(node.prerequisiteId)
                      )}
                      onSelect={setSelectedTask}
                      accent={accent}
                    />
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </div>
      {isGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsGuideOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-guide-title"
            aria-describedby="task-guide-description"
            className="w-full max-w-lg rounded-2xl border border-[#d8dee8] bg-white p-6 text-[#19253a] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.14em] ${data.lesson.taskTypeLabel ? theme.accentText : "text-[#2e6fdb]"}`}>
                  {data.lesson.taskTypeLabel ? `${data.lesson.taskTypeLabel} guide` : "Task guide"}
                </p>
                <h2 id="task-guide-title" className="mt-1 text-xl font-bold">
                  {guideTask?.label ?? data.lesson.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className={`rounded-md px-2 py-1 text-sm font-bold text-[#69758a] hover:bg-[#eef2f8] focus-visible:outline-2 ${accent === "purple" ? "focus-visible:outline-[#6b4bd4]" : "focus-visible:outline-[#2e6fdb]"}`}
                aria-label="Close task guide"
              >
                Close
              </button>
            </div>
            <p id="task-guide-description" className="mt-3 text-sm leading-relaxed text-[#566276]">
              {guideTask?.description ?? "You have completed every available quest."}
            </p>
            {guideTask?.guideSteps?.length ? (
              <ol className="mt-5 space-y-3">
                {guideTask.guideSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed text-[#27364c]">
                    <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${theme.accentSoft}`}>
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-5 text-sm text-[#566276]">No steps are available for this quest.</p>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

function createCreativePageData(data, tasks) {
  return {
    ...data,
    levels: CREATIVE_PAGE_DATA.levels,
    lesson: {
      id: "creative-path",
      eyebrow: "Creative path",
      title: "My own tasks",
      guideLabel: "Guide",
      taskTypeLabel: "Creative",
      emptyMessage: "Add a task in Accessibility to build your creative path.",
    },
    units: [
      {
        id: "creative-path",
        title: "Your creative path",
        showDivider: false,
        nodes: tasks.map((task, index) => ({
          id: task.id,
          kind: "exercise",
          label: task.label,
          description: task.description ?? task.label,
          guideSteps: task.guideSteps ?? [],
          duration: task.duration || "Custom",
          xpReward: task.xpReward,
          prerequisiteId: index > 0 ? tasks[index - 1].id : undefined,
          offset: [0, 40, 48, 0][index % 4],
        })),
      },
    ],
  };
}

function Exercise({
  data = EXERCISE_PAGE_DATA,
  level = data.level.number,
  xp = 0,
  creativeMode = false,
  creativeTasks = [],
  onStartExercise,
  onOpenGuide,
  onProgressChange,
  onCompleteQuest,
}) {
  const pageData = creativeMode ? createCreativePageData(data, creativeTasks) : data;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <ExercisePage
        data={pageData}
        level={level}
        xp={xp}
        onStartExercise={onStartExercise}
        onOpenGuide={onOpenGuide}
        onProgressChange={onProgressChange}
        onCompleteQuest={onCompleteQuest}
        accent={creativeMode ? "purple" : "blue"}
      />
    </div>
  );
}

export default Exercise;
