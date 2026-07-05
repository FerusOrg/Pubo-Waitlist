import React from "react";
import { ArrowLeft, Scale, Mail, Info } from "lucide-react";

interface TermsPageProps {
  onNavigateHome: () => void;
}

export default function TermsPage({ onNavigateHome }: TermsPageProps) {
  const lastUpdated = "July 5, 2026";

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pt-10 pb-20">
      {/* Back link */}
      <div className="mb-8">
        <button
          onClick={onNavigateHome}
          className="group flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-editorial-ink-light hover:text-brand-500 cursor-pointer transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Landing</span>
        </button>
      </div>

      {/* Primary Container */}
      <article className="bg-card border border-border rounded-xl p-8 sm:p-12 shadow-xs space-y-10 text-editorial-ink">
        <header className="border-b border-border/30 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-brand-500">
            <Scale className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Terms of Use</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-editorial-ink-light font-mono">
            Last Updated: {lastUpdated}
          </p>
        </header>

        {/* Acceptance of Terms */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            1. Acceptance of Terms
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            By accessing or interacting with this website, signing up for the Pubo waiting list, or using our referral links, you fully agree to be bound by these Terms of Service. If you do not accept these conditions, you must not register or access our dispatch mechanisms.
          </p>
        </section>

        {/* Use of Website */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            2. Use of the Website
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            You agree to use this landing page strictly for lawful purposes. You are forbidden from deploying programmatic bots, visual crawlers, bulk duplicate signups, email scrapers, or other malicious automation methods designed to interfere with waitlist statistics or client-side simulator calculations.
          </p>
        </section>

        {/* Waitlist Conditions */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            3. Waitlist & Referral Conditions
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            Joining the Pubo waitlist does not guarantee immediate system onboarding, access to core software products, or future commercial licensing. Spots are distributed based on active sign-up times and authentic referral metrics. We reserve the absolute right to disqualify or clear database registrations that we determine, in our sole discretion, are synthetic, fraudulent, or manipulative.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            4. Intellectual Property
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            All design systems, source code, visual icons, brand typography pairings, responsive simulator drafts, and product documentation displayed on this landing page are the exclusive intellectual property of PUBO Technologies, Inc. and are protected by universal trademark and copyright laws.
          </p>
        </section>

        {/* Schedulers Disclaimers */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            5. Schedulers & Service Disclaimers
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed bg-brand-500/5 border border-brand-500/10 p-4 rounded-lg italic">
            This landing page and waitlist form are provided "as-is" and "as-available" without warranties of any kind. While our Composer Simulator models social feeds with high visual precision, final rendering remains subject to specific, dynamic API policies on Twitter/X, LinkedIn, Threads, and other external social channels.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            6. Limitation of Liability
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            In no event shall PUBO Technologies, Inc., its founders, or service partners be liable for any indirect, consequential, special, or incidental damages arising out of your signup, waiting list position, or platform interaction.
          </p>
        </section>

        {/* Changes to terms */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            7. Changes to Terms
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            We reserve the absolute right to edit or replace these Terms of Service at any time. When we make edits, we will revise the last updated date listed above. Continued interaction with our waitlist constitutes full acceptance of any updated terms.
          </p>
        </section>

        {/* Contact info */}
        <section className="bg-muted/15 border border-border/50 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-brand-500" />
              <span>Contact Legal Team</span>
            </h4>
            <p className="text-[11px] text-editorial-ink-light leading-relaxed max-w-sm">
              If you have any compliance inquiries regarding our terms or database procedures, feel free to reach out.
            </p>
          </div>
          <span className="self-start sm:self-center px-4 py-2 bg-card border border-border font-mono text-[10px] text-brand-500 rounded font-bold">
            legal@pubowaitlist.com
          </span>
        </section>
      </article>
    </div>
  );
}
