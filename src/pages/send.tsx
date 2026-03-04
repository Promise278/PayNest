import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { parseEther } from "ethers";
import type { Transaction } from "../utils/transactions";

function SendAssets() {
    const navigate = useNavigate();
    const { balance, wallet, refreshBalance, addTransaction, activeNetwork, address } = useWallet();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
    const [error, setError] = useState("");
    const [txHash, setTxHash] = useState("");

    const handleSend = async () => {
        if (!recipient.startsWith("0x") || recipient.length < 42) { setError("Invalid recipient address"); return; }
        if (!amount || parseFloat(amount) <= 0) { setError("Invalid amount"); return; }
        if (parseFloat(amount) > parseFloat(balance)) { setError("Insufficient balance"); return; }
        if (!wallet) { setError("Wallet not connected"); return; }

        setError("");
        setStatus("sending");

        try {
            const tx = await wallet.sendTransaction({ to: recipient, value: parseEther(amount) });
            setTxHash(tx.hash);
            await tx.wait(1);

            const record: Transaction = {
                hash: tx.hash,
                type: "sent",
                amount,
                to: recipient,
                from: address || undefined,
                timestamp: Date.now(),
                network: activeNetwork.id,
                status: "confirmed",
            };
            addTransaction(record);
            setStatus("success");
            refreshBalance();
        } catch (err) {
            const e = err as { reason?: string; message?: string };
            setError(e.reason || e.message || "Transaction failed");
            setStatus("idle");
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-full bg-black flex flex-col items-center justify-center p-6 animate-fade-in-up">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-inner">
                    <svg className="w-10 h-10 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center text-white">Payment Sent!</h2>
                <p className="text-zinc-500 text-center text-sm mb-8 px-4 font-mono">{txHash.slice(0, 10)}...{txHash.slice(-10)}</p>

                <div className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-6 mb-8">
                    <div className="flex justify-between mb-4">
                        <span className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Amount</span>
                        <span className="text-white font-bold">{amount} {activeNetwork.symbol}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">To</span>
                        <span className="text-zinc-300 font-mono text-sm">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Network</span>
                        <span className="text-zinc-300 text-sm">{activeNetwork.shortName}</span>
                    </div>
                </div>

                <div className="space-y-3 w-full">
                    <button
                        onClick={() => window.open(`${activeNetwork.explorerUrl}/tx/${txHash}`, "_blank")}
                        className="w-full py-4 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                        View on {activeNetwork.explorerName}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </button>
                    <button onClick={() => navigate("/dashboard")} className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98]">
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-black flex flex-col p-6 animate-fade-in-up">
            <div className="flex items-center mb-10">
                <button onClick={() => navigate("/dashboard")} className="p-2 -ml-2 rounded-full text-zinc-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="ml-2">
                    <h1 className="text-xl font-black uppercase tracking-tight text-white">Send Assets</h1>
                    <p className="text-xs text-zinc-500">{activeNetwork.shortName}</p>
                </div>
            </div>

            <div className="flex-1 space-y-8">
                <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Recipient Address</label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all font-mono text-sm"
                    />
                </div>
                <div>
                    <div className="flex justify-between mb-3">
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Amount</label>
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Available: {parseFloat(balance).toFixed(4)} {activeNetwork.symbol}</span>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-5 py-5 text-white text-3xl font-black placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <span className="text-sm font-black text-zinc-500">{activeNetwork.symbol}</span>
                            <button
                                onClick={() => setAmount(balance)}
                                className="text-black text-[10px] font-black bg-white hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                MAX
                            </button>
                        </div>
                    </div>
                </div>
                {error && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}
            </div>

            <button
                disabled={status === "sending" || !wallet}
                onClick={handleSend}
                className={`w-full py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 mt-10 shadow-2xl ${status === "sending" ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-white hover:bg-zinc-200 text-black shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
                    }`}
            >
                {status === "sending" ? (
                    <>
                        <svg className="animate-spin h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending to Network…
                    </>
                ) : "Confirm Transaction"}
            </button>
        </div>
    );
}

export default SendAssets;
