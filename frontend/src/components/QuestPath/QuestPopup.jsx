import QuestDetails from "./QuestDetails";

function getButtonText(node, isCompleted) {
  if (node.kind === "trophy") return isCompleted ? "Claimed" : "Claim stage trophy";
  return `${isCompleted ? "Quest completed" : "Complete quest"} · +${node.xpReward} XP`;
}

function QuestPopup({ node, isCompleted, onComplete, onClose }) {
  return (
    <section
      role="dialog"
      aria-labelledby="quest-popup-title"
      className="fixed bottom-4 left-4 right-4 z-50 max-h-[85vh] overflow-y-auto rounded-2xl border border-[#d8dee8] bg-white p-5 text-[#19253a] shadow-xl sm:left-auto sm:w-[340px]"
    >
      <QuestDetails node={node} title={node.kind} titleId="quest-popup-title" onClose={onClose} />
      <p className="mt-4 text-xs font-semibold text-[#566276]">{node.duration}</p>
      <button
        type="button"
        disabled={isCompleted}
        onClick={onComplete}
        className="quest-button mt-4 w-full"
      >
        {getButtonText(node, isCompleted)}
      </button>
    </section>
  );
}

export default QuestPopup;
