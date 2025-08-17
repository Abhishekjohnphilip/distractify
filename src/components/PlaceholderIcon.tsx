
import * as React from 'react';

export function PlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <g>
        {/* Phone Body */}
        <path d="M68,80H32C29.2386,80,27,77.7614,27,75V25C27,22.2386,29.2386,20,32,20H68C70.7614,20,73,22.2386,73,25V75C73,77.7614,70.7614,80,68,80Z" />
        
        {/* Notch */}
        <path d="M45,24H55C55.5523,24,56,23.5523,56,23V22C56,21.4477,55.5523,21,55,21H45C44.4477,21,44,21.4477,44,22V23C44,23.5523,44.4477,24,45,24Z" />
        
        {/* Face */}
        <circle cx="43" cy="45" r="4" />
        <circle cx="57" cy="45" r="4" />
        <path d="M45,58 C47,62 53,62 55,58" strokeLinecap="round" />
        <path d="M39,39 C40,38 43,38 44,39" strokeLinecap="round" />
        <path d="M56,39 C57,38 60,38 61,39" strokeLinecap="round" />

        {/* Speech Bubble */}
        <path d="M65,25 h15 a5,5 0 0 1 5,5 v15 a5,5 0 0 1 -5,5 h-5 l-5,5 v-5 h-5 a5,5 0 0 1 -5,-5 v-15 a5,5 0 0 1 5,-5 z" />
        
        {/* Exclamation Mark */}
        <path d="M77.5,31 V 40" strokeLinecap="round" />
        <circle cx="77.5" cy="45" r="1" fill="currentColor" />
        
      </g>
    </svg>
  );
}
