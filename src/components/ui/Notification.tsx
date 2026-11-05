"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

type NotificationProps = {
  message: string;
  visible: boolean;
  onClose?: () => void;
};

export default function Notification({ message, visible, onClose }: NotificationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (visible) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    } else if (ref.current) {
      gsap.to(ref.current, {
        opacity: 0,
        y: 20,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [visible, isMounted]);

  if (!isMounted) return null;

  return (
    <div
      ref={ref}
      style={{ pointerEvents: "none" }}
      className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-2xl">
        <p className="text-white text-[11px] uppercase tracking-[0.2em] font-medium text-center">
          {message}
        </p>
      </div>
    </div>
  );
}
