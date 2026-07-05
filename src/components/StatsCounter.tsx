import React from "react";
import { Users } from "lucide-react";

interface StatsCounterProps {
  totalCount: number;
}

export default function StatsCounter({ totalCount }: StatsCounterProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 mt-2 w-full max-w-xl mx-auto">
      {/* Stats Card */}
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 px-6 py-4.5 bg-card border border-border rounded-xl shadow-sm w-full transition-all duration-300">
        {/* Counters */}
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-editorial-ink font-mono">
              {totalCount.toLocaleString()}
            </span>
            <Users className="w-4.5 h-4.5 text-brand-500" />
          </div>
          <p className="text-[11px] text-editorial-ink-light font-sans mt-0.5 leading-tight font-medium">
            Publishers and creators waiting in line.
          </p>
        </div>
      </div>
    </div>
  );
}
