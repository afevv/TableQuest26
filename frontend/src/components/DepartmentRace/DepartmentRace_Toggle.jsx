const OPTIONS = [
  { value: "departments", label: "Departments" },
  { value: "team", label: "Your team" },
]

function DepartmentRace_Toggle({ value, onChange }) {
  const activeIndex = OPTIONS.findIndex((option) => option.value === value)

  return (
    <div
      role="tablist"
      className="relative mt-6 grid w-full max-w-xs grid-cols-2 rounded-3xl bg-[#171717] p-1"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-3xl bg-[#16a34a]/75 transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {OPTIONS.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`relative z-10 rounded-full py-4 text-sm font-semibold transition-colors md:text-base ${
              isActive ? "text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default DepartmentRace_Toggle
