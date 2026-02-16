export default function Geophysical({ size = 48, color = "#2d7a4d" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Scanning device */}
      <rect
        x="12"
        y="6"
        width="24"
        height="4"
        stroke={color}
        strokeWidth="2"
        fill="none"
        rx="2"
      />

      {/* Scanning lines */}
      <line
        x1="10"
        y1="16"
        x2="38"
        y2="16"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.7"
      />
      <line
        x1="10"
        y1="22"
        x2="38"
        y2="22"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.5"
      />
      <line
        x1="10"
        y1="28"
        x2="38"
        y2="28"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* Signal waves */}
      <circle
        cx="24"
        cy="24"
        r="8"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <circle
        cx="24"
        cy="24"
        r="12"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />

      {/* Stand/probe */}
      <path
        d="M20 40 L24 34 L28 40"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <line x1="18" y1="40" x2="30" y2="40" stroke={color} strokeWidth="2" />
    </svg>
  );
}
