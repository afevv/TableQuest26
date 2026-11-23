function CounterButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-12 shrink-0 place-items-center rounded-xl border border-slate-300 bg-white text-xl font-bold text-[#2d6fd6] shadow-sm transition-colors hover:border-[#2d6fd6] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d6fd6] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

// A number with − and + buttons. "name" is only read by screen readers.
function Counter({ title, name, unit, value, onChange, step, min, max = Infinity }) {
  return (
    <div>
      <h3 className="text-[13px] font-black">{title}</h3>
      <div className="mt-2 flex items-center justify-between gap-3">
        <CounterButton
          label={`Decrease ${name}`}
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
        >
          −
        </CounterButton>
        <span className="text-[18px] font-black">
          {value} {unit}
        </span>
        <CounterButton
          label={`Increase ${name}`}
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
        >
          +
        </CounterButton>
      </div>
    </div>
  );
}

export default Counter;
