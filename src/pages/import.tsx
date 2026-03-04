import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { Mnemonic } from "ethers";

function ImportWallet() {
    const navigate = useNavigate();
    const { saveNewWallet, connectWallet } = useWallet();
    const [step, setStep] = useState(1);
    const [mnemonic, setMnemonic] = useState(Array(12).fill(""));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleMnemonicChange = (index: number, value: string) => {
        const newMnemonic = [...mnemonic];
        // Handle paste of full mnemonic
        if (value.includes(" ")) {
            const words = value.trim().split(/\s+/);
            if (words.length === 12) {
                setMnemonic(words);
                return;
            }
        }
        newMnemonic[index] = value.trim().toLowerCase();
        setMnemonic(newMnemonic);
    };

    const validateMnemonic = () => {
        const phrase = mnemonic.join(" ");
        if (mnemonic.some(word => !word)) {
            setError("Please fill in all 12 words");
            return false;
        }
        if (!Mnemonic.isValidMnemonic(phrase)) {
            setError("Invalid mnemonic phrase. Please check the words.");
            return false;
        }
        return true;
    };

    const nextStep = () => {
        if (step === 1) {
            if (validateMnemonic()) {
                setError("");
                setStep(2);
            }
        }
    };

    const handleImport = async () => {
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsSaving(true);
        setError("");
        try {
            const phrase = mnemonic.join(" ");
            await saveNewWallet(phrase, password);
            await connectWallet(password);
            navigate("/dashboard");
        } catch (err) {
            const e = err as { message?: string };
            setError(e.message || "Failed to import wallet");
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-full bg-black flex flex-col p-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button
                    onClick={() => step === 1 ? navigate("/") : setStep(1)}
                    className="p-2 -ml-2 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold ml-2">Import Wallet</h1>
            </div>

            {step === 1 ? (
                /* Step 1: Mnemonic Input */
                <div className="flex-1 flex flex-col">
                    <p className="text-gray-400 text-sm mb-8">
                        Enter your 12-word recovery phrase to restore your wallet.
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {mnemonic.map((word, i) => (
                            <div key={i} className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 font-bold">{i + 1}</span>
                                <input
                                    type="text"
                                    value={word}
                                    onChange={(e) => handleMnemonicChange(i, e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-6 pr-2 py-3 text-white text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-xs mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">{error}</p>}

                    <button
                        onClick={nextStep}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 mt-auto"
                    >
                        Continue
                    </button>
                </div>
            ) : (
                /* Step 2: Password Setup */
                <div className="flex-1 flex flex-col">
                    <p className="text-gray-400 text-sm mb-8">
                        Create a secure password to encrypt your recovery phrase on this device.
                    </p>

                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat password"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">{error}</p>}

                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-3 mb-8">
                        <div className="text-blue-500 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="text-xs text-blue-200/60 leading-relaxed">
                            This password is required to unlock your wallet. PayNest cannot recover it for you.
                        </p>
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={isSaving}
                        className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 mt-auto shadow-lg ${isSaving
                            ? 'bg-blue-600/50 text-white/50 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                            }`}
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Importing...
                            </>
                        ) : 'Import Wallet'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default ImportWallet;
