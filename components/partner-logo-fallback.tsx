interface PartnerLogoFallbackProps {
  name?: string;
  size?: number;
  className?: string;
}

export function PartnerLogoFallback({ 
  name = "Logo", 
  size = 48,
  className = "" 
}: PartnerLogoFallbackProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="100"
        height="100"
        fill="#f3f4f6"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
      <text
        x="50"
        y="50"
        fontSize="32"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="600"
        fill="#6b7280"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {initials}
      </text>
    </svg>
  );
}












