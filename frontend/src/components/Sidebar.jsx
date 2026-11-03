import { Link, NavLink } from 'react-router'

const pages = [
  { to: '/physical', label: 'Physical' },
  { to: '/social', label: 'Social' },
  { to: '/reminders', label: 'Custom Reminders' },
  { to: '/progress', label: 'Progress' },
  { to: '/settings', label: 'Settings' },
]

function Sidebar() {
  return (
    <header className="navbar bg-base-300 shadow-sm px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">TableQuest</Link>
      </div>
      <nav className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {pages.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className={({ isActive }) => (isActive ? 'menu-active' : '')}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Sidebar
