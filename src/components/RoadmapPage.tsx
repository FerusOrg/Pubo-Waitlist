import React from "react";
import { CheckCircle2, PlayCircle, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface RoadmapPageProps {
  onNavigateHome: () => void;
  onJoinWaitlist: () => void;
}

export default function RoadmapPage({ onNavigateHome, onJoinWaitlist }: RoadmapPageProps) {
  const steps = [
    {
      status: "completed",
      title: "Completed",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      items: [
        {
          name: "Waitlist Website",
          description: "High-performance referral waitlist landing stack with localized stats counter."
        },
        {
          name: "Branding",
          description: "Visual guidelines, premium palette design, and custom vector icons."
        },
        {
          name: "Landing Page",
          description: "Responsive, semantic, accessible presentation layer introducing Composer Lab."
        }
      ]
    },
    {
      status: "progress",
      title: "In Progress",
      badgeColor: "bg-brand-500/10 text-brand-500 border-brand-500/20",
      icon: <PlayCircle className="w-5 h-5 text-brand-500 animate-pulse" />,
      items: [
        {
          name: "Authentication",
          description: "Enterprise-grade authorization and authentication controls supporting modern OAuth flows."
        },
        {
          name: "Dashboard",
          description: "Intuitive multi-network commander desk showing draft grids and active social queues."
        },
        {
          name: "AI Writer",
          description: "Contextual engine tailored to generate specific network-optimized copy suggestions."
        },
        {
          name: "Social Connections",
          description: "Official direct publishing integrations for Twitter/X, LinkedIn, Threads, and Instagram."
        }
      ]
    },
    {
      status: "planned",
      title: "Planned",
      badgeColor: "bg-muted/30 text-editorial-ink-light border-border",
      icon: <Calendar className="w-5 h-5 text-editorial-ink-light" />,
      items: [
        {
          name: "Analytics",
          description: "Comprehensive cross-platform metrics dashboard showing click-throughs and viral velocity."
        },
        {
          name: "Team Collaboration",
          description: "Shared workspace access controls with draft approvals, feedback loops, and audit trails."
        },
        {
          name: "Mobile App",
          description: "Companion publishing controls to edit schedules and push updates from anywhere."
        },
        {
          name: "API",
          description: "Secure REST APIs enabling external system hooks to trigger automated social queues."
        },
        {
          name: "Browser Extension",
          description: "Instant clipper to capture assets and draft posts directly from any web browser."
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-10 pb-20">
      {/* Back to Home Button */}
      <div className="mb-8">
        <button
          onClick={onNavigateHome}
          className="group flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-editorial-ink-light hover:text-brand-500 cursor-pointer transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Landing</span>
        </button>
      </div>

      {/* Header section */}
      <header className="mb-16">
        <span className="cyber-badge mb-3">Product Roadmap</span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4 leading-none">
          Pubo Progress Map
        </h1>
        <p className="text-sm sm:text-base text-editorial-ink-light max-w-2xl leading-relaxed">
          We believe in complete transparency. Follow our exact progress as we transition from a high-fidelity waitlist into a complete social media management command deck.
        </p>
      </header>

      {/* Timeline steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, stepIndex) => (
          <motion.section 
            key={step.title}
            aria-labelledby={`roadmap-col-${stepIndex}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: stepIndex * 0.1 }}
            className="flex flex-col bg-card border border-border rounded-xl p-6 relative shadow-xs"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-border/30 pb-4 mb-6">
              <h2 id={`roadmap-col-${stepIndex}`} className="text-base font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2.5">
                {step.icon}
                <span>{step.title}</span>
              </h2>
              <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 border rounded ${step.badgeColor}`}>
                {step.items.length} items
              </span>
            </div>

            {/* List of features */}
            <div className="space-y-4 flex-1">
              {step.items.map((item, idx) => (
                <div 
                  key={item.name} 
                  className="p-4 bg-muted/10 border border-border/30 rounded-lg transition-all duration-200 hover:border-brand-500/25 group"
                >
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wide group-hover:text-brand-500 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-editorial-ink-light leading-relaxed mt-1.5">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Call to action panel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 bg-muted/15 border border-border rounded-xl p-8 text-center max-w-2xl mx-auto flex flex-col items-center gap-4"
      >
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Want priority rollout access?
        </h3>
        <p className="text-xs text-editorial-ink-light max-w-md leading-relaxed">
          Join our waitlist and receive real-time notifications, preview builds, and dispatch deck availability updates as they go live.
        </p>
        <button
          onClick={onJoinWaitlist}
          className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg shadow-sm inline-flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
        >
          <span>Claim priority dispatch slot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
}
