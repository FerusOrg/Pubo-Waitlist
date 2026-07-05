import React from "react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="w-full max-w-5xl mx-auto border-t border-editorial-border/35 mt-20 px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-editorial-ink transition-colors duration-200">
      
      {/* Brand & Copy */}
      <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
        <Logo className="opacity-100 scale-95" />
        <p className="text-[11px] text-editorial-ink-light font-sans mt-3">
          © {new Date().getFullYear()} PUBO Technologies, Inc. All rights reserved.
        </p>
        <p className="text-[10px] text-editorial-ink-light/80 font-mono uppercase tracking-wider mt-0.5">
          Unified Platform Scheduler Engine.
        </p>
      </div>

    </footer>
  );
}
