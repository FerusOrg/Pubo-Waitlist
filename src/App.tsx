import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Sun, Moon, Database, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Logo from "./components/Logo";
import StatsCounter from "./components/StatsCounter";
import PreviewSimulator from "./components/PreviewSimulator";
import WaitlistForm from "./components/WaitlistForm";
import FeaturesBento from "./components/FeaturesBento";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import FaqSection from "./components/FaqSection";
import { WaitlistStats } from "./types";

export default function App() {
  const [stats, setStats] = useState<WaitlistStats>({
    totalCount: 0,
    platforms: {},
    roles: {},
    recentSignups: []
  });
  const [referrerCode, setReferrerCode] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("pubo_theme");
    if (saved === "dark" || saved === "light") return saved;
    return "dark"; // Defaulting to the gorgeous cosmic dark mode!
  });

  // Sync statistics from Express API
  const loadStats = async () => {
    try {
      const response = await fetch("/api/waitlist/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to sync waitlist statistics:", error);
    }
  };

  useEffect(() => {
    loadStats();

    // Automatically open admin panel if accessing via /console URL or hash route
    if (
      window.location.pathname === "/console" || 
      window.location.pathname === "/console/" ||
      window.location.hash === "#console" ||
      window.location.hash === "#/console"
    ) {
      setIsAdminOpen(true);
    }

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferrerCode(ref);
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("pubo_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSignupSuccess = (newEntry: any) => {
    loadStats();
    
    setTimeout(() => {
      document.getElementById("waitlist-form-section")?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-ink selection:bg-brand-500/20 selection:text-editorial-ink relative transition-colors duration-500">
      
      {/* TOP FLOATING NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full max-w-5xl mx-auto pt-6 px-4">
        <div className="w-full flex items-center justify-between px-6 py-3.5 bg-card border border-border rounded-xl shadow-sm transition-all duration-300">
          <Logo />
          
          <div className="hidden md:flex items-center gap-6 text-xs tracking-tight font-medium text-editorial-ink-light transition-colors duration-200">
            <a href="#simulator" className="hover:text-brand-500 transition-colors duration-200">Demo</a>
            <a href="#features" className="hover:text-brand-500 transition-colors duration-200">Features</a>
            <a href="#faq" className="hover:text-brand-500 transition-colors duration-200">FAQ</a>
            <a href="#waitlist" className="hover:text-brand-500 transition-colors duration-200">Join</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-card border border-border hover:bg-muted text-editorial-ink rounded-lg transition-all cursor-pointer flex items-center justify-center"
              aria-label="Toggle theme"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-brand-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            <a
              href="#waitlist"
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg shadow-sm inline-flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <span>Join Waitlist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT HERO CONTAINER */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-16 sm:pt-28 pb-12 flex flex-col items-center">
        
        {/* Confident, Natural Main Title */}
        <div className="text-center max-w-3xl space-y-6 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.1]"
          >
            Create once. <br />
            <span className="text-brand-500">Publish everywhere.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-base sm:text-lg text-editorial-ink-light max-w-xl mx-auto leading-relaxed"
          >
            An elegant omnichannel publishing deck for creators. Orchestrate threads, reels, and feeds across all platforms in a single breath.
          </motion.p>
        </div>

        {/* Social Proof Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full mb-20"
        >
          <StatsCounter totalCount={stats.totalCount} />
        </motion.div>

        {/* INTERACTIVE DEMO (THE SIMULATOR) */}
        <div id="simulator" className="w-full mt-8 mb-20 scroll-mt-28">
          <div className="text-center max-w-xl mx-auto mb-10 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Composer Lab
            </h2>
            <p className="text-sm text-editorial-ink-light mt-2 transition-colors duration-200">
              Craft updates below and watch Pubo model-optimize each network preview in real-time.
            </p>
          </div>
          
          <PreviewSimulator />
        </div>

        {/* BENTO GRID OF CAPABILITIES */}
        <div id="features" className="w-full mt-6 mb-20 scroll-mt-28">
          <FeaturesBento />
        </div>

        {/* WAITLIST SIGNUP FORM */}
        <div id="waitlist" className="w-full mt-6 py-6 scroll-mt-28">
          <WaitlistForm 
            onSignupSuccess={handleSignupSuccess} 
            referrerCode={referrerCode} 
          />
        </div>

        {/* FAQ ACCORDION SECTION */}
        <FaqSection />

      </main>

      {/* FOOTER */}
      <Footer />

      {/* SECRET ADMINISTRATOR PANEL MODAL */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => {
          setIsAdminOpen(false);
          // Restore path back to root on modal close
          if (window.location.pathname === "/console" || window.location.pathname === "/console/") {
            window.history.pushState({}, "", "/");
          } else if (window.location.hash === "#console" || window.location.hash === "#/console") {
            window.history.pushState({}, "", window.location.pathname);
          }
        }} 
        onUpdateStats={loadStats}
      />

    </div>
  );
}
