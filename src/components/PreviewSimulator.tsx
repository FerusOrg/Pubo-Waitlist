import React, { useState, useEffect } from "react";
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Send, 
  Calendar, 
  Sparkles, 
  Check, 
  MessageSquare, 
  Heart, 
  Repeat, 
  Bookmark, 
  Clock, 
  ArrowRight,
  MoreHorizontal,
  ThumbsUp,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Platform = "Twitter" | "LinkedIn" | "Instagram" | "Threads";

const PreviewSimulator = React.memo(function PreviewSimulator() {
  const [text, setText] = useState(
    "Stop jumping between tabs. Draft, schedule, and analyze all your social channels in one unified, high-octane workspace. Meet pubo. 🚀 #SaaS #CreatorEconomy"
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "Twitter",
    "LinkedIn",
    "Threads"
  ]);
  const [activeTab, setActiveTab] = useState<Platform>("Twitter");
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleStep, setScheduleStep] = useState(0);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("TODAY AT 5:00 PM");

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
        if (activeTab === platform) {
          const remaining = selectedPlatforms.filter((p) => p !== platform);
          setActiveTab(remaining[0]);
        }
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSimulateSchedule = () => {
    setIsScheduling(true);
    setScheduleStep(1);

    setTimeout(() => {
      setScheduleStep(2);
    }, 1200);

    setTimeout(() => {
      setScheduleStep(3);
    }, 2400);

    setTimeout(() => {
      setIsScheduling(false);
      setIsScheduled(true);
    }, 3600);
  };

  const resetSimulator = () => {
    setIsScheduled(false);
    setScheduleStep(0);
  };

  useEffect(() => {
    if (!selectedPlatforms.includes(activeTab)) {
      setActiveTab(selectedPlatforms[0]);
    }
  }, [selectedPlatforms, activeTab]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-card border border-border rounded-xl overflow-hidden transition-all duration-300">
      
      {/* Header bar of the simulated app */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-muted/30 border-b border-border select-none gap-4 transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>
          <span className="text-[11px] font-mono text-editorial-ink-light ml-3 font-semibold uppercase tracking-wider">
            composer.pubo.app
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-border transition-colors duration-300">
        
        {/* LEFT PANEL: Composition */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-muted/5 transition-colors duration-200">
          <div>
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-editorial-ink uppercase tracking-wider mb-3 font-mono">
                [01] SELECT TARGET CHANNELS
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Twitter", icon: Twitter, badge: "X" },
                  { name: "LinkedIn", icon: Linkedin, badge: "IN" },
                  { name: "Instagram", icon: Instagram, badge: "IG" },
                  { name: "Threads", icon: () => <span className="font-bold text-[11px] leading-none">@</span>, badge: "TH" }
                ].map((plat) => {
                  const isSel = selectedPlatforms.includes(plat.name as Platform);
                  return (
                    <button
                      key={plat.name}
                      onClick={() => togglePlatform(plat.name as Platform)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        isSel 
                          ? "bg-brand-500 text-white border border-brand-500/10"
                          : "bg-card border border-border text-editorial-ink-light hover:border-brand-500 hover:text-editorial-ink"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 flex items-center justify-center ${isSel ? "text-white" : "text-editorial-ink-light"}`}>
                          {plat.name === "Threads" ? <plat.icon /> : <plat.icon className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-semibold">{plat.name}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 font-mono rounded ${isSel ? "bg-white/20 text-white" : "bg-muted text-editorial-ink-light"} transition-colors duration-200`}>
                        {plat.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-[10px] font-bold text-editorial-ink uppercase tracking-wider font-mono">
                  [02] COMPOSE ANNOUNCEMENT
                </label>
                <span className={`text-[10px] font-mono font-bold ${text.length > 280 ? "text-rose-500" : "text-editorial-ink-light"} transition-colors duration-200`}>
                  {text.length} CHR
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Draft your thoughts here..."
                  className="w-full h-40 bg-muted/10 border border-border focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500 rounded-xl p-4 text-xs font-sans text-editorial-ink placeholder-neutral-400 focus:outline-none resize-none transition-all duration-200"
                />
                <div className="absolute bottom-3 right-3 bg-card px-2.5 py-0.5 border border-border rounded-lg text-[8px] font-mono text-editorial-ink-light tracking-widest">
                  REAL-TIME SYNC
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-editorial-ink uppercase tracking-wider mb-3 font-mono">
                [03] CHOOSE PEAK DISPATCH TIME
              </label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 bg-muted/10 border border-border rounded-xl text-xs text-editorial-ink transition-all duration-200">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span className="font-mono font-bold uppercase tracking-wider">{scheduleTime}</span>
                </div>
                <button 
                  onClick={() => {
                    const times = ["TODAY AT 5:00 PM", "TOMORROW AT 9:00 AM", "MONDAY AT 10:00 AM", "OPTIMAL PEAK TIME 🎯"];
                    const currentIdx = times.indexOf(scheduleTime);
                    setScheduleTime(times[(currentIdx + 1) % times.length]);
                  }}
                  className="px-4 py-1.5 bg-card border border-border rounded-xl hover:bg-muted text-xs text-editorial-ink hover:text-brand-500 hover:border-brand-500 transition-all font-mono font-bold cursor-pointer uppercase tracking-wider"
                >
                  CYCLE
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSimulateSchedule}
              disabled={isScheduling || isScheduled}
              className="w-full duo-btn-purple"
            >
              <Send className="w-4 h-4" />
              <span>Schedule Queue</span>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Live Previews */}
        <div className="lg:col-span-7 bg-muted/5 p-6 flex flex-col justify-between relative min-h-[440px] transition-colors duration-200">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <span className="text-[10px] font-bold text-editorial-ink uppercase tracking-wider font-mono">
                [AUTOMATED DEVICE SIMULATION]
              </span>
              
              {/* Tab Selector */}
              <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
                {selectedPlatforms.map((plat) => {
                  const isAct = activeTab === plat;
                  return (
                    <button
                      key={plat}
                      onClick={() => setActiveTab(plat)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                        isAct 
                          ? "bg-brand-500 text-white"
                          : "text-editorial-ink-light hover:text-editorial-ink"
                      }`}
                    >
                      {plat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Post Previews */}
            <div className="bg-card border border-border p-6 rounded-xl relative min-h-[290px] flex flex-col justify-between text-editorial-ink transition-all duration-300">
              <AnimatePresence mode="wait">
                
                {/* TWITTER PREVIEW */}
                {activeTab === "Twitter" && (
                  <motion.div
                    key="twitter-preview"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col gap-3 text-sm"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-muted text-editorial-ink flex items-center justify-center text-xs font-bold shrink-0">
                        P
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-editorial-ink hover:underline text-xs sm:text-sm">pubo</span>
                            <span className="bg-brand-500 text-white rounded-full p-0.5 inline-flex items-center justify-center w-3 h-3 text-[8px] font-bold">
                              ✓
                            </span>
                            <span className="text-[11px] text-editorial-ink-light font-mono">@pubo_hq • NOW</span>
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-editorial-ink-light cursor-pointer" />
                        </div>
                        <p className="text-xs sm:text-sm text-editorial-ink mt-2 leading-relaxed whitespace-pre-wrap break-words font-sans">
                          {text || "Write something..."}
                        </p>
                      </div>
                    </div>
                    {/* Media Mockup */}
                    <div className="pl-13 mt-1">
                      <div className="h-24 w-full bg-muted/35 border border-border rounded-xl flex flex-col items-center justify-center text-editorial-ink-light text-[11px] gap-2 font-mono">
                        <Clock className="w-4 h-4 text-brand-500" />
                        <span className="font-bold uppercase tracking-wider text-[10px]">FORMATTED BY PUBO</span>
                      </div>
                      {/* Twitter actions */}
                      <div className="flex items-center justify-between text-editorial-ink-light mt-4 max-w-md text-[10px] font-mono font-bold border-t border-border pt-3">
                        <span className="flex items-center gap-1.5 hover:text-brand-400 cursor-pointer">
                          <MessageSquare className="w-3.5 h-3.5" /> 0
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-brand-400 cursor-pointer">
                          <Repeat className="w-3.5 h-3.5" /> 0
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-brand-400 cursor-pointer">
                          <Heart className="w-3.5 h-3.5" /> 0
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-brand-400 cursor-pointer">
                          <Bookmark className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* LINKEDIN PREVIEW */}
                {activeTab === "LinkedIn" && (
                  <motion.div
                    key="linkedin-preview"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col gap-3 text-sm"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-muted text-editorial-ink flex items-center justify-center text-xs font-bold shrink-0">
                        P
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-editorial-ink hover:underline text-xs sm:text-sm flex items-center gap-1.5">
                              pubo.
                              <span className="bg-brand-500/10 text-brand-500 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wide">OFFICIAL</span>
                            </span>
                            <span className="text-[10px] text-editorial-ink-light block mt-0.5">Social Posting App • 12,482 followers</span>
                            <span className="text-[9px] text-brand-500 font-mono uppercase tracking-wider font-bold mt-1.5 flex items-center gap-1">
                              Scheduled • <Clock className="w-3 h-3" /> {scheduleTime}
                            </span>
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-editorial-ink-light cursor-pointer" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-editorial-ink mt-2 leading-relaxed whitespace-pre-wrap break-words font-sans">
                      {text || "Write something..."}
                    </p>
                    {/* LinkedIn Interaction actions */}
                    <div className="border-t border-border pt-3 mt-4 flex items-center justify-between text-editorial-ink-light text-[10px] font-bold uppercase tracking-wider font-mono">
                      <span className="flex items-center gap-1.5 hover:text-brand-400 cursor-pointer">
                        <ThumbsUp className="w-3.5 h-3.5" /> Like
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-brand-400 cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" /> Comment
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-brand-400 cursor-pointer">
                        <Repeat className="w-3.5 h-3.5" /> Repost
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-brand-400 cursor-pointer">
                        <Share2 className="w-3.5 h-3.5" /> Send
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* INSTAGRAM PREVIEW */}
                {activeTab === "Instagram" && (
                  <motion.div
                    key="instagram-preview"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col gap-3 text-sm"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-muted text-editorial-ink flex items-center justify-center font-bold text-xs">
                          P
                        </div>
                        <div>
                          <span className="font-bold text-editorial-ink hover:underline text-xs">pubo_hq</span>
                          <span className="text-[9px] text-brand-500 uppercase font-mono font-bold block leading-none mt-0.5">Auto-Optimized</span>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-editorial-ink-light cursor-pointer" />
                    </div>
                    {/* Image Mockup */}
                    <div className="w-full h-36 bg-muted/25 border border-border rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute top-2.5 right-2.5 bg-brand-500 text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded">
                        PORTRAIT 1:1 CROP
                      </div>
                      <Instagram className="w-6 h-6 text-brand-500 mb-1.5" />
                      <span className="text-[10px] text-editorial-ink font-bold uppercase tracking-wider font-mono">BROADCAST GRID RENDER</span>
                      <span className="text-[9px] text-editorial-ink-light font-mono mt-0.5">Scale: 1080 x 1080px</span>
                    </div>
                    <div>
                      <p className="text-xs text-editorial-ink leading-relaxed whitespace-pre-wrap break-words mt-1 font-sans">
                        <span className="font-bold text-editorial-ink mr-1.5">pubo_hq</span>
                        {text || "Write something..."}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* THREADS PREVIEW */}
                {activeTab === "Threads" && (
                  <motion.div
                    key="threads-preview"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col gap-3 text-sm"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className="w-9 h-9 rounded-full bg-muted text-editorial-ink flex items-center justify-center text-xs font-bold">
                          @
                        </div>
                        <div className="w-0.5 h-16 bg-border rounded" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-editorial-ink hover:underline text-xs sm:text-sm">pubo_app</span>
                          <span className="text-[10px] font-mono text-editorial-ink-light">RECENT</span>
                        </div>
                        <p className="text-xs sm:text-sm text-editorial-ink mt-2 leading-relaxed whitespace-pre-wrap break-words font-sans">
                          {text || "Write something..."}
                        </p>
                        <div className="flex items-center gap-4 text-editorial-ink-light mt-4 text-[10px] font-mono font-bold">
                          <Heart className="w-4 h-4 hover:text-brand-500 cursor-pointer" />
                          <MessageSquare className="w-4 h-4 hover:text-brand-500 cursor-pointer" />
                          <Repeat className="w-4 h-4 hover:text-brand-500 cursor-pointer" />
                          <Send className="w-4 h-4 hover:text-brand-500 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* SIMULATION PROCESS LOADER OVERLAY */}
          <AnimatePresence>
            {isScheduling && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center p-6 text-center select-none z-30 transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-4 max-w-xs bg-card border border-border rounded-xl p-6 shadow-sm transition-all duration-200 animate-pulse">
                  <Clock className="w-8 h-8 text-brand-500" />
                  
                  <div className="mt-2">
                    <h4 className="text-xs font-bold text-editorial-ink uppercase tracking-wider font-mono">SCHEDULING POST</h4>
                    <div className="h-6 relative mt-2">
                      <AnimatePresence mode="wait">
                        {scheduleStep === 1 && (
                          <motion.p
                            key="step1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-[10px] text-brand-500 font-mono font-bold"
                          >
                            [01] ADJUSTING IMAGE SIZES...
                          </motion.p>
                        )}
                        {scheduleStep === 2 && (
                          <motion.p
                            key="step2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-[10px] text-brand-500 font-mono font-bold"
                          >
                            [02] FORMATTING TEXT...
                          </motion.p>
                        )}
                        {scheduleStep === 3 && (
                          <motion.p
                            key="step3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-[10px] text-brand-500 font-mono font-bold"
                          >
                            [03] SYNCING WITH {selectedPlatforms.length} NETWORKS...
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {isScheduled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center p-6 text-center select-none z-30 transition-all duration-200"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-4 max-w-sm bg-card border border-border rounded-xl p-6 shadow-sm text-editorial-ink transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
                    <Check className="w-5 h-5" />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider font-mono">POST SCHEDULED!</h4>
                    <p className="text-xs text-editorial-ink-light mt-2 leading-relaxed">
                      Your post is successfully scheduled for <span className="font-mono text-brand-500 font-bold">{scheduleTime}</span> across <span className="font-bold text-editorial-ink">{selectedPlatforms.join(", ")}</span>.
                    </p>
                    <p className="text-[11px] text-brand-500 font-mono font-bold uppercase tracking-wider mt-3 bg-brand-500/5 border border-brand-500/20 rounded-lg px-3.5 py-2">
                      Save 15+ hours weekly on social media.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
                    <button
                      onClick={resetSimulator}
                      className="flex-1 duo-btn-secondary py-2 text-[10px] uppercase font-bold"
                    >
                      Reset Draft
                    </button>
                    <a
                      href="#waitlist"
                      className="flex-1 duo-btn-purple py-2 text-[10px] text-center inline-flex items-center justify-center gap-1 font-bold uppercase cursor-pointer"
                    >
                      <span>Join Waitlist</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-editorial-ink-light text-center font-mono uppercase tracking-wide mt-4">
            * Demo simulator shows exact formatting for each network *
          </p>
        </div>

      </div>
    </div>
  );
});

export default PreviewSimulator;
