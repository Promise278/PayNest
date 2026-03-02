import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearWallet } from "../utils/wallet";
import { useWallet } from "../context/useWallet";

const WALLET_STORAGE_KEY = "paynest_wallet";

type StoredWallet = {
  address: string;
  mnemonic: string;
  createdAt?: number;
};

function Settings() {
  const navigate = useNavigate();
  const { logout } = useWallet();
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [seedConfirmation, setSeedConfirmation] = useState("");
  const [resetConfirmation, setResetConfirmation] = useState("");
  const [seedVisible, setSeedVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  const storedWallet = useMemo<StoredWallet | null>(() => {
    const rawWallet = localStorage.getItem(WALLET_STORAGE_KEY);
    if (!rawWallet) return null;

    try {
      return JSON.parse(rawWallet) as StoredWallet;
    } catch {
      return null;
    }
  }, []);

  const handleSeedExport = () => {
    setShowSeedModal(true);
    setSeedConfirmation("");
    setSeedVisible(false);
    setCopyStatus("");
  };

  const handleCopySeed = () => {
    if (!storedWallet?.mnemonic) return;
    navigator.clipboard.writeText(storedWallet.mnemonic);
    setCopyStatus("Seed phrase copied.");
    setTimeout(() => setCopyStatus(""), 2000);
  };

  const handleResetWallet = () => {
    clearWallet();
    localStorage.removeItem(WALLET_STORAGE_KEY);
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-full bg-black flex flex-col p-6 text-white">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-blue-400 transition-colors p-2 -ml-2 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="w-8" />
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-blue-400/90 mb-2">Wallet Address</p>
          <p className="text-sm break-all select-all">
            {storedWallet?.address ?? "No wallet found. Create or import a wallet first."}
          </p>
        </div>

        <button
          onClick={handleSeedExport}
          disabled={!storedWallet?.mnemonic}
          className={`w-full py-3.5 px-6 font-semibold rounded-xl transition-all duration-300
            ${storedWallet?.mnemonic
              ? "bg-white/5 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed opacity-60"
            }`
          }
        >
          Export Seed Phrase
        </button>

        <button
          onClick={() => {
            setShowResetModal(true);
            setResetConfirmation("");
          }}
          className="w-full py-3.5 px-6 font-semibold rounded-xl transition-all duration-300 bg-red-900/20 border border-red-500/30 text-red-300 hover:bg-red-800/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          Logout / Reset Wallet
        </button>
      </div>

      {showSeedModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-20">
          <div className="w-full rounded-xl border border-white/10 bg-neutral-900 p-5">
            <h2 className="text-lg font-semibold mb-2">Secure Confirmation</h2>
            <p className="text-sm text-gray-300 mb-4">
              Type <span className="font-semibold text-white">EXPORT</span> to reveal your seed phrase.
            </p>
            <input
              value={seedConfirmation}
              onChange={(event) => setSeedConfirmation(event.target.value)}
              placeholder="Type EXPORT"
              className="w-full rounded-lg bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            {seedVisible && storedWallet?.mnemonic && (
              <div className="mt-4 p-3 rounded-lg bg-black border border-blue-500/30">
                <p className="text-xs text-blue-400 mb-1">Seed Phrase</p>
                <p className="text-sm break-words select-all">{storedWallet.mnemonic}</p>
                <button
                  onClick={handleCopySeed}
                  className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                >
                  Copy Seed Phrase
                </button>
                {copyStatus && <p className="text-xs text-green-400 mt-1">{copyStatus}</p>}
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowSeedModal(false)}
                className="flex-1 py-2 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                disabled={seedConfirmation !== "EXPORT"}
                onClick={() => setSeedVisible(true)}
                className={`flex-1 py-2 rounded-lg font-semibold ${seedConfirmation === "EXPORT"
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Confirm Export
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-20">
          <div className="w-full rounded-xl border border-red-500/30 bg-neutral-900 p-5">
            <h2 className="text-lg font-semibold mb-2 text-red-300">Reset Wallet</h2>
            <p className="text-sm text-gray-300 mb-4">
              This will remove wallet data from this device. Type <span className="font-semibold text-white">RESET</span> to continue.
            </p>
            <input
              value={resetConfirmation}
              onChange={(event) => setResetConfirmation(event.target.value)}
              placeholder="Type RESET"
              className="w-full rounded-lg bg-black border border-white/20 px-3 py-2 text-sm outline-none focus:border-red-500"
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                disabled={resetConfirmation !== "RESET"}
                onClick={handleResetWallet}
                className={`flex-1 py-2 rounded-lg font-semibold ${resetConfirmation === "RESET"
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
