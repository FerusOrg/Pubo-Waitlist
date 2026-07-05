import React from "react";
import { ArrowLeft, BookOpen, Clock, Sparkles, Send, Bell } from "lucide-react";
import { motion } from "motion/react";

interface BlogPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onJoinWaitlist: () => void;
}

const PREPLANNED_ARTICLES = [
  {
    slug: "how-to-schedule-instagram-posts",
    title: "How to Schedule Instagram Posts Efficiently using AI",
    date: "Coming Soon",
    readTime: "4 min read",
    category: "Guides",
    summary: "A complete step-by-step masterclass on optimal queue creation and programmatic dispatch timing.",
    bullets: [
      "Optimal timing windows for high-impact visual grids",
      "Draft synchronization with model-based image suggestions",
      "Automating thread extensions and caption tailoring"
    ]
  },
  {
    slug: "buffer-vs-hootsuite-vs-pubo",
    title: "The Evolution of Schedulers: Buffer vs Hootsuite vs Pubo",
    date: "Coming Soon",
    readTime: "6 min read",
    category: "Comparisons",
    summary: "An objective comparison of publishing architectures, scheduling precision, and visual previews.",
    bullets: [
      "Comparison of traditional single-network pipelines",
      "Why multi-network composer layout reduces draft overhead by 70%",
      "How dynamic real-time modeling ensures pixel-perfect content"
    ]
  },
  {
    slug: "ai-social-media-management",
    title: "AI-Powered Social Media Management: The Next Frontier",
    date: "Coming Soon",
    readTime: "5 min read",
    category: "AI Platforms",
    summary: "Understanding the paradigm shift from standard text templates to highly localized, model-driven publishing decks.",
    bullets: [
      "Why template builders fail to retain brand authenticity",
      "How local context mapping optimizes click-through rates",
      "Using lightweight models to maintain cross-network cohesion"
    ]
  }
];

export default function BlogPage({ currentPath, onNavigate, onJoinWaitlist }: BlogPageProps) {
  // Extract specific slug if currentPath looks like "/blog/slug"
  const slug = currentPath.startsWith("/blog/") ? currentPath.replace(/^\/blog\//, "") : "";
  const activeArticle = slug ? PREPLANNED_ARTICLES.find((a) => a.slug === slug) : null;

  if (activeArticle) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 pt-10 pb-20">
        {/* Back to Blog directory */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate("/blog")}
            className="group flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-editorial-ink-light hover:text-brand-500 cursor-pointer transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Publications</span>
          </button>
        </div>

        {/* Article content header */}
        <article className="space-y-8 bg-card border border-border rounded-xl p-8 sm:p-10 shadow-xs relative">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-ink-light">
            <span className="px-2 py-0.5 bg-brand-500/5 text-brand-500 border border-brand-500/10 rounded">{activeArticle.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{activeArticle.readTime}</span>
            <span>•</span>
            <span className="text-brand-500 font-black">{activeArticle.date}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            {activeArticle.title}
          </h1>

          <p className="text-sm sm:text-base text-editorial-ink leading-relaxed font-sans border-l-2 border-brand-500/30 pl-4 py-1 italic">
            {activeArticle.summary}
          </p>

          <div className="h-px w-full bg-border/40 my-8" />

          {/* Educational Placeholder Body */}
          <section className="space-y-6 text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
            <p>
              This publication is currently being written by our core product engineers and marketing scientists. It will detail the specific tactics we are utilizing to automate and streamline content dispatch at Pubo.
            </p>
            
            <p className="font-bold text-neutral-900 dark:text-neutral-50">
              Key topics that will be unpacked in this article:
            </p>

            <ul className="list-disc pl-5 space-y-2 text-xs font-mono text-editorial-ink-light">
              {activeArticle.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>

            <div className="bg-brand-500/5 border border-brand-500/10 rounded-lg p-5 mt-8 space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>Want an email notification when this goes live?</span>
              </h4>
              <p className="text-[11px] leading-relaxed">
                We're deploying articles in weekly batches. Sign up for our Waitlist priority queue to be notified as soon as our articles, guides, and initial product builds are released.
              </p>
              <button
                onClick={onJoinWaitlist}
                className="mt-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider rounded inline-flex items-center gap-1.5 transition-all"
              >
                <span>Join public waitlist</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        </article>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-10 pb-20">
      {/* Back to Home Button */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate("/")}
          className="group flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-editorial-ink-light hover:text-brand-500 cursor-pointer transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Landing</span>
        </button>
      </div>

      {/* Header section */}
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <span className="cyber-badge mb-3">BUILDING IN PUBLIC</span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4 leading-none">
          Building Pubo in Public
        </h1>
        <p className="text-xs sm:text-sm text-editorial-ink-light leading-relaxed">
          We're documenting every single step of building Pubo. Real engineering logs, design iterations, and cross-platform growth guides.
        </p>
      </header>

      {/* Primary Empty State with Clean Architectural Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Empty State Banner (Main content area) */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-14 h-14 bg-brand-500/5 rounded-full border border-brand-500/10 flex items-center justify-center mb-6">
            <BookOpen className="w-6 h-6 text-brand-500" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            No articles yet
          </h2>
          <p className="text-xs text-editorial-ink-light max-w-xs mt-2 leading-relaxed">
            Our writing crew is busy crafting pristine documentation. Check our planned topics on the right, or register to stay notified!
          </p>
          <button
            onClick={onJoinWaitlist}
            className="mt-6 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg shadow-sm inline-flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <span>Join Waitlist</span>
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sidebar displaying Upcoming Planned Articles */}
        <aside className="space-y-4">
          <h3 className="text-[10px] font-bold text-editorial-ink uppercase tracking-wider font-mono">
            Upcoming Publications
          </h3>
          <div className="space-y-3">
            {PREPLANNED_ARTICLES.map((article) => (
              <button
                key={article.slug}
                onClick={() => onNavigate(`/blog/${article.slug}`)}
                className="w-full text-left p-4 bg-muted/10 border border-border rounded-lg transition-all duration-200 hover:border-brand-500/30 hover:bg-muted/20 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[9px] font-mono text-editorial-ink-light">
                  <span className="uppercase tracking-wider font-bold">{article.category}</span>
                  <span>{article.readTime}</span>
                </div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 mt-1.5 leading-snug group-hover:text-brand-500 transition-colors">
                  {article.title}
                </h4>
                <p className="text-[10px] text-editorial-ink-light line-clamp-2 mt-1 leading-normal">
                  {article.summary}
                </p>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
