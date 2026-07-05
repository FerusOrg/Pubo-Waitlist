import React, { useState } from "react";
import { Share2 } from "lucide-react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Logo({ className = "", iconOnly = false, size = "md" }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20"
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon - beautiful custom cream 'p' logo with orange sparkle */}
      <div className={`flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 ${sizeClasses[size]}`}>
        {!imageError ? (
          <img 
            src="/logo.svg" 
            alt="PUBO Logo" 
            referrerPolicy="no-referrer"
            fetchPriority="high"
            className="w-full h-full object-contain rounded-[28%]"
            onError={() => setImageError(true)}
          />
        ) : (
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full select-none" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Rounded background squircle */}
            <rect width="100" height="100" rx="28" fill="#FAF3E8" />
            
            {/* Geometrically precise 'p' shape with transparent counter hole */}
            <path 
              d="M 34,46 C 34,34.4 43.4,25 55,25 C 66.6,25 76,34.4 76,46 C 76,57.6 66.6,67 55,67 C 47,67 44.5,62.5 44.5,58 C 44.5,67 36,73 29,74 C 32,70 34,64 34,58 L 34,46 Z M 55,35.5 C 49.2,35.5 44.5,40.2 44.5,46 C 44.5,51.8 49.2,56.5 55,56.5 C 60.8,56.5 65.5,51.8 65.5,46 C 65.5,40.2 60.8,35.5 55,35.5 Z" 
              fill="#1E293B" 
              fillRule="evenodd" 
              clipRule="evenodd" 
            />
            
            {/* The bright orange 4-point sparkle */}
            <path 
              d="M 73,16 Q 73,24 81,24 Q 73,24 73,32 Q 73,24 65,24 Q 73,24 73,16 Z" 
              fill="#F2653C" 
            />
          </svg>
        )}
      </div>
      
      {/* Brand Text */}
      {!iconOnly && (
        <span className="text-xl font-black tracking-tighter text-editorial-ink font-sans transition-colors duration-200">
          PUBO
        </span>
      )}
    </div>
  );
}
