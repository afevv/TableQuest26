function SettingsCard({ title, children }) {
  return (
    <section aria-label={title} className="rounded-2xl bg-[#262626] px-6 py-5 shadow-md">
      <h2 className="text-[18px] font-black">{title}</h2>
      {children}
    </section>
  );
}

export default SettingsCard;
