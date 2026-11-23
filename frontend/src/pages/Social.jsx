import { useEffect, useState } from "react";
import guideBook from "../assets/icons/guide-book.svg";
import nodeCheck from "../assets/icons/node-check.svg";
import nodeChest from "../assets/icons/node-chest.svg";
import nodeLock from "../assets/icons/node-lock.svg";
import nodeStar from "../assets/icons/node-star.svg";
import nodeTrophy from "../assets/icons/node-trophy.svg";
import socialMascot from "../assets/illustrations/mascot-social.svg";
import { SOCIAL_PAGE_DATA } from "../data/socialPage";
import PlayerLevelHud from "../components/PlayerLevelHud";
import Sidebar from "../components/Sidebar";
import { addExperience } from "../utils/progression";

const nodeIcons = {
  social: nodeStar,
  reward: nodeChest,
  trophy: nodeTrophy,
};
const XP_PER_CLICK = 25;

function SocialQuestNode({
  node,
  isSelected,
  isCompleted,
  isCurrent,
  isLocked,
  onSelect,
}) {
  const icon = isLocked
    ? nodeLock
    : isCompleted
      ? nodeCheck
      : nodeIcons[node.kind] ?? nodeStar;
  const isHighlighted = isSelected || isCompleted || isCurrent;

  return (
    <li
      className="relative flex min-h-[94px] flex-col items-center text-center"
      style={{ transform: `translateX(${node.offset ?? 0}px)` }}
    >
      {isCurrent && !isCompleted && (
        <span className="absolute -top-7 z-10 rounded-lg border border-[#f1c38f] bg-white px-3 py-1 text-[10px] font-black uppercase text-[#a85300] shadow">
          Start
        </span>
      )}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => onSelect(node)}
        aria-label={`${isLocked ? "Locked" : isCompleted ? "Completed" : "Open"} ${node.label} task details`}
        aria-expanded={isSelected}
        className={`grid size-[58px] place-items-center rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] transition ${
          isHighlighted
            ? "bg-[#e8790c] text-white ring-4 ring-[#e8790c]/30 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            : isLocked
              ? "cursor-not-allowed bg-[#e7edf5] text-[#93a1b5] opacity-55"
              : "cursor-pointer bg-[#e7edf5] text-[#93a1b5] hover:bg-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        }`}
      >
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className={`size-6 ${isHighlighted ? "brightness-0 invert" : "opacity-70"}`}
        />
      </button>
      <span className="mt-2 max-w-36 text-[11px] font-medium leading-tight text-[#8492a8]">
        {node.label}
      </span>
    </li>
  );
}

