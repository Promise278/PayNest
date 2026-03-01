import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "ethers";

function CreateWallet() {
    const navigate = useNavigate();
    const [mnemonic, setMnemonic] = useState<string[]>([]);
    const [isRevealed, setIsRevealed] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Generate a random wallet and extract the 12-word seed phrase
        const wallet = Wallet.createRandom();
        if (wallet.mnemonic) {
            setMnemonic(wallet.mnemonic.phrase.split(" "));
        }
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(mnemonic.join(" "));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-full bg-black flex flex-col p-6 relative">
            <div className="flex items-center mb-8">
                <button
                    onClick={() => navigate("/")}
                    className="text-white hover:text-blue-400 transition-colors p-2 -ml-2 rounded-full"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold ml-2 text-white">Create Wallet</h1>
            </div>

            <div className="flex-1 flex flex-col items-center">
                <p className="text-gray-400 text-center text-sm mb-6">
                    Write down these 12 words in order and keep them somewhere safe. Anyone with this phrase can access your funds.
                </p>

                {/* Seed Phrase Container */}
                <div className="relative w-full mb-6">
                    <div className="grid grid-cols-3 gap-3">
                        {mnemonic.map((word, index) => (
                            <div
                                key={index}
                                className={`bg-white/5 border border-white/10 rounded-lg p-2 text-center flex flex-col items-center transition-all duration-300 ${!isRevealed ? "blur-[6px] opacity-70" : "blur-0 opacity-100"
                                    }`}
                            >
                                <span className="text-xs text-blue-500/70 mb-1">{index + 1}</span>
                                <span className="text-white font-medium text-sm select-all">{word || '...'}</span>
                            </div>
                        ))}
                    </div>

                    {/* Blur Overlay & Reveal Button */}
                    {!isRevealed && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                            <svg className="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            <button
                                onClick={() => setIsRevealed(true)}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                            >
                                Reveal Seed Phrase
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-3 mt-auto mb-4">
                    <button
                        onClick={handleCopy}
                        disabled={!isRevealed}
                        className={`w-full py-3.5 px-6 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2
              ${isRevealed
                                ? "bg-white/5 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:scale-[1.02] active:scale-[0.98]"
                                : "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed opacity-50"
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy to Clipboard
                            </>
                        )}
                    </button>

                    <button
                        disabled={!isRevealed}
                        className={`w-full py-3.5 px-6 font-semibold rounded-xl transition-all duration-300
              ${isRevealed
                                ? "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        I saved my seed phrase
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateWallet;
