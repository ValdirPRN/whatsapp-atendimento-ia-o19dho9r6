export function PulsingBorder() {
  const text = 'AgentPro Audit • Real-time Monitoring • '

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 rounded-full animate-ping bg-cyan-500/20"
        style={{ animationDuration: '3s' }}
      />
      <div className="relative flex items-center justify-center w-28 h-28 rounded-full border border-cyan-500/30 bg-black/40 backdrop-blur-sm filter-glass">
        <svg
          viewBox="0 0 100 100"
          className="absolute w-full h-full animate-[spin_10s_linear_infinite]"
        >
          <path
            id="circlePath"
            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
            fill="transparent"
          />
          <text
            fontSize="8.5"
            fill="#06b6d4"
            className="font-mono tracking-widest uppercase filter-text-glow"
          >
            <textPath href="#circlePath" startOffset="0%">
              {text}
            </textPath>
          </text>
        </svg>
        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-pulse" />
      </div>
    </div>
  )
}
