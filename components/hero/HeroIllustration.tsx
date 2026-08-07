export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 480 480"
      role="img"
      aria-label="Abstract illustration of a glowing developer terminal core surrounded by orbiting particles"
      className="h-auto w-[320px] drop-shadow-[0_0_60px_rgba(0,230,118,0.15)] md:w-[420px]"
    >
      <defs>
        <linearGradient id="coreFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4fc3f7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00e676" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="coreFaceDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#171c24" />
          <stop offset="100%" stopColor="#0b0f14" />
        </linearGradient>
        <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00e676" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#00e676" stopOpacity="0" />
        </radialGradient>
        <filter id="softBlur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ambient glow */}
      <circle cx="240" cy="240" r="200" fill="url(#orbGlow)" />

      {/* orbit rings */}
      <ellipse
        cx="240"
        cy="240"
        rx="190"
        ry="60"
        fill="none"
        stroke="#4fc3f7"
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      <ellipse
        cx="240"
        cy="240"
        rx="60"
        ry="190"
        fill="none"
        stroke="#ffc107"
        strokeOpacity="0.14"
        strokeWidth="1"
      />

      {/* faceted diamond core (isometric cube, not a Minecraft block texture) */}
      <g transform="translate(240 230)">
        <polygon points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45" fill="url(#coreFaceDark)" stroke="#4fc3f7" strokeOpacity="0.4" />
        <polygon points="0,-90 78,-45 0,0 -78,-45" fill="url(#coreFace)" fillOpacity="0.9" />
        <polygon points="0,0 78,-45 78,45 0,90" fill="#00e676" fillOpacity="0.25" />
        <polygon points="0,0 -78,-45 -78,45 0,90" fill="#4fc3f7" fillOpacity="0.18" />

        {/* inner command-line glyph, evokes a terminal without literal UI chrome */}
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="20"
          fill="#f5f7fa"
          opacity="0.85"
        >
          {"</>"}
        </text>
      </g>

      {/* redstone-inspired circuit traces, abstracted as glowing lines */}
      <g stroke="#00e676" strokeWidth="1.5" strokeOpacity="0.55" fill="none">
        <path d="M60 380 L150 340 L150 300" />
        <path d="M420 380 L330 340 L330 300" />
        <path d="M60 120 L150 150 L150 190" />
        <path d="M420 120 L330 150 L330 190" />
      </g>
      <circle cx="60" cy="380" r="4" fill="#00e676" filter="url(#softBlur)" />
      <circle cx="420" cy="380" r="4" fill="#ffc107" filter="url(#softBlur)" />
      <circle cx="60" cy="120" r="4" fill="#4fc3f7" filter="url(#softBlur)" />
      <circle cx="420" cy="120" r="4" fill="#00e676" filter="url(#softBlur)" />

      {/* floating particles */}
      <circle cx="120" cy="90" r="2.5" fill="#ffc107" opacity="0.8" />
      <circle cx="370" cy="70" r="2" fill="#4fc3f7" opacity="0.7" />
      <circle cx="90" cy="300" r="2" fill="#00e676" opacity="0.6" />
      <circle cx="400" cy="260" r="2.5" fill="#4fc3f7" opacity="0.7" />
    </svg>
  );
}
