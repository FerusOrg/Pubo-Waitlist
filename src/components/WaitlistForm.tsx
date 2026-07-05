import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  Check, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Twitter, 
  Linkedin, 
  Copy, 
  PartyPopper,
  AlertCircle,
  Clock,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../lib/api";

interface WaitlistFormProps {
  onSignupSuccess: (entry: any) => void;
  referrerCode?: string;
  onNavigate?: (path: string) => void;
}

const ROLES = [
  "Content Creator",
  "Marketing Manager",
  "Solo Founder",
  "Agency Owner"
];

const PLATFORMS = [
  { name: "Twitter/X", icon: "🐦" },
  { name: "LinkedIn", icon: "💼" },
  { name: "Instagram", icon: "📸" },
  { name: "Threads", icon: "🌀" },
  { name: "TikTok", icon: "🎵" },
  { name: "YouTube", icon: "📺" },
  { name: "Facebook", icon: "👥" },
  { name: "Mastodon", icon: "🐘" }
];

const WaitlistForm = React.memo(function WaitlistForm({ onSignupSuccess, referrerCode, onNavigate }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("Content Creator");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Twitter/X", "LinkedIn"]);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupResult, setSignupResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const togglePlatform = (name: string) => {
    if (selectedPlatforms.includes(name)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== name));
    } else {
      setSelectedPlatforms([...selectedPlatforms, name]);
    }
  };

  const handleCopyLink = () => {
    if (!signupResult) return;
    const referralLink = `${window.location.origin}?ref=${signupResult.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError("Please select at least one social platform.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.signup(
        email,
        selectedRole,
        selectedPlatforms,
        referrerCode || undefined
      );

      setSignupResult(data.entry);
      onSignupSuccess(data.entry);

      // Trigger a beautiful, cosmic celestial confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f09262", "#b05730", "#e2a07c", "#fcd34d", "#FFFFFF"]
      });

      // Side bursts shortly after to feel exceptionally rewarding
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0.15, y: 0.6 },
          colors: ["#f09262", "#b05730", "#e2a07c"]
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 0.85, y: 0.6 },
          colors: ["#f09262", "#b05730", "#e2a07c"]
        });
      }, 200);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="waitlist-form-section" className="w-full max-w-xl mx-auto bg-card border border-border rounded-xl p-6 sm:p-8 relative transition-all duration-300">
      <AnimatePresence mode="wait">
        {!signupResult ? (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-center mb-6 pb-4 border-b border-border/30">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-500 shrink-0" />
                <span>Join the Waitlist</span>
              </h3>
              <p className="text-xs text-editorial-ink-light mt-1">
                Secure permanent free access to basic tools today.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-editorial-ink uppercase tracking-wider font-mono">
                  Your Primary Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-editorial-ink-light" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to secure a spot..."
                    className="w-full pl-11 pr-4 py-3 bg-muted/20 border border-border focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500 rounded-lg text-xs sm:text-sm text-editorial-ink placeholder-neutral-400 focus:outline-none font-sans transition-all duration-200"
                  />
                </div>
              </div>

              {/* Role Picker */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-editorial-ink uppercase tracking-wider font-mono">
                  I am registering as a
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => {
                    const isSelected = selectedRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRole(r)}
                        className={`px-3 py-3 border text-[10px] font-bold rounded-lg uppercase tracking-wider text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-500 text-white border-transparent shadow-sm"
                            : "bg-muted/10 border-border text-editorial-ink-light hover:border-brand-500/40 hover:text-editorial-ink"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Platform Multi-select Checklist */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-editorial-ink uppercase tracking-wider font-mono">
                    Channels you actively publish on
                  </label>
                  <span className="text-[9px] font-mono text-editorial-ink-light uppercase tracking-wide">Select all</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PLATFORMS.map((plat) => {
                    const isSelected = selectedPlatforms.includes(plat.name);
                    return (
                      <button
                        key={plat.name}
                        type="button"
                        onClick={() => togglePlatform(plat.name)}
                        className={`flex flex-col items-center justify-center p-3 border rounded-lg gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-500 text-white border-transparent shadow-sm"
                            : "bg-muted/10 border-border text-editorial-ink-light hover:border-brand-500/40 hover:text-editorial-ink"
                        }`}
                      >
                        <span className="text-xl select-none">{plat.icon}</span>
                        <span className="text-[9px] font-bold tracking-wider uppercase leading-tight">
                          {plat.name.split("/")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Referral Callback Notification */}
              {referrerCode && (
                <div className="bg-brand-500/5 border border-brand-500/20 rounded-lg px-4 py-3 flex items-start gap-3">
                  <PartyPopper className="w-5 h-5 text-brand-500 shrink-0" />
                  <p className="text-[11px] text-editorial-ink leading-normal font-bold">
                    YOU'VE BEEN INVITED! Joining now will move both of you up in line.
                  </p>
                </div>
              )}

              {/* Error Box */}
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3 flex items-start gap-3 text-rose-500 text-xs font-mono font-bold">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Privacy and Terms Consent */}
              <div className="flex items-start gap-2.5 pt-1 pb-1">
                <input
                  id="agree-terms"
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-border text-brand-500 focus:ring-brand-500/30 accent-brand-500 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-[11px] text-editorial-ink-light leading-normal select-none cursor-pointer">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => onNavigate?.("/privacy")}
                    className="text-brand-500 hover:underline font-bold focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500/50 rounded px-0.5 cursor-pointer"
                  >
                    Privacy Policy
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => onNavigate?.("/terms")}
                    className="text-brand-500 hover:underline font-bold focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500/50 rounded px-0.5 cursor-pointer"
                  >
                    Terms of Service
                  </button>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !agreed}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 shadow-sm ${
                  (isLoading || !agreed) ? "opacity-45 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Securing dispatch hook...</span>
                  </>
                ) : (
                  <>
                    <span>Claim dispatch deck</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-editorial-ink-light uppercase tracking-wider mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                <span>Your data is safe and encrypted.</span>
              </div>
            </form>
          </motion.div>
        ) : (
          /* SUCCESS VIEW */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6 py-2"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center mb-4 shadow-sm">
                <PartyPopper className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                You're on the list!
              </h3>
              <p className="text-sm text-editorial-ink-light max-w-sm mt-1.5 mx-auto leading-relaxed">
                Thanks for signing up! We will send you an invite as soon as your spot is ready.
              </p>
            </div>

            {/* Position Box */}
            <div className="bg-muted/10 border border-border rounded-xl p-5 max-w-sm mx-auto shadow-sm flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold text-editorial-ink-light uppercase tracking-wider">
                YOUR SPOT IN LINE
              </span>
              <span className="text-3xl font-bold tracking-tight text-brand-500 font-mono mt-1">
                #{signupResult.position.toLocaleString()}
              </span>
              
              <div className="h-px w-full bg-border/30 my-3.5" />

              <div className="flex items-center gap-2 text-xs text-neutral-900 dark:text-neutral-50 font-semibold uppercase tracking-wider font-sans leading-none">
                <Clock className="w-4 h-4 text-brand-500" />
                <span>ESTIMATED ROLLOUT: <strong className="text-brand-500">BATCH 2</strong></span>
              </div>
            </div>

            {/* Referral Sharing Area */}
            <div className="space-y-4 pt-2">
              <div className="text-center max-w-sm mx-auto">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Move up in line!</h4>
                <p className="text-xs text-editorial-ink-light mt-0.5">
                  Move up 12 spots for every friend who signs up using your link:
                </p>
              </div>

              {/* Referral Link Copy Input */}
              <div className="flex gap-2 max-w-md mx-auto">
                <div className="flex-1 bg-muted/20 border border-border rounded-lg px-4 py-2.5 text-left truncate text-xs font-mono text-editorial-ink-light flex items-center">
                  {window.location.origin}?ref={signupResult.referralCode}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-4 bg-card rounded-lg border border-border hover:bg-muted text-editorial-ink hover:text-brand-500 transition-all text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-brand-500" />
                      <span className="text-brand-500 text-[10px]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px]">COPY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Share buttons */}
              <div className="flex justify-center gap-2 max-w-sm mx-auto pt-1">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Just claimed early access to pubo! A single command center to connect all social channels and schedule queues. Secure your spot: ${window.location.origin}?ref=${signupResult.referralCode}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3.5 bg-card rounded-lg border border-border hover:bg-muted text-editorial-ink text-xs font-bold uppercase tracking-wide transition-all"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>Tweet</span>
                </a>
                
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    `${window.location.origin}?ref=${signupResult.referralCode}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3.5 bg-card rounded-lg border border-border hover:bg-muted text-editorial-ink text-xs font-bold uppercase tracking-wide transition-all"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>Share</span>
                </a>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-2">
              <button
                onClick={() => setSignupResult(null)}
                className="text-[10px] text-editorial-ink-light hover:text-brand-500 hover:underline font-mono uppercase tracking-wider font-bold cursor-pointer transition-colors duration-200"
              >
                Register alternative address
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default WaitlistForm;
