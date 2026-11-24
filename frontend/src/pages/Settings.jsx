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
      <section className="min-h-screen min-w-0 flex-1 bg-[#171717] px-8 py-4 text-white">
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
