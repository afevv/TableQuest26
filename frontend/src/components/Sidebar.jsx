import { Link, NavLink } from "react-router";

import logo from "../assets/images/TQSmallv2.png";
import progressIcon from "../assets/space/rocket.svg";
import raceIcon from "../assets/icons/nav-race.svg";
import settingsIcon from "../assets/icons/nav-settings.svg";
import aboutUsIcon from "../assets/icons/nav-about.svg";
import { HOME_TABS } from "../data/homeTabs";
import { getSavedHomeTab } from "../utils/savedHomeTab";

const mainNavItems = [
  { to: "/space-journey", label: "Space Journey", icon: progressIcon, activeClass: "border-[#6366f1] bg-[#6366f1]/20 text-[#6366f1]" },
  { to: "/department-race", label: "Department Race", icon: raceIcon, activeClass: "border-[#16a34a] bg-[#16a34a]/20 text-[#16a34a]" },
];

const footerNavItems = [
  { to: "/settings", label: "Settings", icon: settingsIcon, activeClass: "border-[#9ca3af] bg-[#9ca3af]/20 text-[#9ca3af]" },
  { to: "/about-us", label: "About Us", icon: aboutUsIcon, activeClass: "border-[#8b5cf6] bg-[#8b5cf6]/20 text-[#8b5cf6]" },
];

function NavItem({ to, label, icon, activeClass }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex h-13.5 items-center gap-4 rounded-xl border-l-4 px-3 text-base font-semibold transition-colors ${
          isActive
            ? activeClass
            : "border-transparent text-gray-200 hover:bg-white/10"
        }`
      }
    >
      <span
        aria-hidden="true"
        className="size-6 shrink-0 bg-current mask-contain mask-center mask-no-repeat"
        style={{ maskImage: `url("${icon}")` }}
      />
      <span>{label}</span>
    </NavLink>
  );
}

function Sidebar({ homeMode = getSavedHomeTab() }) {
  const homeTab = HOME_TABS[homeMode];

  return (
    <aside className="sticky top-0 z-50 flex h-screen w-65 shrink-0 flex-col bg-[#171717] px-2 py-6 text-white">
      <h1 className="mb-7 px-3">
        <Link to="/" className="flex h-16 items-center justify-center">
          <img src={logo} alt="TableQuest" className="h-13 w-auto max-w-full object-contain" />
        </Link>
      </h1>

      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        <NavItem
          to="/home"
          label="Home"
          icon={homeTab.icon}
          activeClass={`${homeTab.theme} border-(--accent) bg-(--accent)/20 text-(--accent)`}
        />
        {mainNavItems.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>

      <nav aria-label="Account navigation" className="mt-auto flex flex-col gap-1 border-t border-gray-800 pt-3">
        {footerNavItems.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>
    </aside>
  );
}

export default Sidebar;
