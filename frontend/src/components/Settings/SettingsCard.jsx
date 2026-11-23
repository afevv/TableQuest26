function SettingsCard({ title, children }) {
  return (
    <section aria-label={title} className="rounded-2xl border border-slate-300 bg-white px-6 py-5 shadow-sm">
      <h2 className="text-[18px] font-black">{title}</h2>
      {children}
    </section>
  );
}

export default SettingsCard;
