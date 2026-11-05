import { Link, NavLink } from "react-router";

import physicalIcon from "../assets/physical-icon.png";
import socialIcon from "../assets/social-icon.png";
import remindersIcon from "../assets/reminders-icon.png";
import progressIcon from "../assets/progress-icon.png";
import settingsIcon from "../assets/settings-icon.png";

const navItems = [
  { to: "/physical", label: "Physical", icon: physicalIcon },
  { to: "/social", label: "Social", icon: socialIcon },
  { to: "/reminders", label: "Custom Reminders", icon: remindersIcon },
  { to: "/progress", label: "Progress", icon: progressIcon },
  { to: "/settings", label: "Settings", icon: settingsIcon },
];

function Sidebar() {
  return (
    <aside className="w-72 h-screen shrink-0 sticky top-0 bg-white border-r border-gray-200 py-6">
      <h1 className="px-6 mb-8 text-xl font-bold">
        <Link to="/" className="text-black">"Logo"</Link>
      </h1>

      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg cursor-pointer border-l-4 transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50 border-transparent"
              }`
            }
          >
            <span
              aria-hidden="true"
              className="size-5 shrink-0 bg-current mask-contain mask-no-repeat mask-center"
              style={{ maskImage: `url(${icon})` }}
            />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
