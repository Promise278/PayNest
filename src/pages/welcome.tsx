import { useNavigate } from "react-router-dom";
import { isWalletSaved } from "../utils/wallet";
import { useWallet } from "../context/WalletContext";
import { useState, useEffect } from "react";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 5 + Math.random() * 5,
  size: 2 + Math.random() * 4,
}));

function Welcome() {
  const navigate = useNavigate();
  const { connectWallet, isConnected } = useWallet();
  const [hasWallet, setHasWallet] = useState(false);
  const [password, setPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setHasWallet(isWalletSaved());
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  const handleUnlock = async () => {
    setIsUnlocking(true);
    setError("");
    try {
      const success = await connectWallet(password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Incorrect password");
      }
    } catch (err: unknown) {
      console.error("unlock error", err);
      setError("Unlock failed");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="min-h-full bg-black flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-black via-zinc-900/40 to-black animate-gradient" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/20 animate-float"
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
      <div className="flex flex-col items-center space-y-6 relative z-10 w-full">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full border border-white/10 animate-ring-pulse" />
          <div
            className="absolute -inset-8 rounded-full border border-white/5 animate-ring-pulse"
            style={{ animationDelay: "0.5s" }}
          />

          {/* Logo */}
          <div className="w-32 h-32 rounded-full m-2 flex items-center justify-center border-2 border-indigo-500/30 animate-logo-pulse bg-linear-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/20">
            <p className="text-white text-2xl font-black italic">
              PayNest{" "}
            </p>
          </div>
        </div>

        <div
          className="text-center animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h1 className="text-2xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-500 text-sm">
            Your sleek gateway to the blockchain
          </p>
        </div>

        {/* Unlock Flow */}
        {hasWallet ? (
          <div
            className="w-full max-w-xs space-y-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-all font-bold"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs text-center font-bold">
                {error}
              </p>
            )}
            <button
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isUnlocking ? "Unlocking..." : "Unlock Wallet"}
            </button>
          </div>
        ) : (
          /* Initial Setup Flow */
          <div
            className="flex flex-col space-y-3 w-full max-w-xs mt-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <button
              onClick={() => navigate("/create")}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Create New Wallet
            </button>
            <button
              onClick={() => navigate("/import")}
              className="w-full py-4 bg-zinc-900 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Import Wallet
            </button>
          </div>
        )}
      </div>

      <p className="absolute bottom-6 text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">
        PayNest v1.2.0 • Sleek Focus
      </p>
    </div>
  );
}

export default Welcome;
