import { Link, NavLink } from "react-router";

import logo from "../assets/images/TQSmallv2.png";
import exerciseIcon from "../assets/icons/exercise-icon.png";
import socialIcon from "../assets/icons/nav-social.svg";
import progressIcon from "../assets/space/rocket.svg";
import raceIcon from "../assets/icons/nav-race.svg";
import remindersIcon from "../assets/icons/nav-reminders.svg";
import settingsIcon from "../assets/icons/nav-settings.svg";
import accessibilityIcon from "../assets/icons/nav-accessibility.svg";
import aboutUsIcon from "../assets/icons/nav-about.svg";

const mainNavItems = [
  { to: "/home", label: "Exercise", icon: exerciseIcon, activeClass: "border-[#2f6fdb] bg-[#2f6fdb]/20 text-[#2f6fdb]" },
  { to: "/social", label: "Social", icon: socialIcon, activeClass: "border-[#d96c07] bg-[#d96c07]/20 text-[#d96c07]" },
  { to: "/progress", label: "Space Journey", icon: progressIcon, activeClass: "border-[#6366f1] bg-[#6366f1]/20 text-[#6366f1]" },
  { to: "/department-race", label: "Department Race", icon: raceIcon, activeClass: "border-[#16a34a] bg-[#16a34a]/20 text-[#16a34a]" },
  { to: "/reminders", label: "Reminders", icon: remindersIcon, activeClass: "border-[#dc2626] bg-[#dc2626]/20 text-[#dc2626]" },
];

const footerNavItems = [
  { to: "/settings", label: "Settings", icon: settingsIcon, activeClass: "border-[#9ca3af] bg-[#9ca3af]/20 text-[#9ca3af]" },
  { to: "/accessibility", label: "Accessibility", icon: accessibilityIcon, activeClass: "border-[#14b8a6] bg-[#14b8a6]/20 text-[#14b8a6]" },
  { to: "/about-us", label: "About Us", icon: aboutUsIcon, activeClass: "border-[#8b5cf6] bg-[#8b5cf6]/20 text-[#8b5cf6]" },
];

function NavigationItems({ items }) {
  return items.map(({ to, label, icon, activeClass }) => (
    <NavLink
      key={label}
      to={to}
      className={({ isActive }) =>
        `flex h-[54px] items-center gap-4 rounded-xl border-l-4 px-3 text-base font-semibold transition-colors ${
          isActive
            ? activeClass
            : "border-transparent text-gray-200 hover:bg-white/10"
        }`
      }
    >
      <span
        aria-hidden="true"
        className="size-6 shrink-0 bg-current mask-contain mask-no-repeat mask-center"
        style={{
          maskImage: `url("${icon}")`,
          WebkitMaskImage: `url("${icon}")`,
        }}
      />
      <span>{label}</span>
    </NavLink>
  ));
}

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] flex-col bg-[#171717] px-2 py-6 text-white">
      <h1 className="mb-7 px-3">
        <Link to="/" className="flex h-16 items-center justify-center">
          <img src={logo} alt="TableQuest" className="h-[52px] w-auto max-w-full object-contain" />
        </Link>
      </h1>

      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        <NavigationItems items={mainNavItems} />
      </nav>

      <nav aria-label="Account navigation" className="mt-auto flex flex-col gap-1 border-t border-gray-800 pt-3">
        <NavigationItems items={footerNavItems} />
      </nav>
    </aside>
  );
}

export default Sidebar;
