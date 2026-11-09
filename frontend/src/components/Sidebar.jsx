import { Link, NavLink } from "react-router";

import logo from "../assets/TQLogoTransparent.png";
import smallLogo from "../assets/TQLogoSmall.png";
import exerciseIcon from "../assets/exercise-icon.png";
import socialIcon from "../assets/social-icon.png";
import remindersIcon from "../assets/reminders-icon.png";
import progressIcon from "../assets/progress-icon.png";
import settingsIcon from "../assets/settings-icon.png";
import aboutUsIcon from "../assets/aboutus-icon.png";

const navItems = [
  { to: "/exercise", label: "Exercise", icon: exerciseIcon, activeClass: "bg-[#0439b2]/40 text-[#5b8cff] border-[#5b8cff]" },
  { to: "/social", label: "Social", icon: socialIcon, iconClass: "scale-125", activeClass: "bg-[#ff8c4a]/20 text-[#ff8c4a] border-[#ff8c4a]" },
  { to: "/reminders", label: "Custom Reminders", icon: remindersIcon, activeClass: "bg-purple-500/20 text-purple-300 border-purple-400" },
  { to: "/progress", label: "Progress", icon: progressIcon, activeClass: "bg-green-500/20 text-green-300 border-green-400" },
  { to: "/settings", label: "Settings", icon: settingsIcon, activeClass: "bg-gray-400/20 text-gray-200 border-gray-400" },
  { to: "/about-us", label: "About Us", icon: aboutUsIcon, activeClass: "bg-rose-500/20 text-rose-300 border-rose-400" },
];

function Sidebar() {
  return (
    <aside className="group fixed left-0 top-0 z-50 h-screen w-16 overflow-hidden border-r border-gray-800 bg-[#171717] py-6 shadow-lg transition-[width] duration-500 ease-out hover:w-72 focus-within:w-72">
      <h1 className="mb-8 px-2">
        <Link to="/" className="flex h-12 items-center justify-center">
          <img src={smallLogo} alt="TableQuest" className="size-full scale-125 object-contain group-hover:hidden group-focus-within:hidden" />
          <img src={logo} alt="TableQuest" className="hidden h-12 w-full object-cover brightness-0 invert group-hover:block group-focus-within:block" />
        </Link>
      </h1>

      <nav className="flex flex-col gap-1 px-2">
        {navItems.map(({ to, label, icon, iconClass, activeClass }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex items-center justify-center gap-3 rounded-lg border-l-4 p-3 transition-colors group-hover:justify-start group-focus-within:justify-start ${
                isActive
                  ? `${activeClass} font-medium`
                  : "text-white hover:bg-white/10 border-transparent"
              }`
            }
          >
            <span
              aria-hidden="true"
              className={`size-5 shrink-0 bg-current mask-contain mask-no-repeat mask-center ${iconClass ?? ""}`}
              style={{ maskImage: `url(${icon})` }}
            />
            <span className="w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[width,opacity] duration-300 ease-in-out group-hover:w-auto group-hover:opacity-100 group-focus-within:w-auto group-focus-within:opacity-100">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
