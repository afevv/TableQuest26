import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

function SidebarLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="ml-16 min-h-screen flex-1 bg-white text-black">
        <Outlet />
      </main>
    </div>
  );
}

export default SidebarLayout;
