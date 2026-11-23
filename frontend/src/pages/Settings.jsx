import AlertSettings from "../components/Settings/AlertSettings";
import ReminderSettings from "../components/Settings/ReminderSettings";
import TableSimulator from "../components/Settings/TableSimulator";
import WaterSettings from "../components/Settings/WaterSettings";
import Sidebar from "../components/Sidebar";

// Pico quest outputs: physical quests use Sound 1 + a blue LED pulse; social quests use Sound 2 + an orange pulse.
function Settings({ questInterval, setQuestInterval }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <section className="min-h-screen min-w-0 flex-1 bg-[#f7f9fc] px-8 py-4 text-[#1d2a44]">
        <div className="mx-auto max-w-[1000px] space-y-5">
          <h1 className="text-[32px] font-black leading-tight">Settings</h1>
          <TableSimulator />
          <AlertSettings questInterval={questInterval} setQuestInterval={setQuestInterval} />
          <WaterSettings />
          <ReminderSettings />
        </div>
      </section>
    </div>
  );
}

export default Settings;
