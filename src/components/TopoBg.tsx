export default function TopoBg() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <svg
        viewBox="0 0 800 800"
        preserveAspectRatio="none"
        className="w-[200%] h-[200%] opacity-[0.04] animate-[topoMove_40s_linear_infinite]"
      >
        <defs>
          <pattern
            id="topo"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 20 Q10 0 20 20 T40 20"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#topo)" />
      </svg>
    </div>
  );
}
