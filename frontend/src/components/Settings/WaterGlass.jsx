function WaterGlass({ fillPercent, index }) {
  const fillHeight = 28 * (fillPercent / 100);
  const clipId = `water-glass-interior-${index}`;

  return (
    <svg aria-hidden="true" height="44" viewBox="0 0 32 40" width="36">
      <defs>
        <clipPath id={clipId}>
          <path d="M6 5h20l-3 27q-7 3-14 0L6 5Z" />
        </clipPath>
      </defs>
      <rect
        clipPath={`url(#${clipId})`}
        fill="#6ebbf0"
        height={fillHeight}
        width="22"
        x="5"
        y={33 - fillHeight}
      />
      <path d="M5 4h22l-3 29q-8 4-16 0L5 4Z" fill="none" stroke="#1687df" strokeWidth="2" />
      <path d="M5 6h22" fill="none" stroke="#1687df" strokeWidth="2" />
    </svg>
  );
}

export default WaterGlass;
