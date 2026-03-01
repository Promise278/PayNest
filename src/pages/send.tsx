import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { parseEther } from "ethers";

function SendAssets() {
    const navigate = useNavigate();
    const { balance, wallet, refreshBalance } = useWallet();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
    const [error, setError] = useState("");
    const [txHash, setTxHash] = useState("");

    const handleSend = async () => {
        if (!recipient.startsWith("0x") || recipient.length < 42) {
            setError("Invalid recipient address");
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            setError("Invalid amount");
            return;
        }
        if (parseFloat(amount) > parseFloat(balance)) {
            setError("Insufficient balance");
            return;
        }
        if (!wallet) {
            setError("Wallet not connected");
            return;
        }

        setError("");
        setStatus('sending');

        try {
            const tx = await wallet.sendTransaction({
                to: recipient,
                value: parseEther(amount)
            });

            console.log("Transaction sent:", tx.hash);
            setTxHash(tx.hash);

            // Wait for 1 confirmation
            await tx.wait(1);

            setStatus('success');
            refreshBalance();
        } catch (err: any) {
            console.error("Transaction failed:", err);
            setError(err.reason || err.message || "Transaction failed");
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-full bg-black flex flex-col items-center justify-center p-6 animate-fade-in-up">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6 animate-logo-pulse">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center text-white">Payment Sent</h2>
                <p className="text-blue-400/70 text-center text-sm mb-8 px-4 font-mono">
                    {txHash.slice(0, 10)}...{txHash.slice(-10)}
                </p>

                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Amount</span>
                        <span className="text-white font-bold">{amount} ETH</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">To</span>
                        <span className="text-blue-400 font-mono text-sm">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span>
                    </div>
                </div>

                <div className="space-y-3 w-full">
                    <button
                        onClick={() => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank')}
                        className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-blue-400 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                        View on Etherscan
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-black flex flex-col p-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center mb-10">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="p-2 -ml-2 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-black ml-2 uppercase tracking-tight">Send Assets</h1>
            </div>

            <div className="flex-1 space-y-8">
                {/* Recipient Input */}
                <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Address</label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="Recipient address (0x...)"
                            className="w-full bg-neutral-900/50 border border-white/5 rounded-[1.25rem] px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 transition-all focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>
                </div>

                {/* Amount Input */}
                <div>
                    <div className="flex justify-between mb-3">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</label>
                        <span className="text-[10px] text-blue-400/70 font-black uppercase tracking-widest">Available: {parseFloat(balance).toFixed(4)} ETH</span>
                    </div>
                    <div className="relative group">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-neutral-900/50 border border-white/5 rounded-[1.25rem] px-5 py-5 text-white text-3xl font-black placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 transition-all focus:ring-4 focus:ring-blue-500/10"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <span className="text-sm font-black text-gray-500">ETH</span>
                            <button
                                onClick={() => setAmount(balance)}
                                className="text-blue-500 text-[10px] font-black hover:text-blue-400 px-3 py-1.5 bg-blue-500/10 rounded-lg transition-colors border border-blue-500/20"
                            >
                                MAX
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                disabled={status === 'sending' || !wallet}
                onClick={handleSend}
                className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 mt-10 shadow-2xl ${status === 'sending'
                        ? 'bg-blue-600/50 text-white/50 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
            >
                {status === 'sending' ? (
                    <>
                        <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending to Network...
                    </>
                ) : 'Confirm Transaction'}
            </button>
        </div>
    );
}

export default SendAssets;
