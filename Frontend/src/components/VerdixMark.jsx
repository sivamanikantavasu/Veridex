import React from 'react'

/*
  VerdixMark — a precision compass-rose seal
  Four cardinal spokes radiating from a central ring, enclosed in a square
  frame with chamfered (cut) corners. Evokes navigation, precision, and
  institutional authority — no book imagery.
*/
export default function VerdixMark({ size = 24, color = 'var(--burgundy-300)' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer frame — square with chamfered corners */}
      <path
        d="M6 2H26L30 6V26L26 30H6L2 26V6L6 2Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner precision ring */}
      <circle cx="16" cy="16" r="3.5" stroke={color} strokeWidth="1.2" fill="none" />
      {/* Cardinal spokes — N / S / E / W */}
      <line x1="16" y1="6"    x2="16" y2="11.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="16" y1="20.5" x2="16" y2="26"   stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="6"  y1="16"   x2="11.5" y2="16" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20.5" y1="16" x2="26"  y2="16"  stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      {/* North arrowhead */}
      <path d="M16 6L14.5 9.5H17.5L16 6Z" fill={color} />
      {/* Diagonal tick marks */}
      <line x1="9.5"  y1="9.5"  x2="11"   y2="11"   stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.45" />
      <line x1="21"   y1="21"   x2="22.5" y2="22.5"  stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.45" />
      <line x1="22.5" y1="9.5"  x2="21"   y2="11"    stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.45" />
      <line x1="11"   y1="21"   x2="9.5"  y2="22.5"  stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.45" />
    </svg>
  )
}
