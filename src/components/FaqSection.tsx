import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FaqSection = React.memo(function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: "faq-1",
      question: "How does Pubo publish to all networks simultaneously?",
      answer: "Pubo connects directly to the official API of each network. When you write a post in our composer, it automatically handles character limits, image sizing, and formatting for each app before sending it out instantly."
    },
    {
      id: "faq-2",
      question: "Are my accounts secure?",
      answer: "Yes. Pubo doesn't store your passwords. We connect to each social platform securely using official, secure authorization. You can revoke access at any time from your social media settings."
    },
    {
      id: "faq-3",
      question: "Which platforms are supported at launch?",
      answer: "We support direct posting to Twitter/X, LinkedIn, Instagram, and Threads. Support for TikTok, YouTube, and Facebook is coming soon in the next update."
    },
    {
      id: "faq-4",
      question: "Will signing up for the waitlist get me free access?",
      answer: "Yes! Early waitlist signups get permanent free access to basic tools. This includes 30 automated posts every month, lifetime draft rendering, and priority access to new features."
    },
    {
      id: "faq-5",
      question: "How does the referral system work?",
      answer: "When someone joins the waitlist using your referral link, your spot moves up by 12 places. Top referrers will also get early invites to test our private beta."
    }
  ];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 scroll-mt-28 flex flex-col items-center">
      
      {/* FAQ Header */}
      <div className="text-center max-w-xl mx-auto mb-12 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-editorial-ink-light mt-2 leading-relaxed">
          Everything you need to know about cross-posting, security, and waitlist rewards.
        </p>
      </div>

      {/* Accordion Container */}
      <div className="w-full max-w-3xl mx-auto space-y-4">
        {faqData.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              id={faq.id}
              className={`bg-card border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? "border-brand-500/40 shadow-sm" : "border-border hover:border-brand-500/30"}`}
            >
              {/* Accordion Header Trigger */}
              <button
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${faq.id}`}
                className="w-full flex items-center justify-between text-left p-5 sm:p-5.5 font-sans text-editorial-ink font-bold text-xs sm:text-sm tracking-tight cursor-pointer hover:bg-brand-500/5 transition-colors duration-200 select-none group"
              >
                <span className="flex items-center gap-3.5 pr-4">
                  <span className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center border text-[10px] font-mono font-bold transition-all duration-300 ${isOpen ? "bg-brand-500 border-transparent text-white" : "bg-muted border-border text-editorial-ink-light group-hover:border-brand-500"}`}>
                    ?
                  </span>
                  <span className="group-hover:text-brand-500 transition-colors duration-200 leading-tight text-neutral-900 dark:text-neutral-50">
                    {faq.question}
                  </span>
                </span>
                
                {/* Indicator icon */}
                <div className={`p-1.5 rounded-lg border transition-all duration-300 ${isOpen ? "bg-brand-500 border-transparent text-white rotate-180" : "bg-card border-border text-editorial-ink"}`}>
                  {isOpen ? (
                    <Minus className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>

              {/* Accordion Content Panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`panel-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-1.5 border-t border-border/30">
                      <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed whitespace-normal font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Subtle Support Note */}
      <p className="text-center text-[10px] text-editorial-ink-light/80 font-mono uppercase tracking-widest mt-10">
        * Have questions? Contact us at <span className="text-brand-500 font-bold hover:underline cursor-pointer">support@pubo.io</span> *
      </p>
    </section>
  );
});

export default FaqSection;
