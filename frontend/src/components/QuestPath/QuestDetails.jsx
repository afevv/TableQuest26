// The top part shared by the quest popup and the guide.
function QuestDetails({ node, title, titleId, onClose }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-(--accent-dark)">
          {title}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="rounded-md px-2 py-1 text-sm font-bold text-[#69758a] hover:bg-[#eef2f8]"
        >
          Close
        </button>
      </div>
      <h2 id={titleId} className="mt-1 text-lg font-bold">
        {node.label}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#566276]">{node.description}</p>
      {node.alternative && (
        <p className="mt-3 rounded-lg bg-[#f4f6fa] p-3 text-xs leading-relaxed text-[#566276]">
          <strong className="text-[#19253a]">
            {node.kind === "social" ? "Low-pressure option: " : "Seated option: "}
          </strong>
          {node.alternative}
        </p>
      )}
    </>
  );
}

export default QuestDetails;
