

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 5 + Math.random() * 5,
  size: 2 + Math.random() * 4,
}));

function Welcome() {
  return (
    <div className="min-h-full bg-black flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-black via-blue-950/30 to-black animate-gradient" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-blue-500/60 animate-float"
          style={{
            left: `${particle.left}%`,
            bottom: "-10px",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Content */}
      <div className="flex flex-col items-center space-y-6 relative z-10">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full border border-blue-500/20 animate-ring-pulse" />
          <div
            className="absolute -inset-8 rounded-full border border-blue-500/10 animate-ring-pulse"
            style={{ animationDelay: "0.5s" }}
          />

          {/* Logo */}
          <div className="w-38 h-38 rounded-full m-2 overflow-hidden border-2 border-blue-500 animate-logo-pulse">
           <p className="text-blue-500 text-3xl text-center leading-38">Pay<span className="text-white">Nest</span> </p>
          </div>
        </div>

        {/* Buttons */}
        <div
          className="flex flex-col space-y-3 w-full max-w-xs mt-4 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}>
          <button className="w-full py-3.5 px-6 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]">
            Create Wallet
          </button>
          <button className="w-full py-3.5 px-6 bg-white/5 backdrop-blur border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/50 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            Import Wallet
          </button>
        </div>
      </div>

      <p className="absolute bottom-4 text-blue-300/30 text-xs">v1.0.0</p>
    </div>
  );
}

export default Welcome;