function Social({
  data = SOCIAL_PAGE_DATA,
  level = data.level.number,
  xp = data.level.xp,
  onOpenGuide,
  onProgressChange,
  onCompleteQuest,
  showSidebar = true,
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [completedTaskIds, setCompletedTaskIds] = useState(
    data.completedQuestIds ?? []
  );
  const [testProgress, setTestProgress] = useState(null);
  const [levelUpCount, setLevelUpCount] = useState(0);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideTask, setGuideTask] = useState(null);
  const progress =
    testProgress?.baseLevel === level && testProgress?.baseXp === xp
      ? testProgress
      : { level: Number(level), xp: Number(xp) };
  const nodes = data.units.flatMap((unit) => unit.nodes);
  const nextTask = nodes.find(
    (node) =>
      !completedTaskIds.includes(node.id) &&
      (!node.prerequisiteId || completedTaskIds.includes(node.prerequisiteId))
  );
  const currentTask =
    selectedTask && !completedTaskIds.includes(selectedTask.id)
      ? selectedTask
      : nextTask;
  const currentTaskUnit = data.units.find((unit) =>
    unit.nodes.some((node) => node.id === currentTask?.id)
  );
  const dailyQuest = nodes.find((node) => node.id === data.dailyQuestId);
  const dailyQuestCompleted =
    dailyQuest && completedTaskIds.includes(dailyQuest.id);
  const selectedTaskCompleted =
    selectedTask && completedTaskIds.includes(selectedTask.id);
  const mascotNode = currentTask ?? nodes.find((node) => node.kind === "social");
  let nodeTop = 0;
  let mascotPosition = 0;

  data.units.forEach((unit) => {
    if (unit.showDivider) nodeTop += 46;
    unit.nodes.forEach((node) => {
      if (node.id === mascotNode?.id) mascotPosition = nodeTop;
      nodeTop += 94;
    });
  });

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

  const completeTask = (taskId) => {
    const task = nodes.find((node) => node.id === taskId);
    if (
      !task ||
      !["social", "reward", "trophy"].includes(task.kind) ||
      completedTaskIds.includes(taskId) ||
      (task.prerequisiteId &&
        !completedTaskIds.includes(task.prerequisiteId))
    ) {
      return;
    }
    if (
      task.kind === "social" &&
      (!Number.isFinite(task.xpReward) || task.xpReward <= 0)
    ) {
      throw new Error(`Social quest "${task.id}" must define a positive xpReward.`);
    }

    setCompletedTaskIds((currentIds) => [...currentIds, taskId]);
    if (task.kind === "social") addXp(task.xpReward);
    onCompleteQuest?.(taskId, task.xpReward ?? 0);
    setSelectedTask(null);
  };

  const openGuide = () => {
    const taskToGuide = selectedTask ?? currentTask ?? dailyQuest;
    onOpenGuide?.(data.lesson.id, taskToGuide?.id);
    setGuideTask(taskToGuide);
    setSelectedTask(null);
    setIsGuideOpen(true);
  };

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />}
      <section className="min-h-screen min-w-0 flex-1 bg-[#171717] px-5 py-5 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1160px]">
          <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="rounded-2xl border-b-4 border-[#a85300] bg-[#d96c07] p-5 shadow-lg sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-100">
                    {currentTask
                      ? `Current quest · ${currentTaskUnit?.title ?? data.lesson.eyebrow}`
                      : "All quests complete"}
                  </p>
                  <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                    {currentTask?.label ?? data.lesson.title}
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-orange-100">
                    {currentTask?.description ??
                      "You have completed every available social quest."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openGuide}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/60 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <img
                    src={guideBook}
                    alt=""
                    aria-hidden="true"
                    className="size-4 brightness-0 invert"
                  />
                  {data.lesson.guideLabel}
                </button>
              </div>
            </div>

            <PlayerLevelHud
              progress={progress}
              levels={data.levels}
              onAddXp={addTestXp}
              levelUpCount={levelUpCount}
              accent="orange"
            />
          </header>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="relative min-h-[930px]">
              <div className="relative mx-auto max-w-[560px]">
                {selectedTask && (
                  <div className="mb-5 flex justify-center md:absolute md:right-0 md:top-0 md:z-20 md:mb-0 md:justify-end">
                    <section
                      role="dialog"
                      aria-modal="false"
                      aria-labelledby="selected-social-task-title"
                      className="w-full max-w-[340px] rounded-2xl border border-[#d8dee8] bg-white p-5 text-[#19253a] shadow-xl"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#d96c07]">
                          {selectedTask.kind}
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedTask(null)}
                          className="rounded-md px-2 py-1 text-sm font-bold text-[#69758a] hover:bg-[#eef2f8] focus-visible:outline-2 focus-visible:outline-[#d96c07]"
                          aria-label="Close quest details"
                        >
                          Close
                        </button>
                      </div>
                      <h2
                        id="selected-social-task-title"
                        className="mt-1 text-lg font-bold"
                      >
                        {selectedTask.label}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[#566276]">
                        {selectedTask.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#566276]">
                        <span>{selectedTask.duration}</span>
                        {selectedTask.kind === "social" && (
                          <span className="text-[#b85e06]">
                            +{selectedTask.xpReward} XP
                          </span>
                        )}
                      </div>
                      {selectedTask.kind === "social" && (
                        <button
                          type="button"
                          disabled={selectedTaskCompleted}
                          onClick={() => completeTask(selectedTask.id)}
                          className="mt-4 w-full rounded-lg bg-[#d96c07] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#bd5d05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d96c07] disabled:cursor-default disabled:bg-[#f3e5d7] disabled:text-[#566276]"
                        >
                          {selectedTaskCompleted
                            ? `Quest completed · +${selectedTask.xpReward} XP`
                            : `Complete quest · +${selectedTask.xpReward} XP`}
                        </button>
                      )}
                      {["reward", "trophy"].includes(selectedTask.kind) && (
                        <button
                          type="button"
                          disabled={selectedTaskCompleted}
                          onClick={() => completeTask(selectedTask.id)}
                          className="mt-4 w-full rounded-lg bg-[#d96c07] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#bd5d05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d96c07] disabled:cursor-default disabled:bg-[#f3e5d7] disabled:text-[#566276]"
                        >
                          {selectedTaskCompleted
                            ? "Claimed"
                            : selectedTask.kind === "reward"
                              ? "Open reward chest"
                              : "Claim unit trophy"}
                        </button>
                      )}
                    </section>
                  </div>
                )}

                <div
                  className="absolute left-[62%] hidden w-24 transition-[top] duration-700 ease-in-out sm:block"
                  style={{ top: `${mascotPosition}px` }}
                >
                  <img
                    src={socialMascot}
                    alt=""
                    aria-hidden="true"
                    className="block h-auto w-full"
                  />
                </div>

                <div className="mx-auto max-w-[520px] pb-10">
                  {data.units.map((unit) => (
                    <section key={unit.id} aria-labelledby={`social-unit-${unit.id}`}>
                      {unit.showDivider && (
                        <div className="mb-6 mt-2 flex items-center gap-4">
                          <span className="h-px flex-1 bg-[#d5d9df]" />
                          <h2
                            id={`social-unit-${unit.id}`}
                            className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.14em] text-[#8492a8]"
                          >
                            {unit.title}
                          </h2>
                          <span className="h-px flex-1 bg-[#d5d9df]" />
                        </div>
                      )}
                      {!unit.showDivider && (
                        <h2
                          id={`social-unit-${unit.id}`}
                          className="sr-only"
                        >
                          {unit.title}
                        </h2>
                      )}
                      <ol className="flex flex-col items-center">
                        {unit.nodes.map((node) => {
                          const isCompleted = completedTaskIds.includes(node.id);
                          return (
                            <SocialQuestNode
                              key={node.id}
                              node={node}
                              isSelected={selectedTask?.id === node.id}
                              isCompleted={isCompleted}
                              isCurrent={currentTask?.id === node.id}
                              isLocked={Boolean(
                                node.prerequisiteId &&
                                  !completedTaskIds.includes(node.prerequisiteId)
                              )}
                              onSelect={setSelectedTask}
                            />
                          );
                        })}
                      </ol>
                    </section>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-3">
              <section className="rounded-2xl border border-[#f1c38f] bg-[#fff6ec] p-4 text-[#19253a] shadow-md">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#b85e06]">
                  Today&apos;s social quest
                </p>
                <h2 className="mt-2 text-sm font-extrabold leading-snug">
                  {dailyQuest?.label ?? "No social quest available"}
                </h2>
                <button
                  type="button"
                  disabled={!dailyQuest || dailyQuestCompleted}
                  onClick={() => dailyQuest && completeTask(dailyQuest.id)}
                  className="mt-3 rounded-lg bg-[#d96c07] px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-white transition hover:bg-[#bd5d05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d96c07] disabled:cursor-default disabled:bg-[#f3e5d7] disabled:text-[#8d6a4b]"
                >
                  {dailyQuestCompleted
                    ? `Done · +${dailyQuest.xpReward} XP`
                    : `I did it · +${dailyQuest?.xpReward ?? 0} XP`}
                </button>
              </section>

              <section
                aria-labelledby="people-this-week"
                className="rounded-2xl border border-[#d8dee8] bg-white p-4 text-[#19253a] shadow-md"
              >
                <h2 id="people-this-week" className="text-xs font-extrabold">
                  People you talked to this week
                </h2>
                <div className="mt-3 flex items-center">
                  {data.people.map((person) => (
                    <span
                      key={person.initials}
                      title={person.name}
                      aria-label={person.name}
                      className="-ml-1 grid size-7 place-items-center rounded-full border-2 border-white text-[9px] font-extrabold text-white first:ml-0"
                      style={{ backgroundColor: person.color }}
                    >
                      {person.initials}
                    </span>
                  ))}
                  <span
                    aria-label={`${data.morePeopleCount} more colleagues`}
                    className="-ml-1 grid size-7 place-items-center rounded-full border-2 border-white bg-[#9aa4b2] text-[9px] font-extrabold text-white"
                  >
                    +{data.morePeopleCount}
                  </span>
                </div>
                <p className="mt-2 text-[10px] font-medium text-[#68758a]">
                  {data.peopleCount} colleagues · {data.weeklyDifference} more than last week
                </p>
              </section>
            </aside>
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
              aria-labelledby="social-guide-title"
              aria-describedby="social-guide-description"
              className="w-full max-w-lg rounded-2xl border border-[#d8dee8] bg-white p-6 text-[#19253a] shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#d96c07]">
                    Task guide
                  </p>
                  <h2 id="social-guide-title" className="mt-1 text-xl font-bold">
                    {guideTask?.label ?? data.lesson.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(false)}
                  className="rounded-md px-2 py-1 text-sm font-bold text-[#69758a] hover:bg-[#eef2f8] focus-visible:outline-2 focus-visible:outline-[#d96c07]"
                  aria-label="Close task guide"
                >
                  Close
                </button>
              </div>
              <p
                id="social-guide-description"
                className="mt-3 text-sm leading-relaxed text-[#566276]"
              >
                {guideTask?.description ??
                  "You have completed every available social quest."}
              </p>
              {guideTask?.guideSteps?.length ? (
                <ol className="mt-5 space-y-3">
                  {guideTask.guideSteps.map((step, index) => (
                      <li
                        key={step}
                        className="flex gap-3 text-sm leading-relaxed text-[#27364c]"
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#fff1e2] text-xs font-bold text-[#a85300]">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                </ol>
              ) : (
                <p className="mt-5 text-sm text-[#566276]">
                  No steps are available for this quest.
                </p>
              )}
            </section>
          </div>
        )}
      </section>
    </div>
  );
}

export default Social;
