export default function WaterDrop({ size = 48, color = "#0066cc" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 4C24 4 16 18 16 26C16 32.627 19.582 38 24 38C28.418 38 32 32.627 32 26C32 18 24 4 24 4Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="24" cy="28" r="4" fill={color} opacity="0.6" />
    </svg>
  );
}
