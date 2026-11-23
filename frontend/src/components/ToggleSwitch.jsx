function ToggleSwitch({ checked, label, onChange, color, offColor = "#b8c0ce" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ backgroundColor: checked ? color : offColor, outlineColor: color }}
    >
      <span
        className={`absolute left-1 top-1 size-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default ToggleSwitch;
