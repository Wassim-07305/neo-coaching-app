"use client";

import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <>
      <style jsx global>{`
        @keyframes page-fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .page-transition-enter {
          animation: page-fade-in 300ms ease-out forwards;
        }
      `}</style>
      <div className={`page-transition-enter ${className}`}>{children}</div>
    </>
  );
}
