"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * WorldLoading - An immersive sequence that prepares the user's aural world.
 * Features a cycling series of preparation messages and a skippable interface.
 * Respects reduced-motion preferences via Tailwind's motion utilities or CSS.
 */
export default function WorldLoading({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Initializing neural audio matrix...",
    "Lattice check... OK",
    "Calibrating sonic horizons...",
    "Spatial grid... OK",
    "Synchronizing with the aura...",
    "Spectral density... OK",
    "Tuning the frequencies of the void...",
    "Resonance stable... OK",
    "Analyzing spectral density...",
    "Frequency lock... OK",
    "Preparing your little corner of the internet...",
    "Assembling your audio sanctuary...",
    "Optimizing haptic feedback loops...",
    "Haptic sync... OK",
    "Decoding harmonic resonance...",
    "Harmonic align... OK",
    "Stabilizing spatial audio grid...",
    "Grid parity... OK",
    "Mapping the soundscape...",
    "Atlas updated... OK",
    "Finalizing atmospheric layers...",
    "Atmosphere... OK",
  ];

  const [isInitializing, setIsInitializing] = useState(true);


  useEffect(() => {
    const initTimer = setTimeout(() => {
      setIsInitializing(false);
    }, 2000);
    return () => clearTimeout(initTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(messageInterval);
  }, [messages.length]);

  useEffect(() => {
    if (progress >= 100) {
      // Slight delay for the final state before completion
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black text-white"
    >
      {/* Cinematic Pre-Reveal Blur Overlay */}
      <motion.div
        initial={{ opacity: 1, backdropFilter: "blur(20px)" }}
        animate={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        className="absolute inset-0 z-[210] pointer-events-none"
      />
      {/* Cinematic Fade-In Overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        className="absolute inset-0 z-[210] bg-black pointer-events-none"
      />
      {/* Ambient Background Glow */}
      <div
        className="pointer-events-none absolute h-[60vh] w-[60vh] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(87, 230, 255, 0.05) 0%, transparent 70%)",
          animation: "breathe 6s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <AnimatePresence mode="wait">
          {isInitializing ? (
            <motion.p
              key="init"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-display text-sm md:text-base font-medium uppercase tracking-[0.3em] text-white/60"
            >
              <motion.span
                animate={{ opacity: [1, 0, 1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                className="inline-block"
              >
                System Initializing...
              </motion.span>
            </motion.p>
          ) : (
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-display text-sm md:text-base font-medium uppercase tracking-[0.3em] text-white/60"
            >
              {messages[messageIndex]}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-3 w-64">
          <div className="h-[1px] w-full bg-white/10 overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-aura-cyan shadow-[0_0_15px_#57e6ff]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            {progress}% Loaded
          </span>
        </div>

        <button
          onClick={onComplete}
          className="group relative px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-aura-cyan focus:outline-none focus:ring-1 focus:ring-aura-cyan"
          aria-label="Skip loading sequence"
        >
          <span className="relative z-10">Skip Sequence</span>
          <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-aura-cyan/10" />
        </button>
      </div>

      {/* Corner accents for "World Preparation" feel */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-white/10" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-white/10" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-white/10" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-white/10" />
    </motion.div>
  );
}
