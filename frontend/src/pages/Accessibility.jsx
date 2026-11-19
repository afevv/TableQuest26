import { useState } from "react";
import creativeStar from "../assets/icons/creative-star.svg";
import Sidebar from "../components/Sidebar";

function ToggleSwitch({ checked, label, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b4bd4] ${
        checked ? "bg-[#6b4bd4]" : "bg-[#b8c0ce]"
      }`}
    >
      <span
        className={`absolute left-1 top-1 size-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

function Accessibility({
  creativeMode,
  tasks,
  onCreativeModeChange,
  onTasksChange,
}) {
  const [newTaskLabel, setNewTaskLabel] = useState("");

  const updateTasks = (nextTasks) => {
    onTasksChange?.(nextTasks);
  };

  const addTask = (event) => {
    event.preventDefault();
    const label = newTaskLabel.trim();
    if (!label) return;

    updateTasks([
      ...tasks,
      {
        id: `custom-${Date.now()}`,
        label,
        duration: "Custom",
        xpReward: 30,
      },
    ]);
    setNewTaskLabel("");
  };

  const removeTask = (taskId) => {
    updateTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <section className="min-h-screen min-w-0 flex-1 bg-[#171717] px-3 py-5 text-[#19253a] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <header className="mb-4 text-white">
            <h1 className="text-2xl font-bold leading-tight">Accessibility</h1>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-300">
              Make the Exercise path your own with tasks that work for you. You earn the same XP either way.
            </p>
          </header>

          <div className="grid gap-3">
            <div className="space-y-3">
              <section
                aria-labelledby="creative-mode-heading"
                className="rounded-2xl border border-[#d8dee8] bg-white p-4 shadow-md sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#6b4bd4] text-white">
                    <img
                      src={creativeStar}
                      alt=""
                      aria-hidden="true"
                      className="size-6 brightness-0 invert"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 id="creative-mode-heading" className="text-lg font-extrabold">
                      Creative mode
                    </h2>
                    <p className="text-sm leading-snug text-[#465268]">
                      Replaces the Exercise path with your own tasks.
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={creativeMode}
                    label="Creative mode"
                    onChange={onCreativeModeChange}
                  />
                </div>

                {creativeMode ? (
                  <>
                    <ul aria-label="Creative tasks" className="mt-4 space-y-2">
                      {tasks.map((task) => (
                        <li
                          key={task.id}
                          className="flex min-h-12 items-center gap-3 rounded-lg bg-[#f6f5fa] px-3 py-2.5"
                        >
                          <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-[#273449]">
                            {task.label}
                            {task.duration && `, ${task.duration}`}
                          </span>
                          {task.recommendedBy && (
                            <span className="shrink-0 rounded-full bg-[#ece8fb] px-2.5 py-1 text-xs font-bold text-[#5b43ae]">
                              {task.recommendedBy}
                            </span>
                          )}
                          <span className="shrink-0 text-xs font-semibold text-[#465268]">
                            +{task.xpReward} XP
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove task: ${task.label}`}
                            onClick={() => removeTask(task.id)}
                            className="grid size-8 shrink-0 place-items-center rounded text-lg leading-none text-[#68758a] hover:bg-[#e8e5f1] focus-visible:outline-2 focus-visible:outline-[#6b4bd4]"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>

                    <form onSubmit={addTask} className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                      <label className="sr-only" htmlFor="custom-task">
                        Add a task that suits you
                      </label>
                      <input
                        id="custom-task"
                        type="text"
                        maxLength={100}
                        required
                        value={newTaskLabel}
                        onChange={(event) => setNewTaskLabel(event.target.value)}
                        placeholder="Add a task that suits you"
                        className="h-10 min-w-0 rounded-lg border border-[#cbd3df] px-3 text-sm text-[#19253a] outline-none placeholder:text-[#68758a] focus:border-[#6b4bd4] focus:ring-2 focus:ring-[#6b4bd4]/20"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-[#6b4bd4] px-4 text-xs font-extrabold uppercase text-white shadow-[0_2px_0_#4c369e] hover:bg-[#5b40bb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b4bd4]"
                      >
                        Add
                      </button>
                    </form>
                    <p className="mt-3 text-xs leading-relaxed text-[#465268]">
                      Complete tasks in order; each completed task gives you XP and unlocks the next one.
                    </p>
                  </>
                ) : (
                  <p className="mt-4 rounded-lg bg-[#f6f5fa] p-3 text-sm text-[#465268]">
                    Your custom tasks are paused. Turn on Creative mode to edit your path.
                  </p>
                )}
              </section>

            </div>

            <div className="flex gap-2 rounded-xl bg-[#f5f8ff] p-3 text-xs leading-relaxed text-[#36445b]">
              <span
                aria-hidden="true"
                className="grid size-5 shrink-0 place-items-center rounded-full border border-[#2371db] text-xs font-bold text-[#2371db]"
              >
                i
              </span>
              <p>
                These settings are private. Colleagues only see your XP and distance, never which mode you use.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Accessibility;
