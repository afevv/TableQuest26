import { useEffect, useRef } from "react";
import { Link } from "react-router";
import logo from "../assets/TQLogoTransparent.png";
import artwork from "../assets/TQartworktransparent.png";
import getStarted from "../assets/GetStartedButtonArt.png";
import linak from "../assets/linak.png";
import sdu from "../assets/SDU.png";
import pico from "../assets/artPicoSensors.png";

function Introduction() {
  const carouselRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const carousel = carouselRef.current;
      const next = (Math.round(carousel.scrollLeft / carousel.clientWidth) + 1) % carousel.children.length;
      carousel.scrollTo({ left: next * carousel.clientWidth, behavior: "smooth" });
    }, 5000); // time for the carousel

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative h-24 shrink-0 px-8 sm:px-16">
        <img src={logo} alt="TableQuest" className="absolute -top-12 left-8 h-56 w-56 object-contain object-left sm:left-16" />
      </header>
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-8 py-8 md:grid-cols-2 sm:px-12">
        <img src={artwork} alt="Height-adjustable desk and activity goals" className="w-full" />
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold leading-tight text-zinc-800 sm:text-3xl">
            Built around your work.
            <span className="block text-blue-700">Designed around your growth.</span>
          </h1>
          <Link to="/home" className="mt-12 inline-block transition-transform duration-300 active:scale-95">
            <img src={getStarted} alt="Get started" className="w-96 max-w-full" />
          </Link>
        </div>
      </main>
      <footer className="border-t border-gray-300 px-4 py-2">
        <div ref={carouselRef} className="carousel carousel-center w-full">
          {[linak, sdu, pico].map((image, index) => (
            <div key={image} className="carousel-item w-full justify-center">
              <img
                src={image}
                alt={["LINAK", "Syddansk Universitet", "Pico Board and sensors"][index]}
                className="h-14 max-w-[80%] object-contain"
              />
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default Introduction
