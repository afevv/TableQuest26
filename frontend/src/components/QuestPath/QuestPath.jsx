import { useState } from "react";
import { TEST_XP } from "../../data/questSettings";
import PlayerLevelHud from "../PlayerLevelHud";
import Mascot from "./Mascot";
import QuestBanner from "./QuestBanner";
import QuestGuide from "./QuestGuide";
import QuestNode from "./QuestNode";
import QuestPopup from "./QuestPopup";

// Heights in pixels, used to place the mascot next to the current quest.
const NODE_HEIGHT = 94;
const HEADING_HEIGHT = 48;
const COLUMNS = "grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]";

// Draws any path (exercise or social). Children appear in a side column.
function QuestPath({ quests, children }) {
  const { data, nodes, nextNode, isUnlocked, completedIds } = quests;
  const [selectedId, setSelectedId] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const selectedNode = nodes.find((node) => node.id === selectedId);
  const guideNode = selectedNode ?? nextNode;
  const currentNode = nextNode ?? nodes.at(-1);
  const stageIndex = data.units.findIndex((unit) => unit.nodes.includes(currentNode));
  const stage = data.units[stageIndex];
  const mascotTop =
    (stageIndex + 1) * HEADING_HEIGHT + nodes.indexOf(currentNode) * NODE_HEIGHT;

  function getStatus(node) {
    if (completedIds.includes(node.id)) return "completed";
    return node === nextNode && isUnlocked ? "current" : "locked";
  }

  function completeQuest() {
    quests.completeNext();
    setSelectedId(null);
  }

  return (
    <section className={`${data.theme} px-5 py-5 text-white sm:px-8 lg:px-10`}>
      <div className="mx-auto max-w-[1160px]">
        <header className={COLUMNS}>
          <QuestBanner
            quests={quests}
            stage={stage}
            canOpenGuide={Boolean(guideNode)}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
          <PlayerLevelHud
            progress={quests.progress}
            levels={data.levels}
            onAddXp={() => quests.addXp(TEST_XP)}
          />
        </header>

        <div className={`mt-5 ${children ? COLUMNS : ""}`}>
          <div className="relative mx-auto w-full max-w-[560px] pb-10">
            <Mascot image={data.mascot} emoji={stage.emoji} top={mascotTop} />
            {data.units.map((unit) => (
              <section key={unit.id}>
                <h2 className="mb-6 flex items-center gap-4 whitespace-nowrap pt-2 text-[11px] font-bold uppercase leading-4 tracking-[0.14em] text-[#8492a8] before:h-px before:flex-1 before:bg-[#d5d9df] after:h-px after:flex-1 after:bg-[#d5d9df]">
                  {unit.title}
                </h2>
                <ol className="flex flex-col items-center">
                  {unit.nodes.map((node, index) => (
                    <QuestNode
                      key={node.id}
                      node={node}
                      index={index}
                      status={getStatus(node)}
                      onSelect={setSelectedId}
                    />
                  ))}
                </ol>
              </section>
            ))}
          </div>
          {children && <aside className="space-y-3">{children}</aside>}
        </div>
      </div>

      {selectedNode && (
        <QuestPopup
          node={selectedNode}
          isCompleted={completedIds.includes(selectedId)}
          onComplete={completeQuest}
          onClose={() => setSelectedId(null)}
        />
      )}
      {isGuideOpen && guideNode && (
        <QuestGuide node={guideNode} onClose={() => setIsGuideOpen(false)} />
      )}
    </section>
  );
}

export default QuestPath;
