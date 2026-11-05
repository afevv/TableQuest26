import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

function SidebarLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default SidebarLayout;
