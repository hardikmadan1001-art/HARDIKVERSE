"use client";

import React, { useState, useEffect } from "react";

type Theme = "Warm Light" | "Warm Dusk";

interface Settings {
  theme: Theme;
  soundEnabled: boolean;
  reducedMotion: boolean;
}

const STORAGE_KEY = "aura-audio-settings";

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>({
    theme: "Warm Dusk",
    soundEnabled: true,
    reducedMotion: false,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const updateSetting = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));

    // Apply theme to document body/html
    if (key === "theme") {
      document.documentElement.setAttribute("data-theme", value.toLowerCase().replace(" ", "-"));
    }

    // Apply reduced motion to document
    if (key === "reducedMotion") {
      if (value) {
        document.documentElement.classList.add("reduced-motion");
      } else {
        document.documentElement.classList.remove("reduced-motion");
      }
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full glass-panel text-white hover:text-aura-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-aura-cyan"
        aria-label="Open Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V2a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      {/* Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              aria-label="Close Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            <h2 className="text-2xl font-display font-bold text-white mb-8 tracking-tight">Settings</h2>

            <div className="space-y-8">
              {/* Theme Selection */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/60 uppercase tracking-widest">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Warm Light", "Warm Dusk"] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => updateSetting("theme", t)}
                      className={`py-3 px-4 rounded-xl border transition-all duration-300 text-sm font-medium ${
                        settings.theme === t
                        ? "border-aura-cyan bg-aura-cyan/10 text-aura-cyan shadow-[0_0_15px_rgba(87,230,255,0.2)]"
                        : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <span className="text-white font-medium">Sound Effects</span>
                  <p className="text-xs text-white/40">Enable audio feedback and music</p>
                </div>
                <button
                  onClick={() => updateSetting("soundEnabled", !settings.soundEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-aura-cyan ${
                    settings.soundEnabled ? "bg-aura-cyan" : "bg-white/20"
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    settings.soundEnabled ? "translate-x-6" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <span className="text-white font-medium">Reduced Motion</span>
                  <p className="text-xs text-white/40">Minimize animations for comfort</p>
                </div>
                <button
                  onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-aura-cyan ${
                    settings.reducedMotion ? "bg-aura-cyan" : "bg-white/20"
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    settings.reducedMotion ? "translate-x-6" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
