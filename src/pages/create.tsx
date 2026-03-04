import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "ethers";
import { saveWallet } from "../utils/wallet";
import { useWallet } from "../context/WalletContext";

const WALLET_STORAGE_KEY = "paynest_wallet";

function CreateWallet() {
  const navigate = useNavigate();
  const { connectWallet } = useWallet();

  const [walletData] = useState(() => {
    const wallet = Wallet.createRandom();
    return {
      address: wallet.address,
      mnemonicWords: wallet.mnemonic ? wallet.mnemonic.phrase.split(" ") : [],
    };
  });

  const mnemonic = walletData.mnemonicWords;
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"phrase" | "password">("phrase");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [hasCopied, setHasCopied] = useState(false);
  const [encryptingStep, setEncryptingStep] = useState<"idle" | "encrypting" | "connecting">("idle");

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic.join(" "));
    setCopied(true); setHasCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveWallet = async () => {
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }

    setIsSaving(true); setError(""); setEncryptingStep("encrypting");
    try {
      await saveWallet(mnemonic.join(" "), password);
      setEncryptingStep("connecting");
      const success = await connectWallet(password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Failed to initialize wallet. Please try again.");
        setEncryptingStep("idle"); setIsSaving(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setEncryptingStep("idle"); setIsSaving(false);
    }
  };

  const handleWalletConfirm = () => {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify({
      address: walletData.address,
      mnemonic: mnemonic.join(" "),
      createdAt: Date.now(),
    }));
    setStep("password");
  };

  // Full-screen encryption overlay
  if (isSaving) {
    return (
      <div className="min-h-full bg-black flex flex-col items-center justify-center p-6">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          {encryptingStep === "encrypting" ? "Encrypting Wallet" : "Almost Ready…"}
        </h2>
        <p className="text-gray-500 text-sm text-center max-w-xs">
          {encryptingStep === "encrypting"
            ? "Securing your wallet with your password. This may take a moment."
            : "Connecting to your wallet and loading your account."}
        </p>
        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (step === "password") {
    return (
      <div className="min-h-full bg-black flex flex-col p-6 animate-fade-in-up">
        <div className="flex items-center mb-8">
          <button onClick={() => setStep("phrase")} className="text-white hover:text-blue-400 transition-colors p-2 -ml-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-2xl font-bold ml-2 text-white">Secure Wallet</h1>
        </div>
        <div className="flex-1 space-y-6">
          <p className="text-gray-400 text-sm">Create a password to encrypt your wallet. You will need this to unlock PayNest.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveWallet()} placeholder="Repeat your password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors" />
            </div>
          </div>
          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{error}</div>}
        </div>
        <button onClick={handleSaveWallet} disabled={isSaving}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 mt-6">
          Finish Setup
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black flex flex-col p-6 relative">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate("/")} className="text-white hover:text-blue-400 transition-colors p-2 -ml-2 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-bold ml-2 text-white">Create Wallet</h1>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <p className="text-gray-400 text-center text-sm mb-6">Write down these 12 words in order and keep them somewhere safe. Anyone with this phrase can access your funds.</p>

        <div className="relative w-full mb-6">
          <div className="grid grid-cols-3 gap-3">
            {mnemonic.map((word, index) => (
              <div key={index} className={`bg-white/5 border border-white/10 rounded-lg p-2 text-center flex flex-col items-center transition-all duration-300 ${!isRevealed ? "blur-[6px] opacity-70" : "blur-0 opacity-100"}`}>
                <span className="text-xs text-blue-500/70 mb-1">{index + 1}</span>
                <span className="text-white font-medium text-sm select-all">{word || "..."}</span>
              </div>
            ))}
          </div>
          {!isRevealed && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
              <svg className="w-8 h-8 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <button onClick={() => setIsRevealed(true)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                Reveal Seed Phrase
              </button>
            </div>
          )}
        </div>

        <div className="w-full space-y-3 mt-auto mb-4">
          <button onClick={handleCopy}
            className={`w-full py-3.5 px-6 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isRevealed ? "bg-white/5 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:scale-[1.02] active:scale-[0.98]" : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:scale-[1.02] active:scale-[0.98]"}`}>
            {copied
              ? <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</>
              : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy to Clipboard</>
            }
          </button>
          <button disabled={!isRevealed && !hasCopied} onClick={handleWalletConfirm}
            className={`w-full py-3.5 px-6 font-semibold rounded-xl transition-all duration-300 ${isRevealed || hasCopied ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]" : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}>
            I saved my seed phrase
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWallet;
