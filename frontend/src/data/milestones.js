import launchpad from "../assets/space/01-launchpad.svg"
import leaveEarth from "../assets/space/02-leave-earth.svg"
import earthOrbit from "../assets/space/03-earth-orbit.svg"
import moon from "../assets/space/05-moon.svg"
import mars from "../assets/space/06-mars.svg"
import jupiter from "../assets/space/08-jupiter.svg"
import saturn from "../assets/space/10-saturn.svg"
import galaxy from "../assets/space/13-galaxy.svg"
import deepSpace from "../assets/space/16-deep-space.svg"

export const MILESTONES = [
  { name: "Launchpad",    distance: 0.1,    icon: launchpad },
  { name: "Leave Earth",  distance: 1,      icon: leaveEarth },
  { name: "Earth orbit",  distance: 10,     icon: earthOrbit },
  { name: "Moon mission", distance: 100,    icon: moon },
  { name: "Mars mission", distance: 500,    icon: mars },
  { name: "Jupiter",      distance: 1000,   icon: jupiter },
  { name: "Saturn",       distance: 5000,   icon: saturn },
  { name: "Galaxy",       distance: 10000,  icon: galaxy },
  { name: "Deep space",   distance: 100000, icon: deepSpace },
]

export function formatDistance(meters) {
  if (meters < 1) {
    const cm = meters * 100
    return `${cm.toLocaleString("en-US", { maximumFractionDigits: 1 })} cm`
  }
  if (meters >= 1000) {
    const km = meters / 1000
    return `${km.toLocaleString("en-US", { maximumFractionDigits: 2 })} km`
  }
  return `${meters.toLocaleString("en-US", { maximumFractionDigits: 2 })} m`
}

export function getLastStop(traveled) {
  return MILESTONES.findLast((m) => traveled >= m.distance) ?? null
}

export function getNextStop(traveled) {
  return MILESTONES.find((m) => traveled < m.distance) ?? null
}
