import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPrivateKey, clearWallet } from "../utils/wallet";
import { clearTransactions } from "../utils/transactions";
import { useWallet } from "../context/WalletContext";

const WALLET_STORAGE_KEY = "paynest_wallet";

type StoredWallet = { address: string; mnemonic: string; createdAt?: number };
type ModalType = "none" | "seed" | "privateKey" | "reset";

function Settings() {
  const navigate = useNavigate();
  const { address, logout } = useWallet();
  const [modal, setModal] = useState<ModalType>("none");

  // Seed phrase
  const [seedPassword, setSeedPassword] = useState("");
  const [seedVisible, setSeedVisible] = useState(false);
  const [seedError, setSeedError] = useState("");
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedCopied, setSeedCopied] = useState(false);

  // Private key
  const [pkPassword, setPkPassword] = useState("");
  const [pkValue, setPkValue] = useState("");
  const [pkError, setPkError] = useState("");
  const [pkLoading, setPkLoading] = useState(false);
  const [pkCopied, setPkCopied] = useState(false);

  // Reset
  const [resetConfirmation, setResetConfirmation] = useState("");

  const storedWallet = useMemo<StoredWallet | null>(() => {
    try { return JSON.parse(localStorage.getItem(WALLET_STORAGE_KEY) || "null"); }
    catch { return null; }
  }, []);

  const openModal = (type: ModalType) => {
    setModal(type);
    setSeedPassword(""); setSeedVisible(false); setSeedError(""); setSeedLoading(false); setSeedCopied(false);
    setPkPassword(""); setPkValue(""); setPkError(""); setPkLoading(false); setPkCopied(false);
    setResetConfirmation("");
  };

  const handleRevealSeed = async () => {
    if (!seedPassword) { setSeedError("Please enter your wallet password."); return; }
    setSeedLoading(true); setSeedError("");
    try {
      // Just test if the password can decrypt the private key to verify it
      await getPrivateKey(seedPassword);
      setSeedVisible(true);
    } catch {
      setSeedError("Incorrect password. Please try again.");
    } finally {
      setSeedLoading(false);
    }
  };

  const handleRevealPrivateKey = async () => {
    if (!pkPassword) { setPkError("Please enter your wallet password."); return; }
    setPkLoading(true); setPkError("");
    try { setPkValue(await getPrivateKey(pkPassword)); }
    catch { setPkError("Incorrect password. Please try again."); }
    finally { setPkLoading(false); }
  };

  const handleResetWallet = () => {
    if (address) clearTransactions(address);
    localStorage.removeItem(WALLET_STORAGE_KEY);
    clearWallet();
    logout();
    navigate("/");
  };


  return (
    <div className="min-h-full bg-black flex flex-col p-6 text-white relative">

      {/* Seed Modal */}
      {modal === "seed" && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-30">
          <div className="w-full rounded-2xl border border-white/10 bg-zinc-950 p-6 space-y-4 shadow-2xl shadow-black/80">
            <h2 className="text-lg font-bold">Export Seed Phrase</h2>
            <p className="text-sm text-zinc-400">Enter your wallet password to reveal your seed phrase.</p>
            <input type="password" value={seedPassword} onChange={(e) => setSeedPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRevealSeed()}
              placeholder="Wallet password"
              className="w-full rounded-xl bg-zinc-900 border border-white/5 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors" />
            {seedError && <p className="text-xs text-red-500 font-semibold">{seedError}</p>}

            {seedVisible && storedWallet?.mnemonic && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                <p className="text-xs text-zinc-500 mb-2 font-semibold uppercase tracking-widest">Seed Phrase</p>
                <p className="text-sm break-all select-all leading-relaxed font-mono text-white">{storedWallet.mnemonic}</p>
                <button onClick={() => { navigator.clipboard.writeText(storedWallet.mnemonic); setSeedCopied(true); setTimeout(() => setSeedCopied(false), 2000); }}
                  className={`mt-3 text-sm font-semibold transition-colors ${seedCopied ? "text-green-400" : "text-zinc-300 hover:text-white"}`}>
                  {seedCopied ? "✓ Copied!" : "Copy Seed Phrase"}
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setModal("none")} className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 transition-colors">Close</button>
              {!seedVisible && (
                <button disabled={seedLoading || !seedPassword} onClick={handleRevealSeed}
                  className={`flex-1 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${seedLoading || !seedPassword ? "bg-zinc-900 text-zinc-600 cursor-not-allowed" : "bg-white hover:bg-zinc-200 text-black shadow-lg"}`}>
                  {seedLoading ? (<><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Verifying…</>) : "Reveal Phrase"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Private Key Modal */}
      {modal === "privateKey" && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-30">
          <div className="w-full rounded-2xl border border-red-500/30 bg-zinc-950 p-6 space-y-4 shadow-2xl shadow-black/80">
            <div className="flex gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div>
                <p className="text-sm font-bold text-red-400">⚠ Never share your private key</p>
                <p className="text-xs text-red-300/60 mt-0.5 leading-relaxed">Anyone with your private key has full control of your wallet and all its funds.</p>
              </div>
            </div>
            <h2 className="text-lg font-bold">Export Private Key</h2>
            <p className="text-sm text-zinc-400">Enter your wallet password to reveal your private key.</p>
            <input type="password" value={pkPassword} onChange={(e) => setPkPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRevealPrivateKey()}
              placeholder="Wallet password"
              className="w-full rounded-xl bg-zinc-900 border border-white/5 px-4 py-3 text-sm outline-none focus:border-red-500/50 transition-colors" />
            {pkError && <p className="text-xs text-red-400 font-semibold">{pkError}</p>}
            {pkValue && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 mb-2 font-semibold uppercase tracking-widest">Private Key</p>
                <p className="text-xs break-all select-all font-mono text-white/80 leading-relaxed">{pkValue}</p>
                <button onClick={() => { navigator.clipboard.writeText(pkValue); setPkCopied(true); setTimeout(() => setPkCopied(false), 2000); }}
                  className={`mt-3 text-sm font-semibold transition-colors ${pkCopied ? "text-green-400" : "text-red-400 hover:text-red-300"}`}>
                  {pkCopied ? "✓ Copied!" : "Copy Private Key"}
                </button>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setModal("none")} className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 transition-colors">Close</button>
              {!pkValue && (
                <button disabled={pkLoading || !pkPassword} onClick={handleRevealPrivateKey}
                  className={`flex-1 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${pkLoading || !pkPassword ? "bg-zinc-900 text-zinc-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 text-white shadow-lg"}`}>
                  {pkLoading ? (<><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Decrypting…</>) : "Reveal Key"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset Modal */}
      {modal === "reset" && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-30">
          <div className="w-full rounded-2xl border border-red-500/30 bg-zinc-950 p-6 space-y-4 shadow-2xl shadow-black/80">
            <h2 className="text-lg font-bold text-red-400">Reset Wallet</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">⚠ This removes all wallet data from this device. Make sure you have your seed phrase. Type <span className="font-bold text-white">RESET</span> to continue.</p>
            <input value={resetConfirmation} onChange={(e) => setResetConfirmation(e.target.value)} placeholder="Type RESET" className="w-full rounded-xl bg-zinc-900 border border-white/5 px-4 py-3 text-sm outline-none focus:border-red-500/50 transition-colors" />
            <div className="flex gap-3">
              <button onClick={() => setModal("none")} className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 transition-colors">Cancel</button>
              <button disabled={resetConfirmation !== "RESET"} onClick={handleResetWallet}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${resetConfirmation === "RESET" ? "bg-red-600 hover:bg-red-500 text-white shadow-lg" : "bg-zinc-900 text-zinc-600 cursor-not-allowed"}`}>
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="text-white hover:text-zinc-300 transition-colors p-2 -ml-2 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="w-8" />
      </div>

      <div className="space-y-4">
        

        <button onClick={() => openModal("seed")} disabled={!storedWallet?.mnemonic}
          className={`w-full py-4 px-5 font-bold rounded-2xl transition-all duration-300 text-left flex items-center justify-between shadow-lg ${storedWallet?.mnemonic ? "bg-zinc-900 border border-white/5 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:scale-[1.02] active:scale-[0.98]" : "bg-zinc-950 border border-white/5 text-zinc-600 cursor-not-allowed"}`}>
          <span className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export Seed Phrase
          </span>
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        <button onClick={() => openModal("privateKey")}
          className="w-full py-4 px-5 font-bold rounded-2xl transition-all duration-300 text-left flex items-center justify-between bg-red-950/30 border border-red-500/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg">
          <span className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            Export Private Key
          </span>
          <svg className="w-4 h-4 text-red-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        <button onClick={() => openModal("reset")}
          className="w-full py-4 px-5 font-bold rounded-2xl transition-all duration-300 text-left flex items-center justify-between bg-red-950/20 border border-red-500/10 text-red-400 hover:bg-red-900/30 hover:scale-[1.02] active:scale-[0.98] shadow-lg">
          <span className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Logout / Reset Wallet
          </span>
          <svg className="w-4 h-4 text-red-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <p className="mt-auto pt-8 text-center text-xs text-zinc-600 font-medium">PayNest • Sleek Focus</p>
    </div>
  );
}

export default Settings;
