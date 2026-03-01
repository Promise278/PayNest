import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReceiveAssets() {
    const navigate = useNavigate();
    const [address] = useState("0x71C249612833931f75191c55CCad292dcf303f4E"); // Mock address
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}&bgcolor=ffffff&color=2563eb`;

    return (
        <div className="min-h-full bg-black flex flex-col p-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="p-2 -ml-2 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold ml-2">Receive Assets</h1>
            </div>

            <div className="flex-1 flex flex-col items-center">
                <p className="text-gray-400 text-center text-sm mb-8 px-4">
                    Scan this QR code or copy the address below to receive ETH on the Ethereum network.
                </p>

                {/* QR Code Container */}
                <div className="relative p-6 rounded-3xl bg-white mb-8 shadow-2xl shadow-blue-600/20">
                    <img
                        src={qrCodeUrl}
                        alt="Wallet QR Code"
                        className="w-48 h-48"
                    />
                    <div className="absolute inset-0 border-[12px] border-white rounded-3xl pointer-events-none" />
                </div>

                {/* Address Container */}
                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-blue-400 mb-2">Your Wallet Address</label>
                    <p className="text-white font-medium break-all text-sm leading-relaxed mb-4">
                        {address}
                    </p>
                    <button
                        onClick={handleCopy}
                        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${copied
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20"
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied to Clipboard
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy Address
                            </>
                        )}
                    </button>
                </div>

                {/* Warning Card */}
                <div className="w-full p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                    <div className="text-blue-500 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-xs text-blue-200/60 leading-relaxed">
                        Only send <span className="text-blue-400 font-semibold">Ethereum (ETH)</span> to this address. Sending other assets may result in permanent loss.
                    </p>
                </div>
            </div>

            <button
                onClick={() => navigate("/dashboard")}
                className="mt-8 w-full py-4 text-gray-500 font-semibold text-sm hover:text-white transition-colors"
            >
                Back to Dashboard
            </button>
        </div>
    );
}

export default ReceiveAssets;
