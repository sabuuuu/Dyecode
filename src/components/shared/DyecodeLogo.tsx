"use client";

type DyecodeLogoProps = {
  className?: string;
};

export function DyecodeLogo({ className }: DyecodeLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer squircle frame */}
      <rect
        x="6"
        y="6"
        width="36"
        height="36"
        rx="14"
        ry="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {/* Primary hair strand */}
      <path
        d="M22 10C22 10 18.5 15.5 18.5 20.5C18.5 24 20.5 25.8 21.9 27.1C23.6 28.7 24.8 29.9 24.8 32.2C24.8 34.4 23.7 36 21.3 37"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Secondary softer strand for depth */}
      <path
        d="M28 12.5C28 12.5 25.6 16 25.6 19.3C25.6 21.9 26.8 23.3 27.9 24.5C29.2 25.9 30 27 30 28.9C30 30.8 29.1 32.2 27.4 33.1"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Small root accent */}
      <circle
        cx="23.3"
        cy="14.2"
        r="1.2"
        fill="currentColor"
      />
    </svg>
  );
}

