import QuestDetails from "./QuestDetails";

// The browser's own dialog handles Escape and keyboard focus.
const openDialog = (dialog) => dialog?.showModal();

function QuestGuide({ node, onClose }) {
  return (
    <dialog
      ref={openDialog}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      aria-labelledby="quest-guide-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white text-[#19253a] shadow-2xl backdrop:bg-black/70"
    >
      <div className="p-6">
        <QuestDetails
          node={node}
          title={`${node.kind} guide`}
          titleId="quest-guide-title"
          onClose={onClose}
        />
        <ol className="mt-5 space-y-3">
          {node.guideSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-[#27364c]">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-(--accent-soft) text-xs font-bold text-(--accent-dark)">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        {node.muscleWiki && (
          <a
            href={node.muscleWiki}
            target="_blank"
            rel="noreferrer"
            className="quest-button mt-5 block text-center"
          >
            Watch it on MuscleWiki
          </a>
        )}
      </div>
    </dialog>
  );
}

export default QuestGuide;
