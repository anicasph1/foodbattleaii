export default function TopoBg() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <svg
        viewBox="0 0 800 800"
        className="w-[200%] h-[200%] opacity-[0.08]"
      >
        <path d="M0 200 Q200 100 400 200 T800 200" stroke="white" fill="none"/>
        <path d="M0 300 Q200 200 400 300 T800 300" stroke="white" fill="none"/>
        <path d="M0 400 Q200 300 400 400 T800 400" stroke="white" fill="none"/>
      </svg>
    </div>
  );
}
