
import * as React from 'react';

export function DistractifyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
    >
      <g transform="translate(0, -5)">
        {/* Phone */}
        <path d="M68,80H32C29.2,80,27,77.8,27,75V35C27,32.2,29.2,30,32,30H68c2.8,0,5,2.2,5,5V75C73,77.8,70.8,80,68,80Z" fill="#FF69B4"/>
        
        {/* Phone Shadow */}
        <path d="M68,80H32C29.2,80,27,77.8,27,75V35C27,32.2,29.2,30,32,30h-2c-2.8,0-5,2.2-5,5V75c0,2.8,2.2,5,5,5h38c2.8,0,5-2.2,5-5v-2C73,77.8,70.8,80,68,80Z" fill="#D81B60" />

        {/* Notch */}
        <path d="M55,34h-10c-0.55,0-1-0.45-1-1v-1c0-0.55,0.45-1,1-1h10c0.55,0,1,0.45,1,1v1C56,33.55,55.55,34,55,34Z" fill="#9400D3"/>
        
        {/* Face */}
        <circle cx="43" cy="50" r="5" fill="white"/>
        <circle cx="43" cy="50" r="2.5" fill="#2c2c2c"/>
        <circle cx="57" cy="50" r="5" fill="white"/>
        <circle cx="57" cy="50" r="2.5" fill="#2c2c2c"/>
        <path d="M45,63c2,5,8,5,10,0" fill="none" stroke="#2c2c2c" strokeWidth="2" strokeLinecap="round"/>
        <path d="M39,44c1-1,4-1,5,0" fill="none" stroke="#2c2c2c" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M56,44c1-1,4-1,5,0" fill="none" stroke="#2c2c2c" strokeWidth="1.5" strokeLinecap="round"/>
        
        {/* Speech Bubble */}
        <path d="M65,30 h15 a5,5 0 0 1 5,5 v15 a5,5 0 0 1 -5,5 h-5 l-5,5 v-5 h-5 a5,5 0 0 1 -5,-5 v-15 a5,5 0 0 1 5,-5 z" fill="white"/>
        
        {/* Exclamation Mark */}
        <path d="M77.5,36 V 45" stroke="#FF69B4" strokeWidth="4" strokeLinecap="round" />
        <circle cx="77.5" cy="50" r="2.5" fill="#FF69B4" />
      </g>
    </svg>
  );
}
