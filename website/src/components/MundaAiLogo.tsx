import React from "react";

interface MundaAiLogoProps {
  variant?: "icon" | "horizontal" | "stacked";
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark" | "auto";
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  iconClassName?: string;
}

export const MundaAiLogo: React.FC<MundaAiLogoProps> = ({
  variant = "horizontal",
  size = "md",
  theme = "auto",
  showSubtitle = false,
  subtitleText = "Smart Farming Zimbabwe",
  className = "",
  iconClassName = "",
}) => {
  // Dimension definitions based on size
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const textSizes = {
    sm: "text-lg tracking-[0.24em]",
    md: "text-xl tracking-[0.28em]",
    lg: "text-2xl tracking-[0.3em]",
    xl: "text-4xl tracking-[0.32em]",
  };

  const textColor =
    theme === "light"
      ? "text-[#1C1F24]"
      : theme === "dark"
      ? "text-white"
      : "text-white group-hover:text-emerald-300 transition-colors";

  const subtitleColor =
    theme === "light"
      ? "text-stone-500"
      : theme === "dark"
      ? "text-stone-400"
      : "text-stone-400";

  // The Icon SVG - Exact reproduction of the uploaded MundaAI Logo
  // Dark squircle container, bold white M, centered golden leaf with midrib
  const IconSvg = (
    <svg
      viewBox="0 0 512 512"
      className={`${iconSizes[size]} ${iconClassName} shrink-0 drop-shadow-md transition-transform`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MundaAI Logo Icon"
    >
      <defs>
        {/* Warm Golden Harvest Gradients */}
        <linearGradient id="mundaLeafLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DEAA48" />
          <stop offset="100%" stopColor="#B68028" />
        </linearGradient>
        <linearGradient id="mundaLeafRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E9BD65" />
          <stop offset="100%" stopColor="#C48E32" />
        </linearGradient>
      </defs>

      {/* Dark Rounded Squircle Background */}
      <rect
        x="16"
        y="16"
        width="480"
        height="480"
        rx="124"
        ry="124"
        fill="#1C1F24"
      />

      {/* Stylized White Letter "M" */}
      <path
        d="M 94 124 L 154 124 L 256 322 L 358 124 L 418 124 L 418 388 L 360 388 L 360 216 L 274 382 L 238 382 L 152 216 L 152 388 L 94 388 Z"
        fill="#FFFFFF"
      />

      {/* Golden Leaf nestled inside the central notch */}
      <g>
        {/* Left Leaf Half */}
        <path
          d="M 256 160 C 220 205 212 280 255.5 348 L 255.5 160 Z"
          fill="url(#mundaLeafLeft)"
        />
        {/* Right Leaf Half */}
        <path
          d="M 256 160 C 292 205 300 280 256.5 348 L 256.5 160 Z"
          fill="url(#mundaLeafRight)"
        />
        {/* Leaf Center Vein / Midrib */}
        <line
          x1="256"
          y1="166"
          x2="256"
          y2="344"
          stroke="#1C1F24"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  if (variant === "icon") {
    return <div className={`inline-flex items-center ${className}`}>{IconSvg}</div>;
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        {IconSvg}
        <div className="space-y-0.5">
          <span
            className={`block font-extrabold lowercase font-['Outfit',sans-serif] ${textSizes[size]} ${textColor}`}
          >
            mundaai
          </span>
          {showSubtitle && (
            <span className={`block text-xs font-medium ${subtitleColor}`}>
              {subtitleText}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {IconSvg}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={`font-extrabold lowercase font-['Outfit',sans-serif] ${textSizes[size]} ${textColor}`}
          >
            mundaai
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Zimbabwe
          </span>
        </div>
        {showSubtitle && (
          <p className={`text-xs font-medium ${subtitleColor} line-clamp-1`}>
            {subtitleText}
          </p>
        )}
      </div>
    </div>
  );
};
