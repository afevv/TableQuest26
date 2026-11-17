import { useEffect, useRef } from "react";
import { Link } from "react-router";
import logo from "../assets/images/TQLogoTransparent.png";
import artwork from "../assets/images/TQartworktransparent.png";
import linak from "../assets/images/linak.png";
import sdu from "../assets/images/SDU.png";
import pico from "../assets/images/artPicoSensors.png";

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
      <header className="h-20 shrink-0 px-6 sm:px-12 lg:px-16">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between">
          <img src={logo} alt="TableQuest" className="w-[210px] max-w-[55%] object-contain" />
          <Link
            to="/home"
            className="rounded-xl border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-800 transition-colors hover:border-blue-200"
          >
            I already have an account
          </Link>
        </div>
      </header>
      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-10 px-6 py-10 md:grid-cols-2 md:gap-12 lg:px-12">
        <img
          src={artwork}
          alt="Height-adjustable desk with activity and movement goals"
          className="w-full max-w-[560px] justify-self-center"
        />
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold leading-tight text-slate-800 sm:text-4xl lg:text-5xl">
            Built around your work.
            <span className="block text-[#2f6fdb]">Designed around your growth.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
            Your LINAK desk reminds you to move, drink water and talk to people.
            Every quest earns XP. Every centimetre your table travels counts.
          </p>
          <Link
            to="/home"
            className="mt-8 inline-flex h-14 w-60 items-center justify-center rounded-xl bg-[#2f6fdb] px-8 font-bold tracking-widest text-white shadow-[0_4px_0_#1e4fa3] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
          >
            GET STARTED
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
