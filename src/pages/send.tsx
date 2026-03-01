import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SendAssets() {
    const navigate = useNavigate();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
    const [error, setError] = useState("");

    const handleSend = () => {
        if (!recipient.startsWith("0x") || recipient.length < 42) {
            setError("Invalid recipient address");
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            setError("Invalid amount");
            return;
        }

        setError("");
        setStatus('sending');

        
        setTimeout(() => {
            setStatus('success');
        }, 2000);
    };

    if (status === 'success') {
        return (
            <div className="min-h-full bg-black flex flex-col items-center justify-center p-6 animate-fade-in-up">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6 animate-logo-pulse">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Transfer Successful</h2>
                <p className="text-gray-400 text-center mb-8">
                    Your {amount} ETH has been sent to {recipient.slice(0, 6)}...{recipient.slice(-4)}
                </p>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

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
                <h1 className="text-xl font-bold ml-2">Send Assets</h1>
            </div>

            <div className="flex-1 space-y-6">
                {/* Recipient Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Address</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 text-xs font-bold hover:text-blue-300">PASTE</button>
                    </div>
                </div>

                {/* Amount Input */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-400">Amount</label>
                        <span className="text-xs text-blue-400/70 font-medium">Balance: 1.245 ETH</span>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-2xl font-bold placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-500">ETH</span>
                            <button className="text-blue-400 text-xs font-bold hover:text-blue-300 ml-2">MAX</button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                disabled={status === 'sending'}
                onClick={handleSend}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 mt-auto ${status === 'sending'
                        ? 'bg-blue-600/50 text-white/50 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98]'
                    }`}
            >
                {status === 'sending' ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                    </>
                ) : 'Send Transfer'}
            </button>
        </div>
    );
}

export default SendAssets;
