import React from "react";
import { 
  Zap, 
  Brain, 
  BarChart3, 
  Clock 
} from "lucide-react";
import { motion } from "motion/react";

const FeaturesBento = React.memo(function FeaturesBento() {
  const features = [
    {
      icon: Zap,
      title: "Universal Cross-Posting",
      description: "Draft your announcement once. Pubo automatically optimizes margins, splits text, wraps media, and handles character limits for Twitter, LinkedIn, Instagram, and Threads instantly.",
      badge: "Core Engine",
      gridSpan: "lg:col-span-7"
    },
    {
      icon: Brain,
      title: "Contextual Formatting Logic",
      description: "Auto-adapt your tone. Transform professional, lengthy paragraphs for LinkedIn into punchy, bulleted viral threads for Twitter with one click.",
      badge: "Smart formatting",
      gridSpan: "lg:col-span-5"
    },
    {
      icon: Clock,
      title: "Optimal Engagement Queue",
      description: "Stop guessing. Pubo analyzes each platform's native metrics to publish your updates exactly when your audience clusters are online and active.",
      badge: "Scheduling",
      gridSpan: "lg:col-span-5"
    },
    {
      icon: BarChart3,
      title: "Unified Analytics Engine",
      description: "A single, highly polished control panel. Aggregate reach, click-throughs, and follower trends across 8 connected social streams without logging into individual business managers.",
      badge: "Analytics",
      gridSpan: "lg:col-span-7"
    }
  ];

  return (
    <section className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      
      <div className="text-center max-w-xl mx-auto mb-12 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Optimized Dispatch Deck
        </h2>
        <p className="text-sm text-editorial-ink-light mt-2 leading-relaxed">
          Everything you need to automate, track, and amplify your multi-channel network in a single workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px", amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className={`${feat.gridSpan} bg-card border border-border rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-500/40 transition-all duration-300`}
            >
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-brand-500/10 border border-brand-500/10 text-brand-500 rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-editorial-ink-light leading-relaxed mt-2 font-medium">
                    {feat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
});

export default FeaturesBento;
