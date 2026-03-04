import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

function ReceiveAssets() {
    const navigate = useNavigate();
    const { address, activeNetwork } = useWallet();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const qrCodeUrl = address
        ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${address}&bgcolor=000000&color=3b82f6&margin=15`
        : "";

    return (
        <div className="min-h-full bg-black flex flex-col p-6 animate-fade-in-up">
            <div className="flex items-center mb-8">
                <button onClick={() => navigate("/dashboard")} className="p-2 -ml-2 rounded-full text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="ml-2">
                    <h1 className="text-xl font-bold">Receive Assets</h1>
                    <p className="text-xs text-gray-500">{activeNetwork.shortName}</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center">
                <p className="text-gray-400 text-center text-xs mb-8 px-4 leading-relaxed">
                    Scan this QR code or copy the address below to receive{" "}
                    <span className="text-blue-400 font-bold">{activeNetwork.symbol}</span> on{" "}
                    <span className="text-blue-400 font-bold">{activeNetwork.name}</span>.
                </p>

                <div className="relative p-5 rounded-3xl bg-white mb-8 shadow-2xl shadow-blue-600/20">
                    {address ? (
                        <img src={qrCodeUrl} alt="Wallet QR Code" className="w-48 h-48 block" />
                    ) : (
                        <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-blue-500 mb-3">
                        Your {activeNetwork.shortName} Address
                    </label>
                    <p className="text-white font-mono break-all text-xs leading-relaxed mb-5 bg-white/5 p-3 rounded-lg border border-white/5 select-all">
                        {address || "Loading..."}
                    </p>
                    <button
                        onClick={handleCopy}
                        disabled={!address}
                        className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${copied
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                            }`}
                    >
                        {copied ? (
                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</>
                        ) : (
                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy Address</>
                        )}
                    </button>
                </div>

                {activeNetwork.isTestnet && (
                    <div className="w-full p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex gap-4">
                        <div className="text-orange-500 shrink-0 mt-0.5">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <p className="text-[11px] text-orange-200/60 leading-relaxed">
                            <span className="text-orange-400 font-bold">{activeNetwork.name}:</span> Do not send real assets to this address.
                        </p>
                    </div>
                )}
            </div>

            <button onClick={() => navigate("/dashboard")} className="mt-6 py-2 text-gray-500 font-bold text-xs hover:text-white transition-colors uppercase tracking-widest">
                Return to Home
            </button>
        </div>
    );
}

export default ReceiveAssets;
