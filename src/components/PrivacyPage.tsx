import React from "react";
import { ArrowLeft, Shield, Mail, Lock, CheckCircle } from "lucide-react";

interface PrivacyPageProps {
  onNavigateHome: () => void;
}

export default function PrivacyPage({ onNavigateHome }: PrivacyPageProps) {
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
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Legal Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-editorial-ink-light font-mono">
            Last Updated: {lastUpdated}
          </p>
        </header>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-xs sm:text-sm text-editorial-ink leading-relaxed font-sans">
            At Pubo, we build social media software with a deep respect for developer transparency and individual privacy. This Privacy Policy details how we handle information collected through our waitlist signup website and our communication systems.
          </p>
        </section>

        {/* Collected Information */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            1. Information We Collect
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/10 border border-border/40 rounded-lg">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase">Email Address</h3>
              <p className="text-[11px] text-editorial-ink-light mt-1.5 leading-relaxed">
                We collect your primary email address to send onboarding instructions, waiting list position updates, and invite keys.
              </p>
            </div>
            <div className="p-4 bg-muted/10 border border-border/40 rounded-lg">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase">User Attributes (Optional)</h3>
              <p className="text-[11px] text-editorial-ink-light mt-1.5 leading-relaxed">
                When signing up, you may provide your primary creator role and target platforms (e.g., LinkedIn, Instagram) to help us tailor our release features.
              </p>
            </div>
            <div className="p-4 bg-muted/10 border border-border/40 rounded-lg">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase">Browser & Device Information</h3>
              <p className="text-[11px] text-editorial-ink-light mt-1.5 leading-relaxed">
                We automatically record connection parameters, browser type, viewport dimensions, and operational systems to optimize responsive page layouts.
              </p>
            </div>
            <div className="p-4 bg-muted/10 border border-border/40 rounded-lg">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase">Technical Analytics</h3>
              <p className="text-[11px] text-editorial-ink-light mt-1.5 leading-relaxed">
                We track anonymous engagement events to understand visitor counts, click-through rates, and average referral pipeline speed.
              </p>
            </div>
          </div>
        </section>

        {/* How Information is Used */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            2. How We Utilize Collected Data
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            We operate strictly on a necessity-only data pipeline. We use your data to:
          </p>
          <ul className="space-y-2 text-xs text-editorial-ink-light pl-4 list-disc leading-relaxed">
            <li>Dispatch queue notifications and waiting list spot confirmations.</li>
            <li>Provide timely product updates, weekly changelogs, and core beta releases.</li>
            <li>Improve Pubo platform routing, response times, and UI performance parameters.</li>
            <li>Deliver dedicated technical customer support to resolve system issues.</li>
          </ul>
        </section>

        {/* Retention & Security */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            3. Data Retention & Cookies
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            We store waitlist email addresses in secure database arrays until you request deletion. Our platform utilizes light client-side browser tokens (Cookies/LocalStorage) to persist visual state preferences (like dark mode styling) and active referral tracking codes.
          </p>
        </section>

        {/* Third Party Services */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            4. Third-Party Services
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            We do not sell, rent, or distribute your email addresses to external third parties. We utilize highly reliable infrastructure providers (like Firebase Firestore and safe analytics nodes) strictly to host the application and store secure credentials.
          </p>
        </section>

        {/* User Rights */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-mono">
            5. Your Rights (GDPR & CCPA Alignment)
          </h2>
          <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            You maintain absolute sovereignty over your metadata. You have the right to request a copy of your sign-up data, correct any typo, or request immediate complete deletion of your registration profile from our active database.
          </p>
        </section>

        {/* Contact Placeholder */}
        <section className="bg-muted/15 border border-border/50 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-brand-500" />
              <span>Contact Privacy Officer</span>
            </h4>
            <p className="text-[11px] text-editorial-ink-light leading-relaxed max-w-sm">
              If you have any questions or request a full record purge, reach our data team.
            </p>
          </div>
          <span className="self-start sm:self-center px-4 py-2 bg-card border border-border font-mono text-[10px] text-brand-500 rounded font-bold">
            privacy@pubowaitlist.com
          </span>
        </section>
      </article>
    </div>
  );
}
