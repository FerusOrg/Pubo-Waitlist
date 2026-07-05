import React from "react";
import Logo from "./Logo";

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full max-w-5xl mx-auto border-t border-editorial-border/35 mt-20 px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-editorial-ink transition-colors duration-200">
      
      {/* Brand & Copy */}
      <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
        <Logo className="opacity-100 scale-95" />
        <p className="text-[11px] text-editorial-ink-light font-sans mt-3">
          © 2026 Pubo
        </p>
        <p className="text-[10px] text-editorial-ink-light/80 font-mono uppercase tracking-wider mt-0.5">
          Unified Platform Scheduler Engine.
        </p>
      </div>

      {/* Footer Navigation Links */}
      <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono font-bold uppercase tracking-wider text-editorial-ink-light">
        <button 
          onClick={() => onNavigate?.("/roadmap")} 
          className="hover:text-brand-500 cursor-pointer focus:outline-none transition-colors"
        >
          Roadmap
        </button>
        <button 
          onClick={() => onNavigate?.("/blog")} 
          className="hover:text-brand-500 cursor-pointer focus:outline-none transition-colors"
        >
          Blog
        </button>
        <button 
          onClick={() => onNavigate?.("/privacy")} 
          className="hover:text-brand-500 cursor-pointer focus:outline-none transition-colors"
        >
          Privacy
        </button>
        <button 
          onClick={() => onNavigate?.("/terms")} 
          className="hover:text-brand-500 cursor-pointer focus:outline-none transition-colors"
        >
          Terms
        </button>
      </nav>

    </footer>
  );
}
