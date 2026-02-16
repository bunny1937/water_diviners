export default function Borewell({ size = 48, color = "#00a89d" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Borewell pipe */}
      <rect
        x="18"
        y="8"
        width="12"
        height="32"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />

      {/* Water levels inside */}
      <path
        d="M20 28 Q24 26 28 28"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M20 32 Q24 30 28 32"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />

      {/* Ground line */}
      <line x1="10" y1="38" x2="38" y2="38" stroke={color} strokeWidth="2" />

      {/* Pump head */}
      <circle cx="24" cy="6" r="3" fill={color} />
    </svg>
  );
}
