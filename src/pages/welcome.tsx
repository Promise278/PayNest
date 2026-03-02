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
    } catch (err) {
      setError("Unlock failed");
    } finally {
      setIsUnlocking(false);
    }
  };

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
      <div className="flex flex-col items-center space-y-6 relative z-10 w-full">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full border border-blue-500/20 animate-ring-pulse" />
          <div
            className="absolute -inset-8 rounded-full border border-blue-500/10 animate-ring-pulse"
            style={{ animationDelay: "0.5s" }}
          />

          {/* Logo */}
          <div className="w-32 h-32 rounded-full m-2 flex items-center justify-center border-2 border-blue-500 animate-logo-pulse bg-black/50 backdrop-blur">
            <p className="text-blue-500 text-2xl font-black italic">Pay<span className="text-white">Nest</span> </p>
          </div>
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-2xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Your secure gateway to the blockchain</p>
        </div>

        {/* Unlock Flow */}
        {hasWallet ? (
          <div className="w-full max-w-xs space-y-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all font-bold"
              />
            </div>
            {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
            <button
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isUnlocking ? "Unlocking..." : "Unlock Wallet"}
            </button>

            {/* <button
              onClick={() => {
                if (confirm("This will permanently remove your current wallet from this device. Make sure you have your seed phrase saved!")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full text-xs text-gray-600 hover:text-red-500 transition-colors uppercase font-black tracking-widest pt-2"
            >
              Forgot Password?
            </button> */}

          </div>
        ) : (
          /* Initial Setup Flow */
          <div
            className="flex flex-col space-y-3 w-full max-w-xs mt-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}>
            <button
              onClick={() => navigate("/create")}
              className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]">
              Create New Wallet
            </button>
            <button
              onClick={() => navigate("/import")}
              className="w-full py-4 bg-white/5 backdrop-blur border border-white/10 text-gray-300 hover:bg-white/10 hover:border-blue-500/30 font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Import Wallet
            </button>
          </div>
        )}
      </div>

      <p className="absolute bottom-6 text-blue-500/20 text-[10px] font-black uppercase tracking-[0.3em]">PayNest v1.2.0 • Sepolia</p>
    </div>
  );
}

export default Welcome;
