"use client";

import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ACTS, SCENES } from "@/lib/story";

gsap.registerPlugin(ScrollToPlugin);

type Location = {
  id: string;
  name: string;
  act: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  landmark: string;
};

const WORLD_LOCATIONS: Location[] = [
  { id: "silence", name: "The Silent Void", act: 1, x: 20, y: 30, landmark: "✧" },
  { id: "graveyard", name: "The Graveyard", act: 2, x: 40, y: 20, landmark: "☖" },
  { id: "tunnel", name: "The Frequency Tunnel", act: 3, x: 60, y: 35, landmark: "⚝" },
  { id: "iterations", name: "The Forge", act: 4, x: 80, y: 25, landmark: "⚙" },
  { id: "monolith", name: "The Monolith", act: 5, x: 50, y: 50, landmark: "▲" },
  { id: "emergence", name: "The Vessel", act: 6, x: 30, y: 70, landmark: "⎔" },
  { id: "hero", name: "Aura Core", act: 8, x: 70, y: 75, landmark: "◈" },
  { id: "resonance", name: "Resonance", act: 11, x: 50, y: 80, landmark: "≋" },
  { id: "final", name: "The Horizon", act: 12, x: 85, y: 60, landmark: "◎" },
];

export default function WorldMap() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("silence");
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Logic to determine current location based on scroll
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;

      const scene = SCENES.find((s, i) => {
        // Simple approximation: find the scene whose cumulative height matches progress
        let acc = 0;
        for (let j = 0; j < SCENES.length; j++) {
          acc += SCENES[j].vh;
          if (j === i && progress >= (acc - SCENES[j].vh) / 100 && progress <= acc / 100) return true;
        }
        return false;
      });

      if (scene) setCurrentLocation(scene.id);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpToLocation = (id: string) => {
    const el = document.getElementById(`scene-${id}`);
    if (el) {
      // Transition: Close map with a slight scale-down and fade,
      // then slide the world to the target coordinate.
      gsap.to(mapRef.current, {
        duration: 0.4,
        scale: 0.9,
        opacity: 0,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false);
          gsap.to(window, {
            duration: 2,
            scrollTo: { y: el, offsetY: 0 },
            ease: "expo.inOut",
          });
        },
      });
    }
  };

  return (
    <>
      {/* World Navigator Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#d4c3a3] border-2 border-[#8b7355] text-[#5d4037] shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Open World Map"
      >
        <span className="text-xl group-hover:rotate-45 transition-transform">🗺</span>
      </button>

      {/* World Map Overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-700 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />

        {/* Map Container */}
        <div
          ref={mapRef}
          className={`relative w-full max-w-4xl h-[80vh] mx-auto mt-[10vh] rounded-lg shadow-2xl transition-all duration-700 ${
            isOpen ? "scale-100 translate-y-0" : "scale-90 translate-y-10"
          }`}
          style={{
            background: `radial-gradient(circle, #f2e8cf 0%, #d4c3a3 100%)`,
            backgroundImage: `url("https://www.transparenttextures.com/patterns/parchment.png"), radial-gradient(circle, #f2e8cf 0%, #d4c3a3 100%)`,
            border: "12px solid #8b7355",
            boxShadow: "0 0 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(139,115,85,0.3)"
          }}
        >
          {/* Map Decorative Elements */}
          <div className="absolute top-8 left-8 font-display text-3xl text-[#5d4037]/40 uppercase tracking-widest rotate-[-2deg]">
            The Soundscape Odyssey
          </div>

          <div className="absolute bottom-8 right-8 font-serif italic text-[#5d4037]/40">
            Cartographia Aura v1.0
          </div>

          {/* Locations */}
          {WORLD_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => jumpToLocation(loc.id)}
              className="absolute group transition-all duration-300"
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            >
              {/* Landmark Icon */}
              <div className={`
                relative w-10 h-10 flex items-center justify-center text-2xl transition-all duration-300
                ${currentLocation === loc.id
                  ? "text-[#57e6ff] scale-125 drop-shadow-[0_0_10px_#57e6ff]"
                  : "text-[#5d4037] group-hover:text-[#8b7355] scale-100"}
              `}>
                {loc.landmark}

                {/* Pulse for current location */}
                {currentLocation === loc.id && (
                  <div className="absolute inset-0 rounded-full bg-[#57e6ff] animate-ping opacity-30" />
                )}
              </div>

              {/* Label */}
              <div className={`
                absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-all duration-300
                ${currentLocation === loc.id ? "opacity-100 translate-y-0" : "opacity-60 group-hover:opacity-100 group-hover:-translate-y-1"}
              `}>
                <span className="text-[10px] font-mono text-[#5d4037]/60 block uppercase tracking-tighter">
                  ACT {loc.act}
                </span>
                <span className="text-xs font-serif font-bold text-[#5d4037] uppercase tracking-wide">
                  {loc.name}
                </span>
              </div>
            </button>
          ))}

          {/* Decorative Lines (Connecting locations) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <polyline
              points={WORLD_LOCATIONS.map(l => `${l.x}% ${l.y}%`).join(' ')}
              fill="none"
              stroke="#5d4037"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
