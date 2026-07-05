import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, ArrowRight, Sun, Moon, Database, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Logo from "./components/Logo";
import StatsCounter from "./components/StatsCounter";
import WaitlistForm from "./components/WaitlistForm";
import Footer from "./components/Footer";
import { WaitlistStats } from "./types";
import { api } from "./lib/api";

// Lazy load heavy page chunks, below-the-fold content, and admin panel for optimal performance
const PreviewSimulator = React.lazy(() => import("./components/PreviewSimulator"));
const FeaturesBento = React.lazy(() => import("./components/FeaturesBento"));
const FaqSection = React.lazy(() => import("./components/FaqSection"));

const RoadmapPage = React.lazy(() => import("./components/RoadmapPage"));
const BlogPage = React.lazy(() => import("./components/BlogPage"));
const PrivacyPage = React.lazy(() => import("./components/PrivacyPage"));
const TermsPage = React.lazy(() => import("./components/TermsPage"));
const AdminPanel = React.lazy(() => import("./components/AdminPanel"));

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
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || "/";
  });

  // Sync statistics from API
  const loadStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to sync waitlist statistics:", error);
    }
  }, []);

  // Navigate helper
  const navigateTo = useCallback((path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    setIsAdminOpen(path === "/console" || path === "/console/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Nav click that supports page-redirect fallback before scrolling
  const handleNavClick = useCallback((hash: string) => {
    if (currentPath !== "/") {
      navigateTo("/");
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 180);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPath, navigateTo]);

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

    // Synchronize browser forward & backward events
    const handlePopState = () => {
      const path = window.location.pathname || "/";
      setCurrentPath(path);
      if (path === "/console" || path === "/console/") {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update document title and description dynamically on page navigations
  useEffect(() => {
    let title = "Pubo — AI Social Media Management Platform";
    let desc = "Create, optimize, schedule and publish content across every social platform using AI. Join the Pubo waitlist for early access.";
    
    if (currentPath === "/roadmap") {
      title = "Roadmap — Pubo";
      desc = "Follow Pubo progress as we transition from a high-fidelity waitlist into a complete social media management command deck.";
    } else if (currentPath === "/blog") {
      title = "Blog — Pubo";
      desc = "Documenting every step of building Pubo in public. Real engineering logs, design iterations, and cross-platform growth guides.";
    } else if (currentPath.startsWith("/blog/")) {
      const slug = currentPath.replace(/^\/blog\//, "");
      if (slug === "how-to-schedule-instagram-posts") {
        title = "How to Schedule Instagram Posts Efficiently using AI — Pubo";
        desc = "A complete step-by-step masterclass on optimal queue creation and programmatic dispatch timing.";
      } else if (slug === "buffer-vs-hootsuite-vs-pubo") {
        title = "The Evolution of Schedulers: Buffer vs Hootsuite vs Pubo — Pubo";
        desc = "An objective comparison of publishing architectures, scheduling precision, and visual previews.";
      } else if (slug === "ai-social-media-management") {
        title = "AI-Powered Social Media Management: The Next Frontier — Pubo";
        desc = "Understanding the paradigm shift from standard templates to highly localized, model-driven publishing decks.";
      } else {
        title = "Blog — Pubo";
        desc = "Read our latest publications about building in public.";
      }
    } else if (currentPath === "/privacy") {
      title = "Privacy Policy — Pubo";
      desc = "Our Privacy Policy outlines collected parameters, data handling, retention protocols, and GDPR/CCPA alignment.";
    } else if (currentPath === "/terms") {
      title = "Terms of Service — Pubo";
      desc = "Our Terms of Service outlining acceptance rules, waitlist regulations, and intellectual property terms.";
    }
    
    document.title = title;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", desc);
    }
  }, [currentPath]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("pubo_theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const handleSignupSuccess = useCallback((newEntry: any) => {
    loadStats();
    
    setTimeout(() => {
      document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  }, [loadStats]);

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-ink selection:bg-brand-500/20 selection:text-editorial-ink relative transition-colors duration-500">
      
      {/* TOP FLOATING NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full max-w-5xl mx-auto pt-6 px-4">
        <div className="w-full flex items-center justify-between px-6 py-3.5 bg-card border border-border rounded-xl shadow-sm transition-all duration-300">
          <button 
            onClick={() => navigateTo("/")}
            className="flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
            aria-label="Pubo Home"
          >
            <Logo />
          </button>
          
          <div className="hidden md:flex items-center gap-6 text-xs tracking-tight font-medium text-editorial-ink-light transition-colors duration-200">
            <a href="#simulator" onClick={(e) => { e.preventDefault(); handleNavClick("simulator"); }} className="hover:text-brand-500 transition-colors duration-200 cursor-pointer focus:outline-none">Demo</a>
            <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick("features"); }} className="hover:text-brand-500 transition-colors duration-200 cursor-pointer focus:outline-none">Features</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); handleNavClick("faq"); }} className="hover:text-brand-500 transition-colors duration-200 cursor-pointer focus:outline-none">FAQ</a>
            <a 
              href="/roadmap"
              onClick={(e) => { e.preventDefault(); navigateTo("/roadmap"); }} 
              className={`transition-colors duration-200 cursor-pointer focus:outline-none ${currentPath === "/roadmap" ? "text-brand-500 font-bold" : "hover:text-brand-500"}`}
            >
              Roadmap
            </a>
            <a 
              href="/blog"
              onClick={(e) => { e.preventDefault(); navigateTo("/blog"); }} 
              className={`transition-colors duration-200 cursor-pointer focus:outline-none ${currentPath.startsWith("/blog") ? "text-brand-500 font-bold" : "hover:text-brand-500"}`}
            >
              Blog
            </a>
            <a href="#waitlist" onClick={(e) => { e.preventDefault(); handleNavClick("waitlist"); }} className="hover:text-brand-500 transition-colors duration-200 cursor-pointer focus:outline-none">Join</a>
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

            <button
              onClick={() => handleNavClick("waitlist")}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg shadow-sm inline-flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <span>Join Waitlist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="relative z-10 w-full min-h-[60vh] flex flex-col items-center">
        {currentPath === "/" || currentPath.startsWith("/console") ? (
          <div className="w-full max-w-5xl mx-auto px-4 pt-16 sm:pt-28 pb-12 flex flex-col items-center">
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

            {/* INTERACTIVE DEMO (THE SIMULATOR) - LAZY LOADED */}
            <div id="simulator" className="w-full mt-8 mb-20 scroll-mt-28">
              <div className="text-center max-w-xl mx-auto mb-10 flex flex-col items-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                  Composer Lab
                </h2>
                <p className="text-sm text-editorial-ink-light mt-2 transition-colors duration-200">
                  Craft updates below and watch Pubo model-optimize each network preview in real-time.
                </p>
              </div>
              
              <React.Suspense fallback={
                <div className="w-full h-80 flex flex-col items-center justify-center border border-border rounded-xl bg-card p-8 text-center gap-3">
                  <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-editorial-ink-light font-mono">Loading Composer Lab...</p>
                </div>
              }>
                <PreviewSimulator />
              </React.Suspense>
            </div>

            {/* BENTO GRID OF CAPABILITIES - LAZY LOADED */}
            <div id="features" className="w-full mt-6 mb-20 scroll-mt-28">
              <React.Suspense fallback={
                <div className="w-full h-40 flex flex-col items-center justify-center border border-border rounded-xl bg-card p-6 text-center gap-2">
                  <p className="text-xs text-editorial-ink-light font-mono">Loading feature deck...</p>
                </div>
              }>
                <FeaturesBento />
              </React.Suspense>
            </div>

            {/* WAITLIST SIGNUP FORM */}
            <div id="waitlist" className="w-full mt-6 py-6 scroll-mt-28">
              <WaitlistForm 
                onSignupSuccess={handleSignupSuccess} 
                referrerCode={referrerCode} 
                onNavigate={navigateTo}
              />
            </div>

            {/* FAQ ACCORDION SECTION - LAZY LOADED */}
            <React.Suspense fallback={
              <div className="w-full h-20 flex items-center justify-center text-xs text-editorial-ink-light font-mono">
                Loading FAQ...
              </div>
            }>
              <FaqSection />
            </React.Suspense>
          </div>
        ) : (
          <React.Suspense fallback={
            <div className="w-full max-w-5xl mx-auto px-4 py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-editorial-ink-light font-mono">Loading page...</p>
            </div>
          }>
            {currentPath === "/roadmap" ? (
              <div className="w-full pt-16">
                <RoadmapPage 
                  onNavigateHome={() => navigateTo("/")} 
                  onJoinWaitlist={() => handleNavClick("waitlist")}
                />
              </div>
            ) : currentPath.startsWith("/blog") ? (
              <div className="w-full pt-16">
                <BlogPage 
                  currentPath={currentPath}
                  onNavigate={navigateTo}
                  onJoinWaitlist={() => handleNavClick("waitlist")}
                />
              </div>
            ) : currentPath === "/privacy" ? (
              <div className="w-full pt-16">
                <PrivacyPage onNavigateHome={() => navigateTo("/")} />
              </div>
            ) : currentPath === "/terms" ? (
              <div className="w-full pt-16">
                <TermsPage onNavigateHome={() => navigateTo("/")} />
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto text-center py-24 px-4 space-y-4">
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">404 - Desk Not Found</h1>
                <p className="text-editorial-ink-light text-sm leading-relaxed">
                  This terminal path is not configured. Return to the main command deck to secure your registration spot.
                </p>
                <button
                  onClick={() => navigateTo("/")}
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                >
                  Go to Home Deck
                </button>
              </div>
            )}
          </React.Suspense>
        )}
      </main>

      {/* FOOTER */}
      <Footer onNavigate={navigateTo} />

      {/* SECRET ADMINISTRATOR PANEL MODAL */}
      <React.Suspense fallback={null}>
        <AdminPanel 
          isOpen={isAdminOpen} 
          onClose={() => {
            setIsAdminOpen(false);
            // Restore path back to root on modal close
            if (window.location.pathname === "/console" || window.location.pathname === "/console/") {
              window.history.pushState({}, "", "/");
              setCurrentPath("/");
            } else if (window.location.hash === "#console" || window.location.hash === "#/console") {
              window.history.pushState({}, "", window.location.pathname);
            }
          }} 
          onUpdateStats={loadStats}
        />
      </React.Suspense>

    </div>
  );
}
